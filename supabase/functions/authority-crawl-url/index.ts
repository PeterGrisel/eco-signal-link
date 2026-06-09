import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, svc, json, errJson, firecrawlScrape, domainOf } from "../_shared/authority.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { crawled_page_id } = await req.json();
    if (!crawled_page_id) return errJson("crawled_page_id required", 400);
    const sb = svc();
    const { data: page } = await sb.from("authority_crawled_pages").select("*").eq("id", crawled_page_id).single();
    if (!page) return errJson("page not found", 404);

    let scraped: any;
    try {
      scraped = await firecrawlScrape(page.url, ["markdown", "links", "html"]);
    } catch (err) {
      const msg = (err as Error).message || "scrape failed";
      const unsupported = /do not support this site|forbidden|403|blocked/i.test(msg);
      await sb.from("authority_crawled_pages").update({
        status_code: unsupported ? 451 : 0,
        text_excerpt: `[crawl failed] ${msg.slice(0, 500)}`,
        last_crawled_at: new Date().toISOString(),
        robots_allowed: false,
        indexable: false,
      }).eq("id", crawled_page_id);
      return json({ ok: false, skipped: true, reason: unsupported ? "unsupported_site" : "scrape_error", message: msg.slice(0, 200) });
    }
    const md: string = scraped?.markdown || "";
    const html: string = scraped?.html || "";
    const links: string[] = scraped?.links || [];
    const meta = scraped?.metadata || {};

    const dom = domainOf(page.url);
    const internal = links.filter((l) => domainOf(l) === dom).length;
    const outbound = links.length - internal;
    const emails = Array.from(new Set((html + " " + md).match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) || [])).slice(0, 10);
    const h1 = (md.match(/^#\s+(.+)$/m)?.[1]) || meta.title || null;
    const h2 = (md.match(/^##\s+(.+)$/gm) || []).map((s) => s.replace(/^##\s+/, "")).slice(0, 20);
    const contactUrls = links.filter((l) => /\/(contact|about|over-ons|team)\b/i.test(l)).slice(0, 5);

    await sb.from("authority_crawled_pages").update({
      status_code: meta.statusCode || 200,
      title: meta.title || page.title,
      meta_description: meta.description || page.meta_description,
      h1,
      h2,
      text_excerpt: md.slice(0, 4000),
      canonical_url: meta.canonical || null,
      robots_allowed: meta.robots ? !/noindex/i.test(meta.robots) : true,
      indexable: meta.robots ? !/noindex/i.test(meta.robots) : true,
      outbound_link_count: outbound,
      internal_link_count: internal,
      emails,
      contact_urls: contactUrls,
      last_crawled_at: new Date().toISOString(),
    }).eq("id", crawled_page_id);

    return json({ ok: true });
  } catch (e) {
    console.error("crawl-url", e);
    return errJson((e as Error).message);
  }
});