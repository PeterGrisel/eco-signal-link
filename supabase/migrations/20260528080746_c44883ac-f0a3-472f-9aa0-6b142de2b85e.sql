-- Add scheduling + run log for playbook autopilot
ALTER TABLE public.playbook_scenarios
  ADD COLUMN IF NOT EXISTS scheduled_date date;

CREATE INDEX IF NOT EXISTS idx_playbook_scenarios_scheduled
  ON public.playbook_scenarios(scheduled_date) WHERE scheduled_date IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.playbook_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  scenario_id uuid,
  playbook_id uuid,
  status text NOT NULL,
  message text,
  log jsonb DEFAULT '[]'::jsonb
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.playbook_runs TO authenticated;
GRANT ALL ON public.playbook_runs TO service_role;

ALTER TABLE public.playbook_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage playbook runs"
  ON public.playbook_runs FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_playbook_runs_created ON public.playbook_runs(created_at DESC);