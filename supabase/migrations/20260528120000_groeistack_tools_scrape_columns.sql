-- Schema-fix: groeistack_tools is eerder aangemaakt zonder deze kolommen,
-- maar groeistack-scrape verwacht ze. Idempotent toevoegen.
ALTER TABLE public.groeistack_tools
  ADD COLUMN IF NOT EXISTS source_url text,
  ADD COLUMN IF NOT EXISTS last_scraped_at timestamptz;
