import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Eye, Check,
  FileText, Wrench, Video, Globe, Loader2, RefreshCw, Sparkles, Zap,
  TrendingUp, ArrowRight, Target, MousePointerClick, BarChart3, Brain,
  Timer, Play, Pause, RotateCcw, ArrowDown, CheckCircle, XCircle
} from "lucide-react";

type ContentType = "article" | "tool" | "video" | "pseo";
type QueueStatus = "pending" | "approved" | "declined" | "generating" | "published" | "failed";

interface QueueItem {
  id: string;
  headline: string;
  content_type: ContentType;
  status: QueueStatus;
  keyword: string | null;
  scheduled_date: string | null;
  blog_post_id: string | null;
  created_at: string;
}

interface MonthlyEval {
  month: string;
  total_impressions: number;
  total_clicks: number;
  avg_ctr: number;
  avg_position: number;
  conversion_clicks: number;
  articles_published: number;
  top_keywords: any[];
  topic_performance: any[];
  recommendations: string[];
}

interface CronJob {
  name: string;
  schedule: string;
  description: string;
  lastRun: string | null;
  nextRun: string;
  status: "active" | "idle" | "disabled";
  icon: React.ReactNode;
}

const typeIcons: Record<ContentType, React.ReactNode> = {
  article: <FileText className="w-3 h-3" />,
  tool: <Wrench className="w-3 h-3" />,
  video: <Video className="w-3 h-3" />,
  pseo: <Globe className="w-3 h-3" />,
};

const statusColors: Record<QueueStatus, string> = {
  pending: "bg-yellow-500",
  approved: "bg-blue-500",
  declined: "bg-muted-foreground",
  generating: "bg-purple-500",
  published: "bg-green-500",
  failed: "bg-red-500",
};

const DAYS_NL = ["ma", "di", "wo", "do", "vr", "za", "zo"];
const MONTHS_NL = [
  "Januari", "Februari", "Maart", "April", "Mei", "Juni",
  "Juli", "Augustus", "September", "Oktober", "November", "December"
];

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  // Monday-based week: 0=Mon...6=Sun
  let startOffset = (firstDay.getDay() + 6) % 7;
  const days: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

function getNextCronRun(schedule: string, from: Date = new Date()): string {
  // Simplified: for "0 2 * * 1-5" → next weekday 2:00
  if (schedule.includes("1-5")) {
    const next = new Date(from);
    next.setHours(2, 0, 0, 0);
    if (next <= from) next.setDate(next.getDate() + 1);
    while (next.getDay() === 0 || next.getDay() === 6) next.setDate(next.getDate() + 1);
    return next.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  }
  if (schedule.includes("1 *")) {
    const next = new Date(from.getFullYear(), from.getMonth() + 1, 1, 3, 0);
    return next.toLocaleDateString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  }
  return "Handmatig";
}

