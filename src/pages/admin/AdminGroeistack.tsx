import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { groeistackCategories } from "@/data/groeistack";
import { Boxes, Plus, Trash2, RefreshCw, Save } from "lucide-react";

interface ToolRow {
  id?: string;
  name: string;
  category: string;
  description: string;
  website: string;
  sort_order: number;
  published: boolean;
  link_status?: string | null;
}

const empty: ToolRow = {
  name: "",
  category: groeistackCategories[0].key,
  description: "",
  website: "",
  sort_order: 0,
  published: true,
};

// groeistack_tools staat (nog) niet in de gegenereerde types
const sb = supabase as unknown as { from: (t: string) => any };

const inputCls =
  "w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50";

const AdminGroeistack = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<ToolRow[]>([]);
  const [draft, setDraft] = useState<ToolRow>(empty);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await sb
      .from("groeistack_tools")
      .select("*")
      .order("category")
      .order("sort_order");
    if (error) toast({ title: "Fout bij laden", description: error.message, variant: "destructive" });
    setRows((data as ToolRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const addTool = async () => {
    if (!draft.name || !draft.website) {
      toast({ title: "Naam en website verplicht", variant: "destructive" });
      return;
    }
    const { error } = await sb.from("groeistack_tools").insert(draft);
    if (error) return toast({ title: "Fout", description: error.message, variant: "destructive" });
    setDraft(empty);
    toast({ title: "Tool toegevoegd" });
    load();
  };

  const saveRow = async (row: ToolRow) => {
    const { id, link_status, ...patch } = row;
    const { error } = await sb.from("groeistack_tools").update(patch).eq("id", id);
    if (error) return toast({ title: "Fout", description: error.message, variant: "destructive" });
    toast({ title: "Opgeslagen" });
  };

  const deleteRow = async (id?: string) => {
    if (!id) return;
    const { error } = await sb.from("groeistack_tools").delete().eq("id", id);
    if (error) return toast({ title: "Fout", description: error.message, variant: "destructive" });
    setRows((r) => r.filter((x) => x.id !== id));
  };

  const patchRow = (id: string | undefined, patch: Partial<ToolRow>) =>
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const refreshNow = async () => {
    setRefreshing(true);
    const { error } = await supabase.functions.invoke("groeistack-refresh");
    setRefreshing(false);
    if (error) return toast({ title: "Refresh mislukt", description: error.message, variant: "destructive" });
    toast({ title: "Verversing gestart", description: "Links en logo's worden bijgewerkt." });
    setTimeout(load, 1500);
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Boxes className="w-6 h-6 text-primary" /> Groeistack
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Beheer de tools op /groeistack. Nachtelijke cron checkt links en ververst logo's.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={refreshNow} disabled={refreshing} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} /> Ververs nu
        </Button>
      </div>

      {/* Nieuw toevoegen */}
      <div className="rounded-xl border border-border bg-card p-4 mb-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
        <div className="lg:col-span-1">
          <label className="text-xs text-muted-foreground">Naam</label>
          <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Categorie</label>
          <select
            className={inputCls}
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
          >
            {groeistackCategories.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Website</label>
          <Input value={draft.website} onChange={(e) => setDraft({ ...draft, website: e.target.value })} placeholder="https://" />
        </div>
        <div className="lg:col-span-1">
          <label className="text-xs text-muted-foreground">Omschrijving</label>
          <Input value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
        </div>
        <Button onClick={addTool} className="gap-2"><Plus className="w-4 h-4" /> Toevoegen</Button>
      </div>

      {/* Lijst */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Laden...</p>
      ) : (
        <div className="space-y-2">
          {rows.map((row) => (
            <div
              key={row.id}
              className="rounded-xl border border-border bg-card p-3 grid sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1.6fr_2fr_auto_auto_auto] gap-2 items-center"
            >
              <Input value={row.name} onChange={(e) => patchRow(row.id, { name: e.target.value })} />
              <select
                className={inputCls}
                value={row.category}
                onChange={(e) => patchRow(row.id, { category: e.target.value })}
              >
                {groeistackCategories.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
              <Input value={row.website} onChange={(e) => patchRow(row.id, { website: e.target.value })} />
              <Input value={row.description} onChange={(e) => patchRow(row.id, { description: e.target.value })} />
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={row.published}
                  onChange={(e) => patchRow(row.id, { published: e.target.checked })}
                />
                Live
              </label>
              <Button variant="ghost" size="icon" onClick={() => saveRow(row)} title="Opslaan">
                <Save className="w-4 h-4 text-primary" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => deleteRow(row.id)} title="Verwijderen">
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
          {rows.length === 0 && (
            <p className="text-sm text-muted-foreground">Nog geen tools. Voeg er hierboven een toe.</p>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminGroeistack;
