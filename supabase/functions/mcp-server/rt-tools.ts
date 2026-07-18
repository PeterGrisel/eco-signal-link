// GTM Runtime-tools voor de mcp-server (Rebel Force rt_*-laag).
// Registratie gebeurt vanuit index.ts, achter de bestaande mcp_api_keys-auth.
// Alle tools: service-role client, gestructureerde JSON-errors (nooit stack
// traces of secrets) en een spoor in rt_audit_logs (actor_type 'system').
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { validateSchema } from "../_shared/rt-validation.ts";

type ToolResult = { content: { type: "text"; text: string }[] };

interface McpToolDef {
  description: string;
  inputSchema: Record<string, unknown>;
  // deno-lint-ignore no-explicit-any
  handler: (input: any) => Promise<ToolResult> | ToolResult;
}

export interface McpRegistry {
  tool(name: string, def: McpToolDef): void;
}

function ok(payload: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] };
}

function toolError(code: string, message: string, extra?: Record<string, unknown>): ToolResult {
  return ok({ error: { code, message, ...(extra ?? {}) } });
}

function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map((n) => parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}

interface OrgRow {
  id: string;
  name: string;
  slug: string | null;
  status: string;
}

type TenantResolution = { org: OrgRow } | { error: ToolResult };

async function resolveTenant(supabase: SupabaseClient, tenant: unknown): Promise<TenantResolution> {
  if (typeof tenant !== "string" || tenant.trim().length === 0) {
    return { error: toolError("invalid_tenant", "Geef 'tenant' op als organisatie-slug of -naam") };
  }
  const needle = tenant.trim().toLowerCase();
  const { data: orgs, error } = await supabase
    .from("gp_organizations")
    .select("id, name, slug, status")
    .order("name");
  if (error) return { error: toolError("db_error", `Tenant-lookup mislukt: ${error.message}`) };

  const rows = (orgs ?? []) as OrgRow[];
  const org = rows.find((o) => (o.slug ?? "").toLowerCase() === needle) ??
    rows.find((o) => o.name.toLowerCase() === needle);
  if (!org) {
    return {
      error: toolError("tenant_not_found", `Geen organisatie gevonden voor "${tenant}"`, {
        available: rows
          .filter((o) => o.status === "active")
          .map((o) => ({ slug: o.slug, name: o.name })),
      }),
    };
  }
  return { org };
}

async function audit(
  supabase: SupabaseClient,
  organizationId: string | null,
  action: string,
  entityType: string | null,
  entityId: string | null,
  detail: Record<string, unknown>,
): Promise<void> {
  const { error } = await supabase.from("rt_audit_logs").insert({
    organization_id: organizationId,
    actor_id: null,
    actor_type: "system",
    action,
    entity_type: entityType,
    entity_id: entityId,
    detail,
  });
  if (error) console.error("rt_audit_logs insert failed:", error.message);
}

