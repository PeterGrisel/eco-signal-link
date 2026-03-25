import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Zap, Trash2, RefreshCw } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  requested: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  indexed: "bg-green-500/10 text-green-400 border-green-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
};

const AdminIndexing = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    const [reqRes, postsRes] = await Promise.all([
      supabase.from("indexing_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("blog_posts").select("slug, title").eq("status", "published"),
    ]);
    if (reqRes.data) setRequests(reqRes.data);
    if (postsRes.data) setBlogPosts(postsRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

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

      toast({ title: "Indexing aangevraagd!", description: finalUrl });
      setUrl("");
      fetchData();
    } catch (e: any) {
      toast({ title: "Fout", description: e.message, variant: "destructive" });
    }
    setSubmitting(false);
  };

  const handleBatchIndex = async () => {
    const urls = blogPosts.map((p) => `https://eco-signal-link.lovable.app/blog/${p.slug}`);
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("request-indexing", {
        body: { urls },
      });
      if (error) throw error;
      toast({ title: `${urls.length} URLs ingediend!` });
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

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" /> Index Rusher
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Vraag Google indexing aan voor je pagina's</p>
        </div>
        {blogPosts.length > 0 && (
          <Button variant="heroOutline" size="sm" onClick={handleBatchIndex} disabled={submitting}>
            <RefreshCw className="w-4 h-4" /> Batch Index ({blogPosts.length} posts)
          </Button>
        )}
      </div>

      {/* URL input */}
      <div className="flex gap-2 mb-8">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://eco-signal-link.lovable.app/blog/..."
          className="flex-1"
        />
        <Button variant="hero" onClick={() => handleRequestIndexing()} disabled={submitting}>
          <Zap className="w-4 h-4" /> {submitting ? "Laden..." : "Index"}
        </Button>
      </div>

      {/* Quick links from blog */}
      {blogPosts.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Snel indexeren</p>
          <div className="flex flex-wrap gap-2">
            {blogPosts.map((p) => (
              <Button
                key={p.slug}
                variant="outline"
                size="sm"
                onClick={() => handleRequestIndexing(`https://eco-signal-link.lovable.app/blog/${p.slug}`)}
                disabled={submitting}
                className="text-xs"
              >
                {p.title}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      <h2 className="font-display text-lg font-semibold text-foreground mb-4">Geschiedenis</h2>
      {loading ? (
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
                  {r.response_message && ` · ${r.response_message}`}
                </p>
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
      )}
    </AdminLayout>
  );
};

export default AdminIndexing;
