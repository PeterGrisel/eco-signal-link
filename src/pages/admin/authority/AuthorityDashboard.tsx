import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuthority } from "./AuthorityProvider";
import { Loader2 } from "lucide-react";

export const AuthorityDashboard = () => {
  const { selectedId } = useAuthority();
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedId) return;
    (async () => {
      setLoading(true);
      const countQ = (col: string, val: string) =>
        supabase.from("authority_opportunities").select("id", { count: "exact", head: true }).eq("website_id", selectedId).eq(col, val);
      const [total, qualified, needsAsset, ready, placed, lost, assets, runs] = await Promise.all([
        supabase.from("authority_opportunities").select("id", { count: "exact", head: true }).eq("website_id", selectedId),
        countQ("status", "qualified"),
        countQ("status", "needs_asset"),
        countQ("status", "ready_for_outreach"),
        supabase.from("authority_placements").select("id", { count: "exact", head: true }).eq("website_id", selectedId).in("status", ["verified", "placed"]),
        supabase.from("authority_placements").select("id", { count: "exact", head: true }).eq("website_id", selectedId).eq("status", "lost"),
        supabase.from("authority_assets").select("id", { count: "exact", head: true }).eq("website_id", selectedId),
        supabase.from("authority_runs").select("id", { count: "exact", head: true }).eq("website_id", selectedId),
      ]);
      setStats({
        Opportunities: total.count || 0,
        Qualified: qualified.count || 0,
        "Needs Asset": needsAsset.count || 0,
        "Ready for Outreach": ready.count || 0,
        "Placed Links": placed.count || 0,
        "Lost Links": lost.count || 0,
        Assets: assets.count || 0,
        Runs: runs.count || 0,
      });
      setLoading(false);
    })();
  }, [selectedId]);

  if (loading) return <div className="py-12 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" /></div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
      {Object.entries(stats).map(([k, v]) => (
        <Card key={k} className="p-4">
          <div className="text-xs text-muted-foreground">{k}</div>
          <div className="text-2xl font-semibold text-foreground mt-1">{v}</div>
        </Card>
      ))}
    </div>
  );
};