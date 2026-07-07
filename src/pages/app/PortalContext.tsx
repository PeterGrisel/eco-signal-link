import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export type Membership = {
  organization_id: string;
  role: string;
  organization: { id: string; name: string; package: string | null; slug: string | null };
};

type Ctx = {
  session: Session | null;
  loading: boolean;
  memberships: Membership[];
  currentOrgId: string | null;
  setCurrentOrgId: (id: string) => void;
  isRebelForce: boolean;
  signOut: () => Promise<void>;
};

const PortalCtx = createContext<Ctx | null>(null);

const RF_ROLES = ["super_admin", "rebel_force_admin", "growth_manager", "growth_operator"];

export function PortalProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [currentOrgId, _setCurrentOrgId] = useState<string | null>(null);

  const setCurrentOrgId = (id: string) => {
    _setCurrentOrgId(id);
    localStorage.setItem("portal_org_id", id);
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setMemberships([]);
      _setCurrentOrgId(null);
      return;
    }
    (async () => {
      // Bootstrap super_admin if no rebel force yet
      try {
        await supabase.functions.invoke("bootstrap-super-admin");
      } catch { /* noop */ }

      const { data } = await supabase
        .from("gp_organization_members")
        .select("organization_id, role, organization:gp_organizations(id, name, package, slug)")
        .eq("user_id", session.user.id);
      const rows = (data ?? []) as any as Membership[];
      setMemberships(rows);
      const saved = localStorage.getItem("portal_org_id");
      const initial = saved && rows.some((r) => r.organization_id === saved) ? saved : rows[0]?.organization_id ?? null;
      _setCurrentOrgId(initial);
    })();
  }, [session]);

  const isRebelForce = memberships.some((m) => RF_ROLES.includes(m.role));

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <PortalCtx.Provider value={{ session, loading, memberships, currentOrgId, setCurrentOrgId, isRebelForce, signOut }}>
      {children}
    </PortalCtx.Provider>
  );
}

export function usePortal() {
  const ctx = useContext(PortalCtx);
  if (!ctx) throw new Error("usePortal must be used inside PortalProvider");
  return ctx;
}

export function useRequireAuth() {
  const { session, loading } = usePortal();
  const nav = useNavigate();
  useEffect(() => {
    if (!loading && !session) nav("/app/login", { replace: true });
  }, [session, loading, nav]);
  return { session, loading };
}