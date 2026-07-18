import { useCallback, useEffect, useState } from "react";
import { usePortal } from "./PortalContext";
import { supabase, fmtEUR } from "./lib";
import { PageHeader } from "./PageHeader";
import { RefreshCw, Gauge } from "lucide-react";

// Telemetrie-dashboard (deel I4). De data komt kant-en-klaar uit de Edge
// Function portal-telemetry (zelfde compositie als de MCP-tool get_telemetry);
// dit component rekent niets zelf uit — de blokken volgen het DATA-contract:
// pipedrive, heyreach, apollo, planable, staroids, salescycle, winloss,
// herkomst, monthly.

type Telemetry = {
  data: Record<string, any | null>;
  snapshot_dates: Record<string, string | null>;
  stale: Record<string, boolean>;
  missing: Record<string, string>;
  generated_at: string;
};

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("nl-NL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "–";

function BlockCard({ title, blockKey, t, children, wide }: {
  title: string;
  blockKey: string;
  t: Telemetry;
  children: (data: any) => React.ReactNode;
  wide?: boolean;
}) {
  const data = t.data[blockKey];
  const stale = t.stale[blockKey];
  return (
    <div className={`rounded-xl border ${stale ? "border-yellow-500/40" : "border-border"} bg-card p-5 ${wide ? "md:col-span-2" : ""}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-xs uppercase tracking-[0.2em] text-primary font-display font-semibold">{title}</h3>
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          {stale && <RefreshCw className="h-3 w-3 text-yellow-500" aria-label="Verouderde snapshot" />}
          {fmtDate(t.snapshot_dates[blockKey])}
        </span>
      </div>
      {data == null ? (
        <p className="text-xs text-muted-foreground">{t.missing[blockKey] ?? "Nog geen data — wacht op de eerste telemetrie-sync."}</p>
      ) : (
        children(data)
      )}
    </div>
  );
}

function Kpis({ items }: { items: { label: string; value: React.ReactNode; sub?: string }[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((k) => (
        <div key={k.label}>
          <p className="font-display font-bold text-2xl text-foreground">{k.value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
          {k.sub && <p className="text-[10px] text-muted-foreground/70">{k.sub}</p>}
        </div>
      ))}
    </div>
  );
}

function Bar({ label, value, max, extra }: { label: string; value: number; max: number; extra?: string }) {
  const pctW = Math.max(3, Math.round((value / Math.max(1, max)) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground truncate">{label}</span>
        <span className="text-foreground font-semibold shrink-0">{value}{extra ? ` · ${extra}` : ""}</span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${pctW}%` }} />
      </div>
    </div>
  );
}

