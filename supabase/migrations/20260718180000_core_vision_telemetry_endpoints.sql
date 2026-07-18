-- ============================================================================
-- SEED-UPDATE: Core-Vision telemetrie-endpoints in source_context
--   planable.workspace_id : Core-Vision Planable workspace (publieke API,
--                           base https://api.planable.io/api/v1, pln_-token
--                           uit vault://tenants/core-vision/planable)
--   stairoids.mcp_url     : Stairoids MCP-endpoint ZONDER mcpKey — de key
--                           komt uit vault://tenants/core-vision/stairoids
-- Idempotent (jsonb_set overschrijft dezelfde waarden).
-- ============================================================================

UPDATE public.rt_tenant_playbooks tp
SET config = jsonb_set(jsonb_set(coalesce(tp.config, '{}'::jsonb),
  '{source_context,planable}',  '{"workspace_id": "QwafMc8yGrQc4BvXo"}'),
  '{source_context,stairoids}', '{"mcp_url": "https://app.stairoids.com/api/mcp?userId=362"}')
FROM public.gp_organizations o
WHERE tp.organization_id = o.id AND o.slug = 'core-vision';
