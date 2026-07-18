# mcp-server

MCP-server (Hono + mcp-lite, Streamable HTTP) met tools voor het
B2BGroeiMachine-platform. Auth via `mcp_api_keys`: stuur de key als
`x-api-key`-header of `Authorization: Bearer <key>`.

Naast de bestaande blog-, content-, SEO- en bucket-tools bevat de server elf
**GTM Runtime-tools** (`rt-tools.ts`) voor de Rebel Force `rt_*`-laag. Alle
runtime-tools accepteren `tenant` als organisatie-**slug of -naam** (resolved
naar `gp_organizations.id`; onbekende tenant → error met beschikbare slugs),
gebruiken de service-role client, geven errors als gestructureerde JSON en
loggen naar `rt_audit_logs` (actor_type `system`).

Vereiste env naast de standaard Supabase-vars: `RT_INTERNAL_TOKEN` (gedeeld
met `rt-execute-skill`; nodig voor `execute_skill`).

## Key-scoping (`mcp_api_keys.tool_scope`)

| Scope | Betekenis |
|---|---|
| `internal` (default) | Alle tools, vrije tenant-keuze. Rebel Force-keys. |
| `tenant` | Ziet `get_run_status`, `list_pending_approvals`, `decide_approval`, `get_tenant_costs`, `get_snapshot`, `get_daily_brief`, `get_telemetry` en `execute_skill` (uitsluitend skills met `tenant_callable=true`, met dag-limiet). De `tenant`-parameter wordt **genegeerd** en server-side vervangen door de `organization_id` van de key; id-based lookups van andere tenants geven `not_found`. Geen `start_workflow_run`, geen provisioning en geen site/SEO/blog-tools — die tools bestaan niet op de tenant-server, dus ook `tools/list` toont ze niet. Elke call wordt in `rt_audit_logs` gelogd met de key-naam. |

Een `tenant`-scoped key vereist een `organization_id` (CHECK-constraint) en
wordt anders geweigerd bij validatie. De dag-limiet voor tenant
`execute_skill`-calls komt uit `rt_tenant_playbooks.config.limits.daily_tenant_skill_calls`
(default 25), geteld via `rt_audit_logs` action `tenant_skill_call`; bij
overschrijding volgt een nette error met `remaining: 0`.

## Runtime-tools

| Tool | Scope | Doet |
|---|---|---|
| `start_workflow_run` | internal | Valideert input tegen het playbook-`input_schema` en maakt `rt_workflow_runs` + `rt_step_runs` aan (alles `queued`). De runner die queued runs uitvoert is Sprint 2. |
| `get_run_status` | beide | Run + alle step runs (status, provider, cost, latency), totale kosten en openstaande approvals. |
| `list_pending_approvals` | beide | Alle pending approvals met type, payload-samenvatting (max ~500 tekens) en run-context; zonder `tenant` over alle tenants (internal). |
| `decide_approval` | beide | Beslist een approval (`approved` / `rejected` / `revision_required`), werkt step run + workflow run bij conform het statusmodel en logt `approval_decided`. |
| `execute_skill` | beide* | Voert één skill uit via `rt-execute-skill` (interne token); retourneert het volledige SkillExecutionResult incl. `snapshot_id`/`cached`. `force_refresh` slaat de snapshot-cache over. *Tenant-keys: alleen `tenant_callable`-skills + dag-limiet + audit `tenant_skill_call`. |
| `get_tenant_costs` | beide | Aggregatie op `rt_provider_calls`: totaal + per provider + per skill, met aantal calls, success-rate en gemiddelde latency. Default: huidige maand. |
| `get_snapshot` | beide | Snapshot op id: metadata (skill, provider, created_at, row_count, expires_at) + payload (inline of uit Storage). |
| `get_daily_brief` | beide | Ochtend-aggregatie: nieuwe signalen (24u), deze week opgewarmde accounts, open approvals, actieve runs, maandkosten, open service requests, max 4 telemetrie-regels en een kort NL `focus`-veld. |
| `get_telemetry` | beide | Componeert het dashboard-DATA-object (pipedrive/heyreach/apollo/planable/staroids/salescycle/winloss/herkomst/monthly) uit de laatste verse snapshots, met `snapshot_dates` en `stale` (>26u) per blok; ontbrekend blok => null met reden. |
| `provision_tenant` | internal | Maakt `gp_organizations` + `rt_tenant_playbooks` (template `standard_b2b_outbound`: outbound_market_activation v1.0.0, approvals aan, auto_launch uit, daily_contact_limit 50, daily_tenant_skill_calls 25, telemetry uit) + onboarding-project met taken. Retourneert de checklist: te zetten Vault-secrets en de aan te maken tenant-key. |
| `set_tenant_context` | internal | Schrijft de ICP-context naar `gp_icps` en merge't `icp_context`/`propositions`/`tone_of_voice`/`exclusions` in `rt_tenant_playbooks.config.context`. Vorige waarden blijven bewaard in `rt_audit_logs` (action `context_updated`). |

