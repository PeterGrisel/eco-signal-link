import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

async function loadSettings() {
  const { data } = await getSupabase().from("seo_settings").select("config").limit(1).single();
  return data?.config || {};
}

async function loadTopicsWithCoverage() {
  const supabase = getSupabase();

  const { data: topics } = await supabase
    .from("content_topics")
    .select("id, name, slug, description, parent_id, target_keywords, target_article_count, priority, status")
    .eq("status", "active")
    .order("priority", { ascending: false });

  if (!topics?.length) return [];

  // Count published articles per topic
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("topic_id")
    .not("topic_id", "is", null);

  const postCounts: Record<string, number> = {};
  posts?.forEach(p => {
    postCounts[p.topic_id] = (postCounts[p.topic_id] || 0) + 1;
  });

  // Count queued items per topic
  const { data: queued } = await supabase
    .from("content_queue")
    .select("topic_id, status")
    .not("topic_id", "is", null)
    .in("status", ["pending", "approved", "generating"]);

  const queuedCounts: Record<string, number> = {};
  queued?.forEach(q => {
    if (q.topic_id) queuedCounts[q.topic_id] = (queuedCounts[q.topic_id] || 0) + 1;
  });

  return topics.map(t => ({
    ...t,
    published_count: postCounts[t.id] || 0,
    queued_count: queuedCounts[t.id] || 0,
    gap: Math.max(0, (t.target_article_count || 3) - (postCounts[t.id] || 0) - (queuedCounts[t.id] || 0)),
  }));
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = getSupabase();
    const settings = await loadSettings();
    const { count, content_types, existing_headlines } = await req.json();

    const siteName = settings.name || "B2BGroeiMachine";
    const niche = settings.summary || "B2B sales, recruitment en data-gedreven groei-systemen";
    const audience = settings.target_audience_summary || "MKB en midmarket B2B-bedrijven in Nederland";
    const blogTheme = settings.blog_theme || "Praktische content over B2B sales, leadgeneratie en recruitment-marketing";
    const language = settings.primary_language || "Nederlands";
    const targetCount = count || 10;
    const types = content_types || ["article"];

    // ═══════════════════════════════════════════════
    // SEO AVALANCHE: Calculate traffic threshold
    // ═══════════════════════════════════════════════
    let avalancheThreshold = 10; // default minimum
    let avalancheContext = "";

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

    const { data: gscData } = await supabase
      .from("gsc_snapshots")
      .select("query, clicks, date")
      .gte("date", thirtyDaysAgoStr)
      .limit(500);

    if (gscData?.length) {
      const brandTerms = [siteName.toLowerCase(), "b2bgroeimachine", "b2b groeimachine", "groeimachine"];
      const nonBranded = gscData.filter(r => !brandTerms.some(b => r.query.toLowerCase().includes(b)));
      
      const totalClicks = nonBranded.reduce((sum, r) => sum + (r.clicks || 0), 0);
      const uniqueDates = new Set(nonBranded.map(r => r.date));
      const daysWithData = uniqueDates.size || 1;
      avalancheThreshold = Math.max(10, Math.round(totalClicks / daysWithData));

      avalancheContext = `\n\nSEO AVALANCHE STRATEGIE:
Huidige gemiddelde dagelijkse non-branded traffic: ${avalancheThreshold} clicks/dag (${totalClicks} totaal over ${daysWithData} dagen).
REGEL: Target ALLEEN keywords met een geschat zoekvolume van maximaal ${avalancheThreshold * 30} per maand.
Dit is cruciaal — we bouwen domeinautoriteit op door eerst makkelijk te ranken op low-volume keywords.
Naarmate het verkeer groeit, schalen we automatisch op naar hogere volumes.
Kies long-tail, low-competition keywords die binnen deze threshold vallen.`;
    }

    // Load topics and gap analysis
    const topicsWithCoverage = await loadTopicsWithCoverage();
    const hasTopics = topicsWithCoverage.length > 0;

    // Build topic context for the AI
    let topicContext = "";
    if (hasTopics) {
      const topicsWithGaps = topicsWithCoverage
        .filter(t => t.gap > 0)
        .sort((a, b) => b.gap - a.gap || b.priority - a.priority);

      const topicsAtTarget = topicsWithCoverage.filter(t => t.gap <= 0);

      if (topicsWithGaps.length > 0) {
        topicContext = `\n\nCONTENT STRATEGIE - TOPIC CLUSTERS:
De content strategie is gebaseerd op topic clusters. Genereer headlines die gaps invullen.

TOPICS MET GAPS (prioriteit - genereer hier headlines voor):
${topicsWithGaps.map(t => {
  const keywords = t.target_keywords?.length ? `Target keywords: ${t.target_keywords.join(", ")}` : "";
  return `- "${t.name}" (${t.gap} artikelen nodig, ${t.published_count} gepubliceerd)${t.description ? ` — ${t.description}` : ""}${keywords ? `\n  ${keywords}` : ""}`;
}).join("\n")}

${topicsAtTarget.length > 0 ? `\nTOPICS OP TARGET (geen nieuwe headlines nodig):\n${topicsAtTarget.map(t => `- "${t.name}" (${t.published_count}/${t.target_article_count})`).join("\n")}` : ""}

BELANGRIJK:
- Verdeel headlines proportioneel over topics met gaps
- Gebruik de target keywords als basis voor de headlines
- Elk headline MOET een topic_id bevatten zodat het aan het juiste topic wordt gekoppeld
- Topics met hogere priority en grotere gaps krijgen meer headlines`;
      }
    }

    const systemPrompt = `Je bent een SEO content strategist gespecialiseerd in het genereren van blog headlines die ranken in Google. 

Je genereert headlines voor: "${siteName}"
Niche: ${niche}
Doelgroep: ${audience}
Blog thema: ${blogTheme}

Regels voor headlines:
- Schrijf in het ${language}
- Headlines moeten specifiek, concreet en search-intent geoptimaliseerd zijn
- Vermijd vage of generieke titels
- Gebruik geen marketing fluff
- Focus op clarity en practicality
- Headlines moeten de lezer direct vertellen wat ze leren
- Mix van formats: how-to's, guides, case studies, frameworks, comparisons, lijstjes
- Elk headline moet een duidelijk target keyword hebben
- Geen duplicate of te gelijkende headlines
- BELANGRIJK: Schrijf headlines in normale zinsopbouw, NIET in Title Case
- KRITIEK: Target keywords met een geschat maandelijks zoekvolume van MAXIMAAL ${avalancheThreshold * 30}. Dit is de SEO Avalanche methode.

${types.includes("tool") ? "Genereer ook 'tool' headlines: interactieve calculators, checkers, generators die SEO traffic trekken." : ""}
${types.includes("video") ? "Genereer ook 'video' headlines: gebaseerd op relevante YouTube video content." : ""}
${avalancheContext}
${topicContext}
${existing_headlines?.length ? `\nVermijd duplicaten met deze bestaande headlines:\n${existing_headlines.join("\n")}` : ""}`;

    // Build tool parameters based on whether topics exist
    const headlineProperties: Record<string, any> = {
      headline: { type: "string", description: "The full headline" },
      content_type: { type: "string", enum: ["article", "tool", "video", "pseo"] },
      keyword: { type: "string", description: "Primary target keyword" },
      notes: { type: "string", description: "Brief angle/approach description" },
    };

    if (hasTopics) {
      headlineProperties.topic_id = {
        type: "string",
        description: "The UUID of the topic this headline belongs to. Must be one of the provided topic IDs.",
      };
    }

    const userPrompt = `Genereer ${targetCount} nieuwe, unieke blog headline suggesties. Mix van content types: ${types.join(", ")}.

${hasTopics ? `Gebruik de topic clusters en gap analyse om te bepalen welke headlines nodig zijn. Verdeel headlines over topics met gaps.

Beschikbare topic IDs:
${topicsWithCoverage.filter(t => t.gap > 0).map(t => `- ${t.id}: "${t.name}"`).join("\n")}` : ""}

Voor elke headline geef:
- headline: De volledige headline
- content_type: "article", "tool", "video", of "pseo"
- keyword: Het primaire target keyword
- notes: Korte beschrijving van de aanpak/invalshoek
${hasTopics ? "- topic_id: UUID van het bijbehorende topic" : ""}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_headlines",
              description: "Return headline suggestions for the content queue",
              parameters: {
                type: "object",
                properties: {
                  headlines: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: headlineProperties,
                      required: ["headline", "content_type", "keyword", "notes"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["headlines"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "suggest_headlines" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit bereikt, probeer het later opnieuw." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits op, voeg tegoed toe." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("Geen headlines gegenereerd");

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-headlines error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Onbekende fout" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
