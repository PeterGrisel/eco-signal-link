
-- ============ ENUM ============
DO $$ BEGIN
  CREATE TYPE public.growth_role AS ENUM (
    'super_admin',
    'rebel_force_admin',
    'growth_manager',
    'growth_operator',
    'client_admin',
    'client_sales_manager',
    'client_sales_user',
    'client_viewer'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============ PROFILES ============
CREATE TABLE public.gp_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  avatar_url text,
  is_platform_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.gp_profiles TO authenticated;
GRANT ALL ON public.gp_profiles TO service_role;
ALTER TABLE public.gp_profiles ENABLE ROW LEVEL SECURITY;

-- ============ ORGANIZATIONS ============
CREATE TABLE public.gp_organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  logo_url text,
  industry text,
  country text,
  package text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gp_organizations TO authenticated;
GRANT ALL ON public.gp_organizations TO service_role;
ALTER TABLE public.gp_organizations ENABLE ROW LEVEL SECURITY;

-- ============ MEMBERSHIPS ============
CREATE TABLE public.gp_organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.gp_organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.growth_role NOT NULL DEFAULT 'client_viewer',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);
CREATE INDEX ON public.gp_organization_members(user_id);
CREATE INDEX ON public.gp_organization_members(organization_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gp_organization_members TO authenticated;
GRANT ALL ON public.gp_organization_members TO service_role;
ALTER TABLE public.gp_organization_members ENABLE ROW LEVEL SECURITY;

-- ============ HELPER FUNCTIONS (security definer, no recursion) ============
CREATE OR REPLACE FUNCTION public.gp_has_role(_user_id uuid, _role public.growth_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.gp_organization_members WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.gp_is_rebel_force(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.gp_organization_members
    WHERE user_id = _user_id
      AND role IN ('super_admin','rebel_force_admin','growth_manager','growth_operator')
  );
$$;

CREATE OR REPLACE FUNCTION public.gp_is_org_member(_user_id uuid, _org_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.gp_organization_members
    WHERE user_id = _user_id AND organization_id = _org_id
  );
$$;

CREATE OR REPLACE FUNCTION public.gp_can_access_org(_user_id uuid, _org_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.gp_is_rebel_force(_user_id) OR public.gp_is_org_member(_user_id, _org_id);
$$;

-- ============ CORE ORG POLICIES ============
CREATE POLICY "profiles self read" ON public.gp_profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.gp_is_rebel_force(auth.uid()));
CREATE POLICY "profiles self update" ON public.gp_profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "profiles self insert" ON public.gp_profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

CREATE POLICY "orgs read own or rf" ON public.gp_organizations FOR SELECT TO authenticated
  USING (public.gp_can_access_org(auth.uid(), id));
CREATE POLICY "orgs rf write" ON public.gp_organizations FOR ALL TO authenticated
  USING (public.gp_is_rebel_force(auth.uid())) WITH CHECK (public.gp_is_rebel_force(auth.uid()));

CREATE POLICY "members read own or rf" ON public.gp_organization_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.gp_is_rebel_force(auth.uid()) OR public.gp_is_org_member(auth.uid(), organization_id));
CREATE POLICY "members rf write" ON public.gp_organization_members FOR ALL TO authenticated
  USING (public.gp_is_rebel_force(auth.uid())) WITH CHECK (public.gp_is_rebel_force(auth.uid()));

-- ============ MARKETS / ICPS ============
CREATE TABLE public.gp_markets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.gp_organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  country text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gp_markets TO authenticated;
GRANT ALL ON public.gp_markets TO service_role;
ALTER TABLE public.gp_markets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "markets scoped" ON public.gp_markets FOR ALL TO authenticated
  USING (public.gp_can_access_org(auth.uid(), organization_id))
  WITH CHECK (public.gp_can_access_org(auth.uid(), organization_id));

CREATE TABLE public.gp_icps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.gp_organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  target_roles text[],
  employee_range text,
  industries text[],
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gp_icps TO authenticated;
GRANT ALL ON public.gp_icps TO service_role;
ALTER TABLE public.gp_icps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "icps scoped" ON public.gp_icps FOR ALL TO authenticated
  USING (public.gp_can_access_org(auth.uid(), organization_id))
  WITH CHECK (public.gp_can_access_org(auth.uid(), organization_id));

-- ============ ACCOUNTS / CONTACTS ============
CREATE TABLE public.gp_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.gp_organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  domain text,
  industry text,
  country text,
  employee_range text,
  status text NOT NULL DEFAULT 'active',
  warmth text NOT NULL DEFAULT 'cold',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.gp_accounts(organization_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gp_accounts TO authenticated;
GRANT ALL ON public.gp_accounts TO service_role;
ALTER TABLE public.gp_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "accounts scoped" ON public.gp_accounts FOR ALL TO authenticated
  USING (public.gp_can_access_org(auth.uid(), organization_id))
  WITH CHECK (public.gp_can_access_org(auth.uid(), organization_id));

CREATE TABLE public.gp_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.gp_organizations(id) ON DELETE CASCADE,
  account_id uuid REFERENCES public.gp_accounts(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  title text,
  email text,
  linkedin_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.gp_contacts(account_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gp_contacts TO authenticated;
GRANT ALL ON public.gp_contacts TO service_role;
ALTER TABLE public.gp_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contacts scoped" ON public.gp_contacts FOR ALL TO authenticated
  USING (public.gp_can_access_org(auth.uid(), organization_id))
  WITH CHECK (public.gp_can_access_org(auth.uid(), organization_id));

-- ============ CAMPAIGNS ============
CREATE TABLE public.gp_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.gp_organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  goal text,
  market_id uuid REFERENCES public.gp_markets(id) ON DELETE SET NULL,
  icp_id uuid REFERENCES public.gp_icps(id) ON DELETE SET NULL,
  channels text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft',
  accounts_count int NOT NULL DEFAULT 0,
  positive_replies int NOT NULL DEFAULT 0,
  sales_ready int NOT NULL DEFAULT 0,
  meetings int NOT NULL DEFAULT 0,
  learnings text,
  started_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gp_campaigns TO authenticated;
GRANT ALL ON public.gp_campaigns TO service_role;
ALTER TABLE public.gp_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaigns scoped" ON public.gp_campaigns FOR ALL TO authenticated
  USING (public.gp_can_access_org(auth.uid(), organization_id))
  WITH CHECK (public.gp_can_access_org(auth.uid(), organization_id));

-- ============ SIGNALS ============
CREATE TABLE public.gp_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.gp_organizations(id) ON DELETE CASCADE,
  account_id uuid REFERENCES public.gp_accounts(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES public.gp_contacts(id) ON DELETE SET NULL,
  campaign_id uuid REFERENCES public.gp_campaigns(id) ON DELETE SET NULL,
  signal_type text NOT NULL,
  signal_source text,
  signal_date date NOT NULL DEFAULT current_date,
  strength text NOT NULL DEFAULT 'medium',
  priority text NOT NULL DEFAULT 'medium',
  relevance text,
  summary text,
  recommended_action text,
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.gp_signals(organization_id, status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gp_signals TO authenticated;
GRANT ALL ON public.gp_signals TO service_role;
ALTER TABLE public.gp_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "signals scoped" ON public.gp_signals FOR ALL TO authenticated
  USING (public.gp_can_access_org(auth.uid(), organization_id))
  WITH CHECK (public.gp_can_access_org(auth.uid(), organization_id));

-- ============ SALES ACTIONS ============
CREATE TABLE public.gp_sales_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.gp_organizations(id) ON DELETE CASCADE,
  account_id uuid REFERENCES public.gp_accounts(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES public.gp_contacts(id) ON DELETE SET NULL,
  signal_id uuid REFERENCES public.gp_signals(id) ON DELETE SET NULL,
  action_type text NOT NULL,
  priority text NOT NULL DEFAULT 'medium',
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date date,
  status text NOT NULL DEFAULT 'new',
  outcome text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.gp_sales_actions(organization_id, status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gp_sales_actions TO authenticated;
GRANT ALL ON public.gp_sales_actions TO service_role;
ALTER TABLE public.gp_sales_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sales_actions scoped" ON public.gp_sales_actions FOR ALL TO authenticated
  USING (public.gp_can_access_org(auth.uid(), organization_id))
  WITH CHECK (public.gp_can_access_org(auth.uid(), organization_id));

-- ============ ONBOARDING ============
CREATE TABLE public.gp_onboarding_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL UNIQUE REFERENCES public.gp_organizations(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'in_progress',
  started_at timestamptz NOT NULL DEFAULT now(),
  target_go_live date,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gp_onboarding_projects TO authenticated;
GRANT ALL ON public.gp_onboarding_projects TO service_role;
ALTER TABLE public.gp_onboarding_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "onb projects scoped" ON public.gp_onboarding_projects FOR ALL TO authenticated
  USING (public.gp_can_access_org(auth.uid(), organization_id))
  WITH CHECK (public.gp_can_access_org(auth.uid(), organization_id));

CREATE TABLE public.gp_onboarding_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.gp_onboarding_projects(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.gp_organizations(id) ON DELETE CASCADE,
  step_order int NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending',
  owner text,
  deadline date,
  client_action text,
  deliverable text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.gp_onboarding_tasks(project_id, step_order);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gp_onboarding_tasks TO authenticated;
GRANT ALL ON public.gp_onboarding_tasks TO service_role;
ALTER TABLE public.gp_onboarding_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "onb tasks scoped" ON public.gp_onboarding_tasks FOR ALL TO authenticated
  USING (public.gp_can_access_org(auth.uid(), organization_id))
  WITH CHECK (public.gp_can_access_org(auth.uid(), organization_id));

-- ============ SERVICE REQUESTS ============
CREATE TABLE public.gp_service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.gp_organizations(id) ON DELETE CASCADE,
  requester_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  request_type text NOT NULL,
  title text NOT NULL,
  description text,
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.gp_service_requests(organization_id, status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gp_service_requests TO authenticated;
GRANT ALL ON public.gp_service_requests TO service_role;
ALTER TABLE public.gp_service_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service req scoped" ON public.gp_service_requests FOR ALL TO authenticated
  USING (public.gp_can_access_org(auth.uid(), organization_id))
  WITH CHECK (public.gp_can_access_org(auth.uid(), organization_id));

-- ============ AUTO-CREATE PROFILE ON SIGNUP ============
CREATE OR REPLACE FUNCTION public.gp_handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.gp_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created_gp ON auth.users;
CREATE TRIGGER on_auth_user_created_gp
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.gp_handle_new_user();

-- ============ UPDATED_AT TRIGGERS ============
CREATE TRIGGER gp_orgs_updated BEFORE UPDATE ON public.gp_organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER gp_profiles_updated BEFORE UPDATE ON public.gp_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER gp_sales_updated BEFORE UPDATE ON public.gp_sales_actions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER gp_svc_updated BEFORE UPDATE ON public.gp_service_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
