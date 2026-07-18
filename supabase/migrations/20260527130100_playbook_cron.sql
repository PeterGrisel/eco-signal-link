-- Dagelijkse playbook-generatie (volautomatisch publiceren).
-- Draait om 06:00 UTC.
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

DO $$
BEGIN
  PERFORM cron.unschedule('generate-playbook-daily');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule(
  'generate-playbook-daily',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://sdhsblejnzfacqafzbuc.supabase.co/functions/v1/generate-playbook',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
