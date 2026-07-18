# Telemetrie — skills, sync en dashboard

De telemetrie-laag ververst dagelijks snapshots uit de commerciële tools en
serveert die aan het dashboard (`/app/telemetry`), de MCP-tools
(`get_telemetry`, `get_daily_brief`) en de klant-Claude.

## Vijf telemetrie-skills

Allemaal categorie `telemetry`, `tenant_callable=true`, `persist_snapshot=true`,
`snapshot_ttl_hours=26`, input `{tenant_config}` (= `source_context` uit
`rt_tenant_playbooks.config`), geïmplementeerd in **deze** Edge Function
(`rt-telemetry-pull`, dispatch op `skillKey`) en aangeroepen via de normale
executor-route — provider-logging (`rt_provider_calls`) en snapshots komen
daardoor gratis mee.

| Skill | Provider | Levert DATA-blok(ken) |
|---|---|---|
| `pull_pipedrive_stats` | pipedrive | `pipedrive`, `salescycle`, `winloss`, `herkomst`, `monthly` — alle berekeningen server-side; bij deelfout `partial: true` met de gelukte blokken |
| `pull_heyreach_stats` | heyreach | `heyreach` |
| `pull_apollo_sequence_stats` | apollo | `apollo` |
| `pull_planable_stats` | planable | `planable` |
| `pull_stairoids_scores` | stairoids | `staroids` (let op: provider heet `stairoids`, DATA-blok `staroids`) |

Credential-conventie: `vault://tenants/{slug}/{provider}`. Planable en
Stairoids hebben geen vast publiek statistiek-endpoint: zet de URL in
`rt_tenant_playbooks.config.source_context` als `planable.stats_url` resp.
`stairoids.scores_url`; de vault-credential gaat mee als Bearer.

Het volledige DATA-contract staat in
`docs/examples/core-vision-pipeline-dashboard.contract.md`.

## Dagelijkse sync

`rt-telemetry-sync` (Edge Function, x-rt-internal-token) loopt over actieve
tenants met `config.telemetry.enabled = true` en voert per tenant de vijf
skills uit via `rt-execute-skill` met `forceRefresh: true`. Resultaat per
tenant per skill wordt gelogd in `job_runs` (job_key `rt_telemetry_sync`).

- **Cron**: pg_cron `rt-telemetry-sync-daily`, `30 4 * * *` UTC (≈ 06:30
  Europe/Amsterdam in de zomer). De cron leest de interne token uit
  Vault-secret `rt/internal-token`.
- **Handmatig / één tenant**: POST met body `{"tenant": "core-vision"}` —
  dit is wat de "Verversen"-knop in het dashboard doet (via
  `portal-telemetry`, alleen Rebel Force-rollen).

## Dashboard

`/app/telemetry` (`src/pages/app/Telemetry.tsx`) haalt de compositie op bij
`portal-telemetry` (org-scoped via `gp_can_access_org`, zelfde compositie als
de MCP-tool `get_telemetry` via `_shared/rt-telemetry.ts`) en rendert per
blok de snapshot-datum, een RefreshCw-indicator voor blokken ouder dan 26
uur, en een lege-status met reden voor ontbrekende blokken. Berekeningen
gebeuren nooit in de frontend.
