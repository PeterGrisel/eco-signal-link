import { usePortal } from "./PortalContext";
import { supabase, useOrgQuery, statusColor } from "./lib";
import { PageHeader } from "./PageHeader";
import { Mail, Linkedin, Phone, Video } from "lucide-react";

const chIcon: Record<string, any> = { email: Mail, linkedin: Linkedin, phone: Phone, video: Video };

async function load(orgId: string) {
  const { data } = await supabase.from("gp_campaigns").select("*").eq("organization_id", orgId).order("created_at", { ascending: false });
  return (data ?? []) as any[];
}

export default function Campaigns() {
  const { currentOrgId } = usePortal();
  const { data, loading } = useOrgQuery(currentOrgId, load);
  if (loading) return <p className="text-muted-foreground">Laden…</p>;

  return (
    <div>
      <PageHeader eyebrow="Campagnes" title="Uw commerciële bewegingen" subtitle="Per campagne: doel, kanalen, betrokken accounts en learnings." />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {data?.map((c) => (
          <div key={c.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-display font-bold text-foreground">{c.name}</h3>
              <span className={`text-[10px] uppercase font-display border rounded px-1.5 py-0.5 ${statusColor(c.status)}`}>{c.status}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{c.goal}</p>
            <div className="flex items-center gap-2 mb-4">
              {(c.channels as string[]).map((ch) => {
                const Icon = chIcon[ch] ?? Mail;
                return <div key={ch} className="h-7 w-7 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center"><Icon className="h-3.5 w-3.5 text-primary" /></div>;
              })}
            </div>
            <div className="grid grid-cols-4 gap-2 text-center border-t border-border pt-3">
              <div><p className="font-display font-bold text-foreground">{c.accounts_count}</p><p className="text-[10px] uppercase text-muted-foreground">Accounts</p></div>
              <div><p className="font-display font-bold text-foreground">{c.positive_replies}</p><p className="text-[10px] uppercase text-muted-foreground">Replies</p></div>
              <div><p className="font-display font-bold text-primary">{c.sales_ready}</p><p className="text-[10px] uppercase text-muted-foreground">Ready</p></div>
              <div><p className="font-display font-bold text-primary">{c.meetings}</p><p className="text-[10px] uppercase text-muted-foreground">Meetings</p></div>
            </div>
            {c.learnings && <p className="text-xs text-muted-foreground mt-3 italic">"{c.learnings}"</p>}
          </div>
        ))}
      </div>
    </div>
  );
}