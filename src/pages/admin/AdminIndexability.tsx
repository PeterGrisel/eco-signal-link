import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, ShieldAlert, RefreshCw, Globe } from "lucide-react";

interface CheckResult {
  url: string;
  ok: boolean;
  status: number | null;
  finalUrl?: string;
  redirected?: boolean;
  xRobotsTag?: string | null;
  metaRobots?: string | null;
  noindex: boolean;
  nofollow: boolean;
  canonical?: string | null;
  canonicalSelfReference?: boolean | null;
  metaRefresh?: string | null;
  title?: string | null;
  description?: string | null;
  ogUrl?: string | null;
  issues: string[];
  error?: string;
}

interface Summary {
  total: number;
  ok: number;
  withIssues: number;
  noindex: number;
}

const SITE_BASE = "https://www.b2bgroeimachine.io";

export const IndexabilityTabContent = () => {
  const { toast } = useToast();
  const [defaultUrls, setDefaultUrls] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<CheckResult[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);

  const loadSitemap = useCallback(async () => {
    try {
      const sitemapUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sitemap?format=json`;
      const res = await fetch(sitemapUrl, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
      });
      const data = await res.json();
      const urls: string[] = (data?.urls ?? []).map((u: { url: string }) => u.url);
      setDefaultUrls(urls);
      if (!input.trim()) setInput(urls.join("\n"));
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadSitemap();
  }, [loadSitemap]);

  const runCheck = async () => {
    const urls = input
      .split(/\n+/)
      .map((s) => s.trim())
      .filter((s) => /^https?:\/\//.test(s));
    if (urls.length === 0) {
      toast({ title: "Geen URL's", description: "Voeg minstens één URL toe.", variant: "destructive" });
      return;
    }
    setRunning(true);
    setResults([]);
    setSummary(null);
    try {
      const { data, error } = await supabase.functions.invoke("check-indexability", {
        body: { urls },
      });
      if (error) throw error;
      setResults(data.results ?? []);
      setSummary(data.summary ?? null);
    } catch (e) {
      toast({ title: "Check mislukt", description: (e as Error).message, variant: "destructive" });
    } finally {
      setRunning(false);
    }
  };

  const useTopPages = () => {
    const top = [
      "/",
      "/tools",
      "/klanten",
      "/ons-team",
      "/blog",
      "/woordenboek",
      "/contact",
      "/playbooks",
    ];
    setInput(top.map((p) => SITE_BASE + p).join("\n"));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" /> Indexability check
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Controleert per URL: HTTP-status, robots noindex (meta &amp; header),
            canonical, meta refresh, redirects, en aanwezigheid van title,
            description en og:url.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={useTopPages} disabled={running}>
            Top pagina&apos;s
          </Button>
          <Button variant="outline" size="sm" onClick={loadSitemap} disabled={running}>
            <RefreshCw className="w-4 h-4" /> Sitemap laden
          </Button>
          <Button variant="hero" size="sm" onClick={runCheck} disabled={running}>
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            {running ? "Bezig..." : "Check uitvoeren"}
          </Button>
        </div>
      </div>

      <Card className="p-4 space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          URL&apos;s (één per regel, max 60)
        </label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          className="font-mono text-xs"
          placeholder="https://www.b2bgroeimachine.io/"
        />
        <p className="text-xs text-muted-foreground">
          {defaultUrls.length > 0 && `Sitemap bevat ${defaultUrls.length} URL's.`}
        </p>
      </Card>

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Totaal</p>
            <p className="text-2xl font-bold text-foreground">{summary.total}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Indexeerbaar</p>
            <p className="text-2xl font-bold text-green-400">{summary.ok}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Met issues</p>
            <p className="text-2xl font-bold text-amber-400">{summary.withIssues}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Noindex</p>
            <p className="text-2xl font-bold text-red-400">{summary.noindex}</p>
          </Card>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          {results
            .slice()
            .sort((a, b) => (a.ok === b.ok ? 0 : a.ok ? 1 : -1))
            .map((r) => (
              <Card key={r.url} className="p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {r.ok ? (
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20">OK</Badge>
                      ) : r.noindex ? (
                        <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                          <ShieldAlert className="w-3 h-3 mr-1" /> Noindex
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                          {r.issues.length} issue{r.issues.length === 1 ? "" : "s"}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        HTTP {r.status ?? "—"}
                      </Badge>
                    </div>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-mono text-foreground hover:text-primary truncate block"
                    >
                      {r.url.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                </div>

                {r.issues.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {r.issues.map((i, idx) => (
                      <li key={idx} className="text-xs text-amber-300 flex gap-2">
                        <span className="text-amber-500">•</span> {i}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-3 grid sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {r.metaRobots && <div><span className="text-foreground/70">meta robots:</span> {r.metaRobots}</div>}
                  {r.xRobotsTag && <div><span className="text-foreground/70">X-Robots-Tag:</span> {r.xRobotsTag}</div>}
                  {r.canonical && (
                    <div className="truncate">
                      <span className="text-foreground/70">canonical:</span> {r.canonical}
                      {r.canonicalSelfReference === false && (
                        <Badge className="ml-2 bg-amber-500/10 text-amber-400 text-[10px]">mismatch</Badge>
                      )}
                    </div>
                  )}
                  {r.title && <div className="truncate"><span className="text-foreground/70">title:</span> {r.title}</div>}
                  {r.description && <div className="truncate"><span className="text-foreground/70">desc:</span> {r.description.slice(0, 80)}{r.description.length > 80 ? "…" : ""}</div>}
                  {r.ogUrl && <div className="truncate"><span className="text-foreground/70">og:url:</span> {r.ogUrl}</div>}
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default IndexabilityTabContent;