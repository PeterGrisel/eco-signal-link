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

    const rootUrl = site.domain.startsWith("http") ? site.domain : `https://${site.domain}`;
    const host = new URL(rootUrl).hostname.replace(/^www\./, "");

    const home = await firecrawlScrape(rootUrl, ["markdown", "links"]);
    const homeMd = (home?.markdown || "").slice(0, 8000);
    const allLinks: string[] = Array.isArray(home?.links) ? home.links : [];

    // Pick up to 6 internal pages (same host, not anchors/assets, not homepage)
    const seen = new Set<string>([rootUrl.replace(/\/$/, "")]);
    const internal: string[] = [];
    const skipExt = /\.(pdf|jpg|jpeg|png|svg|gif|webp|zip|mp4|mp3|css|js)(\?|$)/i;
    const skipPath = /\/(wp-admin|wp-content|cdn-cgi|tag|author|category|page\/\d)/i;
    for (const raw of allLinks) {
      try {
        const u = new URL(raw, rootUrl);
        if (u.hostname.replace(/^www\./, "") !== host) continue;
        if (skipExt.test(u.pathname)) continue;
        if (skipPath.test(u.pathname)) continue;
        const clean = `${u.origin}${u.pathname}`.replace(/\/$/, "");
        if (seen.has(clean)) continue;
        seen.add(clean);
        internal.push(clean);
        if (internal.length >= 6) break;
      } catch { /* ignore */ }
    }

    const pageScrapes = await Promise.allSettled(
      internal.map((u) => firecrawlScrape(u, ["markdown"]))
    );
    const pages: { url: string; md: string }[] = [];
    pageScrapes.forEach((r, i) => {
      if (r.status === "fulfilled") {
        const md = (r.value?.markdown || "").slice(0, 4000);
        if (md) pages.push({ url: internal[i], md });
      }
    });

    const pagesBlock = pages.map((p) => `--- PAGE: ${p.url} ---\n${p.md}`).join("\n\n");
    const linksSample = allLinks.slice(0, 60).join("\n");

    const sys = `Je bent een senior SEO Context Analyst voor B2B websites. Lees de aangeleverde pagina's grondig en bouw een rijk, concreet contextprofiel.

Regels:
- Schrijf in helder Nederlands, korte termen (1-4 woorden per tag).
- Vul ALLE velden in. Lever minimaal: 3 ICP-segmenten, 5 core topics, 5 secondary topics, 3 sectoren, 3 differentiators, 3 money pages (volledige URLs of slugs), 3 recommended pages, 3 linkable assets, 3 negative keywords.
- Money pages = commerciële conversiepagina's (diensten, pricing, demo, contact).
- Recommended pages = inhoudelijke hub-pagina's geschikt als linktarget.
- Linkable assets = unieke content/tools/calculators/whitepapers waar anderen naar willen linken.
- Negative keywords = thema's/sectoren waar je expliciet NIET mee geassocieerd wilt worden.
- raw_summary = 3-5 zinnen samenvatting van het bedrijf en aanbod.`;

    const user = `Website: ${site.domain}
Beschrijving (door gebruiker): ${site.description || "(geen)"}

# Homepage
${homeMd}

# Interne pagina's (${pages.length})
${pagesBlock}

# Interne links sample
${linksSample}`;

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