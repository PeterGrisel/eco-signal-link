import { useState } from "react";
import { usePortal } from "./PortalContext";
import { rtdb, useOrgQuery, runStatusColor } from "./lib";
import { PageHeader } from "./PageHeader";
import { CheckCircle2, XCircle, RotateCcw, ClipboardCheck } from "lucide-react";

// Goedkeuringen uit de GTM Runtime (rt_approvals). RLS staat orgleden toe om
// te lezen én te beslissen (status/notes updaten); de workflow-runner pakt
// besliste approvals daarna op.

type Approval = {
  id: string;
  approval_type: string;
  status: string;
  payload: unknown;
  decision_notes: string | null;
  decided_at: string | null;
  created_at: string;
  workflow_run_id: string;
};

const TYPE_LABELS: Record<string, string> = {
  account_list: "Accountlijst",
  campaign_angle: "Campagne-invalshoek",
  messages: "Berichten",
  campaign_launch: "Campagne-lancering",
};

async function loadApprovals(orgId: string): Promise<Approval[]> {
  const { data } = await rtdb
    .from("rt_approvals")
    .select("id, approval_type, status, payload, decision_notes, decided_at, created_at, workflow_run_id")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })
    .limit(50);
  return (data ?? []) as Approval[];
}

function PayloadView({ payload }: { payload: unknown }) {
  const text = JSON.stringify(payload, null, 2);
  return (
    <details className="mt-2">
      <summary className="text-xs text-primary cursor-pointer">Details bekijken</summary>
      <pre className="mt-2 text-xs bg-background/60 border border-border rounded-lg p-3 overflow-x-auto max-h-72 overflow-y-auto whitespace-pre-wrap">{text}</pre>
    </details>
  );
}

function PendingCard({ approval, onDecided }: { approval: Approval; onDecided: () => void }) {
  const { session } = usePortal();
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const decide = async (decision: "approved" | "rejected" | "revision_required") => {
    setBusy(true);
    setError(null);
    const { error: err } = await rtdb
      .from("rt_approvals")
      .update({
        status: decision,
        decision_notes: notes.trim() || null,
        approved_by: session?.user.id ?? null,
        decided_at: new Date().toISOString(),
      })
      .eq("id", approval.id)
      .eq("status", "pending");
    setBusy(false);
    if (err) setError("Beslissing opslaan mislukt. Probeer opnieuw.");
    else onDecided();
  };

  return (
    <div className="rounded-xl border border-yellow-500/30 bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display font-bold text-foreground">{TYPE_LABELS[approval.approval_type] ?? approval.approval_type}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Aangevraagd op {new Date(approval.created_at).toLocaleString("nl-NL")}
          </p>
        </div>
        <span className={`text-[10px] uppercase font-display font-semibold border rounded px-2 py-1 ${runStatusColor("pending")}`}>wacht op u</span>
      </div>
      <PayloadView payload={approval.payload} />
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Toelichting (optioneel, verplicht bij revisie)"
        className="mt-3 w-full text-sm rounded-lg border border-border bg-background/60 p-2 min-h-[60px]"
      />
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      <div className="flex flex-wrap gap-2 mt-3">
        <button
          onClick={() => decide("approved")}
          disabled={busy}
          className="flex items-center gap-1.5 text-sm font-semibold rounded-lg px-3 py-1.5 bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/25 disabled:opacity-50"
        >
          <CheckCircle2 className="h-4 w-4" /> Goedkeuren
        </button>
        <button
          onClick={() => decide("revision_required")}
          disabled={busy || notes.trim().length === 0}
          title={notes.trim().length === 0 ? "Geef een toelichting bij een revisieverzoek" : undefined}
          className="flex items-center gap-1.5 text-sm font-semibold rounded-lg px-3 py-1.5 bg-yellow-500/15 text-yellow-500 border border-yellow-500/30 hover:bg-yellow-500/25 disabled:opacity-50"
        >
          <RotateCcw className="h-4 w-4" /> Revisie
        </button>
        <button
          onClick={() => decide("rejected")}
          disabled={busy}
          className="flex items-center gap-1.5 text-sm font-semibold rounded-lg px-3 py-1.5 bg-red-500/15 text-red-500 border border-red-500/30 hover:bg-red-500/25 disabled:opacity-50"
        >
          <XCircle className="h-4 w-4" /> Afwijzen
        </button>
      </div>
    </div>
  );
}

export default function Approvals() {
  const { currentOrgId } = usePortal();
  const { data, loading, reload } = useOrgQuery(currentOrgId, loadApprovals);

  if (loading || !data) return <div className="text-muted-foreground">Goedkeuringen laden…</div>;

  const pending = data.filter((a) => a.status === "pending");
  const decided = data.filter((a) => a.status !== "pending");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="GTM Runtime"
        title="Goedkeuringen"
        subtitle="Op deze momenten pauzeert uw groeimachine bewust: accountlijsten en berichten gaan pas verder nadat u ze heeft goedgekeurd."
      />

      {pending.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <ClipboardCheck className="h-8 w-8 text-primary mx-auto mb-3" />
          <p className="font-display font-semibold text-foreground">Niets te beoordelen</p>
          <p className="text-sm text-muted-foreground mt-1">Zodra een workflow uw goedkeuring nodig heeft, verschijnt die hier.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((a) => <PendingCard key={a.id} approval={a} onDecided={reload} />)}
        </div>
      )}

      {decided.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-display font-bold text-foreground mb-4">Eerder beslist</h3>
          <div className="divide-y divide-border">
            {decided.map((a) => (
              <div key={a.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{TYPE_LABELS[a.approval_type] ?? a.approval_type}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {a.decided_at ? new Date(a.decided_at).toLocaleString("nl-NL") : ""}
                    {a.decision_notes ? ` · ${a.decision_notes}` : ""}
                  </p>
                </div>
                <span className={`text-[10px] uppercase font-display font-semibold border rounded px-2 py-1 ${runStatusColor(a.status)}`}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
