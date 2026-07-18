# rt-execute-skill

Centrale skill-executor van de Rebel Force GTM Runtime (`rt_*`-laag). Voert één
skill uit voor één tenant: valideert input, kiest een provider, resolvet
credentials uit Vault, dispatcht naar n8n of een Edge Function, valideert de
output en logt alles in `rt_provider_calls` / `rt_step_runs`.

Datamodel: `supabase/migrations/20260718090000_rt_gtm_runtime_v0_1.sql`.
Vault-helper: `supabase/migrations/20260718090100_rt_resolve_secret.sql`
(`public.rt_resolve_secret(name)`, alleen `service_role`).

## Contract

**Input** (POST, JSON):

```json
{
  "tenantId": "uuid (gp_organizations.id)",
  "skillKey": "verify_email",
  "skillVersion": "1.0.0 (optioneel; default = hoogste actieve versie)",
  "input": { "...": "moet voldoen aan rt_skill_versions.input_schema" },
  "workflowRunId": "uuid (optioneel)",
  "stepRunId": "uuid (optioneel; activeert idempotency + rt_step_runs-updates)"
}
```

**Output**:

```json
{
  "status": "succeeded | failed",
  "skillKey": "verify_email",
  "skillVersion": "1.0.0",
  "provider": "apollo",
  "data": { "resultaat, gevalideerd tegen output_schema": "..." },
  "confidence": 0.92,
  "cost": 0.03,
  "latencyMs": 1840,
  "error": { "code": "provider_timeout", "message": "...", "retryable": true }
}
```

`error` is alleen aanwezig bij `status: "failed"`. `retryable` geeft aan of de
orchestrator de step opnieuw mag proberen (timeouts, 429, 5xx, netwerkfouten →
`true`; validatie- en configuratiefouten → `false`).

## Flow

1. Tenant-check (`gp_organizations`, status `active`)
2. Skill-versie (`rt_skill_versions`, status `active`; default hoogste versie)
3. Input-validatie tegen `input_schema`
4. Provider-selectie via `rt_provider_routes`: tenant-voorkeur uit
   `rt_tenant_playbooks.config` > laagste `priority` > `is_active` + provider
   status `active`
5. Credential: tenant-record in `rt_provider_credentials` eerst, anders
   platform-record (`organization_id IS NULL`); secret via Vault-RPC
6. Dispatch op `implementation.type` (`n8n_webhook` of
   `supabase_edge_function`) met timeout uit `timeout_seconds`
7. Output-validatie tegen `output_schema` (mismatch → `failed`, niet retryable)
8. Logging in `rt_provider_calls` + update `rt_step_runs` (bij `stepRunId`)
9. Idempotency: `stepRunId` met status `succeeded` en identieke `input_hash`
   (SHA-256 over canonieke JSON van skill+versie+input) → eerdere output terug,
   response bevat dan `"idempotent": true`

## Conventies

- **Tenant-provider-voorkeur** in `rt_tenant_playbooks.config`:
  `{"provider_preferences": {"sync_crm": "hubspot"}}` (string of array; eerste
  beschikbare wint).
- **Provider-payload**: de downstream webhook/functie ontvangt
  `{ tenantId, skillKey, skillVersion, input, credential, context }`. Het
  `credential`-veld is de gedecrypte tenant- of platform-secret (of `null`).
- **Provider-response**: óf een envelope `{ "data": ..., "confidence"?: n,
  "cost"?: n }`, óf een kaal object dat zelf de data is. `data` wordt
  gevalideerd tegen `output_schema`; ontbreekt `cost`, dan valt de executor
  terug op `rt_skill_versions.estimated_cost`.
- **Geen secrets in logs**: `rt_provider_calls.endpoint` bevat de
  vault-referentie of function-naam, nooit de geresolvede URL of key;
  fetch-foutmeldingen worden vervangen door generieke teksten.
- **JSON Schema-validatie**: Ajv gebruikt runtime-codegeneratie
  (`new Function`) en werkt niet in de Supabase Edge Runtime. `lib.ts` bevat
  daarom een pure validator voor de gebruikte subset: `type` (incl.
  type-arrays), `required`, `properties`, `additionalProperties`, `items`,
  `enum`, `minimum`, `maximum`.

## Foutcodes

| Code | Retryable | Betekenis |
|---|---|---|
| `invalid_request` | nee | Body/velden ongeldig |
| `tenant_not_found` / `tenant_inactive` | nee | Tenant onbekend of niet actief |
| `skill_not_found` / `skill_version_not_found` | nee | Skill(-versie) onbekend of niet actief |
| `input_validation_failed` | nee | Input matcht `input_schema` niet |
| `no_provider_available` | ja | Geen actieve route/provider |
| `secret_resolution_failed` / `invalid_secret_reference` | nee | Vault-referentie faalt |
| `provider_timeout` | ja | Timeout (`timeout_seconds`) |
| `provider_rate_limited` | ja | HTTP 429 van provider |
| `provider_error` | 5xx: ja | Niet-2xx van provider |
| `provider_unreachable` / `provider_invalid_response` | ja | Netwerk/parse-fout |
| `output_validation_failed` | nee | Output matcht `output_schema` niet |
| `step_run_not_found` / `step_run_tenant_mismatch` | nee | `stepRunId` ongeldig |
| `internal_error` | ja | Onverwachte executor-fout |

## Voorbeeld-curl

```bash
curl -sS -X POST "https://<project-ref>.supabase.co/functions/v1/rt-execute-skill" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "0b7e1a52-9f6e-4b1c-8f0d-2f9f8a3f6c1e",
    "skillKey": "verify_email",
    "input": { "emails": ["jan@voorbeeld.nl", "info@acme.io"] }
  }'
```

Met workflow-context en idempotency:

```bash
curl -sS -X POST "https://<project-ref>.supabase.co/functions/v1/rt-execute-skill" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "0b7e1a52-9f6e-4b1c-8f0d-2f9f8a3f6c1e",
    "skillKey": "search_companies",
    "skillVersion": "1.0.0",
    "input": { "country": "NL", "industries": ["machinebouw"], "target_count": 50 },
    "workflowRunId": "5f0a4c8e-1111-4222-8333-444455556666",
    "stepRunId": "7c1b2d3e-aaaa-4bbb-8ccc-dddd11112222"
  }'
```

## Tests

Pure functies (validatie, routing, hashing, parsing) staan in `lib.ts` en zijn
gedekt door `lib.test.ts`:

```bash
deno test supabase/functions/rt-execute-skill/lib.test.ts
```
