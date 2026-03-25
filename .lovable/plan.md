

# CMS + AI SEO Toolsuite voor B2BGroeiMachine

## Overzicht

We bouwen drie interne tools op Lovable Cloud (Supabase):

1. **CMS + AI Blog** -- Artikelen beheren en automatisch genereren met AI
2. **Listing Tool** -- Directory submissions bijhouden en beheren
3. **Index Rusher** -- Google Indexing API aanspreken om pagina's snel te indexeren

## Architectuur

```text
┌─────────────────────────────────────────────┐
│              Frontend (React)               │
│                                             │
│  /blog             - Publieke blog listing  │
│  /blog/:slug       - Artikel pagina         │
│  /admin/blog       - CMS beheer             │
│  /admin/listings   - Directory tracker      │
│  /admin/indexing   - Index Rusher dashboard  │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│           Lovable Cloud (Supabase)          │
│                                             │
│  Tables:                                    │
│  - blog_posts (title, slug, content,        │
│    category, featured_image, meta_desc,     │
│    status, published_at)                    │
│  - blog_categories                          │
│  - directory_listings (name, url, status,   │
│    dr_score, submitted_at, live_at)         │
│  - indexing_requests (url, status,          │
│    requested_at, indexed_at)                │
│                                             │
│  Edge Functions:                            │
│  - generate-article (Lovable AI)            │
│  - request-indexing (Google Indexing API)    │
└─────────────────────────────────────────────┘
```

## Stap-voor-stap

### Stap 1: Lovable Cloud + Database
- Enable Lovable Cloud
- Creeer tabellen: `blog_posts`, `blog_categories`, `directory_listings`, `indexing_requests`
- Basis auth voor admin pages (simpele login)

### Stap 2: CMS + Publieke Blog
- **Admin**: CRUD voor artikelen met rich text editor, categorie-selectie, featured image upload, SEO meta-velden, draft/published status
- **Publiek**: Blog listing page (`/blog`) met kaarten, categorie-filter. Artikel pagina (`/blog/:slug`) met dezelfde look als het rebelforce.nl voorbeeld -- hero image, categorie-label, titel, content
- SEO: JSON-LD Article schema, Open Graph tags, canonical URLs, sitemap update

### Stap 3: AI Artikel Generator
- Edge function `generate-article` met Lovable AI
- Input: onderwerp/keyword, doelgroep, gewenste lengte
- Output: titel, meta description, volledige markdown artikel met headings, interne links
- Admin UI: "Genereer Artikel" knop, preview, bewerken, publiceren

### Stap 4: Directory Listing Tracker
- Admin pagina om directory submissions bij te houden
- Velden: directory naam, URL, categorie, DR score, status (todo/submitted/live/rejected), datum
- Bulk import van directories (CSV)
- Dashboard met statistieken: hoeveel live, gemiddelde DR, submissions deze maand

### Stap 5: Index Rusher
- Edge function die Google Indexing API aanroept (vereist Google Service Account key als secret)
- Admin UI: URL invoeren of selecteren uit blog posts, "Request Indexing" knop
- Status tracking: requested/indexed/failed
- Batch indexing van meerdere URLs

## Vereisten
- **Lovable Cloud** moet geactiveerd worden (database, auth, edge functions, storage)
- **Google Service Account** met Indexing API toegang (voor Index Rusher) -- gebruiker moet dit later configureren
- Geen externe services nodig voor CMS en AI blog (Lovable AI is ingebouwd)

## Technische Details
- Blog content opgeslagen als markdown in database
- Markdown rendering met `react-markdown` + `remark-gfm`
- Image upload via Supabase Storage
- AI generatie via Lovable AI edge function (google/gemini-3-flash-preview)
- Google Indexing API via edge function met service account credentials
- RLS policies: publieke leestoegang voor gepubliceerde posts, admin-only schrijftoegang

