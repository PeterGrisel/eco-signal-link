import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const JOB_KEY = "seo-health-monitor";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const started = Date.now();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const logRows: Array<any> = [];

    // 1. Anchor diversity check
    const { data: diversity } = await supabase.rpc("compute_anchor_diversity");
    for (const row of diversity || []) {
      if (row.severity !== "ok") {
        logRows.push({
          check_type: "anchor_diversity",
          target: row.target_url,
          severity: row.severity,
          metric_value: row.exact_pct,
          details: { total_links: row.total_links, exact_count: row.exact_count },
        });
      }
    }

    // 2. Over-linking per source page
    const { data: overLinked } = await supabase
      .from("link_suggestions")
      .select("source_url")
      .eq("status", "applied")
      .limit(10000);
    const counts = new Map<string, number>();
    for (const r of overLinked || []) {
      counts.set(r.source_url, (counts.get(r.source_url) || 0) + 1);
    }
    for (const [url, count] of counts.entries()) {
      if (count > 8) {
        logRows.push({
          check_type: "over_linking",
          target: url,
          severity: count > 12 ? "critical" : "warning",
          metric_value: count,
          details: { outgoing_links: count },
        });
      }
    }

    // 3. Orphan pages
    const { data: orphans } = await supabase.rpc("find_orphan_pages");
    if ((orphans || []).length > 0) {
      logRows.push({
        check_type: "orphan_pages",
        target: null,
        severity: (orphans?.length || 0) > 10 ? "warning" : "ok",
        metric_value: orphans?.length || 0,
        details: { sample: (orphans || []).slice(0, 20) },
      });
    }

    // Always log a heartbeat
    logRows.push({
      check_type: "heartbeat",
      severity: "ok",
      metric_value: logRows.length,
      details: { issues_found: logRows.filter(r => r.severity !== "ok").length },
    });

    if (logRows.length > 0) {
      await supabase.from("seo_health_log").insert(logRows);
    }

    const issues = logRows.filter(r => r.severity !== "ok").length;
    const duration = Date.now() - started;
    const msg = `${issues} issues gevonden, ${logRows.length} checks gelogd`;
    await supabase.from("job_runs").insert({
      job_key: JOB_KEY, status: "success", message: msg,
      finished_at: new Date().toISOString(), duration_ms: duration,
      metadata: { issues, checks: logRows.length },
    });

    return new Response(JSON.stringify({ ok: true, issues, checks: logRows.length }), {
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