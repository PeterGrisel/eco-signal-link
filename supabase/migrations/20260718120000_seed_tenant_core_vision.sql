-- ============================================================================
-- SEED: Core-Vision B.V. als eerste GTM Runtime testtenant
-- Idempotent: elke sectie is guarded met ON CONFLICT of NOT EXISTS.
-- Credential-referenties zijn vault://-strings — de secrets zelf worden
-- HANDMATIG in Vault gezet (en de bestaande keys geroteerd, want die staan
-- nu plaintext in n8n):
--   tenants/core-vision/apollo, tenants/core-vision/pipedrive,
--   tenants/core-vision/heyreach
-- ============================================================================

-- ============ 1. ORGANISATIE ============

INSERT INTO public.gp_organizations (name, slug, industry, country, status)
VALUES ('Core-Vision B.V.', 'core-vision', 'Embedded systems engineering', 'NL', 'active')
ON CONFLICT (slug) DO NOTHING;

-- ============ 2. ICP ============

INSERT INTO public.gp_icps (organization_id, name, description, target_roles, employee_range, industries)
SELECT o.id,
  'Core-Vision ICP v1',
  'RELEVANT: MKB/midmarket 20-2.000 medewerkers in machinebouw, defensie, rail, '
  || 'satcom/telecom-equipment, agri-tech en safety-equipment, in NL/BE/DE. '
  || 'RUIS: tech giants (Apple, Google, Microsoft), cloud/CDN-partijen (AWS, Cloudflare - anti-edge), '
  || 'telecom-operators (KPN, Ziggo) en mega-corporates in een bewezen vertical '
  || '(bv. Alstom rail, ~38k medewerkers - te groot voor outbound). '
  || 'NUANCE: "IT & Telecom" betekent equipment-makers (zoals ST Engineering iDirect), niet operators.',
  ARRAY['CTO', 'CEO', 'Engineering Manager', 'Head of R&D', 'Hardware Manager'],
  '20-2000',
  ARRAY['machinebouw', 'defensie', 'rail', 'satcom/telecom-equipment', 'agri-tech', 'safety-equipment']
FROM public.gp_organizations o
WHERE o.slug = 'core-vision'
  AND NOT EXISTS (
    SELECT 1 FROM public.gp_icps i
    WHERE i.organization_id = o.id AND i.name = 'Core-Vision ICP v1'
  );

-- ============ 3. PROVIDER-CREDENTIALS (vault-referenties, geen secrets) ============

INSERT INTO public.rt_provider_credentials (organization_id, provider_id, credential_reference, status)
SELECT o.id, p.id, c.reference, 'active'
FROM (VALUES
  ('apollo',    'vault://tenants/core-vision/apollo'),
  ('pipedrive', 'vault://tenants/core-vision/pipedrive'),
  ('heyreach',  'vault://tenants/core-vision/heyreach')
) AS c(provider_key, reference)
JOIN public.gp_organizations o ON o.slug = 'core-vision'
JOIN public.rt_providers p ON p.provider_key = c.provider_key
ON CONFLICT (organization_id, provider_id) WHERE organization_id IS NOT NULL DO NOTHING;

-- ============ 4. PLAYBOOK-ACTIVATIE ============
-- provider_preferences per skill + Apollo-list-IDs als source_context.

INSERT INTO public.rt_tenant_playbooks (organization_id, playbook_id, pinned_version_id, is_active, config)
SELECT o.id, pb.id, pv.id, true,
  jsonb_build_object(
    'template_key', 'standard_b2b_outbound',
    'policies', jsonb_build_object(
      'require_account_approval', true,
      'require_message_approval', true,
      'auto_launch', false,
      'daily_contact_limit', 50
    ),
    'provider_preferences', jsonb_build_object(
      'search_companies', 'apollo',
      'enrich_company',   'apollo',
      'find_contacts',    'apollo',
      'verify_email',     'apollo',
      'push_to_sequence', 'heyreach',
      'sync_crm',         'pipedrive'
    ),
    'source_context', jsonb_build_object(
      'apollo_lists', jsonb_build_object(
        'website_visitors', '6a0d8e23ed0be00014498ece',
        'email_engagers',   '6a0c98c26abb990001c60592'
      ),
      'n8n_workflows', jsonb_build_object(
        'website_visitors_sync', 'MPTFlADgxU1bhPMb'
      )
    )
  )
FROM public.gp_organizations o
JOIN public.rt_playbooks pb ON pb.playbook_key = 'outbound_market_activation'
JOIN public.rt_playbook_versions pv ON pv.playbook_id = pb.id AND pv.version = '1.0.0'
WHERE o.slug = 'core-vision'
ON CONFLICT (organization_id, playbook_id) DO NOTHING;

-- ============ 5. TENANT API KEY: 'Core-Vision Console' ============
-- De key-waarde wordt bij het draaien gegenereerd en UITSLUITEND als
-- migration-output (RAISE NOTICE) getoond — nergens anders opgeslagen.
-- Kwijt? Genereer een nieuwe waarde met een UPDATE op api_key.

DO $$
DECLARE
  v_org_id uuid;
  v_key text;
BEGIN
  SELECT id INTO v_org_id FROM public.gp_organizations WHERE slug = 'core-vision';
  IF v_org_id IS NULL THEN
    RAISE WARNING 'core-vision organisatie niet gevonden; tenant-key niet aangemaakt';
    RETURN;
  END IF;

  IF EXISTS (SELECT 1 FROM public.mcp_api_keys WHERE name = 'Core-Vision Console') THEN
    RAISE NOTICE 'mcp_api_keys "Core-Vision Console" bestaat al; key ongewijzigd';
    RETURN;
  END IF;

  v_key := 'cvk_' || encode(gen_random_bytes(24), 'hex');
  INSERT INTO public.mcp_api_keys (name, api_key, organization_id, tool_scope, is_master, is_active)
  VALUES ('Core-Vision Console', v_key, v_org_id, 'tenant', false, true);

  RAISE NOTICE 'Tenant-key "Core-Vision Console" aangemaakt. Key-waarde (eenmalig getoond): %', v_key;
END
$$;
