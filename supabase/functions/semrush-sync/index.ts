import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY = "https://connector-gateway.lovable.dev/semrush";
const TARGET_DOMAIN = "b2bgroeimachine.io";
const DB = "nl";

function gwHeaders() {
  return {
    Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
    "X-Connection-Api-Key": Deno.env.get("SEMRUSH_API_KEY") ?? "",
  };
}

async function semrushGet(path: string, params: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  const url = `${GATEWAY}${path}?${qs}`;
  const res = await fetch(url, { headers: { ...gwHeaders(), "Allow-Limit-Offset": "true" } });
  const body = await res.text();
  if (!res.ok) throw new Error(`Semrush ${path} ${res.status}: ${body.slice(0, 300)}`);
  let json: any;
  try { json = JSON.parse(body); } catch { throw new Error(`Bad JSON from ${path}: ${body.slice(0, 200)}`); }
  if (json?.error) throw new Error(`Semrush error: ${json.error}`);
  const cols: string[] = json?.data?.columnNames ?? [];
  const rows: any[][] = json?.data?.rows ?? [];
  return rows.map((r) => Object.fromEntries(cols.map((c, i) => [c, r[i]])));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // Auth: caller must be admin
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData } = await userClient.auth.getUser();
  if (!userData?.user) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  const admin = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: roleRow } = await admin.from("user_roles").select("role").eq("user_id", userData.user.id).eq("role", "admin").maybeSingle();
  if (!roleRow) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const { data: runIns, error: runErr } = await admin
    .from("semrush_sync_runs")
    .insert({ target_domain: TARGET_DOMAIN, status: "running" })
    .select()
    .single();
  if (runErr) {
    return new Response(JSON.stringify({ error: runErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  const runId = runIns.id;

  try {
    // 1. Overview (totals + AS)
    const overview = await semrushGet("/backlinks/backlinks_overview", {
      target: TARGET_DOMAIN,
      target_type: "root_domain",
      export_columns: "ascore,total,domains_num",
    });
    const ov = overview[0] ?? {};
    const ascore = Number(ov.ascore ?? 0);
    const total = Number(ov.total ?? 0);
    const refdoms = Number(ov.domains_num ?? 0);

    // 2. Backlinks list (up to 200 recent)
    const backlinks = await semrushGet("/backlinks/backlinks", {
      target: TARGET_DOMAIN,
      target_type: "root_domain",
      export_columns: "source_url,source_title,target_url,anchor,page_ascore,nofollow,first_seen,last_seen",
      display_limit: "200",
    });

    const now = new Date().toISOString();
    const seenKeys = new Set<string>();
    let newCount = 0;
    for (const b of backlinks) {
      const source_url = String(b.source_url ?? "").slice(0, 2000);
      const target_url = String(b.target_url ?? "").slice(0, 2000);
      if (!source_url || !target_url) continue;
      seenKeys.add(`${source_url}|${target_url}`);
      const source_domain = (() => { try { return new URL(source_url).hostname; } catch { return null; } })();
      const { data: existing } = await admin
        .from("semrush_backlinks")
        .select("id,status")
        .eq("source_url", source_url)
        .eq("target_url", target_url)
        .maybeSingle();
      if (!existing) newCount++;
      await admin.from("semrush_backlinks").upsert({
        source_url,
        target_url,
        source_domain,
        anchor: b.anchor ?? null,
        page_ascore: b.page_ascore != null ? Number(b.page_ascore) : null,
        nofollow: b.nofollow === true || b.nofollow === "true",
        last_seen: now,
        status: "active",
      }, { onConflict: "source_url,target_url" });
    }

    // 3. Mark lost — backlinks not seen for >30d AND were active
    const cutoff = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
    const { data: lostRows } = await admin
      .from("semrush_backlinks")
      .select("id")
      .eq("status", "active")
      .lt("last_seen", cutoff);
    let lostCount = 0;
    if (lostRows && lostRows.length > 0) {
      lostCount = lostRows.length;
      await admin.from("semrush_backlinks").update({ status: "lost" }).in("id", lostRows.map((r) => r.id));
    }

    // 4. Organic keyword positions (top 25)
    let risingPages = 0;
    try {
      const organic = await semrushGet("/domains/domain_organic", {
        domain: TARGET_DOMAIN,
        database: DB,
        export_columns: "Ph,Po,Nq,Tr,Ur",
        display_limit: "25",
      });
      const positionsRows = organic.map((r: any) => ({
        captured_at: now,
        keyword: String(r.Ph ?? ""),
        url: String(r.Ur ?? ""),
        position: Number(r.Po ?? 0),
        volume: r.Nq != null ? Number(r.Nq) : null,
        traffic_pct: r.Tr != null ? Number(r.Tr) : null,
        database_code: DB,
      })).filter((r) => r.keyword && r.url && r.position > 0);

      if (positionsRows.length > 0) {
        await admin.from("semrush_kw_positions").insert(positionsRows);

        // Compute rising: compare to previous distinct snapshot date
        const { data: prevSnap } = await admin
          .from("semrush_kw_positions")
          .select("captured_at")
          .lt("captured_at", now)
          .order("captured_at", { ascending: false })
          .limit(1);
        if (prevSnap && prevSnap[0]) {
          const prevAt = prevSnap[0].captured_at;
          const { data: prevRows } = await admin
            .from("semrush_kw_positions")
            .select("keyword,position")
            .eq("captured_at", prevAt);
          const prevMap = new Map<string, number>((prevRows ?? []).map((r: any) => [r.keyword, r.position]));
          for (const r of positionsRows) {
            const p = prevMap.get(r.keyword);
            if (p != null && r.position < p) risingPages++;
          }
        }
      }
    } catch (e) {
      console.warn("organic step failed:", e);
    }

    await admin.from("semrush_sync_runs").update({
      finished_at: now,
      status: "ok",
      authority_score: ascore,
      total_backlinks: total,
      total_refdomains: refdoms,
      new_backlinks: newCount,
      lost_backlinks: lostCount,
      rising_pages: risingPages,
    }).eq("id", runId);

    return new Response(JSON.stringify({
      ok: true,
      ascore, total, refdoms, newCount, lostCount, risingPages,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    await admin.from("semrush_sync_runs").update({
      finished_at: new Date().toISOString(),
      status: "error",
      error: String(e?.message ?? e).slice(0, 1000),
    }).eq("id", runId);
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});