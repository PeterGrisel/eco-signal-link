import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-publish-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const expected = Deno.env.get("ABM_PUBLISH_KEY");
  if (!expected) {
    return new Response(JSON.stringify({ error: "ABM_PUBLISH_KEY not configured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const auth = req.headers.get("authorization") || "";
  const xKey = req.headers.get("x-publish-key") || "";
  const provided = auth.toLowerCase().startsWith("bearer ")
    ? auth.slice(7).trim()
    : xKey.trim();
  if (provided !== expected) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: any;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const companyName: string | undefined =
    body.companyName || body.company_name || body.company || body.payload?.companyName;
  if (!companyName || typeof companyName !== "string") {
    return new Response(JSON.stringify({ error: "companyName is required" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const slug: string = (body.slug && typeof body.slug === "string")
    ? slugify(body.slug)
    : slugify(companyName);
  if (!slug) {
    return new Response(JSON.stringify({ error: "Could not derive slug" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // payload = full body minus control fields
  const { slug: _s, companyName: _c, company_name: _c2, company: _c3,
          ttlDays: _t, status: _st, ...payload } = body;

  const ttlDays = Number.isFinite(body.ttlDays) ? Math.max(1, Math.min(365, body.ttlDays)) : 90;
  const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000).toISOString();
  const status = body.status === "archived" || body.status === "expired" ? body.status : "live";

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data, error } = await supabase
    .from("abm_pages")
    .upsert({
      slug,
      company_name: companyName,
      payload,
      status,
      expires_at: expiresAt,
    }, { onConflict: "slug" })
    .select("id, slug, status, expires_at")
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const url = `https://b2bgroeimachine.io/voor/${slug}`;
  return new Response(JSON.stringify({ ok: true, url, ...data }), {
    status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});