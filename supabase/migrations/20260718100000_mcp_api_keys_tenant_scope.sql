-- ============================================================================
-- REBEL FORCE GTM RUNTIME v0.1 — tenant-scoping voor mcp_api_keys
--   organization_id NULL  = Rebel Force master-scope (interne keys)
--   organization_id gezet = key van één tenant
--   tool_scope 'internal' = alle MCP-tools, vrije tenant-keuze
--   tool_scope 'tenant'   = alleen get_run_status, list_pending_approvals,
--                           decide_approval, get_tenant_costs; de tenant-
--                           parameter wordt server-side vervangen door de
--                           organization_id van de key
-- ============================================================================

ALTER TABLE public.mcp_api_keys
  ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.gp_organizations(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS tool_scope text NOT NULL DEFAULT 'internal';

ALTER TABLE public.mcp_api_keys
  DROP CONSTRAINT IF EXISTS mcp_api_keys_tool_scope_check;
ALTER TABLE public.mcp_api_keys
  ADD CONSTRAINT mcp_api_keys_tool_scope_check
  CHECK (tool_scope IN ('internal', 'tenant'));

-- Een tenant-scoped key zonder organisatie zou nergens toegang toe geven;
-- expliciet verbieden zodat misconfiguratie bij het aanmaken al faalt.
ALTER TABLE public.mcp_api_keys
  DROP CONSTRAINT IF EXISTS mcp_api_keys_tenant_needs_org;
ALTER TABLE public.mcp_api_keys
  ADD CONSTRAINT mcp_api_keys_tenant_needs_org
  CHECK (tool_scope <> 'tenant' OR organization_id IS NOT NULL);

CREATE INDEX IF NOT EXISTS mcp_api_keys_org_idx
  ON public.mcp_api_keys(organization_id)
  WHERE organization_id IS NOT NULL;
