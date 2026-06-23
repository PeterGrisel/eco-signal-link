import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, Inbox, Mail, RefreshCw, Trash2 } from "lucide-react";

const sb = supabase as unknown as { from: (t: string) => any };

type UnifiedLead = {
  id: string;
  source_table: "contact_submissions" | "groeistack_leads" | "groeiplan_submissions";
  source: string;
  name: string | null;
  email: string | null;
  company: string | null;
  phone: string | null;
  message: string | null;
  extra: string | null;
  created_at: string;
};

const SOURCES = ["alle", "contact_submissions", "groeistack_leads", "groeiplan_submissions"] as const;
const LABELS: Record<string, string> = {
  contact_submissions: "Contact / HHW",
  groeistack_leads: "Groeistack",
  groeiplan_submissions: "Groeiplan",
};

const AdminLeads = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<UnifiedLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof SOURCES)[number]>("alle");
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    const [cs, gs, gp] = await Promise.all([
      sb.from("contact_submissions").select("*").order("created_at", { ascending: false }),
      sb.from("groeistack_leads").select("*").order("created_at", { ascending: false }),
      sb.from("groeiplan_submissions").select("*").order("created_at", { ascending: false }),
    ]);

    const errors = [cs.error, gs.error, gp.error].filter(Boolean) as { message: string }[];
    if (errors.length) {
      toast({
        title: "Niet alles kon geladen worden",
        description: errors.map((e) => e.message).join(" • "),
        variant: "destructive",
      });
    }

    const all: UnifiedLead[] = [
      ...((cs.data ?? []) as any[]).map((r) => {
        const pkg = r.selected_package
          ? typeof r.selected_package === "string"
            ? r.selected_package
            : (r.selected_package?.title || r.selected_package?.name || JSON.stringify(r.selected_package))
          : null;
        return {
          id: r.id,
          source_table: "contact_submissions" as const,
          source: pkg ? `Pakket: ${pkg}` : "Contact",
          name: r.name,
          email: r.email,
          company: r.company,
          phone: r.phone,
          message: r.message,
          extra: pkg,
          created_at: r.created_at,
        };
      }),
      ...((gs.data ?? []) as any[]).map((r) => ({
        id: r.id,
        source_table: "groeistack_leads" as const,
        source: r.source || "Groeistack",
        name: r.name,
        email: r.email,
        company: null,
        phone: null,
        message: r.note,
        extra: null,
        created_at: r.created_at,
      })),
      ...((gp.data ?? []) as any[]).map((r) => ({
        id: r.id,
        source_table: "groeiplan_submissions" as const,
        source: r.mode ? `Groeiplan (${r.mode})` : "Groeiplan",
        name: r.name,
        email: r.email,
        company: r.company,
        phone: null,
        message: r.fields ? JSON.stringify(r.fields) : null,
        extra: r.source_url,
        created_at: r.created_at,
      })),
    ];

    all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setRows(all);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filter !== "alle" && r.source_table !== filter) return false;
      if (!q) return true;
      const hay = `${r.name ?? ""} ${r.email ?? ""} ${r.company ?? ""} ${r.source} ${r.message ?? ""}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [rows, filter, q]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { alle: rows.length };
    for (const t of SOURCES) if (t !== "alle") c[t] = rows.filter((r) => r.source_table === t).length;
    return c;
  }, [rows]);

  const remove = async (r: UnifiedLead) => {
    if (!confirm("Lead verwijderen?")) return;
    const { error } = await sb.from(r.source_table).delete().eq("id", r.id);
    if (error) toast({ title: "Fout", description: error.message, variant: "destructive" });
    else setRows((rs) => rs.filter((x) => x.id !== r.id));
  };

  const exportCsv = () => {
    const header = ["created_at", "source_table", "source", "name", "email", "company", "phone", "message", "extra"];
    const csv = [
      header.join(","),
      ...filtered.map((r) =>
        header
          .map((k) => `"${String((r as any)[k] ?? "").replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const last7 = rows.filter((r) => Date.now() - new Date(r.created_at).getTime() < 7 * 86400_000).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Inbox className="w-4 h-4" /> Lead overzicht
            </div>
            <h1 className="font-display text-2xl font-bold">Leads &amp; form captures</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Alle binnenkomende leads uit alle formulieren op één plek.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Vernieuwen
            </Button>
            <Button variant="outline" size="sm" onClick={exportCsv} disabled={!filtered.length}>
              <Download className="w-4 h-4 mr-2" /> CSV
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
            <div className="font-display text-2xl font-bold">{last7}</div>
          </div>
          <div className="border border-border rounded-xl p-4 bg-card/40">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Contact / HHW</div>
            <div className="font-display text-2xl font-bold">{counts.contact_submissions ?? 0}</div>
          </div>
          <div className="border border-border rounded-xl p-4 bg-card/40">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Groeistack + Plan</div>
            <div className="font-display text-2xl font-bold">
              {(counts.groeistack_leads ?? 0) + (counts.groeiplan_submissions ?? 0)}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {SOURCES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                filter === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card/40 border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "alle" ? "Alle" : LABELS[s] ?? s} ({counts[s] ?? 0})
            </button>
          ))}
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Zoek op naam, e-mail, bedrijf…"
            className="ml-auto bg-card/40 border border-border rounded-lg px-3 py-1.5 text-sm w-full md:w-72"
          />
        </div>

        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-card/60 text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">Wanneer</th>
                <th className="text-left px-4 py-3">Naam</th>
                <th className="text-left px-4 py-3">E-mail</th>
                <th className="text-left px-4 py-3">Bedrijf</th>
                <th className="text-left px-4 py-3">Bron</th>
                <th className="text-left px-4 py-3">Bericht</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Laden…</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">Geen leads gevonden.</td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={`${r.source_table}-${r.id}`} className="border-t border-border hover:bg-card/30 align-top">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(r.created_at).toLocaleString("nl-NL")}
                    </td>
                    <td className="px-4 py-3 font-medium">{r.name || "—"}</td>
                    <td className="px-4 py-3">
                      {r.email ? (
                        <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1.5 text-primary hover:underline">
                          <Mail className="w-3.5 h-3.5" />
                          {r.email}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{r.company || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 mr-2">
                        {LABELS[r.source_table]}
                      </span>
                      <span className="text-muted-foreground text-xs">{r.source}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-xs">
                      <div className="line-clamp-3 whitespace-pre-wrap break-words">{r.message || "—"}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(r)}
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

export default AdminLeads;