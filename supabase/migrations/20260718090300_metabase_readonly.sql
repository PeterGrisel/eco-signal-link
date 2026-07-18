-- ============================================================================
-- REBEL FORCE GTM RUNTIME v0.1 — Metabase read-only rol
--
-- LET OP / SECURITY:
--   * Deze rol OMZEILT RLS (BYPASSRLS) en ziet dus data van ALLE tenants.
--     Klant-facing dashboards mogen daarom UITSLUITEND via Metabase signed
--     embedding lopen met een LOCKED parameter organization_id, zodat elke
--     klant alleen zijn eigen rijen te zien krijgt.
--   * Het wachtwoord staat NIET in deze migration. Na het draaien handmatig
--     zetten (en in Supabase Vault bewaren als secret 'metabase/db-password'):
--       ALTER ROLE metabase_readonly WITH PASSWORD '<sterk-wachtwoord-uit-Vault>';
--     Tot die tijd kan de rol niet inloggen (LOGIN zonder password).
--   * GEEN toegang tot rt_provider_credentials en mcp_api_keys — expliciet
--     ge-revoked, ook al is er nooit een grant geweest.
-- ============================================================================

-- Rol aanmaken (idempotent). BYPASSRLS vereist op sommige omgevingen
-- superuser; valt in dat geval terug op een rol zonder BYPASSRLS en meldt
-- dat een beheerder 'ALTER ROLE metabase_readonly BYPASSRLS;' moet draaien.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'metabase_readonly') THEN
    BEGIN
      CREATE ROLE metabase_readonly WITH LOGIN BYPASSRLS NOINHERIT;
    EXCEPTION WHEN insufficient_privilege THEN
      CREATE ROLE metabase_readonly WITH LOGIN NOINHERIT;
      RAISE WARNING 'metabase_readonly aangemaakt ZONDER BYPASSRLS; laat een beheerder "ALTER ROLE metabase_readonly BYPASSRLS;" draaien, anders blijven RLS-tabellen leeg voor deze rol';
    END;
  END IF;
END
$$;

COMMENT ON ROLE metabase_readonly IS
  'Read-only rol voor Metabase. Omzeilt RLS: klant-facing dashboards uitsluitend via signed embedding met locked parameter organization_id. Geen toegang tot rt_provider_credentials / mcp_api_keys.';

GRANT USAGE ON SCHEMA public TO metabase_readonly;

-- rt_*-tabellen (bewust ZONDER rt_provider_credentials)
GRANT SELECT ON
  public.rt_skills,
  public.rt_skill_versions,
  public.rt_providers,
  public.rt_provider_routes,
  public.rt_playbooks,
  public.rt_playbook_versions,
  public.rt_playbook_steps,
  public.rt_tenant_playbooks,
  public.rt_workflow_runs,
  public.rt_step_runs,
  public.rt_approvals,
  public.rt_provider_calls,
  public.rt_audit_logs
TO metabase_readonly;

-- gp_-domeindata voor dashboards
GRANT SELECT ON
  public.gp_organizations,
  public.gp_accounts,
  public.gp_contacts,
  public.gp_signals,
  public.gp_campaigns,
  public.gp_sales_actions
TO metabase_readonly;

-- Expliciet dichtzetten: secret-referenties en API keys zijn nooit
-- rapportagedata.
REVOKE ALL ON public.rt_provider_credentials FROM metabase_readonly;
REVOKE ALL ON public.mcp_api_keys FROM metabase_readonly;

-- Toekomstige tabellen die via migrations (rol postgres) worden aangemaakt
-- krijgen automatisch SELECT voor metabase_readonly, zodat nieuwe
-- rt_-tabellen direct in Metabase bruikbaar zijn.
--
-- LET OP: dit geldt voor ÁLLE nieuwe tabellen in public. Bij elke nieuwe
-- tabel met credential-achtige of secret-achtige inhoud hoort in dezelfde
-- migration een expliciete:
--   REVOKE ALL ON public.<tabel> FROM metabase_readonly;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT SELECT ON TABLES TO metabase_readonly;
