import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, TrendingUp, Link2, LinkIcon, ExternalLink, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

type Run = {
  id: string;
  started_at: string;
  finished_at: string | null;
  status: string;
  authority_score: number | null;
  total_backlinks: number | null;
  total_refdomains: number | null;
  new_backlinks: number | null;
  lost_backlinks: number | null;
  rising_pages: number | null;
  error: string | null;
};

type Backlink = {
  id: string;
  source_url: string;
  source_domain: string | null;
  target_url: string;
  anchor: string | null;
  page_ascore: number | null;
  nofollow: boolean;
  first_seen: string;
  last_seen: string;
  status: string;
};

type Position = {
  captured_at: string;
  keyword: string;
  url: string;
  position: number;
  volume: number | null;
};

export const BacklinksTabContent = () => {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [latest, setLatest] = useState<Run | null>(null);
  const [newLinks, setNewLinks] = useState<Backlink[]>([]);
  const [lostLinks, setLostLinks] = useState<Backlink[]>([]);
  const [risers, setRisers] = useState<Array<{ keyword: string; url: string; from: number; to: number }>>([]);

  const load = async () => {
    setLoading(true);
    try {
      const since30 = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();

      const [{ data: runs }, { data: newer }, { data: lost }, { data: positions }] = await Promise.all([
        supabase.from("semrush_sync_runs").select("*").order("started_at", { ascending: false }).limit(1),
        supabase.from("semrush_backlinks").select("*").eq("status", "active").gte("first_seen", since30).order("first_seen", { ascending: false }).limit(50),
        supabase.from("semrush_backlinks").select("*").eq("status", "lost").order("last_seen", { ascending: false }).limit(50),
        supabase.from("semrush_kw_positions").select("*").order("captured_at", { ascending: false }).limit(200),
      ]);

      setLatest((runs?.[0] as Run) ?? null);
      setNewLinks((newer ?? []) as Backlink[]);
      setLostLinks((lost ?? []) as Backlink[]);

      // Compute risers: compare latest snapshot vs previous
      const pos = (positions ?? []) as Position[];
      const byDate = new Map<string, Position[]>();
      for (const p of pos) {
        const list = byDate.get(p.captured_at) ?? [];
        list.push(p);
        byDate.set(p.captured_at, list);
      }
      const dates = Array.from(byDate.keys()).sort().reverse();
      if (dates.length >= 2) {
        const cur = byDate.get(dates[0])!;
        const prevMap = new Map((byDate.get(dates[1])!).map((p) => [p.keyword, p]));
        const rising = cur
          .map((c) => {
            const prev = prevMap.get(c.keyword);
            if (!prev || prev.position <= c.position) return null;
            return { keyword: c.keyword, url: c.url, from: prev.position, to: c.position };
          })
          .filter(Boolean) as Array<{ keyword: string; url: string; from: number; to: number }>;
        rising.sort((a, b) => (b.from - b.to) - (a.from - a.to));
        setRisers(rising.slice(0, 25));
      } else {
        setRisers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const triggerSync = async () => {
    setSyncing(true);
    try {
      const { error } = await supabase.functions.invoke("semrush-sync");
      if (error) throw error;
      toast.success("Sync voltooid");
      await load();
    } catch (e: any) {
      toast.error(e.message || "Sync mislukt");
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Backlinks Monitor</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {latest?.finished_at ? `Laatste sync: ${new Date(latest.finished_at).toLocaleString("nl-NL")}` : "Nog niet gesynchroniseerd"}
          </p>
        </div>
        <Button variant="hero" onClick={triggerSync} disabled={syncing}>
          {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {syncing ? "Synchroniseren..." : "Sync nu"}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Authority Score</div>
          <div className="text-2xl font-bold text-foreground mt-1">{latest?.authority_score ?? "—"}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Verwijzende domeinen</div>
          <div className="text-2xl font-bold text-foreground mt-1">{latest?.total_refdomains ?? "—"}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Totaal backlinks</div>
          <div className="text-2xl font-bold text-foreground mt-1">{latest?.total_backlinks ?? "—"}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Stijgende pagina's (laatste sync)</div>
          <div className="text-2xl font-bold text-foreground mt-1">{latest?.rising_pages ?? 0}</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Link2 className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">Nieuwe backlinks (30d)</h3>
            <Badge variant="secondary">{newLinks.length}</Badge>
          </div>
          {newLinks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nog geen nieuwe links. Klik 'Sync nu'.</p>
          ) : (
            <ul className="space-y-2 max-h-96 overflow-auto text-sm">
              {newLinks.map((b) => (
                <li key={b.id} className="border-b border-border pb-2 last:border-0">
                  <a href={b.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                    {b.source_domain || b.source_url} <ExternalLink className="w-3 h-3" />
                  </a>
                  <div className="text-xs text-muted-foreground truncate">"{b.anchor || "(geen anker)"}" → {b.target_url}</div>
                  <div className="text-xs text-muted-foreground">AS {b.page_ascore ?? "—"} · {new Date(b.first_seen).toLocaleDateString("nl-NL")}</div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <LinkIcon className="w-4 h-4 text-destructive" />
            <h3 className="font-semibold text-foreground">Verloren backlinks</h3>
            <Badge variant="destructive">{lostLinks.length}</Badge>
          </div>
          {lostLinks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Geen verloren links.</p>
          ) : (
            <ul className="space-y-2 max-h-96 overflow-auto text-sm">
              {lostLinks.map((b) => (
                <li key={b.id} className="border-b border-border pb-2 last:border-0">
                  <a href={b.source_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:underline flex items-center gap-1">
                    {b.source_domain || b.source_url} <ExternalLink className="w-3 h-3" />
                  </a>
                  <div className="text-xs text-muted-foreground truncate">"{b.anchor || "(geen anker)"}" → {b.target_url}</div>
                  <div className="text-xs text-muted-foreground">Laatst gezien {new Date(b.last_seen).toLocaleDateString("nl-NL")}</div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground">Stijgende pagina's</h3>
          <Badge variant="secondary">{risers.length}</Badge>
        </div>
        {risers.length === 0 ? (
          <p className="text-sm text-muted-foreground">Stijgers verschijnen zodra er minstens 2 sync-snapshots zijn.</p>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left py-2">Zoekwoord</th>
                  <th className="text-left py-2">URL</th>
                  <th className="text-right py-2">Vorige</th>
                  <th className="text-right py-2">Nu</th>
                  <th className="text-right py-2">Δ</th>
                </tr>
              </thead>
              <tbody>
                {risers.map((r, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-2 font-medium text-foreground">{r.keyword}</td>
                    <td className="py-2 text-xs text-muted-foreground truncate max-w-xs">
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{r.url}</a>
                    </td>
                    <td className="py-2 text-right">{r.from}</td>
                    <td className="py-2 text-right font-semibold">{r.to}</td>
                    <td className="py-2 text-right text-primary flex items-center justify-end gap-1">
                      <ArrowUpRight className="w-3 h-3" /> {r.from - r.to}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BacklinksTabContent;