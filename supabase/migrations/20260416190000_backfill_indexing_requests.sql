-- Backfill indexing_requests for published blog_posts that predate the
-- auto_index_on_publish trigger (added 2026-03-26) or that slipped through
-- transient pg_net failures. Inserts a 'pending' row per missing URL so the
-- /admin/indexing "Sync & Index" flow can batch-submit them to Google.

INSERT INTO public.indexing_requests (url, status)
SELECT 'https://b2bgroeimachine.io/blog/' || slug, 'pending'
FROM public.blog_posts
WHERE status = 'published'
ON CONFLICT (url) DO NOTHING;
