import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Trash2, Archive, RefreshCw, Plus, Upload, Loader2, Sparkles } from "lucide-react";

interface AbmRow {
  id: string;
  slug: string;
  company_name: string;
  status: string;
  view_count: number;
  expires_at: string;
  created_at: string;
  updated_at: string;
  website: string | null;
  logo_url: string | null;
  pdf_url: string | null;
  brand_primary_hex: string | null;
  brand_glow_hex: string | null;
}

const sb = supabase as unknown as { from: (t: string) => any };

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.replace(/^data:[^,]+,/, ""));
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const AdminAbmPages = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<AbmRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [generating, setGenerating] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await sb.from("abm_pages").select("*").order("updated_at", { ascending: false });
    setRows((data as AbmRow[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setPdfFile(null);
  };

  const generate = async () => {
    if (!pdfFile) return toast({ title: "Upload eerst de flyer (PDF)", variant: "destructive" });
    if (pdfFile.type !== "application/pdf") return toast({ title: "Alleen PDF-bestanden toegestaan", variant: "destructive" });
    if (pdfFile.size > 20 * 1024 * 1024) return toast({ title: "PDF is groter dan 20MB", variant: "destructive" });

    setGenerating(true);
    try {
      const pdfBase64 = await fileToBase64(pdfFile);
      const { data, error } = await supabase.functions.invoke("abm-generate", {
        body: { pdfBase64, filename: pdfFile.name },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: "Pagina gegenereerd", description: `/voor/${data.slug}` });
      setCreating(false);
      resetForm();
      load();
    } catch (e: any) {
      toast({ title: "Genereren mislukt", description: e.message || String(e), variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

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

  const setExpiresAt = async (row: AbmRow, iso: string) => {
    const { error } = await sb.from("abm_pages").update({ expires_at: iso }).eq("id", row.id);
    if (error) return toast({ title: "Update mislukt", description: error.message, variant: "destructive" });
    toast({ title: "Vervaldatum bijgewerkt" });
    load();
  };

  const extendDays = (row: AbmRow, days: number) => {
    const base = new Date(row.expires_at) < new Date() ? new Date() : new Date(row.expires_at);
    base.setDate(base.getDate() + days);
    setExpiresAt(row, base.toISOString());
  };

  const daysLeft = (iso: string) => {
    const ms = new Date(iso).getTime() - Date.now();
    return Math.ceil(ms / 86400000);
  };

  const toDateInput = (iso: string) => {
    const d = new Date(iso);
    const tz = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tz).toISOString().slice(0, 10);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-3xl mb-1">Clientpagina's</h1>
        <p className="text-sm text-muted-foreground">
          Upload een flyer (PDF) en genereer automatisch een persoonlijke pagina op <code>/voor/&lt;slug&gt;</code>.
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{rows.length} pagina{rows.length === 1 ? "" : "'s"}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load}><RefreshCw className="h-4 w-4 mr-2" />Vernieuwen</Button>
          <Button size="sm" onClick={() => setCreating(true)}><Plus className="h-4 w-4 mr-2" />Nieuwe pagina</Button>
        </div>
      </div>

      {creating && (
        <div className="mb-6 p-6 rounded-xl border border-border bg-card space-y-4">
          <div>
            <h3 className="font-display text-lg mb-1">Nieuwe clientpagina genereren</h3>
            <p className="text-xs text-muted-foreground">
              Upload de flyer (PDF). De bedrijfsnaam komt uit de bestandsnaam. Brandkleuren en hero-copy worden automatisch gegenereerd.
            </p>
          </div>

          <div>
            <Label className="text-xs">Flyer / Playbook PDF</Label>
            <p className="text-xs text-muted-foreground mb-2">Tip: noem het bestand naar de klant (bv. <code>Coolmark.pdf</code>).</p>
            <div className="mt-1 flex items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-background hover:bg-card cursor-pointer text-sm">
                <Upload className="h-4 w-4" />
                {pdfFile ? "Andere PDF kiezen" : "Kies PDF"}
                <input type="file" accept="application/pdf" className="hidden"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
              </label>
              {pdfFile && (
                <span className="text-xs text-muted-foreground">
                  {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={generate} disabled={generating}>
              {generating ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Bezig met genereren…</>
              ) : (
                <><Sparkles className="h-4 w-4 mr-2" />Genereer pagina</>
              )}
            </Button>
            <Button size="sm" variant="ghost" disabled={generating} onClick={() => { setCreating(false); resetForm(); }}>
              Annuleer
            </Button>
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
                {row.logo_url ? (
                  <img src={row.logo_url} alt="" className="h-10 w-10 rounded bg-background object-contain p-1 border border-border" />
                ) : (
                  <div className="h-10 w-10 rounded bg-background border border-border flex items-center justify-center text-xs font-semibold">
                    {row.company_name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                {row.brand_primary_hex && (
                  <div className="flex items-center gap-1">
                    <span className="h-6 w-6 rounded-full border border-border" style={{ backgroundColor: row.brand_primary_hex }} title={row.brand_primary_hex} />
                    {row.brand_glow_hex && (
                      <span className="h-6 w-6 rounded-full border border-border" style={{ backgroundColor: row.brand_glow_hex }} title={row.brand_glow_hex} />
                    )}
                  </div>
                )}
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
                    /voor/{row.slug} · {row.view_count} views{row.pdf_url ? " · PDF aanwezig" : ""}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={`text-xs ${expired ? "text-destructive" : "text-muted-foreground"}`}>
                      {expired ? "Verlopen" : `Nog ${daysLeft(row.expires_at)} dagen`}
                    </span>
                    <Input
                      type="date"
                      defaultValue={toDateInput(row.expires_at)}
                      min={toDateInput(new Date().toISOString())}
                      max="2099-12-31"
                      key={row.expires_at}
                      onBlur={(e) => {
                        const v = e.target.value;
                        if (!v) return;
                        const d = new Date(v + "T23:59:59");
                        const year = d.getFullYear();
                        if (isNaN(d.getTime()) || year < new Date().getFullYear() || year > 2099) {
                          toast({ title: "Ongeldige datum", description: "Kies een datum tussen vandaag en 2099.", variant: "destructive" });
                          e.target.value = toDateInput(row.expires_at);
                          return;
                        }
                        if (d.toISOString() === new Date(row.expires_at).toISOString()) return;
                        setExpiresAt(row, d.toISOString());
                      }}
                      className="h-7 w-[140px] text-xs"
                    />
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => extendDays(row, 7)}>+7d</Button>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => extendDays(row, 14)}>+14d</Button>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => extendDays(row, 30)}>+30d</Button>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <a href={`/voor/${row.slug}`} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />Open
                  </a>
                </Button>
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
            <p className="text-muted-foreground text-sm">Nog geen pagina's. Klik op "Nieuwe pagina" en upload een flyer.</p>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAbmPages;