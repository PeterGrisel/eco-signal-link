ALTER TABLE public.client_logos
  ADD COLUMN IF NOT EXISTS sector text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS blog_slug text,
  ADD COLUMN IF NOT EXISTS website text;