import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from "recharts";
import {
  Activity, MousePointerClick, Eye, Navigation, FileText,
  Loader2, RefreshCw, TrendingUp, Users, Clock, ShieldBan, Plus, X, Globe,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface SiteEvent {
  id: string;
  event_name: string;
  event_category: string;
  event_label: string | null;
  page_path: string | null;
  referrer: string | null;
  session_id: string | null;
  created_at: string;
}

const CATEGORY_COLORS = [
  "hsl(var(--primary))",
  "hsl(142, 71%, 45%)",
  "hsl(48, 96%, 53%)",
  "hsl(280, 65%, 60%)",
  "hsl(199, 89%, 48%)",
];

const AdminAnalytics = () => {
  const [events, setEvents] = useState<SiteEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [blockedIPs, setBlockedIPs] = useState<{ id: string; ip_address: string; label: string | null }[]>([]);
  const [newIP, setNewIP] = useState("");
  const [newIPLabel, setNewIPLabel] = useState("");
  const [myIP, setMyIP] = useState("");

  const fetchBlockedIPs = async () => {
    const { data } = await supabase.from("blocked_tracking_ips").select("*").order("created_at");
    if (data) setBlockedIPs(data);
  };

  const addBlockedIP = async () => {
    if (!newIP) return;
    const { error } = await supabase.from("blocked_tracking_ips").insert({ ip_address: newIP.trim(), label: newIPLabel.trim() || null });
    if (!error) { setNewIP(""); setNewIPLabel(""); fetchBlockedIPs(); }
  };

  const removeBlockedIP = async (id: string) => {
    await supabase.from("blocked_tracking_ips").delete().eq("id", id);
    fetchBlockedIPs();
  };

  useEffect(() => {
    fetch("https://api.ipify.org?format=json").then(r => r.json()).then(d => setMyIP(d.ip)).catch(() => {});
    fetchBlockedIPs();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await supabase
      .from("site_events")
      .select("*")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: false })
      .limit(1000);

    if (!error && data) setEvents(data as SiteEvent[]);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, [days]);

  // ── Derived stats ──
  const stats = useMemo(() => {
    const totalEvents = events.length;
    const uniqueSessions = new Set(events.map(e => e.session_id).filter(Boolean)).size;
    const ctaClicks = events.filter(e => e.event_name === "cta_click").length;
    const formSubmits = events.filter(e => e.event_name === "form_submit").length;
    const pageViews = events.filter(e => e.event_name === "page_view").length;
    const navClicks = events.filter(e => e.event_name === "nav_click").length;
    return { totalEvents, uniqueSessions, ctaClicks, formSubmits, pageViews, navClicks };
  }, [events]);

  // ── Events per day chart ──
  const dailyData = useMemo(() => {
    const map = new Map<string, { date: string; events: number; sessions: Set<string> }>();
    events.forEach(e => {
      const d = e.created_at.slice(0, 10);
      if (!map.has(d)) map.set(d, { date: d, events: 0, sessions: new Set() });
      const entry = map.get(d)!;
      entry.events++;
      if (e.session_id) entry.sessions.add(e.session_id);
    });
    return Array.from(map.values())
      .map(d => ({ date: d.date, events: d.events, sessions: d.sessions.size }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [events]);

  // ── Category breakdown ──
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    events.forEach(e => {
      map.set(e.event_category, (map.get(e.event_category) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [events]);

  // ── Top pages ──
  const topPages = useMemo(() => {
    const map = new Map<string, number>();
    events.filter(e => e.page_path).forEach(e => {
      map.set(e.page_path!, (map.get(e.page_path!) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [events]);

  // ── Top CTA labels ──
  const topCTAs = useMemo(() => {
    const map = new Map<string, number>();
    events.filter(e => e.event_name === "cta_click" && e.event_label).forEach(e => {
      map.set(e.event_label!, (map.get(e.event_label!) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [events]);

  // ── Recent events ──
  const recentEvents = events.slice(0, 20);

  const chartConfig = {
    events: { label: "Events", color: "hsl(var(--primary))" },
    sessions: { label: "Sessies", color: "hsl(142, 71%, 45%)" },
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" /> Event Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Website interacties, clicks en conversies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-card border border-border rounded-lg overflow-hidden">
            {[7, 14, 28, 90].map(d => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  days === d ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={fetchEvents} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Totaal Events", value: stats.totalEvents, icon: Activity, color: "text-primary" },
          { label: "Sessies", value: stats.uniqueSessions, icon: Users, color: "text-blue-400" },
          { label: "Pageviews", value: stats.pageViews, icon: Eye, color: "text-green-400" },
          { label: "CTA Clicks", value: stats.ctaClicks, icon: MousePointerClick, color: "text-yellow-400" },
          { label: "Formulieren", value: stats.formSubmits, icon: FileText, color: "text-purple-400" },
          { label: "Nav Clicks", value: stats.navClicks, icon: Navigation, color: "text-cyan-400" },
        ].map(kpi => (
          <Card key={kpi.label} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                <span className="text-[11px] text-muted-foreground">{kpi.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Events over time */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Events & Sessies per dag
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dailyData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[260px] w-full">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis dataKey="date" tickFormatter={formatDate} className="text-[10px]" />
                  <YAxis className="text-[10px]" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="events" stroke="var(--color-events)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="sessions" stroke="var(--color-sessions)" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">
                Geen data beschikbaar
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Pie */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categorie Verdeling</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <div className="h-[260px] flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                      nameKey="name"
                    >
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 justify-center">
                  {categoryData.map((c, i) => (
                    <div key={c.name} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                      {c.name} ({c.value})
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">
                Geen data
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Top Pages */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="w-4 h-4 text-green-400" /> Top Pagina's
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px]">Pagina</TableHead>
                  <TableHead className="text-[11px] text-right">Events</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPages.map(p => (
                  <TableRow key={p.path}>
                    <TableCell className="text-xs font-mono text-muted-foreground truncate max-w-[200px]">{p.path}</TableCell>
                    <TableCell className="text-xs text-right font-medium">{p.count}</TableCell>
                  </TableRow>
                ))}
                {topPages.length === 0 && (
                  <TableRow><TableCell colSpan={2} className="text-center text-xs text-muted-foreground py-4">Geen data</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top CTAs */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-yellow-400" /> Top CTA Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topCTAs.length > 0 ? (
              <ChartContainer config={{ count: { label: "Clicks", color: "hsl(48, 96%, 53%)" } }} className="h-[200px] w-full">
                <BarChart data={topCTAs} layout="vertical">
                  <XAxis type="number" className="text-[10px]" />
                  <YAxis type="category" dataKey="label" width={120} className="text-[10px]" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
                Geen CTA clicks geregistreerd
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" /> Recente Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[11px]">Tijd</TableHead>
                <TableHead className="text-[11px]">Event</TableHead>
                <TableHead className="text-[11px]">Categorie</TableHead>
                <TableHead className="text-[11px]">Label</TableHead>
                <TableHead className="text-[11px]">Pagina</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEvents.map(e => (
                <TableRow key={e.id}>
                  <TableCell className="text-[11px] text-muted-foreground whitespace-nowrap">{formatTime(e.created_at)}</TableCell>
                  <TableCell className="text-xs font-medium">{e.event_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{e.event_category}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground truncate max-w-[150px]">{e.event_label || "–"}</TableCell>
                  <TableCell className="text-[11px] font-mono text-muted-foreground truncate max-w-[150px]">{e.page_path || "–"}</TableCell>
                </TableRow>
              ))}
              {recentEvents.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-6">Nog geen events geregistreerd</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* IP Blocklist */}
      <Card className="bg-card border-border mt-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <ShieldBan className="w-4 h-4 text-destructive" /> Tracking Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            Ingelogde admins worden automatisch uitgesloten. Hieronder kun je extra IP-adressen blokkeren.
          </p>
          {myIP && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-md bg-muted/50 border border-border">
              <Globe className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Jouw huidige IP:</span>
              <code className="text-xs font-mono text-foreground">{myIP}</code>
              {!blockedIPs.some(b => b.ip_address === myIP) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto h-7 text-[11px]"
                  onClick={() => { setNewIP(myIP); setNewIPLabel("Mijn IP"); }}
                >
                  Blokkeer mijn IP
                </Button>
              )}
              {blockedIPs.some(b => b.ip_address === myIP) && (
                <Badge variant="outline" className="ml-auto text-[10px] text-green-400 border-green-500/20">Geblokkeerd ✓</Badge>
              )}
            </div>
          )}

          {/* Add IP form */}
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="IP-adres (bijv. 123.45.67.89)"
              value={newIP}
              onChange={e => setNewIP(e.target.value)}
              className="flex-1 h-8 text-xs"
            />
            <Input
              placeholder="Label (optioneel)"
              value={newIPLabel}
              onChange={e => setNewIPLabel(e.target.value)}
              className="w-40 h-8 text-xs"
            />
            <Button variant="outline" size="sm" onClick={addBlockedIP} disabled={!newIP} className="h-8 gap-1">
              <Plus className="w-3.5 h-3.5" /> Toevoegen
            </Button>
          </div>

          {/* Blocked IPs list */}
          {blockedIPs.length > 0 && (
            <div className="space-y-1">
              {blockedIPs.map(ip => (
                <div key={ip.id} className="flex items-center justify-between px-3 py-1.5 rounded-md bg-muted/30 border border-border">
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-foreground">{ip.ip_address}</code>
                    {ip.label && <span className="text-[11px] text-muted-foreground">— {ip.label}</span>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeBlockedIP(ip.id)} className="h-6 w-6 p-0">
                    <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminAnalytics;
