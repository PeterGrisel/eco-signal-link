import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, svc, json, errJson, firecrawlScrape, callGemini } from "../_shared/authority.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { website_id } = await req.json();
    if (!website_id) return errJson("website_id required", 400);
    const sb = svc();
    const { data: site, error: e1 } = await sb.from("authority_websites").select("*").eq("id", website_id).single();
    if (e1 || !site) return errJson("website not found", 404);

    const url = site.domain.startsWith("http") ? site.domain : `https://${site.domain}`;
    const scraped = await firecrawlScrape(url, ["markdown", "links"]);
    const md = (scraped?.markdown || "").slice(0, 12000);
    const links: string[] = (scraped?.links || []).slice(0, 50);

    const sys = `Je bent een SEO Context Analyst. Analyseer de websitecontent en geef een gestructureerd contextprofiel terug. Gebruik korte, concrete Nederlandse termen.`;
    const user = `Website: ${site.domain}\nBeschrijving: ${site.description || "(geen)"}\n\nHomepage content (markdown):\n${md}\n\nInterne links (sample):\n${links.slice(0, 30).join("\n")}`;

    const profile = await callGemini(sys, user, {
      tool: {
        name: "save_context_profile",
        description: "Save a website context profile",
        parameters: {
          type: "object",
          properties: {
            proposition: { type: "string" },
            icp: { type: "array", items: { type: "string" } },
            core_topics: { type: "array", items: { type: "string" } },
            secondary_topics: { type: "array", items: { type: "string" } },
            sectors: { type: "array", items: { type: "string" } },
            differentiators: { type: "array", items: { type: "string" } },
            money_pages: { type: "array", items: { type: "string" } },
            recommended_pages: { type: "array", items: { type: "string" } },
            linkable_assets: { type: "array", items: { type: "string" } },
            negative_keywords: { type: "array", items: { type: "string" } },
            raw_summary: { type: "string" },
          },
          required: ["proposition", "core_topics", "sectors"],
        },
      },
    });

    // upsert
    const { data: existing } = await sb.from("authority_context_profiles").select("id, context_version").eq("website_id", website_id).maybeSingle();
    const payload = {
      website_id,
      proposition: profile.proposition,
      icp: profile.icp || [],
      core_topics: profile.core_topics || [],
      secondary_topics: profile.secondary_topics || [],
      sectors: profile.sectors || [],
      differentiators: profile.differentiators || [],
      money_pages: profile.money_pages || [],
      recommended_pages: profile.recommended_pages || [],
      linkable_assets: profile.linkable_assets || [],
      negative_keywords: profile.negative_keywords || [],
      raw_summary: profile.raw_summary || null,
      context_version: (existing?.context_version || 0) + 1,
    };
    if (existing) {
      await sb.from("authority_context_profiles").update(payload).eq("id", existing.id);
    } else {
      await sb.from("authority_context_profiles").insert(payload);
    }
    return json({ ok: true, profile: payload });
  } catch (e) {
    console.error("analyze-context", e);
    return errJson((e as Error).message);
  }
});