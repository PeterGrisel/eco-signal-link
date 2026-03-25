import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function getSupabase() {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = getSupabase();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    // Determine month to evaluate (previous month)
    const now = new Date();
    const evalMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const monthStr = evalMonth.toISOString().split("T")[0].slice(0, 7); // YYYY-MM
    const monthDate = `${monthStr}-01`;

    const startDate = `${monthStr}-01`;
    const endDate = new Date(evalMonth.getFullYear(), evalMonth.getMonth() + 1, 0).toISOString().split("T")[0];

    // Aggregate GSC data for the month
    const { data: gscData } = await supabase
      .from("gsc_snapshots")
      .select("query, page, impressions, clicks, ctr, position")
      .gte("date", startDate)
      .lte("date", endDate);

    let totalImpressions = 0, totalClicks = 0;
    const queryMap: Record<string, { impressions: number; clicks: number; ctr: number; position: number; count: number }> = {};

    (gscData || []).forEach(r => {
      totalImpressions += r.impressions || 0;
      totalClicks += r.clicks || 0;
      if (!queryMap[r.query]) queryMap[r.query] = { impressions: 0, clicks: 0, ctr: 0, position: 0, count: 0 };
      queryMap[r.query].impressions += r.impressions || 0;
      queryMap[r.query].clicks += r.clicks || 0;
      queryMap[r.query].position += Number(r.position) || 0;
      queryMap[r.query].count += 1;
    });

    const topKeywords = Object.entries(queryMap)
      .map(([query, d]) => ({ query, impressions: d.impressions, clicks: d.clicks, avg_position: d.position / d.count }))
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 20);

    // Conversion clicks
    const { data: convPages } = await supabase.from("conversion_pages").select("url").eq("is_active", true);
    const convUrls = convPages?.map(p => p.url) || [];
    let conversionClicks = 0;
    (gscData || []).forEach(r => {
      if (r.page && convUrls.some(u => r.page.includes(u))) {
        conversionClicks += r.clicks || 0;
      }
    });

    // Articles published this month
    const { count: articlesPublished } = await supabase
      .from("blog_posts")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .gte("published_at", startDate)
      .lte("published_at", endDate);

    // Topic performance
    const { data: topics } = await supabase
      .from("content_topics")
      .select("id, name, target_article_count, target_keywords")
      .eq("status", "active");

    const { data: topicPosts } = await supabase
      .from("blog_posts")
      .select("topic_id")
      .not("topic_id", "is", null)
      .eq("status", "published");

    const topicCounts: Record<string, number> = {};
    topicPosts?.forEach(p => {
      topicCounts[p.topic_id!] = (topicCounts[p.topic_id!] || 0) + 1;
    });

    const topicPerformance = (topics || []).map(t => ({
      name: t.name,
      published: topicCounts[t.id] || 0,
      target: t.target_article_count || 3,
      gap: Math.max(0, (t.target_article_count || 3) - (topicCounts[t.id] || 0)),
    }));

    // AI recommendations
    let recommendations: string[] = [];
    if (LOVABLE_API_KEY) {
      try {
        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [{
              role: "user",
              content: `Geef 5 korte, actiegerichte aanbevelingen voor de content strategie van volgende maand. Data:
- Impressies: ${totalImpressions}, Clicks: ${totalClicks}, CTR: ${totalClicks > 0 && totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : 0}%
- Conversie clicks: ${conversionClicks}
- Artikelen gepubliceerd: ${articlesPublished || 0}
- Top keywords: ${topKeywords.slice(0, 10).map(k => `"${k.query}" (pos ${k.avg_position.toFixed(1)})`).join(", ")}
- Topics met gaps: ${topicPerformance.filter(t => t.gap > 0).map(t => `"${t.name}" (${t.gap} nodig)`).join(", ")}

Antwoord als JSON array van strings. Alleen de array, geen markdown.`,
            }],
          }),
        });
        if (res.ok) {
          const aiData = await res.json();
          const content = aiData.choices?.[0]?.message?.content;
          if (content) {
            try { recommendations = JSON.parse(content.replace(/```json?\n?/g, "").replace(/```/g, "").trim()); } catch {}
          }
        }
      } catch (e) { console.error("AI recommendations failed:", e); }
    }

    const avgCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
    const avgPosition = topKeywords.length > 0
      ? topKeywords.reduce((s, k) => s + k.avg_position, 0) / topKeywords.length : 0;

    // Upsert monthly evaluation
    const { error } = await supabase.from("monthly_evaluations").upsert({
      month: monthDate,
      total_impressions: totalImpressions,
      total_clicks: totalClicks,
      avg_ctr: avgCtr,
      avg_position: avgPosition,
      conversion_clicks: conversionClicks,
      articles_published: articlesPublished || 0,
      top_keywords: topKeywords,
      topic_performance: topicPerformance,
      recommendations,
    }, { onConflict: "month" });

    if (error) throw error;

    return new Response(JSON.stringify({
      month: monthStr,
      total_impressions: totalImpressions,
      total_clicks: totalClicks,
      conversion_clicks: conversionClicks,
      articles_published: articlesPublished || 0,
      recommendations_count: recommendations.length,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("monthly-evaluation error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Onbekende fout" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
