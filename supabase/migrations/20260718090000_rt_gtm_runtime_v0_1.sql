-- ============================================================================
-- REBEL FORCE GTM RUNTIME v0.1
-- Migration: rt_* orchestrator-laag bovenop bestaand gp_* schema
-- Principes:
--   gp_ = commerciele werkelijkheid (accounts, contacts, signals, campaigns)
--   rt_ = uitvoering, configuratie en orchestration
--   Geen duplicatie van gp_-domeindata. Tenantbron = gp_organizations.
--   RLS via bestaande gp_can_access_org() en gp_is_rebel_force().
--   Credentials bevatten UITSLUITEND een secret reference (Supabase Vault),
--   nooit plaintext.
-- ============================================================================

-- ============ 1. SKILL REGISTRY ============

CREATE TABLE public.rt_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_key text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  category text NOT NULL, -- data_sourcing | enrichment | verification | scoring | messaging | activation | crm | signal
  status text NOT NULL DEFAULT 'active', -- active | deprecated | disabled
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX rt_skills_status_idx ON public.rt_skills(status);

CREATE TABLE public.rt_skill_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id uuid NOT NULL REFERENCES public.rt_skills(id) ON DELETE CASCADE,
  version text NOT NULL,
  input_schema jsonb NOT NULL,
  output_schema jsonb NOT NULL,
  -- implementation types: n8n_webhook | supabase_edge_function | internal_worker
  -- secrets als vault-reference, nooit plaintext:
  --   {"type":"n8n_webhook","url_secret":"vault://n8n/search-companies"}
  --   {"type":"supabase_edge_function","function":"enrich-client"}
  implementation jsonb NOT NULL,
  requires_approval boolean NOT NULL DEFAULT false,
  timeout_seconds integer NOT NULL DEFAULT 60,
  estimated_cost numeric,
  status text NOT NULL DEFAULT 'active', -- draft | active | deprecated
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(skill_id, version)
);
CREATE INDEX rt_skill_versions_skill_idx ON public.rt_skill_versions(skill_id, status);

-- ============ 2. PROVIDERS & ROUTING ============

CREATE TABLE public.rt_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_key text NOT NULL UNIQUE,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'active', -- active | degraded | disabled
  capabilities text[] NOT NULL DEFAULT '{}',
  config jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.rt_provider_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id uuid NOT NULL REFERENCES public.rt_skills(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES public.rt_providers(id) ON DELETE CASCADE,
  priority integer NOT NULL DEFAULT 100,
  quality_score numeric NOT NULL DEFAULT 0.5,
  coverage_score numeric NOT NULL DEFAULT 0.5,
  relative_cost numeric NOT NULL DEFAULT 0.5,
  countries text[],
  industries text[],
  is_active boolean NOT NULL DEFAULT true,
  UNIQUE(skill_id, provider_id)
);
CREATE INDEX rt_provider_routes_skill_idx ON public.rt_provider_routes(skill_id, is_active, priority);

-- organization_id NULL = platform-credential van Rebel Force (shared seat).
-- Gevuld = klant-eigen credential. Executor: eerst tenant, dan platform-fallback.
CREATE TABLE public.rt_provider_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.gp_organizations(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES public.rt_providers(id) ON DELETE CASCADE,
  credential_reference text NOT NULL, -- vault://... — NOOIT de key zelf
  status text NOT NULL DEFAULT 'active', -- active | revoked | expired
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
-- unique per (org, provider); aparte partial index voor platform-credentials (org IS NULL)
CREATE UNIQUE INDEX rt_provider_credentials_org_provider_uq
  ON public.rt_provider_credentials(organization_id, provider_id)
  WHERE organization_id IS NOT NULL;
CREATE UNIQUE INDEX rt_provider_credentials_platform_uq
  ON public.rt_provider_credentials(provider_id)
  WHERE organization_id IS NULL;
CREATE INDEX rt_provider_credentials_org_idx ON public.rt_provider_credentials(organization_id, status);

-- ============ 3. PLAYBOOKS ============
-- NB: naamconflict met bestaande public.playbooks (content/SEO) bewust vermeden via rt_ prefix.

CREATE TABLE public.rt_playbooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playbook_key text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  category text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.rt_playbook_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playbook_id uuid NOT NULL REFERENCES public.rt_playbooks(id) ON DELETE CASCADE,
  version text NOT NULL,
  input_schema jsonb NOT NULL,
  status text NOT NULL DEFAULT 'draft', -- draft | active | deprecated
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(playbook_id, version)
);
CREATE INDEX rt_playbook_versions_pb_idx ON public.rt_playbook_versions(playbook_id, status);

