import { useEffect, useState } from "react";
import { usePortal } from "./PortalContext";
import { rtdb, useOrgQuery, runStatusColor } from "./lib";
import { PageHeader } from "./PageHeader";
import { ChevronDown, ChevronRight, Workflow } from "lucide-react";

// Workflow runs uit de GTM Runtime (rt_workflow_runs + rt_step_runs).
// Lezen is via RLS toegestaan voor orgleden; runs starten gebeurt (v0.1)
// door Rebel Force via de runtime, niet vanuit dit portaal.

type Run = {
  id: string;
  status: string;
  current_step_key: string | null;
  cost_total: number;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
  error: { code?: string; message?: string } | null;
  playbook_version: { version: string; playbook: { name: string; playbook_key: string } | null } | null;
};

type StepRun = {
  id: string;
  status: string;
  attempt: number;
  cost: number | null;
  latency_ms: number | null;
  finished_at: string | null;
  error: { code?: string; message?: string } | null;
  step: { step_key: string; name: string; step_order: number; step_type: string } | null;
  provider: { provider_key: string } | null;
};

const STATUS_LABELS: Record<string, string> = {
  queued: "in wachtrij",
  running: "actief",
  waiting_for_approval: "wacht op goedkeuring",
  approved: "goedgekeurd",
  rejected: "afgewezen",
  revision_required: "revisie nodig",
  completed: "afgerond",
  succeeded: "gelukt",
  failed: "mislukt",
  cancelled: "geannuleerd",
  skipped: "overgeslagen",
};

async function loadRuns(orgId: string): Promise<Run[]> {
  const { data } = await rtdb
    .from("rt_workflow_runs")
    .select("id, status, current_step_key, cost_total, started_at, finished_at, created_at, error, playbook_version:rt_playbook_versions(version, playbook:rt_playbooks(name, playbook_key))")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })
    .limit(30);
  return (data ?? []) as Run[];
}

function StepTimeline({ runId }: { runId: string }) {
  const [steps, setSteps] = useState<StepRun[] | null>(null);

  useEffect(() => {
    rtdb
      .from("rt_step_runs")
      .select("id, status, attempt, cost, latency_ms, finished_at, error, step:rt_playbook_steps(step_key, name, step_order, step_type), provider:rt_providers(provider_key)")
      .eq("workflow_run_id", runId)
      .then(({ data }: { data: StepRun[] | null }) => {
        const sorted = [...(data ?? [])].sort((a, b) => (a.step?.step_order ?? 0) - (b.step?.step_order ?? 0));
        setSteps(sorted);
      });
  }, [runId]);

  if (!steps) return <p className="text-xs text-muted-foreground py-3">Stappen laden…</p>;
  if (steps.length === 0) return <p className="text-xs text-muted-foreground py-3">Nog geen stappen voor deze run.</p>;

  return (
    <div className="divide-y divide-border/60 border-t border-border/60 mt-3">
      {steps.map((s) => (
        <div key={s.id} className="py-2.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-foreground truncate">
              <span className="text-muted-foreground mr-2">{s.step?.step_order ?? "–"}.</span>
              {s.step?.name ?? s.step?.step_key ?? "stap"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {s.step?.step_type === "human_approval" ? "Goedkeuringsmoment" : s.provider?.provider_key ?? ""}
              {s.latency_ms != null ? ` · ${(s.latency_ms / 1000).toFixed(1)}s` : ""}
              {s.cost != null && s.cost > 0 ? ` · €${Number(s.cost).toFixed(2)}` : ""}
              {s.attempt > 1 ? ` · poging ${s.attempt}` : ""}
              {s.error?.message ? ` · ${s.error.message}` : ""}
            </p>
          </div>
          <span className={`shrink-0 text-[10px] uppercase font-display font-semibold border rounded px-2 py-1 ${runStatusColor(s.status)}`}>
            {STATUS_LABELS[s.status] ?? s.status}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Runs() {
  const { currentOrgId } = usePortal();
  const { data, loading } = useOrgQuery(currentOrgId, loadRuns);
  const [openId, setOpenId] = useState<string | null>(null);

  if (loading || !data) return <div className="text-muted-foreground">Workflow runs laden…</div>;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="GTM Runtime"
        title="Workflow runs"
        subtitle="Elke run doorloopt de stappen van uw playbook: accounts zoeken, verrijken, scoren, uw goedkeuring, en activatie."
      />

      {data.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <Workflow className="h-8 w-8 text-primary mx-auto mb-3" />
          <p className="font-display font-semibold text-foreground">Nog geen workflow runs</p>
          <p className="text-sm text-muted-foreground mt-1">Zodra Rebel Force een playbook voor u start, volgt u hier de voortgang per stap.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((run) => {
            const open = openId === run.id;
            return (
              <div key={run.id} className="rounded-xl border border-border bg-card p-4">
                <button onClick={() => setOpenId(open ? null : run.id)} className="w-full flex items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-2 min-w-0">
                    {open ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-sm font-display font-semibold text-foreground truncate">
                        {run.playbook_version?.playbook?.name ?? "Playbook"}
                        <span className="text-muted-foreground font-normal"> · v{run.playbook_version?.version ?? "?"}</span>
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Gestart {new Date(run.started_at ?? run.created_at).toLocaleString("nl-NL")}
                        {run.current_step_key ? ` · stap: ${run.current_step_key}` : ""}
                        {Number(run.cost_total) > 0 ? ` · €${Number(run.cost_total).toFixed(2)}` : ""}
                      </p>
                    </div>
                  </div>
                  <span className={`shrink-0 text-[10px] uppercase font-display font-semibold border rounded px-2 py-1 ${runStatusColor(run.status)}`}>
                    {STATUS_LABELS[run.status] ?? run.status}
                  </span>
                </button>
                {run.error?.message && (
                  <p className="text-xs text-red-500 mt-2 ml-6">{run.error.code ? `${run.error.code}: ` : ""}{run.error.message}</p>
                )}
                {open && <div className="ml-6"><StepTimeline runId={run.id} /></div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
