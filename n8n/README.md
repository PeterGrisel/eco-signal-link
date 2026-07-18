# n8n workflows — GTM Runtime skills

Importeerbare n8n-workflows die de `n8n_webhook`-skills van de Rebel Force GTM
Runtime implementeren. Elke workflow is bewust dun: **Webhook in → Code node
(Apollo via `this.helpers.httpRequest`, conform de `n8n-apollo-code-patterns`)
→ Respond**. Input en output volgen exact de schemas uit `rt_skill_versions`.

| Workflow | Skill | Apollo endpoint |
|---|---|---|
| `rt-search-companies.json` | `search_companies` v1.0.0 | `POST /v1/mixed_companies/search` (met pagination, hard cap 20 pagina's) |
| `rt-find-contacts.json` | `find_contacts` v1.0.0 | `POST /v1/mixed_people/search` |

## Credentials

De Apollo **Master** API key komt uit de n8n-omgeving: zet `APOLLO_API_KEY`
als environment variable op de n8n-instance (of vervang de placeholder
`<APOLLO_API_KEY>` in de Code node vanuit de n8n credential store). De key
komt **nooit** uit de inkomende payload — `rt-execute-skill` stuurt alleen een
`credential_reference` (vault://-string) mee, die deze workflows negeren.

## Vault-secrets (webhook-URLs)

De executor resolvet de webhook-URL per skill uit Supabase Vault. Na import en
activatie van de workflows de **production** webhook-URLs opslaan als:

| Vault-secret (name) | Waarde |
|---|---|
| `n8n/search-companies` | `https://<n8n-host>/webhook/rt-search-companies` |
| `n8n/find-contacts` | `https://<n8n-host>/webhook/rt-find-contacts` |

Deze namen corresponderen met de `implementation.url_secret`-referenties
`vault://n8n/search-companies` en `vault://n8n/find-contacts` in
`rt_skill_versions`. Aanmaken kan via SQL:

```sql
select vault.create_secret('https://<n8n-host>/webhook/rt-search-companies', 'n8n/search-companies');
select vault.create_secret('https://<n8n-host>/webhook/rt-find-contacts', 'n8n/find-contacts');
```

De URL is zelf het geheim — deel hem nergens en roteer (nieuwe webhook-path)
bij een lek.

## Setup-checklist

1. Beide JSON-bestanden importeren in n8n (Workflows → Import from File).
2. `APOLLO_API_KEY` zetten op de instance (env var of credential store).
3. Workflows activeren; test met "Execute Workflow" + een test-POST.
4. Production webhook-URLs in Vault zetten (tabel hierboven).
5. Testcall via de executor: `execute_skill(tenant, "search_companies", {country: "NL", target_count: 5})`.

## Foutafhandeling

Bij een fout retourneert de Code node `{ error: { code, message, retryable } }`
in plaats van het schema-object. De executor keurt dat af tegen het
`output_schema` en markeert de step als `failed` (`output_validation_failed`)
— de foutdetails zijn dan terug te vinden in `rt_provider_calls`.
Rate limits (429) en 5xx worden als `retryable: true` gemarkeerd.
