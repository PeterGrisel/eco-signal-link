import { usePortal } from "./PortalContext";
import { supabase, useOrgQuery, statusColor } from "./lib";
import { PageHeader } from "./PageHeader";
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";

async function load(orgId: string) {
  const { data: project } = await supabase.from("gp_onboarding_projects").select("*").eq("organization_id", orgId).maybeSingle();
  const { data: tasks } = await supabase.from("gp_onboarding_tasks").select("*").eq("organization_id", orgId).order("step_order");
  return { project, tasks: (tasks ?? []) as any[] };
}

const iconFor = (s: string) =>
  s === "done" ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
  : s === "in_progress" ? <Clock className="h-5 w-5 text-primary" />
  : s === "waiting_client" ? <AlertCircle className="h-5 w-5 text-yellow-500" />
  : <Circle className="h-5 w-5 text-muted-foreground" />;

export default function Onboarding() {
  const { currentOrgId } = usePortal();
  const { data, loading } = useOrgQuery(currentOrgId, load);
  if (loading || !data) return <p className="text-muted-foreground">Laden…</p>;

  const done = data.tasks.filter((t) => t.status === "done").length;
  const pct = Math.round((done / Math.max(1, data.tasks.length)) * 100);

  return (
    <div>
      <PageHeader eyebrow="Onboarding" title="Uw groeimachine wordt opgebouwd" subtitle="Zeven mijlpalen van intake tot eerste optimalisatie. Wij houden u op de hoogte en vragen input waar nodig." />
      <div className="rounded-xl border border-border bg-card p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-display font-semibold text-foreground">Voortgang</span>
          <span className="text-sm text-muted-foreground">{done}/{data.tasks.length} · {pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} /></div>
      </div>

      <div className="space-y-3">
        {data.tasks.map((t) => (
          <div key={t.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start gap-4">
              <div className="pt-0.5">{iconFor(t.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-display">Stap {t.step_order}</p>
                    <h3 className="font-display font-bold text-foreground">{t.title}</h3>
                  </div>
                  <span className={`text-[10px] uppercase font-display border rounded px-1.5 py-0.5 shrink-0 ${statusColor(t.status)}`}>{t.status.replace("_", " ")}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{t.description}</p>
                <div className="grid sm:grid-cols-3 gap-3 text-xs mt-3">
                  <div><span className="text-muted-foreground">Eigenaar:</span> <span className="text-foreground">{t.owner}</span></div>
                  <div><span className="text-muted-foreground">Deadline:</span> <span className="text-foreground">{t.deadline}</span></div>
                  <div><span className="text-muted-foreground">Oplevering:</span> <span className="text-foreground">{t.deliverable}</span></div>
                </div>
                {t.client_action && t.status === "waiting_client" && (
                  <div className="mt-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs">
                    <span className="text-yellow-500 font-semibold">Actie van u: </span>
                    <span className="text-foreground">{t.client_action}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}