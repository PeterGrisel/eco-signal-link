
CREATE TABLE public.tracking_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  script_content TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'head' CHECK (location IN ('head', 'body_start', 'body_end')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tracking_scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage tracking scripts"
ON public.tracking_scripts
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can read active tracking scripts"
ON public.tracking_scripts
FOR SELECT
TO anon, authenticated
USING (is_active = true);
