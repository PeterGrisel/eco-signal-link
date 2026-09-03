-- Post-generator: batches van social-posts die uit een blog, playbook,
-- woordenboek-term, give-away of vrij onderwerp worden gegenereerd, per
-- kanaal uitgeschreven en daarna naar Planable gepusht.
--
-- De visual-templates zelf staan in code (supabase/functions/_shared/social.ts);
-- hier bewaren we alleen welke template met welke velden is gekozen.

-- Een batch = één bron + één generatieronde (standaard drie invalshoeken).
CREATE TABLE public.social_post_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text NOT NULL CHECK (source_type IN ('blog','playbook','glossary','giveaway','custom')),
  source_id uuid,
  source_slug text,
  source_title text NOT NULL,
  source_url text,
  brief text,
  channels text[] NOT NULL DEFAULT '{linkedin_personal}',
  angle_count integer NOT NULL DEFAULT 3,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pushed','archived')),
  model text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_post_batches TO authenticated;
GRANT ALL ON public.social_post_batches TO service_role;
ALTER TABLE public.social_post_batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "social_batches_admin_all" ON public.social_post_batches
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX social_post_batches_created_idx ON public.social_post_batches (created_at DESC);

-- Eén rij per invalshoek per kanaal.
CREATE TABLE public.social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL REFERENCES public.social_post_batches(id) ON DELETE CASCADE,
  channel text NOT NULL,
  angle text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  hook text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  cta text,
  cta_url text,
  hashtags text[] NOT NULL DEFAULT '{}',
  visual_template text NOT NULL DEFAULT 'statement',
  visual_format text NOT NULL DEFAULT 'portrait',
  visual_skin text NOT NULL DEFAULT 'dark' CHECK (visual_skin IN ('dark','light')),
  visual_fields jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','approved','pushed','failed')),
  scheduled_for timestamptz,
  planable_post_id text,
  planable_page_id text,
  planable_error text,
  pushed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_posts TO authenticated;
GRANT ALL ON public.social_posts TO service_role;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "social_posts_admin_all" ON public.social_posts
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX social_posts_batch_idx ON public.social_posts (batch_id, position);
CREATE INDEX social_posts_status_idx ON public.social_posts (status, created_at DESC);

CREATE TRIGGER social_post_batches_updated_at
  BEFORE UPDATE ON public.social_post_batches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER social_posts_updated_at
  BEFORE UPDATE ON public.social_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
