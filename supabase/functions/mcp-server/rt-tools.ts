// GTM Runtime-tools voor de mcp-server (Rebel Force rt_*-laag).
// Registratie gebeurt vanuit index.ts, achter de bestaande mcp_api_keys-auth.
// Alle tools: service-role client, gestructureerde JSON-errors (nooit stack
// traces of secrets) en een spoor in rt_audit_logs (actor_type 'system').
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { compareVersions, validateSchema } from "../_shared/rt-validation.ts";
import {
  TELEMETRY_SKILLS,
  composeTelemetry,
  dailyTenantSkillLimit,
  startOfTodayUtcIso,
  strongestStairoidsMover,
  type TelemetrySnapshotRow,
} from "../_shared/rt-telemetry.ts";

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

export interface RtToolsOptions {
  // Gezet voor tenant-scoped API keys: alle tools werken dan uitsluitend op
  // deze organisatie (de tenant-parameter wordt genegeerd) en elke call wordt
  // met de key-naam ge-audit. Internal-only tools worden niet geregistreerd.
  orgLock?: { organizationId: string; keyName: string };
}

export function registerRtTools(
  mcp: McpRegistry,
  supabase: SupabaseClient,
  opts: RtToolsOptions = {},
): void {
  const orgLock = opts.orgLock ?? null;

  const auditLog = (
    organizationId: string | null,
    action: string,
    entityType: string | null,
    entityId: string | null,
    detail: Record<string, unknown>,
  ) =>
    audit(
      supabase,
      organizationId,
      action,
      entityType,
      entityId,
      orgLock ? { ...detail, api_key_name: orgLock.keyName } : detail,
    );

  // Bij een org-lock wordt de door de caller opgegeven tenant genegeerd en
  // altijd de organisatie van de key gebruikt.
  const resolveOrg = async (tenant: unknown): Promise<TenantResolution> => {
    if (!orgLock) return resolveTenant(supabase, tenant);
    const { data: org, error } = await supabase
      .from("gp_organizations")
      .select("id, name, slug, status")
      .eq("id", orgLock.organizationId)
      .maybeSingle();
    if (error) return { error: toolError("db_error", `Tenant-lookup mislukt: ${error.message}`) };
    if (!org) return { error: toolError("tenant_not_found", "Organisatie van deze API key bestaat niet meer") };
    return { org: org as OrgRow };
  };
  // ── 1. start_workflow_run (internal-only) ──────────────────────────────

  if (!orgLock) mcp.tool("start_workflow_run", {
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

      await auditLog(org.id, "run_queued", "rt_workflow_runs", run.id, {
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
      if (!run || (orgLock && run.organization_id !== orgLock.organizationId)) {
        return toolError("run_not_found", `Geen workflow run met id "${run_id}"`);
      }

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

      await auditLog(run.organization_id, "run_status_viewed", "rt_workflow_runs", run.id, {});

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
      if (orgLock || tenant !== undefined) {
        const resolved = await resolveOrg(tenant);
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

      await auditLog(orgId, "approvals_viewed", "rt_approvals", null, {
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
      if (!approval || (orgLock && approval.organization_id !== orgLock.organizationId)) {
        return toolError("approval_not_found", `Geen approval met id "${approval_id}"`);
      }
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

      await auditLog(approval.organization_id, "approval_decided", "rt_approvals", approval.id, {
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
  // Internal keys: alle skills, vrije tenant-keuze. Tenant keys: alleen
  // skills met tenant_callable=true, met een dag-limiet uit
  // rt_tenant_playbooks.config.limits.daily_tenant_skill_calls (default 25),
  // geteld via rt_audit_logs action 'tenant_skill_call'.

  mcp.tool("execute_skill", {
    description: orgLock
      ? "Execute a GTM Runtime skill for your organization (read skills only). Daily call limit applies. Returns the full skill execution result incl. snapshot_id/cached."
      : "Execute a single GTM Runtime skill for a tenant via the rt-execute-skill executor (input/output validation, provider routing, logging, snapshot cache). Returns the full skill execution result incl. snapshot_id/cached.",
    inputSchema: {
      type: "object",
      properties: {
        tenant: { type: "string", description: "Organization slug or name (ignored for tenant-scoped API keys)" },
        skill_key: { type: "string", description: "rt_skills.skill_key, e.g. search_companies" },
        input: { type: "object", description: "Skill input, validated against the version's input_schema" },
        version: { type: "string", description: "Optional skill version; default: highest active version" },
        step_run_id: { type: "string", description: "Optional rt_step_runs.id for idempotency and step tracking" },
        force_refresh: { type: "boolean", description: "Skip the snapshot cache and force a fresh provider call" },
      },
      required: orgLock ? ["skill_key", "input"] : ["tenant", "skill_key", "input"],
    },
    handler: async ({ tenant, skill_key, input, version, step_run_id, force_refresh }: {
      tenant?: string;
      skill_key: string;
      input: Record<string, unknown>;
      version?: string;
      step_run_id?: string;
      force_refresh?: boolean;
    }) => {
      const resolved = await resolveOrg(tenant);
      if ("error" in resolved) return resolved.error;
      const org = resolved.org;

      let quota: { limit: number; used: number } | null = null;
      if (orgLock) {
        const { data: skillRow, error: skErr } = await supabase
          .from("rt_skills")
          .select("id, tenant_callable")
          .eq("skill_key", skill_key)
          .maybeSingle();
        if (skErr) return toolError("db_error", `Skill-lookup mislukt: ${skErr.message}`);
        if (!skillRow || skillRow.tenant_callable !== true) {
          return toolError("skill_not_callable", `Skill "${skill_key}" is niet beschikbaar via deze key`);
        }

        const { data: tps, error: tpErr } = await supabase
          .from("rt_tenant_playbooks")
          .select("config")
          .eq("organization_id", org.id)
          .eq("is_active", true);
        if (tpErr) return toolError("db_error", `Config-lookup mislukt: ${tpErr.message}`);
        const limit = dailyTenantSkillLimit((tps ?? [])[0]?.config ?? null);

        const { count, error: cntErr } = await supabase
          .from("rt_audit_logs")
          .select("id", { count: "exact", head: true })
          .eq("organization_id", org.id)
          .eq("action", "tenant_skill_call")
          .gte("created_at", startOfTodayUtcIso());
        if (cntErr) return toolError("db_error", `Quota-check mislukt: ${cntErr.message}`);
        const used = count ?? 0;
        if (used >= limit) {
          return toolError("daily_limit_reached", `Dagelijkse limiet van ${limit} skill-calls is bereikt; morgen weer beschikbaar`, {
            limit,
            used,
            remaining: 0,
          });
        }
        quota = { limit, used };
      }

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
            forceRefresh: force_refresh === true,
          }),
        });
        httpStatus = res.status;
        result = await res.json();
      } catch {
        return toolError("executor_unreachable", "rt-execute-skill was niet bereikbaar of gaf geen geldige JSON");
      }

      const r = result as { status?: string; provider?: string; latencyMs?: number; cost?: number; cached?: boolean } | null;
      // Tenant-calls tellen mee voor het dagquotum (action 'tenant_skill_call').
      await auditLog(org.id, orgLock ? "tenant_skill_call" : "skill_executed", "rt_skills", null, {
        skill_key,
        version: version ?? null,
        step_run_id: step_run_id ?? null,
        status: r?.status ?? `http_${httpStatus}`,
        provider: r?.provider ?? null,
        latency_ms: r?.latencyMs ?? null,
        cost: r?.cost ?? null,
        cached: r?.cached ?? null,
      });

      if (quota) {
        return ok({ ...(result as Record<string, unknown>), quota: { limit: quota.limit, remaining: quota.limit - quota.used - 1 } });
      }
      return ok(result);
    },
  });

  // ── 6. get_tenant_costs ────────────────────────────────────────────────

  mcp.tool("get_tenant_costs", {
    description: "Aggregate provider costs for a tenant from rt_provider_calls: total plus per provider and per skill, with call counts, success rate and average latency. Default period: the current month.",
    inputSchema: {
      type: "object",
      properties: {
        tenant: { type: "string", description: "Organization slug or name (ignored for tenant-scoped API keys)" },
        from: { type: "string", description: "ISO start date/time (inclusive); default: first day of the current month" },
        to: { type: "string", description: "ISO end date/time (exclusive); default: now" },
      },
      required: orgLock ? [] : ["tenant"],
    },
    handler: async ({ tenant, from, to }: { tenant?: string; from?: string; to?: string }) => {
      const resolved = await resolveOrg(tenant);
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

      await auditLog(org.id, "costs_viewed", "rt_provider_calls", null, {
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

  // ── 7. get_snapshot ────────────────────────────────────────────────────

  mcp.tool("get_snapshot", {
    description: "Get a persisted skill snapshot by id: metadata (skill, provider, created_at, row_count, expires_at) plus the payload (inline or fetched from Storage).",
    inputSchema: {
      type: "object",
      properties: { snapshot_id: { type: "string", description: "rt_snapshots.id (uuid)" } },
      required: ["snapshot_id"],
    },
    handler: async ({ snapshot_id }: { snapshot_id: string }) => {
      const { data: snap, error } = await supabase
        .from("rt_snapshots")
        .select("id, organization_id, skill_key, provider_key, payload, storage_path, row_count, created_at, expires_at")
        .eq("id", snapshot_id)
        .maybeSingle();
      if (error) return toolError("db_error", `Snapshot-lookup mislukt: ${error.message}`);
      if (!snap || (orgLock && snap.organization_id !== orgLock.organizationId)) {
        return toolError("snapshot_not_found", `Geen snapshot met id "${snapshot_id}"`);
      }

      let payload: unknown = snap.payload;
      if (payload == null && snap.storage_path) {
        const { data: file, error: dlErr } = await supabase.storage.from("rt-snapshots").download(snap.storage_path);
        if (dlErr || !file) return toolError("storage_error", "Snapshot-payload kon niet uit Storage worden gelezen");
        payload = JSON.parse(await file.text());
      }

      await auditLog(snap.organization_id, "snapshot_viewed", "rt_snapshots", snap.id, { skill_key: snap.skill_key });

      return ok({
        snapshot_id: snap.id,
        skill_key: snap.skill_key,
        provider_key: snap.provider_key,
        row_count: snap.row_count,
        created_at: snap.created_at,
        expires_at: snap.expires_at,
        payload,
      });
    },
  });

  // ── 8. get_daily_brief ─────────────────────────────────────────────────

  mcp.tool("get_daily_brief", {
    description: "One aggregation for the client's morning session: new signals (24h), accounts that warmed up this week, open approvals, active workflow runs, this month's costs, open service requests and a telemetry summary — plus a short Dutch 'focus' field.",
    inputSchema: {
      type: "object",
      properties: { tenant: { type: "string", description: "Organization slug or name (ignored for tenant-scoped API keys)" } },
      required: orgLock ? [] : ["tenant"],
    },
    handler: async ({ tenant }: { tenant?: string }) => {
      const resolved = await resolveOrg(tenant);
      if ("error" in resolved) return resolved.error;
      const org = resolved.org;

      const now = new Date();
      const dayAgo = new Date(now.getTime() - 24 * 3_600_000).toISOString();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 3_600_000).toISOString();
      const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();

      const [signalsQ, weekSignalsQ, approvalsQ, runsQ, costQ, serviceQ, snapsQ] = await Promise.all([
        supabase
          .from("gp_signals")
          .select("id, signal_type, summary, recommended_action, priority, account:gp_accounts(name)")
          .eq("organization_id", org.id)
          .gte("created_at", dayAgo)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("gp_signals")
          .select("account:gp_accounts(id, name, warmth)")
          .eq("organization_id", org.id)
          .gte("created_at", weekAgo)
          .limit(200),
        supabase
          .from("rt_approvals")
          .select("id, approval_type, created_at")
          .eq("organization_id", org.id)
          .eq("status", "pending"),
        supabase
          .from("rt_workflow_runs")
          .select("id, status, current_step_key, playbook_version:rt_playbook_versions(version, playbook:rt_playbooks(name))")
          .eq("organization_id", org.id)
          .in("status", ["queued", "running", "waiting_for_approval", "approved", "revision_required"]),
        supabase
          .from("rt_provider_calls")
          .select("cost")
          .eq("organization_id", org.id)
          .gte("created_at", monthStart)
          .limit(2000),
        supabase
          .from("gp_service_requests")
          .select("id, title, priority, status")
          .eq("organization_id", org.id)
          .not("status", "in", "(resolved,closed)")
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("rt_snapshots")
          .select("skill_key, payload, created_at, expires_at")
          .eq("organization_id", org.id)
          .in("skill_key", TELEMETRY_SKILLS.map((s) => s.skillKey))
          .gt("expires_at", now.toISOString())
          .order("created_at", { ascending: false })
          .limit(12),
      ]);

      // Accounts die deze week warm/sales_ready werden: benaderd via de
      // accounts met signalen in de afgelopen 7 dagen (gp_accounts heeft geen
      // warmth-wijzigingstijd).
      const movedMap = new Map<string, { name: string; warmth: string }>();
      for (const row of (weekSignalsQ.data ?? []) as { account: { id: string; name: string; warmth: string } | null }[]) {
        const a = row.account;
        if (a && ["warm", "sales_ready"].includes(a.warmth)) movedMap.set(a.id, { name: a.name, warmth: a.warmth });
      }

      const costMonth = Math.round(
        ((costQ.data ?? []) as { cost: number | null }[]).reduce((s, c) => s + (c.cost ?? 0), 0) * 100,
      ) / 100;

      // Telemetrie-regels (max 4) uit de laatste snapshots.
      const snaps = (snapsQ.data ?? []) as TelemetrySnapshotRow[];
      const latestBySkill = new Map<string, TelemetrySnapshotRow[]>();
      for (const s of snaps) {
        const arr = latestBySkill.get(s.skill_key) ?? [];
        arr.push(s);
        latestBySkill.set(s.skill_key, arr);
      }
      const telemetryLines: string[] = [];
      const pipedriveSnap = (latestBySkill.get("pull_pipedrive_stats") ?? [])[0]?.payload as Record<string, any> | undefined;
      if (pipedriveSnap?.pipedrive?.open) {
        const open = pipedriveSnap.pipedrive.open;
        telemetryLines.push(`Open pipeline: ${open.count ?? "?"} deals, €${Number(open.value ?? 0).toLocaleString("nl-NL")}`);
      }
      const heyreachSnap = (latestBySkill.get("pull_heyreach_stats") ?? [])[0]?.payload as Record<string, any> | undefined;
      if (heyreachSnap) {
        telemetryLines.push(`HeyReach: ${heyreachSnap.acceptRate ?? "?"}% accept, ${heyreachSnap.replyRate ?? "?"}% reply`);
      }
      const apolloSnap = (latestBySkill.get("pull_apollo_sequence_stats") ?? [])[0]?.payload as Record<string, any> | undefined;
      if (apolloSnap) {
        telemetryLines.push(`Apollo: ${apolloSnap.openRate ?? "?"}% open rate`);
      }
      const stairoidsSnaps = latestBySkill.get("pull_stairoids_scores") ?? [];
      const mover = strongestStairoidsMover(
        (stairoidsSnaps[0]?.payload as Record<string, any> | undefined)?.top ?? null,
        (stairoidsSnaps[1]?.payload as Record<string, any> | undefined)?.top ?? null,
      );
      if (mover) {
        telemetryLines.push(
          mover.delta !== null
            ? `Sterkste Stairoids-mover: ${mover.company} (+${mover.delta} naar ${mover.score})`
            : `Hoogste Stairoids-score: ${mover.company} (${mover.score})`,
        );
      }

      const pendingApprovals = (approvalsQ.data ?? []) as { id: string; approval_type: string; created_at: string }[];
      const newSignals = (signalsQ.data ?? []) as Record<string, unknown>[];

      // Kort NL focus-veld (max 3 zinnen), heuristisch: approvals eerst,
      // dan signalen, dan warme beweging.
      const focusParts: string[] = [];
      if (pendingApprovals.length > 0) {
        focusParts.push(`Er ${pendingApprovals.length === 1 ? "wacht 1 goedkeuring" : `wachten ${pendingApprovals.length} goedkeuringen`} op u — die houden de workflow op.`);
      }
      if (newSignals.length > 0) {
        focusParts.push(`${newSignals.length} ${newSignals.length === 1 ? "nieuw signaal" : "nieuwe signalen"} in de afgelopen 24 uur; pak de hoogste prioriteit als eerste op.`);
      }
      if (movedMap.size > 0) {
        focusParts.push(`${movedMap.size} account${movedMap.size === 1 ? " is" : "s zijn"} deze week warm of sales-ready — plan opvolging.`);
      }
      if (focusParts.length === 0) {
        focusParts.push("Geen urgente acties: geen open goedkeuringen en geen nieuwe signalen in de afgelopen 24 uur.");
      }

      await auditLog(org.id, "daily_brief_viewed", null, null, {
        signals: newSignals.length,
        approvals: pendingApprovals.length,
      });

      return ok({
        tenant: org.slug ?? org.name,
        generated_at: now.toISOString(),
        new_signals_24h: newSignals,
        accounts_warmed_this_week: [...movedMap.entries()].map(([id, a]) => ({ id, ...a })).slice(0, 10),
        pending_approvals: pendingApprovals,
        active_runs: (runsQ.data ?? []).map((r: any) => ({
          run_id: r.id,
          status: r.status,
          current_step_key: r.current_step_key,
          playbook: r.playbook_version?.playbook?.name ?? null,
          version: r.playbook_version?.version ?? null,
        })),
        costs_this_month_eur: costMonth,
        open_service_requests: serviceQ.data ?? [],
        telemetry: telemetryLines.slice(0, 4),
        focus: focusParts.slice(0, 3).join(" "),
      });
    },
  });

  // ── 9. get_telemetry ───────────────────────────────────────────────────

  mcp.tool("get_telemetry", {
    description: "Compose the dashboard DATA object (keys: pipedrive, heyreach, apollo, planable, staroids, salescycle, winloss, herkomst, monthly) from the latest non-expired telemetry snapshots, with snapshot_dates and stale (>26h) per block. Missing block => null with a reason.",
    inputSchema: {
      type: "object",
      properties: { tenant: { type: "string", description: "Organization slug or name (ignored for tenant-scoped API keys)" } },
      required: orgLock ? [] : ["tenant"],
    },
    handler: async ({ tenant }: { tenant?: string }) => {
      const resolved = await resolveOrg(tenant);
      if ("error" in resolved) return resolved.error;
      const org = resolved.org;

      const { data: snaps, error } = await supabase
        .from("rt_snapshots")
        .select("skill_key, payload, created_at, expires_at")
        .eq("organization_id", org.id)
        .in("skill_key", TELEMETRY_SKILLS.map((s) => s.skillKey))
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(25);
      if (error) return toolError("db_error", `Snapshot-lookup mislukt: ${error.message}`);

      const composition = composeTelemetry((snaps ?? []) as TelemetrySnapshotRow[]);

      await auditLog(org.id, "telemetry_viewed", null, null, {
        blocks_present: Object.entries(composition.data).filter(([, v]) => v !== null).map(([k]) => k),
      });

      return ok({ tenant: org.slug ?? org.name, ...composition });
    },
  });

  // ── 10. provision_tenant (internal-only) ───────────────────────────────

  if (!orgLock) mcp.tool("provision_tenant", {
    description:
      "Internal-only. Provision a new tenant: creates gp_organizations, activates the template playbook in rt_tenant_playbooks (with default policies) and creates an onboarding project with tasks. Returns a checklist of manual follow-ups (Vault secrets to set, tenant API key to create).",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Organization display name, e.g. 'Core-Vision B.V.'" },
        slug: { type: "string", description: "URL-safe slug, e.g. 'core-vision'" },
        template_key: { type: "string", enum: ["standard_b2b_outbound"], description: "Provisioning template" },
      },
      required: ["name", "slug", "template_key"],
    },
    handler: async ({ name, slug, template_key }: { name: string; slug: string; template_key: string }) => {
      if (typeof name !== "string" || name.trim().length === 0) {
        return toolError("invalid_name", "'name' is verplicht");
      }
      if (typeof slug !== "string" || !/^[a-z0-9][a-z0-9-]{1,62}$/.test(slug)) {
        return toolError("invalid_slug", "'slug' moet lowercase zijn: letters, cijfers en streepjes");
      }
      if (template_key !== "standard_b2b_outbound") {
        return toolError("unknown_template", `Onbekende template "${template_key}"`, {
          available: ["standard_b2b_outbound"],
        });
      }

      const { data: existing, error: exErr } = await supabase
        .from("gp_organizations")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (exErr) return toolError("db_error", `Slug-check mislukt: ${exErr.message}`);
      if (existing) return toolError("tenant_exists", `Er bestaat al een organisatie met slug "${slug}"`);

      // Template 'standard_b2b_outbound': outbound_market_activation v1.0.0
      // met conservatieve default policies (alles achter approval, geen
      // auto-launch, max 50 contacten per dag).
      const { data: playbook, error: pbErr } = await supabase
        .from("rt_playbooks")
        .select("id")
        .eq("playbook_key", "outbound_market_activation")
        .maybeSingle();
      if (pbErr || !playbook) {
        return toolError("template_playbook_missing", "Playbook outbound_market_activation ontbreekt; draai de rt_-migrations eerst");
      }
      const { data: pv, error: pvErr } = await supabase
        .from("rt_playbook_versions")
        .select("id, version")
        .eq("playbook_id", playbook.id)
        .eq("version", "1.0.0")
        .maybeSingle();
      if (pvErr || !pv) {
        return toolError("template_playbook_missing", "Versie 1.0.0 van outbound_market_activation ontbreekt");
      }

      const { data: org, error: orgErr } = await supabase
        .from("gp_organizations")
        .insert({ name: name.trim(), slug, status: "active" })
        .select("id")
        .single();
      if (orgErr) return toolError("db_error", `Organisatie aanmaken mislukt: ${orgErr.message}`);

      const { error: tpErr } = await supabase.from("rt_tenant_playbooks").insert({
        organization_id: org.id,
        playbook_id: playbook.id,
        pinned_version_id: pv.id,
        is_active: true,
        config: {
          template_key,
          policies: {
            require_account_approval: true,
            require_message_approval: true,
            auto_launch: false,
            daily_contact_limit: 50,
          },
        },
      });
      if (tpErr) return toolError("db_error", `Tenant-playbook aanmaken mislukt: ${tpErr.message}`);

      const { data: project, error: prErr } = await supabase
        .from("gp_onboarding_projects")
        .insert({ organization_id: org.id, status: "in_progress" })
        .select("id")
        .single();
      if (prErr) return toolError("db_error", `Onboarding-project aanmaken mislukt: ${prErr.message}`);

      const vaultSecrets = [
        `tenants/${slug}/apollo`,
        `tenants/${slug}/pipedrive`,
        `tenants/${slug}/heyreach`,
      ];
      const tasks = [
        {
          step_order: 1,
          title: "Vault-secrets zetten",
          description: `Provider-keys van de tenant in Supabase Vault: ${vaultSecrets.join(", ")}`,
          deliverable: "Vault-secrets aanwezig",
        },
        {
          step_order: 2,
          title: "Provider-credentials registreren",
          description: "rt_provider_credentials records aanmaken met de vault://-referenties (organization_id = tenant)",
          deliverable: "Credentials in rt_provider_credentials",
        },
        {
          step_order: 3,
          title: "Tenant API key aanmaken",
          description: "mcp_api_keys record met organization_id van deze tenant en tool_scope 'tenant'",
          deliverable: "Tenant-key voor de klantconsole",
        },
        {
          step_order: 4,
          title: "ICP-context zetten",
          description: "Via set_tenant_context: icp_context, proposities, tone of voice en exclusions",
          deliverable: "gp_icps + rt_tenant_playbooks.config.context gevuld",
        },
        {
          step_order: 5,
          title: "Testrun skill-executor",
          description: "execute_skill met score_account tegen een echt account; rt_provider_calls controleren op call + cost",
          deliverable: "Geslaagde testcall in rt_provider_calls",
        },
        {
          step_order: 6,
          title: "Playbook activeren",
          description: "Playbook-versie op active zetten en eerste workflow run starten via start_workflow_run",
          deliverable: "Eerste rt_workflow_runs record",
        },
      ];
      const { error: taskErr } = await supabase.from("gp_onboarding_tasks").insert(
        tasks.map((t) => ({ ...t, project_id: project.id, organization_id: org.id, owner: "rebel_force", status: "pending" })),
      );
      if (taskErr) return toolError("db_error", `Onboarding-taken aanmaken mislukt: ${taskErr.message}`);

      await auditLog(org.id, "tenant_provisioned", "gp_organizations", org.id, {
        slug,
        template_key,
        playbook_version: pv.version,
        onboarding_tasks: tasks.length,
      });

      return ok({
        organization_id: org.id,
        slug,
        template_key,
        playbook: { key: "outbound_market_activation", pinned_version: pv.version, status: "active" },
        onboarding: { project_id: project.id, tasks: tasks.length },
        checklist: {
          vault_secrets_to_set: vaultSecrets,
          tenant_key_to_create: {
            table: "mcp_api_keys",
            name: `${name.trim()} Console`,
            organization_id: org.id,
            tool_scope: "tenant",
          },
          next: "Zet de Vault-secrets en credentials, dan set_tenant_context, dan een execute_skill-testrun.",
        },
      });
    },
  });

  // ── 11. set_tenant_context (internal-only) ─────────────────────────────

  if (!orgLock) mcp.tool("set_tenant_context", {
    description:
      "Internal-only. Set or update the tenant's GTM context: writes the ICP context to gp_icps and merges icp_context/propositions/tone_of_voice/exclusions into rt_tenant_playbooks.config.context. The previous values are preserved in rt_audit_logs (action 'context_updated').",
    inputSchema: {
      type: "object",
      properties: {
        tenant: { type: "string", description: "Organization slug or name" },
        icp_context: { type: "string", description: "Distilled ICP filter context (RELEVANT/RUIS criteria)" },
        propositions: { type: "array", items: { type: "string" }, description: "Optional value propositions" },
        tone_of_voice: { type: "string", description: "Optional tone of voice for messaging" },
        exclusions: { type: "array", items: { type: "string" }, description: "Optional hard exclusions (companies, segments)" },
      },
      required: ["tenant", "icp_context"],
    },
    handler: async ({ tenant, icp_context, propositions, tone_of_voice, exclusions }: {
      tenant: string;
      icp_context: string;
      propositions?: string[];
      tone_of_voice?: string;
      exclusions?: string[];
    }) => {
      if (typeof icp_context !== "string" || icp_context.trim().length === 0) {
        return toolError("invalid_icp_context", "'icp_context' is verplicht");
      }
      const resolved = await resolveTenant(supabase, tenant);
      if ("error" in resolved) return resolved.error;
      const org = resolved.org;

      // Oudste ICP-record van de tenant is het canonieke runtime-record.
      const { data: icps, error: icpErr } = await supabase
        .from("gp_icps")
        .select("id, name, description")
        .eq("organization_id", org.id)
        .order("created_at", { ascending: true })
        .limit(1);
      if (icpErr) return toolError("db_error", `ICP-lookup mislukt: ${icpErr.message}`);
      const previousIcp = (icps ?? [])[0] ?? null;

      if (previousIcp) {
        const { error } = await supabase.from("gp_icps").update({ description: icp_context }).eq("id", previousIcp.id);
        if (error) return toolError("db_error", `ICP bijwerken mislukt: ${error.message}`);
      } else {
        const { error } = await supabase
          .from("gp_icps")
          .insert({ organization_id: org.id, name: "GTM Runtime ICP", description: icp_context });
        if (error) return toolError("db_error", `ICP aanmaken mislukt: ${error.message}`);
      }

      const context: Record<string, unknown> = { icp_context };
      if (propositions !== undefined) context.propositions = propositions;
      if (tone_of_voice !== undefined) context.tone_of_voice = tone_of_voice;
      if (exclusions !== undefined) context.exclusions = exclusions;

      const { data: tenantPlaybooks, error: tpErr } = await supabase
        .from("rt_tenant_playbooks")
        .select("id, config")
        .eq("organization_id", org.id)
        .eq("is_active", true);
      if (tpErr) return toolError("db_error", `Tenant-playbook-lookup mislukt: ${tpErr.message}`);

      const previousContexts: unknown[] = [];
      for (const tp of (tenantPlaybooks ?? []) as { id: string; config: Record<string, unknown> | null }[]) {
        previousContexts.push({ tenant_playbook_id: tp.id, context: tp.config?.context ?? null });
        const { error } = await supabase
          .from("rt_tenant_playbooks")
          .update({ config: { ...(tp.config ?? {}), context } })
          .eq("id", tp.id);
        if (error) return toolError("db_error", `Tenant-playbook bijwerken mislukt: ${error.message}`);
      }

      // Oude context expliciet bewaren in de audit trail.
      await auditLog(org.id, "context_updated", "rt_tenant_playbooks", null, {
        previous: {
          icp: previousIcp ? { id: previousIcp.id, name: previousIcp.name, description: previousIcp.description } : null,
          playbook_contexts: previousContexts,
        },
        fields_set: Object.keys(context),
      });

      return ok({
        tenant: org.slug ?? org.name,
        icp_record: previousIcp ? "updated" : "created",
        tenant_playbooks_updated: (tenantPlaybooks ?? []).length,
        ...(tenantPlaybooks && tenantPlaybooks.length === 0
          ? { warning: "Geen actieve rt_tenant_playbooks voor deze tenant; alleen gp_icps is bijgewerkt" }
          : {}),
      });
    },
  });
}
