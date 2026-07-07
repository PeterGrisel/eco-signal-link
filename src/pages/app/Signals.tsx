import { useState } from "react";
import { usePortal } from "./PortalContext";
import { supabase, useOrgQuery, priorityColor, statusColor } from "./lib";
import { PageHeader } from "./PageHeader";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";

async function loadSignals(orgId: string) {
  const { data } = await supabase
    .from("gp_signals")
    .select("*, account:gp_accounts(name, domain)")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });
  return (data ?? []) as any[];
}

export default function Signals() {
  const { currentOrgId } = usePortal();
  const { data, loading, reload } = useOrgQuery(currentOrgId, loadSignals);
  const [selected, setSelected] = useState<any | null>(null);

  const convert = async (s: any) => {
    const { error } = await supabase.from("gp_sales_actions").insert({
      organization_id: s.organization_id,
      account_id: s.account_id,
      signal_id: s.id,
      action_type: s.recommended_action ?? "Volg signaal op",
      priority: s.priority,
      status: "new",
      notes: s.summary,
    });
    if (error) return toast.error(error.message);
    await supabase.from("gp_signals").update({ status: "converted" }).eq("id", s.id);
    toast.success("Salesactie aangemaakt");
    setSelected(null); reload();
  };

  return (
    <div>
      <PageHeader eyebrow="Signalen" title="Wat gebeurt er in uw markt?" subtitle="Een signaal is commerciële context. Geen losse datapunt. Zet relevante signalen om naar een concrete sales-actie." />
      {loading ? <p className="text-muted-foreground">Laden…</p> : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-[10px] uppercase tracking-wider text-muted-foreground font-display">
              <tr>
                <th className="text-left p-3">Account</th>
                <th className="text-left p-3">Type signaal</th>
                <th className="text-left p-3 hidden md:table-cell">Bron</th>
                <th className="text-left p-3">Prioriteit</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Actie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data?.map((s) => (
                <tr key={s.id} className="hover:bg-secondary/20 cursor-pointer" onClick={() => setSelected(s)}>
                  <td className="p-3 font-medium text-foreground">{s.account?.name ?? "—"}</td>
                  <td className="p-3">{s.signal_type}</td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground">{s.signal_source}</td>
                  <td className="p-3"><span className={`text-[10px] uppercase font-display border rounded px-1.5 py-0.5 ${priorityColor(s.priority)}`}>{s.priority}</span></td>
                  <td className="p-3"><span className={`text-[10px] uppercase font-display border rounded px-1.5 py-0.5 ${statusColor(s.status)}`}>{s.status}</span></td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setSelected(s); }}>Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="font-display">{selected.signal_type}</SheetTitle>
                <p className="text-sm text-muted-foreground">{selected.account?.name}</p>
              </SheetHeader>
              <div className="mt-6 space-y-5">
                <div><p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Waarom relevant</p><p className="text-sm text-foreground">{selected.summary}</p></div>
                <div><p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Aanbevolen actie</p><p className="text-sm text-foreground">{selected.recommended_action}</p></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Bron</p><p className="text-sm">{selected.signal_source}</p></div>
                  <div><p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Datum</p><p className="text-sm">{selected.signal_date}</p></div>
                  <div><p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Prioriteit</p><p className="text-sm">{selected.priority}</p></div>
                  <div><p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Status</p><p className="text-sm">{selected.status}</p></div>
                </div>
                <Button className="w-full" onClick={() => convert(selected)} disabled={selected.status === "converted"}>
                  {selected.status === "converted" ? "Al omgezet" : "Zet om naar sales-actie"}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}