import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";
const SITE_URL = "https://b2bgroeimachine.io/";
const SITEMAP_URL = "https://b2bgroeimachine.io/sitemap.xml";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GSC_KEY = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY ontbreekt");
    if (!GSC_KEY) throw new Error("GOOGLE_SEARCH_CONSOLE_API_KEY ontbreekt (connect Google Search Console)");

    const siteEnc = encodeURIComponent(SITE_URL);
    const feedEnc = encodeURIComponent(SITEMAP_URL);
    const url = `${GATEWAY}/webmasters/v3/sites/${siteEnc}/sitemaps/${feedEnc}`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GSC_KEY,
      },
    });

    const body = await res.text();
    if (!res.ok) {
      console.error("GSC sitemap submit failed:", res.status, body);
      throw new Error(`GSC submit ${res.status}: ${body.slice(0, 300)}`);
    }

    console.log("Sitemap succesvol ingediend bij Google Search Console:", SITEMAP_URL);
    return new Response(
      JSON.stringify({ ok: true, submitted: SITEMAP_URL, site: SITE_URL }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});