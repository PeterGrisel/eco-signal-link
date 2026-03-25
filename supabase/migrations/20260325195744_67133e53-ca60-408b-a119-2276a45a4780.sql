
-- GSC keyword performance snapshots
CREATE TABLE public.gsc_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  query text NOT NULL,
  page text,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  ctr numeric(5,4) DEFAULT 0,
  position numeric(6,2) DEFAULT 0,
  device text DEFAULT 'all',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(date, query, page, device)
);

-- Conversion pages configuration
CREATE TABLE public.conversion_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  label text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Monthly evaluation reports
CREATE TABLE public.monthly_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month date NOT NULL UNIQUE,
  total_impressions integer DEFAULT 0,
  total_clicks integer DEFAULT 0,
  avg_ctr numeric(5,4) DEFAULT 0,
  avg_position numeric(6,2) DEFAULT 0,
  conversion_clicks integer DEFAULT 0,
  articles_published integer DEFAULT 0,
  top_keywords jsonb DEFAULT '[]'::jsonb,
  topic_performance jsonb DEFAULT '[]'::jsonb,
  recommendations jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.gsc_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversion_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage gsc_snapshots" ON public.gsc_snapshots FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage conversion_pages" ON public.conversion_pages FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage monthly_evaluations" ON public.monthly_evaluations FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
