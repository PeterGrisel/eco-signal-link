## Doel

Het oude ABM-systeem (lege `abm_pages` records, generieke `AbmPage.tsx`, brand-extract/visuals/publish functies) vervangen door een nieuwe workflow:

> **U levert een flyer (PDF) → systeem genereert automatisch een /voor/&lt;slug&gt; pagina op maat in de stijl van HEGO/SealEco.**

De HegoPage / SealEcoPage worden de blauwdruk. Alles wat we voor die twee handmatig gebouwd hebben (hero, PDF-viewer, bento playbooks, gebrande PricingSection, branded WaitlistHero, prerender meta, route, `.<slug>-brand` CSS) wordt herhaalbaar via één admin-flow.

---

## Workflow voor u

1. Naar **/admin/abm** → "Nieuwe clientpagina"
2. U upload één PDF (de flyer / playbook van de klant)
3. U vult in: **bedrijfsnaam**, **slug** (optioneel autogenereerd), **website** (optioneel — voor logo + kleur)
4. U klikt **Genereer**
5. Systeem doet automatisch:
   - PDF naar Lovable Asset → CDN URL voor de viewer
   - Logo ophalen via favicon / Clearbit van website-domein
   - Brandkleur extractie via Lovable AI uit de PDF eerste pagina + logo (primary, primaryGlow als HSL)
   - OG-image genereren (1200×630, brandkleur + bedrijfsnaam)
   - Hero copy + intro genereren via Lovable AI in B1 NL (max 12 woorden per zin, "u/uw")
   - Database record opslaan in `abm_pages` met alle assets + brand tokens
6. U krijgt directe link → **/voor/&lt;slug&gt;**

---

## Wat u krijgt (per pagina)

Identiek aan HEGO/SealEco, dynamisch ingevuld uit één record:
- Hero met flowlines, glassmorphic logo-card, brandkleur gradients
- PDF-viewer sectie met zoom/paginatie
- Bento grid met de 8 playbooks (statisch, uit COPY)
- PricingSection met **`.&lt;slug&gt;-brand`** wrapper (gebrande gradients, glow, highlight-card)
- WaitlistHero met `accentColor` op brandkleur
- Per-route SEO meta + prerender + noindex
- Tracking events met `client_slug`

---

## Implementatie

### 1. Database (migratie)
Uitbreiden van bestaande `abm_pages`:
- `pdf_url` text — CDN URL naar geüploade flyer
- `logo_url` text — klant logo
- `brand_primary_hsl` text — bv. `"143 100% 26%"`
- `brand_glow_hsl` text — bv. `"122 49% 56%"`
- `brand_primary_hex` text — bv. `"#00833E"` (voor WaitlistHero accent)
- `og_image_url` text
- `hero_headline` text, `hero_subline` text, `intro` text
- `website` text (optioneel)

Bestaande `payload jsonb` blijft als fallback / extra config.
RLS blijft hetzelfde (admin write, public read live + niet verlopen).

### 2. Storage bucket
Nieuwe public bucket `abm-assets` voor PDF + OG image uploads.

### 3. Edge functions

**Vervangen / verwijderen:**
- `abm-brand-extract` → vervangen
- `abm-generate-visuals` → vervangen
- `abm-page-publish` → vervangen

**Nieuw: `abm-generate`** (één entrypoint)
- Input: `{ pdfBase64, filename, companyName, slug, website? }`
- Stappen:
  1. Upload PDF naar `abm-assets/<slug>/playbook.pdf` → publieke URL
  2. Render eerste pagina van PDF naar PNG (via pdf.js in Deno of fallback: skip en laat AI uit metadata werken)
  3. Logo: probeer `https://logo.clearbit.com/<domain>` of favicon, anders Lovable AI image gen op basis van bedrijfsnaam
  4. Brandkleur: Lovable AI Gateway met `google/gemini-2.5-flash` — input: logo + bedrijfsnaam → output JSON `{ primary_hex, primary_hsl, glow_hsl }`
  5. OG image: Lovable AI Gateway `google/gemini-2.5-flash-image` — 1200×630 met brandkleur + naam
  6. Hero copy: `google/gemini-2.5-flash` — B1 NL, max 12 woorden, "u/uw", JSON output `{ headline, subline, intro }`
  7. Upsert in `abm_pages`
- Returns: `{ slug, url: "/voor/<slug>" }`

### 4. Frontend

**Nieuw: `src/pages/ClientPage.tsx`** (vervangt direct gebruik van HegoPage/SealEcoPage als template)
- Dynamische versie van HegoPage/SealEcoPage
- Leest `abm_pages` op slug uit URL param
- Injecteert `--primary` CSS var via inline `<style>` met `.<slug>-brand` class
- Alle UI identiek aan HEGO/SealEco, kleuren komen uit DB record
- HegoPage.tsx en SealEcoPage.tsx blijven bestaan (handmatig gebouwd, custom assets) — nieuwe gegenereerde pagina's draaien op ClientPage via route `/voor/:slug`

**App.tsx routing:**
- `/voor/hego` → HegoPage (statisch, blijft)
- `/voor/sealeco` → SealEcoPage (statisch, blijft)
- `/voor/:slug` → ClientPage (lookup uit DB)

**`src/pages/admin/AdminAbmPages.tsx`** herschrijven:
- Nieuw form: PDF upload, bedrijfsnaam, slug, website
- "Genereer" knop roept `abm-generate` edge function aan met progress states
- Lijst toont: logo thumbnail, naam, slug, brand color swatch, view count, status, link
- Acties: bekijken, archiveren, verwijderen, opnieuw genereren

### 5. Prerender
`supabase/functions/prerender/index.ts` aanpassen: voor `/voor/<slug>` die niet in de hardcoded `CLIENT_PAGES` map zit, lookup in `abm_pages` voor title/description/og image.

### 6. CSS
`.<slug>-brand` wordt **niet** statisch in index.css gezet — ClientPage injecteert het runtime via een `<style>` tag op basis van DB tokens.

---

## Wat opgeruimd wordt

- `AbmPage.tsx` (oude generieke template) → verwijderen
- `abm-brand-extract`, `abm-generate-visuals`, `abm-page-publish` edge functions → verwijderen
- HEGO en SealEco blijven onaangetast (handmatig, custom assets)

---

## Open vragen

1. **Logo bron**: liever automatisch via Clearbit/favicon (snel, soms lelijk) of liever AI-generated logo als fallback?
2. **Brand kleur**: extractie uit PDF/logo door AI — wilt u dit kunnen overschrijven in admin (handmatige color picker)?
3. **Bento playbooks copy**: nu identiek aan HEGO/SealEco (uit `COPY.methode.layers`). Per-klant aanpassen of altijd hetzelfde?
4. **Hardcoded HEGO + SealEco**: laten staan of ook migreren naar het nieuwe systeem (één bron van waarheid)?
