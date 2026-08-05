# Inventory & dependency map

Everything in the kit, what it needs, and what's optional. Use this to decide
what to keep and what to strip per site.

---

## Edge functions

Env used by all: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. AI functions also
use `LOVABLE_API_KEY`. Public-URL-aware functions use `PUBLIC_SITE_URL`.

| Function | Module | Reads tables | Notes |
|----------|--------|--------------|-------|
| `generate-article` | **core** | seo_settings, blog_posts, (tool lib) | The main generator. De-branded. |
| `generate-headlines` | **core** | seo_settings, gsc_snapshots* | Headline ideas → queue. `*gsc_snapshots` optional (SEO Avalanche scoring degrades gracefully). |
| `generate-blog-image` | core | seo_settings | Featured image generation. |
| `reschedule-by-topic` | core | content_queue, content_topics | Pipeline scheduling. |
| `generate-glossary` | glossary | seo_settings, glossary_terms/runs, blog_posts, (tool lib) | De-branded. |
| `generate-bucket-item` | give-aways | content_buckets, content_bucket_items | |
| `content-bucket-request` | give-aways | content_bucket_*  | **Needs `enqueue_email` RPC** (email infra, not included). |
| `content-bucket-confirm` | give-aways | content_bucket_* | **Needs `enqueue_email` RPC.** |
| `content-cleanup` | maintenance | blog_posts, content_* | Housekeeping. |
| `smart-internal-linker` | linking | link_targets, link_suggestions, blog_posts | |
| `generate-page-embeddings` | linking | page_embeddings, blog_posts | **Needs pgvector + embeddings provider.** |
| `rss` | seo | blog_posts | Env: `SITE_NAME`, `SITE_DESCRIPTION`, `SITE_LANGUAGE`. |
| `sitemap` | seo | blog_posts, (others) | Env: `PUBLIC_SITE_URL`. May reference pages your site lacks — trim. |
| `og-image` | abm (optional) | abm_pages | **Not blog** — OG cards for ABM pages. Keep only with ABM. Env: `SITE_NAME`. |

---

## Tables (`0001_blog_content_kit_schema.sql`)

| Table | Module | Purpose |
|-------|--------|---------|
| `seo_settings` | **core** | The single config row. De-brands everything. |
| `content_topics` | **core** | Topic/pillar tree. |
| `blog_categories` | **core** | Post categories. |
| `blog_posts` | **core** | The articles. |
| `content_queue` | **core** | Editorial pipeline. |
| `content_refresh_queue` | refresh | Stale-content re-writes. |
| `content_entities` | entity-seo | Named entities for schema.org. |
| `glossary_terms`, `glossary_runs` | glossary | Woordenboek + run log. |
| `content_buckets`, `content_bucket_items`, `content_bucket_leads` | give-aways | Gated content + leads. |
| `link_targets`, `link_suggestions` | linking | Internal-link engine. |
| `page_embeddings` | linking | pgvector semantic index. |

Enums: `blog_post_status`, `content_type`, `content_queue_status`.

---

## Frontend files & their HOST peer-dependencies

The pages/admin are **reference implementations**. They import these from the
host project (NOT shipped in the kit — your Lovable project already has them, or
you provide equivalents):

- `@/integrations/supabase/client` — Supabase client
- `@/components/ui/*` — shadcn/ui (button, badge, input, textarea, select, tabs, table, dialog, sheet, progress, checkbox, collapsible, label)
- `@/hooks/use-toast`
- `@/components/Navbar`, `@/components/Footer` — **swap for your site's**
- `@/components/PageLoader`, `@/components/CtaSection`, `@/components/homepage/AmbientBackdrop` — swap or stub
- `@/components/GroeistackLeadCapture` — **b2b-specific lead widget; replace or remove**
- `@/content/copy` (exports `BOOKING_URL`) — replace with your own constants

**Shipped in the kit** (content-specific, keep them): `src/components/blog/*`
(infographic + answer-block renderers that parse what `generate-article` emits),
`src/components/buckets/giveaway/*`, `src/components/admin/AdminLayout.tsx`,
`src/components/admin/settings/*`, `src/hooks/{usePageMeta,useSeoSettings}.ts`,
`src/components/{JsonLd,BreadcrumbJsonLd}.tsx`, `src/lib/{tracking,parseAnswerBlock}.ts`.

### Admin routes to wire

`AdminBlog`, `AdminBlogEditor`, `AdminBlogGenerate`, `AdminContentHub`,
`AdminContentBuckets`, `AdminGlossary`, `AdminCalendar`, `AdminQueueManager`,
`AdminSettings`, `AdminTaxonomy`.

---

## Frontend de-brand checklist

The engine is fully de-branded. The frontend still carries ~39 brand strings
(page titles, canonical URLs, hardcoded pillar slugs, the lead widget). Find them:

```bash
grep -rinE "b2bgroei|groeimachine|groeistack" src/
```

Per-file hotspots:
- `src/pages/Blog.tsx` — `PILLAR_SLUGS`, meta title/canonical, `GroeistackLeadCapture`, `BOOKING_URL`
- `src/pages/BlogPost.tsx` — meta/canonical, JSON-LD publisher name, CTA copy
- `src/pages/Woordenboek.tsx` / `WoordenboekPost.tsx` — meta/canonical, publisher
- `src/pages/GiveAways*.tsx`, `src/components/buckets/giveaway/GiveawayAssetPage.tsx` — brand name in headers
- `src/components/blog/{MidContentCta,AnswerBlock}.tsx` — brand mention in CTA/answer chrome
- `src/components/admin/AdminLayout.tsx` — admin header label

Recommended: move page titles/canonicals to read from `useSeoSettings()`
(`config.name`, `config.site_url`) instead of hardcoding, so future sites need
zero frontend edits.

---

## Secrets summary

| Secret | Required | Used by |
|--------|----------|---------|
| `SUPABASE_URL` | yes | all |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | all |
| `LOVABLE_API_KEY` | yes (AI) | generate-* |
| `PUBLIC_SITE_URL` | yes | article, rss, sitemap, og-image, buckets |
| `SITE_NAME` | recommended | article, headlines, rss, og-image, bucket emails |
| `SITE_DESCRIPTION`, `SITE_LANGUAGE` | optional | rss |
| `MAIL_FROM` | give-aways only | content-bucket-* |
| `TOOL_LIBRARY_TABLE` | tool-lib only | article, glossary |

---

## Scheduling (optional)

The origin project drives itself with pg_cron. To replicate, schedule (example):
- `reschedule-by-topic` — pull approved queue items onto the calendar
- `content-cleanup` — housekeeping
- `generate-page-embeddings` — refresh the semantic index

Wire these as Supabase scheduled functions or pg_cron `net.http_post` calls.
Not included here because schedules are per-site.
