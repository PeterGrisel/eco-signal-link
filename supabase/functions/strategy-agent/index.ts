import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function getSupabase() {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
}

async function fetchPageContent(url: string): Promise<string> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "B2BGroeiMachine-StrategyAgent/1.0" } });
    if (!res.ok) return "";
    const html = await res.text();
    // Strip HTML tags, scripts, styles — extract text
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 5000); // Limit per page
  } catch { return ""; }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = getSupabase();
    const { competitors = [], mode = "generate" } = await req.json().catch(() => ({}));

    // 1. Load SEO settings
    const { data: settingsRow } = await supabase.from("seo_settings").select("config").limit(1).single();
    const settings = settingsRow?.config || {};
    const siteUrl = settings.site_url || "https://b2bgroeimachine.io";
    const siteName = settings.name || "B2BGroeiMachine";
    const audience = settings.target_audience_summary || "MKB en midmarket B2B-bedrijven in Nederland";
    const blogTheme = settings.blog_theme || "";
    const niche = settings.summary || "B2B sales, recruitment en data-gedreven groei-systemen";

    // 2. Scrape own website pages
    const ownPages = [
      "/", "/over-ons", "/full-sales-management", "/full-service-recruitment", "/blog"
    ];
    const ownContent: string[] = [];
    for (const path of ownPages) {
      const content = await fetchPageContent(`${siteUrl}${path}`);
      if (content) ownContent.push(`--- ${path} ---\n${content.slice(0, 3000)}`);
    }

    // 3. Scrape competitor pages (if provided)
    const competitorContent: string[] = [];
    const competitorUrls = competitors.length > 0 ? competitors : (settings.competitors || []);
    for (const url of competitorUrls.slice(0, 3)) {
      const content = await fetchPageContent(url);
      if (content) competitorContent.push(`--- ${url} ---\n${content.slice(0, 3000)}`);
      // Also try their blog
      const blogContent = await fetchPageContent(`${url}/blog`);
      if (blogContent) competitorContent.push(`--- ${url}/blog ---\n${blogContent.slice(0, 2000)}`);
    }

    // 4. Load existing topics and blog posts
    const [{ data: existingTopics }, { data: existingPosts }] = await Promise.all([
      supabase.from("content_topics").select("name, slug, description, target_keywords, target_article_count, priority, status"),
      supabase.from("blog_posts").select("title, slug, topic_id, status").eq("status", "published").limit(50),
    ]);

    // 5. Load GSC data + calculate SEO Avalanche threshold
    let gscInsights = "";
    let avalancheThreshold = 10; // default minimum
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

    const { data: gscData } = await supabase
      .from("gsc_snapshots")
      .select("query, impressions, clicks, position, date")
      .gte("date", thirtyDaysAgoStr)
      .order("impressions", { ascending: false })
      .limit(200);

    if (gscData?.length) {
      // Filter out branded queries
      const brandTerms = [siteName.toLowerCase(), "b2bgroeimachine", "b2b groeimachine", "groeimachine"];
      const nonBranded = gscData.filter(r => !brandTerms.some(b => r.query.toLowerCase().includes(b)));
      
      const totalClicks = nonBranded.reduce((sum, r) => sum + (r.clicks || 0), 0);
      const uniqueDates = new Set(nonBranded.map(r => r.date));
      const daysWithData = uniqueDates.size || 1;
      avalancheThreshold = Math.max(10, Math.round(totalClicks / daysWithData));

      gscInsights = `\n\nGOOGLE SEARCH CONSOLE DATA (laatste 30 dagen):
SEO AVALANCHE THRESHOLD: ${avalancheThreshold} (= gemiddelde dagelijkse non-branded clicks)
Dit betekent: target keywords met een geschat zoekvolume van maximaal ${avalancheThreshold} per dag (≈${avalancheThreshold * 30}/maand).
Totale non-branded clicks: ${totalClicks} over ${daysWithData} dagen.

Top keywords:
${nonBranded.slice(0, 30).map(r => `- "${r.query}" — ${r.impressions} impressies, ${r.clicks} clicks, positie ${Number(r.position).toFixed(1)}`).join("\n")}`;
    }

    // Build the mega-prompt
    const systemPrompt = `Je bent een senior SEO content strategist. Je ontwerpt topic cluster strategieën voor B2B-websites.

BEDRIJFSCONTEXT:
- Naam: ${siteName}
- Niche: ${niche}
- Doelgroep: ${audience}
- Blog thema: ${blogTheme}
- Site URL: ${siteUrl}

WEBSITE CONTENT:
${ownContent.join("\n\n").slice(0, 8000)}

${competitorContent.length > 0 ? `CONCURRENT CONTENT:
${competitorContent.join("\n\n").slice(0, 6000)}` : ""}

${existingTopics?.length ? `BESTAANDE TOPICS:
${existingTopics.map(t => `- "${t.name}" (${t.target_article_count} target, keywords: ${(t.target_keywords || []).join(", ")})`).join("\n")}` : ""}

${existingPosts?.length ? `BESTAANDE ARTIKELEN:
${existingPosts.map(p => `- "${p.title}"`).join("\n")}` : ""}
${gscInsights}

SEO AVALANCHE STRATEGIE:
We gebruiken de SEO Avalanche methode: de gemiddelde dagelijkse non-branded traffic = het maximale zoekvolume dat we targeten.
Huidige threshold: ${avalancheThreshold} zoekopdrachten per dag (≈${avalancheThreshold * 30}/maand).
Naarmate het verkeer groeit, schalen we automatisch op naar hogere zoekvolumes.
Begin met low-competition, long-tail keywords die binnen deze threshold vallen.
Dit bouwt domeinautoriteit op waardoor we later hogere volumes aankunnen.

REGELS:
1. Ontwerp 5-8 pillar topic clusters die de hele customer journey dekken (awareness → consideration → decision)
2. Elk cluster heeft een pillar article concept + 5-10 ondersteunende sub-topics
3. Focus op keywords die relevant zijn voor de Nederlandse B2B-markt
4. Vermijd overlap met bestaande content
5. Prioriteer op basis van: zoekvolume-potentieel, concurrentie, conversie-nabijheid
6. Geef per cluster een publicatie-volgorde (welke artikelen eerst voor maximale impact)
7. Identificeer content gaps t.o.v. concurrenten
8. Alle topic namen en descriptions in het Nederlands
9. Geef realistische zoekvolume-inschattingen — TARGET MAXIMAAL ${avalancheThreshold * 30} zoekvolume/maand per keyword
10. Prioriteer keywords met zoekvolume ≤${avalancheThreshold * 30}/maand en lage concurrentie`;

    const userPrompt = mode === "evaluate" 
      ? `Maak een VERGELIJKENDE ANALYSE van ${siteName} versus de concurrent(en).
Structuur het rapport als een duidelijke B2B GroeiMachine VS Concurrent vergelijking:

1. **Sterke punten ${siteName}**: Wat doen wij beter dan de concurrent(en)?
2. **Sterke punten concurrent(en)**: Wat doen zij beter dan wij?
3. **Content gaps**: Welke onderwerpen/keywords dekken zij die wij missen?
4. **Kansen**: Concrete topics waar wij op kunnen inspelen op basis van de vergelijking
5. **Bedreigingen**: Waar lopen we achter en moet actie op worden ondernomen?

Geef per topic cluster aan:
- Of het een GAP is (concurrent heeft het wel, wij niet)
- Of het een STERKTE is (wij doen het beter)
- Of het een KANS is (beide missen het, maar het past bij onze doelgroep)

Gebruik de GSC data om onze huidige positie te onderbouwen.`
      : `Ontwerp een complete topic cluster strategie. Geef voor elk cluster:
- name: Cluster naam
- description: Wat dit cluster dekt en waarom het belangrijk is
- target_keywords: 3-5 primaire keywords
- target_article_count: Hoeveel artikelen nodig (5-15)
- priority: 0-10 (10 = hoogste prioriteit)
- pillar_article: Het hoofdartikel concept
- subtopics: Array van sub-artikel concepten met elk een headline en keyword
- content_gaps: Wat concurrenten wel doen maar wij nog niet
- publish_order: In welke volgorde publiceren (1 = eerst)
- search_volume: "laag" | "middel" | "hoog" per cluster`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "create_strategy",
            description: "Create a complete topic cluster content strategy",
            parameters: {
              type: "object",
              properties: {
                summary: { type: "string", description: "Executive summary van de strategie" },
                clusters: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      slug: { type: "string" },
                      description: { type: "string" },
                      target_keywords: { type: "array", items: { type: "string" } },
                      target_article_count: { type: "number" },
                      priority: { type: "number" },
                      pillar_article: { type: "string" },
                      subtopics: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            headline: { type: "string" },
                            keyword: { type: "string" },
                            publish_order: { type: "number" },
                          },
                          required: ["headline", "keyword", "publish_order"],
                        },
                      },
                      content_gaps: { type: "array", items: { type: "string" } },
                      search_volume: { type: "string", enum: ["laag", "middel", "hoog"] },
                      comparison_type: { type: "string", enum: ["gap", "sterkte", "kans", "bedreiging"], description: "Hoe verhoudt dit cluster zich: gap (concurrent wel, wij niet), sterkte (wij beter), kans (beide missen), bedreiging (wij lopen achter)" },
                      our_score: { type: "number", description: "Score 1-10 hoe goed wij presteren op dit cluster" },
                      competitor_score: { type: "number", description: "Score 1-10 hoe goed de concurrent presteert op dit cluster" },
                    },
                    required: ["name", "slug", "description", "target_keywords", "target_article_count", "priority", "subtopics"],
                  },
                },
                recommendations: { type: "array", items: { type: "string" } },
              },
              required: ["summary", "clusters", "recommendations"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "create_strategy" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit, probeer later opnieuw." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Credits op." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("Geen strategie gegenereerd");

    const strategy = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(strategy), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("strategy-agent error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Onbekende fout" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
