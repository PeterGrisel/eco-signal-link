-- De Groeistack: gecureerde directory van GTM/AI-tools
CREATE TABLE IF NOT EXISTS public.groeistack_tools (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  category text NOT NULL,
  description text NOT NULL DEFAULT '',
  website text NOT NULL,
  logo_url text,
  tags text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  link_status text,
  last_checked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.groeistack_tools ENABLE ROW LEVEL SECURITY;

-- Iedereen mag gepubliceerde tools lezen
DO $$ BEGIN
  CREATE POLICY "Public can read published groeistack tools"
    ON public.groeistack_tools
    FOR SELECT
    USING (published = true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Admins beheren alles
DO $$ BEGIN
  CREATE POLICY "Admins manage groeistack tools"
    ON public.groeistack_tools
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_groeistack_category
  ON public.groeistack_tools (category, sort_order);

DO $$ BEGIN
  CREATE TRIGGER update_groeistack_tools_updated_at
    BEFORE UPDATE ON public.groeistack_tools
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Seed (eigen, neutrale omschrijvingen van publieke producten)
INSERT INTO public.groeistack_tools (name, category, description, website, sort_order) VALUES
  ('Common Room','signalen','Verzamelt koop- en intentiesignalen uit veel verschillende bronnen.','https://www.commonroom.io',1),
  ('Koala','signalen','Laat zien welke bedrijven uw site bezoeken en wat ze doen.','https://www.getkoala.com',2),
  ('Trigify','signalen','Detecteert koopsignalen uit LinkedIn-activiteit.','https://trigify.io',3),
  ('Clay','verrijking','Bouwt en verrijkt prospect-lijsten met tientallen databronnen.','https://www.clay.com',1),
  ('Apollo','verrijking','Database van bedrijven en contacten, inclusief verrijking.','https://www.apollo.io',2),
  ('Ocean.io','verrijking','Vindt lookalike-bedrijven op basis van uw beste klanten.','https://www.ocean.io',3),
  ('HeyReach','outreach','Geautomatiseerde LinkedIn-outreach op schaal.','https://www.heyreach.io',1),
  ('Smartlead','outreach','Cold e-mail op schaal met deliverability-beheer.','https://www.smartlead.ai',2),
  ('Instantly','outreach','E-mailcampagnes met inbox-rotatie en warming.','https://instantly.ai',3),
  ('lemlist','outreach','Multichannel sequenties met sterke personalisatie.','https://www.lemlist.com',4),
  ('HubSpot','crm','CRM en pijplijn als één bron van waarheid.','https://www.hubspot.com',1),
  ('Pipedrive','crm','Overzichtelijk sales-CRM voor kleinere teams.','https://www.pipedrive.com',2),
  ('Salesforce','crm','Enterprise-CRM met uitgebreide aanpasbaarheid.','https://www.salesforce.com',3),
  ('Claude','ai','AI-assistent voor research, personalisatie en content.','https://www.anthropic.com',1),
  ('ChatGPT','ai','AI voor copy, research en workflow-automatisering.','https://openai.com/chatgpt',2),
  ('HeyGen','ai','AI-video met avatars voor outreach en content.','https://www.heygen.com',3),
  ('Dreamdata','dashboard','B2B-omzetattributie over al uw kanalen.','https://dreamdata.io',1),
  ('Metabase','dashboard','Dashboards en analyses op uw eigen data.','https://www.metabase.com',2)
ON CONFLICT (name) DO NOTHING;
