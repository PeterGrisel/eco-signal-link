// rt-execute-skill — centrale skill-executor van de Rebel Force GTM Runtime.
// Zie README.md in deze folder en supabase/migrations/20260718090000_rt_gtm_runtime_v0_1.sql.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  ExecuteRequest,
  ProviderResult,
  RouteCandidate,
  SkillError,
  extractProviderPreferences,
  hashInput,
  parseExecuteRequest,
  parseVaultRef,
  pickHighestVersion,
  selectProvider,
  unwrapProviderResponse,
  validateSchema,
} from "./lib.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SkillVersionRow {
  id: string;
  version: string;
  input_schema: unknown;
  output_schema: unknown;
  implementation: Record<string, unknown>;
  timeout_seconds: number;
  estimated_cost: number | null;
  skill_id: string;
}

interface DispatchOutcome {
  result: ProviderResult;
  httpStatus: number;
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function serviceClient(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

async function resolveSecret(supabase: SupabaseClient, vaultRef: string): Promise<string> {
  const name = parseVaultRef(vaultRef);
  const { data, error } = await supabase.rpc("rt_resolve_secret", { secret_name: name });
  if (error || typeof data !== "string" || data.length === 0) {
    // Nooit de secret-waarde of interne foutdetails naar buiten laten lekken.
    throw new SkillError("secret_resolution_failed", `Vault-secret voor referentie kon niet worden opgehaald`, false, 500);
  }
  return data;
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutSeconds: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutSeconds * 1000);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function dispatch(
  supabase: SupabaseClient,
  req: ExecuteRequest,
  skillVersion: SkillVersionRow,
  credential: string | null,
): Promise<DispatchOutcome> {
  const impl = skillVersion.implementation;
  const implType = impl?.type;
  const payload = {
    tenantId: req.tenantId,
    skillKey: req.skillKey,
    skillVersion: skillVersion.version,
    input: req.input,
    credential,
    context: { workflowRunId: req.workflowRunId ?? null, stepRunId: req.stepRunId ?? null },
  };

  let url: string;
  let headers: Record<string, string> = { "Content-Type": "application/json" };

  if (implType === "n8n_webhook") {
    url = await resolveSecret(supabase, impl.url_secret as string);
  } else if (implType === "supabase_edge_function") {
    const fn = impl.function;
    if (typeof fn !== "string" || fn.length === 0) {
      throw new SkillError("invalid_implementation", "implementation.function ontbreekt", false, 500);
    }
    url = `${Deno.env.get("SUPABASE_URL")}/functions/v1/${fn}`;
    headers = { ...headers, Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}` };
  } else {
    throw new SkillError("unsupported_implementation", `implementation.type "${implType}" wordt niet ondersteund`, false, 500);
  }

  let response: Response;
  try {
    response = await fetchWithTimeout(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    }, skillVersion.timeout_seconds);
  } catch (e) {
    // Geen e.message doorgeven: fetch-fouten kunnen de (geheime) URL bevatten.
    if (e instanceof DOMException && e.name === "AbortError") {
      throw new SkillError("provider_timeout", `Provider antwoordde niet binnen ${skillVersion.timeout_seconds}s`, true, 504);
    }
    throw new SkillError("provider_unreachable", "Provider was niet bereikbaar", true, 502);
  }

  const text = await response.text();
  if (!response.ok) {
    const retryable = response.status === 429 || response.status >= 500;
    const code = response.status === 429 ? "provider_rate_limited" : "provider_error";
    const err = new SkillError(code, `Provider gaf HTTP ${response.status}`, retryable, 502);
    (err as SkillError & { providerHttpStatus?: number }).providerHttpStatus = response.status;
    throw err;
  }

  let body: unknown;
  try {
    body = text.length > 0 ? JSON.parse(text) : {};
  } catch {
    throw new SkillError("provider_invalid_response", "Provider gaf geen geldige JSON terug", true, 502);
  }
  return { result: unwrapProviderResponse(body), httpStatus: response.status };
}

async function logProviderCall(supabase: SupabaseClient, row: Record<string, unknown>): Promise<void> {
  const { error } = await supabase.from("rt_provider_calls").insert(row);
  if (error) console.error("rt_provider_calls insert failed:", error.message);
}

async function updateStepRun(supabase: SupabaseClient, stepRunId: string, patch: Record<string, unknown>): Promise<void> {
  const { error } = await supabase.from("rt_step_runs").update(patch).eq("id", stepRunId);
  if (error) console.error("rt_step_runs update failed:", error.message);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: { code: "method_not_allowed", message: "Gebruik POST", retryable: false } });

  const startedAt = Date.now();
  const supabase = serviceClient();

  let request: ExecuteRequest;
  try {
    request = parseExecuteRequest(await req.json().catch(() => null));
  } catch (e) {
    const err = e instanceof SkillError ? e : new SkillError("invalid_request", "Ongeldige request body", false, 400);
    return json(err.httpStatus, { status: "failed", error: err.toExecError() });
  }

  // Executie-context die we nodig hebben voor logging, ook als er iets misgaat.
  let skillVersionRow: SkillVersionRow | null = null;
  let route: RouteCandidate | null = null;
  // Pas na de ownership-check mogen we de step run muteren — anders zou een
  // fout vóór die check (bv. tenant-mismatch) andermans step run overschrijven.
  let stepRunVerified = false;

  const fail = async (e: unknown): Promise<Response> => {
    const err: SkillError = e instanceof SkillError
      ? e
      : new SkillError("internal_error", "Onverwachte fout in de executor", true, 500);
    if (!(e instanceof SkillError)) console.error("rt-execute-skill internal error:", e);

    const latencyMs = Date.now() - startedAt;
    if (request.stepRunId && stepRunVerified) {
      await updateStepRun(supabase, request.stepRunId, {
        status: "failed",
        error: err.toExecError() as unknown as Record<string, unknown>,
        latency_ms: latencyMs,
        finished_at: new Date().toISOString(),
      });
    }
    return json(err.httpStatus, {
      status: "failed",
      skillKey: request.skillKey,
      skillVersion: skillVersionRow?.version ?? request.skillVersion ?? null,
      provider: route?.provider_key ?? null,
      data: null,
      latencyMs,
      error: err.toExecError(),
    });
  };

  try {
    // 1. Tenant valideren
    const { data: tenant, error: tenantErr } = await supabase
      .from("gp_organizations")
      .select("id, status")
      .eq("id", request.tenantId)
      .maybeSingle();
    if (tenantErr) throw new SkillError("internal_error", "Tenant-lookup mislukt", true, 500);
    if (!tenant) throw new SkillError("tenant_not_found", "Onbekende tenant", false, 404);
    if (tenant.status !== "active") throw new SkillError("tenant_inactive", `Tenant heeft status "${tenant.status}"`, false, 403);

    // 2. Skill + versie ophalen (default: hoogste actieve versie)
    const { data: skill, error: skillErr } = await supabase
      .from("rt_skills")
      .select("id, skill_key, status")
      .eq("skill_key", request.skillKey)
      .maybeSingle();
    if (skillErr) throw new SkillError("internal_error", "Skill-lookup mislukt", true, 500);
    if (!skill || skill.status !== "active") {
      throw new SkillError("skill_not_found", `Skill "${request.skillKey}" bestaat niet of is niet actief`, false, 404);
    }

    let versionQuery = supabase
      .from("rt_skill_versions")
      .select("id, version, input_schema, output_schema, implementation, timeout_seconds, estimated_cost, skill_id")
      .eq("skill_id", skill.id)
      .eq("status", "active");
    if (request.skillVersion) versionQuery = versionQuery.eq("version", request.skillVersion);
    const { data: versions, error: versionErr } = await versionQuery;
    if (versionErr) throw new SkillError("internal_error", "Skill-versie-lookup mislukt", true, 500);
    skillVersionRow = pickHighestVersion((versions ?? []) as SkillVersionRow[]);
    if (!skillVersionRow) {
      throw new SkillError(
        "skill_version_not_found",
        `Geen actieve versie${request.skillVersion ? ` "${request.skillVersion}"` : ""} voor skill "${request.skillKey}"`,
        false,
        404,
      );
    }

    const inputHash = await hashInput(request.skillKey, skillVersionRow.version, request.input);

    // 9. Idempotency: eerdere succeeded run met dezelfde input → cached output
    if (request.stepRunId) {
      const { data: stepRun, error: stepErr } = await supabase
        .from("rt_step_runs")
        .select("id, organization_id, status, input_hash, output, confidence, cost, latency_ms, provider_id")
        .eq("id", request.stepRunId)
        .maybeSingle();
      if (stepErr) throw new SkillError("internal_error", "Step-run-lookup mislukt", true, 500);
      if (!stepRun) throw new SkillError("step_run_not_found", "Onbekende stepRunId", false, 404);
      if (stepRun.organization_id !== request.tenantId) {
        throw new SkillError("step_run_tenant_mismatch", "stepRunId hoort niet bij deze tenant", false, 403);
      }
      stepRunVerified = true;
      if (stepRun.status === "succeeded" && stepRun.input_hash === inputHash) {
        let providerKey: string | null = null;
        if (stepRun.provider_id) {
          const { data: p } = await supabase.from("rt_providers").select("provider_key").eq("id", stepRun.provider_id).maybeSingle();
          providerKey = p?.provider_key ?? null;
        }
        return json(200, {
          status: "succeeded",
          skillKey: request.skillKey,
          skillVersion: skillVersionRow.version,
          provider: providerKey,
          data: stepRun.output,
          confidence: stepRun.confidence ?? undefined,
          cost: stepRun.cost ?? undefined,
          latencyMs: stepRun.latency_ms ?? 0,
          idempotent: true,
        });
      }
    }

    // 3. Input valideren tegen input_schema
    const inputErrors = validateSchema(skillVersionRow.input_schema, request.input);
    if (inputErrors.length > 0) {
      throw new SkillError("input_validation_failed", `Input voldoet niet aan schema: ${inputErrors.slice(0, 5).join("; ")}`, false, 422);
    }

    // 4. Provider selecteren: tenant-voorkeur > laagste priority > is_active
    const { data: routeRows, error: routeErr } = await supabase
      .from("rt_provider_routes")
      .select("provider_id, priority, is_active, rt_providers(id, provider_key, status)")
      .eq("skill_id", skill.id);
    if (routeErr) throw new SkillError("internal_error", "Route-lookup mislukt", true, 500);

    const { data: tenantPlaybooks, error: tpErr } = await supabase
      .from("rt_tenant_playbooks")
      .select("config")
      .eq("organization_id", request.tenantId)
      .eq("is_active", true);
    if (tpErr) throw new SkillError("internal_error", "Tenant-playbook-lookup mislukt", true, 500);

    const candidates: RouteCandidate[] = (routeRows ?? []).map((r: Record<string, unknown>) => {
      const provider = r.rt_providers as { id: string; provider_key: string; status: string } | null;
      return {
        provider_id: provider?.id ?? (r.provider_id as string),
        provider_key: provider?.provider_key ?? "",
        provider_status: provider?.status ?? "disabled",
        priority: r.priority as number,
        is_active: r.is_active as boolean,
      };
    });
    const preferences = extractProviderPreferences(
      (tenantPlaybooks ?? []).map((t: { config: unknown }) => t.config),
      request.skillKey,
    );
    route = selectProvider(candidates, preferences);
    if (!route) {
      throw new SkillError("no_provider_available", `Geen actieve provider-route voor skill "${request.skillKey}"`, true, 503);
    }

    // 5. Credential resolven: tenant-eigen > platform (org IS NULL)
    let credential: string | null = null;
    const { data: credRows, error: credErr } = await supabase
      .from("rt_provider_credentials")
      .select("organization_id, credential_reference, status")
      .eq("provider_id", route.provider_id)
      .eq("status", "active")
      .or(`organization_id.eq.${request.tenantId},organization_id.is.null`);
    if (credErr) throw new SkillError("internal_error", "Credential-lookup mislukt", true, 500);
    type CredRow = { organization_id: string | null; credential_reference: string; status: string };
    const credRow = (credRows ?? []).find((c: CredRow) => c.organization_id === request.tenantId) ??
      (credRows ?? []).find((c: CredRow) => c.organization_id === null);
    if (credRow) credential = await resolveSecret(supabase, credRow.credential_reference);

    // Step run markeren als running
    if (request.stepRunId) {
      await updateStepRun(supabase, request.stepRunId, {
        status: "running",
        input: request.input,
        input_hash: inputHash,
        skill_version_id: skillVersionRow.id,
        provider_id: route.provider_id,
        started_at: new Date().toISOString(),
      });
    }

    // 6. Dispatch naar implementatie
    const implType = skillVersionRow.implementation?.type as string;
    // Endpoint-label voor observability: de vault-referentie of function-naam,
    // nooit de geresolvede URL.
    const endpointLabel = implType === "n8n_webhook"
      ? `n8n_webhook:${skillVersionRow.implementation.url_secret}`
      : `edge_function:${skillVersionRow.implementation.function}`;

    let outcome: DispatchOutcome;
    const callStart = Date.now();
    try {
      outcome = await dispatch(supabase, request, skillVersionRow, credential);
    } catch (e) {
      const err = e instanceof SkillError ? e : new SkillError("internal_error", "Dispatch mislukt", true, 500);
      const callStatus = err.code === "provider_timeout" ? "timeout" : err.code === "provider_rate_limited" ? "rate_limited" : "failed";
      await logProviderCall(supabase, {
        organization_id: request.tenantId,
        workflow_run_id: request.workflowRunId ?? null,
        step_run_id: request.stepRunId ?? null,
        provider_id: route.provider_id,
        skill_version_id: skillVersionRow.id,
        endpoint: endpointLabel,
        status: callStatus,
        http_status: (err as SkillError & { providerHttpStatus?: number }).providerHttpStatus ?? null,
        latency_ms: Date.now() - callStart,
        error: err.toExecError(),
      });
      throw err;
    }
    const callLatencyMs = Date.now() - callStart;

    // 7. Output valideren tegen output_schema
    const outputErrors = validateSchema(skillVersionRow.output_schema, outcome.result.data);
    const outputValid = outputErrors.length === 0;
    const cost = outcome.result.cost ?? skillVersionRow.estimated_cost ?? null;

    // 8. Externe call loggen
    await logProviderCall(supabase, {
      organization_id: request.tenantId,
      workflow_run_id: request.workflowRunId ?? null,
      step_run_id: request.stepRunId ?? null,
      provider_id: route.provider_id,
      skill_version_id: skillVersionRow.id,
      endpoint: endpointLabel,
      status: outputValid ? "success" : "failed",
      http_status: outcome.httpStatus,
      latency_ms: callLatencyMs,
      cost,
      error: outputValid ? null : { code: "output_validation_failed", message: outputErrors.slice(0, 5).join("; "), retryable: false },
    });

    if (!outputValid) {
      throw new SkillError(
        "output_validation_failed",
        `Provider-output voldoet niet aan output_schema: ${outputErrors.slice(0, 5).join("; ")}`,
        false,
        502,
      );
    }

    const latencyMs = Date.now() - startedAt;
    if (request.stepRunId) {
      await updateStepRun(supabase, request.stepRunId, {
        status: "succeeded",
        output: outcome.result.data,
        confidence: outcome.result.confidence ?? null,
        cost,
        latency_ms: latencyMs,
        error: null,
        finished_at: new Date().toISOString(),
      });
    }

    return json(200, {
      status: "succeeded",
      skillKey: request.skillKey,
      skillVersion: skillVersionRow.version,
      provider: route.provider_key,
      data: outcome.result.data,
      confidence: outcome.result.confidence,
      cost: cost ?? undefined,
      latencyMs,
    });
  } catch (e) {
    return await fail(e);
  }
});
