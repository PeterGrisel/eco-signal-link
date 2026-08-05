-- ============================================================================
-- Blog & Content Kit — Autopilot module schema
-- ----------------------------------------------------------------------------
-- Tables that let the backend run itself: a run log, Search Console snapshots
-- that feed strategy/headline/gap decisions, a Google indexing request log, and
-- a fixed-pages table used by the gap miner + sitemap.
--
-- Load AFTER 0001 + 0002. Then load 0004_autopilot_cron.sql.template (filled in)
-- to actually schedule it.
--
-- Data flow:
--   fetch-gsc-data (external, needs Google OAuth) --> gsc_snapshots
--   strategy-agent  reads gsc_snapshots + blog_posts --> topic clusters
--   generate-headlines reads gsc_snapshots --> content_queue
--   gap-keyword-miner reads gsc_snapshots + site_pages --> content_queue
--   autopilot-run orchestrates all of the above and logs to job_runs
-- Everything degrades gracefully when gsc_snapshots is empty.
-- ============================================================================

do $$ begin
  create type public.indexing_status as enum ('pending', 'requested', 'indexed', 'failed');
exception when duplicate_object then null; end $$;

-- Run log for every autopilot / scheduled job (surfaced in AdminJobs).
create table if not exists public.job_runs (
  id          uuid primary key default gen_random_uuid(),
  job_key     text not null,
  status      text not null default 'running',
  message     text,
  metadata    jsonb,
  started_at  timestamptz not null default now(),
  finished_at timestamptz,
  duration_ms integer,
  created_at  timestamptz not null default now()
);
create index if not exists job_runs_job_key_idx on public.job_runs(job_key, created_at desc);

-- Google Search Console snapshots (query/page performance). Populate via a
-- fetch-gsc-data function (needs Google Search Console OAuth) or manual import.
create table if not exists public.gsc_snapshots (
  id          uuid primary key default gen_random_uuid(),
  date        date not null,
  query       text not null,
  page        text,
  device      text,
  clicks      numeric,
  impressions numeric,
  ctr         numeric,
  position    numeric,
  created_at  timestamptz not null default now()
);
create index if not exists gsc_snapshots_date_idx  on public.gsc_snapshots(date desc);
create index if not exists gsc_snapshots_query_idx on public.gsc_snapshots(query);

-- Google indexing request log (autopilot pings this after publishing).
create table if not exists public.indexing_requests (
  id               uuid primary key default gen_random_uuid(),
  url              text not null,
  status           public.indexing_status not null default 'pending',
  requested_at     timestamptz,
  indexed_at       timestamptz,
  response_message text,
  created_at       timestamptz not null default now()
);
create index if not exists indexing_requests_status_idx on public.indexing_requests(status);

-- Fixed (non-blog) pages: consumed by the gap miner (to avoid proposing dupes)
-- and by the sitemap function.
create table if not exists public.site_pages (
  id         uuid primary key default gen_random_uuid(),
  label      text not null,
  path       text not null,
  priority   numeric not null default 0.5,
  changefreq text not null default 'weekly',
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger site_pages_set_updated_at before update on public.site_pages
  for each row execute function public.set_updated_at();

-- RLS: run logs / GSC / indexing are service-role only. site_pages is public-read
-- (the sitemap needs it) but service-write.
alter table public.job_runs          enable row level security;
alter table public.gsc_snapshots     enable row level security;
alter table public.indexing_requests enable row level security;
alter table public.site_pages        enable row level security;

create policy "public read active site pages" on public.site_pages
  for select using (is_active = true);
