// portal-telemetry — dunne compositie-endpoint voor het /app/telemetry
// dashboard (deel I4). Zelfde compositie als de MCP-tool get_telemetry,
// org-scoped via de ingelogde portal-gebruiker (gp_can_access_org).
// Optioneel body {refresh: true}: alleen Rebel Force-rollen; triggert
// rt-telemetry-sync voor deze tenant.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { TELEMETRY_SKILLS, composeTelemetry, type TelemetrySnapshotRow } from "../_shared/rt-telemetry.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Gebruik POST" });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // Ingelogde gebruiker uit de meegestuurde JWT.
  const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data: userData, error: userErr } = await supabase.auth.getUser(jwt);
  const userId = userData?.user?.id;
  if (userErr || !userId) return json(401, { error: "Niet ingelogd" });

  let body: { tenantId?: string; refresh?: boolean } = {};
  try {
    body = await req.json();
  } catch { /* leeg */ }
  const tenantId = body.tenantId;
  if (!tenantId || typeof tenantId !== "string") return json(400, { error: "tenantId is verplicht" });

  const { data: allowed, error: accessErr } = await supabase.rpc("gp_can_access_org", {
    _user_id: userId,
    _org_id: tenantId,
  });
  if (accessErr || allowed !== true) return json(403, { error: "Geen toegang tot deze organisatie" });

  if (body.refresh === true) {
    const { data: isRf } = await supabase.rpc("gp_is_rebel_force", { _user_id: userId });
    if (isRf !== true) return json(403, { error: "Verversen is alleen beschikbaar voor Rebel Force" });
    const { data: org } = await supabase.from("gp_organizations").select("slug, name").eq("id", tenantId).maybeSingle();
    const internalToken = Deno.env.get("RT_INTERNAL_TOKEN");
    if (!internalToken || !org) return json(500, { error: "Verversen is niet geconfigureerd" });
    const res = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/rt-telemetry-sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-rt-internal-token": internalToken },
      body: JSON.stringify({ tenant: org.slug ?? org.name }),
    });
    if (!res.ok) return json(502, { error: "Telemetrie-sync mislukte" });
  }

  const { data: snaps, error } = await supabase
    .from("rt_snapshots")
    .select("skill_key, payload, created_at, expires_at")
    .eq("organization_id", tenantId)
    .in("skill_key", TELEMETRY_SKILLS.map((s) => s.skillKey))
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(25);
  if (error) return json(500, { error: "Snapshots ophalen mislukte" });

  const composition = composeTelemetry((snaps ?? []) as TelemetrySnapshotRow[]);
  return json(200, { ...composition, generated_at: new Date().toISOString() });
});
