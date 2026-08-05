import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles, Check, X, Loader2, Play, RefreshCw, Zap,
  FileText, Wrench, Video, Globe, Calendar, Rocket,
  ArrowRight, Clock, ChevronDown, ChevronRight, Target
} from "lucide-react";
import ContentCleanupSection from "@/components/admin/ContentCleanupSection";

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
  topic_id: string | null;
  scheduled_date: string | null;
  created_at: string;
}

const statusConfig: Record<QueueStatus, { color: string; label: string; icon: React.ReactNode }> = {
  pending: { color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", label: "Pending", icon: <Clock className="w-3 h-3" /> },
  approved: { color: "bg-blue-500/10 text-blue-400 border-blue-500/20", label: "Ingepland", icon: <Calendar className="w-3 h-3" /> },
  declined: { color: "bg-muted text-muted-foreground", label: "Afgewezen", icon: <X className="w-3 h-3" /> },
  generating: { color: "bg-purple-500/10 text-purple-400 border-purple-500/20", label: "Genereren", icon: <Clock className="w-3 h-3" /> },
  published: { color: "bg-green-500/10 text-green-400 border-green-500/20", label: "Gepubliceerd", icon: <Check className="w-3 h-3" /> },
  failed: { color: "bg-red-500/10 text-red-400 border-red-500/20", label: "Mislukt", icon: <X className="w-3 h-3" /> },
};

const typeIcons: Record<ContentType, React.ReactNode> = {
  article: <FileText className="w-3.5 h-3.5" />,
  tool: <Wrench className="w-3.5 h-3.5" />,
  video: <Video className="w-3.5 h-3.5" />,
  pseo: <Globe className="w-3.5 h-3.5" />,
};

export const AutopilotTabContent = () => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [minerRunning, setMinerRunning] = useState(false);
  const [expandedBrief, setExpandedBrief] = useState<string | null>(null);
  
  const { toast } = useToast();

  const fetchQueue = useCallback(async () => {
    const { data } = await supabase
      .from("content_queue")
      .select("*")
      .order("scheduled_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (data) setQueue(data as unknown as QueueItem[]);
    setLoading(false);
  }, []);

  

  useEffect(() => { fetchQueue(); }, [fetchQueue]);

  // ═══════════════════════════════════════════
  // Full AI Pipeline: Strategy → Headlines → Schedule
  // ═══════════════════════════════════════════
  const handleFullPipeline = async () => {
    setPipelineRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke("autopilot-run", {
        body: { mode: "full_pipeline" },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({
        title: "🚀 Full AI Pipeline compleet!",
        description: data?.strategy_summary?.slice(0, 100) || `${data?.log?.length || 0} stappen uitgevoerd`,
      });
      fetchQueue();
    } catch (e: any) {
      toast({ title: "Pipeline mislukt", description: e.message, variant: "destructive" });
    }
    setPipelineRunning(false);
  };

  // Trigger gap-keyword-miner for tomorrow (or next free workday)
  const handleMineGapBrief = async () => {
    setMinerRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke("gap-keyword-miner", {
        body: { force: false },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.skipped) {
        toast({
          title: "Datum al gevuld",
          description: `"${data.existing?.headline}" staat al ingepland.`,
        });
      } else {
        toast({
          title: "✓ Gap-brief klaar",
          description: `"${data.headline}" voor ${data.scheduled_date}`,
        });
      }
      fetchQueue();
    } catch (e: any) {
      toast({ title: "Miner mislukt", description: e.message, variant: "destructive" });
    }
    setMinerRunning(false);
  };

  // Reject & regenerate a brief for the same scheduled date
  const handleRegenerate = async (item: QueueItem) => {
    if (!item.scheduled_date) return;
    setProcessingId(item.id);
    try {
      await supabase.from("content_queue").update({ status: "declined" as any }).eq("id", item.id);
      const { data, error } = await supabase.functions.invoke("gap-keyword-miner", {
        body: {
          target_date: item.scheduled_date,
          force: true,
          exclude: [item.headline],
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: "✓ Nieuwe brief", description: data?.headline || "Vervangen" });
      fetchQueue();
    } catch (e: any) {
      toast({ title: "Regenereren mislukt", description: e.message, variant: "destructive" });
    }
    setProcessingId(null);
  };

  // Approve & Publish (for items with generated draft)
  const handleApprovePublish = async (item: QueueItem) => {
    setProcessingId(item.id);
    try {
      const { data, error } = await supabase.functions.invoke("autopilot-run", {
        body: { mode: "approve_publish", queue_id: item.id },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({ title: "✓ Gepubliceerd & indexering aangevraagd!" });
      fetchQueue();
    } catch (e: any) {
      toast({ title: "Fout", description: e.message, variant: "destructive" });
    }
    setProcessingId(null);
  };

  // Decline
  const handleDecline = async (id: string) => {
    await supabase.from("content_queue").update({ status: "declined" as any }).eq("id", id);
    fetchQueue();
  };

  // Retry failed
  const handleRetry = async (item: QueueItem) => {
    await supabase.from("content_queue").update({ status: "approved" as any }).eq("id", item.id);
    fetchQueue();
  };

  // Stats
  const stats = {
    scheduled: queue.filter(q => q.status === "approved").length,
    review: queue.filter(q => q.status === "generating" && q.blog_post_id).length,
    published: queue.filter(q => q.status === "published").length,
    failed: queue.filter(q => q.status === "failed").length,
  };

  // Group items by status for the flow
  const reviewItems = queue.filter(q => q.status === "generating" && q.blog_post_id);
  const scheduledItems = queue.filter(q => q.status === "approved");
  const publishedItems = queue.filter(q => q.status === "published");
  const failedItems = queue.filter(q => q.status === "failed");
  const declinedItems = queue.filter(q => q.status === "declined");

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" /> Content Autopilot
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Full AI control: strategie → headlines → generatie → auto-publish → auto-index
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <Button
            variant="outline"
            onClick={handleMineGapBrief}
            disabled={minerRunning}
            className="gap-2"
          >
            {minerRunning ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Brief genereren...</>
            ) : (
              <><Target className="w-4 h-4" /> Gap-brief voor morgen</>
            )}
          </Button>
          <Button
            variant="hero"
            onClick={handleFullPipeline}
            disabled={pipelineRunning}
            className="gap-2"
          >
            {pipelineRunning ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Pipeline draait...</>
            ) : (
              <><Rocket className="w-4 h-4" /> Full AI Pipeline</>
            )}
          </Button>
        </div>
      </div>

      {/* Pipeline Flow Visual */}
      <div className="flex items-center gap-2 mb-8 text-xs text-muted-foreground overflow-x-auto pb-2">
        {[
          { label: "Strategie", icon: <Sparkles className="w-3.5 h-3.5" /> },
          { label: "Headlines", icon: <FileText className="w-3.5 h-3.5" /> },
          { label: "Schema", icon: <Calendar className="w-3.5 h-3.5" /> },
          { label: "Nacht: Generatie", icon: <Clock className="w-3.5 h-3.5" /> },
          { label: "Auto-Publish", icon: <Check className="w-3.5 h-3.5" /> },
          { label: "Auto-Index", icon: <Globe className="w-3.5 h-3.5" /> },
        ].map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            {i > 0 && <ArrowRight className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border whitespace-nowrap">
              {step.icon} {step.label}
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Ingepland", value: stats.scheduled, color: "text-blue-400" },
          { label: "Wacht op review", value: stats.review, color: "text-purple-400" },
          { label: "Gepubliceerd", value: stats.published, color: "text-green-400" },
          { label: "Mislukt", value: stats.failed, color: "text-red-400" },
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
          <Rocket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">Nog geen content in de pipeline.</p>
          <p className="text-sm text-muted-foreground mb-6">
            Klik op "Full AI Pipeline" om automatisch een strategie, headlines en publicatieschema te genereren.
          </p>
          <Button variant="hero" onClick={handleFullPipeline} disabled={pipelineRunning}>
            <Rocket className="w-4 h-4" /> Start Full AI Pipeline
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Review Items — Ready for approval */}
          {reviewItems.length > 0 && (
            <Section
              title="Wacht op Review"
              count={reviewItems.length}
              color="bg-purple-400"
              description="Artikelen zijn 's nachts gegenereerd. Review en approve om te publiceren."
            >
              {reviewItems.map(item => (
                <QueueCard
                  key={item.id}
                  item={item}
                  onApprovePublish={() => handleApprovePublish(item)}
                  onDecline={() => handleDecline(item.id)}
                  isProcessing={processingId === item.id}
                />
              ))}
            </Section>
          )}

          {/* Scheduled — Publishing Calendar */}
          {scheduledItems.length > 0 && (
            <Section
              title="Publicatieschema"
              count={scheduledItems.length}
              color="bg-blue-400"
              description="Ingeplande artikelen. Worden 's nachts automatisch gegenereerd en gepubliceerd."
            >
              {scheduledItems.map(item => (
                <QueueCard
                  key={item.id}
                  item={item}
                  onDecline={() => handleDecline(item.id)}
                  onRegenerate={() => handleRegenerate(item)}
                  expanded={expandedBrief === item.id}
                  onToggleBrief={() =>
                    setExpandedBrief(expandedBrief === item.id ? null : item.id)
                  }
                  isProcessing={processingId === item.id}
                />
              ))}
            </Section>
          )}

          {/* Published */}
          {publishedItems.length > 0 && (
            <Section title="Gepubliceerd" count={publishedItems.length} color="bg-green-400">
              {publishedItems.slice(0, 10).map(item => (
                <QueueCard key={item.id} item={item} />
              ))}
              {publishedItems.length > 10 && (
                <p className="text-xs text-muted-foreground pl-4">
                  + {publishedItems.length - 10} meer
                </p>
              )}
            </Section>
          )}

          {/* Failed */}
          {failedItems.length > 0 && (
            <Section title="Mislukt" count={failedItems.length} color="bg-red-400">
              {failedItems.map(item => (
                <QueueCard
                  key={item.id}
                  item={item}
                  onRetry={() => handleRetry(item)}
                />
              ))}
            </Section>
          )}

          {/* Declined */}
          {declinedItems.length > 0 && (
            <Section title="Afgewezen" count={declinedItems.length} color="bg-muted-foreground">
              {declinedItems.slice(0, 5).map(item => (
                <QueueCard key={item.id} item={item} />
              ))}
            </Section>
          )}
        </div>
      )}

      {/* Content Cleanup Section */}
      <ContentCleanupSection />
    </>
  );
};


// Section wrapper
const Section = ({ title, count, color, description, children }: {
  title: string;
  count: number;
  color: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <div>
    <div className="mb-3">
      <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${color}`} />
        {title} ({count})
      </h2>
      {description && <p className="text-xs text-muted-foreground mt-0.5 ml-4">{description}</p>}
    </div>
    <div className="space-y-2">{children}</div>
  </div>
);

// Queue Card
interface QueueCardProps {
  item: QueueItem;
  onApprovePublish?: () => void;
  onDecline?: () => void;
  onRetry?: () => void;
  onRegenerate?: () => void;
  expanded?: boolean;
  onToggleBrief?: () => void;
  isProcessing?: boolean;
}

const QueueCard = ({
  item,
  onApprovePublish,
  onDecline,
  onRetry,
  onRegenerate,
  expanded,
  onToggleBrief,
  isProcessing,
}: QueueCardProps) => {
  const config = statusConfig[item.status];
  const hasBrief = !!item.notes && item.notes.startsWith("# Content brief:");

  return (
    <div className="rounded-lg bg-card border border-border group">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex-shrink-0 text-muted-foreground">
          {typeIcons[item.content_type]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground text-sm truncate">{item.headline}</span>
            <Badge variant="outline" className={`text-xs ${config.color} gap-1`}>
              {config.icon} {config.label}
            </Badge>
            {hasBrief && (
              <Badge variant="outline" className="text-xs gap-1 bg-primary/10 text-primary border-primary/20">
                <Target className="w-3 h-3" /> Gap-brief
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            {item.scheduled_date && (
              <span className="text-xs text-blue-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(item.scheduled_date).toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" })}
              </span>
            )}
            {item.keyword && (
              <span className="text-xs text-primary font-mono">{item.keyword}</span>
            )}
            {item.error_message && (
              <span className="text-xs text-red-400 truncate">{item.error_message}</span>
            )}
          </div>
        </div>
        </div>
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
        {hasBrief && onToggleBrief && (
          <Button variant="ghost" size="sm" onClick={onToggleBrief} className="gap-1">
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            Brief
          </Button>
        )}
        {onRegenerate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRegenerate}
            disabled={isProcessing}
            className="text-muted-foreground hover:text-foreground"
            title="Verwerp en genereer een nieuwe brief"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </Button>
        )}
        {onApprovePublish && (
          <Button variant="hero" size="sm" onClick={onApprovePublish} disabled={isProcessing} className="gap-1.5">
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {isProcessing ? "Publishing..." : "Approve & Publish"}
          </Button>
        )}
        {onRetry && (
          <Button variant="ghost" size="sm" onClick={onRetry} className="text-yellow-400 hover:text-yellow-300">
            <RefreshCw className="w-4 h-4" /> Retry
          </Button>
        )}
        {onDecline && (
          <Button variant="ghost" size="sm" onClick={onDecline} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <X className="w-4 h-4" />
          </Button>
        )}
        </div>
      </div>
      {expanded && hasBrief && (
        <div className="px-4 pb-4 -mt-2">
          <pre className="text-xs text-muted-foreground bg-background/50 border border-border rounded p-3 max-h-96 overflow-auto whitespace-pre-wrap font-mono">
            {item.notes}
          </pre>
        </div>
      )}
    </div>
  );
};


