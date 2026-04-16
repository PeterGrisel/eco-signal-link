-- Seed conversion_pages so the conversion_clicks KPI is actually computable.
-- fetch-gsc-data/index.ts matches GSC page URLs against this table; an empty
-- table means conversion_clicks is always 0 regardless of real traffic.

ALTER TABLE public.conversion_pages
  ADD CONSTRAINT conversion_pages_url_key UNIQUE (url);

INSERT INTO public.conversion_pages (url, label, is_active) VALUES
  ('/contact',  'Contactformulier',      true),
  ('/pricing',  'Pricing configurator',  true),
  ('/signaal',  'Signaal tool',          true)
ON CONFLICT (url) DO NOTHING;
