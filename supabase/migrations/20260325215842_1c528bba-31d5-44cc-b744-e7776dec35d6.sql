CREATE TABLE public.site_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  event_category text NOT NULL DEFAULT 'general',
  event_label text,
  page_path text,
  referrer text,
  session_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert events (anonymous tracking)
CREATE POLICY "Anyone can insert site events"
  ON public.site_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read events
CREATE POLICY "Admins can read site events"
  ON public.site_events FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete events
CREATE POLICY "Admins can delete site events"
  ON public.site_events FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));