CREATE TABLE public.rt_playbook_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playbook_version_id uuid NOT NULL REFERENCES public.rt_playbook_versions(id) ON DELETE CASCADE,
  step_key text NOT NULL,
  name text NOT NULL,
  step_order integer NOT NULL,
  step_type text NOT NULL, -- skill | human_approval
  skill_version_id uuid REFERENCES public.rt_skill_versions(id) ON DELETE RESTRICT,
  depends_on text[] NOT NULL DEFAULT '{}',
  config jsonb,
  retry_policy jsonb, -- {"max_attempts":3,"backoff_seconds":30}
  UNIQUE(playbook_version_id, step_key)
);
CREATE INDEX rt_playbook_steps_pv_idx ON public.rt_playbook_steps(playbook_version_id, step_order);

CREATE TABLE public.rt_tenant_playbooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.gp_organizations(id) ON DELETE CASCADE,
  playbook_id uuid NOT NULL REFERENCES public.rt_playbooks(id) ON DELETE CASCADE,
  pinned_version_id uuid REFERENCES public.rt_playbook_versions(id) ON DELETE SET NULL,
  config jsonb, -- tenant-overrides: limieten, kanalen, provider-voorkeuren
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(organization_id, playbook_id)
);
CREATE INDEX rt_tenant_playbooks_org_idx ON public.rt_tenant_playbooks(organization_id, is_active);

-- ============ 4. EXECUTION ============

CREATE TABLE public.rt_workflow_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.gp_organizations(id) ON DELETE CASCADE,
  playbook_version_id uuid NOT NULL REFERENCES public.rt_playbook_versions(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'queued',
  -- queued | running | waiting_for_approval | approved | rejected
  -- | revision_required | completed | failed | cancelled
  input jsonb NOT NULL,
  output jsonb,
  current_step_key text,
  cost_total numeric NOT NULL DEFAULT 0,
  started_at timestamptz,
  finished_at timestamptz,
  error jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX rt_workflow_runs_org_status_idx ON public.rt_workflow_runs(organization_id, status);
CREATE INDEX rt_workflow_runs_created_idx ON public.rt_workflow_runs(created_at DESC);

-- organization_id gedenormaliseerd voor eenvoudige RLS en snelle queries.
CREATE TABLE public.rt_step_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_run_id uuid NOT NULL REFERENCES public.rt_workflow_runs(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.gp_organizations(id) ON DELETE CASCADE,
  playbook_step_id uuid NOT NULL REFERENCES public.rt_playbook_steps(id) ON DELETE RESTRICT,
  skill_version_id uuid REFERENCES public.rt_skill_versions(id) ON DELETE SET NULL,
  provider_id uuid REFERENCES public.rt_providers(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'queued',
  -- queued | running | waiting_for_approval | succeeded | failed | skipped | cancelled
  attempt integer NOT NULL DEFAULT 1,
  input jsonb,
  input_hash text, -- idempotency: zelfde hash + succeeded => niet opnieuw uitvoeren
  output jsonb,
  confidence numeric,
  cost numeric,
  latency_ms integer,
  started_at timestamptz,
  finished_at timestamptz,
  error jsonb, -- {"code":"...","message":"...","retryable":true}
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX rt_step_runs_run_idx ON public.rt_step_runs(workflow_run_id, status);
CREATE INDEX rt_step_runs_org_idx ON public.rt_step_runs(organization_id, created_at DESC);
CREATE INDEX rt_step_runs_hash_idx ON public.rt_step_runs(input_hash) WHERE input_hash IS NOT NULL;
CREATE INDEX rt_step_runs_skill_idx ON public.rt_step_runs(skill_version_id);

-- ============ 5. APPROVALS ============

CREATE TABLE public.rt_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.gp_organizations(id) ON DELETE CASCADE,
  workflow_run_id uuid NOT NULL REFERENCES public.rt_workflow_runs(id) ON DELETE CASCADE,
  step_run_id uuid NOT NULL REFERENCES public.rt_step_runs(id) ON DELETE CASCADE,
  approval_type text NOT NULL, -- account_list | campaign_angle | messages | campaign_launch
  status text NOT NULL DEFAULT 'pending', -- pending | approved | rejected | revision_required
  payload jsonb NOT NULL,
  decision_notes text,
  approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX rt_approvals_org_status_idx ON public.rt_approvals(organization_id, status);
CREATE INDEX rt_approvals_run_idx ON public.rt_approvals(workflow_run_id);

-- ============ 6. OBSERVABILITY ============

CREATE TABLE public.rt_provider_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.gp_organizations(id) ON DELETE CASCADE,
  workflow_run_id uuid REFERENCES public.rt_workflow_runs(id) ON DELETE SET NULL,
  step_run_id uuid REFERENCES public.rt_step_runs(id) ON DELETE SET NULL,
  provider_id uuid REFERENCES public.rt_providers(id) ON DELETE SET NULL,
  skill_version_id uuid REFERENCES public.rt_skill_versions(id) ON DELETE SET NULL,
  endpoint text,
  status text NOT NULL, -- success | failed | timeout | rate_limited
  http_status integer,
  latency_ms integer,
  cost numeric,
  tokens integer,
  credits numeric,
  error jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX rt_provider_calls_org_time_idx ON public.rt_provider_calls(organization_id, created_at DESC);
CREATE INDEX rt_provider_calls_provider_idx ON public.rt_provider_calls(provider_id, created_at DESC);
CREATE INDEX rt_provider_calls_step_idx ON public.rt_provider_calls(step_run_id);

CREATE TABLE public.rt_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.gp_organizations(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_type text NOT NULL DEFAULT 'user', -- user | system | executor
  action text NOT NULL, -- run_started | approval_decided | credential_rotated | ...
  entity_type text,
  entity_id uuid,
  detail jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX rt_audit_logs_org_time_idx ON public.rt_audit_logs(organization_id, created_at DESC);
CREATE INDEX rt_audit_logs_entity_idx ON public.rt_audit_logs(entity_type, entity_id);

-- ============ 7. GRANTS ============

GRANT SELECT ON public.rt_skills, public.rt_skill_versions, public.rt_providers,
  public.rt_provider_routes, public.rt_playbooks, public.rt_playbook_versions,
  public.rt_playbook_steps TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rt_skills, public.rt_skill_versions,
  public.rt_providers, public.rt_provider_routes, public.rt_provider_credentials,
  public.rt_playbooks, public.rt_playbook_versions, public.rt_playbook_steps,
  public.rt_tenant_playbooks, public.rt_workflow_runs, public.rt_step_runs,
  public.rt_approvals TO authenticated;
GRANT SELECT ON public.rt_provider_calls, public.rt_audit_logs TO authenticated;
GRANT ALL ON public.rt_skills, public.rt_skill_versions, public.rt_providers,
  public.rt_provider_routes, public.rt_provider_credentials, public.rt_playbooks,
  public.rt_playbook_versions, public.rt_playbook_steps, public.rt_tenant_playbooks,
  public.rt_workflow_runs, public.rt_step_runs, public.rt_approvals,
  public.rt_provider_calls, public.rt_audit_logs TO service_role;

-- ============ 8. RLS ============

ALTER TABLE public.rt_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rt_skill_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rt_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rt_provider_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rt_provider_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rt_playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rt_playbook_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rt_playbook_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rt_tenant_playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rt_workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rt_step_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rt_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rt_provider_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rt_audit_logs ENABLE ROW LEVEL SECURITY;

-- Registry: iedereen (authenticated) leest, alleen Rebel Force schrijft.
CREATE POLICY "rt skills read" ON public.rt_skills FOR SELECT TO authenticated USING (true);
CREATE POLICY "rt skills rf write" ON public.rt_skills FOR ALL TO authenticated
  USING (public.gp_is_rebel_force(auth.uid())) WITH CHECK (public.gp_is_rebel_force(auth.uid()));

CREATE POLICY "rt skill versions read" ON public.rt_skill_versions FOR SELECT TO authenticated USING (true);
CREATE POLICY "rt skill versions rf write" ON public.rt_skill_versions FOR ALL TO authenticated
  USING (public.gp_is_rebel_force(auth.uid())) WITH CHECK (public.gp_is_rebel_force(auth.uid()));

CREATE POLICY "rt providers read" ON public.rt_providers FOR SELECT TO authenticated USING (true);
CREATE POLICY "rt providers rf write" ON public.rt_providers FOR ALL TO authenticated
  USING (public.gp_is_rebel_force(auth.uid())) WITH CHECK (public.gp_is_rebel_force(auth.uid()));

CREATE POLICY "rt routes read" ON public.rt_provider_routes FOR SELECT TO authenticated USING (true);
CREATE POLICY "rt routes rf write" ON public.rt_provider_routes FOR ALL TO authenticated
  USING (public.gp_is_rebel_force(auth.uid())) WITH CHECK (public.gp_is_rebel_force(auth.uid()));

CREATE POLICY "rt playbooks read" ON public.rt_playbooks FOR SELECT TO authenticated USING (true);
CREATE POLICY "rt playbooks rf write" ON public.rt_playbooks FOR ALL TO authenticated
  USING (public.gp_is_rebel_force(auth.uid())) WITH CHECK (public.gp_is_rebel_force(auth.uid()));

CREATE POLICY "rt pb versions read" ON public.rt_playbook_versions FOR SELECT TO authenticated USING (true);
CREATE POLICY "rt pb versions rf write" ON public.rt_playbook_versions FOR ALL TO authenticated
  USING (public.gp_is_rebel_force(auth.uid())) WITH CHECK (public.gp_is_rebel_force(auth.uid()));

CREATE POLICY "rt pb steps read" ON public.rt_playbook_steps FOR SELECT TO authenticated USING (true);
CREATE POLICY "rt pb steps rf write" ON public.rt_playbook_steps FOR ALL TO authenticated
  USING (public.gp_is_rebel_force(auth.uid())) WITH CHECK (public.gp_is_rebel_force(auth.uid()));

-- Credentials: uitsluitend Rebel Force. Klanten zien nooit credential-records.
CREATE POLICY "rt credentials rf only" ON public.rt_provider_credentials FOR ALL TO authenticated
  USING (public.gp_is_rebel_force(auth.uid())) WITH CHECK (public.gp_is_rebel_force(auth.uid()));

-- Tenant-scoped: klant leest eigen data, Rebel Force alles. Schrijven = RF.
CREATE POLICY "rt tenant playbooks read" ON public.rt_tenant_playbooks FOR SELECT TO authenticated
  USING (public.gp_can_access_org(auth.uid(), organization_id));
CREATE POLICY "rt tenant playbooks rf write" ON public.rt_tenant_playbooks FOR ALL TO authenticated
  USING (public.gp_is_rebel_force(auth.uid())) WITH CHECK (public.gp_is_rebel_force(auth.uid()));

CREATE POLICY "rt runs read" ON public.rt_workflow_runs FOR SELECT TO authenticated
  USING (public.gp_can_access_org(auth.uid(), organization_id));
CREATE POLICY "rt runs rf write" ON public.rt_workflow_runs FOR ALL TO authenticated
  USING (public.gp_is_rebel_force(auth.uid())) WITH CHECK (public.gp_is_rebel_force(auth.uid()));

CREATE POLICY "rt step runs read" ON public.rt_step_runs FOR SELECT TO authenticated
  USING (public.gp_can_access_org(auth.uid(), organization_id));
CREATE POLICY "rt step runs rf write" ON public.rt_step_runs FOR ALL TO authenticated
  USING (public.gp_is_rebel_force(auth.uid())) WITH CHECK (public.gp_is_rebel_force(auth.uid()));

-- Approvals: klant mag lezen EN beslissen (status/notes updaten), RF mag alles.
CREATE POLICY "rt approvals read" ON public.rt_approvals FOR SELECT TO authenticated
  USING (public.gp_can_access_org(auth.uid(), organization_id));
CREATE POLICY "rt approvals decide" ON public.rt_approvals FOR UPDATE TO authenticated
  USING (public.gp_can_access_org(auth.uid(), organization_id))
  WITH CHECK (public.gp_can_access_org(auth.uid(), organization_id));
CREATE POLICY "rt approvals rf write" ON public.rt_approvals FOR ALL TO authenticated
  USING (public.gp_is_rebel_force(auth.uid())) WITH CHECK (public.gp_is_rebel_force(auth.uid()));

-- Kosten- en auditdata: v0.1 alleen Rebel Force.
CREATE POLICY "rt provider calls rf" ON public.rt_provider_calls FOR SELECT TO authenticated
  USING (public.gp_is_rebel_force(auth.uid()));
CREATE POLICY "rt audit rf" ON public.rt_audit_logs FOR SELECT TO authenticated
  USING (public.gp_is_rebel_force(auth.uid()));

-- ============ 9. UPDATED_AT TRIGGERS ============

CREATE TRIGGER rt_credentials_updated BEFORE UPDATE ON public.rt_provider_credentials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER rt_tenant_playbooks_updated BEFORE UPDATE ON public.rt_tenant_playbooks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ 10. SEED: PROVIDERS ============

INSERT INTO public.rt_providers (provider_key, name, capabilities) VALUES
  ('apollo',    'Apollo.io',  ARRAY['company_data','contact_data','signals','sequencer']),
  ('pipedrive', 'Pipedrive',  ARRAY['crm']),
  ('hubspot',   'HubSpot',    ARRAY['crm','sequencer']),
  ('heyreach',  'HeyReach',   ARRAY['linkedin_sequencer']),
  ('anthropic', 'Anthropic',  ARRAY['ai_scoring','ai_messaging','ai_classification'])
ON CONFLICT (provider_key) DO NOTHING;

-- ============ 11. SEED: SKILLS + v1.0.0 ============
-- Implementation-referenties zijn placeholders: url_secret verwijst naar Vault,
-- vullen bij registratie van de echte n8n-webhooks / Edge Functions.

INSERT INTO public.rt_skills (skill_key, name, description, category) VALUES
  ('search_companies', 'Search companies', 'Zoek accounts op ICP-criteria via een dataprovider', 'data_sourcing'),
  ('enrich_company',   'Enrich company',   'Verrijk een account met firmographics en context', 'enrichment'),
  ('find_contacts',    'Find contacts',    'Vind beslissers bij een account op functietitel', 'data_sourcing'),
  ('verify_email',     'Verify email',     'Verifieer e-mailadressen (verified/risky/invalid)', 'verification'),
  ('score_account',    'Score account',    'Scoor een account tegen de tenant-ICP (AI)', 'scoring'),
  ('generate_message', 'Generate message', 'Genereer gepersonaliseerde outreach (AI)', 'messaging'),
  ('push_to_sequence', 'Push to sequence', 'Plaats contacten in een e-mail/LinkedIn-sequence', 'activation'),
  ('sync_crm',         'Sync CRM',         'Schrijf accounts/contacten/leads naar het CRM van de tenant', 'crm')
ON CONFLICT (skill_key) DO NOTHING;

INSERT INTO public.rt_skill_versions (skill_id, version, input_schema, output_schema, implementation, requires_approval, timeout_seconds)
SELECT s.id, '1.0.0', v.input_schema::jsonb, v.output_schema::jsonb, v.implementation::jsonb, v.requires_approval, v.timeout_seconds
FROM (VALUES
  ('search_companies',
   '{"type":"object","required":["country"],"properties":{"country":{"type":"string"},"industries":{"type":"array","items":{"type":"string"}},"employee_min":{"type":"integer"},"employee_max":{"type":"integer"},"target_count":{"type":"integer","default":100}},"additionalProperties":false}',
   '{"type":"object","required":["accounts"],"properties":{"accounts":{"type":"array","items":{"type":"object","required":["name"],"properties":{"name":{"type":"string"},"domain":{"type":"string"},"industry":{"type":"string"},"country":{"type":"string"},"employee_range":{"type":"string"},"source_provider":{"type":"string"},"external_ids":{"type":"object"}}}}}}',
   '{"type":"n8n_webhook","url_secret":"vault://n8n/search-companies"}', false, 300),
  ('enrich_company',
   '{"type":"object","required":["domain"],"properties":{"domain":{"type":"string"},"account_id":{"type":"string"}},"additionalProperties":false}',
   '{"type":"object","properties":{"industry":{"type":"string"},"employee_range":{"type":"string"},"description":{"type":"string"},"technologies":{"type":"array","items":{"type":"string"}},"source_provider":{"type":"string"},"external_ids":{"type":"object"}}}',
   '{"type":"supabase_edge_function","function":"enrich-client"}', false, 120),
  ('find_contacts',
   '{"type":"object","required":["company_domain","roles"],"properties":{"company_domain":{"type":"string"},"roles":{"type":"array","items":{"type":"string"}},"max_contacts":{"type":"integer","default":3}},"additionalProperties":false}',
   '{"type":"object","required":["contacts"],"properties":{"contacts":{"type":"array","items":{"type":"object","required":["first_name","last_name"],"properties":{"first_name":{"type":"string"},"last_name":{"type":"string"},"title":{"type":"string"},"email":{"type":["string","null"]},"email_status":{"type":["string","null"]},"linkedin_url":{"type":["string","null"]},"phone":{"type":["string","null"]},"source_provider":{"type":"string"},"external_ids":{"type":"object"}}}}}}',
   '{"type":"n8n_webhook","url_secret":"vault://n8n/find-contacts"}', false, 180),
  ('verify_email',
   '{"type":"object","required":["emails"],"properties":{"emails":{"type":"array","items":{"type":"string"}}},"additionalProperties":false}',
   '{"type":"object","required":["results"],"properties":{"results":{"type":"array","items":{"type":"object","required":["email","status"],"properties":{"email":{"type":"string"},"status":{"type":"string","enum":["verified","risky","invalid","unknown"]},"source_provider":{"type":"string"}}}}}}',
   '{"type":"n8n_webhook","url_secret":"vault://n8n/verify-email"}', false, 120),
  ('score_account',
   '{"type":"object","required":["account","icp_context"],"properties":{"account":{"type":"object"},"icp_context":{"type":"string"}},"additionalProperties":false}',
   '{"type":"object","required":["score","reasons","disqualifiers"],"properties":{"score":{"type":"integer","minimum":0,"maximum":100},"reasons":{"type":"array","items":{"type":"string"}},"disqualifiers":{"type":"array","items":{"type":"string"}}},"additionalProperties":false}',
   '{"type":"supabase_edge_function","function":"rt-score-account"}', false, 60),
  ('generate_message',
   '{"type":"object","required":["contact","account","proposition","tone_of_voice"],"properties":{"contact":{"type":"object"},"account":{"type":"object"},"proposition":{"type":"string"},"tone_of_voice":{"type":"string"},"channel":{"type":"string","enum":["email","linkedin"]}},"additionalProperties":false}',
   '{"type":"object","required":["subject","body"],"properties":{"subject":{"type":["string","null"]},"body":{"type":"string"},"angle":{"type":"string"}}}',
   '{"type":"supabase_edge_function","function":"rt-generate-message"}', true, 60),
  ('push_to_sequence',
   '{"type":"object","required":["contacts","sequence_ref"],"properties":{"contacts":{"type":"array","items":{"type":"object"}},"sequence_ref":{"type":"string"},"channel":{"type":"string","enum":["email","linkedin"]}},"additionalProperties":false}',
   '{"type":"object","required":["pushed"],"properties":{"pushed":{"type":"integer"},"failed":{"type":"integer"},"sequence_id":{"type":"string"}}}',
   '{"type":"n8n_webhook","url_secret":"vault://n8n/push-to-sequence"}', true, 300),
  ('sync_crm',
   '{"type":"object","required":["entity_type","records"],"properties":{"entity_type":{"type":"string","enum":["account","contact","lead","deal"]},"records":{"type":"array","items":{"type":"object"}},"crm":{"type":"string","enum":["pipedrive","hubspot"]}},"additionalProperties":false}',
   '{"type":"object","required":["synced"],"properties":{"synced":{"type":"integer"},"failed":{"type":"integer"},"external_ids":{"type":"array","items":{"type":"object"}}}}',
   '{"type":"n8n_webhook","url_secret":"vault://n8n/sync-crm"}', false, 300)
) AS v(skill_key, input_schema, output_schema, implementation, requires_approval, timeout_seconds)
JOIN public.rt_skills s ON s.skill_key = v.skill_key
ON CONFLICT (skill_id, version) DO NOTHING;

-- ============ 12. SEED: PROVIDER ROUTES (deterministisch, v0.1) ============

INSERT INTO public.rt_provider_routes (skill_id, provider_id, priority, quality_score, coverage_score, relative_cost)
SELECT s.id, p.id, r.priority, r.q, r.c, r.rc
FROM (VALUES
  ('search_companies','apollo',   10, 0.8, 0.8, 0.4),
  ('enrich_company',  'apollo',   10, 0.7, 0.8, 0.4),
  ('find_contacts',   'apollo',   10, 0.8, 0.8, 0.4),
  ('verify_email',    'apollo',   10, 0.6, 0.7, 0.3),
  ('score_account',   'anthropic',10, 0.9, 1.0, 0.2),
  ('generate_message','anthropic',10, 0.9, 1.0, 0.2),
  ('push_to_sequence','heyreach', 10, 0.8, 0.7, 0.3),
  ('push_to_sequence','hubspot',  20, 0.7, 0.7, 0.3),
  ('sync_crm',        'pipedrive',10, 0.9, 0.9, 0.1),
  ('sync_crm',        'hubspot',  20, 0.9, 0.9, 0.1)
) AS r(skill_key, provider_key, priority, q, c, rc)
JOIN public.rt_skills s ON s.skill_key = r.skill_key
JOIN public.rt_providers p ON p.provider_key = r.provider_key
ON CONFLICT (skill_id, provider_id) DO NOTHING;

-- ============ 13. SEED: EERSTE PLAYBOOK outbound_market_activation v1.0.0 ============

INSERT INTO public.rt_playbooks (playbook_key, name, description, category) VALUES
  ('outbound_market_activation', 'Outbound Market Activation',
   'Van marktdefinitie naar goedgekeurde en geactiveerde outbound-campagne', 'outbound')
ON CONFLICT (playbook_key) DO NOTHING;

INSERT INTO public.rt_playbook_versions (playbook_id, version, input_schema, status)
SELECT id, '1.0.0',
  '{"type":"object","required":["country","target_count"],"properties":{"country":{"type":"string"},"industries":{"type":"array","items":{"type":"string"}},"employee_min":{"type":"integer"},"employee_max":{"type":"integer"},"roles":{"type":"array","items":{"type":"string"}},"target_count":{"type":"integer"}},"additionalProperties":false}'::jsonb,
  'draft'
FROM public.rt_playbooks WHERE playbook_key = 'outbound_market_activation'
ON CONFLICT (playbook_id, version) DO NOTHING;

INSERT INTO public.rt_playbook_steps (playbook_version_id, step_key, name, step_order, step_type, skill_version_id, depends_on, retry_policy)
SELECT pv.id, st.step_key, st.name, st.step_order, st.step_type,
       sv.id,
       st.depends_on::text[],
       '{"max_attempts":3,"backoff_seconds":30}'::jsonb
FROM public.rt_playbook_versions pv
JOIN public.rt_playbooks pb ON pb.id = pv.playbook_id AND pb.playbook_key = 'outbound_market_activation' AND pv.version = '1.0.0'
CROSS JOIN (VALUES
  ('find_accounts',    'Accounts zoeken',        1,  'skill',          'search_companies', '{}'),
  ('enrich_accounts',  'Accounts verrijken',     2,  'skill',          'enrich_company',   '{find_accounts}'),
  ('score_accounts',   'Accounts scoren',        3,  'skill',          'score_account',    '{enrich_accounts}'),
  ('approve_accounts', 'Accountlijst goedkeuren',4,  'human_approval', NULL,               '{score_accounts}'),
  ('find_contacts',    'Contacten vinden',       5,  'skill',          'find_contacts',    '{approve_accounts}'),
  ('verify_emails',    'E-mails verifieren',     6,  'skill',          'verify_email',     '{find_contacts}'),
  ('generate_messages','Berichten genereren',    7,  'skill',          'generate_message', '{verify_emails}'),
  ('approve_messages', 'Berichten goedkeuren',   8,  'human_approval', NULL,               '{generate_messages}'),
  ('activate',         'Sequence activeren',     9,  'skill',          'push_to_sequence', '{approve_messages}'),
  ('sync',             'CRM bijwerken',          10, 'skill',          'sync_crm',         '{activate}')
) AS st(step_key, name, step_order, step_type, skill_key, depends_on)
LEFT JOIN public.rt_skills sk ON sk.skill_key = st.skill_key
LEFT JOIN public.rt_skill_versions sv ON sv.skill_id = sk.id AND sv.version = '1.0.0'
ON CONFLICT (playbook_version_id, step_key) DO NOTHING;

-- ============================================================================
-- OVERZICHT
-- Nieuwe tabellen (14):
--   Registry:   rt_skills, rt_skill_versions, rt_providers, rt_provider_routes,
--               rt_provider_credentials
--   Playbooks:  rt_playbooks, rt_playbook_versions, rt_playbook_steps,
--               rt_tenant_playbooks
--   Execution:  rt_workflow_runs, rt_step_runs, rt_approvals
--   Observ.:    rt_provider_calls, rt_audit_logs
--
-- Relaties (kern):
--   gp_organizations 1—n rt_tenant_playbooks / rt_workflow_runs / rt_approvals
--                        / rt_provider_credentials (nullable = platform)
--   rt_skills 1—n rt_skill_versions 1—n rt_playbook_steps (via skill_version_id)
--   rt_playbooks 1—n rt_playbook_versions 1—n rt_playbook_steps
--   rt_workflow_runs 1—n rt_step_runs 1—n rt_provider_calls
--   rt_step_runs 1—1 rt_approvals (bij human_approval steps)
--
-- RLS-model:
--   Registry: authenticated read, Rebel Force write
--   Credentials: Rebel Force only
--   Tenant-scoped (runs/steps/approvals/tenant_playbooks): gp_can_access_org read,
--     RF write; approvals ook client-UPDATE (beslissen)
--   Kosten/audit: Rebel Force only (v0.1)
--
-- Geen wijzigingen aan bestaande gp_-tabellen: volledig backward compatible.
-- ============================================================================
