import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, svc, json, errJson, callGemini } from "../_shared/authority.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { opportunity_id, save = true } = await req.json();
    if (!opportunity_id) return errJson("opportunity_id required", 400);
    const sb = svc();
    const { data: opp } = await sb.from("authority_opportunities").select("*").eq("id", opportunity_id).single();
    if (!opp) return errJson("opportunity not found", 404);
    const { data: profile } = await sb.from("authority_context_profiles").select("proposition").eq("website_id", opp.website_id).maybeSingle();
    const { data: site } = await sb.from("authority_websites").select("name, domain").eq("id", opp.website_id).single();

    const sys = `Je bent een B2B SEO Outreach Assistant. Schrijf een korte, persoonlijke Nederlandse outreach (maximaal 120 woorden, B1 niveau, geen spamtoon, geen overdreven claims, geen em-dashes). Sluit af met een zachte vraag.`;
    const user = `Onze site: ${site?.domain} — ${profile?.proposition || ""}
Bronpagina: ${opp.source_url}
Titel: ${opp.source_title}
Topic: ${opp.topic}
Aanbevolen target: ${opp.suggested_target_url}
Aanbevolen anchor: ${opp.suggested_anchor}
Asset suggestie: ${opp.asset_suggestion || "(geen)"}
Reden: ${opp.relevance_reason}`;

    const out = await callGemini(sys, user, {
      tool: {
        name: "outreach",
        description: "Compose outreach",
        parameters: {
          type: "object",
          properties: { subject: { type: "string" }, body: { type: "string" } },
          required: ["subject", "body"],
        },
      },
    });

    if (save) {
      await sb.from("authority_opportunities").update({
        outreach_subject: out.subject,
        outreach_body: out.body,
        status: opp.status === "discovered" || opp.status === "qualified" ? "ready_for_outreach" : opp.status,
      }).eq("id", opportunity_id);
    }
    return json({ ok: true, subject: out.subject, body: out.body });
  } catch (e) {
    console.error("generate-outreach", e);
    return errJson((e as Error).message);
  }
});