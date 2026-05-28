
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE TABLE IF NOT EXISTS public.groeistack_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL DEFAULT '',
  website text NOT NULL,
  logo_url text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  link_status text,
  source_url text,
  last_checked_at timestamptz,
  last_scraped_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (website)
);

GRANT SELECT ON public.groeistack_tools TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.groeistack_tools TO authenticated;
GRANT ALL ON public.groeistack_tools TO service_role;

ALTER TABLE public.groeistack_tools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read published tools" ON public.groeistack_tools;
CREATE POLICY "Anyone can read published tools"
  ON public.groeistack_tools FOR SELECT
  USING (published = true OR has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can manage tools" ON public.groeistack_tools;
CREATE POLICY "Admins can manage tools"
  ON public.groeistack_tools FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP TRIGGER IF EXISTS set_groeistack_tools_updated_at ON public.groeistack_tools;
CREATE TRIGGER set_groeistack_tools_updated_at
  BEFORE UPDATE ON public.groeistack_tools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_groeistack_tools_category_sort
  ON public.groeistack_tools (category, sort_order);
