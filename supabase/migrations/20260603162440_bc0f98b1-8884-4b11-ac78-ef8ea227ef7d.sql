CREATE TABLE public.abm_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'live',
  expires_at TIMESTAMPTZ NOT NULL,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT abm_pages_status_check CHECK (status IN ('live','expired','archived'))
);

CREATE INDEX abm_pages_slug_idx ON public.abm_pages(slug);
CREATE INDEX abm_pages_status_expires_idx ON public.abm_pages(status, expires_at);

GRANT SELECT ON public.abm_pages TO anon;
GRANT SELECT ON public.abm_pages TO authenticated;
GRANT ALL ON public.abm_pages TO service_role;

ALTER TABLE public.abm_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read live abm pages"
  ON public.abm_pages FOR SELECT
  TO anon, authenticated
  USING (status = 'live' AND expires_at > now());

CREATE POLICY "Admins manage abm pages"
  ON public.abm_pages FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_abm_pages_updated_at
  BEFORE UPDATE ON public.abm_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Increment view count safely from anon
CREATE OR REPLACE FUNCTION public.increment_abm_view(_slug TEXT)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.abm_pages
  SET view_count = view_count + 1
  WHERE slug = _slug AND status = 'live' AND expires_at > now();
$$;

GRANT EXECUTE ON FUNCTION public.increment_abm_view(TEXT) TO anon, authenticated;