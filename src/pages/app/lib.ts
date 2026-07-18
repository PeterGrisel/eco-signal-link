import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export function useOrgQuery<T>(orgId: string | null, fn: (orgId: string) => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
    if (!orgId) return;
    setLoading(true);
    fn(orgId).then((d) => { setData(d); setLoading(false); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, reloadKey, ...deps]);
  return { data, loading, reload: () => setReloadKey((k) => k + 1) };
}

export const fmtEUR = (n: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export const priorityColor = (p: string) =>
  p === "high" ? "bg-primary/20 text-primary border-primary/40"
    : p === "medium" ? "bg-yellow-500/15 text-yellow-500 border-yellow-500/30"
    : "bg-muted text-muted-foreground border-border";

export const statusColor = (s: string) =>
  ["done", "won", "meeting_planned", "resolved"].includes(s) ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
  : ["in_progress", "assigned", "contacted", "in_review"].includes(s) ? "bg-primary/15 text-primary border-primary/30"
  : ["waiting_client"].includes(s) ? "bg-yellow-500/15 text-yellow-500 border-yellow-500/30"
  : ["lost", "not_relevant"].includes(s) ? "bg-red-500/15 text-red-500 border-red-500/30"
  : "bg-muted text-muted-foreground border-border";

// De rt_*-tabellen (GTM Runtime) zitten nog niet in de gegenereerde
// Supabase-types; tot `supabase gen types` opnieuw is gedraaid gaan queries
// naar die tabellen via deze untyped client.
export const rtdb = supabase as any;

export const runStatusColor = (s: string) =>
  ["completed", "succeeded", "approved"].includes(s) ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
  : ["running", "queued"].includes(s) ? "bg-primary/15 text-primary border-primary/30"
  : ["waiting_for_approval", "revision_required", "pending"].includes(s) ? "bg-yellow-500/15 text-yellow-500 border-yellow-500/30"
  : ["failed", "rejected", "cancelled"].includes(s) ? "bg-red-500/15 text-red-500 border-red-500/30"
  : "bg-muted text-muted-foreground border-border";

export { supabase };