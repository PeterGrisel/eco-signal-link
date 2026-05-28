import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const JOB_KEY = "striking-distance-scan";

function priorityFor(pos: number): "quick-win" | "optimize" | "rebuild" {
  if (pos >= 8 && pos <= 12) return "quick-win";
  if (pos >= 13 && pos <= 17) return "optimize";
  return "rebuild";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const started = Date.now();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    // Aggregate last 28 days of GSC data
    const since = new Date();
    since.setDate(since.getDate() - 28);

    const { data: rows, error } = await supabase
      .from("gsc_snapshots")
      .select("query,page,position,impressions,clicks")
      .gte("date", since.toISOString().slice(0, 10))
      .gte("position", 8)
      .lte("position", 20)
      .gte("impressions", 10)
      .limit(5000);
    if (error) throw error;

    // Aggregate per (query,page)
    const agg = new Map<string, { query: string; page: string; pos: number[]; imp: number; clk: number }>();
    for (const r of rows || []) {
      const k = `${r.query}||${r.page || ""}`;
      const cur = agg.get(k) || { query: r.query, page: r.page || "", pos: [], imp: 0, clk: 0 };
      cur.pos.push(Number(r.position) || 0);
      cur.imp += Number(r.impressions) || 0;
      cur.clk += Number(r.clicks) || 0;
      agg.set(k, cur);
    }

    const items = Array.from(agg.values())
      .filter(v => v.imp >= 50)
      .map(v => {
        const avg = v.pos.reduce((a, b) => a + b, 0) / v.pos.length;
        return {
          query: v.query,
          page: v.page,
          position: Math.round(avg * 10) / 10,
          impressions: v.imp,
          clicks: v.clk,
          priority: priorityFor(avg),
          status: "open",
        };
      })
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 100);

    let inserted = 0;
    for (const it of items) {
      const { error: upErr } = await supabase
        .from("seo_action_items")
        .upsert(it, { onConflict: "query,page", ignoreDuplicates: false });
      if (!upErr) inserted++;
    }

    const duration = Date.now() - started;
    const msg = `${inserted} striking-distance items opgeslagen`;
    await supabase.from("job_runs").insert({
      job_key: JOB_KEY, status: "success", message: msg,
      finished_at: new Date().toISOString(), duration_ms: duration,
      metadata: { items_processed: items.length },
    });

    return new Response(JSON.stringify({ ok: true, items: inserted }), {
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