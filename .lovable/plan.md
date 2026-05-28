# Jobs overzicht + Smart Cross-References

Twee samenhangende uitbreidingen onder `/admin/content`:

## Deel 1 — Jobs tab (nieuw)

Nieuwe tab `Jobs` naast Artikelen/Autopilot/Kalender/Strategie. Eén overzicht van álle automations met laatste + volgende run, status, en handmatige trigger.

**Welke jobs tonen:**
1. Blog autopilot (`autopilot-run`)
2. Playbook autopilot (`generate-playbook`)
3. Glossary autopilot (`generate-glossary`)
4. GSC data sync (`fetch-gsc-data`)
5. Maandelijkse evaluatie (`monthly-evaluation`)
6. Link validation (`validate-external-links`)
7. Content cleanup (`content-cleanup`)
8. Daily SEO report (`daily-seo-report`)
9. **NIEUW**: Smart link autopilot (zie deel 2)
10. **NIEUW**: GSC keyword opportunity scanner (zie deel 2)

**Per job toont de kaart:**
- Naam + icoon + korte beschrijving
- Status badge (Actief / Gepauzeerd / Mislukt)
- Cron-schema (mens-leesbaar: "Dagelijks 06:00")
- Laatste run: tijd + success/fail
- Volgende geplande run
- Knop "Run now"
- Expand → log van laatste 5 runs

**Gecombineerde kalender (bovenaan tab):**
Toont in één kalenderweergave alle geplande items van alle jobs (blog, playbook, glossary) met kleurcode per type.

## Deel 2 — Smart Cross-References

Drie nieuwe automations die de site zichzelf laten verbeteren.

### 2a. Auto-link keywords in blogs
Bij publicatie (en nachtelijk voor bestaande posts) scant edge function `smart-internal-linker` blog markdown en injecteert links naar:
- Sectorpagina's (`/sectoren/{slug}`)
- Solutions (`/oplossingen/{slug}`)
- Glossary termen (`/woordenboek/{slug}`)
- Andere blogposts

Match-logica: keyword-tabel `link_targets` met `keyword`, `target_url`, `priority`. Eerste 2 voorkomens per pagina worden gelinkt. Skip headings, code-blocks, bestaande links.

### 2b. GSC-driven keyword opportunity scanner
Nachtelijke job `gsc-opportunity-scan`:
- Leest `gsc_snapshots` (laatste 28 dagen)
- Vindt queries op positie 5-20 met >100 impressies
- Matcht query → bestaande pagina
- Schrijft suggesties naar nieuwe tabel `keyword_opportunities` met: query, page, position, impressions, suggested_action (`add_internal_link` | `expand_content` | `new_article`)
- Toont in Strategie-tab als action items

### 2c. Bidirectionele link suggesties
Edge function `orphan-link-detector` (wekelijks):
- Detecteert pagina's met <2 inbound links
- Genereert suggesties voor bidirectionele links via embeddings (pgvector)
- Output in tabel `link_suggestions`, reviewable in Jobs-tab

### Embeddings infrastructuur
- `pg_vector` extensie + tabel `page_embeddings` (page_url, embedding vector(1536), updated_at)
- Edge function `generate-page-embeddings` (wekelijks) — embed alle blogs, sectorpagina's, solutions via Lovable AI Gateway (`openai/text-embedding-3-small`)
- Similarity search voor "gerelateerd"-blokken en orphan detection

## Technisch

**Nieuwe tabellen** (migratie):
- `link_targets` (keyword, target_url, target_type, priority, active)
- `keyword_opportunities` (query, page, position, impressions, suggested_action, status, created_at)
- `link_suggestions` (source_url, target_url, score, reason, status, created_at)
- `page_embeddings` (page_url, content_hash, embedding vector(1536), updated_at)
- `job_runs` (job_key, status, message, started_at, finished_at, duration_ms) — uniform run-log voor Jobs-tab

**Nieuwe edge functions:**
- `smart-internal-linker`
- `gsc-opportunity-scan`
- `orphan-link-detector`
- `generate-page-embeddings`
- `jobs-overview` (aggregator: leest cron jobs + job_runs en geeft samengevoegd overzicht)

**Frontend:**
- `src/components/admin/jobs/JobsOverview.tsx`
- `src/components/admin/jobs/JobCard.tsx`
- `src/components/admin/jobs/CombinedCalendar.tsx`
- `src/components/admin/jobs/KeywordOpportunities.tsx`
- Tab toevoegen in `AdminContentHub.tsx`

**Cron** (via pg_cron `insert` tool, niet migratie — zoals voorgeschreven):
- `smart-internal-linker`: dagelijks 04:00
- `gsc-opportunity-scan`: dagelijks 05:00
- `orphan-link-detector`: zondag 03:00
- `generate-page-embeddings`: zondag 02:00

## Scope-afbakening

In deze ronde: tabellen + edge functions + Jobs-tab UI + cron-schedules + first iteration van auto-linker (keyword tabel pre-fill met sectoren/solutions/top glossary).

Niet in deze ronde: UI om `link_targets` handmatig te beheren (komt in tweede ronde), front-end "gerelateerd" blokken op blogposts (kan los).

Groot werkstuk — bevestigt u de scope dan bouw ik in deze volgorde: 1) tabellen 2) embeddings function 3) smart-linker 4) GSC scanner 5) orphan detector 6) Jobs-tab UI 7) cron.