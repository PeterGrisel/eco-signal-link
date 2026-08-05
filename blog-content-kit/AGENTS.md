# AGENTS.md — deploy the Blog & Content Kit

**You are an AI coding agent. This file is your runbook for installing this kit
into a host project and standing up the full backend. Follow it top to bottom.**

Machine-readable companion: `plugin.json` (modules, tables, secrets, deploy
order). Human docs: `README.md`, `docs/INVENTORY.md`.

## Golden rules

1. **Never guess secrets, project refs, URLs, or brand facts.** If a required
   value isn't in the repo, the conversation, or the environment, **STOP and ask
   the user** using the questions in `plugin.json → ask_user_when_missing`. It is
   correct to pause deployment to ask; it is not correct to invent a value.
2. **Idempotent by design.** Every migration uses `if not exists` / guarded
   enum+cron creation. Re-running is safe. Prefer re-running over hand-patching.
3. **Verify each phase before the next.** A phase's "Verify" step must pass.
4. **Don't commit secrets.** Service-role keys, API keys → secret store / Vault,
   never into SQL files or git.
5. **Report, don't fabricate.** If a smoke test fails, say so with the output.

---

## Phase 0 — Discover the host & gather inputs

Determine, from the repo and the conversation (ask only what you can't find):

- [ ] Host is a Vite + React + Supabase project? (look for `supabase/`,
      `src/integrations/supabase/client`, `components.json` for shadcn). If not,
      tell the user what's missing before continuing.
- [ ] Supabase project ref + how you'll run SQL (Supabase MCP `apply_migration`,
      the `supabase` CLI, or the dashboard SQL editor).
- [ ] Required secrets present? (`plugin.json → secrets`). Collect any missing.
- [ ] **Which modules** does the user want? Core is mandatory; glossary /
      give-aways / internal-linking / autopilot are opt-in. Give-aways needs
      email infra; internal-linking needs an embeddings provider; autopilot
      needs (ideally) a Search Console feed. Confirm before installing those.

Produce a short install plan and confirm it with the user before writing files.

---

## Phase 1 — Copy files into the host

Copy only the modules the user chose. Layout mirrors a standard project:

```
supabase/functions/<fn>/     -> host supabase/functions/<fn>/
supabase/migrations/*.sql    -> host supabase/migrations/   (keep the 000N order)
src/**                       -> host src/**   (pages, admin, hooks, components, types)
config/seed-seo-settings.sql -> keep handy for Phase 3
```

If a function/table belongs to a module the user declined, **do not copy it**
(see `plugin.json → modules`). Note collisions: if the host already has a file
at a target path, ask before overwriting.

**Verify:** `git status` shows the expected new files and no unintended deletions.

---

## Phase 2 — Create the database schema

Run, in order (skip 0003 if autopilot not selected):

1. `0001_blog_content_kit_schema.sql`
2. `0002_rls_policies.sql`
3. `0003_autopilot_module.sql`  *(autopilot module only)*

Use Supabase MCP `apply_migration` (one call per file) or `supabase db push`.

**Verify:** the core tables exist —
```sql
select table_name from information_schema.tables
where table_schema='public'
  and table_name in ('blog_posts','seo_settings','content_queue');
```
Expect 3 rows. If `vector`/`pgcrypto`/`pg_cron` extensions error, enable them for
the project (Database → Extensions) and re-run.

---

## Phase 3 — Seed the config row (the de-branding step)

Open `config/seed-seo-settings.sql`, fill in the values from Phase 0
(`name`, `site_url`, `blog_theme`, `target_audience_summary`, language, CTA…),
then run it. This single row is what makes the engine "this site's".

If you don't yet have the brand facts, **ask the user** (see the SITE_NAME /
audience / language questions in `plugin.json`). Do not seed placeholders and
walk away — a placeholder config produces placeholder content.

**Verify:** `select config->>'name', config->>'site_url' from seo_settings;`
returns the real values (exactly one row).

---

## Phase 4 — Set edge-function secrets

