
# Content Bucket Engine

Eén systeem dat verschillende soorten "content-buckets" beheert. Elke bucket = een type asset met eigen layout(s), generator-prompt en publicatieflow. We starten met de bucket **Give-Aways** (24 templates uit de bundle) en bouwen de architectuur direct zo dat een tweede bucket (bijv. **LinkedIn-posts**) later alleen een nieuwe rij in `content_buckets` + een renderer-component nodig heeft.

## Wat de gebruiker krijgt

**Publiek**
- `/give-aways` — overzicht van alle 24 templates met cover-cards (week-slot + type-label).
- `/give-aways/:slug` — detailpagina met preview en e-mailgate. Na double opt-in: PDF/print + welkomstmail.
- Werkt in dezelfde dark editorial stijl als de prototype (Space Grotesk, Inter, JetBrains Mono, accent #E8945A, bg #121212, A4-vriendelijk via `@media print`).

**Admin (`/admin/content-buckets`)**
- Lijst van buckets (Give-Aways, later LinkedIn, etc.) met counters.
- Per bucket: tabel met alle items, status (draft/published), inline edit, "Genereer met AI" knop.
- AI-generator (Lovable AI / Gemini 2.5 Flash) die op basis van bucket-type een nieuw item maakt in het juiste schema. Per bucket-type een eigen system prompt.
- Lead-overzicht per bucket: wie heeft welk item opgevraagd, opt-in status.

## Architectuur

```text
content_buckets        (Give-Aways, LinkedIn-posts, …)
   │
   └── content_bucket_items   (24 templates, JSON payload per layout)
            │
            └── content_bucket_leads   (e-mailgate + double opt-in)
```

**Layouts (Give-Aways)** — 6 renderers, 1-op-1 uit de prototype:
`scorecard`, `canvas` (columns/grid/matrix), `worksheet`, `checklist`, `framework` (flow/funnel), `playbook`. Layout-keuze in `item.payload.type`, zodat een nieuwe bucket eigen layouts kan toevoegen zonder de bestaande te raken.

**E-mailgate flow**
1. Bezoeker vult e-mail in op `/give-aways/:slug`.
2. Edge function `content-bucket-request` slaat lead op (status `pending`) en zet bevestigingsmail in de bestaande email-queue (`auth-email-hook` patroon, maar als transactional).
3. Bezoeker klikt link → `content-bucket-confirm` zet status op `confirmed`, redirect naar download-/printpagina.
4. Welkomstmail met PDF-link gaat via dezelfde queue.

We gebruiken jouw bestaande `email_send_log` + `enqueue_email` infrastructuur. Suppression check is automatisch.

**AI-generator** — edge function `generate-bucket-item`:
- Input: `bucket_id`, optioneel `topic` / `layout`.
- Laadt bucket-config (system prompt + JSON schema).
- Roept Lovable AI met tool-call zodat output exact het schema volgt.
- Slaat op als `draft` zodat je het in admin nog kunt redigeren.

## Bouwvolgorde

1. **Migratie**: `content_buckets`, `content_bucket_items`, `content_bucket_leads` met RLS + GRANTs. Seed `give-aways` bucket en de 24 templates uit `Giveaway Engine.dc.html`.
2. **Renderers**: `src/components/buckets/giveaway/` met 6 layout-components, exact dark editorial styling + `@media print` voor PDF.
3. **Publieke pagina's**: `/give-aways` (grid) en `/give-aways/:slug` (preview + e-mailgate).
4. **Admin**: `/admin/content-buckets` met bucket-tabs, item-tabel, edit-drawer, "Genereer met AI", lead-tab.
5. **Edge functions**: `content-bucket-request` (gate + queue mail), `content-bucket-confirm` (double opt-in), `generate-bucket-item` (AI).
6. **E-mail templates** (React Email): `bucket-confirm-optin` en `bucket-delivery`.
7. Sitemap + nav-link toevoegen.

## Technische details

- DB: payload als `jsonb` zodat elk layout-type vrij is. `slug` uniek per bucket. `position` integer voor volgorde.
- RLS: items met `status='published'` publiek leesbaar; admin schrijft via `has_role(auth.uid(),'admin')`. Leads alleen via service-role (edge functions).
- Print: bestaande `@media print` rules uit het prototype 1-op-1 naar `src/index.css` toevoegen onder een scoped class.
- Geen vendor logos. Tone-of-voice: bestaande B1-NL regels uit `mem://style/copywriting`.
- Geen partner logos of tool badges (memory rule).

## Wat ik nog NIET doe (vraag eerst om bevestiging)

- LinkedIn-post bucket: alleen architectuur klaarzetten; tweede bucket bouwen we als je dit hebt goedgekeurd.
- Auto-publicatie naar LinkedIn API: nog niet — eerst alleen "klaar voor copy/paste".
