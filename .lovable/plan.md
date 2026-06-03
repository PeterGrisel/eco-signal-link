## Wat we bouwen

Een systeem om per engaged account een unieke landingspagina te publiceren op `/voor/[slug]` (bv. `/voor/coolmark`). De pagina volgt de structuur van de playbook-flyer, maar dan als webpagina, gebrand met de kleuren van de klant uit de JSON. Pagina's vervallen automatisch na 14 dagen.

## Hoe het werkt

1. U laat ChatGPT een JSON-spec opleveren (zoals het Coolmark-voorbeeld).
2. U publiceert via Admin UI **of** via API endpoint.
3. Pagina staat live op `https://b2bgroeimachine.io/voor/[slug]` met `expires_at = now + 14 dagen`.
4. Na 14 dagen → 404 (status `expired`).

## Pagina-layout (vast template)

Alle pagina's gebruiken hetzelfde frame, gevuld uit JSON:

```text
┌─────────────────────────────────────────────┐
│ Hero: companyName + recommendedVisualTitle  │  ← brandStyle.colors[0] als accent
│ "Een tailored market activation plan voor…" │
├─────────────────────────────────────────────┤
│ Strip: 4 badges uit visualMotifs            │
├─────────────────────────────────────────────┤
│ Sectie 1: Waar wij de kans zien (4 cards)   │  ← vaste B2BGM-stappen
│ Sectie 2: Wat dit voor [klant] kan doen     │  ← 6-stappen flow
├─────────────────────────────────────────────┤
│ Target audiences  │  Producten/diensten     │  ← targetAudiences + productsServices
├─────────────────────────────────────────────┤
│ Signal-based activatie + 3 tiers            │  ← vast B2BGM-frame
│ Verwachte output   │   Onze expertise       │
├─────────────────────────────────────────────┤
│ Playbook-secties uit JSON (icon cards)      │  ← playbookSections
├─────────────────────────────────────────────┤
│ CTA-banner: cta-tekst uit JSON              │  ← brand color, link naar GlobalBookingModal
│ Footer: B2BGroeiMachine + "geldig tot DD/MM"│
└─────────────────────────────────────────────┘
```

Branding: `brandStyle.colors[0]` → CSS-variable `--accent-page` op de root van de pagina. Alle accenten (hero-band, badges, CTA-knop) gebruiken deze. Fallback B2BGM-oranje als kleur ontbreekt.

## Hoe u publiceert

**Admin UI** — `/admin/voor-pagina's`
- Lijst van alle pagina's: slug, klant, status (live/expired), vervaldatum, view count.
- Nieuwe pagina: textarea om JSON te plakken + slug-veld (autosuggestie uit companyName). Knop "Publiceer 14 dagen". Optioneel veld voor handmatige verlengingen.
- Acties per rij: bekijk, kopieer URL, verleng +14 dagen, archiveer nu.

**API endpoint** — `POST /functions/v1/abm-page-publish`
- Body: `{ slug, json, expires_in_days? }` (default 14).
- Header: `x-api-key` met secret `ABM_PUBLISH_KEY`.
- Response: `{ url, expires_at }`.
- Te koppelen aan uw ChatGPT/n8n workflow.

## Cleanup

Cron job (dagelijks 03:00) zet status van pagina's met `expires_at < now()` op `expired`. De public route checkt status en levert 404 als niet `live`.

## Tracking

Page view + CTA-klik geregistreerd in bestaande `pageviews`/`events` tabel met `account_slug` als label, zodat u per account ziet wie heeft gekeken en wie geklikt.

---

## Technische uitwerking

**DB-migratie** — nieuwe tabel `abm_pages`:
- `id`, `slug` (unique), `company_name`, `payload` (jsonb), `status` ('live'|'expired'|'archived'), `expires_at`, `view_count`, `created_at`, `updated_at`
- GRANT SELECT aan `anon` (publieke pagina); INSERT/UPDATE/DELETE alleen via service_role
- RLS: anon mag alleen `status='live' AND expires_at>now()` lezen; admin via has_role('admin') volledige toegang
- Index op `slug`

**Edge functions**:
- `abm-page-publish` — auth via `x-api-key`, valideert JSON-shape met Zod, upsert in `abm_pages` met `expires_at = now() + N days`
- `abm-page-expire` — cron-gedreven cleanup, zet `status='expired'`

**Frontend**:
- Route `/voor/:slug` → `src/pages/abm/AbmPage.tsx`
  - Fetch `abm_pages` op slug, check `live` + niet verlopen, anders 404
  - Render het vaste template, kleuren uit `payload.brandStyle.colors[0]`
  - Increment view_count via RPC
- Componenten in `src/components/abm/`: `AbmHero`, `AbmOpportunity`, `AbmSteps`, `AbmAudienceProducts`, `AbmSignals`, `AbmPlaybookSections`, `AbmCtaBanner`
- Admin `src/pages/admin/AdminAbmPages.tsx` toegevoegd aan admin nav
- Routing in `src/App.tsx` toevoegen

**Copy/CTA**: CTA-knop gebruikt bestaande `GlobalBookingModal` (intent: gratisScan-variant met `account_slug` als tracking-label). Tekst komt uit `payload.cta`.

**SEO**: `noindex, nofollow` op alle `/voor/*` pagina's (priv private outreach).

**JSON-shape (Zod schema)** — verplicht: `companyName`, `recommendedVisualTitle`, `positioning`, `cta`, `targetAudiences[]`, `productsServices[]`, `playbookSections[]`. Optioneel: `brandStyle.colors[]`, `brandStyle.visualMotifs[]`, `confidence`, `reasoning`, `stepsTaken`.

**Secret nodig**: `ABM_PUBLISH_KEY` (via add_secret tijdens build).

## Out of scope (later)
- AI-gegenereerde hero-afbeelding per pagina (nu: pure layout, geen flyer-image)
- E-mail-gate of token-toegang
- Versiebeheer / preview voor publish
