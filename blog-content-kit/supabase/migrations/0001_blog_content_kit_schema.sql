-- ============================================================================
-- Blog & Content Kit — consolidated schema
-- ----------------------------------------------------------------------------
-- Single, readable schema for the portable blog/content module. This reflects
-- the CURRENT shape of the tables (consolidated from the origin project's
-- incremental migrations), so a fresh Supabase project can stand the whole
-- module up in one run.
--
-- Load order: run this file first, then 0002_rls_policies.sql, then
-- config/seed-seo-settings.sql.
--
-- Security model: all AI generation and lead capture happens in edge functions
-- that use the SERVICE ROLE key (which bypasses RLS). The frontend only ever
-- READS published content with the anon key. RLS (0002) therefore grants public
-- read of published rows and leaves all writes to the service role.
-- ============================================================================

-- Extensions -----------------------------------------------------------------
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "vector";      -- page_embeddings.embedding (pgvector)

-- Enums ----------------------------------------------------------------------
do $$ begin
  create type public.blog_post_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.content_type as enum ('article', 'tool', 'video', 'pseo');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.content_queue_status as enum
    ('pending', 'approved', 'declined', 'generating', 'published', 'failed');
exception when duplicate_object then null; end $$;

-- Shared updated_at trigger --------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ============================================================================
-- CORE (minimum needed to run the blog + article generation)
-- ============================================================================

