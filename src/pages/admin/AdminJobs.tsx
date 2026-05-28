import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Activity, BookOpen, Calendar, CheckCircle2, ChevronDown, ChevronRight,
  FileText, Link as LinkIcon, Loader2, Network, Play, RefreshCw, Search,
  Sparkles, Target, ShieldCheck, XCircle, Zap,
} from "lucide-react";

type JobStatus = "success" | "error" | "running" | "idle";

interface JobDef {
  key: string;
  label: string;
  description: string;
  fn: string;
  schedule: string;
  icon: any;
}

const JOBS: JobDef[] = [
  { key: "autopilot-run", label: "Blog autopilot", description: "Genereert ingeplande blogposts", fn: "autopilot-run", schedule: "Dagelijks 06:00", icon: FileText },
  { key: "generate-playbook", label: "Playbook autopilot", description: "Maakt nieuwe playbooks uit scenario's", fn: "generate-playbook", schedule: "Dagelijks 06:00", icon: BookOpen },
  { key: "generate-glossary", label: "Woordenboek autopilot", description: "Vult woordenboek aan", fn: "generate-glossary", schedule: "Wekelijks", icon: BookOpen },
  { key: "fetch-gsc-data", label: "GSC data sync", description: "Haalt Search Console data binnen", fn: "fetch-gsc-data", schedule: "Handmatig / dagelijks", icon: RefreshCw },
  { key: "monthly-evaluation", label: "Maandelijkse evaluatie", description: "Analyseert content prestaties", fn: "monthly-evaluation", schedule: "Maandelijks 03:00", icon: Activity },
  { key: "validate-external-links", label: "Link validatie", description: "Controleert externe links in posts", fn: "validate-external-links", schedule: "Bij publicatie", icon: LinkIcon },
  { key: "content-cleanup", label: "Content opschoning", description: "Archiveert oude posts", fn: "content-cleanup", schedule: "Wekelijks", icon: Zap },
  { key: "daily-seo-report", label: "Dagelijkse SEO rapportage", description: "Stuurt rapport naar Slack", fn: "daily-seo-report", schedule: "Dagelijks 08:00", icon: Activity },
  { key: "smart-internal-linker", label: "Smart internal linker", description: "Voegt automatisch interne links toe", fn: "smart-internal-linker", schedule: "Dagelijks 04:00", icon: LinkIcon },
  { key: "gsc-opportunity-scan", label: "GSC kansen scanner", description: "Vindt keyword kansen uit GSC", fn: "gsc-opportunity-scan", schedule: "Dagelijks 05:00", icon: Search },
  { key: "generate-page-embeddings", label: "Pagina embeddings", description: "Vector embeddings voor alle pagina's", fn: "generate-page-embeddings", schedule: "Wekelijks zondag 02:00", icon: Sparkles },
  { key: "orphan-link-detector", label: "Weespagina detector", description: "Vindt slecht gelinkte pagina's", fn: "orphan-link-detector", schedule: "Wekelijks zondag 03:00", icon: Network },
  { key: "striking-distance-scan", label: "Striking distance scanner", description: "Vindt keywords op positie 8-20 met prioriteit", fn: "striking-distance-scan", schedule: "Wekelijks maandag 05:00", icon: Target },
  { key: "seo-health-monitor", label: "SEO health monitor", description: "Anker-diversiteit, over-linking en weespagina's", fn: "seo-health-monitor", schedule: "Wekelijks maandag 06:00", icon: ShieldCheck },
];

interface Run {
  id: string; job_key: string; status: string; message: string | null;
  created_at: string; duration_ms: number | null;
}
interface Opportunity {
  id: string; query: string; page: string | null; position: number | null;
  impressions: number | null; suggested_action: string; status: string;
}
interface Suggestion {
  id: string; source_url: string; target_url: string; score: number; reason: string | null; status: string;
}
interface CalItem { date: string; type: string; title: string; }

const sb = supabase as any;

