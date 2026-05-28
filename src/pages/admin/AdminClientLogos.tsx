import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Pencil, Plus, Trash2, Eye, EyeOff, ExternalLink, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ClientLogo {
  id: string;
  name: string;
  domain: string;
  logo_url: string | null;
  scale: number;
  padding: number;
  is_visible: boolean;
  sort_order: number;
  sector: string | null;
  description: string | null;
  blog_slug: string | null;
  website: string | null;
}

const emptyForm = {
  id: "" as string | null,
  name: "",
  domain: "",
  logo_url: "",
  scale: 1,
  padding: 0,
  is_visible: true,
  sort_order: 0,
  sector: "",
  description: "",
  blog_slug: "",
  website: "",
};

function faviconUrl(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

function previewSrc(l: { logo_url: string | null; domain: string }) {
  return l.logo_url && l.logo_url.trim().length > 0
    ? l.logo_url
    : faviconUrl(l.domain);
}

export const ClientLogosTabContent = () => {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [enrichingId, setEnrichingId] = useState<string | null>(null);
  const [enrichingForm, setEnrichingForm] = useState(false);

  const fetchLogos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("client_logos")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) toast.error("Kon klantlogo's niet laden");
    else setLogos((data as ClientLogo[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  const openNew = () => {
    setForm({
      ...emptyForm,
      id: null,
      sort_order: (logos[logos.length - 1]?.sort_order ?? 0) + 10,
    });
    setOpen(true);
  };

  const openEdit = (l: ClientLogo) => {
    setForm({
      id: l.id,
      name: l.name,
      domain: l.domain,
      logo_url: l.logo_url ?? "",
      scale: Number(l.scale),
      padding: l.padding,
      is_visible: l.is_visible,
      sort_order: l.sort_order,
      sector: l.sector ?? "",
      description: l.description ?? "",
      blog_slug: l.blog_slug ?? "",
      website: l.website ?? "",
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.domain.trim()) {
      toast.error("Naam en domein zijn verplicht");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      domain: form.domain.trim().replace(/^https?:\/\//, "").replace(/\/$/, ""),
      logo_url: form.logo_url.trim() || null,
      scale: form.scale,
      padding: form.padding,
      is_visible: form.is_visible,
      sort_order: form.sort_order,
      sector: form.sector.trim() || null,
      description: form.description.trim() || null,
      blog_slug: form.blog_slug.trim() || null,
      website: form.website.trim() || null,
    };
    const { error } = form.id
      ? await supabase.from("client_logos").update(payload).eq("id", form.id)
      : await supabase.from("client_logos").insert(payload);
    setSaving(false);
    if (error) {
      toast.error("Opslaan mislukt");
      return;
    }
    toast.success("Opgeslagen");
    setOpen(false);
    fetchLogos();
  };

  const toggleVisible = async (l: ClientLogo) => {
    const { error } = await supabase
      .from("client_logos")
      .update({ is_visible: !l.is_visible })
      .eq("id", l.id);
    if (error) return toast.error("Kon niet wijzigen");
    fetchLogos();
  };

  const remove = async (l: ClientLogo) => {
    if (!confirm(`"${l.name}" verwijderen?`)) return;
    const { error } = await supabase.from("client_logos").delete().eq("id", l.id);
    if (error) return toast.error("Verwijderen mislukt");
    toast.success("Verwijderd");
    fetchLogos();
  };

  const enrichRow = async (l: ClientLogo) => {
    setEnrichingId(l.id);
    const { data, error } = await supabase.functions.invoke("enrich-client", {
      body: { client_id: l.id },
    });
    setEnrichingId(null);
    if (error || data?.error) {
      toast.error(data?.error || "AI-verrijking mislukt");
      return;
    }
    const p = data.proposal || {};
    const { error: updErr } = await supabase
      .from("client_logos")
      .update({
        sector: p.sector ?? l.sector ?? null,
        description: p.description || l.description || null,
        blog_slug: p.blog_slug ?? l.blog_slug ?? null,
        website: p.website || l.website || null,
      })
      .eq("id", l.id);
    if (updErr) {
      toast.error("Opslaan mislukt");
      return;
    }
    toast.success(`Verrijkt: ${l.name}`);
    fetchLogos();
  };

  const enrichForm = async () => {
    if (!form.id) {
      toast.error("Sla eerst op voor AI kan verrijken");
      return;
    }
    setEnrichingForm(true);
    const { data, error } = await supabase.functions.invoke("enrich-client", {
      body: { client_id: form.id },
    });
    setEnrichingForm(false);
    if (error || data?.error) {
      toast.error(data?.error || "AI-verrijking mislukt");
      return;
    }
    const p = data.proposal || {};
    setForm({
      ...form,
      sector: p.sector || form.sector,
      description: p.description || form.description,
      blog_slug: p.blog_slug || form.blog_slug,
      website: p.website || form.website,
    });
    toast.success("AI-voorstel ingevuld. Controleer en sla op.");
  };

  const enrichAll = async () => {
    const targets = logos.filter((l) => !l.description || !l.sector);
    if (targets.length === 0) {
      toast.info("Alle klanten zijn al verrijkt");
      return;
    }
    if (!confirm(`AI verrijkt ${targets.length} klanten. Doorgaan?`)) return;
    for (const l of targets) {
      await enrichRow(l);
      await new Promise((r) => setTimeout(r, 500));
    }
    toast.success("Bulk-verrijking klaar");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Laden…
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground">
            Klantlogo's ({logos.length})
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Roteren in de hero-orbit. AI-verrijking vult sector, beschrijving en blog-link.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={enrichAll} size="sm" variant="outline">
            <Sparkles className="w-4 h-4 mr-1" /> Verrijk alles
          </Button>
          <Button onClick={openNew} size="sm">
            <Plus className="w-4 h-4 mr-1" /> Nieuw logo
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card divide-y divide-border">
        {logos.map((l) => (
          <div
            key={l.id}
            className="flex items-center gap-4 p-4 hover:bg-muted/30 transition"
          >
            <div
              className="h-12 w-12 rounded-xl bg-background border border-border/60 flex items-center justify-center overflow-hidden shrink-0"
              style={{ padding: `${l.padding}px` }}
            >
              <img
                src={previewSrc(l)}
                alt=""
                className="object-contain"
                style={{ transform: `scale(${l.scale})`, maxHeight: "100%", maxWidth: "100%" }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground truncate">{l.name}</span>
                {l.sector && (
                  <span className="text-[10px] uppercase tracking-wider text-primary/80 px-1.5 py-0.5 border border-primary/30 rounded">
                    {l.sector}
                  </span>
                )}
                {!l.is_visible && (
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground px-1.5 py-0.5 border border-border rounded">
                    verborgen
                  </span>
                )}
              </div>
              <a
                href={`https://${l.domain}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-muted-foreground hover:text-accent inline-flex items-center gap-1"
              >
                {l.domain} <ExternalLink className="w-3 h-3" />
              </a>
              {l.description ? (
                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{l.description}</div>
              ) : (
                <div className="text-[10px] text-amber-500/80 mt-0.5">Geen beschrijving — verrijk met AI</div>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => enrichRow(l)}
                disabled={enrichingId === l.id}
                title="Verrijk met AI"
              >
                {enrichingId === l.id
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Sparkles className="w-4 h-4 text-primary" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => toggleVisible(l)} title={l.is_visible ? "Verbergen" : "Tonen"}>
                {l.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => openEdit(l)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => remove(l)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {logos.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Nog geen klantlogo's. Klik op "Nieuw logo".
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{form.id ? "Logo bewerken" : "Nieuw logo"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-center gap-4">
              <div
                className="h-16 w-16 rounded-xl bg-background border border-border flex items-center justify-center overflow-hidden shrink-0"
                style={{ padding: `${form.padding}px` }}
              >
                <img
                  src={previewSrc({ logo_url: form.logo_url, domain: form.domain || "example.com" })}
                  alt=""
                  className="object-contain"
                  style={{ transform: `scale(${form.scale})`, maxHeight: "100%", maxWidth: "100%" }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Live preview. Pas schaal & padding aan voor logo's die "niet lekker" staan.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Naam</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Bedrijfsnaam" />
              </div>
              <div className="space-y-1">
                <Label>Domein</Label>
                <Input value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="voorbeeld.nl" />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Logo URL (optioneel)</Label>
              <Input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} placeholder="https://… (laat leeg voor favicon)" />
              <p className="text-[11px] text-muted-foreground">Leeg = automatisch favicon van het domein.</p>
            </div>

            <div className="space-y-1">
              <Label>Schaal: {form.scale.toFixed(2)}×</Label>
              <Slider
                value={[form.scale]}
                min={0.4}
                max={2}
                step={0.05}
                onValueChange={(v) => setForm({ ...form, scale: v[0] })}
              />
            </div>

            <div className="space-y-1">
              <Label>Padding: {form.padding}px</Label>
              <Slider
                value={[form.padding]}
                min={0}
                max={16}
                step={1}
                onValueChange={(v) => setForm({ ...form, padding: v[0] })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 items-end">
              <div className="space-y-1">
                <Label>Sorteervolgorde</Label>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <Label className="mb-0">Zichtbaar</Label>
                <Switch
                  checked={form.is_visible}
                  onCheckedChange={(v) => setForm({ ...form, is_visible: v })}
                />
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="mb-0 text-sm">Klantenpagina-content</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={enrichForm}
                  disabled={enrichingForm || !form.id}
                >
                  {enrichingForm
                    ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                    : <Sparkles className="w-3.5 h-3.5 mr-1" />}
                  Verrijk met AI
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Sector</Label>
                  <Input value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} placeholder="bv. Maakindustrie" />
                </div>
                <div className="space-y-1">
                  <Label>Website (optioneel)</Label>
                  <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://…" />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Beschrijving</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Korte omschrijving voor de klantenpagina"
                />
              </div>
              <div className="space-y-1">
                <Label>Gerelateerde blog (slug, optioneel)</Label>
                <Input value={form.blog_slug} onChange={(e) => setForm({ ...form, blog_slug: e.target.value })} placeholder="bv. signaal-prospecting-uitleg" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Annuleren</Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Opslaan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientLogosTabContent;