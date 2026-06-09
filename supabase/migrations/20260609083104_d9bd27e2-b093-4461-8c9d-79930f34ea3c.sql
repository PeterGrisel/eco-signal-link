
-- 1. authority_websites
CREATE TABLE public.authority_websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  description TEXT,
  main_proposition TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.authority_websites TO authenticated;
GRANT ALL ON public.authority_websites TO service_role;
ALTER TABLE public.authority_websites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage authority_websites" ON public.authority_websites FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_authority_websites_updated BEFORE UPDATE ON public.authority_websites FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. authority_context_profiles
CREATE TABLE public.authority_context_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES public.authority_websites(id) ON DELETE CASCADE,
  proposition TEXT,
  icp JSONB NOT NULL DEFAULT '[]'::jsonb,
  core_topics JSONB NOT NULL DEFAULT '[]'::jsonb,
  secondary_topics JSONB NOT NULL DEFAULT '[]'::jsonb,
  sectors JSONB NOT NULL DEFAULT '[]'::jsonb,
  differentiators JSONB NOT NULL DEFAULT '[]'::jsonb,
  money_pages JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommended_pages JSONB NOT NULL DEFAULT '[]'::jsonb,
  linkable_assets JSONB NOT NULL DEFAULT '[]'::jsonb,
  negative_keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  raw_summary TEXT,
  context_version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX authority_context_profiles_website_idx ON public.authority_context_profiles(website_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.authority_context_profiles TO authenticated;
GRANT ALL ON public.authority_context_profiles TO service_role;
ALTER TABLE public.authority_context_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage authority_context_profiles" ON public.authority_context_profiles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_authority_context_profiles_updated BEFORE UPDATE ON public.authority_context_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. authority_target_pages
CREATE TABLE public.authority_target_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES public.authority_websites(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  page_type TEXT,
  topic TEXT,
  sector TEXT,
  priority INT NOT NULL DEFAULT 50,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX authority_target_pages_website_idx ON public.authority_target_pages(website_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.authority_target_pages TO authenticated;
GRANT ALL ON public.authority_target_pages TO service_role;
ALTER TABLE public.authority_target_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage authority_target_pages" ON public.authority_target_pages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. authority_queries
CREATE TABLE public.authority_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES public.authority_websites(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  cluster TEXT,
  intent TEXT,
  priority INT NOT NULL DEFAULT 50,
  status TEXT NOT NULL DEFAULT 'active',
  last_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX authority_queries_website_idx ON public.authority_queries(website_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.authority_queries TO authenticated;
GRANT ALL ON public.authority_queries TO service_role;
ALTER TABLE public.authority_queries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage authority_queries" ON public.authority_queries FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. authority_runs
CREATE TABLE public.authority_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES public.authority_websites(id) ON DELETE CASCADE,
  run_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  queries_count INT NOT NULL DEFAULT 0,
  urls_discovered INT NOT NULL DEFAULT 0,
  opportunities_created INT NOT NULL DEFAULT 0,
  opportunities_rejected INT NOT NULL DEFAULT 0,
  high_priority_count INT NOT NULL DEFAULT 0,
  error TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX authority_runs_website_idx ON public.authority_runs(website_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.authority_runs TO authenticated;
GRANT ALL ON public.authority_runs TO service_role;
ALTER TABLE public.authority_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage authority_runs" ON public.authority_runs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. authority_crawled_pages
CREATE TABLE public.authority_crawled_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES public.authority_websites(id) ON DELETE CASCADE,
  discovery_run_id UUID REFERENCES public.authority_runs(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  domain TEXT,
  status_code INT,
  title TEXT,
  meta_description TEXT,
  h1 TEXT,
  h2 JSONB NOT NULL DEFAULT '[]'::jsonb,
  text_excerpt TEXT,
  canonical_url TEXT,
  robots_allowed BOOLEAN,
  indexable BOOLEAN,
  outbound_link_count INT NOT NULL DEFAULT 0,
  internal_link_count INT NOT NULL DEFAULT 0,
  emails JSONB NOT NULL DEFAULT '[]'::jsonb,
  contact_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  html_hash TEXT,
  last_crawled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX authority_crawled_pages_url_idx ON public.authority_crawled_pages(website_id, url);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.authority_crawled_pages TO authenticated;
GRANT ALL ON public.authority_crawled_pages TO service_role;
ALTER TABLE public.authority_crawled_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage authority_crawled_pages" ON public.authority_crawled_pages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 7. authority_opportunities
CREATE TABLE public.authority_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES public.authority_websites(id) ON DELETE CASCADE,
  discovery_run_id UUID REFERENCES public.authority_runs(id) ON DELETE SET NULL,
  crawled_page_id UUID REFERENCES public.authority_crawled_pages(id) ON DELETE SET NULL,
  source_url TEXT NOT NULL,
  source_domain TEXT,
  source_title TEXT,
  opportunity_type TEXT,
  page_type TEXT,
  topic TEXT,
  sector TEXT,
  suggested_target_url TEXT,
  suggested_anchor TEXT,
  anchor_type TEXT,
  relevance_reason TEXT,
  recommended_action TEXT,
  asset_needed BOOLEAN NOT NULL DEFAULT FALSE,
  asset_suggestion TEXT,
  context_fit INT NOT NULL DEFAULT 0,
  sector_fit INT NOT NULL DEFAULT 0,
  page_type_fit INT NOT NULL DEFAULT 0,
  authority_score INT NOT NULL DEFAULT 0,
  placement_probability INT NOT NULL DEFAULT 0,
  commercial_value INT NOT NULL DEFAULT 0,
  risk_score INT NOT NULL DEFAULT 0,
  priority_score INT NOT NULL DEFAULT 0,
  outreach_subject TEXT,
  outreach_body TEXT,
  status TEXT NOT NULL DEFAULT 'discovered',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX authority_opportunities_url_idx ON public.authority_opportunities(website_id, source_url);
CREATE INDEX authority_opportunities_status_idx ON public.authority_opportunities(website_id, status, priority_score DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.authority_opportunities TO authenticated;
GRANT ALL ON public.authority_opportunities TO service_role;
ALTER TABLE public.authority_opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage authority_opportunities" ON public.authority_opportunities FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_authority_opportunities_updated BEFORE UPDATE ON public.authority_opportunities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. authority_assets
CREATE TABLE public.authority_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES public.authority_websites(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  asset_type TEXT,
  suggested_slug TEXT,
  target_url TEXT,
  topic TEXT,
  sector TEXT,
  status TEXT NOT NULL DEFAULT 'idea',
  backlink_pitch TEXT,
  internal_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX authority_assets_website_idx ON public.authority_assets(website_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.authority_assets TO authenticated;
GRANT ALL ON public.authority_assets TO service_role;
ALTER TABLE public.authority_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage authority_assets" ON public.authority_assets FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_authority_assets_updated BEFORE UPDATE ON public.authority_assets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. authority_placements
CREATE TABLE public.authority_placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES public.authority_websites(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES public.authority_opportunities(id) ON DELETE SET NULL,
  placement_url TEXT NOT NULL,
  target_url TEXT NOT NULL,
  expected_anchor TEXT,
  actual_anchor TEXT,
  rel_attribute TEXT,
  link_found BOOLEAN NOT NULL DEFAULT FALSE,
  status_code INT,
  indexable BOOLEAN,
  canonical_url TEXT,
  first_seen_at TIMESTAMPTZ,
  last_checked_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX authority_placements_website_idx ON public.authority_placements(website_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.authority_placements TO authenticated;
GRANT ALL ON public.authority_placements TO service_role;
ALTER TABLE public.authority_placements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage authority_placements" ON public.authority_placements FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_authority_placements_updated BEFORE UPDATE ON public.authority_placements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
