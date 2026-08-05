-- ============================================================================
-- Blog & Content Kit — Row Level Security
-- ----------------------------------------------------------------------------
-- Model:
--   * Edge functions run with the SERVICE ROLE key and bypass RLS entirely,
--     so all writes (generation, lead capture, pipeline moves) go through them.
--   * The public site uses the ANON key and may only READ published content.
--
-- If you also expose an authenticated admin UI that writes directly with the
-- user's token (instead of via edge functions), add admin write policies keyed
-- on your own role check (e.g. a has_role(auth.uid(), 'admin') function).
-- ============================================================================

-- Enable RLS on every table --------------------------------------------------
alter table public.seo_settings           enable row level security;
alter table public.content_topics         enable row level security;
alter table public.blog_categories        enable row level security;
alter table public.blog_posts             enable row level security;
alter table public.content_queue          enable row level security;
alter table public.content_refresh_queue  enable row level security;
alter table public.content_entities       enable row level security;
alter table public.glossary_terms         enable row level security;
alter table public.glossary_runs          enable row level security;
alter table public.content_buckets        enable row level security;
alter table public.content_bucket_items   enable row level security;
alter table public.content_bucket_leads   enable row level security;
alter table public.link_targets           enable row level security;
alter table public.link_suggestions       enable row level security;
alter table public.page_embeddings        enable row level security;

-- Public READ of published content ------------------------------------------
create policy "public read published posts" on public.blog_posts
  for select using (status = 'published');

create policy "public read categories" on public.blog_categories
  for select using (true);

create policy "public read topics" on public.content_topics
  for select using (true);

create policy "public read published glossary" on public.glossary_terms
  for select using (status = 'published');

create policy "public read published buckets" on public.content_buckets
  for select using (is_published = true);

create policy "public read published bucket items" on public.content_bucket_items
  for select using (status = 'published');

create policy "public read entities" on public.content_entities
  for select using (true);

-- Everything else (seo_settings, queues, leads, runs, link_*, embeddings,
-- glossary_runs) has RLS enabled with NO public policy => not readable or
-- writable with the anon key. Access is exclusively via service-role edge
-- functions. Add narrower policies here if a specific table needs public read.
