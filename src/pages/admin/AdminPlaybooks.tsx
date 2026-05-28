import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Sparkles, Trash2, ExternalLink } from "lucide-react";

interface Scenario {
  id: string;
  title: string;
  service_line: string;
  active: boolean;
  used_at: string | null;
}
interface Playbook {
  id: string;
  slug: string;
  title: string;
  status: string;
  published_at: string | null;
}

const sb = supabase as unknown as { from: (t: string) => any };

const AdminPlaybooks = () => {
  const { toast } = useToast();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [generating, setGenerating] = useState(false);

  const load = async () => {
    const { data: sc } = await sb
      .from("playbook_scenarios").select("*").order("sort_order");
    const { data: pb } = await sb
      .from("playbooks").select("id, slug, title, status, published_at").order("published_at", { ascending: false });
    setScenarios((sc as Scenario[]) || []);
    setPlaybooks((pb as Playbook[]) || []);
  };

  useEffect(() => { load(); }, []);

  const generate = async (scenario_id?: string) => {
    setGenerating(true);
    const { data, error } = await supabase.functions.invoke("generate-playbook", {
      body: scenario_id ? { scenario_id } : {},
    });
    setGenerating(false);
    if (error || (data && (data as any).ok === false)) {
      return toast({
        title: "Generatie mislukt",
        description: error?.message || (data as any)?.error,
        variant: "destructive",
      });
    }
    toast({ title: "Playbook gegenereerd", description: (data as any)?.title });
    load();
  };

  const toggleScenario = async (s: Scenario) => {
    await sb.from("playbook_scenarios").update({ active: !s.active }).eq("id", s.id);
    setScenarios((r) => r.map((x) => (x.id === s.id ? { ...x, active: !x.active } : x)));
  };

  const setStatus = async (p: Playbook, status: string) => {
    await sb.from("playbooks").update({ status }).eq("id", p.id);
    setPlaybooks((r) => r.map((x) => (x.id === p.id ? { ...x, status } : x)));
  };

  const remove = async (id: string) => {
    await sb.from("playbooks").delete().eq("id", id);
    setPlaybooks((r) => r.filter((x) => x.id !== id));
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" /> Playbooks
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Dagelijks automatisch gegenereerd uit de scenario's + De Groeistack.
          </p>
        </div>
        <Button onClick={() => generate()} disabled={generating} className="gap-2">
          <Sparkles className={`w-4 h-4 ${generating ? "animate-pulse" : ""}`} />
          {generating ? "Genereren..." : "Genereer nu"}
        </Button>
      </div>

      {/* Scenario's */}
      <div className="rounded-xl border border-border bg-card p-4 mb-8">
        <p className="text-[11px] font-display font-semibold tracking-[0.2em] uppercase text-primary/70 mb-4">
          Scenario's ({scenarios.filter((s) => s.active).length} actief)
        </p>
        <div className="space-y-2">
          {scenarios.map((s) => (
            <div key={s.id} className="flex items-center gap-3 text-sm">
              <label className="flex items-center gap-2 shrink-0">
                <input type="checkbox" checked={s.active} onChange={() => toggleScenario(s)} />
              </label>
              <span className="flex-1 text-foreground/90">{s.title}</span>
              <span className="text-xs text-muted-foreground hidden sm:block">{s.service_line}</span>
              <Button size="sm" variant="ghost" onClick={() => generate(s.id)} disabled={generating}>
                Genereer
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Playbooks */}
      <p className="text-[11px] font-display font-semibold tracking-[0.2em] uppercase text-primary/70 mb-3">
        Gegenereerde playbooks ({playbooks.length})
      </p>
      <div className="space-y-2">
        {playbooks.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-card p-3 flex items-center gap-3">
            <span className="flex-1 text-sm text-foreground/90">{p.title}</span>
            <a href={`/playbooks/${p.slug}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <ExternalLink className="w-4 h-4" />
            </a>
            <Button
              size="sm"
              variant={p.status === "published" ? "secondary" : "outline"}
              onClick={() => setStatus(p, p.status === "published" ? "draft" : "published")}
            >
              {p.status === "published" ? "Live" : "Concept"}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => remove(p.id)}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
        {playbooks.length === 0 && (
          <p className="text-sm text-muted-foreground">Nog geen playbooks. Klik "Genereer nu".</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPlaybooks;
