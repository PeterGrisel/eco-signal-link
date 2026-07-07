import { usePortal } from "./PortalContext";
import { supabase, useOrgQuery, fmtEUR, priorityColor } from "./lib";
import { PageHeader } from "./PageHeader";
import { Activity, TrendingUp, Users, Radio, Target, Briefcase, Sparkles } from "lucide-react";

type Stats = {
  markets: number;
  accounts: number;
  signalsThisMonth: number;
  salesReady: number;
  openActions: number;
  pipelineValue: number;
  warmAccounts: number;
  topSignals: any[];
  topActions: any[];
  funnel: { active: number; engaged: number; warm: number; ready: number; opportunities: number };
};

async function loadStats(orgId: string): Promise<Stats> {
  const monthStart = new Date();
  monthStart.setDate(1); monthStart.setHours(0,0,0,0);

  const [mkts, accs, sigs, ready, actions, topSigs, topActs] = await Promise.all([
    supabase.from("gp_markets").select("id", { count: "exact", head: true }).eq("organization_id", orgId),
    supabase.from("gp_accounts").select("id, warmth", { count: "exact" }).eq("organization_id", orgId),
    supabase.from("gp_signals").select("id", { count: "exact", head: true }).eq("organization_id", orgId).gte("created_at", monthStart.toISOString()),
    supabase.from("gp_accounts").select("id", { count: "exact", head: true }).eq("organization_id", orgId).eq("warmth", "sales_ready"),
    supabase.from("gp_sales_actions").select("id", { count: "exact", head: true }).eq("organization_id", orgId).not("status", "in", "(won,lost,not_relevant)"),
    supabase.from("gp_signals").select("id, signal_type, summary, recommended_action, priority, account:gp_accounts(name)").eq("organization_id", orgId).order("created_at", { ascending: false }).limit(5),
    supabase.from("gp_sales_actions").select("id, action_type, priority, due_date, status, account:gp_accounts(name)").eq("organization_id", orgId).not("status", "in", "(won,lost,not_relevant)").order("due_date", { ascending: true, nullsFirst: false }).limit(5),
  ]);

  const accountsData = (accs.data ?? []) as any[];
  const active = accountsData.length;
  const engaged = accountsData.filter((a) => ["engaged", "warm", "sales_ready"].includes(a.warmth)).length;
  const warm = accountsData.filter((a) => ["warm", "sales_ready"].includes(a.warmth)).length;
  const readyCount = accountsData.filter((a) => a.warmth === "sales_ready").length;

  return {
    markets: mkts.count ?? 0,
    accounts: active,
    signalsThisMonth: sigs.count ?? 0,
    salesReady: ready.count ?? 0,
    openActions: actions.count ?? 0,
    pipelineValue: readyCount * 23000 + warm * 4000,
    warmAccounts: warm,
    topSignals: (topSigs.data as any[]) ?? [],
    topActions: (topActs.data as any[]) ?? [],
    funnel: { active, engaged, warm, ready: readyCount, opportunities: Math.max(1, Math.round(readyCount * 0.4)) },
  };
}

function KpiCard({ icon: Icon, label, value, sub }: any) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" />
        <span className="text-[10px] uppercase tracking-wider font-display font-semibold">{label}</span>
      </div>
      <p className="font-display font-bold text-3xl text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { currentOrgId, memberships } = usePortal();
  const org = memberships.find((m) => m.organization_id === currentOrgId)?.organization;
  const { data, loading } = useOrgQuery(currentOrgId, loadStats);

  if (loading || !data) return <div className="text-muted-foreground">Groeimachine laden…</div>;

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Mijn Groeimachine" title={`Welkom, ${org?.name ?? ""}`} subtitle="Uw commerciële groeimachine draait. Wij signaleren relevante accounts, activeren de juiste contacten en leveren concrete opvolgacties terug aan uw team." />

      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-primary font-display font-semibold mb-1">Status</p>
            <h2 className="font-display text-xl font-bold text-foreground">Uw groeimachine is actief</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              Deze week zijn <span className="text-foreground font-semibold">{data.warmAccounts}</span> accounts warmer geworden. Uw team heeft <span className="text-foreground font-semibold">{data.openActions}</span> openstaande sales-acties. <span className="text-foreground font-semibold">{data.salesReady}</span> contacten zijn sales-ready en vragen directe opvolging.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard icon={TrendingUp} label="Actieve markten" value={data.markets} />
        <KpiCard icon={Users} label="Relevante accounts" value={data.accounts.toLocaleString("nl-NL")} />
        <KpiCard icon={Radio} label="Nieuwe signalen" value={data.signalsThisMonth} sub="Deze maand" />
        <KpiCard icon={Sparkles} label="Sales-ready" value={data.salesReady} sub="Contacten" />
        <KpiCard icon={Target} label="Openstaand" value={data.openActions} sub="Sales acties" />
        <KpiCard icon={Briefcase} label="Pipeline" value={fmtEUR(data.pipelineValue)} sub="Geraamd" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <h3 className="font-display font-bold text-foreground mb-4">Prioriteit voor uw team</h3>
          <div className="divide-y divide-border">
            {data.topActions.length === 0 && <p className="text-sm text-muted-foreground">Geen openstaande sales-acties.</p>}
            {data.topActions.map((a) => (
              <div key={a.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{a.action_type}</p>
                  <p className="text-xs text-muted-foreground truncate">{a.account?.name} · {a.due_date ?? "geen deadline"}</p>
                </div>
                <span className={`text-[10px] uppercase font-display font-semibold border rounded px-2 py-1 ${priorityColor(a.priority)}`}>{a.priority}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-display font-bold text-foreground mb-4">Groei in beweging</h3>
          <div className="space-y-3">
            {[
              { label: "Actieve accounts", value: data.funnel.active },
              { label: "Betrokken", value: data.funnel.engaged },
              { label: "Warm", value: data.funnel.warm },
              { label: "Sales-ready", value: data.funnel.ready },
              { label: "Opportunities", value: data.funnel.opportunities },
            ].map((row) => {
              const pct = Math.max(4, Math.round((row.value / Math.max(1, data.funnel.active)) * 100));
              return (
                <div key={row.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="text-foreground font-semibold">{row.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-display font-bold text-foreground mb-4">Top signalen</h3>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.topSignals.map((s) => (
            <div key={s.id} className="rounded-lg border border-border p-4 bg-background/50">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm font-display font-semibold text-foreground">{s.signal_type}</p>
                <span className={`text-[10px] uppercase font-display border rounded px-1.5 py-0.5 ${priorityColor(s.priority)}`}>{s.priority}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{s.account?.name}</p>
              <p className="text-xs text-foreground/80 mb-2">{s.summary}</p>
              <p className="text-xs text-primary">→ {s.recommended_action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}