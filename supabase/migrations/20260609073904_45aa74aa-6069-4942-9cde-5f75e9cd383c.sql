
CREATE TABLE public.semrush_backlinks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url text NOT NULL,
  target_url text NOT NULL,
  source_domain text,
  anchor text,
  page_ascore numeric,
  nofollow boolean DEFAULT false,
  first_seen timestamptz NOT NULL DEFAULT now(),
  last_seen timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(source_url, target_url)
);

CREATE INDEX idx_semrush_backlinks_status ON public.semrush_backlinks(status, last_seen DESC);
CREATE INDEX idx_semrush_backlinks_first_seen ON public.semrush_backlinks(first_seen DESC);

GRANT SELECT ON public.semrush_backlinks TO authenticated;
GRANT ALL ON public.semrush_backlinks TO service_role;
ALTER TABLE public.semrush_backlinks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read backlinks" ON public.semrush_backlinks
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_semrush_backlinks_updated
  BEFORE UPDATE ON public.semrush_backlinks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


CREATE TABLE public.semrush_kw_positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  captured_at timestamptz NOT NULL DEFAULT now(),
  keyword text NOT NULL,
  url text NOT NULL,
  position integer NOT NULL,
  volume integer,
  traffic_pct numeric,
  database_code text DEFAULT 'nl'
);

CREATE INDEX idx_semrush_kw_pos_captured ON public.semrush_kw_positions(captured_at DESC);
CREATE INDEX idx_semrush_kw_pos_keyword ON public.semrush_kw_positions(keyword, captured_at DESC);

GRANT SELECT ON public.semrush_kw_positions TO authenticated;
GRANT ALL ON public.semrush_kw_positions TO service_role;
ALTER TABLE public.semrush_kw_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read positions" ON public.semrush_kw_positions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));


CREATE TABLE public.semrush_sync_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status text NOT NULL DEFAULT 'running',
  target_domain text NOT NULL,
  authority_score numeric,
  total_backlinks integer,
  total_refdomains integer,
  new_backlinks integer DEFAULT 0,
  lost_backlinks integer DEFAULT 0,
  rising_pages integer DEFAULT 0,
  error text
);

CREATE INDEX idx_semrush_sync_runs_started ON public.semrush_sync_runs(started_at DESC);

GRANT SELECT ON public.semrush_sync_runs TO authenticated;
GRANT ALL ON public.semrush_sync_runs TO service_role;
ALTER TABLE public.semrush_sync_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read sync runs" ON public.semrush_sync_runs
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
