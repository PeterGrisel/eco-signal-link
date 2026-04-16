
CREATE TABLE public.mcp_api_keys (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  api_key text NOT NULL UNIQUE,
  permissions jsonb DEFAULT NULL,
  is_master boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  last_used_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.mcp_api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage MCP API keys"
  ON public.mcp_api_keys FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert a default master key
INSERT INTO public.mcp_api_keys (name, api_key, is_master)
VALUES ('Master Key', encode(gen_random_bytes(32), 'hex'), true);
