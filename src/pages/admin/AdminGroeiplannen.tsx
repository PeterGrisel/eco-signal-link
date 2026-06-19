import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, FileText, Mail, RefreshCw, Trash2, ClipboardList, Eye } from "lucide-react";

interface Row {
  id: string;
  email: string;
  company: string | null;
  name: string | null;
  mode: string;
  fields: Record<string, string>;
  source_url: string | null;
  created_at: string;
}

const CELLS: { id: string; num: string; title: string; phase: string }[] = [
  { id: "doelmarkt",      num: "01", title: "Mijn doelmarkt",         phase: "VOOR · Prospect" },
  { id: "boodschap",      num: "02", title: "Mijn boodschap",         phase: "VOOR · Prospect" },
  { id: "kanalen",        num: "03", title: "Mijn kanalen",           phase: "VOOR · Prospect" },
  { id: "vangmechanisme", num: "04", title: "Mijn vangmechanisme",    phase: "TIJDENS · Lead" },
  { id: "opwarm",         num: "05", title: "Mijn opwarmsysteem",     phase: "TIJDENS · Lead" },
  { id: "conversie",      num: "06", title: "Mijn conversiestrategie",phase: "TIJDENS · Lead" },
  { id: "ervaring",       num: "07", title: "Mijn klantervaring",     phase: "NA · Klant" },
  { id: "waarde",         num: "08", title: "Mijn klantwaarde",       phase: "NA · Klant" },
  { id: "referral",       num: "09", title: "Mijn referralmotor",     phase: "NA · Klant" },
];

const sb = supabase as unknown as { from: (t: string) => any };

const toMarkdown = (r: Row) => {
  const date = new Date(r.created_at).toLocaleString("nl-NL");
  const lines: string[] = [];
  lines.push(`# 1-Pagina Groeiplan — ${r.company || "Onbekend bedrijf"}`);
  lines.push("");
  lines.push(`- **Naam:** ${r.name || "—"}`);
  lines.push(`- **E-mail:** ${r.email}`);
  lines.push(`- **Modus:** ${r.mode}`);
  lines.push(`- **Datum:** ${date}`);
  if (r.source_url) lines.push(`- **Bron:** ${r.source_url}`);
  lines.push("");
  let lastPhase = "";
  for (const c of CELLS) {
    if (c.phase !== lastPhase) {
      lines.push(`## ${c.phase}`);
      lines.push("");
      lastPhase = c.phase;
    }
    const val = (r.fields?.[c.id] || "").trim() || "_(leeg)_";
    lines.push(`### ${c.num} — ${c.title}`);
    lines.push("");
    lines.push(val);
    lines.push("");
  }
  return lines.join("\n");
};

const download = (filename: string, content: string, mime = "text/markdown") => {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const AdminGroeiplannen = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<Row | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await sb
      .from("groeiplan_submissions")
      .select("id, email, company, name, mode, fields, source_url, created_at")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Fout bij laden", description: error.message, variant: "destructive" });
    } else {
      setRows((data ?? []) as Row[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Plan verwijderen?")) return;
    const { error } = await sb.from("groeiplan_submissions").delete().eq("id", id);
    if (error) {
      toast({ title: "Fout", description: error.message, variant: "destructive" });
    } else {
      setRows((r) => r.filter((x) => x.id !== id));
      if (preview?.id === id) setPreview(null);
    }
  };

  const downloadMd = (r: Row) => {
    const slug = (r.company || r.email || "groeiplan")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    download(`groeiplan-${slug}-${r.id.slice(0, 6)}.md`, toMarkdown(r));
  };

  const downloadAllMd = () => {
    const combined = rows.map(toMarkdown).join("\n\n---\n\n");
    download(`groeiplannen-${new Date().toISOString().slice(0, 10)}.md`, combined);
  };

  const exportCsv = () => {
    const header = ["created_at", "company", "name", "email", "mode", ...CELLS.map((c) => c.id)];
    const csv = [
      header.join(","),
      ...rows.map((r) =>
        header.map((k) => {
          let v: any = "";
          if (k in r) v = (r as any)[k] ?? "";
          else v = r.fields?.[k] ?? "";
          return `"${String(v).replace(/"/g, '""').replace(/\n/g, " ")}"`;
        }).join(",")
      ),
    ].join("\n");
    download(`groeiplannen-${new Date().toISOString().slice(0, 10)}.csv`, csv, "text/csv");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <ClipboardList className="w-4 h-4" /> Groeiplan submissions
            </div>
            <h1 className="font-display text-2xl font-bold">1-Pagina Groeiplannen</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Ingevulde groeiplannen via /groeiplan. Download los of in bulk als markdown.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Vernieuwen
            </Button>
            <Button variant="outline" size="sm" onClick={exportCsv} disabled={!rows.length}>
              <Download className="w-4 h-4 mr-2" /> CSV
            </Button>
            <Button size="sm" onClick={downloadAllMd} disabled={!rows.length}>
              <FileText className="w-4 h-4 mr-2" /> Alles als Markdown
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
              {rows.filter((r) => Date.now() - new Date(r.created_at).getTime() < 7 * 86400_000).length}
            </div>
          </div>
          <div className="border border-border rounded-xl p-4 bg-card/40">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Klantmodus</div>
            <div className="font-display text-2xl font-bold">
              {rows.filter((r) => r.mode === "klant").length}
            </div>
          </div>
          <div className="border border-border rounded-xl p-4 bg-card/40">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Bezoekers</div>
            <div className="font-display text-2xl font-bold">
              {rows.filter((r) => r.mode !== "klant").length}
            </div>
          </div>
        </div>

        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-card/60 text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">Bedrijf</th>
                <th className="text-left px-4 py-3">Naam</th>
                <th className="text-left px-4 py-3">E-mail</th>
                <th className="text-left px-4 py-3">Modus</th>
                <th className="text-left px-4 py-3">Ingevuld</th>
                <th className="text-left px-4 py-3">Aangemaakt</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Laden…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">Nog geen groeiplannen.</td></tr>
              ) : (
                rows.map((r) => {
                  const filled = CELLS.filter((c) => (r.fields?.[c.id] || "").trim()).length;
                  return (
                    <tr key={r.id} className="border-t border-border hover:bg-card/30">
                      <td className="px-4 py-3 font-medium">{r.company || "—"}</td>
                      <td className="px-4 py-3">{r.name || "—"}</td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1.5 text-primary hover:underline">
                          <Mail className="w-3.5 h-3.5" /> {r.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{r.mode}</td>
                      <td className="px-4 py-3 text-muted-foreground">{filled}/9</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(r.created_at).toLocaleString("nl-NL")}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <Button variant="ghost" size="icon" onClick={() => setPreview(r)} title="Bekijken">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => downloadMd(r)} title="Markdown downloaden">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive" title="Verwijderen">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {preview && (
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto"
            onClick={() => setPreview(null)}
          >
            <div
              className="bg-background border border-border rounded-xl max-w-3xl w-full my-12 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-display text-xl font-bold">
                    {preview.company || "Groeiplan"} — {preview.name || preview.email}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {new Date(preview.created_at).toLocaleString("nl-NL")} · {preview.mode}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => downloadMd(preview)}>
                    <Download className="w-4 h-4 mr-2" /> Markdown
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setPreview(null)}>Sluiten</Button>
                </div>
              </div>
              <pre className="text-xs bg-card/60 border border-border rounded-lg p-4 overflow-x-auto whitespace-pre-wrap font-mono">
{toMarkdown(preview)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminGroeiplannen;