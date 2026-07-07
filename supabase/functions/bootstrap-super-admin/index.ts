import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No auth" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Validate the user via the anon client using their JWT
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const userId = userData.user.id;

    const admin = createClient(supabaseUrl, serviceKey);

    // Are there any rebel-force role holders yet?
    const { count: rfCount, error: countErr } = await admin
      .from("gp_organization_members")
      .select("id", { count: "exact", head: true })
      .in("role", ["super_admin", "rebel_force_admin"]);

    if (countErr) {
      return new Response(JSON.stringify({ error: countErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if ((rfCount ?? 0) > 0) {
      return new Response(JSON.stringify({ bootstrapped: false, reason: "already_exists" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Grant super_admin on all organizations to this user
    const { data: orgs } = await admin.from("gp_organizations").select("id");
    if (!orgs?.length) {
      return new Response(JSON.stringify({ bootstrapped: false, reason: "no_orgs" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const rows = orgs.map((o) => ({ organization_id: o.id, user_id: userId, role: "super_admin" as const }));
    const { error: insErr } = await admin.from("gp_organization_members").upsert(rows, { onConflict: "organization_id,user_id" });
    if (insErr) {
      return new Response(JSON.stringify({ error: insErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ bootstrapped: true, orgs: orgs.length }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});