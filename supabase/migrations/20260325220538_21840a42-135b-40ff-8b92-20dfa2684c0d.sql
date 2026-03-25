CREATE TABLE public.blocked_tracking_ips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL UNIQUE,
  label text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blocked_tracking_ips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage blocked IPs"
  ON public.blocked_tracking_ips FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can read blocked IPs"
  ON public.blocked_tracking_ips FOR SELECT
  TO anon, authenticated
  USING (true);
