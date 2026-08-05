# Blog & Content Kit

A portable, config-driven **AI blog + content engine** extracted from the
b2bgroeimachine project. Drop it into any Lovable/Vite + Supabase site to get:

- **AI article generation** (SEO-structured, internal + external linking, infographics, FAQ, CTA)
- **Editorial pipeline**: headline ideas → queue → approve → generate → publish
- **Glossary / "woordenboek"** generator
- **Gated content "give-aways"** with double-opt-in lead capture
- **Internal-linking + semantic embeddings** (smart linker, orphan detection)
- **SEO plumbing**: RSS, sitemap, OG images
- **Admin UI** for all of the above

The engine is **not hardcoded to any brand**. Every piece of site identity is
read from a single `seo_settings.config` row (see `src/types/seoSettings.ts`),
so making it "yours" is mostly filling in config + secrets.

---

## What's in the box

```
blog-content-kit/
├── supabase/
│   ├── functions/            # 14 Deno edge functions (the engine) — de-branded
│   └── migrations/
│       ├── 0001_blog_content_kit_schema.sql   # 15 tables, enums, triggers
│       └── 0002_rls_policies.sql              # public-read / service-write RLS
├── config/
│   └── seed-seo-settings.sql # one config row to fill in per site
├── src/                      # frontend: pages, admin, hooks, rendering components
│   └── types/seoSettings.ts  # the config contract (edit defaults here)
└── docs/
    ├── INVENTORY.md          # full manifest + host peer-deps + de-brand checklist
    └── .env.example
```

**Two layers, two levels of portability:**

| Layer | Portability |
|-------|-------------|
| **Engine** — edge functions + schema + config | **Drop-in.** Fully de-branded, config-driven. |
| **Frontend** — pages/admin | **Reference implementation.** Assumes the host project provides its own design system (shadcn/ui, Navbar, Footer). Adapt per site — see the checklist in `docs/INVENTORY.md`. |

---

## Prerequisites on the host project

This kit assumes the target repo is a **Lovable-style Vite + React + Supabase**
project that already has:

- Supabase JS client at `@/integrations/supabase/client`
- shadcn/ui components under `@/components/ui/*`
- A `@/hooks/use-toast`
- Its own `Navbar` / `Footer` (the pages import these — swap for yours)
- An LLM gateway. The functions call the **Lovable AI Gateway** (`LOVABLE_API_KEY`).
  If the site isn't on Lovable, swap the fetch URL/provider in the functions.

If you're scaffolding a brand-new Lovable project, all of the above come for free.

---

## Quick start (per new site)

1. **Copy the kit into your project**
   ```
   cp -r blog-content-kit/supabase/functions/*   <your-project>/supabase/functions/
   cp    blog-content-kit/supabase/migrations/*  <your-project>/supabase/migrations/
   cp -r blog-content-kit/src/*                  <your-project>/src/
   ```

2. **Create the schema** — in the Supabase SQL editor (or `supabase db push`) run, in order:
   1. `0001_blog_content_kit_schema.sql`
   2. `0002_rls_policies.sql`
   3. `config/seed-seo-settings.sql` (edit the values first)

3. **Set edge-function secrets** (see `docs/.env.example`):
   ```
   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   # provided by Supabase
   LOVABLE_API_KEY                            # your AI gateway key
   PUBLIC_SITE_URL   = https://yoursite.com
   SITE_NAME         = Your Site
   # optional:
   SITE_DESCRIPTION, SITE_LANGUAGE
   MAIL_FROM         = "Your Site <hi@notify.yoursite.com>"   # for give-away emails
   TOOL_LIBRARY_TABLE                          # only if you enable a tool library
   ```

4. **Deploy the functions** (`supabase functions deploy <name>` for each).

5. **Configure the site** — open the admin Settings screen (`AdminSettings`) and
   fill in name, URL, audience, blog theme, CTA. This is 90% of the branding.

6. **Wire the routes** in your router (example):
   ```tsx
   <Route path="/blog"                 element={<Blog />} />
   <Route path="/blog/:slug"           element={<BlogPost />} />
   <Route path="/woordenboek"          element={<Woordenboek />} />
   <Route path="/woordenboek/:slug"    element={<WoordenboekPost />} />
   <Route path="/give-aways"           element={<GiveAways />} />
   <Route path="/give-aways/:slug"     element={<GiveAwayDetail />} />
   <Route path="/admin/blog"           element={<AdminBlog />} />
   <Route path="/admin/blog/generate"  element={<AdminBlogGenerate />} />
   {/* ...remaining admin routes, see INVENTORY.md */}
   ```

7. **Adapt the frontend** — swap Navbar/Footer, and run the de-brand checklist in
   `docs/INVENTORY.md` (≈39 brand strings across the page files).

8. **(Optional) schedule** the pipeline — point a cron/pg_cron job at
   `reschedule-by-topic` / `content-cleanup` if you want it to run itself.

---

## How the engine de-brands itself

`generate-article` (and the others) resolve identity in this order:

```
seo_settings.config.<key>   →   env var   →   neutral placeholder
```

So a fresh clone runs immediately with placeholders, an env var covers you before
you touch the DB, and the admin Settings row is the real per-site source of truth.

Key config fields (full list in `src/types/seoSettings.ts`):
`name`, `site_url`, `blog_theme`, `target_audience_summary`, `competitor_prompt`,
`cta_*`, `fixed_pages`, `glossary_focus`, `brand_terms`,
`tool_library_enabled` + `tool_library_category_labels`.

---

## Dependencies you may NOT want

Some optional modules pull in extra infrastructure. All are listed in
`docs/INVENTORY.md`; the big ones:

- **Give-aways** need a transactional-email queue (`enqueue_email` RPC). Not
  included — bring your own or delete the two `content-bucket-*` functions.
- **Embeddings / semantic linking** need `pgvector` (enabled by the schema) and
  an embeddings provider in `generate-page-embeddings`.
- **`og-image`** renders OG cards for `abm_pages` (an ABM feature, not blog) — keep
  only if you use ABM pages.

Delete any function + its table you don't need; the core (blog + article generation)
has no dependency on the optional modules.
