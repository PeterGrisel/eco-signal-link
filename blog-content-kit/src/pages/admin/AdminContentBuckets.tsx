import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Gift, Sparkles, Loader2, Trash2, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import GiveawayAssetPage from "@/components/buckets/giveaway/GiveawayAssetPage";

interface Bucket {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  cta_text: string | null;
  default_layouts: string[] | null;
  generator_system_prompt: string | null;
}
interface Item {
  id: string;
  bucket_id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  intro: string | null;
  layout: string;
  position: number;
  slot_label: string | null;
  type_label: string | null;
  is_bonus: boolean;
  status: string;
  payload: any;
}
interface Lead {
  id: string;
  email: string;
  name: string | null;
  status: string;
  created_at: string;
  confirmed_at: string | null;
  delivered_at: string | null;
  item_id: string | null;
}

const AdminContentBuckets = () => {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [activeBucket, setActiveBucket] = useState<Bucket | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Item | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genTopic, setGenTopic] = useState("");
  const [genLayout, setGenLayout] = useState<string>("scorecard");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("content_buckets").select("*").order("name");
      setBuckets((data as any) || []);
      if (data && data[0]) setActiveBucket(data[0] as any);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!activeBucket) return;
    (async () => {
      const [{ data: it }, { data: ld }] = await Promise.all([
        supabase
          .from("content_bucket_items")
          .select("*")
          .eq("bucket_id", activeBucket.id)
          .order("position"),
        supabase
          .from("content_bucket_leads")
          .select("id,email,name,status,created_at,confirmed_at,delivered_at,item_id")
          .eq("bucket_id", activeBucket.id)
          .order("created_at", { ascending: false })
          .limit(200),
      ]);
      setItems((it as any) || []);
      setLeads((ld as any) || []);
    })();
  }, [activeBucket]);

  const reloadItems = async () => {
    if (!activeBucket) return;
    const { data } = await supabase.from("content_bucket_items").select("*").eq("bucket_id", activeBucket.id).order("position");
    setItems((data as any) || []);
  };

  const saveItem = async (it: Item) => {
    const { error } = await supabase
      .from("content_bucket_items")
      .update({
        title: it.title,
        subtitle: it.subtitle,
        intro: it.intro,
        layout: it.layout,
        slot_label: it.slot_label,
        type_label: it.type_label,
        status: it.status,
        payload: it.payload,
      })
      .eq("id", it.id);
    if (error) toast({ title: "Opslaan mislukt", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Opgeslagen" });
      setEditing(null);
      reloadItems();
    }
  };

  const deleteItem = async (it: Item) => {
    if (!confirm(`Verwijder "${it.title}"?`)) return;
    const { error } = await supabase.from("content_bucket_items").delete().eq("id", it.id);
    if (error) toast({ title: "Verwijderen mislukt", description: error.message, variant: "destructive" });
    else reloadItems();
  };

  const generateItem = async () => {
    if (!activeBucket) return;
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-bucket-item", {
        body: { bucket_id: activeBucket.id, topic: genTopic, layout: genLayout },
      });
      if (error) throw error;
      toast({ title: "Concept gegenereerd", description: data?.title || "Open in de lijst." });
      setGenTopic("");
      reloadItems();
    } catch (e: any) {
      toast({ title: "Generatie mislukt", description: e.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Gift className="w-6 h-6 text-primary" /> Content buckets
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Modulaire content-engines. Per bucket eigen layouts, items, AI-generator en leads.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {buckets.map((b) => (
            <Button
              key={b.id}
              variant={activeBucket?.id === b.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveBucket(b)}
            >
              {b.name}
            </Button>
          ))}
        </div>
      </div>

      {loading && <div className="text-muted-foreground text-sm">Laden…</div>}

      {activeBucket && (
        <Tabs defaultValue="items">
          <TabsList>
            <TabsTrigger value="items">Items ({items.length})</TabsTrigger>
            <TabsTrigger value="generate">AI-generator</TabsTrigger>
            <TabsTrigger value="leads">Leads ({leads.length})</TabsTrigger>
            <TabsTrigger value="settings">Instellingen</TabsTrigger>
          </TabsList>

          <TabsContent value="items">
            <div className="bg-card border border-border rounded-lg overflow-hidden mt-4">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="text-left p-3">Slot</th>
                    <th className="text-left p-3">Titel</th>
                    <th className="text-left p-3">Layout</th>
                    <th className="text-left p-3">Status</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id} className="border-t border-border hover:bg-secondary/50">
                      <td className="p-3 font-mono text-xs text-muted-foreground">{it.slot_label}</td>
                      <td className="p-3 font-display">{it.title}</td>
                      <td className="p-3"><Badge variant="outline">{it.layout}</Badge></td>
                      <td className="p-3">
                        <Badge variant={it.status === "published" ? "default" : "secondary"}>{it.status}</Badge>
                      </td>
                      <td className="p-3 flex justify-end gap-2">
                        <Button size="sm" variant="ghost" asChild>
                          <a href={`/give-aways/${it.slug}?u=1`} target="_blank" rel="noreferrer"><Eye className="w-4 h-4" /></a>
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditing(it)}>Bewerken</Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteItem(it)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="generate">
            <div className="bg-card border border-border rounded-lg p-6 mt-4 max-w-2xl">
              <h3 className="font-display font-semibold text-lg mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Genereer met AI
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                AI maakt een concept-item in het juiste schema voor deze bucket. Status wordt <em>draft</em>.
              </p>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Onderwerp / haak</label>
                  <Textarea
                    placeholder="Bijv. checklist voor LinkedIn-bericht na trigger-event"
                    value={genTopic}
                    onChange={(e) => setGenTopic(e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Layout</label>
                  <Select value={genLayout} onValueChange={setGenLayout}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(activeBucket.default_layouts || []).map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={generateItem} disabled={generating || !genTopic}>
                  {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Genereren…</> : "Genereer concept"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leads">
            <div className="bg-card border border-border rounded-lg overflow-hidden mt-4">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="text-left p-3">E-mail</th>
                    <th className="text-left p-3">Naam</th>
                    <th className="text-left p-3">Item</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Bevestigd</th>
                    <th className="text-left p-3">Aangevraagd</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => {
                    const item = items.find((i) => i.id === l.item_id);
                    return (
                      <tr key={l.id} className="border-t border-border">
                        <td className="p-3">{l.email}</td>
                        <td className="p-3">{l.name || "—"}</td>
                        <td className="p-3 text-xs text-muted-foreground">{item?.title || "—"}</td>
                        <td className="p-3">
                          <Badge variant={l.status === "confirmed" ? "default" : "secondary"}>{l.status}</Badge>
                        </td>
                        <td className="p-3 text-xs text-muted-foreground">
                          {l.confirmed_at ? new Date(l.confirmed_at).toLocaleString("nl-NL") : "—"}
                        </td>
                        <td className="p-3 text-xs text-muted-foreground">
                          {new Date(l.created_at).toLocaleString("nl-NL")}
                        </td>
                      </tr>
                    );
                  })}
                  {leads.length === 0 && (
                    <tr><td colSpan={6} className="p-6 text-center text-muted-foreground text-sm">Nog geen leads.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="bg-card border border-border rounded-lg p-6 mt-4 max-w-2xl space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Naam</label>
                <Input value={activeBucket.name} readOnly />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Tagline</label>
                <Input value={activeBucket.tagline || ""} readOnly />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">AI systeemprompt</label>
                <Textarea value={activeBucket.generator_system_prompt || ""} rows={6} readOnly />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Layouts</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(activeBucket.default_layouts || []).map((l) => <Badge key={l} variant="outline">{l}</Badge>)}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}

      <Sheet open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          {editing && (
            <>
              <SheetHeader>
                <SheetTitle>Item bewerken</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Titel</label>
                  <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Slot</label>
                    <Input value={editing.slot_label || ""} onChange={(e) => setEditing({ ...editing, slot_label: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Type label</label>
                    <Input value={editing.type_label || ""} onChange={(e) => setEditing({ ...editing, type_label: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Intro</label>
                  <Textarea value={editing.intro || ""} rows={3} onChange={(e) => setEditing({ ...editing, intro: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Layout</label>
                    <Select value={editing.layout} onValueChange={(v) => setEditing({ ...editing, layout: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(activeBucket?.default_layouts || []).map((l) => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Status</label>
                    <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">draft</SelectItem>
                        <SelectItem value="published">published</SelectItem>
                        <SelectItem value="archived">archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Payload (JSON)</label>
                  <Textarea
                    rows={10}
                    className="font-mono text-xs"
                    value={JSON.stringify(editing.payload, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setEditing({ ...editing, payload: parsed });
                      } catch {/* keep raw — user is mid-edit */}
                    }}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={() => saveItem(editing)}>Opslaan</Button>
                  <Button variant="outline" onClick={() => setEditing(null)}>Annuleren</Button>
                </div>
                <div className="mt-6 border-t border-border pt-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Live preview</div>
                  <div className="rounded-lg overflow-hidden">
                    <GiveawayAssetPage item={editing} />
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
};

export default AdminContentBuckets;