import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const faviconFor = (website: string): string | null => {
  try {
    const host = new URL(website).hostname;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
  } catch {
    return null;
  }
};

// Houdt onze eigen Groeistack-directory fris: controleert of de website
// van elke tool nog leeft en ververst het logo (favicon). Geen scraping
// van content van derden.
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: tools, error } = await supabase
      .from("groeistack_tools")
      .select("id, website");
    if (error) throw error;

    let checked = 0;
    let broken = 0;

    for (const tool of tools ?? []) {
      let status = "broken";
      try {
        const res = await fetch(tool.website, {
          method: "GET",
          redirect: "follow",
          signal: AbortSignal.timeout(8000),
        });
        status = res.ok ? "ok" : "broken";
      } catch {
        status = "broken";
      }
      if (status === "broken") broken++;

      await supabase
        .from("groeistack_tools")
        .update({
          link_status: status,
          logo_url: faviconFor(tool.website),
          last_checked_at: new Date().toISOString(),
        })
        .eq("id", tool.id);

      checked++;
    }

    return new Response(
      JSON.stringify({ ok: true, checked, broken }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
