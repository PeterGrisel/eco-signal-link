
CREATE TABLE public.cheatsheet_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cheatsheet_slug TEXT NOT NULL,
  helpful BOOLEAN,
  rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_cheatsheet_feedback_unique ON public.cheatsheet_feedback (cheatsheet_slug, session_id);

ALTER TABLE public.cheatsheet_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert feedback" ON public.cheatsheet_feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read feedback" ON public.cheatsheet_feedback
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update their own feedback" ON public.cheatsheet_feedback
  FOR UPDATE USING (true);
