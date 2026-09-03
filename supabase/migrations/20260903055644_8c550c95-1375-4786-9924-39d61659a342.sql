ALTER TABLE public.mcp_api_keys
  ADD COLUMN IF NOT EXISTS organization_id uuid,
  ADD COLUMN IF NOT EXISTS tool_scope text NOT NULL DEFAULT 'internal';

ALTER TABLE public.mcp_api_keys
  DROP CONSTRAINT IF EXISTS mcp_api_keys_tool_scope_check;
ALTER TABLE public.mcp_api_keys
  ADD CONSTRAINT mcp_api_keys_tool_scope_check CHECK (tool_scope IN ('internal','tenant'));