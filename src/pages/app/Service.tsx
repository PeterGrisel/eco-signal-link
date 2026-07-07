import { useState } from "react";
import { usePortal } from "./PortalContext";
import { supabase, useOrgQuery, statusColor } from "./lib";
import { PageHeader } from "./PageHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const TYPES = ["Nieuwe markt", "Nieuwe ICP", "Nieuwe campagne", "LinkedIn activatie", "AI telefonie", "CRM-integratie", "Positionering wijzigen", "Supportvraag"];

async function load(orgId: string) {
  const { data } = await supabase.from("gp_service_requests").select("*").eq("organization_id", orgId).order("created_at", { ascending: false });
  return (data ?? []) as any[];
}

export default function Service() {
  const { currentOrgId, session } = usePortal();
  const { data, loading, reload } = useOrgQuery(currentOrgId, load);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ request_type: TYPES[0], title: "", description: "", priority: "medium" });

  const submit = async () => {
    if (!currentOrgId) return;
    const { error } = await supabase.from("gp_service_requests").insert({
      organization_id: currentOrgId,
      requester_id: session?.user.id,
      ...form,
    });
    if (error) return toast.error(error.message);
    toast.success("Aanvraag verstuurd");
    setOpen(false); setForm({ request_type: TYPES[0], title: "", description: "", priority: "medium" }); reload();
  };

  return (
    <div>
      <PageHeader
        eyebrow="Service"
        title="Aanvragen aan Rebel Force"
        subtitle="Nieuwe markt, extra ICP, campagne starten of vraag stellen. Wij pakken het op."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button>Nieuwe aanvraag</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nieuwe service-aanvraag</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <div><Label>Type</Label><Select value={form.request_type} onValueChange={(v) => setForm({ ...form, request_type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Titel</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div><Label>Toelichting</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} /></div>
                <div><Label>Prioriteit</Label><Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Laag</SelectItem><SelectItem value="medium">Middel</SelectItem><SelectItem value="high">Hoog</SelectItem></SelectContent></Select></div>
                <Button onClick={submit} className="w-full">Versturen</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      {loading ? <p className="text-muted-foreground">Laden…</p> : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-[10px] uppercase tracking-wider text-muted-foreground font-display">
              <tr><th className="text-left p-3">Type</th><th className="text-left p-3">Titel</th><th className="text-left p-3 hidden md:table-cell">Prioriteit</th><th className="text-left p-3">Status</th><th className="text-left p-3 hidden md:table-cell">Datum</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data?.map((r) => (
                <tr key={r.id}>
                  <td className="p-3">{r.request_type}</td>
                  <td className="p-3 font-medium text-foreground">{r.title}</td>
                  <td className="p-3 hidden md:table-cell">{r.priority}</td>
                  <td className="p-3"><span className={`text-[10px] uppercase font-display border rounded px-1.5 py-0.5 ${statusColor(r.status)}`}>{r.status}</span></td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground">{new Date(r.created_at).toLocaleDateString("nl-NL")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}