export function registerRtTools(mcp: McpRegistry, supabase: SupabaseClient): void {
  // ── 1. start_workflow_run ──────────────────────────────────────────────

  mcp.tool("start_workflow_run", {
    description:
      "Start a GTM Runtime workflow run for a tenant: validates the input against the playbook version's input_schema and creates rt_workflow_runs + rt_step_runs (all queued). The runner that processes queued runs is Sprint 2 — this tool only queues.",
    inputSchema: {
      type: "object",
      properties: {
        tenant: { type: "string", description: "Organization slug or name" },
        playbook_key: { type: "string", description: "rt_playbooks.playbook_key, e.g. outbound_market_activation" },
        input: { type: "object", description: "Workflow input, validated against the version's input_schema" },
        version: { type: "string", description: "Optional playbook version; default: pinned version for the tenant, else the highest version" },
      },
      required: ["tenant", "playbook_key", "input"],
    },
    handler: async ({ tenant, playbook_key, input, version }: {
      tenant: string;
      playbook_key: string;
      input: Record<string, unknown>;
      version?: string;
    }) => {
      const resolved = await resolveTenant(supabase, tenant);
      if ("error" in resolved) return resolved.error;
      const org = resolved.org;

      if (input === null || typeof input !== "object" || Array.isArray(input)) {
        return toolError("invalid_input", "'input' moet een JSON-object zijn");
      }

      const { data: playbook, error: pbErr } = await supabase
        .from("rt_playbooks")
        .select("id, playbook_key, status")
        .eq("playbook_key", playbook_key)
        .maybeSingle();
      if (pbErr) return toolError("db_error", `Playbook-lookup mislukt: ${pbErr.message}`);
      if (!playbook || playbook.status !== "active") {
        return toolError("playbook_not_found", `Playbook "${playbook_key}" bestaat niet of is niet actief`);
      }

      const { data: versions, error: pvErr } = await supabase
        .from("rt_playbook_versions")
        .select("id, version, input_schema, status")
        .eq("playbook_id", playbook.id)
        .neq("status", "deprecated");
      if (pvErr) return toolError("db_error", `Versie-lookup mislukt: ${pvErr.message}`);

      type PvRow = { id: string; version: string; input_schema: unknown; status: string };
      const pvRows = (versions ?? []) as PvRow[];
      let pv: PvRow | undefined;
      if (version) {
        pv = pvRows.find((v) => v.version === version);
        if (!pv) {
          return toolError("playbook_version_not_found", `Versie "${version}" van "${playbook_key}" niet gevonden`, {
            available: pvRows.map((v) => v.version),
          });
        }
      } else {
        // Tenant-pin wint; anders hoogste versie (active boven draft).
        const { data: tp } = await supabase
          .from("rt_tenant_playbooks")
          .select("pinned_version_id")
          .eq("organization_id", org.id)
          .eq("playbook_id", playbook.id)
          .eq("is_active", true)
          .maybeSingle();
        if (tp?.pinned_version_id) pv = pvRows.find((v) => v.id === tp.pinned_version_id);
        if (!pv) {
          const sorted = [...pvRows].sort((a, b) =>
            a.status === b.status ? compareVersions(b.version, a.version) : a.status === "active" ? -1 : 1
          );
          pv = sorted[0];
        }
        if (!pv) return toolError("playbook_version_not_found", `Geen bruikbare versie voor "${playbook_key}"`);
      }

      const schemaErrors = validateSchema(pv.input_schema, input);
      if (schemaErrors.length > 0) {
        return toolError("input_validation_failed", "Input voldoet niet aan het input_schema van de playbook-versie", {
          details: schemaErrors.slice(0, 10),
        });
      }

      const { data: steps, error: stepsErr } = await supabase
        .from("rt_playbook_steps")
        .select("id, step_key, step_order, step_type, skill_version_id")
        .eq("playbook_version_id", pv.id)
        .order("step_order");
      if (stepsErr) return toolError("db_error", `Steps-lookup mislukt: ${stepsErr.message}`);
      if (!steps || steps.length === 0) {
        return toolError("playbook_has_no_steps", `Versie "${pv.version}" van "${playbook_key}" heeft geen steps`);
      }

      const { data: run, error: runErr } = await supabase
        .from("rt_workflow_runs")
        .insert({
          organization_id: org.id,
          playbook_version_id: pv.id,
          status: "queued",
          input,
          current_step_key: steps[0].step_key,
        })
        .select("id")
        .single();
      if (runErr) return toolError("db_error", `Run aanmaken mislukt: ${runErr.message}`);

      const { error: srErr } = await supabase.from("rt_step_runs").insert(
        steps.map((s: { id: string; skill_version_id: string | null }) => ({
          workflow_run_id: run.id,
          organization_id: org.id,
          playbook_step_id: s.id,
          skill_version_id: s.skill_version_id,
          status: "queued",
        })),
      );
      if (srErr) {
        // Geen run zonder steps achterlaten.
        await supabase.from("rt_workflow_runs").delete().eq("id", run.id);
        return toolError("db_error", `Step-runs aanmaken mislukt: ${srErr.message}`);
      }

      await audit(supabase, org.id, "run_queued", "rt_workflow_runs", run.id, {
        playbook_key,
        version: pv.version,
        steps: steps.length,
      });

      return ok({
        run_id: run.id,
        tenant: org.slug ?? org.name,
        playbook_key,
        version: pv.version,
        status: "queued",
        steps: steps.length,
        first_step_key: steps[0].step_key,
        note: "Run staat queued; de workflow-runner (Sprint 2) voert queued runs uit.",
      });
    },
  });

  // ── 2. get_run_status ──────────────────────────────────────────────────

  mcp.tool("get_run_status", {
    description: "Get the status of a workflow run: run status, all step runs (status, provider, cost, latency), total cost and open approvals.",
    inputSchema: {
      type: "object",
      properties: { run_id: { type: "string", description: "rt_workflow_runs.id (uuid)" } },
      required: ["run_id"],
    },
    handler: async ({ run_id }: { run_id: string }) => {
      const { data: run, error: runErr } = await supabase
        .from("rt_workflow_runs")
        .select("id, organization_id, playbook_version_id, status, current_step_key, cost_total, started_at, finished_at, error, created_at")
        .eq("id", run_id)
        .maybeSingle();
      if (runErr) return toolError("db_error", `Run-lookup mislukt: ${runErr.message}`);
      if (!run) return toolError("run_not_found", `Geen workflow run met id "${run_id}"`);

      const { data: stepRuns, error: srErr } = await supabase
        .from("rt_step_runs")
        .select("id, status, attempt, confidence, cost, latency_ms, started_at, finished_at, error, rt_playbook_steps(step_key, step_order, step_type), rt_providers(provider_key)")
        .eq("workflow_run_id", run_id);
      if (srErr) return toolError("db_error", `Step-runs-lookup mislukt: ${srErr.message}`);

      type StepRow = {
        id: string;
        status: string;
        attempt: number;
        confidence: number | null;
        cost: number | null;
        latency_ms: number | null;
        started_at: string | null;
        finished_at: string | null;
        error: unknown;
        rt_playbook_steps: { step_key: string; step_order: number; step_type: string } | null;
        rt_providers: { provider_key: string } | null;
      };
      const steps = ((stepRuns ?? []) as StepRow[])
        .map((s) => ({
          step_run_id: s.id,
          step_key: s.rt_playbook_steps?.step_key ?? null,
          step_order: s.rt_playbook_steps?.step_order ?? null,
          step_type: s.rt_playbook_steps?.step_type ?? null,
          status: s.status,
          attempt: s.attempt,
          provider: s.rt_providers?.provider_key ?? null,
          confidence: s.confidence,
          cost: s.cost,
          latency_ms: s.latency_ms,
          started_at: s.started_at,
          finished_at: s.finished_at,
          error: s.error,
        }))
        .sort((a, b) => (a.step_order ?? 0) - (b.step_order ?? 0));

      const { data: approvals, error: apErr } = await supabase
        .from("rt_approvals")
        .select("id, approval_type, status, created_at")
        .eq("workflow_run_id", run_id)
        .eq("status", "pending");
      if (apErr) return toolError("db_error", `Approvals-lookup mislukt: ${apErr.message}`);

      await audit(supabase, run.organization_id, "run_status_viewed", "rt_workflow_runs", run.id, {});

      return ok({
        run: {
          id: run.id,
          status: run.status,
          current_step_key: run.current_step_key,
          started_at: run.started_at,
          finished_at: run.finished_at,
          error: run.error,
          created_at: run.created_at,
        },
        steps,
        cost_total: run.cost_total,
        cost_steps_sum: steps.reduce((sum, s) => sum + (s.cost ?? 0), 0),
        pending_approvals: approvals ?? [],
      });
    },
  });

  // ── 3. list_pending_approvals ──────────────────────────────────────────

  mcp.tool("list_pending_approvals", {
    description: "List pending approvals (rt_approvals, status pending) with type, payload summary and run context. Without 'tenant': across all tenants.",
    inputSchema: {
      type: "object",
      properties: {
        tenant: { type: "string", description: "Optional organization slug or name" },
      },
    },
    handler: async ({ tenant }: { tenant?: string }) => {
      let orgId: string | null = null;
      let orgLabel: string | null = null;
      if (tenant !== undefined) {
        const resolved = await resolveTenant(supabase, tenant);
        if ("error" in resolved) return resolved.error;
        orgId = resolved.org.id;
        orgLabel = resolved.org.slug ?? resolved.org.name;
      }

      let q = supabase
        .from("rt_approvals")
        .select("id, organization_id, workflow_run_id, step_run_id, approval_type, payload, created_at, gp_organizations(name, slug), rt_workflow_runs(status, current_step_key)")
        .eq("status", "pending")
        .order("created_at", { ascending: true });
      if (orgId) q = q.eq("organization_id", orgId);
      const { data, error } = await q;
      if (error) return toolError("db_error", `Approvals-lookup mislukt: ${error.message}`);

      type ApRow = {
        id: string;
        organization_id: string;
        workflow_run_id: string;
        step_run_id: string;
        approval_type: string;
        payload: unknown;
        created_at: string;
        gp_organizations: { name: string; slug: string | null } | null;
        rt_workflow_runs: { status: string; current_step_key: string | null } | null;
      };
      const approvals = ((data ?? []) as ApRow[]).map((a) => {
        const full = JSON.stringify(a.payload);
        return {
          approval_id: a.id,
          tenant: a.gp_organizations?.slug ?? a.gp_organizations?.name ?? a.organization_id,
          approval_type: a.approval_type,
          workflow_run_id: a.workflow_run_id,
          step_run_id: a.step_run_id,
          run_status: a.rt_workflow_runs?.status ?? null,
          current_step_key: a.rt_workflow_runs?.current_step_key ?? null,
          created_at: a.created_at,
          payload_summary: full.length > 500 ? `${full.slice(0, 500)}… (${full.length} chars totaal)` : full,
        };
      });

      await audit(supabase, orgId, "approvals_viewed", "rt_approvals", null, {
        tenant: orgLabel,
        count: approvals.length,
      });

      return ok({ pending: approvals.length, approvals });
    },
  });

  // ── 4. decide_approval ─────────────────────────────────────────────────

  mcp.tool("decide_approval", {
    description: "Decide a pending approval: approved, rejected or revision_required. Updates rt_approvals, the linked step run and workflow run, and writes an rt_audit_logs entry.",
    inputSchema: {
      type: "object",
      properties: {
        approval_id: { type: "string", description: "rt_approvals.id (uuid)" },
        decision: { type: "string", enum: ["approved", "rejected", "revision_required"] },
        notes: { type: "string", description: "Optional decision notes" },
      },
      required: ["approval_id", "decision"],
    },
    handler: async ({ approval_id, decision, notes }: { approval_id: string; decision: string; notes?: string }) => {
      if (!["approved", "rejected", "revision_required"].includes(decision)) {
        return toolError("invalid_decision", "decision moet approved, rejected of revision_required zijn");
      }

      const { data: approval, error: apErr } = await supabase
        .from("rt_approvals")
        .select("id, organization_id, workflow_run_id, step_run_id, approval_type, status")
        .eq("id", approval_id)
        .maybeSingle();
      if (apErr) return toolError("db_error", `Approval-lookup mislukt: ${apErr.message}`);
      if (!approval) return toolError("approval_not_found", `Geen approval met id "${approval_id}"`);
      if (approval.status !== "pending") {
        return toolError("approval_already_decided", `Approval heeft al status "${approval.status}"`);
      }

      const now = new Date().toISOString();
      const { error: updErr } = await supabase
        .from("rt_approvals")
        .update({
          status: decision,
          decision_notes: notes ?? null,
          // MCP-calls hebben geen menselijke actor; approved_by blijft null.
          approved_by: null,
          decided_at: now,
        })
        .eq("id", approval.id);
      if (updErr) return toolError("db_error", `Approval bijwerken mislukt: ${updErr.message}`);

      // Statusmodel: approved => step succeeded + run approved;
      // rejected => step failed + run rejected; revision_required => step
      // blijft waiting_for_approval, run naar revision_required.
      let stepStatus: string | null = null;
      let runPatch: Record<string, unknown> = {};
      if (decision === "approved") {
        stepStatus = "succeeded";
        runPatch = { status: "approved" };
      } else if (decision === "rejected") {
        stepStatus = "failed";
        runPatch = { status: "rejected", finished_at: now };
      } else {
        runPatch = { status: "revision_required" };
      }

      if (stepStatus) {
        const stepPatch: Record<string, unknown> = { status: stepStatus, finished_at: now };
        if (decision === "rejected") {
          stepPatch.error = { code: "approval_rejected", message: "Approval is afgewezen", retryable: false };
        }
        const { error: srErr } = await supabase.from("rt_step_runs").update(stepPatch).eq("id", approval.step_run_id);
        if (srErr) return toolError("db_error", `Step run bijwerken mislukt: ${srErr.message}`);
      }
      const { error: wrErr } = await supabase.from("rt_workflow_runs").update(runPatch).eq("id", approval.workflow_run_id);
      if (wrErr) return toolError("db_error", `Workflow run bijwerken mislukt: ${wrErr.message}`);

      await audit(supabase, approval.organization_id, "approval_decided", "rt_approvals", approval.id, {
        decision,
        approval_type: approval.approval_type,
        workflow_run_id: approval.workflow_run_id,
        step_run_id: approval.step_run_id,
        has_notes: typeof notes === "string" && notes.length > 0,
      });

      return ok({
        approval_id: approval.id,
        decision,
        decided_at: now,
        step_run_status: stepStatus ?? "waiting_for_approval",
        workflow_run_status: runPatch.status,
      });
    },
  });

  // ── 5. execute_skill ───────────────────────────────────────────────────

  mcp.tool("execute_skill", {
    description: "Execute a single GTM Runtime skill for a tenant via the rt-execute-skill executor (input/output validation, provider routing, logging). Returns the full skill execution result.",
    inputSchema: {
      type: "object",
      properties: {
        tenant: { type: "string", description: "Organization slug or name" },
        skill_key: { type: "string", description: "rt_skills.skill_key, e.g. verify_email" },
        input: { type: "object", description: "Skill input, validated against the version's input_schema" },
        version: { type: "string", description: "Optional skill version; default: highest active version" },
        step_run_id: { type: "string", description: "Optional rt_step_runs.id for idempotency and step tracking" },
      },
      required: ["tenant", "skill_key", "input"],
    },
    handler: async ({ tenant, skill_key, input, version, step_run_id }: {
      tenant: string;
      skill_key: string;
      input: Record<string, unknown>;
      version?: string;
      step_run_id?: string;
    }) => {
      const resolved = await resolveTenant(supabase, tenant);
      if ("error" in resolved) return resolved.error;
      const org = resolved.org;

      const internalToken = Deno.env.get("RT_INTERNAL_TOKEN");
      if (!internalToken) {
        return toolError("rt_internal_token_missing", "RT_INTERNAL_TOKEN is niet geconfigureerd op de mcp-server");
      }

      let result: unknown;
      let httpStatus: number;
      try {
        const res = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/rt-execute-skill`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-rt-internal-token": internalToken },
          body: JSON.stringify({
            tenantId: org.id,
            skillKey: skill_key,
            skillVersion: version,
            input,
            stepRunId: step_run_id,
          }),
        });
        httpStatus = res.status;
        result = await res.json();
      } catch {
        return toolError("executor_unreachable", "rt-execute-skill was niet bereikbaar of gaf geen geldige JSON");
      }

      const r = result as { status?: string; provider?: string; latencyMs?: number; cost?: number } | null;
      await audit(supabase, org.id, "skill_executed", "rt_skills", null, {
        skill_key,
        version: version ?? null,
        step_run_id: step_run_id ?? null,
        status: r?.status ?? `http_${httpStatus}`,
        provider: r?.provider ?? null,
        latency_ms: r?.latencyMs ?? null,
        cost: r?.cost ?? null,
      });

      return ok(result);
    },
  });

  // ── 6. get_tenant_costs ────────────────────────────────────────────────

  mcp.tool("get_tenant_costs", {
    description: "Aggregate provider costs for a tenant from rt_provider_calls: total plus per provider and per skill, with call counts, success rate and average latency. Default period: the current month.",
    inputSchema: {
      type: "object",
      properties: {
        tenant: { type: "string", description: "Organization slug or name" },
        from: { type: "string", description: "ISO start date/time (inclusive); default: first day of the current month" },
        to: { type: "string", description: "ISO end date/time (exclusive); default: now" },
      },
      required: ["tenant"],
    },
    handler: async ({ tenant, from, to }: { tenant: string; from?: string; to?: string }) => {
      const resolved = await resolveTenant(supabase, tenant);
      if ("error" in resolved) return resolved.error;
      const org = resolved.org;

      const now = new Date();
      const fromIso = from ?? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
      const toIso = to ?? now.toISOString();
      if (Number.isNaN(Date.parse(fromIso)) || Number.isNaN(Date.parse(toIso))) {
        return toolError("invalid_period", "'from' en 'to' moeten geldige ISO-datums zijn");
      }

      type CallRow = {
        status: string;
        cost: number | null;
        latency_ms: number | null;
        rt_providers: { provider_key: string } | null;
        rt_skill_versions: { version: string; rt_skills: { skill_key: string } | null } | null;
      };
      // PostgREST pagineert op 1000 rijen; doorlopen tot alles binnen is.
      const calls: CallRow[] = [];
      const PAGE = 1000;
      const MAX_PAGES = 20;
      let truncated = false;
      for (let page = 0; page < MAX_PAGES; page++) {
        const { data, error } = await supabase
          .from("rt_provider_calls")
          .select("status, cost, latency_ms, rt_providers(provider_key), rt_skill_versions(version, rt_skills(skill_key))")
          .eq("organization_id", org.id)
          .gte("created_at", fromIso)
          .lt("created_at", toIso)
          .order("created_at", { ascending: true })
          .range(page * PAGE, page * PAGE + PAGE - 1);
        if (error) return toolError("db_error", `Calls-lookup mislukt: ${error.message}`);
        calls.push(...((data ?? []) as CallRow[]));
        if (!data || data.length < PAGE) break;
        if (page === MAX_PAGES - 1) truncated = true;
      }

      interface Agg {
        calls: number;
        cost: number;
        success: number;
        latencySum: number;
        latencyCount: number;
      }
      const emptyAgg = (): Agg => ({ calls: 0, cost: 0, success: 0, latencySum: 0, latencyCount: 0 });
      const add = (agg: Agg, c: CallRow) => {
        agg.calls++;
        agg.cost += c.cost ?? 0;
        if (c.status === "success") agg.success++;
        if (typeof c.latency_ms === "number") {
          agg.latencySum += c.latency_ms;
          agg.latencyCount++;
        }
      };
      const finish = (agg: Agg) => ({
        calls: agg.calls,
        cost: Math.round(agg.cost * 10000) / 10000,
        success_rate: agg.calls > 0 ? Math.round((agg.success / agg.calls) * 1000) / 1000 : null,
        avg_latency_ms: agg.latencyCount > 0 ? Math.round(agg.latencySum / agg.latencyCount) : null,
      });

      const total = emptyAgg();
      const byProvider = new Map<string, Agg>();
      const bySkill = new Map<string, Agg>();
      for (const c of calls) {
        add(total, c);
        const pk = c.rt_providers?.provider_key ?? "unknown";
        if (!byProvider.has(pk)) byProvider.set(pk, emptyAgg());
        add(byProvider.get(pk)!, c);
        const sk = c.rt_skill_versions?.rt_skills?.skill_key ?? "unknown";
        if (!bySkill.has(sk)) bySkill.set(sk, emptyAgg());
        add(bySkill.get(sk)!, c);
      }

      await audit(supabase, org.id, "costs_viewed", "rt_provider_calls", null, {
        from: fromIso,
        to: toIso,
        calls: total.calls,
      });

      return ok({
        tenant: org.slug ?? org.name,
        period: { from: fromIso, to: toIso },
        total: finish(total),
        by_provider: Object.fromEntries([...byProvider.entries()].map(([k, v]) => [k, finish(v)])),
        by_skill: Object.fromEntries([...bySkill.entries()].map(([k, v]) => [k, finish(v)])),
        ...(truncated ? { warning: `Meer dan ${MAX_PAGES * PAGE} calls in de periode; aggregatie is afgekapt` } : {}),
      });
    },
  });
}
