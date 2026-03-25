import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { url, urls } = await req.json();
    const targetUrls = urls || (url ? [url] : []);
    if (targetUrls.length === 0) throw new Error("Geen URL(s) opgegeven");

    const googleKey = Deno.env.get("GOOGLE_INDEXING_KEY");
    
    const results = [];

    for (const targetUrl of targetUrls) {
      // Save request to DB
      const { data: record } = await supabase.from("indexing_requests").insert({
        url: targetUrl,
        status: "requested",
        requested_at: new Date().toISOString(),
      }).select().single();

      if (!googleKey) {
        // No Google key configured - save as pending
        await supabase.from("indexing_requests").update({
          status: "pending",
          response_message: "Google Indexing API key niet geconfigureerd. Configureer GOOGLE_INDEXING_KEY in secrets.",
        }).eq("id", record.id);

        results.push({ url: targetUrl, status: "pending", message: "API key niet geconfigureerd" });
        continue;
      }

      try {
        // Call Google Indexing API
        const response = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${googleKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: targetUrl,
            type: "URL_UPDATED",
          }),
        });

        const data = await response.json();

        if (response.ok) {
          await supabase.from("indexing_requests").update({
            status: "indexed",
            indexed_at: new Date().toISOString(),
            response_message: "Succesvol ingediend bij Google",
          }).eq("id", record.id);
          results.push({ url: targetUrl, status: "indexed" });
        } else {
          await supabase.from("indexing_requests").update({
            status: "failed",
            response_message: data.error?.message || "Google API fout",
          }).eq("id", record.id);
          results.push({ url: targetUrl, status: "failed", message: data.error?.message });
        }
      } catch (e) {
        await supabase.from("indexing_requests").update({
          status: "failed",
          response_message: e instanceof Error ? e.message : "Onbekende fout",
        }).eq("id", record.id);
        results.push({ url: targetUrl, status: "failed", message: e instanceof Error ? e.message : "Onbekende fout" });
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("request-indexing error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Onbekende fout" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
