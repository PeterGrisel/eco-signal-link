CREATE TABLE public.groeiplan_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  company TEXT,
  name TEXT,
  mode TEXT NOT NULL DEFAULT 'visitor',
  fields JSONB NOT NULL DEFAULT '{}'::jsonb,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.groeiplan_submissions TO anon;
GRANT INSERT ON public.groeiplan_submissions TO authenticated;
GRANT ALL ON public.groeiplan_submissions TO service_role;

ALTER TABLE public.groeiplan_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a groeiplan"
  ON public.groeiplan_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);