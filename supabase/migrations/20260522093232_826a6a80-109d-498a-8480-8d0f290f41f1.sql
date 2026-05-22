INSERT INTO public.site_pages (path, label, changefreq, priority, is_active)
VALUES
  ('/sectoren/bouw-en-renovatie', 'Sector: Bouw en renovatie', 'monthly', 0.7, true),
  ('/sectoren/technische-dienstverlening', 'Sector: Technische dienstverlening', 'monthly', 0.7, true)
ON CONFLICT (path) DO UPDATE SET is_active = true, label = EXCLUDED.label;