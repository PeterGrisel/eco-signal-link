
ALTER TABLE public.abm_pages
  ADD COLUMN IF NOT EXISTS pdf_url text,
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS brand_primary_hsl text,
  ADD COLUMN IF NOT EXISTS brand_glow_hsl text,
  ADD COLUMN IF NOT EXISTS brand_primary_hex text,
  ADD COLUMN IF NOT EXISTS brand_glow_hex text,
  ADD COLUMN IF NOT EXISTS og_image_url text,
  ADD COLUMN IF NOT EXISTS hero_headline text,
  ADD COLUMN IF NOT EXISTS hero_subline text,
  ADD COLUMN IF NOT EXISTS intro text;

-- Default expires_at far in future for new generated pages
ALTER TABLE public.abm_pages
  ALTER COLUMN expires_at SET DEFAULT (now() + interval '2 years');
