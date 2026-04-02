import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, ExternalLink, Globe, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

interface CompetitorData {
  url: string;
  title?: string;
  description?: string;
  lastScraped?: string;
  pages?: string[];
  blogCount?: number;
}

const AdminCompetitors = () => {
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [competitorData, setCompetitorData] = useState<Record<string, CompetitorData>>({});
  const [newUrl, setNewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scraping, setScraping] = useState<string | null>(null);

  useEffect(() => {
    loadCompetitors();
  }, []);

  const loadCompetitors = async () => {
    const { data } = await supabase.from("seo_settings").select("config").limit(1).single();
    const urls = (data?.config as any)?.competitors || [];
    setCompetitors(urls);
    setLoading(false);
  };

  const saveCompetitors = async (urls: string[]) => {
    setSaving(true);
    const { data: current } = await supabase.from("seo_settings").select("id, config").limit(1).single();
    if (current) {
      const updatedConfig = { ...(current.config as any), competitors: urls };
      await supabase.from("seo_settings").update({ config: updatedConfig }).eq("id", current.id);
    }
    setSaving(false);
    toast.success("Concurrenten opgeslagen");
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
  };

  const removeCompetitor = async (url: string) => {
    const updated = competitors.filter(c => c !== url);
    setCompetitors(updated);
    const newData = { ...competitorData };
    delete newData[url];
    setCompetitorData(newData);
    await saveCompetitors(updated);
  };

  const scrapeCompetitor = async (url: string) => {
    setScraping(url);
    try {
      // Scrape homepage
      const res = await fetch(url, { mode: "no-cors" }).catch(() => null);
      
      // Use edge function for proper scraping
      const { data, error } = await supabase.functions.invoke("strategy-agent", {
        body: { competitors: [url], mode: "evaluate" },
      });

      if (error) throw error;

      setCompetitorData(prev => ({
        ...prev,
        [url]: {
          url,
          title: new URL(url).hostname,
          description: data?.summary?.slice(0, 200) || "Geanalyseerd door Strategy Agent",
          lastScraped: new Date().toISOString(),
          blogCount: data?.clusters?.length || 0,
        },
      }));

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

      toast.success("Volledige concurrentanalyse afgerond");
      
      // Show results
      if (data?.recommendations?.length) {
        toast.info(`${data.recommendations.length} aanbevelingen gevonden`);
      }
    } catch (e) {
      toast.error(`Analyse mislukt: ${e instanceof Error ? e.message : "Onbekend"}`);
    } finally {
      setScraping(null);
    }
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
        <Button
          variant="hero"
          onClick={runFullAnalysis}
          disabled={scraping !== null || competitors.length === 0}
        >
          {scraping === "all" ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Volledige analyse
        </Button>
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
                        {data.blogCount !== undefined && (
                          <Badge variant="outline" className="text-[10px]">
                            {data.blogCount} clusters
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
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
          <li>• Concurrenten worden automatisch meegenomen door de <strong>Strategy Agent</strong> bij het genereren van topic clusters</li>
          <li>• De agent scrapt hun homepage en blogpagina om content gaps te identificeren</li>
          <li>• Gebruik <strong>"Volledige analyse"</strong> voor een uitgebreide evaluatie t.o.v. alle concurrenten</li>
          <li>• Resultaten worden gebruikt om je content strategie te optimaliseren</li>
        </ul>
      </Card>
    </AdminLayout>
  );
};

export default AdminCompetitors;
