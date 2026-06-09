import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, svc, json, errJson, callGemini, calcPriority, matchesNegative, domainOf } from "../_shared/authority.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { crawled_page_id } = await req.json();
    if (!crawled_page_id) return errJson("crawled_page_id required", 400);
    const sb = svc();

    const { data: page } = await sb.from("authority_crawled_pages").select("*").eq("id", crawled_page_id).single();
    if (!page) return errJson("page not found", 404);
    const { data: profile } = await sb.from("authority_context_profiles").select("*").eq("website_id", page.website_id).maybeSingle();
    if (!profile) return errJson("context profile missing", 400);

    const blob = `${page.title || ""} ${page.meta_description || ""} ${page.text_excerpt || ""} ${page.url}`;
    if (matchesNegative(blob, profile.negative_keywords || [])) {
      await sb.from("authority_opportunities").upsert({
        website_id: page.website_id,
        crawled_page_id: page.id,
        source_url: page.url,
        source_domain: page.domain || domainOf(page.url),
        source_title: page.title,
        risk_score: 90,
        priority_score: 0,
        status: "rejected",
        relevance_reason: "Negative keyword match",
      }, { onConflict: "website_id,source_url" });
      return json({ ok: true, rejected: true });
    }

    const sys = `Je bent een SEO Authority Analyst. Beoordeel of de kandidaatpagina een relevante en veilige authority opportunity is voor de website. Wijs af bij irrelevantie, spam, casino, betting, crypto, adult, fake directories of pagina's zonder contextfit.`;
    const user = `Site propositie: ${profile.proposition}
Core topics: ${(profile.core_topics || []).join(", ")}
Sectoren: ${(profile.sectors || []).join(", ")}
Money pages: ${(profile.money_pages || []).join(", ")}
Recommended target pages: ${(profile.recommended_pages || []).join(", ")}

Kandidaat URL: ${page.url}
Titel: ${page.title}
Meta: ${page.meta_description}
H1: ${page.h1}
Tekst:
${(page.text_excerpt || "").slice(0, 3000)}`;

    const ai = await callGemini(sys, user, {
      tool: {
        name: "score",
        description: "Score the opportunity",
        parameters: {
          type: "object",
          properties: {
            is_relevant: { type: "boolean" },
            opportunity_type: { type: "string" },
            page_type: { type: "string" },
            topic: { type: "string" },
            sector: { type: "string" },
            context_fit: { type: "number" },
            sector_fit: { type: "number" },
            page_type_fit: { type: "number" },
            authority_score: { type: "number" },
            placement_probability: { type: "number" },
            commercial_value: { type: "number" },
            risk_score: { type: "number" },
            suggested_target_url: { type: "string" },
            suggested_anchor: { type: "string" },
            anchor_type: { type: "string", enum: ["branded", "url", "generic", "partial_match", "exact_match", "topic", "asset_title"] },
            asset_needed: { type: "boolean" },
            asset_suggestion: { type: "string" },
            relevance_reason: { type: "string" },
            recommended_action: { type: "string" },
          },
          required: ["is_relevant", "context_fit", "sector_fit", "page_type_fit", "risk_score"],
        },
      },
    });

    const priority = calcPriority({
      context_fit: ai.context_fit || 0,
      sector_fit: ai.sector_fit || 0,
      page_type_fit: ai.page_type_fit || 0,
      authority_score: ai.authority_score || 0,
      placement_probability: ai.placement_probability || 0,
      commercial_value: ai.commercial_value || 0,
      risk_score: ai.risk_score || 0,
    });

    let status = "discovered";
    if (!ai.is_relevant || ai.risk_score >= 60) status = "rejected";
    else if (priority >= 80) status = "qualified";
    else if (priority >= 65) status = "qualified";
    else if (priority >= 45) status = "discovered";
    else status = "rejected";
    if (ai.asset_needed && status !== "rejected") status = "needs_asset";

    await sb.from("authority_opportunities").upsert({
      website_id: page.website_id,
      crawled_page_id: page.id,
      discovery_run_id: page.discovery_run_id,
      source_url: page.url,
      source_domain: page.domain || domainOf(page.url),
      source_title: page.title,
      opportunity_type: ai.opportunity_type || null,
      page_type: ai.page_type || null,
      topic: ai.topic || null,
      sector: ai.sector || null,
      suggested_target_url: ai.suggested_target_url || null,
      suggested_anchor: ai.suggested_anchor || null,
      anchor_type: ai.anchor_type || null,
      relevance_reason: ai.relevance_reason || null,
      recommended_action: ai.recommended_action || null,
      asset_needed: !!ai.asset_needed,
      asset_suggestion: ai.asset_suggestion || null,
      context_fit: Math.round(ai.context_fit || 0),
      sector_fit: Math.round(ai.sector_fit || 0),
      page_type_fit: Math.round(ai.page_type_fit || 0),
      authority_score: Math.round(ai.authority_score || 0),
      placement_probability: Math.round(ai.placement_probability || 0),
      commercial_value: Math.round(ai.commercial_value || 0),
      risk_score: Math.round(ai.risk_score || 0),
      priority_score: priority,
      status,
    }, { onConflict: "website_id,source_url" });

    return json({ ok: true, priority_score: priority, status });
  } catch (e) {
    console.error("score-opportunity", e);
    return errJson((e as Error).message);
  }
});