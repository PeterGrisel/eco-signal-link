import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, svc, json, errJson, firecrawlScrape } from "../_shared/authority.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { placement_id } = await req.json();
    if (!placement_id) return errJson("placement_id required", 400);
    const sb = svc();
    const { data: p } = await sb.from("authority_placements").select("*").eq("id", placement_id).single();
    if (!p) return errJson("placement not found", 404);

    const scraped = await firecrawlScrape(p.placement_url, ["html", "links"]);
    const html: string = scraped?.html || "";
    const meta = scraped?.metadata || {};
    const links: string[] = scraped?.links || [];
    const status_code = meta.statusCode || 200;
    const noindex = meta.robots ? /noindex/i.test(meta.robots) : false;

    // Find anchor for target_url in HTML
    const target = p.target_url.replace(/\/$/, "");
    const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`<a[^>]+href=["']${escaped}/?["'][^>]*>([\\s\\S]*?)<\\/a>`, "i");
    const match = html.match(re);
    let link_found = !!match || links.some((l) => l.replace(/\/$/, "") === target);
    let actual_anchor: string | null = null;
    let rel_attribute: string | null = null;
    if (match) {
      actual_anchor = match[1].replace(/<[^>]+>/g, "").trim().slice(0, 200);
      const relMatch = match[0].match(/rel=["']([^"']+)["']/i);
      rel_attribute = relMatch ? relMatch[1] : "follow";
    }

    let status = "verified";
    if (!link_found) status = p.first_seen_at ? "lost" : "missing";
    else if (noindex) status = "noindex";

    await sb.from("authority_placements").update({
      link_found,
      actual_anchor,
      rel_attribute,
      status_code,
      indexable: !noindex,
      canonical_url: meta.canonical || null,
      first_seen_at: p.first_seen_at || (link_found ? new Date().toISOString() : null),
      last_checked_at: new Date().toISOString(),
      status,
    }).eq("id", placement_id);

    return json({ ok: true, link_found, status });
  } catch (e) {
    console.error("verify-placement", e);
    return errJson((e as Error).message);
  }
});