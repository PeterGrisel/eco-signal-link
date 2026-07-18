// rt-telemetry-sync — dagelijkse telemetrie-verversing (deel I3).
// Loopt over actieve tenants met config.telemetry.enabled = true en voert de
// vijf telemetrie-skills uit via rt-execute-skill (interne token,
// forceRefresh=true zodat er altijd verse snapshots komen). Aangeroepen door
// pg_cron (04:30 UTC ≈ 06:30 Amsterdam) of handmatig (optioneel body
// {tenant: "<slug>"} voor één tenant, gebruikt door de dashboard-knop).
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkInternalToken } from "../rt-execute-skill/lib.ts";
import { TELEMETRY_SKILLS } from "../_shared/rt-telemetry.ts";

serve(async (req) => {
  if (!checkInternalToken(req.headers.get("x-rt-internal-token"), Deno.env.get("RT_INTERNAL_TOKEN"))) {
    return new Response(JSON.stringify({ error: { code: "unauthorized", message: "Ongeldige of ontbrekende x-rt-internal-token header", retryable: false } }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const startedAt = Date.now();
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  let onlyTenant: string | null = null;
  try {
    const body = await req.json();
    if (typeof body?.tenant === "string" && body.tenant.length > 0) onlyTenant = body.tenant;
  } catch { /* lege body is prima */ }

  // Tenants met telemetrie aan.
  const { data: tenantPlaybooks, error: tpErr } = await supabase
    .from("rt_tenant_playbooks")
    .select("organization_id, config, organization:gp_organizations(slug, name, status)")
    .eq("is_active", true)
    .filter("config->telemetry->>enabled", "eq", "true");
  if (tpErr) {
    return new Response(JSON.stringify({ error: { code: "db_error", message: tpErr.message, retryable: true } }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  type TenantRow = {
    organization_id: string;
    config: Record<string, unknown> | null;
    organization: { slug: string | null; name: string; status: string } | null;
  };
  const seen = new Set<string>();
  const tenants = ((tenantPlaybooks ?? []) as TenantRow[]).filter((t) => {
    if (!t.organization || t.organization.status !== "active") return false;
    if (seen.has(t.organization_id)) return false;
    seen.add(t.organization_id);
    const label = t.organization.slug ?? t.organization.name;
    return onlyTenant === null || label === onlyTenant;
  });

  const internalToken = Deno.env.get("RT_INTERNAL_TOKEN")!;
  const results: Record<string, Record<string, string>> = {};
  let failures = 0;

  for (const tenant of tenants) {
    const label = tenant.organization!.slug ?? tenant.organization!.name;
    results[label] = {};
    const sourceContext = (tenant.config?.source_context ?? {}) as Record<string, unknown>;

    for (const skill of TELEMETRY_SKILLS) {
      try {
        const res = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/rt-execute-skill`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-rt-internal-token": internalToken },
          body: JSON.stringify({
            tenantId: tenant.organization_id,
            skillKey: skill.skillKey,
            input: { tenant_config: sourceContext },
            forceRefresh: true,
          }),
        });
        const body = await res.json().catch(() => null);
        const status = body?.status === "succeeded" ? "succeeded" : body?.error?.code ?? `http_${res.status}`;
        results[label][skill.skillKey] = status;
        if (status !== "succeeded") failures++;
      } catch {
        results[label][skill.skillKey] = "unreachable";
        failures++;
      }
    }
  }

  const durationMs = Date.now() - startedAt;
  const status = failures === 0 ? "success" : Object.keys(results).length > 0 ? "partial" : "failed";
  await supabase.from("job_runs").insert({
    job_key: "rt_telemetry_sync",
    status,
    message: failures > 0 ? `${failures} skill-call(s) niet geslaagd` : null,
    metadata: { tenants: results, only_tenant: onlyTenant },
    finished_at: new Date().toISOString(),
    duration_ms: durationMs,
  });

  return new Response(JSON.stringify({ status, tenants: results, duration_ms: durationMs }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