Set every secret for the chosen modules (`plugin.json → secrets`,
`docs/.env.example`). At minimum: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
`LOVABLE_API_KEY`, `PUBLIC_SITE_URL`, `SITE_NAME`.

- CLI: `supabase secrets set KEY=value ...`
- Dashboard: Settings → Edge Functions → Secrets.

`SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` are auto-injected in Supabase's
runtime, but set them explicitly if your deploy path needs them.

If `LOVABLE_API_KEY` is missing and the site is **not** on Lovable, ask which
provider to use, then change the `fetch("https://ai.gateway.lovable.dev/...")`
call + auth header in the `generate-*` and `*-agent` functions accordingly.

**Verify:** `supabase secrets list` shows the keys (values masked).

---

## Phase 5 — Deploy the edge functions

Deploy each function for the chosen modules:
```
supabase functions deploy generate-article
supabase functions deploy generate-headlines
supabase functions deploy generate-blog-image
supabase functions deploy reschedule-by-topic
# + chosen optional-module functions (see plugin.json)
```

**Verify (smoke test the engine):** call `generate-headlines` and confirm you get
ideas back:
```
curl -sS -X POST "https://<PROJECT_REF>.supabase.co/functions/v1/generate-headlines" \
  -H "Authorization: Bearer <SERVICE_ROLE_KEY>" -H "Content-Type: application/json" \
  -d '{"count":3}'
```
Expect a JSON list of headlines. Then generate ONE article end-to-end and check a
`blog_posts` row appears. If it errors on `LOVABLE_API_KEY`, revisit Phase 4.

---

## Phase 6 — (Autopilot only) schedule it

1. Store the service-role key in Vault (once, with the real key — never commit):
   ```sql
   select vault.create_secret('<SERVICE_ROLE_KEY>', 'service_role_key');
   ```
2. Copy `0004_autopilot_cron.sql.template` → `0004_autopilot_cron.sql`, replace
   `__PROJECT_REF__`, and run it.
3. Confirm the schedule with the user first (default: nightly 04:00 UTC publish +
   Monday 03:00 UTC planning). Adjust cron expressions to their timezone/volume.

**Verify:** `select jobname, schedule, active from cron.job;` lists
`autopilot-nightly` + `autopilot-weekly-pipeline`. Optionally trigger a manual run
(`autopilot-run` with `{"mode":"full_pipeline"}`) and check `job_runs` +
`content_queue` populate.

> Autopilot's strategy/headline/gap steps read `gsc_snapshots`. If there's no
> Search Console feed (`fetch-gsc-data` is **not** included), tell the user the
> autopilot will run but with weaker keyword targeting until GSC data exists.

---

## Phase 7 — Wire the frontend & de-brand

1. Add routes for the pages you copied (see README "Wire the routes"). Admin
   routes: AdminBlog, AdminBlogEditor, AdminBlogGenerate, AdminContentHub,
   AdminSettings, AdminTaxonomy, AdminQueueManager, AdminCalendar (+ AdminGlossary,
   AdminContentBuckets, AdminAutopilot, AdminJobs, AdminSeoHub per module).
2. Swap `@/components/Navbar` and `@/components/Footer` imports for the host's.
3. Stub or replace the b2b-specific imports flagged in `docs/INVENTORY.md`
   (`GroeistackLeadCapture`, `@/content/copy` `BOOKING_URL`, etc.).
4. Run the **frontend de-brand checklist**:
   ```
   grep -rinE "b2bgroei|groeimachine|groeistack" src/
   ```
   Replace hardcoded page titles/canonicals/pillars. Recommended: make them read
   from `useSeoSettings()` (`config.name`, `config.site_url`) so the next site
   needs zero frontend edits.

**Verify:** the app builds (`npm run build` / host build), `/blog` renders the
seeded posts, and `/admin/settings` loads the config row.

---

## Done — report back

Summarize to the user: which modules were installed, which secrets you set, the
smoke-test results (headlines + one article), the autopilot schedule (if any),
and any remaining manual steps (Navbar/Footer swap, GSC feed, email infra for
give-aways). List anything you had to ask about and what's still open.
