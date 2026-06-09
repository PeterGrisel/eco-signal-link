import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, svc, json, errJson, callGemini } from "../_shared/authority.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { website_id } = await req.json();
    if (!website_id) return errJson("website_id required", 400);
    const sb = svc();
    const { data: site } = await sb.from("authority_websites").select("*").eq("id", website_id).single();
    const { data: profile } = await sb.from("authority_context_profiles").select("*").eq("website_id", website_id).maybeSingle();
    if (!site || !profile) return errJson("website or profile missing", 404);

    const sys = `Je bent een SEO Authority Query Generator. Maak Nederlandse zoekqueries voor backlink-, mention-, partner-, resource- en gastblog-kansen op basis van het contextprofiel. Vermijd spamtermen. Geef 30-50 queries terug.`;
    const user = `Site: ${site.domain}\nPropositie: ${profile.proposition}\nCore topics: ${(profile.core_topics || []).join(", ")}\nSectoren: ${(profile.sectors || []).join(", ")}\nNegative: ${(profile.negative_keywords || []).join(", ")}`;

    const result = await callGemini(sys, user, {
      tool: {
        name: "save_queries",
        description: "Save discovery queries",
        parameters: {
          type: "object",
          properties: {
            queries: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  query: { type: "string" },
                  cluster: { type: "string" },
                  intent: { type: "string", enum: ["topic_authority", "sector_authority", "resource_page", "guest_post", "partner_page", "directory", "branche_platform", "unlinked_mention", "competitor_gap"] },
                  priority: { type: "number" },
                },
                required: ["query", "intent"],
              },
            },
          },
          required: ["queries"],
        },
      },
    });

    const rows = (result.queries || []).slice(0, 100).map((q: any) => ({
      website_id,
      query: q.query,
      cluster: q.cluster || null,
      intent: q.intent || "topic_authority",
      priority: Math.max(0, Math.min(100, Math.round(q.priority ?? 50))),
      status: "active",
    }));

    // dedupe against existing
    const { data: existing } = await sb.from("authority_queries").select("query").eq("website_id", website_id);
    const have = new Set((existing || []).map((r) => r.query.toLowerCase()));
    const fresh = rows.filter((r: any) => !have.has(r.query.toLowerCase()));

    if (fresh.length) {
      await sb.from("authority_queries").insert(fresh);
    }
    return json({ ok: true, inserted: fresh.length, total_received: rows.length });
  } catch (e) {
    console.error("generate-queries", e);
    return errJson((e as Error).message);
  }
});