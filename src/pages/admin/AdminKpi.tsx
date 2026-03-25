import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart3, TrendingUp, MousePointerClick, Eye, Target,
  RefreshCw, Loader2, Plus, X, ArrowUp, ArrowDown, Minus,
  Sparkles, FileText, Wrench, Globe, Check, Send,
  Lightbulb, Zap, AlertTriangle, Shield, CheckCircle, XCircle, AlertCircle
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

interface AiSuggestion {
  type: "new_page" | "optimize" | "strategy" | "technical_fix";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  headline?: string;
  keyword?: string;
  content_type?: string;
  target_page?: string;
}

interface AuditCheck {
  category: string;
  status: "pass" | "warning" | "fail";
  title: string;
  detail: string;
  impact: string;
}

interface AuditResult {
  score: number;
  audit_time_ms: number;
  summary: { total: number; passed: number; warnings: number; fails: number };
  checks: AuditCheck[];
}

interface AdvisorResult {
  summary: string;
  suggestions: AiSuggestion[];
}

const priorityConfig = {
  high: { color: "bg-red-500/10 text-red-400 border-red-500/20", icon: <AlertTriangle className="w-3 h-3" /> },
  medium: { color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: <Lightbulb className="w-3 h-3" /> },
  low: { color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: <Lightbulb className="w-3 h-3" /> },
};

const typeConfig = {
  new_page: { label: "Nieuwe pagina", icon: <FileText className="w-3.5 h-3.5" />, color: "text-green-400" },
  optimize: { label: "Optimalisatie", icon: <Wrench className="w-3.5 h-3.5" />, color: "text-yellow-400" },
  strategy: { label: "Strategie", icon: <Zap className="w-3.5 h-3.5" />, color: "text-purple-400" },
};

const AdminKpi = () => {
  const [overview, setOverview] = useState<GscOverview | null>(null);
  const [convPages, setConvPages] = useState<ConversionPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [days, setDays] = useState(28);
  const [newUrl, setNewUrl] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [addingPage, setAddingPage] = useState(false);
  const [advisor, setAdvisor] = useState<AdvisorResult | null>(null);
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [queuedSuggestions, setQueuedSuggestions] = useState<Set<number>>(new Set());
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

  const handleAdvisor = async () => {
    setAdvisorLoading(true);
    setQueuedSuggestions(new Set());
    try {
      const { data, error } = await supabase.functions.invoke("kpi-advisor", {
        body: { mode: "analyze" },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setAdvisor(data);
    } catch (e: any) {
      toast({ title: "AI Advisor mislukt", description: e.message, variant: "destructive" });
    }
    setAdvisorLoading(false);
  };

  const handleQueueSuggestion = async (suggestion: AiSuggestion, index: number) => {
    try {
      const { data, error } = await supabase.functions.invoke("kpi-advisor", {
        body: {
          mode: "queue_suggestion",
          headline: suggestion.headline || suggestion.title,
          keyword: suggestion.keyword,
          content_type: suggestion.content_type || "article",
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setQueuedSuggestions(prev => new Set([...prev, index]));
      toast({ title: "📝 Naar content queue gestuurd", description: suggestion.headline || suggestion.title });
    } catch (e: any) {
      toast({ title: "Fout", description: e.message, variant: "destructive" });
    }
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

      {/* AI Advisor Panel */}
      <div className="bg-card border border-border rounded-lg p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground">AI Advisor</h2>
            {advisor && (
              <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/20">
                LIVE
              </Badge>
            )}
          </div>
          <Button
            variant="hero"
            size="sm"
            onClick={handleAdvisor}
            disabled={advisorLoading}
            className="gap-1.5"
          >
            {advisorLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Analyseren...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Analyseer & Adviseer</>
            )}
          </Button>
        </div>

        {!advisor && !advisorLoading && (
          <p className="text-sm text-muted-foreground">
            Laat AI je GSC-data analyseren en concrete acties voorstellen — inclusief nieuwe pagina's die direct naar de content queue gaan.
          </p>
        )}

        {advisorLoading && (
          <div className="flex items-center gap-3 py-6 justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">AI analyseert je data, keywords en content gaps...</span>
          </div>
        )}

        {advisor && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="px-4 py-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-sm text-foreground">{advisor.summary}</p>
            </div>

            {/* Suggestions */}
            <div className="space-y-3">
              {advisor.suggestions.map((s, i) => {
                const pConfig = priorityConfig[s.priority];
                const tConfig = typeConfig[s.type];
                const isQueued = queuedSuggestions.has(i);

                return (
                  <div key={i} className="p-4 rounded-lg bg-background border border-border group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={tConfig.color}>{tConfig.icon}</span>
                          <span className="font-medium text-sm text-foreground">{s.title}</span>
                          <Badge variant="outline" className={`text-[10px] ${pConfig.color} gap-1`}>
                            {pConfig.icon} {s.priority}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">
                            {tConfig.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                        {s.keyword && (
                          <span className="inline-block mt-1.5 text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {s.keyword}
                          </span>
                        )}
                        {s.target_page && (
                          <span className="inline-block mt-1.5 text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                            {s.target_page}
                          </span>
                        )}
                      </div>

                      {/* Action: queue new_page suggestions */}
                      {s.type === "new_page" && (
                        <Button
                          variant={isQueued ? "ghost" : "heroOutline"}
                          size="sm"
                          onClick={() => handleQueueSuggestion(s, i)}
                          disabled={isQueued}
                          className="gap-1.5 flex-shrink-0"
                        >
                          {isQueued ? (
                            <><Check className="w-3.5 h-3.5 text-green-400" /> In queue</>
                          ) : (
                            <><Send className="w-3.5 h-3.5" /> Naar Queue</>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

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
