import { usePortal } from "./PortalContext";
import { supabase, useOrgQuery } from "./lib";
import { PageHeader } from "./PageHeader";

async function load(orgId: string) {
  const [accs, camps, ready, meetings, won] = await Promise.all([
    supabase.from("gp_accounts").select("id, warmth", { count: "exact" }).eq("organization_id", orgId),
    supabase.from("gp_campaigns").select("accounts_count, positive_replies, sales_ready, meetings, channels").eq("organization_id", orgId),
    supabase.from("gp_accounts").select("id", { count: "exact", head: true }).eq("organization_id", orgId).eq("warmth", "sales_ready"),
    supabase.from("gp_sales_actions").select("id", { count: "exact", head: true }).eq("organization_id", orgId).in("status", ["meeting_planned", "opportunity", "won"]),
    supabase.from("gp_sales_actions").select("id", { count: "exact", head: true }).eq("organization_id", orgId).eq("status", "won"),
  ]);
  const c = (camps.data ?? []) as any[];
  return {
    accountsTotal: accs.count ?? 0,
    engaged: ((accs.data ?? []) as any[]).filter((a) => ["engaged","warm","sales_ready"].includes(a.warmth)).length,
    positiveReplies: c.reduce((s, r) => s + (r.positive_replies ?? 0), 0),
    salesReady: ready.count ?? 0,
    meetings: meetings.count ?? 0,
    campaignsLive: c.length,
    won: won.count ?? 0,
  };
}

function Block({ title, blocks }: { title: string; blocks: { label: string; value: string | number; sub?: string }[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-xs uppercase tracking-[0.2em] text-primary font-display font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {blocks.map((b) => (
          <div key={b.label}>
            <p className="font-display font-bold text-2xl text-foreground">{b.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{b.label}</p>
            {b.sub && <p className="text-[10px] text-muted-foreground/70">{b.sub}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Results() {
  const { currentOrgId } = usePortal();
  const { data, loading } = useOrgQuery(currentOrgId, load);
  if (loading || !data) return <p className="text-muted-foreground">Laden…</p>;

  return (
    <div>
      <PageHeader eyebrow="Resultaten" title="Commerciële impact" subtitle="Marktdekking, engagement, sales-activatie en commerciële impact op één plek." />
      <div className="grid md:grid-cols-2 gap-4">
        <Block title="Marktdekking" blocks={[
          { label: "Actieve accounts", value: data.accountsTotal.toLocaleString("nl-NL") },
          { label: "Live campagnes", value: data.campaignsLive },
        ]} />
        <Block title="Engagement" blocks={[
          { label: "Betrokken accounts", value: data.engaged },
          { label: "Positieve reacties", value: data.positiveReplies },
        ]} />
        <Block title="Sales-activatie" blocks={[
          { label: "Sales-ready contacten", value: data.salesReady },
          { label: "Afspraken en opportunities", value: data.meetings },
        ]} />
        <Block title="Commerciële impact" blocks={[
          { label: "Gewonnen deals", value: data.won },
          { label: "Ratio", value: `${Math.round((data.salesReady / Math.max(1, data.accountsTotal)) * 100)}%`, sub: "Sales-ready / totaal" },
        ]} />
      </div>
    </div>
  );
}