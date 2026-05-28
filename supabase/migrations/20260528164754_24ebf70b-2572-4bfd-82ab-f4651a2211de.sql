-- GEO/AI Search infrastructure: entity graph, AI readiness, refresh queue, commercial intent

-- 1. Entity graph
CREATE TABLE public.content_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  entity_name text NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('service','audience','problem','tool','result')),
  confidence numeric NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (slug, entity_name, entity_type)
);

GRANT SELECT ON public.content_entities TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_entities TO authenticated;
GRANT ALL ON public.content_entities TO service_role;

ALTER TABLE public.content_entities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read entities" ON public.content_entities
  FOR SELECT USING (true);
CREATE POLICY "Admins manage entities" ON public.content_entities
  FOR ALL TO authenticated USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

CREATE INDEX idx_content_entities_slug ON public.content_entities(slug);
CREATE INDEX idx_content_entities_type ON public.content_entities(entity_type);

-- 2. AI Citation Readiness
CREATE TABLE public.seo_ai_readiness (
  slug text PRIMARY KEY,
  page_type text NOT NULL DEFAULT 'blog',
  has_answer_block boolean NOT NULL DEFAULT false,
  has_faq boolean NOT NULL DEFAULT false,
  has_schema boolean NOT NULL DEFAULT false,
  has_author_entity boolean NOT NULL DEFAULT false,
  has_recent_date boolean NOT NULL DEFAULT false,
  has_concrete_examples boolean NOT NULL DEFAULT false,
  html_crawlable boolean NOT NULL DEFAULT true,
  internal_links_count int NOT NULL DEFAULT 0,
  ai_readiness_score numeric NOT NULL DEFAULT 0,
  missing_factors jsonb NOT NULL DEFAULT '[]'::jsonb,
  last_scanned_at timestamptz,
  last_refreshed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_ai_readiness TO authenticated;
GRANT ALL ON public.seo_ai_readiness TO service_role;

ALTER TABLE public.seo_ai_readiness ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage ai readiness" ON public.seo_ai_readiness
  FOR ALL TO authenticated USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

CREATE TRIGGER trg_seo_ai_readiness_updated
  BEFORE UPDATE ON public.seo_ai_readiness
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Content refresh queue
CREATE TABLE public.content_refresh_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  reason text NOT NULL,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','done','dismissed')),
  signal_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  last_updated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_refresh_queue TO authenticated;
GRANT ALL ON public.content_refresh_queue TO service_role;

ALTER TABLE public.content_refresh_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage refresh queue" ON public.content_refresh_queue
  FOR ALL TO authenticated USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

CREATE TRIGGER trg_content_refresh_updated
  BEFORE UPDATE ON public.content_refresh_queue
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_refresh_status_priority ON public.content_refresh_queue(status, priority);

-- 4. Commercial intent on seo_action_items
ALTER TABLE public.seo_action_items
  ADD COLUMN IF NOT EXISTS commercial_intent text DEFAULT 'medium' CHECK (commercial_intent IN ('low','medium','high')),
  ADD COLUMN IF NOT EXISTS opportunity_score numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS service_fit text;

-- 5. AI readiness score computation function
CREATE OR REPLACE FUNCTION public.compute_ai_readiness_score(r public.seo_ai_readiness)
RETURNS numeric
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT
    (CASE WHEN r.has_answer_block THEN 20 ELSE 0 END) +
    (CASE WHEN r.has_faq THEN 15 ELSE 0 END) +
    (CASE WHEN r.has_schema THEN 15 ELSE 0 END) +
    (CASE WHEN r.internal_links_count >= 3 THEN 15 ELSE (r.internal_links_count * 5) END) +
    (CASE WHEN r.has_author_entity THEN 10 ELSE 0 END) +
    (CASE WHEN r.has_recent_date THEN 10 ELSE 0 END) +
    (CASE WHEN r.has_concrete_examples THEN 10 ELSE 0 END) +
    (CASE WHEN r.html_crawlable THEN 5 ELSE 0 END)
$$;
