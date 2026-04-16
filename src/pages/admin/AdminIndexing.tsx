import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Zap, Trash2, RefreshCw, Globe, CheckCircle2, XCircle, Clock, MapPin, Download } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  requested: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  indexed: "bg-green-500/10 text-green-400 border-green-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
};

interface SitemapUrl {
  url: string;
  type: "static" | "blog";
}

export const IndexingTabContent = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [sitemapUrls, setSitemapUrls] = useState<SitemapUrl[]>([]);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"sitemap" | "history">("sitemap");
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    const [reqRes, postsRes, sitemapRes] = await Promise.all([
      supabase.from("indexing_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("blog_posts").select("slug, title").eq("status", "published"),
      supabase.functions.invoke("sitemap", { method: "GET" }),
    ]);
    if (reqRes.data) setRequests(reqRes.data);
    if (postsRes.data) setBlogPosts(postsRes.data);

    // Parse sitemap JSON
    try {
      const sitemapUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sitemap?format=json`;
      const res = await fetch(sitemapUrl, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
      });
      const data = await res.json();
      if (data.urls) setSitemapUrls(data.urls);
    } catch {
      // Fallback: no sitemap data
    }

    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Build a lookup: url -> latest status from indexing_requests
  const indexStatusMap = new Map<string, { status: string; date: string }>();
  for (const r of requests) {
    if (!indexStatusMap.has(r.url)) {
      indexStatusMap.set(r.url, { status: r.status, date: r.created_at });
    }
  }

  const getUrlStatus = (url: string) => {
    const match = indexStatusMap.get(url);
    if (!match) return "not_submitted";
    return match.status;
  };

  const stats = {
    total: sitemapUrls.length,
    indexed: sitemapUrls.filter(u => getUrlStatus(u.url) === "indexed").length,
    pending: sitemapUrls.filter(u => ["pending", "requested"].includes(getUrlStatus(u.url))).length,
    notSubmitted: sitemapUrls.filter(u => getUrlStatus(u.url) === "not_submitted").length,
    failed: sitemapUrls.filter(u => getUrlStatus(u.url) === "failed").length,
  };

  const handleRequestIndexing = async (targetUrl?: string) => {
    const finalUrl = targetUrl || url;
    if (!finalUrl.trim()) { toast({ title: "Vul een URL in", variant: "destructive" }); return; }
    setSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("request-indexing", {
        body: { url: finalUrl },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const results = data?.results || [];
      const failed = results.filter((r: any) => r.status === "failed");
      const succeeded = results.filter((r: any) => r.status === "indexed");

      if (failed.length > 0) {
        toast({
          title: `${failed.length} URL(s) mislukt`,
          description: failed.map((f: any) => `${f.url}: ${f.message}`).join("\n"),
          variant: "destructive",
        });
      }
      if (succeeded.length > 0) {
        toast({ title: `${succeeded.length} URL(s) geïndexeerd!`, description: finalUrl });
      }

      setUrl("");
      fetchData();
    } catch (e: any) {
      toast({ title: "Fout", description: e.message, variant: "destructive" });
    }
    setSubmitting(false);
  };

  const handleBatchIndex = async (urls?: string[]) => {
    const targetUrls = urls || sitemapUrls.filter(u => getUrlStatus(u.url) === "not_submitted").map(u => u.url);
    if (targetUrls.length === 0) {
      toast({ title: "Alle URLs zijn al ingediend" });
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("request-indexing", {
        body: { urls: targetUrls },
      });
      if (error) throw error;
      toast({ title: `${targetUrls.length} URLs ingediend!` });
      fetchData();
    } catch (e: any) {
      toast({ title: "Fout", description: e.message, variant: "destructive" });
    }
    setSubmitting(false);
  };

  const handleSyncAndIndex = async () => {
    // Step 1: Find missing URLs not yet in indexing_requests
    const missing = sitemapUrls
      .filter(u => getUrlStatus(u.url) === "not_submitted")
      .map(u => u.url);

    setSubmitting(true);
    try {
      // Step 1: Sync missing URLs as pending
      if (missing.length > 0) {
        const { error: syncError } = await supabase.from("indexing_requests").insert(
          missing.map(url => ({ url, status: "pending" as const }))
        );
        if (syncError) throw syncError;
        toast({ title: `${missing.length} nieuwe URLs gesynchroniseerd` });
      }

      // Step 2: Collect all pending URLs (including just-synced ones)
      const { data: pendingRows } = await supabase
        .from("indexing_requests")
        .select("url")
        .eq("status", "pending");

      const pendingUrls = pendingRows?.map(r => r.url) || [];

      if (pendingUrls.length === 0) {
        toast({ title: "Geen pending URLs om in te dienen" });
        setSubmitting(false);
        return;
      }

      // Step 3: Submit all pending URLs to Google
      const { data, error } = await supabase.functions.invoke("request-indexing", {
        body: { urls: pendingUrls },
      });
      if (error) throw error;

      const results = data?.results || [];
      const succeeded = results.filter((r: any) => r.status === "indexed").length;
      const failed = results.filter((r: any) => r.status === "failed").length;

      toast({
        title: `${succeeded} geïndexeerd, ${failed} mislukt`,
        description: `${missing.length} nieuw gesynchroniseerd`,
      });

      fetchData();
    } catch (e: any) {
      toast({ title: "Fout", description: e.message, variant: "destructive" });
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("indexing_requests").delete().eq("id", id);
    fetchData();
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case "indexed": return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "failed": return <XCircle className="w-4 h-4 text-red-400" />;
      case "requested":
      case "pending": return <Clock className="w-4 h-4 text-blue-400" />;
      default: return <Globe className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" /> Index Rusher
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Sitemap & Google indexing beheer</p>
        </div>
        <div className="flex gap-2">
          {(stats.notSubmitted > 0 || stats.pending > 0) && (
            <Button variant="heroOutline" size="sm" onClick={handleSyncAndIndex} disabled={submitting}>
              <Zap className="w-4 h-4" /> Sync & Index ({stats.notSubmitted + stats.pending})
            </Button>
          )}
          <Button variant="heroOutline" size="sm" onClick={() => handleBatchIndex(sitemapUrls.map(u => u.url))} disabled={submitting}>
            <RefreshCw className="w-4 h-4" /> Re-index alles
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {[
          { label: "Sitemap URLs", value: stats.total, icon: MapPin, color: "text-foreground" },
          { label: "Geïndexeerd", value: stats.indexed, icon: CheckCircle2, color: "text-green-400" },
          { label: "In afwachting", value: stats.pending, icon: Clock, color: "text-blue-400" },
          { label: "Niet ingediend", value: stats.notSubmitted, icon: Globe, color: "text-muted-foreground" },
          { label: "Mislukt", value: stats.failed, icon: XCircle, color: "text-red-400" },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-lg bg-card border border-border text-center">
            <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* URL input */}
      <div className="flex gap-2 mb-6">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://b2bgroeimachine.io/blog/..."
          className="flex-1"
        />
        <Button variant="hero" onClick={() => handleRequestIndexing()} disabled={submitting}>
          <Zap className="w-4 h-4" /> {submitting ? "Laden..." : "Index"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-card border border-border rounded-lg p-1">
        <button
          onClick={() => setActiveTab("sitemap")}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "sitemap" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MapPin className="w-4 h-4 inline mr-1" /> Sitemap ({sitemapUrls.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "history" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Clock className="w-4 h-4 inline mr-1" /> Geschiedenis ({requests.length})
        </button>
      </div>

      {/* Sitemap tab */}
      {activeTab === "sitemap" && (
        loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-card rounded-lg animate-pulse" />)}
          </div>
        ) : sitemapUrls.length === 0 ? (
          <p className="text-muted-foreground text-sm">Geen sitemap URLs gevonden.</p>
        ) : (
          <div className="space-y-2">
            {sitemapUrls.map((item) => {
              const urlStatus = getUrlStatus(item.url);
              return (
                <div key={item.url} className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <StatusIcon status={urlStatus} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.url}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.type === "blog" ? "Blog" : "Vaste pagina"}
                        {urlStatus !== "not_submitted" && indexStatusMap.has(item.url) &&
                          ` · Laatst: ${format(new Date(indexStatusMap.get(item.url)!.date), "dd/MM HH:mm")}`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant="outline" className={statusColors[urlStatus] || "bg-muted/50 text-muted-foreground"}>
                      {urlStatus === "not_submitted" ? "niet ingediend" : urlStatus}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRequestIndexing(item.url)}
                      disabled={submitting}
                      className="text-xs"
                    >
                      <Zap className="w-3 h-3" /> Index
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* History tab */}
      {activeTab === "history" && (
        loading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => <div key={i} className="h-14 bg-card rounded-lg animate-pulse" />)}
          </div>
        ) : requests.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nog geen indexing requests.</p>
        ) : (
          <div className="space-y-2">
            {requests.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{r.url}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(r.created_at), "dd/MM/yyyy HH:mm")}
                  </p>
                  {r.response_message && (
                    <p className={`text-xs mt-1 ${r.status === "failed" ? "text-red-400" : "text-green-400"}`}>
                      {r.response_message}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant="outline" className={statusColors[r.status]}>{r.status}</Badge>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </>
  );
};

const AdminIndexing = () => (
  <AdminLayout><IndexingTabContent /></AdminLayout>
);

export default AdminIndexing;
