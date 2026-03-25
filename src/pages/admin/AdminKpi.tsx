import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart3, TrendingUp, MousePointerClick, Eye, Target,
  RefreshCw, Loader2, Plus, X, ArrowUp, ArrowDown, Minus,
  Calendar
} from "lucide-react";

interface GscOverview {
  period: { start: string; end: string; days: number };
  totals: { impressions: number; clicks: number; ctr: number; conversion_clicks: number };
  top_queries: Array<{ query: string; impressions: number; clicks: number; ctr: number; position: number }>;
  top_pages: Array<{ page: string; impressions: number; clicks: number; ctr: number; position: number; is_conversion: boolean }>;
}

interface ConversionPage {
  id: string;
  url: string;
  label: string;
  is_active: boolean;
}

const AdminKpi = () => {
  const [overview, setOverview] = useState<GscOverview | null>(null);
  const [convPages, setConvPages] = useState<ConversionPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [days, setDays] = useState(28);
  const [newUrl, setNewUrl] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [addingPage, setAddingPage] = useState(false);
  const { toast } = useToast();

  const fetchConvPages = useCallback(async () => {
    const { data } = await supabase.from("conversion_pages").select("*").order("created_at");
    if (data) setConvPages(data as ConversionPage[]);
  }, []);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("fetch-gsc-data", {
        body: { mode: "overview", days },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setOverview(data);
    } catch (e: any) {
      toast({ title: "GSC data ophalen mislukt", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  }, [days, toast]);

  useEffect(() => { fetchConvPages(); }, [fetchConvPages]);
  useEffect(() => { fetchOverview(); }, [fetchOverview]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("fetch-gsc-data", {
        body: { mode: "snapshot", days },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: `${data.rows_synced} rijen gesynchroniseerd` });
      fetchOverview();
    } catch (e: any) {
      toast({ title: "Sync mislukt", description: e.message, variant: "destructive" });
    }
    setSyncing(false);
  };

  const addConvPage = async () => {
    if (!newUrl || !newLabel) return;
    const { error } = await supabase.from("conversion_pages").insert({ url: newUrl, label: newLabel });
    if (error) {
      toast({ title: "Fout", description: error.message, variant: "destructive" });
      return;
    }
    setNewUrl("");
    setNewLabel("");
    setAddingPage(false);
    fetchConvPages();
    toast({ title: "Conversie-pagina toegevoegd" });
  };

  const removeConvPage = async (id: string) => {
    await supabase.from("conversion_pages").delete().eq("id", id);
    fetchConvPages();
  };

  const formatNum = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();
  const formatPct = (n: number) => `${(n * 100).toFixed(1)}%`;

  const positionIcon = (pos: number) => {
    if (pos <= 10) return <ArrowUp className="w-3 h-3 text-green-400" />;
    if (pos <= 20) return <Minus className="w-3 h-3 text-yellow-400" />;
    return <ArrowDown className="w-3 h-3 text-red-400" />;
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" /> KPI Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Search performance, keywords en conversie tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-card border border-border rounded-lg overflow-hidden">
            {[7, 14, 28, 90].map(d => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  days === d ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
          <Button variant="heroOutline" size="sm" onClick={handleSync} disabled={syncing}>
            {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Sync
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {loading && !overview ? (
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-card rounded-lg animate-pulse" />)}
        </div>
      ) : overview ? (
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-muted-foreground">Impressies</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatNum(overview.totals.impressions)}</p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-2 mb-1">
              <MousePointerClick className="w-4 h-4 text-green-400" />
              <span className="text-xs text-muted-foreground">Clicks</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatNum(overview.totals.clicks)}</p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-muted-foreground">CTR</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatPct(overview.totals.ctr)}</p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Conversie clicks</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatNum(overview.totals.conversion_clicks)}</p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Top Keywords */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h2 className="font-display font-semibold text-foreground mb-3 text-sm">Top keywords</h2>
          {overview?.top_queries?.length ? (
            <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
              {overview.top_queries.map((q, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50 text-xs">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-muted-foreground w-4 text-right">{i + 1}</span>
                    <span className="font-mono text-foreground truncate">{q.query}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-muted-foreground">{formatNum(q.impressions)} imp</span>
                    <span className="text-green-400">{q.clicks} cl</span>
                    <span className="text-yellow-400">{formatPct(q.ctr)}</span>
                    <span className="flex items-center gap-1">{positionIcon(q.position)} {q.position.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Geen data beschikbaar</p>
          )}
        </div>

        {/* Top Pages */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h2 className="font-display font-semibold text-foreground mb-3 text-sm">Top pagina's</h2>
          {overview?.top_pages?.length ? (
            <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
              {overview.top_pages.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50 text-xs">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-muted-foreground w-4 text-right">{i + 1}</span>
                    <span className="font-mono text-foreground truncate">
                      {p.page.replace(/https?:\/\/[^/]+/, "")}
                    </span>
                    {p.is_conversion && (
                      <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">conv</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-green-400">{p.clicks} cl</span>
                    <span className="text-muted-foreground">{formatNum(p.impressions)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Geen data beschikbaar</p>
          )}
        </div>
      </div>

      {/* Conversion Pages Config */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-foreground text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" /> Conversie-pagina's
          </h2>
          <Button variant="ghost" size="sm" onClick={() => setAddingPage(true)}>
            <Plus className="w-3.5 h-3.5" /> Toevoegen
          </Button>
        </div>

        {addingPage && (
          <div className="flex gap-2 mb-3">
            <input
              className="flex-1 px-3 py-1.5 text-sm bg-background border border-border rounded-md text-foreground"
              placeholder="/full-sales-management"
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
            />
            <input
              className="w-48 px-3 py-1.5 text-sm bg-background border border-border rounded-md text-foreground"
              placeholder="Label"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
            />
            <Button size="sm" variant="hero" onClick={addConvPage}>Opslaan</Button>
            <Button size="sm" variant="ghost" onClick={() => setAddingPage(false)}>
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}

        {convPages.length > 0 ? (
          <div className="space-y-1">
            {convPages.map(p => (
              <div key={p.id} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50 text-xs">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{p.label}</Badge>
                  <span className="font-mono text-muted-foreground">{p.url}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeConvPage(p.id)} className="text-red-400 hover:text-red-300 h-6 w-6 p-0">
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Voeg conversie-pagina's toe om clicks te tracken</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminKpi;
