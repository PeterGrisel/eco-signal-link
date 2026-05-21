CREATE TABLE public.client_logos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text not null,
  logo_url text,
  scale numeric not null default 1.0,
  padding integer not null default 0,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

ALTER TABLE public.client_logos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read visible client logos"
ON public.client_logos FOR SELECT
TO anon, authenticated
USING (is_visible = true OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage client logos"
ON public.client_logos FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_client_logos_updated_at
BEFORE UPDATE ON public.client_logos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();