
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. link_targets
CREATE TABLE public.link_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  target_url text NOT NULL,
  target_type text NOT NULL DEFAULT 'page',
  priority integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_link_targets_active ON public.link_targets(active, priority DESC);
CREATE INDEX idx_link_targets_keyword_lower ON public.link_targets(lower(keyword));

GRANT SELECT ON public.link_targets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.link_targets TO authenticated;
GRANT ALL ON public.link_targets TO service_role;

ALTER TABLE public.link_targets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active link targets"
  ON public.link_targets FOR SELECT
  USING (active = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage link targets"
  ON public.link_targets FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_link_targets_updated
  BEFORE UPDATE ON public.link_targets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. keyword_opportunities
CREATE TABLE public.keyword_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL,
  page text,
  position numeric,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  suggested_action text NOT NULL DEFAULT 'add_internal_link',
  status text NOT NULL DEFAULT 'open',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_kw_opp_status ON public.keyword_opportunities(status, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.keyword_opportunities TO authenticated;
GRANT ALL ON public.keyword_opportunities TO service_role;

ALTER TABLE public.keyword_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage keyword opportunities"
  ON public.keyword_opportunities FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_keyword_opp_updated
  BEFORE UPDATE ON public.keyword_opportunities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. link_suggestions
CREATE TABLE public.link_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url text NOT NULL,
  target_url text NOT NULL,
  score numeric NOT NULL DEFAULT 0,
  reason text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(source_url, target_url)
);
CREATE INDEX idx_link_sugg_status ON public.link_suggestions(status, score DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.link_suggestions TO authenticated;
GRANT ALL ON public.link_suggestions TO service_role;

ALTER TABLE public.link_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage link suggestions"
  ON public.link_suggestions FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_link_sugg_updated
  BEFORE UPDATE ON public.link_suggestions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. page_embeddings
CREATE TABLE public.page_embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url text NOT NULL UNIQUE,
  page_type text NOT NULL DEFAULT 'blog',
  title text,
  content_hash text,
  embedding vector(1536),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_page_embeddings_hnsw ON public.page_embeddings
  USING hnsw (embedding vector_cosine_ops);
CREATE INDEX idx_page_embeddings_type ON public.page_embeddings(page_type);

GRANT SELECT ON public.page_embeddings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_embeddings TO authenticated;
GRANT ALL ON public.page_embeddings TO service_role;

ALTER TABLE public.page_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read page embeddings"
  ON public.page_embeddings FOR SELECT USING (true);

CREATE POLICY "Admins manage page embeddings"
  ON public.page_embeddings FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 5. job_runs
CREATE TABLE public.job_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_key text NOT NULL,
  status text NOT NULL DEFAULT 'success',
  message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  duration_ms integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_job_runs_key_time ON public.job_runs(job_key, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_runs TO authenticated;
GRANT ALL ON public.job_runs TO service_role;

ALTER TABLE public.job_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage job runs"
  ON public.job_runs FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed link_targets met sectoren, solutions en glossary (top-prio)
INSERT INTO public.link_targets (keyword, target_url, target_type, priority) VALUES
  ('signaalgebaseerde prospecting', '/oplossingen/signaalgebaseerde-prospecting', 'solution', 100),
  ('multichannel sequencing', '/oplossingen/multichannel-sequencing', 'solution', 90),
  ('linkedin outreach', '/oplossingen/linkedin-outreach', 'solution', 90),
  ('hubspot pipeline', '/oplossingen/hubspot-pipeline', 'solution', 80),
  ('icp ai', '/oplossingen/icp-ai', 'solution', 80),
  ('full service recruitment', '/oplossingen/full-service-recruitment', 'solution', 70),
  ('full sales management', '/oplossingen/full-sales-management', 'solution', 70),
  ('groothandel', '/sectoren/groothandel', 'sector', 60),
  ('maakindustrie', '/sectoren/maakindustrie', 'sector', 60),
  ('engineering', '/sectoren/engineering', 'sector', 60),
  ('zakelijke dienstverlening', '/sectoren/zakelijke-dienstverlening', 'sector', 60),
  ('it en software', '/sectoren/it-software', 'sector', 60),
  ('bouw', '/sectoren/bouw', 'sector', 60),
  ('financiele sector', '/sectoren/financiele-sector', 'sector', 60),
  ('profvoetbal', '/sectoren/profvoetbal', 'sector', 60),
  ('leasemaatschappijen', '/sectoren/leasemaatschappijen', 'sector', 60);
