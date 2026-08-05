import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import {
  ChevronRight, ChevronDown, Plus, Pencil, Trash2, FolderTree,
  Target, TrendingUp, Pause, Play, Check, X, Brain, Loader2,
  Sparkles, ArrowRight, ExternalLink,
} from "lucide-react";

interface Topic {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  target_keywords: string[] | null;
  target_article_count: number;
  priority: number;
  status: string;
  children?: Topic[];
  published_count?: number;
  queued_count?: number;
}

interface TopicFormData {
  name: string;
  slug: string;
  description: string;
  parent_id: string | null;
  target_keywords: string;
  target_article_count: number;
  priority: number;
}

const defaultForm: TopicFormData = {
  name: "",
  slug: "",
  description: "",
  parent_id: null,
  target_keywords: "",
  target_article_count: 3,
  priority: 0,
};

function buildTree(topics: Topic[]): Topic[] {
  const map = new Map<string, Topic>();
  const roots: Topic[] = [];
  topics.forEach((t) => map.set(t.id, { ...t, children: [] }));
  topics.forEach((t) => {
    const node = map.get(t.id)!;
    if (t.parent_id && map.has(t.parent_id)) {
      map.get(t.parent_id)!.children!.push(node);
    } else {
      roots.push(node);
    }
  });
  const sortNodes = (nodes: Topic[]) => {
    nodes.sort((a, b) => b.priority - a.priority || a.sort_order - b.sort_order);
    nodes.forEach((n) => n.children && sortNodes(n.children));
  };
  sortNodes(roots);
  return roots;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const TopicNode = ({
  topic, depth, onEdit, onDelete, onAddChild, onReschedule, rescheduling,
}: {
  topic: Topic; depth: number;
  onEdit: (t: Topic) => void; onDelete: (t: Topic) => void; onAddChild: (parentId: string) => void;
  onReschedule: (t: Topic) => void; rescheduling: string | null;
}) => {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = topic.children && topic.children.length > 0;
  const published = topic.published_count || 0;
  const queued = topic.queued_count || 0;
  const target = topic.target_article_count || 3;
  const total = published + queued;
  const progress = Math.min(100, Math.round((published / target) * 100));
  const gap = Math.max(0, target - total);
  const isPaused = topic.status === "paused";
  const isCompleted = topic.status === "completed";

  return (
    <div className="group">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div
          className={`flex items-center gap-2 py-3 px-3 rounded-lg hover:bg-secondary/50 transition-colors ${isPaused ? "opacity-50" : ""}`}
          style={{ paddingLeft: `${depth * 24 + 12}px` }}
        >
          {hasChildren ? (
            <CollapsibleTrigger asChild>
              <button className="p-0.5 rounded hover:bg-secondary">
                {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              </button>
            </CollapsibleTrigger>
          ) : (
            <span className="w-5" />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{topic.name}</span>
              {isPaused && <Badge variant="secondary" className="text-xs"><Pause className="w-3 h-3 mr-1" />Paused</Badge>}
              {isCompleted && <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20"><Check className="w-3 h-3 mr-1" />Compleet</Badge>}
              {topic.priority > 0 && <Badge variant="outline" className="text-xs text-primary border-primary/30">P{topic.priority}</Badge>}
            </div>
            {topic.target_keywords && topic.target_keywords.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {topic.target_keywords.map((kw, i) => (
                  <span key={i} className="text-[10px] font-mono text-primary bg-primary/5 border border-primary/10 rounded px-1.5 py-0.5">{kw}</span>
                ))}
              </div>
            )}
          </div>

          {/* Coverage meter */}
          <div className="hidden md:flex items-center gap-3 min-w-[200px]">
            <div className="flex-1">
              <Progress value={progress} className="h-1.5" />
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {published}/{target}
              {queued > 0 && <span className="text-primary"> +{queued}</span>}
            </span>
            {gap > 0 && (
              <Badge variant="outline" className="text-xs text-amber-400 border-amber-500/20 bg-amber-500/5">
                {gap} gap
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-primary hover:text-primary"
              onClick={() => onReschedule(topic)}
              disabled={rescheduling === topic.id || (queued === 0 && published === 0)}
              title="Prioriteer in content queue"
            >
              {rescheduling === topic.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <TrendingUp className="w-3.5 h-3.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onAddChild(topic.id)}>
              <Plus className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(topic)}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(topic)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {hasChildren && (
          <CollapsibleContent>
            {topic.children!.map((child) => (
              <TopicNode key={child.id} topic={child} depth={depth + 1} onEdit={onEdit} onDelete={onDelete} onAddChild={onAddChild} onReschedule={onReschedule} rescheduling={rescheduling} />
            ))}
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
};

export const TaxonomyTabContent = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [form, setForm] = useState<TopicFormData>(defaultForm);
  const [deleteTarget, setDeleteTarget] = useState<Topic | null>(null);
  const [strategyLoading, setStrategyLoading] = useState(false);
  const [strategyResult, setStrategyResult] = useState<any>(null);
  const [strategyDialogOpen, setStrategyDialogOpen] = useState(false);
  const [competitorInput, setCompetitorInput] = useState("");
  const [rescheduling, setRescheduling] = useState<string | null>(null);

  const { data: topics = [], isLoading } = useQuery({
    queryKey: ["content_topics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_topics")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as Topic[];
    },
  });

  // Fetch coverage data
  const { data: coverageData } = useQuery({
    queryKey: ["topic_coverage"],
    queryFn: async () => {
      const [{ data: posts }, { data: queued }] = await Promise.all([
        supabase.from("blog_posts").select("topic_id").not("topic_id", "is", null),
        supabase.from("content_queue").select("topic_id, status").not("topic_id", "is", null).in("status", ["pending", "approved", "generating"] as any),
      ]);

      const published: Record<string, number> = {};
      const queuedCounts: Record<string, number> = {};
      posts?.forEach(p => { published[p.topic_id] = (published[p.topic_id] || 0) + 1; });
      queued?.forEach(q => { if (q.topic_id) queuedCounts[q.topic_id] = (queuedCounts[q.topic_id] || 0) + 1; });
      return { published, queued: queuedCounts };
    },
  });

  // Merge coverage into topics
  const enrichedTopics = topics.map(t => ({
    ...t,
    published_count: coverageData?.published[t.id] || 0,
    queued_count: coverageData?.queued[t.id] || 0,
  }));

  const tree = buildTree(enrichedTopics);

  // Stats
  const totalTopics = topics.filter(t => !t.parent_id).length;
  const totalGap = enrichedTopics.reduce((acc, t) => {
    const pub = coverageData?.published[t.id] || 0;
    const q = coverageData?.queued[t.id] || 0;
    return acc + Math.max(0, (t.target_article_count || 3) - pub - q);
  }, 0);
  const totalPublished = Object.values(coverageData?.published || {}).reduce((a, b) => a + b, 0);

  const saveMutation = useMutation({
    mutationFn: async (payload: TopicFormData & { id?: string }) => {
      const record = {
        name: payload.name,
        slug: payload.slug,
        description: payload.description || null,
        parent_id: payload.parent_id || null,
        target_keywords: payload.target_keywords ? payload.target_keywords.split(",").map(k => k.trim()).filter(Boolean) : [],
        target_article_count: payload.target_article_count,
        priority: payload.priority,
      };

      if (payload.id) {
        const { error } = await supabase.from("content_topics").update(record as any).eq("id", payload.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("content_topics").insert(record as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content_topics"] });
      queryClient.invalidateQueries({ queryKey: ["topic_coverage"] });
      setDialogOpen(false);
      setEditingTopic(null);
      setForm(defaultForm);
      toast.success("Topic opgeslagen");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("content_topics").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content_topics"] });
      setDeleteTarget(null);
      toast.success("Topic verwijderd");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const openCreate = (parentId: string | null = null) => {
    setEditingTopic(null);
    setForm({ ...defaultForm, parent_id: parentId });
    setDialogOpen(true);
  };

  const openEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setForm({
      name: topic.name,
      slug: topic.slug,
      description: topic.description || "",
      parent_id: topic.parent_id,
      target_keywords: (topic.target_keywords || []).join(", "),
      target_article_count: topic.target_article_count || 3,
      priority: topic.priority || 0,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return toast.error("Naam is verplicht");
    const slug = form.slug.trim() || slugify(form.name);
    saveMutation.mutate({ ...form, slug, id: editingTopic?.id });
  };

  const handleReschedule = async (topic: Topic) => {
    if (!window.confirm(
      `Items voor "${topic.name}" krijgen de eerstvolgende geplande datums, andere items schuiven door. Doorgaan?`
    )) return;
    setRescheduling(topic.id);
    try {
      const { data, error } = await supabase.functions.invoke("reschedule-by-topic", {
        body: { topic_id: topic.id },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(
        `${data.focus_count} items naar voren, ${data.other_count} doorgeschoven (${data.dates_reassigned} datums aangepast)`
      );
      queryClient.invalidateQueries({ queryKey: ["topic_coverage"] });
    } catch (e: any) {
      toast.error(e.message || "Rescheduling mislukt");
    }
    setRescheduling(null);
  };

  // Strategy Agent
  const runStrategyAgent = async (mode: "generate" | "evaluate" = "generate") => {
    setStrategyLoading(true);
    try {
      const competitors = competitorInput.split("\n").map(u => u.trim()).filter(Boolean);
      const { data, error } = await supabase.functions.invoke("strategy-agent", {
        body: { mode, competitors },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setStrategyResult(data);
      setStrategyDialogOpen(true);
    } catch (e: any) {
      toast.error(e.message || "Strategy agent mislukt");
    }
    setStrategyLoading(false);
  };

  const applyStrategy = async () => {
    if (!strategyResult?.clusters?.length) return;
    try {
      for (const cluster of strategyResult.clusters) {
        const { error } = await supabase.from("content_topics").insert({
          name: cluster.name,
          slug: cluster.slug,
          description: cluster.description,
          target_keywords: cluster.target_keywords,
          target_article_count: cluster.target_article_count || cluster.subtopics?.length || 5,
          priority: cluster.priority || 0,
        } as any);
        if (error) console.error("Insert topic error:", error);
      }
      queryClient.invalidateQueries({ queryKey: ["content_topics"] });
      queryClient.invalidateQueries({ queryKey: ["topic_coverage"] });
      setStrategyDialogOpen(false);
      setStrategyResult(null);
      toast.success(`${strategyResult.clusters.length} topic clusters aangemaakt!`);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const parentName = form.parent_id ? topics.find((t) => t.id === form.parent_id)?.name : null;

  return (
    <>
      <div className="max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold flex items-center gap-2">
              <FolderTree className="w-6 h-6 text-primary" /> Content Strategie
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Topic clusters, keyword mapping en gap analyse
            </p>
          </div>
          <div className="flex gap-2">
            {topics.length > 0 && (
              <Button variant="heroOutline" size="sm" onClick={() => runStrategyAgent("evaluate")} disabled={strategyLoading}>
                {strategyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                Evalueer
              </Button>
            )}
            <Button variant="hero" size="sm" onClick={() => runStrategyAgent("generate")} disabled={strategyLoading}>
              {strategyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
              {strategyLoading ? "Agent analyseert..." : "AI Strategie Agent"}
            </Button>
            <Button onClick={() => openCreate(null)} size="sm">
              <Plus className="w-4 h-4 mr-1" /> Handmatig
            </Button>
          </div>
        </div>

        {/* Competitor URLs input */}
        <div className="mb-6 p-4 rounded-lg bg-card border border-border">
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Concurrent URLs <span className="font-normal">(één per regel, optioneel — agent scrapet deze voor gap analyse)</span>
          </label>
          <Textarea
            value={competitorInput}
            onChange={e => setCompetitorInput(e.target.value)}
            placeholder={"https://www.concurrent1.nl\nhttps://www.concurrent2.nl"}
            rows={2}
            className="text-xs font-mono"
          />
        </div>

        {/* Strategy stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-2xl font-bold text-foreground">{totalTopics}</p>
            <p className="text-xs text-muted-foreground">Topic clusters</p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-2xl font-bold text-emerald-400">{totalPublished}</p>
            <p className="text-xs text-muted-foreground">Gepubliceerd</p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-2xl font-bold text-amber-400">{totalGap}</p>
            <p className="text-xs text-muted-foreground">Content gap</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-muted-foreground text-sm py-12 text-center">Laden...</div>
        ) : tree.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-12 text-center">
            <Target className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground text-sm mb-2">Nog geen content strategie.</p>
            <p className="text-muted-foreground text-xs mb-4">
              Maak topic clusters aan met target keywords. De Autopilot genereert dan automatisch headlines per cluster en vult gaps.
            </p>
            <Button variant="outline" onClick={() => openCreate(null)}>
              <Plus className="w-4 h-4 mr-1" /> Eerste topic cluster aanmaken
            </Button>
          </div>
        ) : (
          <div className="border border-border rounded-xl bg-card">
            <div className="flex items-center gap-4 px-4 py-2.5 border-b border-border text-xs text-muted-foreground">
              <span className="flex-1">Topic</span>
              <span className="hidden md:block min-w-[200px] text-right">Dekking</span>
              <span className="w-[100px]" />
            </div>
            {tree.map((topic) => (
              <TopicNode key={topic.id} topic={topic} depth={0} onEdit={openEdit} onDelete={setDeleteTarget} onAddChild={(pid) => openCreate(pid)} onReschedule={handleReschedule} rescheduling={rescheduling} />
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTopic ? "Topic bewerken" : "Nieuw topic cluster"}</DialogTitle>
          </DialogHeader>

          {parentName && (
            <p className="text-xs text-muted-foreground">
              Parent: <span className="font-medium text-foreground">{parentName}</span>
            </p>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Naam</label>
              <Input
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((f) => ({ ...f, name, slug: editingTopic ? f.slug : slugify(name) }));
                }}
                placeholder="Bijv. Lead Generatie"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Slug</label>
              <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="lead-generatie" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Beschrijving <span className="text-muted-foreground font-normal">(context voor AI)</span></label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Beschrijf dit topic cluster: waar gaat het over, welke sub-thema's..."
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Target keywords <span className="text-muted-foreground font-normal">(komma-gescheiden)</span>
              </label>
              <Input
                value={form.target_keywords}
                onChange={(e) => setForm((f) => ({ ...f, target_keywords: e.target.value }))}
                placeholder="lead generatie, B2B leads, outbound leads"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Target artikelen</label>
                <Input
                  type="number" min={1} max={50}
                  value={form.target_article_count}
                  onChange={(e) => setForm((f) => ({ ...f, target_article_count: parseInt(e.target.value) || 3 }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Prioriteit <span className="text-muted-foreground font-normal">(0-10)</span></label>
                <Input
                  type="number" min={0} max={10}
                  value={form.priority}
                  onChange={(e) => setForm((f) => ({ ...f, priority: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuleren</Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Opslaan..." : "Opslaan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Topic verwijderen?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">{deleteTarget?.name}</strong> en alle subtopics worden permanent verwijderd.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Annuleren</Button>
            <Button variant="destructive" onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Verwijderen..." : "Verwijderen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Strategy Agent Review Dialog */}
      <Dialog open={strategyDialogOpen} onOpenChange={setStrategyDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" /> AI Strategie Voorstel
            </DialogTitle>
          </DialogHeader>

          {strategyResult && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm text-foreground">{strategyResult.summary}</p>
              </div>

              {/* Clusters */}
              <div className="space-y-4">
                {strategyResult.clusters?.map((cluster: any, i: number) => (
                  <div key={i} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{cluster.name}</h3>
                        <Badge variant="outline" className="text-xs">P{cluster.priority}</Badge>
                        {cluster.search_volume && (
                          <Badge variant="secondary" className="text-xs">{cluster.search_volume} volume</Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{cluster.target_article_count} artikelen</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{cluster.description}</p>
                    
                    {cluster.target_keywords?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {cluster.target_keywords.map((kw: string, j: number) => (
                          <span key={j} className="text-[10px] font-mono text-primary bg-primary/5 border border-primary/10 rounded px-1.5 py-0.5">{kw}</span>
                        ))}
                      </div>
                    )}

                    {cluster.pillar_article && (
                      <div className="mb-2">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Pillar:</span>
                        <p className="text-xs font-medium text-foreground">{cluster.pillar_article}</p>
                      </div>
                    )}

                    {cluster.subtopics?.length > 0 && (
                      <div className="mt-2">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Sub-topics ({cluster.subtopics.length}):</span>
                        <div className="space-y-1">
                          {cluster.subtopics.sort((a: any, b: any) => (a.publish_order || 0) - (b.publish_order || 0)).map((sub: any, k: number) => (
                            <div key={k} className="flex items-center gap-2 text-xs">
                              <span className="text-muted-foreground w-4 text-right">{sub.publish_order || k + 1}.</span>
                              <span className="text-foreground">{sub.headline}</span>
                              <span className="text-primary font-mono text-[10px]">{sub.keyword}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {cluster.content_gaps?.length > 0 && (
                      <div className="mt-2 p-2 rounded bg-amber-500/5 border border-amber-500/10">
                        <span className="text-[10px] uppercase tracking-wider text-amber-400 mb-1 block">Content gaps:</span>
                        <ul className="text-xs text-muted-foreground space-y-0.5">
                          {cluster.content_gaps.map((gap: string, g: number) => (
                            <li key={g}>• {gap}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              {strategyResult.recommendations?.length > 0 && (
                <div className="p-4 rounded-lg bg-card border border-border">
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> Aanbevelingen
                  </h3>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {strategyResult.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <ArrowRight className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setStrategyDialogOpen(false)}>Sluiten</Button>
            <Button variant="hero" onClick={applyStrategy}>
              <Check className="w-4 h-4" /> Toepassen — {strategyResult?.clusters?.length || 0} clusters aanmaken
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

