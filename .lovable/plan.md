# SEO Authority Agent — MVP plan

Context-aware backlink & authority discovery engine. Geïntegreerd als nieuwe tab **Authority** in `/admin/seo`, naast bestaande Backlinks Monitor. Multi-website (jij beheert b2bgroeimachine.io plus eventuele client-domeinen). Discovery via Firecrawl search + scrape. AI scoring via Lovable AI Gateway (Gemini Flash).

## 1. Database (1 migration, 9 tabellen)

Alle in `public`, met GRANTs naar `authenticated` + `service_role`, RLS on, policies `has_role(auth.uid(),'admin')`.

- `authority_websites` — naam, domein, propositie, status
- `authority_context_profiles` — JSONB met propositie, ICP, core/secondary topics, sectors, differentiators, money_pages, recommended_pages, linkable_assets, negative_keywords, raw_summary, context_version
- `authority_target_pages` — url, title, page_type, topic, sector, priority
- `authority_queries` — query, cluster, intent, priority
- `authority_runs` — run_type, status, counts, started/completed_at
- `authority_crawled_pages` — full crawl metadata (zoals doc §10.6)
- `authority_opportunities` — alle scoring-velden + status (zoals doc §10.7)
- `authority_assets` — asset-ideeën met status idea→published
- `authority_placements` — placement_url, target_url, anchors, verification

Prefix `authority_` om naast bestaande `semrush_backlinks` te leven.

## 2. Edge functions (8)

Alle in `supabase/functions/`, geregistreerd in `config.toml` (`verify_jwt = true` voor admin-acties; `false` voor cron-trigger met CRON_SECRET header).

| Function | Doel |
|---|---|
| `authority-analyze-context` | Crawlt homepage + 5–10 interne pagina's via Firecrawl, stuurt naar Gemini Flash met prompt §11.1, slaat profiel op |
| `authority-generate-queries` | Neemt context, genereert 25–60 queries (prompt §11.2), inserts in `authority_queries` |
| `authority-discover` | Loopt queries af via Firecrawl `/v2/search`, dedupes, slaat URLs op als `crawled_pages` stubs |
| `authority-crawl-url` | Firecrawl `/v2/scrape` voor één URL → vult `crawled_pages` (title, h1/h2, text, outbound links, emails, robots) |
| `authority-score-opportunity` | Pakt crawled page + context → Gemini prompt §11.3 → insert/update `authority_opportunities` met scoring + target match + anchor |
| `authority-generate-outreach` | Per opportunity → Gemini prompt §11.4 → returnt subject/body (niet opgeslagen tenzij user "Save draft") |
| `authority-verify-placement` | Firecrawl scrape placement_url, check link aanwezig + anchor + rel + statuscode + robots |
| `authority-daily-cron` | Triggert verify van alle `placed` placements + nieuwe discovery batch (10 queries) + rescore pending. Cron via pg_cron + CRON_SECRET |

Risk filter en scoring (sectie §8.6/§8.7) draaien server-side in `authority-score-opportunity`. Negative keywords komen uit het context profile.

## 3. Frontend

Nieuwe tab in `src/pages/admin/AdminSeoHub.tsx`:

```
<TabsTrigger value="authority">Authority</TabsTrigger>
<TabsContent value="authority"><AuthorityHub /></TabsContent>
```

Nieuwe map `src/pages/admin/authority/` met sub-router (sub-tabs i.p.v. losse routes, blijft binnen `/admin/seo?tab=authority`):

- `AuthorityDashboard.tsx` — KPI-cards (websites, new/high-priority/needs-asset/ready/placed/lost), laatste run
- `AuthorityWebsites.tsx` — lijst + "Add website" dialog (domain + name). "Run context scan" knop triggert `authority-analyze-context`
- `AuthorityContextBrain.tsx` — toont/edits JSON-velden uit profile, "Refresh" + "Generate queries" buttons
- `AuthorityRuns.tsx` — runs-tabel met status + counts
- `AuthorityOpportunities.tsx` — gefilterde lijst (status/type/priority/sector), inline approve/reject, klik → detail drawer
- `AuthorityOpportunityDetail.tsx` (drawer/sheet) — alle scoring-cijfers, reden, target/anchor suggesties, action-buttons (Approve, Reject, Generate Outreach, Mark Contacted, Mark Placed, Create Asset Task)
- `AuthorityAssets.tsx` — assets-tabel met statussen
- `AuthorityPlacements.tsx` — placements + "Verify Now"
- `AuthoritySettings.tsx` — thresholds, crawl depth, max URLs/run, default negative keywords

Hooks in `src/hooks/`:
- `useAuthorityWebsites`, `useAuthorityOpportunities`, `useAuthorityRuns` — react-query wrappers rond Supabase + edge function invokes

UI: shadcn componenten zoals bestaande admin (`Card`, `Table`, `Badge`, `Sheet`, `Tabs`). Status badges met semantic tokens (geen hardcoded colors). Score badges met 3 tiers (≥80 groen, 65–79 amber, <65 muted).

## 4. Integraties / secrets

Alles al aanwezig:
- `FIRECRAWL_API_KEY` (connector) — search + scrape
- `LOVABLE_API_KEY` — Gemini Flash scoring/outreach/context
- `CRON_SECRET` — cron-trigger guard
- `SUPABASE_SERVICE_ROLE_KEY` — edge functions

Geen nieuwe secrets nodig.

## 5. Cron (pg_cron)

Eén dagelijkse job die `authority-daily-cron` aanroept (verify + discover-batch). Geen wekelijkse/maandelijkse jobs in MVP — die knoppen worden handmatige buttons in Settings ("Refresh context", "Regenerate queries").

## 6. Veiligheidsregels

- Edge functions valideren input met zod
- Discovery cap: max 50 URLs per run, max 100 queries per website
- Outreach wordt **nooit** verzonden — alleen tekst-output in UI
- Risk-score ≥ 60 → automatisch `rejected`
- Negative-keyword match → automatisch `rejected` voor scoring AI wordt aangeroepen (bespaart credits)

## 7. Seed data

Migration zet b2bgroeimachine.io als eerste website + voorbeeld context profile uit doc §16 zodat je direct kan testen zonder eerst de context-scan te draaien.

## 8. Niet in MVP (later)

- Ahrefs/Semrush CSV import (apart van bestaande Semrush-tab)
- GSC integratie voor unlinked mentions
- Multi-user rollen (alleen admin)
- Bulk outreach send
- White-label rapportage

## 9. Volgorde van implementatie

1. Migration met 9 tabellen + seed b2bgroeimachine context
2. Edge functions `authority-analyze-context` + `authority-generate-queries` (basisflow)
3. `AuthorityHub` shell + Websites + Context Brain pagina's
4. Edge functions `authority-discover` + `authority-crawl-url` + `authority-score-opportunity`
5. Opportunities lijst + detail drawer
6. Outreach + Assets pagina's
7. Placements + `authority-verify-placement`
8. Daily cron + Settings pagina
9. Dashboard met KPI's

Na approve van dit plan: stap 1 (migration) eerst, dan ga ik de rest in 2–3 iteraties bouwen omdat het te groot is voor één edit-ronde.
