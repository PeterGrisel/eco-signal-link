-- Add strategy fields to content_topics
ALTER TABLE public.content_topics 
  ADD COLUMN IF NOT EXISTS target_keywords text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS target_article_count integer DEFAULT 3,
  ADD COLUMN IF NOT EXISTS priority integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed'));

-- Add topic_id FK to content_queue (already exists in schema but ensure it's there)
-- content_queue already has topic_id column

-- Add topic_id to blog_posts so we can track coverage
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS topic_id uuid REFERENCES public.content_topics(id) ON DELETE SET NULL;