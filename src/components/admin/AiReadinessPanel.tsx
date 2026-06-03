import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Play, Sparkles, AlertTriangle, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ReadinessRow {
  slug: string;
  page_type: string;
  ai_readiness_score: number;
  missing_factors: string[];
  has_answer_block: boolean;
  has_faq: boolean;
  internal_links_count: number;
  last_scanned_at: string | null;
}

interface RefreshRow {
  id: string;
  slug: string;
  reason: string;
  priority: string;
  status: string;
  created_at: string;
}

const sb = supabase as any;

const scoreColor = (s: number) =>
  s >= 80 ? "text-emerald-500" : s >= 60 ? "text-amber-500" : "text-destructive";

const factorLabels: Record<string, string> = {
  answer_block: "Kernantwoord",
  faq: "FAQ-sectie",
  internal_links: "Interne links (<3)",
  recent_date: "Recente datum",
  concrete_examples: "Concrete voorbeelden",
};

const AiReadinessPanel = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<ReadinessRow[]>([]);
  const [queue, setQueue] = useState<RefreshRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [enriching, setEnriching] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: r }, { data: q }] = await Promise.all([
      sb.from("seo_ai_readiness")
        .select("*")
        .order("ai_readiness_score", { ascending: true })
        .limit(100),
      sb.from("content_refresh_queue")
        .select("id, slug, reason, priority, status, created_at")
        .eq("status", "open")
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(50),
    ]);
    setRows((r as any) || []);
    setQueue((q as any) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const runScan = async () => {
    setScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-readiness-scan");
      if (error) throw error;
      toast({ title: "Scan klaar", description: `${data?.summary?.updated || 0} pagina's bijgewerkt` });
      await load();
    } catch (e: any) {
      toast({ title: "Scan mislukt", description: e.message, variant: "destructive" });
    } finally {
      setScanning(false);
    }
  };

  const runEnrich = async () => {
    if (!confirm("Bulk Kernantwoord + FAQ toevoegen aan alle pagina's die deze missen? Dit muteert content.")) return;
    setEnriching(true);
    try {
      const { data, error } = await supabase.functions.invoke("enrich-ai-readiness", { body: { limit: 50 } });
      if (error) throw error;
      const s = data?.summary || {};
      toast({
        title: "Enrichment klaar",
        description: `${s.enriched || 0} verrijkt, ${s.skipped || 0} overgeslagen, ${s.failed || 0} mislukt`,
      });
      await load();
    } catch (e: any) {
      toast({ title: "Enrichment mislukt", description: e.message, variant: "destructive" });
    } finally {
      setEnriching(false);
    }
  };

  const dismissQueueItem = async (id: string) => {
    await sb.from("content_refresh_queue").update({ status: "dismissed" }).eq("id", id);
    setQueue((q) => q.filter((x) => x.id !== id));
  };

  const avgScore =
    rows.length > 0 ? Math.round(rows.reduce((a, r) => a + r.ai_readiness_score, 0) / rows.length) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header + KPIs */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> AI Citation Readiness
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Hoe goed scoort uw content voor citatie in AI-antwoorden (ChatGPT, Perplexity, Gemini, Copilot).
          </p>
        </div>
        <Button onClick={runScan} disabled={scanning} variant="hero">
          {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {scanning ? "Scannen..." : "Scan nu"}
        </Button>
        <Button onClick={runEnrich} disabled={enriching} variant="outline">
          {enriching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {enriching ? "Verrijken..." : "Bulk verrijken"}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Gemiddelde score</div>
          <div className={`text-3xl font-display font-bold mt-1 ${scoreColor(avgScore)}`}>{avgScore}/100</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Pagina's gescand</div>
          <div className="text-3xl font-display font-bold text-foreground mt-1">{rows.length}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Refresh queue</div>
          <div className="text-3xl font-display font-bold text-amber-500 mt-1">{queue.length}</div>
        </div>
      </div>

      {/* Refresh queue */}
      {queue.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-amber-500" /> Content refresh queue
          </h3>
          <div className="border border-border rounded-xl overflow-hidden bg-card">
            {queue.map((q) => (
              <div key={q.id} className="p-3 border-b border-border last:border-0 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant={q.priority === "high" ? "destructive" : "outline"} className="text-[10px] uppercase">
                      {q.priority}
                    </Badge>
                    <a href={q.slug} target="_blank" rel="noopener" className="text-sm font-mono text-foreground hover:text-primary truncate">
                      {q.slug} <ExternalLink className="inline w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{q.reason}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => dismissQueueItem(q.id)} className="text-xs">
                  Verwijderen
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagina overzicht */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Laagste scores eerst</h3>
        {rows.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-xl">
            <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Nog geen scan-data. Klik op "Scan nu" om te beginnen.
            </p>
          </div>
        ) : (
          <div className="border border-border rounded-xl overflow-hidden bg-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="text-left p-3">Pagina</th>
                  <th className="text-left p-3 w-20">Type</th>
                  <th className="text-left p-3 w-24">Score</th>
                  <th className="text-left p-3">Mist</th>
                  <th className="text-left p-3 w-20">Links</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.slug} className="border-t border-border hover:bg-secondary/20">
                    <td className="p-3">
                      <a href={r.slug} target="_blank" rel="noopener" className="font-mono text-xs text-foreground hover:text-primary inline-flex items-center gap-1">
                        {r.slug} <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="p-3"><Badge variant="outline" className="text-[10px]">{r.page_type}</Badge></td>
                    <td className={`p-3 font-display font-bold ${scoreColor(r.ai_readiness_score)}`}>
                      {r.ai_readiness_score}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {(r.missing_factors || []).map((f) => (
                          <Badge key={f} variant="outline" className="text-[10px] text-amber-500 border-amber-500/30">
                            {factorLabels[f] || f}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{r.internal_links_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiReadinessPanel;