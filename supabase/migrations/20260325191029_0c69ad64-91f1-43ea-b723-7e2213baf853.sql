
CREATE TABLE public.content_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES public.content_topics(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.content_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage content topics"
  ON public.content_topics FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can read content topics"
  ON public.content_topics FOR SELECT TO public
  USING (true);

-- Link content_queue items to topics
ALTER TABLE public.content_queue ADD COLUMN topic_id uuid REFERENCES public.content_topics(id) ON DELETE SET NULL;
