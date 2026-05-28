import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Sparkles, Trash2, ExternalLink, CheckCircle2, XCircle, Calendar } from "lucide-react";

interface Scenario {
  id: string;
  title: string;
  service_line: string;
  active: boolean;
  used_at: string | null;
  scheduled_date: string | null;
}
interface Playbook {
  id: string;
  slug: string;
  title: string;
  status: string;
  published_at: string | null;
}
interface Run {
  id: string;
  created_at: string;
  status: string;
  message: string | null;
  scenario_id: string | null;
  playbook_id: string | null;
}

const sb = supabase as unknown as { from: (t: string) => any };

const AdminPlaybooks = () => {
  const { toast } = useToast();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [generating, setGenerating] = useState(false);
  const [planning, setPlanning] = useState(false);

  const load = async () => {
    const { data: sc } = await sb
      .from("playbook_scenarios").select("*").order("sort_order");
    const { data: pb } = await sb
      .from("playbooks").select("id, slug, title, status, published_at").order("published_at", { ascending: false });
    const { data: rn } = await sb
      .from("playbook_runs").select("*").order("created_at", { ascending: false }).limit(10);
    setScenarios((sc as Scenario[]) || []);
    setPlaybooks((pb as Playbook[]) || []);
    setRuns((rn as Run[]) || []);
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

  const setSchedule = async (s: Scenario, date: string) => {
    const value = date || null;
    await sb.from("playbook_scenarios").update({ scheduled_date: value }).eq("id", s.id);
    setScenarios((r) => r.map((x) => (x.id === s.id ? { ...x, scheduled_date: value } : x)));
  };

  // Verdeel alle actieve scenario's zonder datum over komende werkdagen (ma-vr),
  // sla data over die al bezet zijn door een ander scenario.
  const autoSchedule = async () => {
    setPlanning(true);
    try {
      const taken = new Set(
        scenarios.map((s) => s.scheduled_date).filter(Boolean) as string[]
      );
      const toPlan = scenarios.filter((s) => s.active && !s.scheduled_date);
      if (toPlan.length === 0) {
        toast({ title: "Niets te plannen", description: "Alle actieve scenario's hebben al een datum." });
        setPlanning(false);
        return;
      }
      const cursor = new Date();
      cursor.setDate(cursor.getDate() + 1);
      const updates: { id: string; date: string }[] = [];
      for (const s of toPlan) {
        while (
          cursor.getDay() === 0 ||
          cursor.getDay() === 6 ||
          taken.has(cursor.toISOString().split("T")[0])
        ) {
          cursor.setDate(cursor.getDate() + 1);
        }
        const dateStr = cursor.toISOString().split("T")[0];
        taken.add(dateStr);
        updates.push({ id: s.id, date: dateStr });
        cursor.setDate(cursor.getDate() + 1);
      }
      await Promise.all(
        updates.map((u) =>
          sb.from("playbook_scenarios").update({ scheduled_date: u.date }).eq("id", u.id)
        )
      );
      setScenarios((r) =>
        r.map((x) => {
          const u = updates.find((up) => up.id === x.id);
          return u ? { ...x, scheduled_date: u.date } : x;
        })
      );
      toast({
        title: "Ingepland",
        description: `${updates.length} scenario's verdeeld van ${updates[0].date} t/m ${updates[updates.length - 1].date}.`,
      });
    } catch (e: any) {
      toast({ title: "Plannen mislukt", description: e?.message || String(e), variant: "destructive" });
    } finally {
      setPlanning(false);
    }
  };

  const clearSchedule = async () => {
    if (!confirm("Alle geplande datums wissen?")) return;
    await sb.from("playbook_scenarios").update({ scheduled_date: null }).not("scheduled_date", "is", null);
    setScenarios((r) => r.map((x) => ({ ...x, scheduled_date: null })));
    toast({ title: "Planning gewist" });
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
            Autopilot draait dagelijks om 06:00 UTC. Plan scenario's per datum of laat de rotatie kiezen.
          </p>
        </div>
        <Button onClick={() => generate()} disabled={generating} className="gap-2">
          <Sparkles className={`w-4 h-4 ${generating ? "animate-pulse" : ""}`} />
          {generating ? "Genereren..." : "Genereer nu"}
        </Button>
      </div>

      {/* Run log */}
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

      {/* Scenario's */}
      <div className="rounded-xl border border-border bg-card p-4 mb-8">
        <p className="text-[11px] font-display font-semibold tracking-[0.2em] uppercase text-primary/70 mb-4">
          Scenario's ({scenarios.filter((s) => s.active).length} actief) — vul een datum om in te plannen
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button size="sm" variant="secondary" onClick={autoSchedule} disabled={planning} className="gap-2">
            <Calendar className="w-3.5 h-3.5" />
            {planning ? "Plannen..." : "Auto-plan op werkdagen"}
          </Button>
          <Button size="sm" variant="ghost" onClick={clearSchedule}>
            Planning wissen
          </Button>
        </div>
        <div className="space-y-2">
          {scenarios.map((s) => (
            <div key={s.id} className="flex items-center gap-3 text-sm">
              <label className="flex items-center gap-2 shrink-0">
                <input type="checkbox" checked={s.active} onChange={() => toggleScenario(s)} />
              </label>
              <span className="flex-1 text-foreground/90">{s.title}</span>
              <div className="flex items-center gap-1 shrink-0">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="date"
                  value={s.scheduled_date || ""}
                  onChange={(e) => setSchedule(s, e.target.value)}
                  className="bg-background border border-border rounded px-2 py-1 text-xs"
                />
              </div>
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