export const CalendarTabContent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [evaluation, setEvaluation] = useState<MonthlyEval | null>(null);
  const [loading, setLoading] = useState(true);
  const [evalLoading, setEvalLoading] = useState(false);
  const [learningLoading, setLearningLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const { toast } = useToast();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthDays = getMonthDays(year, month);
  const today = new Date().toISOString().split("T")[0];

  const cronJobs: CronJob[] = [
    {
      name: "Nachtelijke Generatie",
      schedule: "0 2 * * 1-5",
      description: "Genereert artikelen voor ingeplande items",
      lastRun: null,
      nextRun: getNextCronRun("0 2 * * 1-5"),
      status: queue.some(q => q.status === "approved") ? "active" : "idle",
      icon: <Clock className="w-4 h-4" />,
    },
    {
      name: "GSC Data Sync",
      schedule: "0 6 * * *",
      description: "Synchroniseert Search Console data",
      lastRun: null,
      nextRun: getNextCronRun("0 6 * * *"),
      status: "active",
      icon: <RefreshCw className="w-4 h-4" />,
    },
    {
      name: "Maandelijkse Evaluatie",
      schedule: "0 3 1 * *",
      description: "AI evaluatie & strategie aanpassing",
      lastRun: evaluation ? `${MONTHS_NL[new Date(evaluation.month).getMonth()]}` : null,
      nextRun: getNextCronRun("0 3 1 *"),
      status: "active",
      icon: <Brain className="w-4 h-4" />,
    },
  ];

  const fetchQueue = useCallback(async () => {
    const monthStart = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const monthEnd = `${year}-${String(month + 1).padStart(2, "0")}-${new Date(year, month + 1, 0).getDate()}`;

    const { data } = await supabase
      .from("content_queue")
      .select("id, headline, content_type, status, keyword, scheduled_date, blog_post_id, created_at")
      .gte("scheduled_date", monthStart)
      .lte("scheduled_date", monthEnd)
      .order("scheduled_date", { ascending: true });
    if (data) setQueue(data as unknown as QueueItem[]);
    setLoading(false);
  }, [year, month]);

  const fetchEvaluation = useCallback(async () => {
    const monthStr = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const { data } = await supabase
      .from("monthly_evaluations")
      .select("*")
      .eq("month", monthStr)
      .maybeSingle();
    if (data) setEvaluation(data as unknown as MonthlyEval);
    else setEvaluation(null);
  }, [year, month]);

  useEffect(() => { fetchQueue(); fetchEvaluation(); }, [fetchQueue, fetchEvaluation]);

  const handleRunEvaluation = async () => {
    setEvalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("monthly-evaluation");
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: "📊 Maandelijkse evaluatie voltooid" });
      fetchEvaluation();
    } catch (e: any) {
      toast({ title: "Evaluatie mislukt", description: e.message, variant: "destructive" });
    }
    setEvalLoading(false);
  };

  const handleLearningLoop = async () => {
    setLearningLoading(true);
    try {
      // Step 1: Run evaluation
      await supabase.functions.invoke("monthly-evaluation");
      // Step 2: Run strategy agent to adjust based on evaluation
      const { data, error } = await supabase.functions.invoke("autopilot-run", {
        body: { mode: "full_pipeline" },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({
        title: "🧠 Learning Loop compleet!",
        description: "Evaluatie uitgevoerd, strategie aangepast en nieuwe headlines ingepland.",
      });
      fetchQueue();
      fetchEvaluation();
    } catch (e: any) {
      toast({ title: "Learning Loop mislukt", description: e.message, variant: "destructive" });
    }
    setLearningLoading(false);
  };

  const navigateMonth = (dir: number) => {
    setCurrentDate(new Date(year, month + dir, 1));
    setSelectedDay(null);
  };

  // Group queue items by date
  const itemsByDate: Record<string, QueueItem[]> = {};
  queue.forEach(item => {
    if (item.scheduled_date) {
      if (!itemsByDate[item.scheduled_date]) itemsByDate[item.scheduled_date] = [];
      itemsByDate[item.scheduled_date].push(item);
    }
  });

  const selectedItems = selectedDay ? itemsByDate[selectedDay] || [] : [];

  // Stats
  const totalScheduled = queue.filter(q => q.status === "approved").length;
  const totalGenerated = queue.filter(q => q.status === "generating").length;
  const totalPublished = queue.filter(q => q.status === "published").length;
  const totalFailed = queue.filter(q => q.status === "failed").length;

  // Funnel data
  const funnelSteps = [
    { label: "Impressies", value: evaluation?.total_impressions || 0, icon: <Eye className="w-4 h-4" />, color: "text-blue-400" },
    { label: "Clicks", value: evaluation?.total_clicks || 0, icon: <MousePointerClick className="w-4 h-4" />, color: "text-green-400" },
    { label: "Conversie Clicks", value: evaluation?.conversion_clicks || 0, icon: <Target className="w-4 h-4" />, color: "text-primary" },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-primary" /> Content Kalender
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overzicht, planning, learning loop & conversie funnel
          </p>
        </div>
        <Button
          variant="hero"
          onClick={handleLearningLoop}
          disabled={learningLoading}
          className="gap-2"
        >
          {learningLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Loop draait...</>
          ) : (
            <><Brain className="w-4 h-4" /> Learning Loop</>
          )}
        </Button>
      </div>

      {/* Month stats bar */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Ingepland", value: totalScheduled, color: "text-blue-400", dot: "bg-blue-500" },
          { label: "In review", value: totalGenerated, color: "text-purple-400", dot: "bg-purple-500" },
          { label: "Gepubliceerd", value: totalPublished, color: "text-green-400", dot: "bg-green-500" },
          { label: "Mislukt", value: totalFailed, color: "text-red-400", dot: "bg-red-500" },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
            <span className={`w-2 h-2 rounded-full ${s.dot}`} />
            <div>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Calendar - 8 cols */}
        <div className="col-span-8">
          <div className="bg-card border border-border rounded-lg">
            {/* Month navigation */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <button onClick={() => navigateMonth(-1)} className="p-1.5 rounded-md hover:bg-secondary transition-colors">
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <h2 className="font-display font-semibold text-foreground">
                {MONTHS_NL[month]} {year}
              </h2>
              <button onClick={() => navigateMonth(1)} className="p-1.5 rounded-md hover:bg-secondary transition-colors">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-border">
              {DAYS_NL.map(d => (
                <div key={d} className="p-2 text-center text-[10px] font-medium text-muted-foreground uppercase">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {monthDays.map((day, i) => {
                if (!day) return <div key={`e-${i}`} className="min-h-[80px] border-b border-r border-border bg-background/30" />;
                const dateStr = day.toISOString().split("T")[0];
                const items = itemsByDate[dateStr] || [];
                const isToday = dateStr === today;
                const isSelected = dateStr === selectedDay;
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                    className={`min-h-[80px] p-1.5 border-b border-r border-border text-left transition-colors ${
                      isSelected ? "bg-primary/5 ring-1 ring-primary/30" :
                      isToday ? "bg-primary/5" :
                      isWeekend ? "bg-background/50" : "hover:bg-secondary/50"
                    }`}
                  >
                    <span className={`text-xs font-medium ${
                      isToday ? "text-primary font-bold" : isWeekend ? "text-muted-foreground/50" : "text-muted-foreground"
                    }`}>
                      {day.getDate()}
                    </span>
                    <div className="mt-1 space-y-0.5">
                      {items.slice(0, 3).map(item => (
                        <div
                          key={item.id}
                          className="flex items-center gap-1 px-1 py-0.5 rounded text-[9px] bg-background/80 border border-border/50 truncate"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusColors[item.status]}`} />
                          <span className="truncate text-foreground/80">{item.headline}</span>
                        </div>
                      ))}
                      {items.length > 3 && (
                        <span className="text-[9px] text-muted-foreground px-1">+{items.length - 3} meer</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected day detail */}
          {selectedDay && (
            <div className="mt-4 bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground text-sm mb-3">
                {new Date(selectedDay + "T12:00:00").toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" })}
              </h3>
              {selectedItems.length === 0 ? (
                <p className="text-xs text-muted-foreground">Geen content gepland voor deze dag.</p>
              ) : (
                <div className="space-y-2">
                  {selectedItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-muted-foreground">{typeIcons[item.content_type]}</span>
                        <span className="text-sm text-foreground truncate">{item.headline}</span>
                      </div>
                      <Badge variant="outline" className={`text-[10px] gap-1 ${
                        item.status === "published" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                        item.status === "approved" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        item.status === "generating" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                        item.status === "failed" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar - 4 cols */}
        <div className="col-span-4 space-y-6">
          {/* Cron Jobs / Timers */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2 mb-4">
              <Timer className="w-4 h-4 text-primary" /> Automatisering
            </h3>
            <div className="space-y-3">
              {cronJobs.map(job => (
                <div key={job.name} className="p-3 rounded-lg bg-background border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{job.icon}</span>
                      <span className="text-xs font-medium text-foreground">{job.name}</span>
                    </div>
                    <span className={`flex items-center gap-1 text-[10px] font-medium ${
                      job.status === "active" ? "text-green-400" :
                      job.status === "idle" ? "text-yellow-400" : "text-muted-foreground"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        job.status === "active" ? "bg-green-400 animate-pulse" :
                        job.status === "idle" ? "bg-yellow-400" : "bg-muted-foreground"
                      }`} />
                      {job.status === "active" ? "Actief" : job.status === "idle" ? "Wachtend" : "Uit"}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-1.5">{job.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-mono">{job.schedule}</span>
                    <span className="text-[10px] text-primary">Volgende: {job.nextRun}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Loop */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" /> Learning Loop
              </h3>
              <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/20">
                Automatisch
              </Badge>
            </div>

            {/* Loop visualization */}
            <div className="space-y-2 mb-4">
              {[
                { step: "1", label: "GSC Data verzamelen", icon: <BarChart3 className="w-3 h-3" />, done: true },
                { step: "2", label: "Maandelijks evalueren", icon: <Brain className="w-3 h-3" />, done: !!evaluation },
                { step: "3", label: "Strategie aanpassen", icon: <Sparkles className="w-3 h-3" />, done: false },
                { step: "4", label: "Headlines genereren", icon: <FileText className="w-3 h-3" />, done: queue.length > 0 },
                { step: "5", label: "Content publiceren", icon: <Check className="w-3 h-3" />, done: totalPublished > 0 },
              ].map((s, i) => (
                <div key={s.step} className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    s.done ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"
                  }`}>
                    {s.done ? <Check className="w-3 h-3" /> : s.step}
                  </span>
                  <span className="text-muted-foreground">{s.icon}</span>
                  <span className={`text-xs ${s.done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                  {i < 4 && <ArrowRight className="w-3 h-3 text-muted-foreground/30 ml-auto" />}
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1">
                <RotateCcw className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] text-primary font-medium">Herhaalt elke maand automatisch</span>
              </div>
            </div>

            {/* Last evaluation summary */}
            {evaluation && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-[10px] font-medium text-primary mb-1">Laatste Evaluatie</p>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-muted-foreground">Impressies</span>
                    <p className="font-semibold text-foreground">{evaluation.total_impressions.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Clicks</span>
                    <p className="font-semibold text-foreground">{evaluation.total_clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Artikelen</span>
                    <p className="font-semibold text-foreground">{evaluation.articles_published}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Gem. positie</span>
                    <p className="font-semibold text-foreground">{Number(evaluation.avg_position).toFixed(1)}</p>
                  </div>
                </div>
              </div>
            )}

            {!evaluation && (
              <Button variant="heroOutline" size="sm" onClick={handleRunEvaluation} disabled={evalLoading} className="w-full gap-1.5">
                {evalLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                Eerste evaluatie starten
              </Button>
            )}
          </div>

          {/* Conversion Funnel */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-primary" /> Conversie Funnel
            </h3>

            <div className="space-y-2">
              {funnelSteps.map((step, i) => {
                const maxVal = Math.max(...funnelSteps.map(s => s.value), 1);
                const width = Math.max(15, (step.value / maxVal) * 100);
                const convRate = i > 0 && funnelSteps[i - 1].value > 0
                  ? ((step.value / funnelSteps[i - 1].value) * 100).toFixed(1)
                  : null;

                return (
                  <div key={step.label}>
                    {i > 0 && (
                      <div className="flex items-center justify-center py-1">
                        <ArrowDown className="w-3 h-3 text-muted-foreground/40" />
                        {convRate && (
                          <span className="text-[10px] text-muted-foreground ml-1">{convRate}%</span>
                        )}
                      </div>
                    )}
                    <div className="relative">
                      <div
                        className="h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center px-3 transition-all"
                        style={{ width: `${width}%` }}
                      >
                        <span className={`mr-2 ${step.color}`}>{step.icon}</span>
                        <span className="text-xs font-medium text-foreground">{step.value.toLocaleString()}</span>
                      </div>
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pr-2">
                        {step.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Topic performance from evaluation */}
            {evaluation?.topic_performance && (evaluation.topic_performance as any[]).length > 0 && (
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-[10px] font-medium text-muted-foreground mb-2">Topic Coverage</p>
                <div className="space-y-1.5">
                  {(evaluation.topic_performance as any[]).slice(0, 5).map((t: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                      <span className="text-foreground truncate flex-1">{t.name}</span>
                      <div className="flex items-center gap-2 ml-2">
                        <span className="text-muted-foreground">{t.published}/{t.target}</span>
                        {t.gap > 0 ? (
                          <Badge variant="outline" className="text-[9px] bg-yellow-500/10 text-yellow-400 border-yellow-500/20 px-1">
                            -{t.gap}
                          </Badge>
                        ) : (
                          <CheckCircle className="w-3 h-3 text-green-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Recommendations */}
            {evaluation?.recommendations && (evaluation.recommendations as any[]).length > 0 && (
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-[10px] font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" /> AI Aanbevelingen
                </p>
                <div className="space-y-1.5">
                  {(evaluation.recommendations as any[]).slice(0, 4).map((r: string, i: number) => (
                    <p key={i} className="text-[10px] text-foreground/80 leading-relaxed">
                      • {r}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const AdminCalendar = () => (
  <AdminLayout><CalendarTabContent /></AdminLayout>
);

export default AdminCalendar;
