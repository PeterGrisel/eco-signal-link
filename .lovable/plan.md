## Doel
Elke werkdag automatisch 1 long-tail SEO-pagina (<300 zoekvolume/mnd) publiceren op basis van actuele concurrent-gaps, inclusief content brief in admin en interne links naar bestaande oplossingen.

## Aanpak
Geen nieuwe tabellen. We breiden de bestaande autopilot uit met een gap-analyse stap die concurrent rapporten (`seo_settings.config.competitor_reports`) en GSC-snapshots combineert tot een dagelijkse keuze van long-tail keywords. De brief wordt opgeslagen in `content_queue.notes`, het artikel wordt geschreven door `generate-article`, interne links worden gezet via de bestaande `smart-internal-linker`.

## Stappen

1. **Nieuwe edge function `gap-keyword-miner`**
   - Leest concurrent reports + bestaande `keyword_opportunities` + GSC snapshots
   - Vraagt Lovable AI (Gemini 2.5 Flash) om 10 long-tail keyword-kandidaten (<300/mnd, hoge service-fit, niet al gedekt door bestaande blog/sector/playbook slugs)
   - Per kandidaat: `headline`, `keyword`, `search_intent`, `competitor_gap_source`, en een **content brief** (H2 outline, FAQ-vragen, te beantwoorden zoekvraag, suggested internal links, suggested external sources)
   - Schrijft top-1 als rij in `content_queue` met `status='approved'`, `scheduled_date=morgen werkdag`, brief in `notes` (markdown)

2. **Autopilot uitbreiding**
   - Voor de nightly run: als er geen geplande rij is voor vandaag, roep eerst `gap-keyword-miner` aan om er een te creëren, daarna gewoon `generate-article`
   - `generate-article` krijgt de brief mee via een nieuwe `brief` parameter zodat de structuur 1-op-1 wordt gevolgd

3. **Interne linking automatisch**
   - Na publicatie roept autopilot reeds `smart-internal-linker` aan (controleren en zo nodig toevoegen) zodat de nieuwe pagina:
     - 3-5 interne links krijgt naar relevante `/oplossingen/*`, `/sectoren/*`, glossary
     - Wordt opgenomen in `link_suggestions` zodat oudere pagina's terug-linken (trigger `create_inverse_link_suggestion` doet dit al)

4. **Cron**
   - Bestaande dagelijkse autopilot cron (02:00) blijft. Toevoegen: extra cron 20:00 CET die `gap-keyword-miner` aanroept zodat morgen's brief al klaar staat voor admin-review.

5. **Admin UI (`/admin/autopilot`)**
   - Tab "Gap briefs" toont aankomende rijen uit `content_queue` met de brief uit `notes` (markdown-render)
   - Knop "Verwerp & regenereer" → roept `gap-keyword-miner` met `exclude=[headline]`
   - Knop "Publiceer nu" → roept `autopilot-run` mode `nightly` met `target_date=vandaag`

6. **SEO Avalanche-guardrail**
   - Miner filtert op `search_volume < 300` (op basis van GSC impressions <300/mnd of geen ranking) zoals vastgelegd in mem://features/content-autopilot/seo-avalanche-strategy
   - Negeert healthcare/non-profit termen (target sector regel)

7. **Slack rapport**
   - `daily-seo-report` toont: vandaag gepubliceerde long-tail pagina, gekozen keyword, gap-bron (welke concurrent), aantal interne links toegevoegd

## Technisch

**Nieuwe files**
- `supabase/functions/gap-keyword-miner/index.ts` (Lovable AI call, JSON output, insert in content_queue)
- `src/pages/admin/autopilot/GapBriefs.tsx` (tab in bestaande autopilot admin)

**Aangepaste files**
- `supabase/functions/autopilot-run/index.ts` — nightly fallback roept miner aan; geeft `brief` door aan generate-article
- `supabase/functions/generate-article/index.ts` — accepteert optionele `brief` parameter en injecteert in system prompt
- `supabase/functions/daily-seo-report/index.ts` — voegt long-tail sectie toe
- Cron: nieuwe `pg_cron` job via insert-tool die om 20:00 CET miner triggert

**Geen schema-wijzigingen** — `content_queue.notes` (text) en `keyword` zijn al aanwezig; brief past daarin als markdown.

## Validatie
- Test miner standalone met `curl_edge_functions`, check 1 brief in `content_queue`
- Trigger autopilot handmatig (`mode=nightly`, `target_date=morgen`), check blog_post in admin met juiste structuur + interne links
- Controleer dat link validation gate (`validate-external-links`) groen blijft voor de output

## Buiten scope (apart traject indien gewenst)
- Sector-landingpages (statisch, blijven hand-curated)
- Geautomatiseerde concurrent re-scrape (gebruikt cached `competitor_reports`; refresh via bestaande `competitor-scan` blijft handmatig of via aparte weekly cron)