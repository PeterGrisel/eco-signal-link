-- ============================================================================
-- REBEL FORCE GTM RUNTIME v0.1 — Vault secret resolver
-- vault.decrypted_secrets is niet via PostgREST bereikbaar; de executor
-- (service role) resolvet vault://-referenties via deze RPC.
-- SECURITY DEFINER + alleen service_role: klanten kunnen dit nooit aanroepen.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.rt_resolve_secret(secret_name text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT decrypted_secret
  FROM vault.decrypted_secrets
  WHERE name = secret_name
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.rt_resolve_secret(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.rt_resolve_secret(text) FROM anon;
REVOKE ALL ON FUNCTION public.rt_resolve_secret(text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.rt_resolve_secret(text) TO service_role;