## Voorbeeld-calls

MCP tool-calls via JSON-RPC (Streamable HTTP endpoint van de function):

```bash
MCP_URL="https://<project-ref>.supabase.co/functions/v1/mcp-server"

# Workflow run starten
curl -sS -X POST "$MCP_URL" \
  -H "x-api-key: $MCP_API_KEY" -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"start_workflow_run","arguments":{
    "tenant": "core-vision",
    "playbook_key": "outbound_market_activation",
    "input": { "country": "NL", "industries": ["machinebouw"], "roles": ["CTO"], "target_count": 100 }
  }}}'

# Status van een run
curl -sS -X POST "$MCP_URL" \
  -H "x-api-key: $MCP_API_KEY" -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_run_status","arguments":{
    "run_id": "5f0a4c8e-1111-4222-8333-444455556666"
  }}}'

# Openstaande approvals + beslissen
curl -sS -X POST "$MCP_URL" \
  -H "x-api-key: $MCP_API_KEY" -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"list_pending_approvals","arguments":{"tenant":"core-vision"}}}'

curl -sS -X POST "$MCP_URL" \
  -H "x-api-key: $MCP_API_KEY" -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"decide_approval","arguments":{
    "approval_id": "7c1b2d3e-aaaa-4bbb-8ccc-dddd11112222",
    "decision": "approved",
    "notes": "Lijst ziet er goed uit"
  }}}'

# Losse skill uitvoeren
curl -sS -X POST "$MCP_URL" \
  -H "x-api-key: $MCP_API_KEY" -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"execute_skill","arguments":{
    "tenant": "core-vision",
    "skill_key": "verify_email",
    "input": { "emails": ["jan@voorbeeld.nl"] }
  }}}'

# Kosten van de huidige maand
curl -sS -X POST "$MCP_URL" \
  -H "x-api-key: $MCP_API_KEY" -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":6,"method":"tools/call","params":{"name":"get_tenant_costs","arguments":{"tenant":"core-vision"}}}'

# Nieuwe tenant provisionen (internal key)
curl -sS -X POST "$MCP_URL" \
  -H "x-api-key: $MCP_API_KEY" -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":7,"method":"tools/call","params":{"name":"provision_tenant","arguments":{
    "name": "Acme Machinebouw B.V.",
    "slug": "acme-machinebouw",
    "template_key": "standard_b2b_outbound"
  }}}'

# Daily brief voor de ochtendsessie (tenant- of internal key)
curl -sS -X POST "$MCP_URL" \
  -H "x-api-key: $MCP_API_KEY" -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":9,"method":"tools/call","params":{"name":"get_daily_brief","arguments":{"tenant":"core-vision"}}}'

# Telemetrie-DATA voor het dashboard
curl -sS -X POST "$MCP_URL" \
  -H "x-api-key: $MCP_API_KEY" -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":10,"method":"tools/call","params":{"name":"get_telemetry","arguments":{"tenant":"core-vision"}}}'

# Skill met verse data (cache overslaan)
curl -sS -X POST "$MCP_URL" \
  -H "x-api-key: $MCP_API_KEY" -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":11,"method":"tools/call","params":{"name":"execute_skill","arguments":{
    "tenant": "core-vision",
    "skill_key": "search_companies",
    "input": { "country": "NL", "target_count": 25 },
    "force_refresh": true
  }}}'

# ICP-context zetten (internal key)
curl -sS -X POST "$MCP_URL" \
  -H "x-api-key: $MCP_API_KEY" -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":8,"method":"tools/call","params":{"name":"set_tenant_context","arguments":{
    "tenant": "acme-machinebouw",
    "icp_context": "RELEVANT: MKB machinebouw 20-500 fte in NL/BE. RUIS: distributeurs en detacheerders.",
    "tone_of_voice": "Nuchter, technisch onderlegd, geen superlatieven"
  }}}'
```
