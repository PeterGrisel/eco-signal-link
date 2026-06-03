
-- Fix cheatsheet_feedback: remove public UPDATE without ownership check, also block public INSERT/SELECT (route via edge function)
DROP POLICY IF EXISTS "Anyone can update their own feedback" ON public.cheatsheet_feedback;
DROP POLICY IF EXISTS "Anyone can insert feedback" ON public.cheatsheet_feedback;
DROP POLICY IF EXISTS "Anyone can read feedback" ON public.cheatsheet_feedback;

CREATE POLICY "Admins can manage feedback"
ON public.cheatsheet_feedback FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Lock blocked_tracking_ips to admins only; client uses edge function to check
DROP POLICY IF EXISTS "Anyone can read blocked IPs" ON public.blocked_tracking_ips;

-- Lock tracking_scripts public read; client uses edge function to fetch active scripts
DROP POLICY IF EXISTS "Anyone can read active tracking scripts" ON public.tracking_scripts;

-- Lock seo_settings public read; admins manage, only admins read
DROP POLICY IF EXISTS "Anyone can read seo settings" ON public.seo_settings;

-- Fix mutable search_path on SECURITY DEFINER pgmq helper functions
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;

-- Revoke public execute on internal pgmq helper SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;

-- Restrict heavy internal helpers (admin/service only)
REVOKE EXECUTE ON FUNCTION public.match_related_pages(text, double precision, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.find_orphan_pages() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.compute_anchor_diversity() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.match_related_pages(text, double precision, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.find_orphan_pages() TO service_role;
GRANT EXECUTE ON FUNCTION public.compute_anchor_diversity() TO service_role;
