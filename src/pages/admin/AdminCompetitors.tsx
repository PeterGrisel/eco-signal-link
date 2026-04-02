import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Plus, Trash2, ExternalLink, Globe, RefreshCw, Search, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

interface StrategyCluster {
  name: string;
  slug: string;
  description: string;
  target_keywords: string[];
  target_article_count: number;
  priority: number;
  pillar_article?: string;
  subtopics?: { headline: string; keyword: string; publish_order: number }[];
  content_gaps?: string[];
  search_volume?: string;
  comparison_type?: "gap" | "sterkte" | "kans" | "bedreiging";
  our_score?: number;
  competitor_score?: number;
}

interface AnalysisReport {
  summary: string;
  clusters: StrategyCluster[];
  recommendations: string[];
  analyzedAt: string;
  competitorUrl?: string;
}

interface CompetitorData {
  url: string;
  title?: string;
  description?: string;
  lastScraped?: string;
  report?: AnalysisReport;
}

const AdminCompetitors = () => {
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [competitorData, setCompetitorData] = useState<Record<string, CompetitorData>>({});
  const [newUrl, setNewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scraping, setScraping] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<AnalysisReport | null>(null);
  const [expandedClusters, setExpandedClusters] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadCompetitors();
  }, []);

  const loadCompetitors = async () => {
    const { data } = await supabase.from("seo_settings").select("config").limit(1).single();
    const config = data?.config as any;
    const urls = config?.competitors || [];
    setCompetitors(urls);
    // Load saved reports
    if (config?.competitor_reports) {
      const saved: Record<string, CompetitorData> = {};
      for (const [url, report] of Object.entries(config.competitor_reports as Record<string, any>)) {
        saved[url] = { url, title: new URL(url).hostname, lastScraped: (report as any).analyzedAt, report: report as AnalysisReport };
      }
      setCompetitorData(saved);
    }
    setLoading(false);
  };

  const saveCompetitors = async (urls: string[], reports?: Record<string, AnalysisReport>) => {
    setSaving(true);
    const { data: current } = await supabase.from("seo_settings").select("id, config").limit(1).single();
    if (current) {
      const updatedConfig: any = { ...(current.config as any), competitors: urls };
      if (reports) updatedConfig.competitor_reports = reports;
      await supabase.from("seo_settings").update({ config: updatedConfig }).eq("id", current.id);
    }
    setSaving(false);
  };

  const addCompetitor = async () => {
    let url = newUrl.trim();
    if (!url) return;
    if (!url.startsWith("http")) url = `https://${url}`;
    if (competitors.includes(url)) {
      toast.error("Deze concurrent staat al in de lijst");
      return;
    }
    const updated = [...competitors, url];
    setCompetitors(updated);
    setNewUrl("");
    await saveCompetitors(updated);
    toast.success("Concurrent toegevoegd");
  };

  const removeCompetitor = async (url: string) => {
    const updated = competitors.filter(c => c !== url);
    setCompetitors(updated);
    const newData = { ...competitorData };
    delete newData[url];
    setCompetitorData(newData);
    await saveCompetitors(updated, buildReportsMap(newData));
  };

  const buildReportsMap = (data: Record<string, CompetitorData>) => {
    const reports: Record<string, AnalysisReport> = {};
    for (const [url, d] of Object.entries(data)) {
      if (d.report) reports[url] = d.report;
    }
    return reports;
  };

  const scrapeCompetitor = async (url: string) => {
    setScraping(url);
    try {
      const { data, error } = await supabase.functions.invoke("strategy-agent", {
        body: { competitors: [url], mode: "evaluate" },
      });
      if (error) throw error;

      const report: AnalysisReport = {
        summary: data?.summary || "Geen samenvatting beschikbaar",
        clusters: data?.clusters || [],
        recommendations: data?.recommendations || [],
        analyzedAt: new Date().toISOString(),
        competitorUrl: url,
      };

      const newData = {
        ...competitorData,
        [url]: {
          url,
          title: new URL(url).hostname,
          description: report.summary.slice(0, 200),
          lastScraped: report.analyzedAt,
          report,
        },
      };
      setCompetitorData(newData);
      await saveCompetitors(competitors, buildReportsMap(newData));
      toast.success(`${new URL(url).hostname} geanalyseerd`);
    } catch (e) {
      toast.error(`Fout bij analyseren: ${e instanceof Error ? e.message : "Onbekend"}`);
    } finally {
      setScraping(null);
    }
  };

  const runFullAnalysis = async () => {
    setScraping("all");
    try {
      const { data, error } = await supabase.functions.invoke("strategy-agent", {
        body: { competitors, mode: "evaluate" },
      });
      if (error) throw error;

      const report: AnalysisReport = {
        summary: data?.summary || "Geen samenvatting",
        clusters: data?.clusters || [],
        recommendations: data?.recommendations || [],
        analyzedAt: new Date().toISOString(),
      };

      // Store under a combined key
      const newData = { ...competitorData };
      newData["__full__"] = {
        url: "all",
        title: "Volledige analyse",
        lastScraped: report.analyzedAt,
        report,
      };
      setCompetitorData(newData);
      await saveCompetitors(competitors, buildReportsMap(newData));

      toast.success("Volledige concurrentanalyse afgerond");
      setSelectedReport(report);
    } catch (e) {
      toast.error(`Analyse mislukt: ${e instanceof Error ? e.message : "Onbekend"}`);
    } finally {
      setScraping(null);
    }
  };

  const toggleCluster = (index: number) => {
    setExpandedClusters(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Search className="w-6 h-6 text-primary" /> Concurrentanalyse
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Beheer concurrenten en analyseer hun content strategie
          </p>
        </div>
        <div className="flex gap-2">
          {competitorData["__full__"]?.report && (
            <Button variant="outline" onClick={() => setSelectedReport(competitorData["__full__"].report!)}>
              <FileText className="w-4 h-4 mr-1" /> Laatste rapport
            </Button>
          )}
          <Button
            variant="hero"
            onClick={runFullAnalysis}
            disabled={scraping !== null || competitors.length === 0}
          >
            {scraping === "all" ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Volledige analyse
          </Button>
        </div>
      </div>

      {/* Add competitor */}
      <Card className="p-4 mb-6">
        <div className="flex gap-2">
          <Input
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            placeholder="https://concurrent.nl"
            onKeyDown={e => e.key === "Enter" && addCompetitor()}
            className="flex-1"
          />
          <Button onClick={addCompetitor} disabled={!newUrl.trim() || saving}>
            <Plus className="w-4 h-4 mr-1" /> Toevoegen
          </Button>
        </div>
      </Card>

      {/* Competitor list */}
      <div className="grid gap-4">
        {competitors.length === 0 && (
          <Card className="p-8 text-center text-muted-foreground">
            Geen concurrenten toegevoegd. Voeg er hierboven een toe.
          </Card>
        )}

        {competitors.map(url => {
          const data = competitorData[url];
          const hostname = (() => { try { return new URL(url).hostname; } catch { return url; } })();

          return (
            <Card key={url} className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground truncate">{hostname}</span>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    {data?.description && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{data.description}</p>
                    )}
                    {data?.lastScraped && (
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px]">
                          Geanalyseerd {new Date(data.lastScraped).toLocaleDateString("nl-NL")}
                        </Badge>
                        {data.report && (
                          <Badge variant="outline" className="text-[10px]">
                            {data.report.clusters.length} clusters
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {data?.report && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setExpandedClusters(new Set()); setSelectedReport(data.report!); }}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span className="ml-1 hidden sm:inline">Rapport</span>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => scrapeCompetitor(url)}
                    disabled={scraping !== null}
                  >
                    {scraping === url ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    <span className="ml-1 hidden sm:inline">Analyseer</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCompetitor(url)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Info section */}
      <Card className="p-4 mt-6 bg-primary/5 border-primary/20">
        <h3 className="text-sm font-semibold text-foreground mb-2">💡 Hoe werkt het?</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Klik <strong>"Analyseer"</strong> bij een concurrent om hun content te scrapen en analyseren</li>
          <li>• Na analyse verschijnt een <strong>"Rapport"</strong> knop om de resultaten te bekijken</li>
          <li>• Gebruik <strong>"Volledige analyse"</strong> voor een uitgebreide evaluatie t.o.v. alle concurrenten</li>
          <li>• Resultaten worden opgeslagen en gebruikt om je content strategie te optimaliseren</li>
        </ul>
      </Card>

      {/* Report Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Analyse Rapport
              {selectedReport?.competitorUrl && (
                <Badge variant="secondary" className="ml-2 text-xs font-normal">
                  {(() => { try { return new URL(selectedReport.competitorUrl).hostname; } catch { return selectedReport.competitorUrl; } })()}
                </Badge>
              )}
            </DialogTitle>
            {selectedReport?.analyzedAt && (
              <p className="text-xs text-muted-foreground">
                Gegenereerd op {new Date(selectedReport.analyzedAt).toLocaleString("nl-NL")}
              </p>
            )}
          </DialogHeader>
          <ScrollArea className="max-h-[calc(85vh-100px)] px-6 pb-6">
            {selectedReport && (
              <div className="space-y-6 pt-4">
                {/* Summary */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Samenvatting</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedReport.summary}</p>
                </div>

                {/* Recommendations */}
                {selectedReport.recommendations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">
                      Aanbevelingen ({selectedReport.recommendations.length})
                    </h3>
                    <ul className="space-y-2">
                      {selectedReport.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary font-bold mt-0.5">→</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Clusters */}
                {selectedReport.clusters.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">
                      Topic Clusters ({selectedReport.clusters.length})
                    </h3>
                    <div className="space-y-3">
                      {selectedReport.clusters.map((cluster, i) => (
                        <Card key={i} className="p-3">
                          <button
                            className="w-full text-left flex items-center justify-between"
                            onClick={() => toggleCluster(i)}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-medium text-sm text-foreground truncate">{cluster.name}</span>
                              <Badge variant="outline" className="text-[10px] shrink-0">
                                prio {cluster.priority}
                              </Badge>
                              {cluster.search_volume && (
                                <Badge variant="secondary" className="text-[10px] shrink-0">
                                  {cluster.search_volume} volume
                                </Badge>
                              )}
                            </div>
                            {expandedClusters.has(i) ? (
                              <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                            )}
                          </button>

                          {expandedClusters.has(i) && (
                            <div className="mt-3 space-y-3 border-t border-border pt-3">
                              <p className="text-xs text-muted-foreground">{cluster.description}</p>

                              {cluster.target_keywords?.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-foreground mb-1">Keywords:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {cluster.target_keywords.map((kw, j) => (
                                      <Badge key={j} variant="secondary" className="text-[10px]">{kw}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {cluster.pillar_article && (
                                <div>
                                  <p className="text-xs font-medium text-foreground mb-1">Pillar artikel:</p>
                                  <p className="text-xs text-muted-foreground">{cluster.pillar_article}</p>
                                </div>
                              )}

                              {cluster.subtopics && cluster.subtopics.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-foreground mb-1">
                                    Sub-topics ({cluster.subtopics.length}):
                                  </p>
                                  <ul className="space-y-1">
                                    {cluster.subtopics.map((st, j) => (
                                      <li key={j} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                        <span className="text-primary font-mono text-[10px] mt-0.5">{st.publish_order}.</span>
                                        <span>{st.headline} <span className="text-muted-foreground/60">({st.keyword})</span></span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {cluster.content_gaps && cluster.content_gaps.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-foreground mb-1">Content gaps:</p>
                                  <ul className="space-y-0.5">
                                    {cluster.content_gaps.map((gap, j) => (
                                      <li key={j} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                        <span className="text-destructive">⚠</span> {gap}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCompetitors;
