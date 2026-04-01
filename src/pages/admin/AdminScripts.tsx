import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code2, Plus, Trash2, Save, Loader2, GripVertical, Pencil } from "lucide-react";
import { toast } from "sonner";

interface TrackingScript {
  id: string;
  name: string;
  description: string | null;
  script_content: string;
  location: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

const LOCATIONS = [
  { value: "head", label: "Head" },
  { value: "body_start", label: "Body (start)" },
  { value: "body_end", label: "Body (end)" },
];

const AdminScripts = () => {
  const [scripts, setScripts] = useState<TrackingScript[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    script_content: "",
    location: "head",
    is_active: true,
  });

  const fetchScripts = async () => {
    const { data, error } = await supabase
      .from("tracking_scripts")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      toast.error("Kon scripts niet laden");
    } else {
      setScripts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchScripts();
  }, []);

  const resetForm = () => {
    setForm({ name: "", description: "", script_content: "", location: "head", is_active: true });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.script_content.trim()) {
      toast.error("Naam en script zijn verplicht");
      return;
    }
    setSaving("form");

    if (editingId) {
      const { error } = await supabase
        .from("tracking_scripts")
        .update({
          name: form.name,
          description: form.description || null,
          script_content: form.script_content,
          location: form.location,
          is_active: form.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId);
      if (error) toast.error("Opslaan mislukt");
      else toast.success("Script bijgewerkt");
    } else {
      const { error } = await supabase
        .from("tracking_scripts")
        .insert({
          name: form.name,
          description: form.description || null,
          script_content: form.script_content,
          location: form.location,
          is_active: form.is_active,
          sort_order: scripts.length,
        });
      if (error) toast.error("Toevoegen mislukt");
      else toast.success("Script toegevoegd");
    }

    setSaving(null);
    resetForm();
    fetchScripts();
  };

  const handleEdit = (script: TrackingScript) => {
    setForm({
      name: script.name,
      description: script.description || "",
      script_content: script.script_content,
      location: script.location,
      is_active: script.is_active,
    });
    setEditingId(script.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Weet je zeker dat je dit script wilt verwijderen?")) return;
    const { error } = await supabase.from("tracking_scripts").delete().eq("id", id);
    if (error) toast.error("Verwijderen mislukt");
    else {
      toast.success("Script verwijderd");
      fetchScripts();
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    const { error } = await supabase
      .from("tracking_scripts")
      .update({ is_active: active, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) toast.error("Status wijzigen mislukt");
    else fetchScripts();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Code2 className="w-6 h-6 text-primary" /> Tracking Scripts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Beheer third-party tracking scripts (Apollo, Meta Pixel, etc.)
          </p>
        </div>
        <Button variant="hero" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-4 h-4" /> Script toevoegen
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-6 mb-8 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            {editingId ? "Script bewerken" : "Nieuw script"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Naam *</Label>
              <Input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Apollo Tracker"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Locatie</Label>
              <Select value={form.location} onValueChange={v => setForm(f => ({ ...f, location: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map(l => (
                    <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Beschrijving</Label>
            <Input
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Website visitor tracking voor Apollo.io"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Script *</Label>
            <Textarea
              value={form.script_content}
              onChange={e => setForm(f => ({ ...f, script_content: e.target.value }))}
              rows={6}
              placeholder='<script>...</script>'
              className="font-mono text-xs"
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={form.is_active}
              onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))}
            />
            <Label>Actief</Label>
          </div>
          <div className="flex gap-2">
            <Button variant="hero" onClick={handleSave} disabled={saving === "form"}>
              {saving === "form" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editingId ? "Bijwerken" : "Opslaan"}
            </Button>
            <Button variant="ghost" onClick={resetForm}>Annuleren</Button>
          </div>
        </div>
      )}

      {scripts.length === 0 && !showForm ? (
        <div className="text-center py-20 text-muted-foreground">
          <Code2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Nog geen tracking scripts</p>
          <p className="text-sm mt-1">Voeg je eerste script toe om te beginnen.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {scripts.map(script => (
            <div
              key={script.id}
              className={`bg-card border rounded-xl p-4 flex items-start gap-4 transition-opacity ${
                script.is_active ? "border-border" : "border-border/50 opacity-60"
              }`}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">{script.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground uppercase">
                    {script.location.replace("_", " ")}
                  </span>
                  {!script.is_active && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-medium">
                      Inactief
                    </span>
                  )}
                </div>
                {script.description && (
                  <p className="text-xs text-muted-foreground mb-2">{script.description}</p>
                )}
                <pre className="text-xs font-mono bg-secondary/50 rounded p-2 overflow-x-auto max-h-20 text-muted-foreground">
                  {script.script_content}
                </pre>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Switch
                  checked={script.is_active}
                  onCheckedChange={v => handleToggleActive(script.id, v)}
                />
                <Button variant="ghost" size="icon" onClick={() => handleEdit(script)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(script.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminScripts;
