import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart3, TrendingUp, MousePointerClick, Eye, Target,
  RefreshCw, Loader2, Plus, X, ArrowUp, ArrowDown, Minus,
  Sparkles, FileText, Wrench, Globe, Check, Send,
  Lightbulb, Zap, AlertTriangle, Shield, CheckCircle, XCircle, AlertCircle,
  Users, Clock, Activity
} from "lucide-react";

interface Ga4Data {
  connected?: boolean;
  error?: string;
  message?: string;
  property_id?: string;
  period: { days: number };
  totals: {
    sessions: number;
    users: number;
    pageviews: number;
    bounce_rate: number;
    avg_session_duration: number;
    engaged_sessions: number;
  };
  top_pages: Array<{ path: string; pageviews: number; sessions: number; bounce_rate: number; avg_duration: number }>;
  traffic_sources: Array<{ channel: string; sessions: number; users: number; engaged_sessions: number }>;
}

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

const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  new_page: { label: "Nieuwe pagina", icon: <FileText className="w-3.5 h-3.5" />, color: "text-green-400" },
  optimize: { label: "Optimalisatie", icon: <Wrench className="w-3.5 h-3.5" />, color: "text-yellow-400" },
  strategy: { label: "Strategie", icon: <Zap className="w-3.5 h-3.5" />, color: "text-purple-400" },
  technical_fix: { label: "Technische fix", icon: <Shield className="w-3.5 h-3.5" />, color: "text-red-400" },
};

interface LighthouseResult {
  url: string;
  strategy: string;
  scores: Record<string, number>;
  metrics: Array<{ id: string; title: string; description: string; score: number | null; displayValue?: string }>;
  opportunities: Array<{ id: string; title: string; description: string; score: number | null; displayValue?: string }>;
  fetchTime: string;
}

const scoreColor = (score: number) =>
  score >= 90 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400";
const scoreBg = (score: number) =>
  score >= 90 ? "border-green-500/30 bg-green-500/10" : score >= 50 ? "border-yellow-500/30 bg-yellow-500/10" : "border-red-500/30 bg-red-500/10";

