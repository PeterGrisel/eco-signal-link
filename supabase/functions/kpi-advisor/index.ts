import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const body = await req.json().catch(() => ({}));
    const { mode = "analyze", suggestion_id } = body;

    // ══════════════════════════════════════
    // MODE: analyze — Get AI insights from GSC data
    // ══════════════════════════════════════
    if (mode === "analyze") {
      // Gather context
      const [gscRes, topicsRes, queueRes, postsRes, convRes, settingsRes] = await Promise.all([
        supabase.from("gsc_snapshots").select("*").gte("date", new Date(Date.now() - 28 * 86400000).toISOString().split("T")[0]).order("date", { ascending: false }).limit(500),
        supabase.from("content_topics").select("name, slug, target_article_count, priority, status").eq("status", "active"),
        supabase.from("content_queue").select("headline, status, content_type, scheduled_date").in("status", ["approved", "generating", "published"]).limit(100),
        supabase.from("blog_posts").select("title, slug, status, published_at").eq("status", "published").order("published_at", { ascending: false }).limit(50),
        supabase.from("conversion_pages").select("url, label").eq("is_active", true),
        supabase.from("seo_settings").select("config").limit(1).single(),
      ]);

      // Aggregate GSC data
      const gscData = gscRes.data || [];
      const queryMap: Record<string, { impressions: number; clicks: number; positions: number[]; pages: Set<string> }> = {};
      let totalImpressions = 0, totalClicks = 0;

      for (const row of gscData) {
        totalImpressions += row.impressions || 0;
        totalClicks += row.clicks || 0;
        if (!queryMap[row.query]) queryMap[row.query] = { impressions: 0, clicks: 0, positions: [], pages: new Set() };
        queryMap[row.query].impressions += row.impressions || 0;
        queryMap[row.query].clicks += row.clicks || 0;
        queryMap[row.query].positions.push(row.position || 100);
        if (row.page) queryMap[row.query].pages.add(row.page);
      }

      const topQueries = Object.entries(queryMap)
        .map(([q, d]) => ({
          query: q,
          impressions: d.impressions,
          clicks: d.clicks,
          avg_position: d.positions.reduce((a, b) => a + b, 0) / d.positions.length,
          pages: [...d.pages],
        }))
        .sort((a, b) => b.impressions - a.impressions)
        .slice(0, 40);

      // Quick wins: high impressions, low position (could rank higher)
      const quickWins = topQueries.filter(q => q.impressions > 50 && q.avg_position > 5 && q.avg_position < 25);
      // Missed opportunities: impressions but 0 clicks
      const missed = topQueries.filter(q => q.impressions > 20 && q.clicks === 0);

      // Run SEO audit inline
      let auditContext = "";
      try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const auditRes = await fetch(`${supabaseUrl}/functions/v1/seo-audit`, {
          method: "POST",
          headers: { Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        if (auditRes.ok) {
          const audit = await auditRes.json();
          const issues = (audit.checks || []).filter((c: any) => c.status !== "pass");
          if (issues.length > 0) {
            auditContext = `\n\nTECHNISCHE SEO AUDIT (score: ${audit.score}/100):\n${issues.map((c: any) => `[${c.status.toUpperCase()}] ${c.title}: ${c.detail} (impact: ${c.impact})`).join("\n")}`;
          } else {
            auditContext = `\n\nTECHNISCHE SEO AUDIT: Score ${audit.score}/100 — alle checks geslaagd.`;
          }
        }
      } catch (e) {
        console.error("Audit in advisor failed:", e);
      }

      const config = (settingsRes.data?.config as any) || {};

      const prompt = `Je bent een B2B SEO-strateeg voor ${config.site_name || "B2B Groeimachine"}.
${config.site_description || ""}

Analyseer de volgende data en geef EXACT 5 concrete suggesties in JSON format.

CONTEXT:
- Periode: afgelopen 28 dagen
- Totaal impressies: ${totalImpressions}, clicks: ${totalClicks}, CTR: ${totalClicks > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0}%
- Conversie-pagina's: ${(convRes.data || []).map((c: any) => c.label).join(", ") || "geen"}
- Actieve topic clusters: ${(topicsRes.data || []).map((t: any) => t.name).join(", ") || "geen"}
- Artikelen in pipeline: ${(queueRes.data || []).length}
- Gepubliceerde posts: ${(postsRes.data || []).length}

TOP KEYWORDS (impressies → clicks):
${topQueries.slice(0, 20).map(q => `"${q.query}" → ${q.impressions} imp, ${q.clicks} cl, pos ${q.avg_position.toFixed(1)}`).join("\n")}

QUICK WINS (hoge impressies, matige positie):
${quickWins.slice(0, 10).map(q => `"${q.query}" → ${q.impressions} imp, pos ${q.avg_position.toFixed(1)}`).join("\n") || "geen"}

MISSED OPPORTUNITIES (impressies zonder clicks):
${missed.slice(0, 10).map(q => `"${q.query}" → ${q.impressions} imp, pos ${q.avg_position.toFixed(1)}`).join("\n") || "geen"}

BESTAANDE CONTENT:
${(postsRes.data || []).slice(0, 20).map((p: any) => `- ${p.title}`).join("\n")}
${auditContext}

Geef 5 suggesties. Elk type kan zijn:
- "new_page": Nieuwe pagina/artikel ontwikkelen (geef headline, keyword, content_type)
- "optimize": Bestaande pagina optimaliseren (geef target page, optimalisatie acties)
- "strategy": Strategische aanbeveling (geef beschrijving) — gebruik ook technische SEO audit bevindingen
- "technical_fix": Technische SEO fix (geef beschrijving van het probleem en de oplossing)

BELANGRIJK: Suggesties moeten ACTIEGERICHT zijn en direct bijdragen aan conversie of organische groei. Als er technische SEO problemen zijn, neem minstens 1 technical_fix suggestie op.`;

      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "Je bent een data-gedreven B2B SEO-strateeg. Antwoord ALLEEN in het gevraagde JSON format." },
            { role: "user", content: prompt },
          ],
          tools: [{
            type: "function",
            function: {
              name: "provide_suggestions",
              description: "Return exactly 5 actionable KPI suggestions",
              parameters: {
                type: "object",
                properties: {
                  summary: { type: "string", description: "1-2 zin samenvatting van de huidige performance" },
                  suggestions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", enum: ["new_page", "optimize", "strategy"] },
                        priority: { type: "string", enum: ["high", "medium", "low"] },
                        title: { type: "string", description: "Korte titel van de suggestie" },
                        description: { type: "string", description: "Uitleg waarom en wat te doen" },
                        headline: { type: "string", description: "Voor new_page: voorgestelde headline" },
                        keyword: { type: "string", description: "Voor new_page: target keyword" },
                        content_type: { type: "string", enum: ["article", "tool", "pseo"] },
                        target_page: { type: "string", description: "Voor optimize: welke pagina" },
                      },
                      required: ["type", "priority", "title", "description"],
                    },
                  },
                },
                required: ["summary", "suggestions"],
              },
            },
          }],
          tool_choice: { type: "function", function: { name: "provide_suggestions" } },
        }),
      });

      if (!aiRes.ok) {
        const errText = await aiRes.text();
        console.error("AI gateway error:", aiRes.status, errText);
        if (aiRes.status === 429) return new Response(JSON.stringify({ error: "Rate limit bereikt, probeer het later opnieuw." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (aiRes.status === 402) return new Response(JSON.stringify({ error: "Credits op, vul aan via Settings > Workspace > Usage." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error(`AI error: ${aiRes.status}`);
      }

      const aiData = await aiRes.json();
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) throw new Error("Geen suggesties ontvangen van AI");

      const result = JSON.parse(toolCall.function.arguments);

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ══════════════════════════════════════
    // MODE: queue_suggestion — Push a suggestion to content_queue
    // ══════════════════════════════════════
    if (mode === "queue_suggestion") {
      const { headline, keyword, content_type = "article" } = body;
      if (!headline) throw new Error("headline is required");

      const { error } = await supabase.from("content_queue").insert({
        headline,
        keyword: keyword || headline,
        content_type,
        status: "pending",
        notes: "Voorgesteld door KPI AI Advisor",
      });
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown mode" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("kpi-advisor error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Onbekende fout" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
