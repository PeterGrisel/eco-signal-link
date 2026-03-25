import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles, Check, X, Loader2, Play, RefreshCw, Zap,
  FileText, Wrench, Video, Globe
} from "lucide-react";

type QueueStatus = "pending" | "approved" | "declined" | "generating" | "published" | "failed";
type ContentType = "article" | "tool" | "video" | "pseo";

interface QueueItem {
  id: string;
  headline: string;
  content_type: ContentType;
  status: QueueStatus;
  keyword: string | null;
  notes: string | null;
  blog_post_id: string | null;
  error_message: string | null;
  created_at: string;
}

const statusConfig: Record<QueueStatus, { color: string; label: string }> = {
  pending: { color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", label: "Pending" },
  approved: { color: "bg-blue-500/10 text-blue-400 border-blue-500/20", label: "Approved" },
  declined: { color: "bg-muted text-muted-foreground", label: "Declined" },
  generating: { color: "bg-purple-500/10 text-purple-400 border-purple-500/20", label: "Generating" },
  published: { color: "bg-green-500/10 text-green-400 border-green-500/20", label: "Published" },
  failed: { color: "bg-red-500/10 text-red-400 border-red-500/20", label: "Failed" },
};

const typeIcons: Record<ContentType, React.ReactNode> = {
  article: <FileText className="w-3.5 h-3.5" />,
  tool: <Wrench className="w-3.5 h-3.5" />,
  video: <Video className="w-3.5 h-3.5" />,
  pseo: <Globe className="w-3.5 h-3.5" />,
};

const AdminAutopilot = () => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchQueue = useCallback(async () => {
    const { data } = await supabase
      .from("content_queue")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setQueue(data as QueueItem[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchQueue(); }, [fetchQueue]);

  // Generate new headlines
  const handleGenerateHeadlines = async () => {
    setGenerating(true);
    try {
      const existingHeadlines = queue.map(q => q.headline);
      const { data, error } = await supabase.functions.invoke("generate-headlines", {
        body: {
          count: 10,
          content_types: ["article", "tool"],
          existing_headlines: existingHeadlines,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.headlines?.length) {
        const rows = data.headlines.map((h: any) => ({
          headline: h.headline,
          content_type: h.content_type,
          keyword: h.keyword,
          notes: h.notes,
        }));
        const { error: insertError } = await supabase.from("content_queue").insert(rows);
        if (insertError) throw insertError;
        toast({ title: `${data.headlines.length} headlines gegenereerd!` });
        fetchQueue();
      }
    } catch (e: any) {
      toast({ title: "Fout", description: e.message, variant: "destructive" });
    }
    setGenerating(false);
  };

  // Approve → auto-generate
  const handleApprove = async (item: QueueItem) => {
    await supabase.from("content_queue").update({ status: "approved" as any }).eq("id", item.id);
    fetchQueue();
    // Auto-trigger generation
    handleGenerateArticle({ ...item, status: "approved" });
  };

  // Decline
  const handleDecline = async (id: string) => {
    await supabase.from("content_queue").update({ status: "declined" as any }).eq("id", id);
    fetchQueue();
  };

  // Generate article from approved headline
  const handleGenerateArticle = async (item: QueueItem) => {
    setProcessingId(item.id);
    await supabase.from("content_queue").update({ status: "generating" as any }).eq("id", item.id);
    fetchQueue();

    try {
      // Step 1: Generate article content
      const { data, error } = await supabase.functions.invoke("generate-article", {
        body: {
          headline: item.headline,
          keyword: item.keyword || item.headline,
          content_type: item.content_type,
          length: "lang",
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // Step 2: Generate featured image (non-blocking)
      let featuredImage: string | null = null;
      try {
        const { data: imgData } = await supabase.functions.invoke("generate-blog-image", {
          body: {
            title: data.title,
            keyword: item.keyword || item.headline,
          },
        });
        if (imgData?.image_url) featuredImage = imgData.image_url;
      } catch (imgErr) {
        console.warn("Image generation failed, continuing without image:", imgErr);
      }

      // Step 3: Save as draft blog post
      const { data: post, error: postError } = await supabase.from("blog_posts").insert({
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        meta_description: data.meta_description,
        featured_image: featuredImage,
        status: "draft",
      }).select("id").single();

      if (postError) throw postError;

      await supabase.from("content_queue").update({
        status: "published" as any,
        blog_post_id: post.id,
      }).eq("id", item.id);

      toast({ title: `"${data.title}" gegenereerd als draft!` });
    } catch (e: any) {
      await supabase.from("content_queue").update({
        status: "failed" as any,
        error_message: e.message,
      }).eq("id", item.id);
      toast({ title: "Generatie mislukt", description: e.message, variant: "destructive" });
    }
    setProcessingId(null);
    fetchQueue();
  };

  // Batch generate all approved
  const handleBatchGenerate = async () => {
    const approved = queue.filter(q => q.status === "approved");
    if (approved.length === 0) {
      toast({ title: "Geen approved headlines om te genereren" });
      return;
    }
    for (const item of approved) {
      await handleGenerateArticle(item);
    }
  };

  // Stats
  const stats = {
    total: queue.length,
    pending: queue.filter(q => q.status === "pending").length,
    approved: queue.filter(q => q.status === "approved").length,
    published: queue.filter(q => q.status === "published").length,
  };

  const pendingItems = queue.filter(q => q.status === "pending");
  const approvedItems = queue.filter(q => q.status === "approved");
  const otherItems = queue.filter(q => !["pending", "approved"].includes(q.status));

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" /> Content Autopilot
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Genereer headlines, approve ze, en laat AI de artikelen schrijven
          </p>
        </div>
        <div className="flex gap-2">
          {approvedItems.length > 0 && (
            <Button variant="hero" size="sm" onClick={handleBatchGenerate} disabled={!!processingId}>
              <Play className="w-4 h-4" /> Genereer {approvedItems.length} approved
            </Button>
          )}
          <Button variant="heroOutline" size="sm" onClick={handleGenerateHeadlines} disabled={generating}>
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? "Genereren..." : "Nieuwe Headlines"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Totaal", value: stats.total, color: "text-foreground" },
          { label: "Pending", value: stats.pending, color: "text-yellow-400" },
          { label: "Approved", value: stats.approved, color: "text-blue-400" },
          { label: "Published", value: stats.published, color: "text-green-400" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-lg bg-card border border-border">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-card rounded-lg" />)}
        </div>
      ) : queue.length === 0 ? (
        <div className="text-center py-16">
          <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Nog geen content in de queue.</p>
          <Button variant="hero" onClick={handleGenerateHeadlines} disabled={generating}>
            <Sparkles className="w-4 h-4" /> Genereer je eerste headlines
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending - Approve/Decline */}
          {pendingItems.length > 0 && (
            <div>
              <h2 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                Pending Review ({pendingItems.length})
              </h2>
              <div className="space-y-2">
                {pendingItems.map(item => (
                  <QueueCard
                    key={item.id}
                    item={item}
                    onApprove={() => handleApprove(item)}
                    onDecline={() => handleDecline(item.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Approved - Ready to generate */}
          {approvedItems.length > 0 && (
            <div>
              <h2 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Approved ({approvedItems.length})
              </h2>
              <div className="space-y-2">
                {approvedItems.map(item => (
                  <QueueCard
                    key={item.id}
                    item={item}
                    onGenerate={() => handleGenerateArticle(item)}
                    isGenerating={processingId === item.id}
                    onDecline={() => handleDecline(item.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other statuses */}
          {otherItems.length > 0 && (
            <div>
              <h2 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                History ({otherItems.length})
              </h2>
              <div className="space-y-2">
                {otherItems.map(item => (
                  <QueueCard
                    key={item.id}
                    item={item}
                    onRetry={item.status === "failed" ? () => handleApprove(item) : undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

// Queue Card Component
interface QueueCardProps {
  item: QueueItem;
  onApprove?: () => void;
  onDecline?: () => void;
  onGenerate?: () => void;
  onRetry?: () => void;
  isGenerating?: boolean;
}

const QueueCard = ({ item, onApprove, onDecline, onGenerate, onRetry, isGenerating }: QueueCardProps) => {
  const config = statusConfig[item.status];

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex-shrink-0 text-muted-foreground">
          {typeIcons[item.content_type]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground text-sm truncate">{item.headline}</span>
            <Badge variant="outline" className={`text-xs ${config.color}`}>{config.label}</Badge>
            <Badge variant="outline" className="text-xs">{item.content_type}</Badge>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {item.keyword && (
              <span className="text-xs text-primary font-mono">{item.keyword}</span>
            )}
            {item.notes && (
              <span className="text-xs text-muted-foreground truncate">{item.notes}</span>
            )}
            {item.error_message && (
              <span className="text-xs text-red-400 truncate">{item.error_message}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
        {onApprove && (
          <Button variant="ghost" size="sm" onClick={onApprove} className="text-green-400 hover:text-green-300 hover:bg-green-500/10">
            <Check className="w-4 h-4" /> Approve
          </Button>
        )}
        {onGenerate && (
          <Button variant="hero" size="sm" onClick={onGenerate} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        )}
        {onRetry && (
          <Button variant="ghost" size="sm" onClick={onRetry} className="text-yellow-400 hover:text-yellow-300">
            <RefreshCw className="w-4 h-4" /> Retry
          </Button>
        )}
        {onDecline && (
          <Button variant="ghost" size="sm" onClick={onDecline} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <X className="w-4 h-4" /> Decline
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdminAutopilot;
