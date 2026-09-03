---
name: Post-generator
description: Genereert uit blogs en resources drie social-posts per invalshoek met vaste visual-templates, en zet ze als concept in Planable
type: feature
---
De standaard staat op één plek: `supabase/functions/_shared/social.ts` — beeldformaten (portrait 1080x1350, square, landscape, story), vijf visual-templates (statement, stat, steps, compare, teaser), kanaalregels (linkedin_personal is de default; linkedin_company, instagram, facebook, x optioneel), bronnen (blog_posts, playbooks, glossary_terms, content_bucket_items, vrij onderwerp), tekstmetriek en SVG-opbouw. Puur, dus testbaar met `deno test`.

Tables: `social_post_batches` (bron + gekozen kanalen per generatieronde), `social_posts` (één rij per invalshoek per kanaal, met visual_template/visual_format/visual_skin/visual_fields en de Planable-status). Beide admin-only via RLS.

Pagina: `/admin/social` (`AdminSocialPosts.tsx`). Haalt de catalogus op via `social-image?catalog=1`, zodat UI en renderer niet uit elkaar lopen.

Edge functions:
- `social-image`: SVG → PNG via resvg-wasm, fonts Space Grotesk + Inter. `?id=` rendert een opgeslagen post, losse velden kan ook, `&as=svg` voor de admin-preview, `?catalog=1` geeft de standaard. verify_jwt=false want Planable haalt het beeld zelf op.
- `social-generate`: laadt de bron, laat Lovable AI (gemini-3-flash) via tool-call drie invalshoeken × kanalen schrijven plus de visual-velden, slaat op als draft.
- `social-planable-push`: leest `api.planable.io/api/v1/openapi.json` om pad en veldnamen te bepalen (`planable.ts` doet de mapping), pusht als concept. Secrets: PLANABLE_API_TOKEN, PLANABLE_WORKSPACE_ID, PLANABLE_PAGES; workspace/pages mag ook uit `seo_settings.config.planable`.

Nieuw template toevoegen = een entry in `TEMPLATES` plus een render-functie in dezelfde file; de generator-prompt en het adminscherm pikken het automatisch op. Volledige uitleg in `docs/social-post-generator.md`.
