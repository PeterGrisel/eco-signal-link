import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Archive, Loader2, Play, RefreshCw, Undo2 } from "lucide-react";

interface ArchivedPost {
  id: string;
  title: string;
  slug: string;
  updated_at: string;
  published_at: string | null;
}

const ContentCleanupSection = () => {
  const [archivedPosts, setArchivedPosts] = useState<ArchivedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const { toast } = useToast();

  const fetchArchived = useCallback(async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, updated_at, published_at")
      .eq("status", "archived" as any)
      .order("updated_at", { ascending: false })
      .limit(20);
    if (data) setArchivedPosts(data as ArchivedPost[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchArchived(); }, [fetchArchived]);

  const handleRunCleanup = async () => {
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke("content-cleanup");
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({
        title: "🧹 Cleanup compleet",
        description: `${data?.archived_count || 0} posts gearchiveerd`,
      });
      fetchArchived();
    } catch (e: any) {
      toast({ title: "Cleanup mislukt", description: e.message, variant: "destructive" });
    }
    setRunning(false);
  };

  const handleRestore = async (post: ArchivedPost) => {
    await supabase
      .from("blog_posts")
      .update({ status: "published" as any } as any)
      .eq("id", post.id);
    toast({ title: `"${post.title}" hersteld naar gepubliceerd` });
    fetchArchived();
  };

  return (
    <div className="mt-10 pt-8 border-t border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
            <Archive className="w-5 h-5 text-orange-400" />
            Content Cleanup
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Posts met &lt;10 pageviews na 40 dagen of keyword-duplicaten worden wekelijks gearchiveerd (zo 04:00)
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRunCleanup}
          disabled={running}
          className="gap-1.5"
        >
          {running ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Bezig...</>
          ) : (
            <><Play className="w-4 h-4" /> Nu draaien</>
          )}
        </Button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-2">
          {[1, 2].map(i => <div key={i} className="h-12 bg-card rounded-lg" />)}
        </div>
      ) : archivedPosts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          <Archive className="w-8 h-8 mx-auto mb-2 opacity-50" />
          Geen gearchiveerde posts. Alles presteert goed! 🎉
        </div>
      ) : (
        <div className="space-y-2">
          {archivedPosts.map(post => (
            <div
              key={post.id}
              className="flex items-center justify-between p-3 rounded-lg bg-card border border-border"
            >
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium text-foreground truncate block">
                  {post.title}
                </span>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-muted-foreground font-mono">
                    /blog/{post.slug}
                  </span>
                  <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-400 border-orange-500/20">
                    Gearchiveerd {new Date(post.updated_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRestore(post)}
                className="text-blue-400 hover:text-blue-300 gap-1 ml-2 flex-shrink-0"
              >
                <Undo2 className="w-4 h-4" /> Herstel
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentCleanupSection;
