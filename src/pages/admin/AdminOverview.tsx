import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Sankey, Tooltip, FunnelChart, Funnel, LabelList,
} from "recharts";
import {
  LayoutDashboard, Users, Activity, MousePointerClick, Eye, TrendingUp,
  RefreshCw, Loader2, ArrowRight, FileText, Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { format, subDays, startOfDay } from "date-fns";
import { nl } from "date-fns/locale";

interface SiteEvent {
  event_name: string;
  event_category: string;
  event_label: string | null;
  page_path: string | null;
  session_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export const OverviewTabContent = () => {
  const [events, setEvents] = useState<SiteEvent[]>([]);
  const [ga4Data, setGa4Data] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  const fetchAll = async () => {
    setLoading(true);
    const since = subDays(new Date(), days).toISOString();

    const [eventsRes, ga4Res] = await Promise.all([
      supabase
        .from("site_events")
        .select("event_name, event_category, event_label, page_path, session_id, metadata, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(1000),
      supabase.functions.invoke("fetch-ga4-data", { body: { days } }).catch(() => ({ data: null })),
    ]);

    if (eventsRes.data) setEvents(eventsRes.data as SiteEvent[]);
    if (ga4Res.data && !ga4Res.data?.error) setGa4Data(ga4Res.data);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, [days]);

  // ── Derived metrics ──
  const uniqueSessions = useMemo(() => new Set(events.filter(e => e.session_id).map(e => e.session_id)).size, [events]);
  const pageViews = useMemo(() => events.filter(e => e.event_name === "page_view").length, [events]);
  const ctaClicks = useMemo(() => events.filter(e => e.event_category === "cta").length, [events]);
  const formSubmits = useMemo(() => events.filter(e => e.event_name === "form_submit").length, [events]);

  // ── Funnel data ──
  const funnelData = useMemo(() => [
    { name: "Sessies", value: uniqueSessions, fill: "hsl(var(--primary))" },
    { name: "Pageviews", value: pageViews, fill: "hsl(142, 71%, 45%)" },
    { name: "CTA Clicks", value: ctaClicks, fill: "hsl(48, 96%, 53%)" },
    { name: "Formulieren", value: formSubmits, fill: "hsl(280, 65%, 60%)" },
  ], [uniqueSessions, pageViews, ctaClicks, formSubmits]);

  // ── Daily trend (sessions + leads) ──
  const dailyTrend = useMemo(() => {
    const map = new Map<string, { sessions: Set<string>; events: number }>();
    for (let i = days - 1; i >= 0; i--) {
      const d = format(subDays(new Date(), i), "yyyy-MM-dd");
      map.set(d, { sessions: new Set(), events: 0 });
    }
    events.forEach(e => {
      const d = format(new Date(e.created_at), "yyyy-MM-dd");
      const entry = map.get(d);
      if (entry) {
        entry.events++;
        if (e.session_id) entry.sessions.add(e.session_id);
      }
    });
    return Array.from(map.entries()).map(([date, data]) => ({
      date: format(new Date(date), "d/M"),
      sessies: data.sessions.size,
      events: data.events,
    }));
  }, [events, days]);

  // ── Top pages by views ──
  const topPages = useMemo(() => {
    const map = new Map<string, number>();
    events.filter(e => e.event_name === "page_view" && e.page_path).forEach(e => {
      map.set(e.page_path!, (map.get(e.page_path!) || 0) + 1);
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([page, views]) => ({ page, views }));
  }, [events]);

  // ── Top CTA's ──
  const topCTAs = useMemo(() => {
    const map = new Map<string, number>();
    events.filter(e => e.event_category === "cta" && e.event_label).forEach(e => {
      map.set(e.event_label!, (map.get(e.event_label!) || 0) + 1);
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, clicks]) => ({ label, clicks }));
  }, [events]);

  return (
    <>
      <div className="flex items-center justify-end gap-2 mb-6">
        {[7, 14, 28, 90].map(d => (
          <Button
            key={d}
            variant={days === d ? "hero" : "outline"}
            size="sm"
            onClick={() => setDays(d)}
          >
            {d}d
          </Button>
        ))}
        <Button variant="outline" size="sm" onClick={fetchAll} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* ── KPI Cards ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: "Sessies", value: ga4Data?.totals?.sessions || uniqueSessions, icon: Users, color: "text-primary" },
              { label: "Pageviews", value: pageViews, icon: Eye, color: "text-green-400" },
              { label: "CTA Clicks", value: ctaClicks, icon: MousePointerClick, color: "text-yellow-400" },
              { label: "Formulieren", value: formSubmits, icon: FileText, color: "text-primary" },
              { label: "Events", value: events.length, icon: Activity, color: "text-blue-400" },
            ].map(stat => (
              <Card key={stat.label} className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ── Conversion Funnel + Daily Trend ── */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Funnel */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> Conversie Funnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {funnelData.map((step, i) => {
                    const maxVal = funnelData[0].value || 1;
                    const pct = Math.max(5, (step.value / maxVal) * 100);
                    const dropoff = i > 0 && funnelData[i - 1].value > 0
                      ? ((1 - step.value / funnelData[i - 1].value) * 100).toFixed(0)
                      : null;
                    return (
                      <div key={step.name}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-foreground font-medium">{step.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-foreground font-bold">{step.value}</span>
                            {dropoff && (
                              <span className="text-xs text-red-400">-{dropoff}%</span>
                            )}
                          </div>
                        </div>
                        <div className="h-6 bg-muted rounded-md overflow-hidden">
                          <div
                            className="h-full rounded-md transition-all duration-500"
                            style={{ width: `${pct}%`, backgroundColor: step.fill }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Daily trend */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" /> Dagelijkse Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{
                  sessies: { label: "Sessies", color: "hsl(var(--primary))" },
                  events: { label: "Events", color: "hsl(142, 71%, 45%)" },
                }} className="h-[220px]">
                  <LineChart data={dailyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="sessies" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="events" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* ── Top Pages + Top CTAs ── */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="w-4 h-4 text-green-400" /> Top Pagina's
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {topPages.map(p => (
                    <div key={p.page} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                      <span className="text-sm text-foreground truncate max-w-[70%]">{p.page}</span>
                      <span className="text-sm font-bold text-foreground">{p.views}</span>
                    </div>
                  ))}
                  {topPages.length === 0 && <p className="text-sm text-muted-foreground">Geen data</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MousePointerClick className="w-4 h-4 text-yellow-400" /> Top CTA Clicks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {topCTAs.map(c => (
                    <div key={c.label} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                      <span className="text-sm text-foreground truncate max-w-[70%]">{c.label}</span>
                      <span className="text-sm font-bold text-foreground">{c.clicks}</span>
                    </div>
                  ))}
                  {topCTAs.length === 0 && <p className="text-sm text-muted-foreground">Geen CTA clicks</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Quick links ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Analytics", href: "/admin/analytics", icon: Activity },
              { label: "KPI Dashboard", href: "/admin/dashboard?tab=kpi", icon: TrendingUp },
              { label: "Autopilot", href: "/admin/content?tab=autopilot", icon: Zap },
              { label: "SEO Hub", href: "/admin/seo", icon: TrendingUp },
            ].map(link => (
              <Link key={link.href} to={link.href}>
                <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <link.icon className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

