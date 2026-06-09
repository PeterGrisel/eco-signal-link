import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, svc, json, errJson, firecrawlSearch, domainOf, matchesNegative } from "../_shared/authority.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { website_id, query_limit = 10, results_per_query = 5 } = await req.json();
    if (!website_id) return errJson("website_id required", 400);
    const sb = svc();

    const { data: site } = await sb.from("authority_websites").select("*").eq("id", website_id).single();
    const { data: profile } = await sb.from("authority_context_profiles").select("negative_keywords").eq("website_id", website_id).maybeSingle();
    if (!site) return errJson("website not found", 404);
    const negatives: string[] = profile?.negative_keywords || [];

    // Pick top-priority queries that have not been run recently
    const { data: queries } = await sb
      .from("authority_queries")
      .select("*")
      .eq("website_id", website_id)
      .eq("status", "active")
      .order("last_run_at", { ascending: true, nullsFirst: true })
      .order("priority", { ascending: false })
      .limit(query_limit);

    if (!queries?.length) return errJson("no queries available, generate first", 400);

    // Create run
    const { data: run } = await sb
      .from("authority_runs")
      .insert({ website_id, run_type: "query_discovery", status: "running", started_at: new Date().toISOString(), queries_count: queries.length })
      .select()
      .single();

    let discovered = 0;
    const ownDomain = site.domain.replace(/^https?:\/\//, "").replace(/^www\./, "");

    for (const q of queries) {
      try {
        const results = await firecrawlSearch(q.query, results_per_query);
        for (const r of results) {
          const url: string = r.url || r.link;
          if (!url) continue;
          const dom = domainOf(url);
          if (!dom || dom === ownDomain) continue;
          const blob = `${r.title || ""} ${r.description || ""} ${url}`;
          if (matchesNegative(blob, negatives)) continue;

          await sb.from("authority_crawled_pages").upsert({
            website_id,
            discovery_run_id: run!.id,
            url,
            domain: dom,
            title: r.title || null,
            meta_description: r.description || null,
          }, { onConflict: "website_id,url", ignoreDuplicates: true });
          discovered++;
        }
        await sb.from("authority_queries").update({ last_run_at: new Date().toISOString() }).eq("id", q.id);
      } catch (err) {
        console.error("query failed", q.query, err);
      }
    }

    await sb.from("authority_runs").update({
      status: "completed",
      urls_discovered: discovered,
      completed_at: new Date().toISOString(),
    }).eq("id", run!.id);

    return json({ ok: true, run_id: run!.id, urls_discovered: discovered });
  } catch (e) {
    console.error("discover", e);
    return errJson((e as Error).message);
  }
});