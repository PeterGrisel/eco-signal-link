-- Normalize stale b2bgroeimachine.nl references to b2bgroeimachine.io.
-- The .nl domain does not resolve; any stored references are dead links
-- (CTAs, AI-generated content, excerpts, meta descriptions).

UPDATE public.seo_settings
SET config = REPLACE(config::text, 'b2bgroeimachine.nl', 'b2bgroeimachine.io')::jsonb
WHERE config::text LIKE '%b2bgroeimachine.nl%';

UPDATE public.blog_posts
SET content = REPLACE(content, 'b2bgroeimachine.nl', 'b2bgroeimachine.io')
WHERE content LIKE '%b2bgroeimachine.nl%';

UPDATE public.blog_posts
SET excerpt = REPLACE(excerpt, 'b2bgroeimachine.nl', 'b2bgroeimachine.io')
WHERE excerpt LIKE '%b2bgroeimachine.nl%';

UPDATE public.blog_posts
SET meta_description = REPLACE(meta_description, 'b2bgroeimachine.nl', 'b2bgroeimachine.io')
WHERE meta_description LIKE '%b2bgroeimachine.nl%';
