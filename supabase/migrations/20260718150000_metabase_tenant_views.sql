-- ============================================================================
-- METABASE — optionele directe klant-toegang via per-tenant views (deel G)
--
-- Standaard is klant-facing Metabase: signed embedding met locked parameter
-- organization_id op de metabase_readonly-verbinding. Deze helper is de
-- UITZONDERING voor klanten die een eigen directe database-login willen:
-- per tenant een set views (hard gefilterd op de organisatie) plus een rol
-- die uitsluitend die views kan lezen. GEEN aparte Supabase per klant.
--
-- Gebruik (als service_role / postgres):
--   SELECT public.rt_create_tenant_views('core-vision');
--   ALTER ROLE metabase_core_vision WITH PASSWORD '<sterk-wachtwoord-uit-Vault>';
-- ============================================================================

CREATE OR REPLACE FUNCTION public.rt_create_tenant_views(slug text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_org_id uuid;
  v_ident text;      -- slug veilig gemaakt voor identifiers (- wordt _)
  v_role text;
  v_view text;
  v_created text[] := '{}';
BEGIN
  IF slug IS NULL OR slug !~ '^[a-z0-9][a-z0-9-]{1,62}$' THEN
    RAISE EXCEPTION 'ongeldige slug "%": lowercase letters, cijfers en streepjes', slug;
  END IF;

  SELECT id INTO v_org_id FROM public.gp_organizations WHERE gp_organizations.slug = rt_create_tenant_views.slug;
  IF v_org_id IS NULL THEN
    RAISE EXCEPTION 'geen organisatie met slug "%"', slug;
  END IF;

  v_ident := replace(slug, '-', '_');
  v_role := 'metabase_' || v_ident;

  -- Rol (LOGIN, wachtwoord handmatig zetten — nooit hier hardcoden)
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = v_role) THEN
    EXECUTE format('CREATE ROLE %I WITH LOGIN NOINHERIT', v_role);
  END IF;
  EXECUTE format('GRANT USAGE ON SCHEMA public TO %I', v_role);

  -- Views: hard gefilterd op deze tenant. Views draaien met de rechten van
  -- de eigenaar (postgres) en omzeilen dus RLS — precies daarom zijn ze
  -- strikt WHERE organization_id = deze tenant.
  FOR v_view IN
    SELECT unnest(ARRAY['signals', 'accounts', 'campaigns', 'sales_actions', 'provider_costs'])
  LOOP
    IF v_view = 'provider_costs' THEN
      EXECUTE format(
        'CREATE OR REPLACE VIEW public.mv_%s_provider_costs AS
         SELECT c.id, c.created_at, c.status, c.http_status, c.latency_ms, c.cost, c.tokens, c.credits,
                p.provider_key, s.skill_key
         FROM public.rt_provider_calls c
         LEFT JOIN public.rt_providers p ON p.id = c.provider_id
         LEFT JOIN public.rt_skill_versions sv ON sv.id = c.skill_version_id
         LEFT JOIN public.rt_skills s ON s.id = sv.skill_id
         WHERE c.organization_id = %L',
        v_ident, v_org_id);
    ELSE
      EXECUTE format(
        'CREATE OR REPLACE VIEW public.mv_%s_%s AS
         SELECT * FROM public.gp_%s WHERE organization_id = %L',
        v_ident, v_view, v_view, v_org_id);
    END IF;
    EXECUTE format('GRANT SELECT ON public.mv_%s_%s TO %I', v_ident, v_view, v_role);
    v_created := v_created || format('mv_%s_%s', v_ident, v_view);
  END LOOP;

  RETURN format('rol %s met SELECT op: %s — wachtwoord nog zetten via ALTER ROLE', v_role, array_to_string(v_created, ', '));
END;
$$;

-- Uitsluitend service_role (en de eigenaar) mag tenant-views aanmaken.
REVOKE ALL ON FUNCTION public.rt_create_tenant_views(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.rt_create_tenant_views(text) FROM anon;
REVOKE ALL ON FUNCTION public.rt_create_tenant_views(text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.rt_create_tenant_views(text) TO service_role;