-- Site-wide configuration. The single source of truth that de-brands the whole
-- engine. Exactly one row; everything is inside the `config` JSONB (see
-- config/seed-seo-settings.sql for the shape).
create table if not exists public.seo_settings (
  id          uuid primary key default gen_random_uuid(),
  config      jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger seo_settings_set_updated_at before update on public.seo_settings
  for each row execute function public.set_updated_at();

-- Content pillars / topic tree. Blog posts and the queue hang off these.
create table if not exists public.content_topics (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  slug                  text not null unique,
  description           text,
  parent_id             uuid references public.content_topics(id) on delete set null,
  priority              integer,
  sort_order            integer not null default 0,
  status                text default 'active',
  target_article_count  integer,
  target_keywords       text[],
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create trigger content_topics_set_updated_at before update on public.content_topics
  for each row execute function public.set_updated_at();

create table if not exists public.blog_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  content          text not null default '',
  excerpt          text,
  meta_description text,
  featured_image   text,
  status           public.blog_post_status not null default 'draft',
  is_featured      boolean not null default false,
  cta_variant      text,
  author_id        uuid,
  category_id      uuid references public.blog_categories(id) on delete set null,
  topic_id         uuid references public.content_topics(id) on delete set null,
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists blog_posts_status_idx      on public.blog_posts(status);
create index if not exists blog_posts_published_at_idx on public.blog_posts(published_at desc);
create index if not exists blog_posts_category_idx     on public.blog_posts(category_id);
create trigger blog_posts_set_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- Editorial pipeline: proposed / approved / generated headlines become posts.
create table if not exists public.content_queue (
  id             uuid primary key default gen_random_uuid(),
  headline       text not null,
  keyword        text,
  content_type   public.content_type not null default 'article',
  status         public.content_queue_status not null default 'pending',
  scheduled_date date,
  topic_id       uuid references public.content_topics(id) on delete set null,
  blog_post_id   uuid references public.blog_posts(id) on delete set null,
  notes          text,
  error_message  text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists content_queue_status_idx on public.content_queue(status);
create trigger content_queue_set_updated_at before update on public.content_queue
  for each row execute function public.set_updated_at();

-- ============================================================================
-- OPTIONAL MODULE: content refresh (re-write stale posts on a signal)
-- Used by reschedule-by-topic / content-cleanup.
-- ============================================================================
create table if not exists public.content_refresh_queue (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null,
  reason          text not null,
  priority        text not null default 'normal',
  status          text not null default 'pending',
  signal_data     jsonb not null default '{}'::jsonb,
  last_updated_at timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create trigger content_refresh_queue_set_updated_at before update on public.content_refresh_queue
  for each row execute function public.set_updated_at();

-- ============================================================================
-- OPTIONAL MODULE: entity SEO (surface named entities for schema.org)
-- ============================================================================
create table if not exists public.content_entities (
  id          uuid primary key default gen_random_uuid(),
  entity_name text not null,
  entity_type text not null,
  slug        text not null,
  confidence  numeric not null default 1,
  created_at  timestamptz not null default now()
);

-- ============================================================================
-- OPTIONAL MODULE: glossary / "woordenboek" (generate-glossary)
-- ============================================================================
create table if not exists public.glossary_terms (
  id               uuid primary key default gen_random_uuid(),
  term             text not null,
  slug             text not null unique,
  short_def        text not null default '',
  content          text not null default '',
  category         text,
  meta_description text,
  related_terms    text[] not null default '{}',
  status           text not null default 'draft',
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create trigger glossary_terms_set_updated_at before update on public.glossary_terms
  for each row execute function public.set_updated_at();

-- Run log for the glossary generator (observability in AdminGlossary).
create table if not exists public.glossary_runs (
  id         uuid primary key default gen_random_uuid(),
  term_id    uuid references public.glossary_terms(id) on delete set null,
  status     text not null,
  message    text,
  log        jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- OPTIONAL MODULE: gated content "buckets" / give-aways
-- (generate-bucket-item, content-bucket-request, content-bucket-confirm)
-- NOTE: the request/confirm functions call an `enqueue_email` RPC + an email
-- queue. That transactional-email infra is a SEPARATE module — see docs/INVENTORY.md.
-- ============================================================================
create table if not exists public.content_buckets (
  id                      uuid primary key default gen_random_uuid(),
  name                    text not null,
  slug                    text not null unique,
  tagline                 text,
  description             text,
  cta_text                text,
  accent_color            text,
  default_layouts         text[],
  generator_schema        jsonb,
  generator_system_prompt text,
  is_published            boolean not null default false,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);
create trigger content_buckets_set_updated_at before update on public.content_buckets
  for each row execute function public.set_updated_at();

create table if not exists public.content_bucket_items (
  id          uuid primary key default gen_random_uuid(),
  bucket_id   uuid not null references public.content_buckets(id) on delete cascade,
  title       text not null,
  slug        text not null,
  subtitle    text,
  intro       text,
  layout      text not null,
  payload     jsonb not null default '{}'::jsonb,
  position    integer not null default 0,
  category    text,
  slot_label  text,
  type_label  text,
  cta_text    text,
  cta_url     text,
  is_bonus    boolean default false,
  status      text not null default 'draft',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (bucket_id, slug)
);
create trigger content_bucket_items_set_updated_at before update on public.content_bucket_items
  for each row execute function public.set_updated_at();

create table if not exists public.content_bucket_leads (
  id            uuid primary key default gen_random_uuid(),
  bucket_id     uuid not null references public.content_buckets(id) on delete cascade,
  item_id       uuid references public.content_bucket_items(id) on delete set null,
  email         text not null,
  name          text,
  company       text,
  utm           jsonb,
  status        text not null default 'pending',
  confirm_token text not null default gen_random_uuid(),
  ip_hash       text,
  user_agent    text,
  confirmed_at  timestamptz,
  delivered_at  timestamptz,
  created_at    timestamptz not null default now()
);
create index if not exists content_bucket_leads_token_idx on public.content_bucket_leads(confirm_token);

-- ============================================================================
-- OPTIONAL MODULE: internal linking + semantic embeddings
-- (smart-internal-linker, generate-page-embeddings, orphan-link-detector)
-- ============================================================================
create table if not exists public.link_targets (
  id           uuid primary key default gen_random_uuid(),
  keyword      text not null,
  target_url   text not null,
  target_type  text not null default 'page',
  pillar_slugs text[] not null default '{}',
  priority     integer not null default 0,
  active       boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger link_targets_set_updated_at before update on public.link_targets
  for each row execute function public.set_updated_at();

create table if not exists public.link_suggestions (
  id          uuid primary key default gen_random_uuid(),
  source_url  text not null,
  target_url  text not null,
  anchor_text text,
  anchor_type text not null default 'exact',
  score       numeric not null default 0,
  reason      text,
  status      text not null default 'pending',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger link_suggestions_set_updated_at before update on public.link_suggestions
  for each row execute function public.set_updated_at();

-- Semantic index over pages. embedding dimension = your model's output
-- (1536 for OpenAI text-embedding-3-small). Adjust if you use another model.
create table if not exists public.page_embeddings (
  id           uuid primary key default gen_random_uuid(),
  page_url     text not null unique,
  page_type    text not null default 'blog',
  title        text,
  content_hash text,
  embedding    vector(1536),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger page_embeddings_set_updated_at before update on public.page_embeddings
  for each row execute function public.set_updated_at();
