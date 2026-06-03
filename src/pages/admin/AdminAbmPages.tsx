import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Trash2, Archive, RefreshCw, Plus } from "lucide-react";

interface AbmRow {
  id: string;
  slug: string;
  company_name: string;
  status: string;
  view_count: number;
  expires_at: string;
  created_at: string;
  updated_at: string;
  payload: any;
}

const sb = supabase as unknown as { from: (t: string) => any };

const AdminAbmPages = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<AbmRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AbmRow | null>(null);
  const [jsonText, setJsonText] = useState("");
  const [creating, setCreating] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newJson, setNewJson] = useState('{\n  "cta": "",\n  "services": [],\n  "recommendedVisualTitle": ""\n}');

  const load = async () => {
    setLoading(true);
    const { data } = await sb
      .from("abm_pages")
      .select("*")
      .order("updated_at", { ascending: false });
    setRows((data as AbmRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (row: AbmRow) => {
    if (!confirm(`Pagina voor ${row.company_name} verwijderen?`)) return;
    const { error } = await sb.from("abm_pages").delete().eq("id", row.id);
    if (error) return toast({ title: "Verwijderen mislukt", description: error.message, variant: "destructive" });
    toast({ title: "Verwijderd" });
    load();
  };

  const setStatus = async (row: AbmRow, status: string) => {
    const { error } = await sb.from("abm_pages").update({ status }).eq("id", row.id);
    if (error) return toast({ title: "Update mislukt", description: error.message, variant: "destructive" });
    load();
  };

  const extend = async (row: AbmRow, days = 90) => {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await sb.from("abm_pages").update({ expires_at: expires, status: "live" }).eq("id", row.id);
    if (error) return toast({ title: "Verlengen mislukt", description: error.message, variant: "destructive" });
    toast({ title: `Verlengd met ${days} dagen` });
    load();
  };

  const openEdit = (row: AbmRow) => {
    setEditing(row);
    setJsonText(JSON.stringify(row.payload, null, 2));
  };

  const savePayload = async () => {
    if (!editing) return;
    let parsed: any;
    try { parsed = JSON.parse(jsonText); } catch (e: any) {
      return toast({ title: "Ongeldige JSON", description: e.message, variant: "destructive" });
    }
    const { error } = await sb.from("abm_pages").update({ payload: parsed }).eq("id", editing.id);
    if (error) return toast({ title: "Opslaan mislukt", description: error.message, variant: "destructive" });
    toast({ title: "Opgeslagen" });
    setEditing(null);
    load();
  };

  const createPage = async () => {
    if (!newCompany || !newSlug) return toast({ title: "Bedrijfsnaam en slug verplicht", variant: "destructive" });
    let parsed: any;
    try { parsed = JSON.parse(newJson); } catch (e: any) {
      return toast({ title: "Ongeldige JSON", description: e.message, variant: "destructive" });
    }
    const slug = newSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const { error } = await sb.from("abm_pages").upsert({
      slug,
      company_name: newCompany,
      payload: parsed,
      status: "live",
      expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    }, { onConflict: "slug" });
    if (error) return toast({ title: "Aanmaken mislukt", description: error.message, variant: "destructive" });
    toast({ title: "Aangemaakt", description: `/voor/${slug}` });
    setCreating(false); setNewSlug(""); setNewCompany("");
    load();
  };

  return (
    <AdminLayout title="ABM pagina's" description="Klantspecifieke pagina's op /voor/:slug">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {rows.length} pagina{rows.length === 1 ? "" : "'s"} · gepubliceerd via ChatGPT/n8n of handmatig
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load}><RefreshCw className="h-4 w-4 mr-2" />Vernieuwen</Button>
          <Button size="sm" onClick={() => setCreating(true)}><Plus className="h-4 w-4 mr-2" />Nieuw</Button>
        </div>
      </div>

      {creating && (
        <div className="mb-6 p-5 rounded-xl border border-border bg-card">
          <h3 className="font-display text-lg mb-4">Nieuwe ABM pagina</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <Input placeholder="Bedrijfsnaam (bv. Coolmark)" value={newCompany} onChange={(e) => setNewCompany(e.target.value)} />
            <Input placeholder="Slug (bv. coolmark)" value={newSlug} onChange={(e) => setNewSlug(e.target.value)} />
          </div>
          <Textarea
            rows={10}
            className="font-mono text-xs"
            value={newJson}
            onChange={(e) => setNewJson(e.target.value)}
          />
          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={createPage}>Aanmaken</Button>
            <Button size="sm" variant="ghost" onClick={() => setCreating(false)}>Annuleer</Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Laden…</p>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => {
            const expired = new Date(row.expires_at) < new Date();
            return (
              <div key={row.id} className="p-4 rounded-xl border border-border bg-card flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{row.company_name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      row.status === "live" && !expired
                        ? "border-green-500/40 text-green-500"
                        : "border-border text-muted-foreground"
                    }`}>
                      {expired ? "verlopen" : row.status}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    /voor/{row.slug} · {row.view_count} views · verloopt {new Date(row.expires_at).toLocaleDateString("nl-NL")}
                  </div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <a href={`/voor/${row.slug}`} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />Open
                  </a>
                </Button>
                <Button size="sm" variant="ghost" onClick={() => openEdit(row)}>Bewerk JSON</Button>
                <Button size="sm" variant="ghost" onClick={() => extend(row, 90)}>+90d</Button>
                <Button size="sm" variant="ghost" onClick={() => setStatus(row, row.status === "archived" ? "live" : "archived")}>
                  <Archive className="h-3 w-3 mr-1" />{row.status === "archived" ? "Activeer" : "Archiveer"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => remove(row)}>
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            );
          })}
          {rows.length === 0 && (
            <p className="text-muted-foreground text-sm">Nog geen ABM pagina's. Publiceer er één via ChatGPT/n8n of klik op "Nieuw".</p>
          )}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
            <h3 className="font-display text-lg mb-1">Payload bewerken</h3>
            <p className="text-xs text-muted-foreground mb-4">{editing.company_name} · /voor/{editing.slug}</p>
            <Textarea
              rows={20}
              className="font-mono text-xs flex-1"
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
            />
            <div className="flex gap-2 mt-4 justify-end">
              <Button variant="ghost" onClick={() => setEditing(null)}>Annuleer</Button>
              <Button onClick={savePayload}>Opslaan</Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAbmPages;