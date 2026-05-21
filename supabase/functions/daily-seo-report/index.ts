import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SLACK_GATEWAY = "https://connector-gateway.lovable.dev/slack/api";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function fmtNum(n: number) {
  return new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 0 }).format(n);
}
function fmtPct(n: number) {
  return (n * 100).toFixed(2) + "%";
}
function deltaStr(curr: number, prev: number) {
  if (prev === 0) return curr > 0 ? "🆕" : "—";
  const diff = ((curr - prev) / prev) * 100;
  const arrow = diff > 0 ? "▲" : diff < 0 ? "▼" : "▬";
  return `${arrow} ${diff > 0 ? "+" : ""}${diff.toFixed(1)}%`;
}

async function fetchOverview(days: number) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/fetch-gsc-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ mode: "overview", days }),
  });
  if (!res.ok) throw new Error(`fetch-gsc-data failed: ${res.status}`);
  return await res.json();
}

async function postToSlack(blocks: any[], text: string) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const SLACK_API_KEY = Deno.env.get("SLACK_API_KEY");
  const channel = Deno.env.get("SLACK_REPORT_CHANNEL");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY niet geconfigureerd");
  if (!SLACK_API_KEY) throw new Error("SLACK_API_KEY niet geconfigureerd (connect Slack)");
  if (!channel) throw new Error("SLACK_REPORT_CHANNEL niet geconfigureerd");

  const res = await fetch(`${SLACK_GATEWAY}/chat.postMessage`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": SLACK_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel,
      text,
      blocks,
      username: "B2BGM SEO Rapport",
      icon_emoji: ":chart_with_upwards_trend:",
    }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`Slack postMessage failed: ${data.error}`);
  return data;
}

async function weeklyReindex(supabase: any) {
  // Posts gepubliceerd of bijgewerkt in laatste 7 dagen
  const since = new Date();
  since.setDate(since.getDate() - 7);

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at, published_at")
    .eq("status", "published")
    .or(`published_at.gte.${since.toISOString()},updated_at.gte.${since.toISOString()}`)
    .limit(50);

  if (!posts || posts.length === 0) return { count: 0, urls: [] as string[] };

  const urls = posts.map((p: any) => `https://b2bgroeimachine.io/blog/${p.slug}`);

  const res = await fetch(`${SUPABASE_URL}/functions/v1/request-indexing`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ urls }),
  });
  const json = await res.json().catch(() => ({}));
  return { count: urls.length, urls, results: json.results };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Pull current week + previous week
    const last7 = await fetchOverview(7);
    const last14 = await fetchOverview(14);

    const curr = last7.totals || { impressions: 0, clicks: 0, ctr: 0, conversion_clicks: 0 };
    const total14 = last14.totals || { impressions: 0, clicks: 0 };
    const prev = {
      impressions: Math.max(0, (total14.impressions || 0) - (curr.impressions || 0)),
      clicks: Math.max(0, (total14.clicks || 0) - (curr.clicks || 0)),
    };

    const topQueries = (last7.top_queries || []).slice(0, 5);
    const topPages = (last7.top_pages || []).slice(0, 5);

    // Weekly re-index on Mondays (UTC; cron runs at 16:00 UTC = 18:00 CEST)
    const isMonday = new Date().getUTCDay() === 1;
    let reindexInfo: { count: number; urls: string[] } | null = null;
    if (isMonday) {
      try {
        reindexInfo = await weeklyReindex(supabase);
      } catch (e) {
        console.error("Weekly reindex failed:", e);
      }
    }

    const today = new Date().toLocaleDateString("nl-NL", {
      weekday: "long", day: "numeric", month: "long",
    });

    const blocks: any[] = [
      {
        type: "header",
        text: { type: "plain_text", text: `📊 SEO Rapport — ${today}` },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Impressies (7d)*\n${fmtNum(curr.impressions)} ${deltaStr(curr.impressions, prev.impressions)}` },
          { type: "mrkdwn", text: `*Clicks (7d)*\n${fmtNum(curr.clicks)} ${deltaStr(curr.clicks, prev.clicks)}` },
          { type: "mrkdwn", text: `*CTR*\n${fmtPct(curr.ctr || 0)}` },
          { type: "mrkdwn", text: `*Conversie-clicks*\n${fmtNum(curr.conversion_clicks || 0)}` },
        ],
      },
      { type: "divider" },
    ];

    if (topQueries.length > 0) {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*🔍 Top 5 queries (impressies)*\n` +
            topQueries.map((q: any, i: number) =>
              `${i + 1}. \`${q.query}\` — ${fmtNum(q.impressions)} impr · ${fmtNum(q.clicks)} clicks · pos ${(q.position || 0).toFixed(1)}`
            ).join("\n"),
        },
      });
    }

    if (topPages.length > 0) {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*📄 Top 5 pagina's*\n` +
            topPages.map((p: any, i: number) =>
              `${i + 1}. <${p.page}|${p.page.replace("https://b2bgroeimachine.io", "") || "/"}> — ${fmtNum(p.impressions)} impr · ${fmtNum(p.clicks)} clicks`
            ).join("\n"),
        },
      });
    }

    if (reindexInfo) {
      blocks.push({ type: "divider" });
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*🔄 Wekelijkse re-index (maandag)*\n${reindexInfo.count} blog${reindexInfo.count === 1 ? "" : "s"} ingediend bij Google Indexing API.`,
        },
      });
    }

    blocks.push({
      type: "context",
      elements: [
        { type: "mrkdwn", text: `<https://b2bgroeimachine.io/admin/seo|Open SEO dashboard> · automatisch om 18:00 CET` },
      ],
    });

    await postToSlack(blocks, `SEO Rapport — ${today}: ${fmtNum(curr.impressions)} impr, ${fmtNum(curr.clicks)} clicks (7d)`);

    return new Response(JSON.stringify({
      ok: true,
      sent: true,
      reindex: reindexInfo,
      totals: curr,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("daily-seo-report error:", e);
    return new Response(JSON.stringify({
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});