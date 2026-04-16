-- /pipeline-equation hosts the Pipeline Score calculator (lead magnet).
-- Missed it in the initial seed; add it so clicks on this page count
-- toward conversion_clicks.

INSERT INTO public.conversion_pages (url, label, is_active) VALUES
  ('/pipeline-equation', 'Pipeline Score calculator', true)
ON CONFLICT (url) DO NOTHING;
