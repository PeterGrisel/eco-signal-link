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

    const { keyword, audience, length } = await req.json();
    if (!keyword) throw new Error("keyword is required");

    const wordCount = length === "kort" ? 800 : length === "lang" ? 2500 : 1500;

    const systemPrompt = `Je bent een expert SEO content schrijver voor B2B bedrijven in Nederland. 
Je schrijft artikelen in het Nederlands, geoptimaliseerd voor zoekmachines.
Je gebruikt altijd duidelijke headings (##, ###), bullet points, en interne links waar relevant.
Je schrijft in een professionele maar toegankelijke stijl.
Schrijf altijd in Markdown formaat.`;

    const userPrompt = `Schrijf een SEO-geoptimaliseerd blogartikel over "${keyword}" voor de doelgroep: ${audience}.

Vereisten:
- Ongeveer ${wordCount} woorden
- Gebruik het keyword "${keyword}" natuurlijk in de tekst, in headings en in de eerste alinea
- Schrijf een pakkende titel (max 60 tekens)
- Schrijf een meta description (max 160 tekens)
- Schrijf een korte excerpt (max 200 tekens)
- Genereer een slug gebaseerd op de titel
- Gebruik H2 en H3 headings voor structuur
- Voeg waar relevant interne links toe naar /blog/ pagina's
- Eindig met een call-to-action

Geef je antwoord als JSON met deze structuur:
{
  "title": "...",
  "meta_description": "...",
  "excerpt": "...",
  "slug": "...",
  "content": "... (markdown content) ..."
}`;

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
              name: "create_article",
              description: "Create a structured blog article with SEO metadata",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Article title, max 60 characters" },
                  meta_description: { type: "string", description: "Meta description, max 160 characters" },
                  excerpt: { type: "string", description: "Short excerpt, max 200 characters" },
                  slug: { type: "string", description: "URL slug based on title" },
                  content: { type: "string", description: "Full article content in Markdown format" },
                },
                required: ["title", "meta_description", "excerpt", "slug", "content"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "create_article" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit bereikt, probeer het later opnieuw." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits op. Voeg credits toe in Lovable Settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI generatie mislukt");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("Geen artikel gegenereerd");

    const article = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(article), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-article error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Onbekende fout" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
