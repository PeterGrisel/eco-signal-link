-- 1. Add anchor_type to link_suggestions
ALTER TABLE public.link_suggestions
  ADD COLUMN IF NOT EXISTS anchor_type text NOT NULL DEFAULT 'descriptive'
  CHECK (anchor_type IN ('exact', 'partial', 'descriptive', 'generic')),
  ADD COLUMN IF NOT EXISTS anchor_text text;

CREATE INDEX IF NOT EXISTS idx_link_suggestions_target_url ON public.link_suggestions(target_url);
CREATE INDEX IF NOT EXISTS idx_link_suggestions_source_url ON public.link_suggestions(source_url);

-- 2. SEO action items table (striking distance)
CREATE TABLE IF NOT EXISTS public.seo_action_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL,
  page text,
  position numeric,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  priority text NOT NULL DEFAULT 'optimize' CHECK (priority IN ('quick-win', 'optimize', 'rebuild')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'done', 'dismissed')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (query, page)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_action_items TO authenticated;
GRANT ALL ON public.seo_action_items TO service_role;

ALTER TABLE public.seo_action_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage seo action items"
ON public.seo_action_items FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_seo_action_items_status ON public.seo_action_items(status);
CREATE INDEX IF NOT EXISTS idx_seo_action_items_priority ON public.seo_action_items(priority);

-- 3. SEO health log table
CREATE TABLE IF NOT EXISTS public.seo_health_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  check_type text NOT NULL,
  target text,
  severity text NOT NULL DEFAULT 'ok' CHECK (severity IN ('ok', 'warning', 'critical')),
  metric_value numeric,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_health_log TO authenticated;
GRANT ALL ON public.seo_health_log TO service_role;

ALTER TABLE public.seo_health_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage seo health log"
ON public.seo_health_log FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_seo_health_log_severity ON public.seo_health_log(severity, created_at DESC);

-- 4. Bidirectional trigger on link_suggestions
CREATE OR REPLACE FUNCTION public.create_inverse_link_suggestion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Skip if inverse already exists or if this is itself an inverse insert
  IF NEW.source_url = NEW.target_url THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.link_suggestions (source_url, target_url, anchor_type, reason, score, status)
  VALUES (NEW.target_url, NEW.source_url, 'descriptive', 'auto-inverse', COALESCE(NEW.score, 0) * 0.8, 'open')
  ON CONFLICT DO NOTHING;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_link_suggestions_inverse ON public.link_suggestions;
CREATE TRIGGER trg_link_suggestions_inverse
AFTER INSERT ON public.link_suggestions
FOR EACH ROW
WHEN (NEW.reason IS DISTINCT FROM 'auto-inverse')
EXECUTE FUNCTION public.create_inverse_link_suggestion();

-- 5. Related pages function (MMR-achtige diversiteit via similarity threshold)
CREATE OR REPLACE FUNCTION public.match_related_pages(
  query_url text,
  match_threshold float DEFAULT 0.82,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  page_url text,
  title text,
  page_type text,
  similarity float
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH source AS (
    SELECT embedding FROM public.page_embeddings WHERE page_url = query_url LIMIT 1
  )
  SELECT
    pe.page_url,
    pe.title,
    pe.page_type,
    1 - (pe.embedding <=> (SELECT embedding FROM source)) AS similarity
  FROM public.page_embeddings pe
  WHERE pe.page_url <> query_url
    AND (SELECT embedding FROM source) IS NOT NULL
    AND 1 - (pe.embedding <=> (SELECT embedding FROM source)) >= match_threshold
  ORDER BY pe.embedding <=> (SELECT embedding FROM source)
  LIMIT match_count;
$$;

-- 6. Anchor diversity computation
CREATE OR REPLACE FUNCTION public.compute_anchor_diversity()
RETURNS TABLE (
  target_url text,
  total_links bigint,
  exact_count bigint,
  exact_pct numeric,
  severity text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    target_url,
    COUNT(*) AS total_links,
    COUNT(*) FILTER (WHERE anchor_type = 'exact') AS exact_count,
    ROUND(COUNT(*) FILTER (WHERE anchor_type = 'exact') * 100.0 / NULLIF(COUNT(*), 0), 1) AS exact_pct,
    CASE
      WHEN COUNT(*) FILTER (WHERE anchor_type = 'exact') * 100.0 / NULLIF(COUNT(*), 0) > 40 THEN 'critical'
      WHEN COUNT(*) FILTER (WHERE anchor_type = 'exact') * 100.0 / NULLIF(COUNT(*), 0) > 25 THEN 'warning'
      ELSE 'ok'
    END AS severity
  FROM public.link_suggestions
  WHERE status IN ('open', 'applied')
  GROUP BY target_url
  HAVING COUNT(*) >= 3;
$$;

-- 7. Orphan page detection
CREATE OR REPLACE FUNCTION public.find_orphan_pages()
RETURNS TABLE (
  page_url text,
  title text,
  page_type text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT pe.page_url, pe.title, pe.page_type
  FROM public.page_embeddings pe
  WHERE NOT EXISTS (
    SELECT 1 FROM public.link_suggestions ls
    WHERE ls.target_url = pe.page_url
      AND ls.status IN ('open', 'applied')
  )
  ORDER BY pe.page_type, pe.title;
$$;

-- 8. Updated_at trigger for new tables
CREATE TRIGGER update_seo_action_items_updated_at
BEFORE UPDATE ON public.seo_action_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();