---
name: Content Buckets Engine
description: Modulair content-bucket-systeem (give-aways nu, linkedin-posts later) met layouts, AI-generator en e-mailgate met double opt-in
type: feature
---
Tables: `content_buckets` (catalogus + AI prompt + default_layouts), `content_bucket_items` (jsonb payload per layout, status draft/published/archived), `content_bucket_leads` (e-mailgate met confirm_token).

Bucket 1 = `give-aways` met 24 templates, 6 layouts (scorecard, canvas, worksheet, checklist, framework, playbook). Layouts in `src/components/buckets/giveaway/GiveawayRenderer.tsx` + `GiveawayAssetPage.tsx`.

Pagina's: `/give-aways` (grid) en `/give-aways/:slug` (preview blur + e-mailgate; ?u=1&t=<token> ontgrendelt). Print via `body.gw-printing` + `@media print` in `index.css`.

Admin: `/admin/content-buckets` met tabs Items/AI-generator/Leads/Instellingen.

Edge functions:
- `content-bucket-request`: insert lead + enqueue confirm-mail via `enqueue_email` op queue `transactional_emails`.
- `content-bucket-confirm`: zet status confirmed + verstuurt delivery-mail met deep-link.
- `generate-bucket-item`: Lovable AI (gemini-2.5-flash) tool-call met layout-specifiek JSON schema, slaat op als draft.

Nieuwe bucket toevoegen = nieuwe rij in `content_buckets` + (optioneel) eigen renderer-component naast `giveaway/`. AI-generator herbruikbaar via layout-schemas in `generate-bucket-item`.