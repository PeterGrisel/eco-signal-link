import { useState } from "react";
import { usePortal } from "./PortalContext";
import { supabase, useOrgQuery, priorityColor, statusColor } from "./lib";
import { PageHeader } from "./PageHeader";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const STATUSES = ["new", "assigned", "in_progress", "contacted", "meeting_planned", "opportunity", "nurture", "not_relevant", "won", "lost"];
const OUTCOMES = ["Afspraak ingepland", "Interessant, later opvolgen", "Geen timing", "Geen match", "Geen reactie", "Opportunity aangemaakt"];

async function load(orgId: string) {
  const { data } = await supabase.from("gp_sales_actions").select("*, account:gp_accounts(name), contact:gp_contacts(full_name)").eq("organization_id", orgId).order("due_date", { ascending: true, nullsFirst: false });
  return (data ?? []) as any[];
}

export default function SalesActions() {
  const { currentOrgId } = usePortal();
  const { data, loading, reload } = useOrgQuery(currentOrgId, load);
  const [sel, setSel] = useState<any | null>(null);
  const [notes, setNotes] = useState("");

  const update = async (patch: any) => {
    if (!sel) return;
    const { error } = await supabase.from("gp_sales_actions").update(patch).eq("id", sel.id);
    if (error) return toast.error(error.message);
    toast.success("Bijgewerkt"); reload();
    setSel({ ...sel, ...patch });
  };

  return (
    <div>
      <PageHeader eyebrow="Sales acties" title="Prioriteit voor uw team" subtitle="Concrete opvolgacties per account met eigenaar, prioriteit en deadline." />
      {loading ? <p className="text-muted-foreground">Laden…</p> : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-[10px] uppercase tracking-wider text-muted-foreground font-display">
              <tr>
                <th className="text-left p-3">Account</th>
                <th className="text-left p-3">Actie</th>
                <th className="text-left p-3 hidden md:table-cell">Deadline</th>
                <th className="text-left p-3">Prioriteit</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data?.map((a) => (
                <tr key={a.id} className="hover:bg-secondary/20 cursor-pointer" onClick={() => { setSel(a); setNotes(a.notes ?? ""); }}>
                  <td className="p-3 font-medium text-foreground">{a.account?.name}</td>
                  <td className="p-3">{a.action_type}</td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground">{a.due_date ?? "—"}</td>
                  <td className="p-3"><span className={`text-[10px] uppercase font-display border rounded px-1.5 py-0.5 ${priorityColor(a.priority)}`}>{a.priority}</span></td>
                  <td className="p-3"><span className={`text-[10px] uppercase font-display border rounded px-1.5 py-0.5 ${statusColor(a.status)}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {sel && (
            <>
              <SheetHeader><SheetTitle className="font-display">{sel.action_type}</SheetTitle><p className="text-sm text-muted-foreground">{sel.account?.name}</p></SheetHeader>
              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Status</p>
                  <Select value={sel.status} onValueChange={(v) => update({ status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Uitkomst</p>
                  <Select value={sel.outcome ?? ""} onValueChange={(v) => update({ outcome: v })}>
                    <SelectTrigger><SelectValue placeholder="Kies uitkomst" /></SelectTrigger>
                    <SelectContent>{OUTCOMES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Notities</p>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
                  <Button className="mt-2" size="sm" onClick={() => update({ notes })}>Opslaan</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}