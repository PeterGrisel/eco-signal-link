import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, svc, json, errJson } from "../_shared/authority.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const secret = req.headers.get("x-cron-secret");
    if (secret !== Deno.env.get("CRON_SECRET")) return errJson("unauthorized", 401);
    const sb = svc();

    const projectRef = Deno.env.get("SUPABASE_URL")!.replace(/^https:\/\//, "").split(".")[0];
    const base = `https://${projectRef}.supabase.co/functions/v1`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
    };

    // 1. Verify placements that are placed/verified, oldest first
    const { data: placements } = await sb
      .from("authority_placements")
      .select("id")
      .in("status", ["placed", "verified", "lost", "noindex", "missing"])
      .order("last_checked_at", { ascending: true, nullsFirst: true })
      .limit(20);

    for (const p of placements || []) {
      await fetch(`${base}/authority-verify-placement`, { method: "POST", headers, body: JSON.stringify({ placement_id: p.id }) }).catch(() => {});
    }

    // 2. Discover for each active website (small batch)
    const { data: sites } = await sb.from("authority_websites").select("id").eq("status", "active");
    for (const s of sites || []) {
      await fetch(`${base}/authority-discover`, { method: "POST", headers, body: JSON.stringify({ website_id: s.id, query_limit: 5, results_per_query: 5 }) }).catch(() => {});
    }

    // 3. Score newest unscored crawled pages
    const { data: pages } = await sb
      .from("authority_crawled_pages")
      .select("id, website_id, url")
      .order("created_at", { ascending: false })
      .limit(25);
    const urls = (pages || []).map((p) => p.url);
    const { data: scored } = await sb.from("authority_opportunities").select("source_url").in("source_url", urls.length ? urls : [""]);
    const have = new Set((scored || []).map((r) => r.source_url));
    for (const pg of pages || []) {
      if (have.has(pg.url)) continue;
      // crawl, then score
      await fetch(`${base}/authority-crawl-url`, { method: "POST", headers, body: JSON.stringify({ crawled_page_id: pg.id }) }).catch(() => {});
      await fetch(`${base}/authority-score-opportunity`, { method: "POST", headers, body: JSON.stringify({ crawled_page_id: pg.id }) }).catch(() => {});
    }

    return json({ ok: true, verified: placements?.length || 0, sites: sites?.length || 0, scored_attempted: pages?.length || 0 });
  } catch (e) {
    console.error("authority-daily-cron", e);
    return errJson((e as Error).message);
  }
});