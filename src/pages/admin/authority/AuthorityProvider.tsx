import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type Website = { id: string; name: string; domain: string; status: string };
type Ctx = {
  websites: Website[];
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  refresh: () => Promise<void>;
  loading: boolean;
};

const C = createContext<Ctx | null>(null);

export const AuthorityProvider = ({ children }: { children: ReactNode }) => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const { data } = await supabase.from("authority_websites").select("id, name, domain, status").order("created_at");
    setWebsites(data || []);
    if (!selectedId && data?.length) setSelectedId(data[0].id);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  return <C.Provider value={{ websites, selectedId, setSelectedId, refresh, loading }}>{children}</C.Provider>;
};

export const useAuthority = () => {
  const c = useContext(C);
  if (!c) throw new Error("useAuthority outside provider");
  return c;
};