export const KpiTabContent = () => {
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
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [ga4, setGa4] = useState<Ga4Data | null>(null);
  const [ga4Error, setGa4Error] = useState<string | null>(null);
  const [ga4Loading, setGa4Loading] = useState(false);
  const [lighthouse, setLighthouse] = useState<LighthouseResult | null>(null);
  const [lhLoading, setLhLoading] = useState(false);
  const [lhStrategy, setLhStrategy] = useState<"mobile" | "desktop">("mobile");
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

  const fetchGa4 = useCallback(async () => {
    setGa4Loading(true);
    try {
      const { data, error } = await supabase.functions.invoke("fetch-ga4-data", {
        body: { days },
      });
      if (error) throw error;
      if (data?.error) {
        setGa4(null);
        setGa4Error(data.message || data.error);
        setGa4Loading(false);
        return;
      }
      setGa4Error(null);
      setGa4(data);
    } catch (e: any) {
      setGa4(null);
      setGa4Error(e.message);
      toast({ title: "GA4 data ophalen mislukt", description: e.message, variant: "destructive" });
    }
    setGa4Loading(false);
  }, [days, toast]);

  useEffect(() => { fetchConvPages(); }, [fetchConvPages]);
  useEffect(() => { fetchOverview(); }, [fetchOverview]);
  useEffect(() => { fetchGa4(); }, [fetchGa4]);

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

  const handleLighthouse = async () => {
    setLhLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("lighthouse-audit", {
        body: { strategy: lhStrategy },
      });
      if (error) {
        // Check if the response body has rate_limit info
        if (typeof error === "object" && error.message?.includes("429")) {
          throw new Error("Google PageSpeed API quotum bereikt. Probeer het later opnieuw of configureer een eigen API key.");
        }
        throw error;
      }
      if (data?.error === "rate_limit") {
        throw new Error(data.message || "API quotum bereikt");
      }
      if (data?.error) throw new Error(data.error);
      setLighthouse(data);
    } catch (e: any) {
      toast({ title: "Lighthouse audit mislukt", description: e.message, variant: "destructive" });
    }
    setLhLoading(false);
  };

  const handleAudit = async () => {
    setAuditLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("seo-audit", { body: {} });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setAudit(data);
    } catch (e: any) {
      toast({ title: "SEO Audit mislukt", description: e.message, variant: "destructive" });
    }
    setAuditLoading(false);
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
    <>
      <div className="flex items-center justify-end gap-2 mb-6">
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

      {/* KPI Cards */}
      {loading && !overview ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-card rounded-lg animate-pulse" />)}
        </div>
      ) : overview ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

      {/* SEO Audit Panel */}
      <div className="bg-card border border-border rounded-lg p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground">Technische SEO Audit</h2>
            {audit && (
              <Badge variant="outline" className={`text-[10px] gap-1 ${
                audit.score >= 80 ? "bg-green-500/10 text-green-400 border-green-500/20" :
                audit.score >= 50 ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                "bg-red-500/10 text-red-400 border-red-500/20"
              }`}>
                Score: {audit.score}/100
              </Badge>
            )}
          </div>
          <Button variant="heroOutline" size="sm" onClick={handleAudit} disabled={auditLoading} className="gap-1.5">
            {auditLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Scannen...</>
            ) : (
              <><Shield className="w-4 h-4" /> Run Audit</>
            )}
          </Button>
        </div>

        {!audit && !auditLoading && (
          <p className="text-sm text-muted-foreground">
            Scan je website op technische SEO problemen: indexering, snelheid, meta tags, sitemap en meer.
          </p>
        )}

        {auditLoading && (
          <div className="flex items-center gap-3 py-6 justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Website scannen op technische SEO problemen...</span>
          </div>
        )}

        {audit && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-background border border-border text-center">
                <p className="text-lg font-bold text-foreground">{audit.summary.total}</p>
                <p className="text-[10px] text-muted-foreground">Checks</p>
              </div>
              <div className="p-3 rounded-lg bg-background border border-border text-center">
                <p className="text-lg font-bold text-green-400">{audit.summary.passed}</p>
                <p className="text-[10px] text-muted-foreground">Geslaagd</p>
              </div>
              <div className="p-3 rounded-lg bg-background border border-border text-center">
                <p className="text-lg font-bold text-yellow-400">{audit.summary.warnings}</p>
                <p className="text-[10px] text-muted-foreground">Waarschuwingen</p>
              </div>
              <div className="p-3 rounded-lg bg-background border border-border text-center">
                <p className="text-lg font-bold text-red-400">{audit.summary.fails}</p>
                <p className="text-[10px] text-muted-foreground">Fouten</p>
              </div>
            </div>

            <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
              {audit.checks.map((check, i) => (
                <div key={i} className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 text-xs">
                  <div className="flex-shrink-0 mt-0.5">
                    {check.status === "pass" ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : check.status === "warning" ? (
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{check.title}</span>
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">{check.category}</Badge>
                      {check.impact === "high" && check.status !== "pass" && (
                        <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-400 border-red-500/20">
                          high impact
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-0.5">{check.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground text-right">Audit voltooid in {audit.audit_time_ms}ms</p>
          </div>
        )}
      </div>

      {/* Lighthouse / PageSpeed Insights Panel */}
      <div className="bg-card border border-border rounded-lg p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground">Lighthouse Audit</h2>
            {lighthouse && (
              <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                {lighthouse.strategy}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-border overflow-hidden">
              <button
                onClick={() => setLhStrategy("mobile")}
                className={`px-3 py-1 text-xs transition-colors ${lhStrategy === "mobile" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}
              >
                Mobile
              </button>
              <button
                onClick={() => setLhStrategy("desktop")}
                className={`px-3 py-1 text-xs transition-colors ${lhStrategy === "desktop" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}
              >
                Desktop
              </button>
            </div>
            <Button variant="heroOutline" size="sm" onClick={handleLighthouse} disabled={lhLoading} className="gap-1.5">
              {lhLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Scannen...</>
              ) : (
                <><Zap className="w-4 h-4" /> Run Lighthouse</>
              )}
            </Button>
          </div>
        </div>

        {!lighthouse && !lhLoading && (
          <p className="text-sm text-muted-foreground">
            Test je site met Google Lighthouse — scores voor Performance, SEO, Accessibility en Best Practices.
          </p>
        )}

        {lhLoading && (
          <div className="flex items-center gap-3 py-8 justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Lighthouse audit uitvoeren via PageSpeed Insights... (±15s)</span>
          </div>
        )}

        {lighthouse && (
          <div className="space-y-4">
            {/* Score circles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: "performance", label: "Performance" },
                { key: "seo", label: "SEO" },
                { key: "accessibility", label: "Accessibility" },
                { key: "best-practices", label: "Best Practices" },
              ].map(({ key, label }) => {
                const score = lighthouse.scores[key] ?? 0;
                return (
                  <div key={key} className={`p-4 rounded-lg border text-center ${scoreBg(score)}`}>
                    <p className={`text-3xl font-bold ${scoreColor(score)}`}>{score}</p>
                    <p className="text-xs text-muted-foreground mt-1">{label}</p>
                  </div>
                );
              })}
            </div>

            {/* Key metrics */}
            {lighthouse.metrics.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Belangrijke metrics</h3>
                <div className="space-y-1 max-h-[300px] overflow-y-auto">
                  {lighthouse.metrics.map((m) => (
                    <div key={m.id} className="flex items-center gap-3 py-1.5 px-3 rounded-lg hover:bg-muted/50 text-xs">
                      <div className="flex-shrink-0">
                        {m.score === null ? (
                          <AlertCircle className="w-4 h-4 text-muted-foreground" />
                        ) : m.score >= 0.9 ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : m.score >= 0.5 ? (
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-foreground">{m.title}</span>
                        {m.displayValue && (
                          <span className="ml-2 text-muted-foreground">{m.displayValue}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Opportunities */}
            {lighthouse.opportunities.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Verbeterpunten</h3>
                <div className="space-y-1 max-h-[250px] overflow-y-auto">
                  {lighthouse.opportunities.map((o) => (
                    <div key={o.id} className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 text-xs">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{o.title}</span>
                          {o.displayValue && (
                            <Badge variant="outline" className="text-[10px] text-muted-foreground">{o.displayValue}</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mt-0.5">{o.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-[10px] text-muted-foreground text-right">
              Gescand op {new Date(lighthouse.fetchTime).toLocaleString("nl-NL")} · Strategie: {lighthouse.strategy}
            </p>
          </div>
        )}
      </div>

      {/* GA4 Analytics Section */}
      <div className="bg-card border border-border rounded-lg p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground">Google Analytics</h2>
            {ga4 && !ga4Error && (
              <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/20">
                LIVE
              </Badge>
            )}
          </div>
        </div>

        {ga4Loading && !ga4 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />)}
          </div>
        ) : ga4Error ? (
          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">GA4 is nog niet gekoppeld</p>
                <p className="text-sm text-muted-foreground">{ga4Error}</p>
              </div>
            </div>
          </div>
        ) : ga4 ? (
          <div className="space-y-5">
            {/* GA4 KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-muted-foreground">Sessies</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{formatNum(ga4.totals.sessions)}</p>
              </div>
              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-muted-foreground">Gebruikers</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{formatNum(ga4.totals.users)}</p>
              </div>
              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-muted-foreground">Pageviews</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{formatNum(ga4.totals.pageviews)}</p>
              </div>
              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Gem. sessieduur</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{Math.round(ga4.totals.avg_session_duration)}s</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Traffic Sources */}
              <div className="bg-background border border-border rounded-lg p-4">
                <h3 className="font-display font-semibold text-foreground mb-3 text-sm">Verkeersbronnen</h3>
                {ga4.traffic_sources.length ? (
                  <div className="space-y-1.5 max-h-[250px] overflow-y-auto">
                    {ga4.traffic_sources.map((s, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50 text-xs">
                        <span className="font-medium text-foreground">{s.channel}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground">{formatNum(s.sessions)} sessies</span>
                          <span className="text-green-400">{formatNum(s.users)} gebruikers</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Geen data</p>
                )}
              </div>

              {/* GA4 Top Pages */}
              <div className="bg-background border border-border rounded-lg p-4">
                <h3 className="font-display font-semibold text-foreground mb-3 text-sm">Top pagina's (GA4)</h3>
                {ga4.top_pages.length ? (
                  <div className="space-y-1.5 max-h-[250px] overflow-y-auto">
                    {ga4.top_pages.slice(0, 10).map((p, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50 text-xs">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-muted-foreground w-4 text-right">{i + 1}</span>
                          <span className="font-mono text-foreground truncate">{p.path}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-green-400">{p.pageviews} views</span>
                          <span className="text-muted-foreground">{formatPct(p.bounce_rate)} bounce</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Geen data</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Geen GA4 data beschikbaar.</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
    </>
  );
};

