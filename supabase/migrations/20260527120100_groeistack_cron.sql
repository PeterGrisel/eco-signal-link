-- Nachtelijke verversing van De Groeistack (link-check + logo-refresh).
-- Draait om 08:00 UTC = nacht in de VS (03:00 ET / 00:00 PT).
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

DO $$
BEGIN
  PERFORM cron.unschedule('groeistack-refresh-nightly');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule(
  'groeistack-refresh-nightly',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url := 'https://snymrcialncxkcsibkjv.supabase.co/functions/v1/groeistack-refresh',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