export default function Telemetry() {
  const { currentOrgId, isRebelForce } = usePortal();
  const [t, setT] = useState<Telemetry | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    if (!currentOrgId) return;
    setError(null);
    const { data, error: err } = await supabase.functions.invoke("portal-telemetry", {
      body: { tenantId: currentOrgId, refresh },
    });
    if (err) setError("Telemetrie laden mislukte.");
    else setT(data as Telemetry);
  }, [currentOrgId]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  if (loading || !t) return <div className="text-muted-foreground">Telemetrie laden…</div>;

  const hasAny = Object.values(t.data).some((v) => v !== null);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader
          eyebrow="Telemetrie"
          title="Pipeline & kanalen"
          subtitle="Dagelijkse snapshots uit Pipedrive, HeyReach, Apollo, Planable en Stairoids — berekend in de runtime, hier alleen weergegeven."
        />
        {isRebelForce && (
          <button
            onClick={async () => { setRefreshing(true); await load(true); setRefreshing(false); }}
            disabled={refreshing}
            className="flex items-center gap-2 text-sm font-semibold rounded-lg px-3 py-2 bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Verversen…" : "Verversen"}
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {!hasAny ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <Gauge className="h-8 w-8 text-primary mx-auto mb-3" />
          <p className="font-display font-semibold text-foreground">Nog geen telemetrie</p>
          <p className="text-sm text-muted-foreground mt-1">Na de eerste dagelijkse sync verschijnen hier de pipeline- en kanaalcijfers.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <BlockCard title="Pipedrive — pipeline" blockKey="pipedrive" t={t} wide>
            {(d) => (
              <div className="space-y-5">
                <Kpis items={[
                  { label: "Open", value: d.open?.count ?? 0, sub: fmtEUR(d.open?.value ?? 0) },
                  { label: "Gewonnen", value: d.won?.count ?? 0, sub: fmtEUR(d.won?.value ?? 0) },
                  { label: "Verloren", value: d.lost?.count ?? 0, sub: fmtEUR(d.lost?.value ?? 0) },
                  { label: "Win rate", value: `${d.winRateCount ?? 0}%`, sub: `op waarde ${d.winRateValue ?? 0}%` },
                ]} />
                {Array.isArray(d.stages) && d.stages.length > 0 && (
                  <div className="space-y-2">
                    {d.stages.map((s: any) => (
                      <Bar key={s.name} label={s.name} value={s.count} max={Math.max(...d.stages.map((x: any) => x.count))} extra={fmtEUR(s.value ?? 0)} />
                    ))}
                  </div>
                )}
                <div className="grid lg:grid-cols-2 gap-4">
                  {Array.isArray(d.topOpen) && d.topOpen.length > 0 && (
                    <div>
                      <p className="text-xs font-display font-semibold text-foreground mb-2">Grootste open deals</p>
                      <div className="divide-y divide-border/60">
                        {d.topOpen.map((deal: any, i: number) => (
                          <div key={i} className="py-1.5 flex justify-between gap-2 text-xs">
                            <span className="text-muted-foreground truncate">{deal.title}{deal.org ? ` · ${deal.org}` : ""}</span>
                            <span className="text-foreground font-semibold shrink-0">{fmtEUR(deal.value ?? 0)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {Array.isArray(d.recentWon) && d.recentWon.length > 0 && (
                    <div>
                      <p className="text-xs font-display font-semibold text-foreground mb-2">Recent gewonnen</p>
                      <div className="divide-y divide-border/60">
                        {d.recentWon.map((deal: any, i: number) => (
                          <div key={i} className="py-1.5 flex justify-between gap-2 text-xs">
                            <span className="text-muted-foreground truncate">{deal.title}</span>
                            <span className="text-emerald-500 font-semibold shrink-0">{fmtEUR(deal.value ?? 0)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </BlockCard>

          <BlockCard title="Salescycle" blockKey="salescycle" t={t}>
            {(d) => (
              <Kpis items={[
                { label: "Mediaan (dagen)", value: d.medianFunnel ?? 0 },
                { label: "Gemiddeld (dagen)", value: d.meanFunnel ?? 0 },
                { label: "Zelfde dag", value: `${d.sameDayPct ?? 0}%` },
                { label: "Deals in funnel", value: d.funnelDeals ?? 0 },
              ]} />
            )}
          </BlockCard>

          <BlockCard title="Win / loss" blockKey="winloss" t={t}>
            {(d) => (
              <div className="space-y-3">
                {(d.stages ?? []).map((s: any) => (
                  <div key={s.stage} className="flex justify-between text-xs">
                    <span className="text-muted-foreground truncate">{s.stage}</span>
                    <span className="shrink-0">
                      <span className="text-emerald-500 font-semibold">{s.wonC}× {fmtEUR(s.wonV ?? 0)}</span>
                      <span className="text-muted-foreground"> · </span>
                      <span className="text-red-500 font-semibold">{s.lostC}× {fmtEUR(s.lostV ?? 0)}</span>
                    </span>
                  </div>
                ))}
                {Array.isArray(d.lostReasons) && d.lostReasons.length > 0 && (
                  <div className="pt-2 border-t border-border/60">
                    <p className="text-xs font-display font-semibold text-foreground mb-1.5">Verliesredenen</p>
                    {d.lostReasons.slice(0, 5).map((r: any) => (
                      <div key={r.reason} className="flex justify-between text-xs py-0.5">
                        <span className="text-muted-foreground truncate">{r.reason}</span>
                        <span className="text-foreground font-semibold shrink-0">{r.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </BlockCard>

          <BlockCard title="Herkomst" blockKey="herkomst" t={t}>
            {(d) => (
              <div className="space-y-3">
                {(d.bronnen ?? []).map((b: any) => (
                  <div key={b.naam} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{b.naam}</span>
                    <span className="text-foreground font-semibold">{b.open} open · {b.won} gewonnen</span>
                  </div>
                ))}
                {Array.isArray(d.hot) && d.hot.length > 0 && (
                  <div className="pt-2 border-t border-border/60">
                    <p className="text-xs font-display font-semibold text-foreground mb-1.5">Hot</p>
                    {d.hot.map((h: any, i: number) => (
                      <div key={i} className="flex justify-between text-xs py-0.5">
                        <span className="text-muted-foreground truncate">{h.title}{h.org ? ` · ${h.org}` : ""}</span>
                        <span className="text-primary font-semibold shrink-0">{fmtEUR(h.value ?? 0)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </BlockCard>

          <BlockCard title="Nieuwe deals per maand" blockKey="monthly" t={t} wide>
            {(d) => (
              <div className="space-y-2">
                {(d as any[]).map((m) => (
                  <Bar key={m.month} label={m.month} value={m.total} max={Math.max(...(d as any[]).map((x) => x.total))} extra={`${m.netwerk} netwerk · ${m.outbound} outbound`} />
                ))}
              </div>
            )}
          </BlockCard>

          <BlockCard title="HeyReach — LinkedIn" blockKey="heyreach" t={t}>
            {(d) => (
              <Kpis items={[
                { label: "Connecties", value: d.connectionsSent ?? 0, sub: `${d.acceptRate ?? 0}% geaccepteerd` },
                { label: "Reply rate", value: `${d.replyRate ?? 0}%`, sub: `${d.messageReplies ?? 0} replies` },
                { label: "Geïnteresseerd", value: d.interested ?? 0, sub: `${d.interestedRate ?? 0}%` },
                { label: "Unieke leads", value: d.uniqueLeads ?? 0, sub: `sinds ${d.since ?? "–"}` },
              ]} />
            )}
          </BlockCard>

          <BlockCard title="Apollo — e-mail sequences" blockKey="apollo" t={t}>
            {(d) => (
              <Kpis items={[
                { label: "In sequence", value: d.contactsInSequence ?? 0 },
                { label: "Open rate", value: `${d.openRate ?? 0}%`, sub: `${d.opened ?? 0} van ${d.delivered ?? 0}` },
                { label: "Reply rate", value: `${d.replyRate ?? 0}%`, sub: `${d.replied ?? 0} replies` },
                { label: "Meetings", value: d.meetings ?? 0 },
              ]} />
            )}
          </BlockCard>

          <BlockCard title="Planable — content" blockKey="planable" t={t}>
            {(d) => (
              <Kpis items={[
                { label: "Posts", value: d.posts ?? 0, sub: `sinds ${d.since ?? "–"}` },
                { label: "Impressies", value: (d.impressions ?? 0).toLocaleString("nl-NL") },
                { label: "Engagement", value: d.engagement ?? 0, sub: `${d.engagementRate ?? 0}%` },
                { label: "Pagina's", value: Array.isArray(d.pages) ? d.pages.length : 0 },
              ]} />
            )}
          </BlockCard>

          <BlockCard title="Stairoids — signal scores" blockKey="staroids" t={t}>
            {(d) => (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">{d.scored ?? 0} accounts gescoord</p>
                {(d.top ?? []).map((row: any, i: number) => (
                  <div key={i} className="flex justify-between gap-2 text-xs">
                    <span className="text-muted-foreground truncate">
                      {row.company}
                      {row.segment ? ` · ${row.segment}` : ""}
                      {row.stage ? ` · ${row.stage}` : ""}
                    </span>
                    <span className="text-foreground font-semibold shrink-0">{row.score}</span>
                  </div>
                ))}
              </div>
            )}
          </BlockCard>
        </div>
      )}
    </div>
  );
}
