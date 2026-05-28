import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const JOB_KEY = "gsc-opportunity-scan";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const started = Date.now();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const since = new Date(Date.now() - 28 * 24 * 3600 * 1000).toISOString().slice(0, 10);

    // Aggregate query+page over the period
    const { data: rows, error } = await supabase
      .from("gsc_snapshots")
      .select("query,page,position,impressions,clicks,date")
      .gte("date", since)
      .limit(50000);
    if (error) throw error;

    const grouped = new Map<string, { query: string; page: string; impressions: number; clicks: number; positions: number[] }>();
    for (const r of rows || []) {
      const key = `${r.query}|||${r.page || ""}`;
      const g = grouped.get(key) || { query: r.query, page: r.page || "", impressions: 0, clicks: 0, positions: [] };
      g.impressions += r.impressions || 0;
      g.clicks += r.clicks || 0;
      if (typeof r.position === "number" || typeof r.position === "string") g.positions.push(Number(r.position));
      grouped.set(key, g);
    }

    let added = 0;
    for (const g of grouped.values()) {
      if (g.impressions < 100) continue;
      const avgPos = g.positions.reduce((s, n) => s + n, 0) / Math.max(1, g.positions.length);
      let suggested: string | null = null;
      if (avgPos >= 5 && avgPos <= 20) suggested = "add_internal_link";
      else if (avgPos > 20 && g.impressions > 300) suggested = "expand_content";
      else if (avgPos > 30 && g.impressions > 500) suggested = "new_article";
      if (!suggested) continue;

      // Upsert by query+page (open status only — don't overwrite reviewed ones)
      const { data: existing } = await supabase
        .from("keyword_opportunities")
        .select("id,status")
        .eq("query", g.query).eq("page", g.page).maybeSingle();
      if (existing && existing.status !== "open") continue;

      const payload = {
        query: g.query, page: g.page, position: Number(avgPos.toFixed(1)),
        impressions: g.impressions, clicks: g.clicks,
        suggested_action: suggested, status: "open",
      };
      if (existing) {
        await supabase.from("keyword_opportunities").update(payload).eq("id", existing.id);
      } else {
        await supabase.from("keyword_opportunities").insert(payload);
        added++;
      }
    }

    const duration = Date.now() - started;
    await supabase.from("job_runs").insert({
      job_key: JOB_KEY, status: "success",
      message: `${added} nieuwe kansen gevonden (${grouped.size} query-page combinaties bekeken)`,
      finished_at: new Date().toISOString(), duration_ms: duration,
    });

    return new Response(JSON.stringify({ ok: true, added, scanned: grouped.size }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    await supabase.from("job_runs").insert({
      job_key: JOB_KEY, status: "error", message: String(e),
      finished_at: new Date().toISOString(), duration_ms: Date.now() - started,
    });
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});