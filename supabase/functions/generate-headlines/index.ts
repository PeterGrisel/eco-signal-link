import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { niche, target_audience, count, content_types, existing_headlines } = await req.json();

    const targetNiche = niche || "B2B sales, recruitment en AI-gedreven enablement systemen";
    const targetAudience = target_audience || "Mid-to-large enterprises, business leaders, and decision-makers focused on leveraging data and AI";
    const targetCount = count || 10;
    const types = content_types || ["article"];

    const systemPrompt = `Je bent een SEO content strategist gespecialiseerd in het genereren van blog headlines die ranken in Google. 

Je genereert headlines voor de niche: "${targetNiche}"
Doelgroep: ${targetAudience}

Blog thema: Practical and in-depth content on AI Enablement, data-driven transformation, and flow management. Focus on how organizations apply focus, discipline, and system-level interventions to turn AI into measurable business value.

Regels voor headlines:
- Schrijf in het Engels (de blog is Engelstalig)
- Headlines moeten specifiek, concreet en search-intent geoptimaliseerd zijn
- Vermijd vage of generieke titels
- Gebruik geen marketing fluff
- Focus op clarity en practicality
- Headlines moeten de lezer direct vertellen wat ze leren
- Mix van formats: how-to's, guides, case studies, frameworks, comparisons, data studies
- Elk headline moet een duidelijk target keyword hebben
- Geen duplicate of te gelijkende headlines

${types.includes("tool") ? "Genereer ook 'tool' headlines: interactieve calculators, checkers, generators die SEO traffic trekken." : ""}
${types.includes("video") ? "Genereer ook 'video' headlines: gebaseerd op YouTube video content." : ""}

${existing_headlines?.length ? `\nVermijd duplicaten met deze bestaande headlines:\n${existing_headlines.join("\n")}` : ""}`;

    const userPrompt = `Genereer ${targetCount} nieuwe, unieke blog headline suggesties. Mix van content types: ${types.join(", ")}.

Voor elke headline geef:
- headline: De volledige headline
- content_type: "article", "tool", "video", of "pseo"  
- keyword: Het primaire target keyword
- notes: Korte beschrijving van de aanpak/invalshoek (1-2 zinnen)`;

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
                      properties: {
                        headline: { type: "string", description: "The full headline" },
                        content_type: { type: "string", enum: ["article", "tool", "video", "pseo"], description: "Content type" },
                        keyword: { type: "string", description: "Primary target keyword" },
                        notes: { type: "string", description: "Brief angle/approach description" },
                      },
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
