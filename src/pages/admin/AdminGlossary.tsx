import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BookA, Sparkles, Trash2, ExternalLink, CheckCircle2, XCircle, Plus } from "lucide-react";

interface Term {
  id: string;
  slug: string;
  term: string;
  category: string | null;
  status: string;
  published_at: string | null;
}
interface Run {
  id: string;
  created_at: string;
  status: string;
  message: string | null;
  term_id: string | null;
}

const sb = supabase as unknown as { from: (t: string) => any };

const AdminGlossary = () => {
  const { toast } = useToast();
  const [terms, setTerms] = useState<Term[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [generating, setGenerating] = useState(false);
  const [customTerm, setCustomTerm] = useState("");

  const load = async () => {
    const { data: t } = await sb
      .from("glossary_terms")
      .select("id, slug, term, category, status, published_at")
      .order("published_at", { ascending: false });
    const { data: r } = await sb
      .from("glossary_runs")
      .select("*").order("created_at", { ascending: false }).limit(10);
    setTerms((t as Term[]) || []);
    setRuns((r as Run[]) || []);
  };

  useEffect(() => { load(); }, []);

  const generate = async (term?: string) => {
    setGenerating(true);
    const { data, error } = await supabase.functions.invoke("generate-glossary", {
      body: term ? { term } : {},
    });
    setGenerating(false);
    if (error || (data && (data as any).ok === false)) {
      return toast({
        title: "Generatie mislukt",
        description: error?.message || (data as any)?.error,
        variant: "destructive",
      });
    }
    toast({ title: "Term toegevoegd", description: (data as any)?.term });
    setCustomTerm("");
    load();
  };

  const setStatus = async (t: Term, status: string) => {
    await sb.from("glossary_terms").update({ status }).eq("id", t.id);
    setTerms((r) => r.map((x) => (x.id === t.id ? { ...x, status } : x)));
  };

  const remove = async (id: string) => {
    await sb.from("glossary_terms").delete().eq("id", id);
    setTerms((r) => r.filter((x) => x.id !== id));
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <BookA className="w-6 h-6 text-primary" /> Woordenboek
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Autopilot voegt elke dag een term toe op basis van bestaande content. Of stel zelf een term voor.
          </p>
        </div>
        <Button onClick={() => generate()} disabled={generating} className="gap-2">
          <Sparkles className={`w-4 h-4 ${generating ? "animate-pulse" : ""}`} />
          {generating ? "Genereren..." : "Genereer term"}
        </Button>
      </div>

      {/* Custom term */}
      <div className="rounded-xl border border-border bg-card p-4 mb-8 flex items-center gap-2">
        <input
          value={customTerm}
          onChange={(e) => setCustomTerm(e.target.value)}
          placeholder="Eigen term, bv. 'Intent data'"
          className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm"
        />
        <Button
          onClick={() => customTerm.trim() && generate(customTerm.trim())}
          disabled={generating || !customTerm.trim()}
          variant="outline"
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> Toevoegen
        </Button>
      </div>

      {/* Runs */}
      <div className="rounded-xl border border-border bg-card p-4 mb-8">
        <p className="text-[11px] font-display font-semibold tracking-[0.2em] uppercase text-primary/70 mb-3">
          Autopilot runs (laatste 10)
        </p>
        {runs.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nog geen runs vastgelegd.</p>
        ) : (
          <div className="space-y-1.5">
            {runs.map((r) => (
              <div key={r.id} className="flex items-center gap-3 text-sm">
                {r.status === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-destructive shrink-0" />
                )}
                <span className="text-xs text-muted-foreground tabular-nums shrink-0 w-36">
                  {new Date(r.created_at).toLocaleString("nl-NL")}
                </span>
                <span className="flex-1 text-foreground/90 truncate">{r.message || "—"}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-[11px] font-display font-semibold tracking-[0.2em] uppercase text-primary/70 mb-3">
        Termen ({terms.length})
      </p>
      <div className="space-y-2">
        {terms.map((t) => (
          <div key={t.id} className="rounded-xl border border-border bg-card p-3 flex items-center gap-3">
            <span className="flex-1 text-sm text-foreground/90">
              {t.term}
              {t.category && (
                <span className="ml-2 text-xs text-muted-foreground">· {t.category}</span>
              )}
            </span>
            <a href={`/woordenboek/${t.slug}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <ExternalLink className="w-4 h-4" />
            </a>
            <Button
              size="sm"
              variant={t.status === "published" ? "secondary" : "outline"}
              onClick={() => setStatus(t, t.status === "published" ? "draft" : "published")}
            >
              {t.status === "published" ? "Live" : "Concept"}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => remove(t.id)}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
        {terms.length === 0 && (
          <p className="text-sm text-muted-foreground">Nog geen termen. Klik "Genereer term".</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminGlossary;