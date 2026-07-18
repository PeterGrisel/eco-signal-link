-- ============================================================================
-- SEED-UPDATE: Core-Vision — limieten, telemetrie en extra credentials
-- (opdracht v3, deel J). Idempotent; vult de bestaande seed
-- 20260718120000_seed_tenant_core_vision.sql aan.
-- ============================================================================

-- Config aanvullen: dag-limiet voor tenant-skill-calls en telemetrie aan.
-- Shallow jsonb-merge: 'limits' en 'telemetry' zijn nieuwe top-level keys,
-- bestaande keys (policies, provider_preferences, source_context) blijven.
UPDATE public.rt_tenant_playbooks tp
SET config = coalesce(tp.config, '{}'::jsonb)
  || jsonb_build_object(
       'limits', coalesce(tp.config->'limits', '{}'::jsonb)
         || jsonb_build_object('daily_tenant_skill_calls', 25),
       'telemetry', coalesce(tp.config->'telemetry', '{}'::jsonb)
         || jsonb_build_object('enabled', true)
     )
FROM public.gp_organizations o
WHERE tp.organization_id = o.id AND o.slug = 'core-vision';

-- Credential-referenties voor de telemetrie-providers (secrets handmatig in
-- Vault zetten: tenants/core-vision/stairoids en tenants/core-vision/planable).
INSERT INTO public.rt_provider_credentials (organization_id, provider_id, credential_reference, status)
SELECT o.id, p.id, c.reference, 'active'
FROM (VALUES
  ('stairoids', 'vault://tenants/core-vision/stairoids'),
  ('planable',  'vault://tenants/core-vision/planable')
) AS c(provider_key, reference)
JOIN public.gp_organizations o ON o.slug = 'core-vision'
JOIN public.rt_providers p ON p.provider_key = c.provider_key
ON CONFLICT (organization_id, provider_id) WHERE organization_id IS NOT NULL DO NOTHING;
