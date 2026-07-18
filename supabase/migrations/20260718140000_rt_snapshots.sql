-- ============================================================================
-- REBEL FORCE GTM RUNTIME — snapshots + skill-flags (opdracht v3, deel C)
--   rt_snapshots: gepersisteerde skill-resultaten (cache + telemetrie-bron)
--   rt_skills:    tenant_callable / persist_snapshot / snapshot_ttl_hours
--   cleanup:      pg_cron (03:00 UTC) -> Edge Function rt-snapshot-cleanup
-- ============================================================================

-- ============ 1. TABEL ============

CREATE TABLE IF NOT EXISTS public.rt_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.gp_organizations(id) ON DELETE CASCADE,
  skill_key text NOT NULL,
  provider_key text,
  query_input jsonb NOT NULL,
  input_hash text NOT NULL,
  payload jsonb,                  -- tot ~1 MB inline
  storage_path text,              -- groter: Storage bucket 'rt-snapshots'
  row_count integer,
  step_run_id uuid REFERENCES public.rt_step_runs(id) ON DELETE SET NULL,
  expires_at timestamptz NOT NULL DEFAULT now() + interval '7 days',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rt_snapshots_org_skill_idx
  ON public.rt_snapshots(organization_id, skill_key, created_at DESC);
CREATE INDEX IF NOT EXISTS rt_snapshots_org_hash_idx
  ON public.rt_snapshots(organization_id, input_hash, expires_at);
CREATE INDEX IF NOT EXISTS rt_snapshots_expires_idx
  ON public.rt_snapshots(expires_at);

GRANT SELECT ON public.rt_snapshots TO authenticated;
GRANT ALL ON public.rt_snapshots TO service_role;

ALTER TABLE public.rt_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rt snapshots read" ON public.rt_snapshots FOR SELECT TO authenticated
  USING (public.gp_can_access_org(auth.uid(), organization_id));
CREATE POLICY "rt snapshots rf write" ON public.rt_snapshots FOR ALL TO authenticated
  USING (public.gp_is_rebel_force(auth.uid())) WITH CHECK (public.gp_is_rebel_force(auth.uid()));

-- ============ 2. SKILL-FLAGS ============

ALTER TABLE public.rt_skills
  ADD COLUMN IF NOT EXISTS tenant_callable boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS persist_snapshot boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS snapshot_ttl_hours integer; -- NULL = default 168 (7 dagen)

-- Lees-skills mogen door tenants worden aangeroepen en cachen hun resultaat.
-- Schrijf-skills (push_to_sequence, sync_crm, generate_message) blijven false.
UPDATE public.rt_skills
SET tenant_callable = true, persist_snapshot = true
WHERE skill_key IN ('search_companies', 'find_contacts', 'enrich_company');

-- ============ 3. STORAGE BUCKET (private) ============

INSERT INTO storage.buckets (id, name, public)
VALUES ('rt-snapshots', 'rt-snapshots', false)
ON CONFLICT (id) DO NOTHING;

-- ============ 4. CLEANUP-CRON ============
-- Dagelijks 03:00 UTC -> Edge Function rt-snapshot-cleanup (verwijdert
-- verlopen snapshots incl. Storage-objecten, logt in job_runs).
-- De functie eist x-rt-internal-token; de cron leest die uit Vault-secret
-- 'rt/internal-token' — zet die dus met dezelfde waarde als env
-- RT_INTERNAL_TOKEN (zie handmatige checklist).

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

DO $$
BEGIN
  PERFORM cron.unschedule('rt-snapshot-cleanup-daily');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule(
  'rt-snapshot-cleanup-daily',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://sdhsblejnzfacqafzbuc.supabase.co/functions/v1/rt-snapshot-cleanup',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-rt-internal-token',
      coalesce((SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'rt/internal-token'), '')
    ),
    body := '{}'::jsonb
  );
  $$
);
