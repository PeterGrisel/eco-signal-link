import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import {
  FileText, Globe, BookOpen, BookA, Boxes, Inbox, ClipboardList,
  Radio, Activity, Mail, Link2, BarChart3, Sparkles, ShieldCheck,
  Server, RefreshCw, CheckCircle2, AlertCircle, Clock, Network, Zap,
  Database, ExternalLink
} from "lucide-react";

type ModuleStatus = "ok" | "warn" | "error" | "idle" | "loading";

interface Metric {
  label: string;
  value: number | string;
  tone?: "default" | "warn" | "error" | "success";
}

interface ModuleCard {
  key: string;
  title: string;
  description: string;
  icon: typeof FileText;
  href?: string;
  category: "content" | "seo" | "leads" | "infra" | "growth";
  status: ModuleStatus;
  metrics: Metric[];
  lastRun?: string | null;
}

const fmtAge = (iso?: string | null) => {
  if (!iso) return "—";
  const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s geleden`;
  if (s < 3600) return `${Math.round(s / 60)}m geleden`;
  if (s < 86400) return `${Math.round(s / 3600)}u geleden`;
  return `${Math.round(s / 86400)}d geleden`;
};

const statusDot = (s: ModuleStatus) => ({
  ok: "bg-green-500",
  warn: "bg-yellow-500",
  error: "bg-destructive",
  idle: "bg-muted-foreground/40",
  loading: "bg-blue-500 animate-pulse",
}[s]);

const toneClass = (t?: Metric["tone"]) => ({
  default: "text-foreground",
  warn: "text-yellow-500",
  error: "text-destructive",
  success: "text-green-500",
}[t || "default"]);

const CATEGORY_LABEL: Record<ModuleCard["category"], string> = {
  content: "Content & CMS",
  seo: "SEO & Authority",
  leads: "Leads & Funnel",
  growth: "Growth Tools",
  infra: "Infrastructure",
};

const AdminSystemMap = () => {
  const [modules, setModules] = useState<ModuleCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const load = async () => {
    setRefreshing(true);
    const head = { count: "exact" as const, head: true };

    const [
      blogTotal, blogPub, blogDraft, blogRecent,
      glossaryTotal, playbooksTotal, abmTotal, abmLive,
      queuePending, queueApproved, queueGenerating, queueFailed,
      topicsTotal, refreshOpen,
      indexQueued, indexFailed, indexRecent,
      gscRecent, monthlyEval, healthRecent,
      authOppOpen, authPlacementsLive, authRunsRecent, authWebsites,
      leadsRecent, groeiplannenRecent, contactRecent, groeistackLeads,
      groeistackTools,
      mcpKeys, scriptsActive, clientLogos,
      jobRunsRecent, jobRunsFailed,
      partnersActive,
      seoActionsOpen,
      embeddingsTotal, linkSuggestionsOpen,
      semrushRunsRecent,
    ] = await Promise.all([
      supabase.from("blog_posts").select("*", head),
      supabase.from("blog_posts").select("*", head).eq("status", "published"),
      supabase.from("blog_posts").select("*", head).eq("status", "draft"),
      supabase.from("blog_posts").select("published_at").order("published_at", { ascending: false, nullsFirst: false }).limit(1).maybeSingle(),
      supabase.from("glossary_terms").select("*", head),
      supabase.from("playbooks").select("*", head),
      supabase.from("abm_pages").select("*", head),
      supabase.from("abm_pages").select("*", head).eq("status", "live"),
      supabase.from("content_queue").select("*", head).eq("status", "pending"),
      supabase.from("content_queue").select("*", head).eq("status", "approved"),
      supabase.from("content_queue").select("*", head).eq("status", "generating"),
      supabase.from("content_queue").select("*", head).eq("status", "failed"),
      supabase.from("content_topics").select("*", head),
      supabase.from("content_refresh_queue").select("*", head).eq("status", "open"),
      supabase.from("indexing_requests").select("*", head).eq("status", "pending"),
      supabase.from("indexing_requests").select("*", head).eq("status", "failed"),
      supabase.from("indexing_requests").select("created_at").order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("gsc_snapshots").select("date").order("date", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("monthly_evaluations").select("created_at").order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("seo_health_log").select("created_at").order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("authority_opportunities").select("*", head).eq("status", "open"),
      supabase.from("authority_placements").select("*", head).eq("status", "live"),
      supabase.from("authority_runs").select("created_at, status").order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("authority_websites").select("*", head),
      supabase.from("groeistack_leads").select("created_at").order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("groeiplan_submissions").select("created_at").order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("contact_submissions").select("created_at").order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("groeistack_leads").select("*", head),
      supabase.from("groeistack_tools").select("*", head),
      supabase.from("mcp_api_keys" as never).select("*", head).eq("is_active", true),
      supabase.from("tracking_scripts").select("*", head).eq("is_active", true),
      supabase.from("client_logos").select("*", head).eq("is_visible", true),
      supabase.from("job_runs").select("created_at, status, job_key").order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("job_runs").select("*", head).eq("status", "failed").gte("created_at", new Date(Date.now() - 24 * 3600 * 1000).toISOString()),
      supabase.from("partners").select("*", head).eq("is_approved", true),
      supabase.from("seo_action_items").select("*", head).eq("status", "open"),
      supabase.from("page_embeddings").select("*", head),
      supabase.from("link_suggestions").select("*", head).eq("status", "open"),
      supabase.from("semrush_sync_runs").select("started_at, status").order("started_at", { ascending: false }).limit(1).maybeSingle(),
    ]);

    const cnt = (r: { count: number | null }) => r.count ?? 0;
    const at = (r: { data: unknown }, key: string): string | null => {
      const d = r.data as Record<string, unknown> | null;
      const v = d?.[key];
      return typeof v === "string" ? v : null;
    };

    const lastBlog = at(blogRecent, "published_at");
    const lastIndex = at(indexRecent, "created_at");
    const lastGsc = at(gscRecent, "date");
    const lastEval = at(monthlyEval, "created_at");
    const lastHealth = at(healthRecent, "created_at");
    const lastAuthRun = at(authRunsRecent, "created_at");
    const lastLead = at(leadsRecent, "created_at");
    const lastPlan = at(groeiplannenRecent, "created_at");
    const lastContact = at(contactRecent, "created_at");
    const lastJob = at(jobRunsRecent, "created_at");
    const lastSemrush = at(semrushRunsRecent, "started_at");

    const cards: ModuleCard[] = [
      // Content
      {
        key: "blog", title: "Blog & Artikelen", description: "CMS posts, categorieën, publicatie",
        icon: FileText, href: "/admin/content?tab=blog", category: "content",
        status: cnt(blogPub) > 0 ? "ok" : "warn",
        metrics: [
          { label: "Gepubliceerd", value: cnt(blogPub), tone: "success" },
          { label: "Draft", value: cnt(blogDraft) },
          { label: "Totaal", value: cnt(blogTotal) },
        ],
        lastRun: lastBlog,
      },
      {
        key: "autopilot", title: "Content Autopilot", description: "Topic-queue → article-generator",
        icon: Sparkles, href: "/admin/content?tab=autopilot", category: "content",
        status: cnt(queueFailed) > 0 ? "error" : cnt(queueApproved) + cnt(queueGenerating) > 0 ? "ok" : "idle",
        metrics: [
          { label: "In queue", value: cnt(queuePending) + cnt(queueApproved), tone: "success" },
          { label: "Generating", value: cnt(queueGenerating) },
          { label: "Failed", value: cnt(queueFailed), tone: cnt(queueFailed) > 0 ? "error" : "default" },
          { label: "Topics", value: cnt(topicsTotal) },
        ],
      },
      {
        key: "refresh", title: "Content Refresh Queue", description: "Auto-detected updates op bestaande posts",
        icon: RefreshCw, href: "/admin/content", category: "content",
        status: cnt(refreshOpen) > 5 ? "warn" : "ok",
        metrics: [{ label: "Open refresh-taken", value: cnt(refreshOpen) }],
      },
      {
        key: "glossary", title: "Woordenboek", description: "Glossary terms & SEO entries",
        icon: BookA, href: "/admin/woordenboek", category: "content",
        status: "ok",
        metrics: [{ label: "Terms", value: cnt(glossaryTotal) }],
      },
      {
        key: "playbooks", title: "Playbooks", description: "Client playbook PDFs",
        icon: BookOpen, href: "/admin/playbooks", category: "content",
        status: "ok",
        metrics: [{ label: "Playbooks", value: cnt(playbooksTotal) }],
      },
      {
        key: "abm", title: "ABM Pages", description: "Account-based landingspagina's",
        icon: ClipboardList, href: "/admin/abm", category: "content",
        status: cnt(abmLive) > 0 ? "ok" : "idle",
        metrics: [
          { label: "Live", value: cnt(abmLive), tone: "success" },
          { label: "Totaal", value: cnt(abmTotal) },
        ],
      },

      // SEO
      {
        key: "indexing", title: "Indexing Requests", description: "Google Indexing API",
        icon: Globe, href: "/admin/seo", category: "seo",
        status: cnt(indexFailed) > 0 ? "error" : cnt(indexQueued) > 0 ? "warn" : "ok",
        metrics: [
          { label: "Pending", value: cnt(indexQueued) },
          { label: "Failed (totaal)", value: cnt(indexFailed), tone: cnt(indexFailed) > 0 ? "error" : "default" },
        ],
        lastRun: lastIndex,
      },
      {
        key: "gsc", title: "GSC Snapshots", description: "Search Console performance data",
        icon: BarChart3, href: "/admin/seo", category: "seo",
        status: lastGsc && Date.now() - new Date(lastGsc).getTime() < 3 * 86400 * 1000 ? "ok" : "warn",
        metrics: [{ label: "Laatste snapshot", value: lastGsc ? new Date(lastGsc).toLocaleDateString("nl-NL") : "—" }],
        lastRun: lastGsc,
      },
      {
        key: "monthly", title: "Monthly Evaluations", description: "SEO maand-rapporten",
        icon: ClipboardList, href: "/admin/seo", category: "seo",
        status: "ok",
        metrics: [{ label: "Laatste run", value: lastEval ? new Date(lastEval).toLocaleDateString("nl-NL") : "—" }],
        lastRun: lastEval,
      },
      {
        key: "internal-links", title: "Internal Linking", description: "Embeddings & link-suggesties",
        icon: Link2, href: "/admin/seo", category: "seo",
        status: cnt(linkSuggestionsOpen) > 0 ? "ok" : "idle",
        metrics: [
          { label: "Embeddings", value: cnt(embeddingsTotal) },
          { label: "Open suggesties", value: cnt(linkSuggestionsOpen) },
        ],
      },
      {
        key: "seo-actions", title: "SEO Actions", description: "Open action items",
        icon: AlertCircle, href: "/admin/seo", category: "seo",
        status: cnt(seoActionsOpen) > 10 ? "warn" : "ok",
        metrics: [{ label: "Open actions", value: cnt(seoActionsOpen), tone: cnt(seoActionsOpen) > 10 ? "warn" : "default" }],
      },
      {
        key: "seo-health", title: "SEO Health Monitor", description: "Site-health checks",
        icon: ShieldCheck, href: "/admin/seo", category: "seo",
        status: lastHealth && Date.now() - new Date(lastHealth).getTime() < 86400 * 1000 ? "ok" : "warn",
        metrics: [{ label: "Laatste check", value: fmtAge(lastHealth) }],
        lastRun: lastHealth,
      },
      {
        key: "authority", title: "Authority / Backlinks", description: "Outreach engine + placements",
        icon: Network, href: "/admin/authority", category: "seo",
        status: cnt(authOppOpen) > 0 ? "ok" : "idle",
        metrics: [
          { label: "Open opps", value: cnt(authOppOpen) },
          { label: "Live placements", value: cnt(authPlacementsLive), tone: "success" },
          { label: "Websites", value: cnt(authWebsites) },
        ],
        lastRun: lastAuthRun,
      },
      {
        key: "semrush", title: "Semrush Sync", description: "Keyword + backlink import",
        icon: BarChart3, href: "/admin/seo", category: "seo",
        status: lastSemrush && Date.now() - new Date(lastSemrush).getTime() < 7 * 86400 * 1000 ? "ok" : "warn",
        metrics: [{ label: "Laatste sync", value: fmtAge(lastSemrush) }],
        lastRun: lastSemrush,
      },

      // Leads
      {
        key: "leads", title: "Contact Submissions", description: "Inbound formulieren",
        icon: Inbox, href: "/admin/leads", category: "leads",
        status: "ok",
        metrics: [{ label: "Laatste lead", value: fmtAge(lastContact) }],
        lastRun: lastContact,
      },
      {
        key: "groeiplannen", title: "Groeiplannen", description: "Strategy-agent intakes",
        icon: ClipboardList, href: "/admin/groeiplannen", category: "leads",
        status: "ok",
        metrics: [{ label: "Laatste intake", value: fmtAge(lastPlan) }],
        lastRun: lastPlan,
      },
      {
        key: "groeistack-leads", title: "Groeistack Leads", description: "Tool-stack scan leads",
        icon: Inbox, href: "/admin/groeistack/leads", category: "leads",
        status: "ok",
        metrics: [
          { label: "Totaal leads", value: cnt(groeistackLeads) },
          { label: "Laatste", value: fmtAge(lastLead) },
        ],
      },

      // Growth tools
      {
        key: "groeistack", title: "Groeistack Tools", description: "Tool-database & vergelijkingen",
        icon: Boxes, href: "/admin/groeistack", category: "growth",
        status: "ok",
        metrics: [{ label: "Tools", value: cnt(groeistackTools) }],
      },
      {
        key: "partners", title: "Partner Directory", description: "Signal Certified partners",
        icon: Network, href: "/admin/dashboard", category: "growth",
        status: "ok",
        metrics: [{ label: "Actieve partners", value: cnt(partnersActive) }],
      },

      // Infra
      {
        key: "mcp", title: "MCP Server", description: "Model Context Protocol endpoint",
        icon: Server, href: "/admin/system?tab=mcp", category: "infra",
        status: cnt(mcpKeys) > 0 ? "ok" : "warn",
        metrics: [{ label: "Active API keys", value: cnt(mcpKeys), tone: cnt(mcpKeys) > 0 ? "success" : "warn" }],
      },
      {
        key: "scripts", title: "Tracking Scripts", description: "GTM, Plausible, custom pixels",
        icon: Activity, href: "/admin/system?tab=scripts", category: "infra",
        status: cnt(scriptsActive) > 0 ? "ok" : "idle",
        metrics: [{ label: "Active", value: cnt(scriptsActive) }],
      },
      {
        key: "client-logos", title: "Klantlogo's", description: "Logo ticker assets",
        icon: Boxes, href: "/admin/system?tab=logos", category: "infra",
        status: "ok",
        metrics: [{ label: "Active", value: cnt(clientLogos) }],
      },
      {
        key: "jobs", title: "Job Runs", description: "Cron + edge function executions",
        icon: Clock, href: "/admin/system", category: "infra",
        status: cnt(jobRunsFailed) > 0 ? "error" : "ok",
        metrics: [
          { label: "Failed (24u)", value: cnt(jobRunsFailed), tone: cnt(jobRunsFailed) > 0 ? "error" : "success" },
          { label: "Laatste run", value: fmtAge(lastJob) },
        ],
        lastRun: lastJob,
      },
      {
        key: "embeddings", title: "Page Embeddings", description: "Vector store voor semantic linking",
        icon: Database, category: "infra", href: "/admin/system",
        status: cnt(embeddingsTotal) > 0 ? "ok" : "warn",
        metrics: [{ label: "Vectors", value: cnt(embeddingsTotal) }],
      },
      {
        key: "email", title: "Email Infra", description: "Auth + transactional mail",
        icon: Mail, category: "infra", href: "/admin/system",
        status: "ok",
        metrics: [{ label: "Status", value: "Operational", tone: "success" }],
      },
    ];

    setModules(cards);
    setLoading(false);
    setRefreshing(false);
    setLastFetch(new Date());
  };

  useEffect(() => {
    load();
  }, []);

  const summary = modules.reduce(
    (acc, m) => {
      acc[m.status] = (acc[m.status] || 0) + 1;
      return acc;
    },
    {} as Record<ModuleStatus, number>,
  );

  const grouped = (["content", "seo", "leads", "growth", "infra"] as const).map((cat) => ({
    cat,
    items: modules.filter((m) => m.category === cat),
  }));

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Network className="w-6 h-6 text-primary" /> System Map
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Realtime overzicht van alle backend-modules · status · queue-lengtes · laatste runs
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastFetch && (
            <span className="text-xs text-muted-foreground">
              Bijgewerkt {fmtAge(lastFetch.toISOString())}
            </span>
          )}
          <Button size="sm" variant="outline" onClick={load} disabled={refreshing} className="gap-2">
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <SummaryTile icon={CheckCircle2} label="OK" value={summary.ok || 0} color="text-green-500" />
        <SummaryTile icon={Zap} label="Warn" value={summary.warn || 0} color="text-yellow-500" />
        <SummaryTile icon={AlertCircle} label="Error" value={summary.error || 0} color="text-destructive" />
        <SummaryTile icon={Clock} label="Idle" value={summary.idle || 0} color="text-muted-foreground" />
        <SummaryTile icon={Boxes} label="Modules" value={modules.length} color="text-primary" />
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ cat, items }) => items.length > 0 && (
            <section key={cat}>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {CATEGORY_LABEL[cat]} <span className="text-muted-foreground/60">· {items.length}</span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((m) => <ModuleTile key={m.key} m={m} />)}
              </div>
            </section>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

const SummaryTile = ({
  icon: Icon, label, value, color,
}: { icon: typeof CheckCircle2; label: string; value: number; color: string }) => (
  <Card className="p-3 flex items-center gap-3">
    <Icon className={`w-5 h-5 ${color}`} />
    <div className="min-w-0">
      <div className="text-xl font-bold leading-tight">{value}</div>
      <div className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  </Card>
);

const ModuleTile = ({ m }: { m: ModuleCard }) => {
  const Icon = m.icon;
  const inner = (
    <Card className="p-4 hover:border-primary/40 transition-colors h-full flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="w-4.5 h-4.5 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate flex items-center gap-2">
              {m.title}
              {m.href && <ExternalLink className="w-3 h-3 text-muted-foreground/60 shrink-0" />}
            </div>
            <div className="text-[11px] text-muted-foreground truncate">{m.description}</div>
          </div>
        </div>
        <span className={`w-2 h-2 rounded-full shrink-0 mt-2 ${statusDot(m.status)}`} title={m.status} />
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-auto">
        {m.metrics.map((mt, i) => (
          <div key={i} className="min-w-0">
            <div className={`font-mono text-sm font-semibold truncate ${toneClass(mt.tone)}`}>{mt.value}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">{mt.label}</div>
          </div>
        ))}
      </div>

      {m.lastRun !== undefined && (
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pt-1 border-t border-border">
          <Clock className="w-3 h-3" /> {fmtAge(m.lastRun)}
        </div>
      )}
    </Card>
  );

  if (m.href) {
    return <Link to={m.href} className="block">{inner}</Link>;
  }
  return inner;
};

export default AdminSystemMap;
