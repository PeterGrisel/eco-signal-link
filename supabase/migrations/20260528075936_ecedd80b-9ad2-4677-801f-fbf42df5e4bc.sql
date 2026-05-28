CREATE TABLE IF NOT EXISTS public.playbook_scenarios (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  audience text NOT NULL DEFAULT '',
  service_line text NOT NULL DEFAULT '',
  angle text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  used_at timestamptz,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.playbook_scenarios TO authenticated;
GRANT ALL ON public.playbook_scenarios TO service_role;
ALTER TABLE public.playbook_scenarios ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins manage playbook scenarios" ON public.playbook_scenarios
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.playbooks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  meta_description text,
  content text NOT NULL DEFAULT '',
  tools text[] NOT NULL DEFAULT '{}',
  service_line text,
  audience text,
  scenario_id uuid REFERENCES public.playbook_scenarios(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'published',
  published_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.playbooks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.playbooks TO authenticated;
GRANT ALL ON public.playbooks TO service_role;
ALTER TABLE public.playbooks ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Anyone can read published playbooks" ON public.playbooks
    FOR SELECT
    USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Admins manage playbooks" ON public.playbooks
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS idx_playbooks_status_published
  ON public.playbooks (status, published_at DESC);
DO $$ BEGIN
  CREATE TRIGGER update_playbooks_updated_at
    BEFORE UPDATE ON public.playbooks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

INSERT INTO public.playbook_scenarios (title, audience, service_line, angle, sort_order) VALUES
  ('ABM voor B2B-SaaS scale-ups','B2B-SaaS','ABM & Key Accounts','Weinig accounts, hoge dealwaarde, meerdere beslissers.',1),
  ('Outbound voor MKB-dienstverlening','Zakelijke dienstverlening','Outbound Engine','Brede markt, herhaalbaar aanbod, snel volume.',2),
  ('Signaal-gedreven prospecting in de groothandel','Groothandel','Outbound Engine','Koopsignalen en timing benutten.',3),
  ('Een Commercieel Brein opzetten in HubSpot','B2B algemeen','Commercieel Brein','CRM-discipline, ICP en signaal-scoring.',4),
  ('LinkedIn-autoriteit voor tech-founders','Tech / SaaS','Content & Autoriteit','Founder-led content die vraag opbouwt.',5),
  ('Van Excel naar een voorspelbare pijplijn','MKB','Commercieel Brein','Data en proces in plaats van losse lijsten.',6),
  ('Internationale expansie zonder lokaal team','Maakindustrie','Outbound Engine','Nieuwe markten openen vanuit één systeem.',7),
  ('ABM voor engineering- en industriebedrijven','Engineering','ABM & Key Accounts','Lange salescycli, technische DMU.',8),
  ('Warme outbound: content en outreach gecombineerd','B2B algemeen','Content & Autoriteit','Inbound opbouwen naast outbound.',9),
  ('Pipeline-forecast met het rekenmodel','B2B algemeen','Commercieel Brein','Van adresseerbare markt naar pipeline.',10),
  ('Leasemaatschappijen: structurele new business','Leasemaatschappijen','Outbound Engine','Fleet- en lease-ICP gericht benaderen.',11),
  ('Multichannel sequencing dat wél antwoord krijgt','B2B algemeen','Outbound Engine','E-mail, LinkedIn en telefoon in één flow.',12)
ON CONFLICT DO NOTHING;