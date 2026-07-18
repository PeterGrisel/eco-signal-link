# mcp-server

MCP-server (Hono + mcp-lite, Streamable HTTP) met tools voor het
B2BGroeiMachine-platform. Auth via `mcp_api_keys`: stuur de key als
`x-api-key`-header of `Authorization: Bearer <key>`.

Naast de bestaande blog-, content-, SEO- en bucket-tools bevat de server zes
**GTM Runtime-tools** (`rt-tools.ts`) voor de Rebel Force `rt_*`-laag. Alle
runtime-tools accepteren `tenant` als organisatie-**slug of -naam** (resolved
naar `gp_organizations.id`; onbekende tenant → error met beschikbare slugs),
gebruiken de service-role client, geven errors als gestructureerde JSON en
loggen naar `rt_audit_logs` (actor_type `system`).

Vereiste env naast de standaard Supabase-vars: `RT_INTERNAL_TOKEN` (gedeeld
met `rt-execute-skill`; nodig voor `execute_skill`).

## Runtime-tools

| Tool | Doet |
|---|---|
| `start_workflow_run` | Valideert input tegen het playbook-`input_schema` en maakt `rt_workflow_runs` + `rt_step_runs` aan (alles `queued`). De runner die queued runs uitvoert is Sprint 2. |
| `get_run_status` | Run + alle step runs (status, provider, cost, latency), totale kosten en openstaande approvals. |
| `list_pending_approvals` | Alle pending approvals met type, payload-samenvatting (max ~500 tekens) en run-context; zonder `tenant` over alle tenants. |
| `decide_approval` | Beslist een approval (`approved` / `rejected` / `revision_required`), werkt step run + workflow run bij conform het statusmodel en logt `approval_decided`. |
| `execute_skill` | Voert één skill uit via `rt-execute-skill` (met de interne token) en geeft het volledige SkillExecutionResult terug. |
| `get_tenant_costs` | Aggregatie op `rt_provider_calls`: totaal + per provider + per skill, met aantal calls, success-rate en gemiddelde latency. Default: huidige maand. |

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
```
