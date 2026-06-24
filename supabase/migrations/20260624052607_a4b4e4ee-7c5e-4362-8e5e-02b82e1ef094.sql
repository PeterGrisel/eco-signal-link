
-- buckets
CREATE TABLE public.content_buckets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  tagline text,
  description text,
  cta_text text DEFAULT 'Plan de nulmeting →',
  is_published boolean NOT NULL DEFAULT true,
  generator_system_prompt text,
  generator_schema jsonb,
  default_layouts text[] DEFAULT '{}',
  accent_color text DEFAULT '#E8945A',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.content_buckets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_buckets TO authenticated;
GRANT ALL ON public.content_buckets TO service_role;
ALTER TABLE public.content_buckets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "buckets_public_read" ON public.content_buckets FOR SELECT USING (is_published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "buckets_admin_write" ON public.content_buckets FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- items
CREATE TABLE public.content_bucket_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id uuid NOT NULL REFERENCES public.content_buckets(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  subtitle text,
  intro text,
  layout text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  slot_label text,
  type_label text,
  category text,
  is_bonus boolean DEFAULT false,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  cta_text text,
  cta_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (bucket_id, slug)
);
GRANT SELECT ON public.content_bucket_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_bucket_items TO authenticated;
GRANT ALL ON public.content_bucket_items TO service_role;
ALTER TABLE public.content_bucket_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "items_public_read" ON public.content_bucket_items FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "items_admin_write" ON public.content_bucket_items FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX content_bucket_items_bucket_position_idx ON public.content_bucket_items (bucket_id, position);

-- leads
CREATE TABLE public.content_bucket_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id uuid NOT NULL REFERENCES public.content_buckets(id) ON DELETE CASCADE,
  item_id uuid REFERENCES public.content_bucket_items(id) ON DELETE SET NULL,
  email text NOT NULL,
  name text,
  company text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','unsubscribed')),
  confirm_token text NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex'),
  utm jsonb,
  ip_hash text,
  user_agent text,
  confirmed_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_bucket_leads TO authenticated;
GRANT ALL ON public.content_bucket_leads TO service_role;
ALTER TABLE public.content_bucket_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_admin_read" ON public.content_bucket_leads FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "leads_admin_manage" ON public.content_bucket_leads FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX content_bucket_leads_token_idx ON public.content_bucket_leads (confirm_token);
CREATE INDEX content_bucket_leads_bucket_idx ON public.content_bucket_leads (bucket_id, created_at DESC);

-- triggers
CREATE TRIGGER content_buckets_updated_at BEFORE UPDATE ON public.content_buckets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER content_bucket_items_updated_at BEFORE UPDATE ON public.content_bucket_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
