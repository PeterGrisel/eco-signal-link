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

    const sys = `Je bent een SEO Authority Analyst. Beoordeel of de kandidaatpagina een relevante en veilige authority opportunity is voor de website. Wijs af bij irrelevantie, spam, casino, betting, crypto, adult, fake directories of pagina's zonder contextfit.

BELANGRIJK — SCORING SCHAAL:
- Alle score-velden (context_fit, sector_fit, page_type_fit, authority_score, placement_probability, commercial_value, risk_score) zijn GEHELE GETALLEN op een schaal van 0 tot 100.
- 0 = totaal niet, 50 = gemiddeld, 80 = sterk, 100 = perfect.
- Gebruik NOOIT een 0-10 schaal. Een matige fit is 40-60, niet 4-6.
- risk_score: 0 = veilig, 100 = spam/gevaarlijk. Een normale B2B SaaS-pagina is 10-30.
- Wees genereus bij thematisch relevante B2B/sales/CRM/automation pagina's: context_fit 60-90.`;
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

    // Safety net: if model returned 0-10 scale, multiply by 10.
    const scale = (n: number) => {
      const v = Number(n) || 0;
      return v > 0 && v <= 10 ? v * 10 : v;
    };
    const s = {
      context_fit: scale(ai.context_fit),
      sector_fit: scale(ai.sector_fit),
      page_type_fit: scale(ai.page_type_fit),
      authority_score: scale(ai.authority_score),
      placement_probability: scale(ai.placement_probability),
      commercial_value: scale(ai.commercial_value),
      risk_score: scale(ai.risk_score),
    };
    const priority = calcPriority(s);

    let status = "discovered";
    if (!ai.is_relevant || s.risk_score >= 60) status = "rejected";
    else if (priority >= 65) status = "qualified";
    else if (priority >= 30) status = "discovered";
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
      context_fit: Math.round(s.context_fit),
      sector_fit: Math.round(s.sector_fit),
      page_type_fit: Math.round(s.page_type_fit),
      authority_score: Math.round(s.authority_score),
      placement_probability: Math.round(s.placement_probability),
      commercial_value: Math.round(s.commercial_value),
      risk_score: Math.round(s.risk_score),
      priority_score: priority,
      status,
    }, { onConflict: "website_id,source_url" });

    return json({ ok: true, priority_score: priority, status });
  } catch (e) {
    console.error("score-opportunity", e);
    return errJson((e as Error).message);
  }
});