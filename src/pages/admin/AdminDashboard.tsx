import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  LayoutDashboard, Users, MousePointerClick, Inbox, Percent, Search, TrendingUp,
  ArrowUp, ArrowDown, Minus, RefreshCw, Loader2, Globe, Trophy, ShieldBan, Plus, X, ArrowRight,
} from "lucide-react";
import { format, subDays } from "date-fns";
import { nl } from "date-fns/locale";

const DAYS = 30;

interface Ev {
  event_name: string;
  event_category: string;
  event_label: string | null;
  page_path: string | null;
  session_id: string | null;
  metadata: any;
  created_at: string;
}
interface Lead { kind: string; name: string | null; email: string | null; company: string | null; created_at: string }

const pct = (cur: number, prev: number) => (prev === 0 ? (cur > 0 ? 100 : 0) : Math.round(((cur - prev) / prev) * 100));
const nf = (n: number) => n.toLocaleString("nl-NL");

const Delta = ({ cur, prev, invert = false }: { cur: number; prev: number; invert?: boolean }) => {
  const d = pct(cur, prev);
  const good = invert ? d < 0 : d > 0;
  if (d === 0) return <span className="text-xs text-muted-foreground inline-flex items-center gap-0.5"><Minus className="w-3 h-3" />0%</span>;
  return (
    <span className={`text-xs inline-flex items-center gap-0.5 ${good ? "text-primary" : "text-destructive"}`}>
      {d > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      {Math.abs(d)}%
    </span>
  );
};

const Kpi = ({ icon: Icon, label, value, cur, prev, hint }: any) => (
  <Card className="bg-card border-border">
    <CardContent className="p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-[11px] uppercase tracking-wider font-display font-semibold">{label}</span>
      </div>
      <p className="font-display text-3xl font-bold text-foreground">{value}</p>
      <div className="flex items-center gap-2 mt-1">
        {prev !== undefined && <Delta cur={cur} prev={prev} />}
        <span className="text-[11px] text-muted-foreground">{hint ?? "vs vorige 30 dagen"}</span>
      </div>
    </CardContent>
  </Card>
);

const RankList = ({ rows, empty }: { rows: { label: string; value: number; sub?: string }[]; empty: string }) => {
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (!rows.length) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex justify-between gap-3 text-sm mb-1">
            <span className="text-foreground truncate">{r.label}</span>
            <span className="text-foreground font-semibold shrink-0">{nf(r.value)}{r.sub && <span className="text-muted-foreground font-normal ml-1">{r.sub}</span>}</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary/70" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
};

async function loadEvents(): Promise<Ev[]> {
  const since = subDays(new Date(), DAYS * 2).toISOString();
  const all: Ev[] = [];
  for (let from = 0; from < 60000; from += 1000) {
    const { data, error } = await supabase
      .from("site_events")
      .select("event_name, event_category, event_label, page_path, session_id, metadata, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .range(from, from + 999);
    if (error || !data) break;
    all.push(...(data as Ev[]));
    if (data.length < 1000) break;
  }
  return all;
}

async function loadLeads(): Promise<Lead[]> {
  const since = subDays(new Date(), DAYS * 2).toISOString();
  const [c, g, s] = await Promise.all([
    supabase.from("contact_submissions").select("name, email, company, created_at").gte("created_at", since),
    supabase.from("groeiplan_submissions").select("name, email, company, created_at").gte("created_at", since),
    supabase.from("groeistack_leads").select("name, email, created_at").gte("created_at", since),
  ]);
  return [
    ...(c.data ?? []).map((r: any) => ({ ...r, kind: "Contact" })),
    ...(g.data ?? []).map((r: any) => ({ ...r, kind: "Groeiplan" })),
    ...(s.data ?? []).map((r: any) => ({ ...r, company: null, kind: "Groeistack" })),
  ].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

const IpFilters = () => {
  const [ips, setIps] = useState<{ id: string; ip_address: string; label: string | null }[]>([]);
  const [ip, setIp] = useState("");
  const [label, setLabel] = useState("");
  const [myIp, setMyIp] = useState("");
  const load = async () => {
    const { data } = await supabase.from("blocked_tracking_ips").select("*").order("created_at");
    if (data) setIps(data);
  };
  useEffect(() => {
    load();
    fetch("https://api.ipify.org?format=json").then((r) => r.json()).then((d) => setMyIp(d.ip)).catch(() => {});
  }, []);
  const add = async () => {
    if (!ip) return;
    const { error } = await supabase.from("blocked_tracking_ips").insert({ ip_address: ip.trim(), label: label.trim() || null });
    if (!error) { setIp(""); setLabel(""); load(); }
  };
  const del = async (id: string) => { await supabase.from("blocked_tracking_ips").delete().eq("id", id); load(); };
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2"><ShieldBan className="w-4 h-4 text-destructive" /> Eigen bezoek uitsluiten</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-3">Ingelogde admins tellen nooit mee. Blokkeer hier extra IP-adressen.</p>
        {myIp && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-md bg-muted/50 border border-border">
            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Jouw IP:</span>
            <code className="text-xs font-mono text-foreground">{myIp}</code>
            {ips.some((b) => b.ip_address === myIp)
              ? <Badge variant="outline" className="ml-auto text-[10px]">Geblokkeerd</Badge>
              : <Button variant="outline" size="sm" className="ml-auto h-7 text-[11px]" onClick={() => { setIp(myIp); setLabel("Mijn IP"); }}>Blokkeer mijn IP</Button>}
          </div>
        )}
        <div className="flex gap-2 mb-3">
          <Input placeholder="IP-adres" value={ip} onChange={(e) => setIp(e.target.value)} className="flex-1 h-8 text-xs" />
          <Input placeholder="Label" value={label} onChange={(e) => setLabel(e.target.value)} className="w-32 h-8 text-xs" />
          <Button variant="outline" size="sm" onClick={add} disabled={!ip} className="h-8 gap-1"><Plus className="w-3.5 h-3.5" /> Toevoegen</Button>
        </div>
        <div className="space-y-1">
          {ips.map((b) => (
            <div key={b.id} className="flex items-center justify-between px-3 py-1.5 rounded-md bg-muted/30 border border-border">
              <span className="text-xs"><code className="font-mono text-foreground">{b.ip_address}</code>{b.label && <span className="text-muted-foreground"> · {b.label}</span>}</span>
              <Button variant="ghost" size="sm" onClick={() => del(b.id)} className="h-6 w-6 p-0"><X className="w-3 h-3" /></Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Ev[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [ga4, setGa4] = useState<any>(null);
  const [gsc, setGsc] = useState<any>(null);

  const fetchAll = async () => {
    setLoading(true);
    const [ev, ld, g4, sc] = await Promise.all([
      loadEvents(),
      loadLeads(),
      supabase.functions.invoke("fetch-ga4-data", { body: { days: DAYS } }).catch(() => ({ data: null })),
      supabase.functions.invoke("fetch-gsc-data", { body: { mode: "overview", days: DAYS } }).catch(() => ({ data: null })),
    ]);
    setEvents(ev);
    setLeads(ld);
    setGa4(g4?.data && !g4.data.error ? g4.data : null);
    setGsc(sc?.data && !sc.data.error ? sc.data : null);
    setLoading(false);
  };
  useEffect(() => { fetchAll(); }, []);

  const m = useMemo(() => {
    const cutoff = subDays(new Date(), DAYS).toISOString();
    // Losse hits (1 event, geen scroll/leestijd) zijn vrijwel altijd bots of linkvoorbeelden.
    const perSession = new Map<string, number>();
    events.forEach((e) => e.session_id && perSession.set(e.session_id, (perSession.get(e.session_id) || 0) + 1));
    const real = events.filter((e) => e.session_id && (perSession.get(e.session_id) || 0) > 1);
    const allCurSessions = new Set(events.filter((e) => e.created_at >= cutoff && e.session_id).map((e) => e.session_id)).size;
    const cur = real.filter((e) => e.created_at >= cutoff);
    const prev = real.filter((e) => e.created_at < cutoff);
    const sess = (arr: Ev[]) => new Set(arr.map((e) => e.session_id).filter(Boolean)).size;
    const cnt = (arr: Ev[], f: (e: Ev) => boolean) => arr.filter(f).length;
    const isCta = (e: Ev) => e.event_name === "cta_click";
    const bookings: Lead[] = events
      .filter((e) => e.event_name === "demo_booked")
      .map((e) => ({ kind: "Afspraak", name: "Afspraak via agenda", email: null, company: e.metadata?.source ?? null, created_at: e.created_at }));
    const allLeads = [...leads, ...bookings].sort((a, b) => b.created_at.localeCompare(a.created_at));
    const curLeads = allLeads.filter((l) => l.created_at >= cutoff);
    const prevLeads = allLeads.filter((l) => l.created_at < cutoff);
    const funnel = [
      { label: "Klik op een knop", value: cnt(cur, isCta) },
      { label: "Agenda geopend", value: cnt(cur, (e) => e.event_name === "demo_modal_open") },
      { label: "Agenda geladen", value: cnt(cur, (e) => e.event_name === "booking_calendar_loaded") },
      { label: "Afspraak geboekt", value: cnt(cur, (e) => e.event_name === "demo_booked") },
      { label: "Formulier verstuurd", value: cnt(cur, (e) => e.event_name === "form_submit") },
    ];
    const botHits = allCurSessions - sess(cur);
    const s = { cur: sess(cur), prev: sess(prev) };
    const cta = { cur: cnt(cur, isCta), prev: cnt(prev, isCta) };
    const ld = { cur: curLeads.length, prev: prevLeads.length };
    const conv = { cur: s.cur ? (ld.cur / s.cur) * 100 : 0, prev: s.prev ? (ld.prev / s.prev) * 100 : 0 };

    // daily
    const days = new Map<string, { sessions: Set<string>; leads: number }>();
    for (let i = DAYS - 1; i >= 0; i--) days.set(format(subDays(new Date(), i), "yyyy-MM-dd"), { sessions: new Set(), leads: 0 });
    cur.forEach((e) => { const d = days.get(e.created_at.slice(0, 10)); if (d && e.session_id) d.sessions.add(e.session_id); });
    curLeads.forEach((l) => { const d = days.get(l.created_at.slice(0, 10)); if (d) d.leads++; });
    const daily = [...days.entries()].map(([d, v]) => ({ date: format(new Date(d), "d MMM", { locale: nl }), bezoekers: v.sessions.size, leads: v.leads }));

    // pages: sessions per page + cta per page
    const pageSess = new Map<string, Set<string>>();
    const pageCta = new Map<string, number>();
    cur.forEach((e) => {
      if (!e.page_path) return;
      if (e.event_name === "page_view" && e.session_id) {
        if (!pageSess.has(e.page_path)) pageSess.set(e.page_path, new Set());
        pageSess.get(e.page_path)!.add(e.session_id);
      }
      if (isCta(e)) pageCta.set(e.page_path, (pageCta.get(e.page_path) || 0) + 1);
    });
    const pages = [...pageSess.entries()].map(([p, v]) => ({ path: p, visitors: v.size, cta: pageCta.get(p) || 0 }))
      .sort((a, b) => b.visitors - a.visitors);
    const clubs = pages.filter((p) => p.path.startsWith("/voor/"));

    // sources: first-touch utm_source or referrer host per session
    const srcBySession = new Map<string, string>();
    cur.forEach((e) => {
      if (!e.session_id || srcBySession.has(e.session_id)) return;
      const utm = e.metadata?.utm ?? {};
      let src = utm.utm_source as string | undefined;
      if (!src && utm.referrer) { try { src = new URL(utm.referrer).hostname.replace(/^www\./, ""); } catch { /* */ } }
      if (src && src.includes("b2bgroeimachine")) src = undefined;
      srcBySession.set(e.session_id, src || "direct");
    });
    const srcMap = new Map<string, number>();
    srcBySession.forEach((v) => srcMap.set(v, (srcMap.get(v) || 0) + 1));
    const sources = [...srcMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([label, value]) => ({ label, value }));

    const ctaMap = new Map<string, number>();
    cur.filter(isCta).forEach((e) => e.event_label && ctaMap.set(e.event_label, (ctaMap.get(e.event_label) || 0) + 1));
    const ctas = [...ctaMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([label, value]) => ({ label, value }));

    return { s, cta, ld, conv, daily, pages, clubs, sources, ctas, curLeads, funnel, botHits };
  }, [events, leads]);

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-primary" /> Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Laatste 30 dagen. Bezoek, leads, vindbaarheid en clubpagina's.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAll} disabled={loading} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Vernieuwen
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            <Kpi icon={Users} label="Echte bezoekers" value={nf(m.s.cur)} cur={m.s.cur} prev={m.s.prev} hint={`${nf(m.botHits)} bot-hits weggefilterd`} />
            <Kpi icon={Inbox} label="Leads" value={nf(m.ld.cur)} cur={m.ld.cur} prev={m.ld.prev} />
            <Kpi icon={Percent} label="Conversie" value={`${m.conv.cur.toFixed(1)}%`} cur={m.conv.cur} prev={m.conv.prev} hint="bezoekers → lead" />
            <Kpi icon={MousePointerClick} label="CTA-klikken" value={nf(m.cta.cur)} cur={m.cta.cur} prev={m.cta.prev} />
            <Kpi icon={Search} label="Google-klikken" value={gsc ? nf(gsc.totals.clicks) : "–"} hint={gsc ? `${nf(gsc.totals.impressions)} vertoningen` : "Search Console niet bereikbaar"} />
            <Kpi icon={TrendingUp} label="Google CTR" value={gsc ? `${(gsc.totals.ctr * (gsc.totals.ctr < 1 ? 100 : 1)).toFixed(1)}%` : "–"} hint="klikken / vertoningen" />
          </div>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2"><CardTitle className="text-base">Bezoekers en leads per dag</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={{ bezoekers: { label: "Bezoekers", color: "hsl(var(--primary))" }, leads: { label: "Leads", color: "hsl(var(--foreground))" } }} className="h-[260px] w-full">
                <ComposedChart data={m.daily}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} interval={3} />
                  <YAxis yAxisId="l" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis yAxisId="r" orientation="right" allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar yAxisId="r" dataKey="leads" fill="hsl(var(--foreground) / 0.6)" radius={[3, 3, 0, 0]} />
                  <Line yAxisId="l" type="monotone" dataKey="bezoekers" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="bg-card border-border lg:col-span-2">
              <CardHeader className="pb-2 flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><Inbox className="w-4 h-4 text-primary" /> Nieuwe leads</CardTitle>
                <Link to="/admin/leads" className="text-xs text-primary inline-flex items-center gap-1">Alle leads <ArrowRight className="w-3 h-3" /></Link>
              </CardHeader>
              <CardContent>
                {m.curLeads.length === 0 ? <p className="text-sm text-muted-foreground">Nog geen leads deze periode.</p> : (
                  <div className="divide-y divide-border">
                    {m.curLeads.slice(0, 8).map((l, i) => (
                      <div key={i} className="py-2 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{l.name || l.email}{l.company && <span className="text-muted-foreground font-normal"> · {l.company}</span>}</p>
                          <p className="text-xs text-muted-foreground">{format(new Date(l.created_at), "d MMM HH:mm", { locale: nl })}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px] shrink-0">{l.kind}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-2"><CardTitle className="text-base">Van klik tot afspraak</CardTitle></CardHeader>
              <CardContent><RankList rows={m.funnel} empty="" /></CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2"><CardTitle className="text-base">Waar komen bezoekers vandaan?</CardTitle></CardHeader>
              <CardContent>
                <RankList rows={m.sources} empty="Geen bronnen bekend." />
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-2"><CardTitle className="text-base">Best bezochte pagina's</CardTitle></CardHeader>
              <CardContent><RankList rows={m.pages.slice(0, 8).map((p) => ({ label: p.path, value: p.visitors, sub: p.cta ? `· ${p.cta} klik` : undefined }))} empty="Geen data." /></CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Trophy className="w-4 h-4 text-primary" /> Clubpagina's</CardTitle></CardHeader>
              <CardContent><RankList rows={m.clubs.map((p) => ({ label: p.path.replace("/voor/", ""), value: p.visitors, sub: p.cta ? `· ${p.cta} klik` : undefined }))} empty="Nog geen bezoek op de clubpagina's." /></CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><MousePointerClick className="w-4 h-4 text-primary" /> Meest geklikte knoppen</CardTitle></CardHeader>
              <CardContent><RankList rows={m.ctas} empty="Nog geen klikken." /></CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><Search className="w-4 h-4 text-primary" /> Gevonden in Google op</CardTitle>
                <Link to="/admin/seo" className="text-xs text-primary inline-flex items-center gap-1">SEO <ArrowRight className="w-3 h-3" /></Link>
              </CardHeader>
              <CardContent>
                {!gsc?.top_queries?.length ? <p className="text-sm text-muted-foreground">Geen zoekdata beschikbaar.</p> : (
                  <table className="w-full text-sm">
                    <thead><tr className="text-[11px] uppercase text-muted-foreground text-left"><th className="pb-2 font-medium">Zoekterm</th><th className="pb-2 font-medium text-right">Klikken</th><th className="pb-2 font-medium text-right">Vertoningen</th><th className="pb-2 font-medium text-right">Positie</th></tr></thead>
                    <tbody className="divide-y divide-border">
                      {gsc.top_queries.slice(0, 10).map((q: any) => (
                        <tr key={q.query}><td className="py-1.5 pr-2 truncate max-w-[220px] text-foreground">{q.query}</td><td className="text-right">{nf(q.clicks)}</td><td className="text-right text-muted-foreground">{nf(q.impressions)}</td><td className="text-right text-muted-foreground">{Number(q.position).toFixed(1)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
            <IpFilters />
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
