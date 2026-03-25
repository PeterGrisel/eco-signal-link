
CREATE TYPE public.content_queue_status AS ENUM ('pending', 'approved', 'declined', 'generating', 'published', 'failed');
CREATE TYPE public.content_type AS ENUM ('article', 'tool', 'video', 'pseo');

CREATE TABLE public.content_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  headline TEXT NOT NULL,
  content_type public.content_type NOT NULL DEFAULT 'article',
  status public.content_queue_status NOT NULL DEFAULT 'pending',
  keyword TEXT,
  notes TEXT,
  blog_post_id UUID REFERENCES public.blog_posts(id) ON DELETE SET NULL,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.content_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage content queue" ON public.content_queue
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_content_queue_updated_at
  BEFORE UPDATE ON public.content_queue
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