const statusColor = (s: string) =>
  s === "success" ? "text-emerald-500" : s === "error" ? "text-destructive" : "text-amber-500";

export const JobsTabContent = () => {
  const { toast } = useToast();
  const [runs, setRuns] = useState<Run[]>([]);
  const [running, setRunning] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [calendar, setCalendar] = useState<CalItem[]>([]);

  const load = async () => {
    const [r, o, s, q, p] = await Promise.all([
      sb.from("job_runs").select("*").order("created_at", { ascending: false }).limit(200),
      sb.from("keyword_opportunities").select("*").eq("status", "open").order("impressions", { ascending: false }).limit(20),
      sb.from("link_suggestions").select("*").eq("status", "open").order("score", { ascending: false }).limit(20),
      sb.from("content_queue").select("scheduled_date,headline,content_type").not("scheduled_date", "is", null).gte("scheduled_date", new Date(Date.now() - 30*24*3600*1000).toISOString().slice(0,10)).limit(200),
      sb.from("playbook_scenarios").select("scheduled_date,title").not("scheduled_date", "is", null).limit(200),
    ]);
    setRuns(r.data || []);
    setOpportunities(o.data || []);
    setSuggestions(s.data || []);

    const cal: CalItem[] = [];
    for (const c of q.data || []) cal.push({ date: c.scheduled_date, type: c.content_type || "blog", title: c.headline });
    for (const sc of p.data || []) cal.push({ date: sc.scheduled_date, type: "playbook", title: sc.title });
    cal.sort((a, b) => a.date.localeCompare(b.date));
    setCalendar(cal);
  };

  useEffect(() => { load(); }, []);

  const runJob = async (job: JobDef) => {
    setRunning((r) => ({ ...r, [job.key]: true }));
    const { data, error } = await supabase.functions.invoke(job.fn, { body: {} });
    setRunning((r) => ({ ...r, [job.key]: false }));
    if (error || (data && (data as any).error)) {
      toast({ title: `${job.label} mislukt`, description: error?.message || (data as any)?.error, variant: "destructive" });
    } else {
      toast({ title: `${job.label} gestart`, description: (data as any)?.message || "Gelukt" });
    }
    load();
  };

  const lastRunFor = (key: string) => runs.find((r) => r.job_key === key);
  const recentRuns = (key: string) => runs.filter((r) => r.job_key === key).slice(0, 5);

  const dismissOpp = async (id: string) => {
    await sb.from("keyword_opportunities").update({ status: "dismissed" }).eq("id", id);
    setOpportunities((arr) => arr.filter((o) => o.id !== id));
  };
  const dismissSugg = async (id: string) => {
    await sb.from("link_suggestions").update({ status: "dismissed" }).eq("id", id);
    setSuggestions((arr) => arr.filter((o) => o.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Jobs overzicht
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Alle automations op één plek: cron schema, laatste run, en handmatig starten.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Verversen
        </Button>
      </div>

      {/* Jobs grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {JOBS.map((job) => {
          const last = lastRunFor(job.key);
          const isRunning = running[job.key];
          const Icon = job.icon;
          const isExpanded = expanded[job.key];
          return (
            <div key={job.key} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-semibold text-foreground">{job.label}</h3>
                    {last ? (
                      last.status === "success" ? (
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">Actief</span>
                      ) : (
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-destructive/10 text-destructive">Mislukt</span>
                      )
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">Nog niet gedraaid</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{job.description}</p>
                  <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {job.schedule}</span>
                    {last && (
                      <span className={`flex items-center gap-1 ${statusColor(last.status)}`}>
                        {last.status === "success" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {new Date(last.created_at).toLocaleString("nl-NL")}
                      </span>
                    )}
                  </p>
                  {last?.message && <p className="text-[11px] text-foreground/70 mt-1 truncate">{last.message}</p>}
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => runJob(job)} disabled={isRunning} className="gap-1.5 h-7 px-2">
                    {isRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                    <span className="text-xs">Run</span>
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setExpanded((e) => ({ ...e, [job.key]: !e[job.key] }))} className="h-7 px-2">
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-border space-y-1.5">
                  {recentRuns(job.key).length === 0 ? (
                    <p className="text-xs text-muted-foreground">Geen runs gelogd.</p>
                  ) : recentRuns(job.key).map((r) => (
                    <div key={r.id} className="flex items-center gap-2 text-xs">
                      {r.status === "success" ? <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> : <XCircle className="w-3 h-3 text-destructive shrink-0" />}
                      <span className="text-muted-foreground tabular-nums w-32 shrink-0">{new Date(r.created_at).toLocaleString("nl-NL")}</span>
                      <span className="text-foreground/80 truncate flex-1">{r.message || "—"}</span>
                      {r.duration_ms && <span className="text-muted-foreground tabular-nums">{(r.duration_ms / 1000).toFixed(1)}s</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Keyword opportunities */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" /> GSC kansen ({opportunities.length})
          </h3>
          <Button size="sm" variant="ghost" onClick={() => runJob(JOBS.find(j => j.key === "gsc-opportunity-scan")!)}>
            Scan opnieuw
          </Button>
        </div>
        {opportunities.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nog geen open kansen. Laat de scanner draaien.</p>
        ) : (
          <div className="space-y-1.5">
            {opportunities.map((o) => (
              <div key={o.id} className="flex items-center gap-3 text-sm py-1.5 border-b border-border/50 last:border-0">
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary shrink-0">
                  {o.suggested_action.replace(/_/g, " ")}
                </span>
                <span className="flex-1 truncate text-foreground/90">{o.query}</span>
                <span className="text-xs text-muted-foreground tabular-nums shrink-0">pos {o.position}</span>
                <span className="text-xs text-muted-foreground tabular-nums shrink-0">{o.impressions} imp</span>
                {o.page && <a href={o.page} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline shrink-0 max-w-40 truncate">{o.page}</a>}
                <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => dismissOpp(o.id)}>Verwijder</Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Link suggestions */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <Network className="w-4 h-4 text-primary" /> Interne link suggesties ({suggestions.length})
          </h3>
          <Button size="sm" variant="ghost" onClick={() => runJob(JOBS.find(j => j.key === "orphan-link-detector")!)}>
            Detect opnieuw
          </Button>
        </div>
        {suggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nog geen suggesties. Genereer eerst embeddings, draai dan de detector.</p>
        ) : (
          <div className="space-y-1.5">
            {suggestions.map((s) => (
              <div key={s.id} className="flex items-center gap-3 text-sm py-1.5 border-b border-border/50 last:border-0">
                <span className="text-xs tabular-nums text-primary shrink-0">{(s.score * 100).toFixed(0)}%</span>
                <a href={s.source_url} className="text-foreground/90 hover:text-primary truncate flex-1">{s.source_url}</a>
                <span className="text-muted-foreground">→</span>
                <a href={s.target_url} className="text-foreground/90 hover:text-primary truncate flex-1">{s.target_url}</a>
                <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => dismissSugg(s.id)}>Verwijder</Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Combined calendar */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-primary" /> Gecombineerde kalender ({calendar.length})
        </h3>
        {calendar.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nog niets ingepland.</p>
        ) : (
          <div className="space-y-1">
            {calendar.map((c, i) => (
              <div key={i} className="flex items-center gap-3 text-sm py-1 border-b border-border/50 last:border-0">
                <span className="text-xs text-muted-foreground tabular-nums w-24 shrink-0">{c.date}</span>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                  c.type === "playbook" ? "bg-blue-500/10 text-blue-500" :
                  c.type === "glossary" ? "bg-purple-500/10 text-purple-500" :
                  "bg-emerald-500/10 text-emerald-500"
                }`}>{c.type}</span>
                <span className="text-foreground/90 truncate flex-1">{c.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsTabContent;