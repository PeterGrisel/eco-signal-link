
CREATE TABLE public.glossary_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  term text NOT NULL,
  short_def text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  meta_description text,
  category text,
  related_terms text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'published',
  published_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_glossary_terms_status ON public.glossary_terms(status);
CREATE INDEX idx_glossary_terms_term_lower ON public.glossary_terms(lower(term));

GRANT SELECT ON public.glossary_terms TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.glossary_terms TO authenticated;
GRANT ALL ON public.glossary_terms TO service_role;

ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published glossary terms"
  ON public.glossary_terms FOR SELECT
  USING (status = 'published' OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage glossary terms"
  ON public.glossary_terms FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_glossary_terms_updated_at
  BEFORE UPDATE ON public.glossary_terms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.glossary_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  term_id uuid,
  status text NOT NULL,
  message text,
  log jsonb DEFAULT '[]'::jsonb
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.glossary_runs TO authenticated;
GRANT ALL ON public.glossary_runs TO service_role;

ALTER TABLE public.glossary_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage glossary runs"
  ON public.glossary_runs FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
