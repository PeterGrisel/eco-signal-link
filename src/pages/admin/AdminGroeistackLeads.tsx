import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, Mail, RefreshCw, Trash2, Users } from "lucide-react";

interface LeadRow {
  id: string;
  name: string;
  email: string;
  source: string;
  note: string | null;
  created_at: string;
}

const sb = supabase as unknown as { from: (t: string) => any };

const AdminGroeistackLeads = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await sb
      .from("groeistack_leads")
      .select("id, name, email, source, note, created_at")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Fout bij laden", description: error.message, variant: "destructive" });
    } else {
      setRows((data ?? []) as LeadRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("Lead verwijderen?")) return;
    const { error } = await sb.from("groeistack_leads").delete().eq("id", id);
    if (error) {
      toast({ title: "Fout", description: error.message, variant: "destructive" });
    } else {
      setRows((r) => r.filter((x) => x.id !== id));
    }
  };

  const exportCsv = () => {
    const header = ["name", "email", "source", "note", "created_at"];
    const csv = [
      header.join(","),
      ...rows.map((r) =>
        header
          .map((k) => {
            const v = (r as any)[k] ?? "";
            const s = String(v).replace(/"/g, '""');
            return `"${s}"`;
          })
          .join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `groeistack-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Users className="w-4 h-4" /> Lead capture
            </div>
            <h1 className="font-display text-2xl font-bold">Groeistack leads</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Mensen die op de hoogte willen blijven van nieuwe tools.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Vernieuwen
            </Button>
            <Button variant="outline" size="sm" onClick={exportCsv} disabled={!rows.length}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="border border-border rounded-xl p-4 bg-card/40">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Totaal</div>
            <div className="font-display text-2xl font-bold">{rows.length}</div>
          </div>
          <div className="border border-border rounded-xl p-4 bg-card/40">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Laatste 7 dagen</div>
            <div className="font-display text-2xl font-bold">
              {
                rows.filter(
                  (r) => Date.now() - new Date(r.created_at).getTime() < 7 * 86400_000
                ).length
              }
            </div>
          </div>
        </div>

        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-card/60 text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">Naam</th>
                <th className="text-left px-4 py-3">E-mail</th>
                <th className="text-left px-4 py-3">Bron</th>
                <th className="text-left px-4 py-3">Aangemeld</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Laden…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    Nog geen aanmeldingen.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-t border-border hover:bg-card/30">
                    <td className="px-4 py-3 font-medium">{r.name}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`mailto:${r.email}`}
                        className="inline-flex items-center gap-1.5 text-primary hover:underline"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        {r.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{r.source}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(r.created_at).toLocaleString("nl-NL")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(r.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminGroeistackLeads;