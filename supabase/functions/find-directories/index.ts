import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { niche, country, count } = await req.json();
    const targetNiche = niche || "B2B sales en recruitment dienstverlening";
    const targetCountry = country || "Nederland";
    const targetCount = count || 20;

    const systemPrompt = `Je bent een SEO-expert gespecialiseerd in link building via directory submissions. Je taak is om relevante, kwalitatieve online directories en platforms te vinden waar een bedrijf zich kan aanmelden om backlinks en zichtbaarheid te krijgen.

Focus op:
- ALLEEN directories waar je GRATIS een listing kunt aanmaken (geen betaalde directories)
- Directories met hoge Domain Rating (DR 30+)
- Zowel algemene als niche-specifieke directories
- Business directories, software directories, review platforms
- Lokale en internationale directories
- Directories die daadwerkelijk bestaan en actief zijn in 2024-2026

BELANGRIJK: Geef GEEN directories die een betaald abonnement vereisen om een basis-listing aan te maken. Gratis freemium-modellen (gratis basis, betaalde upgrade) zijn wel OK.

Voor elke directory geef je:
- name: De naam van de directory
- url: De homepage URL
- category: De categorie (bijv. "Business Directory", "Software Review", "B2B Marketplace", "Industry Directory", "Local Directory")
- dr_score: Een geschatte Domain Rating (0-100)
- reason: Waarom deze directory relevant is (1 zin)

Geef ALLEEN directories die je met hoge zekerheid kent als bestaande, actieve websites. Verzin geen URLs.`;

    const userPrompt = `Vind ${targetCount} relevante directories en platforms voor een bedrijf in de niche "${targetNiche}" gericht op ${targetCountry}. 

Het bedrijf biedt aan:
- Full-service recruitment (sales professionals werven)
- Full sales management (sales teams opzetten en managen)
- AI-gedreven sales tooling (Datahub)

Geef een mix van:
1. Algemene business directories (zoals Gouden Gids, KVK, etc.)
2. B2B-specifieke directories en marketplaces
3. Software/SaaS review platforms
4. Recruitment/HR directories
5. Nederlandse en internationale directories

BELANGRIJK: Alleen directories met een GRATIS aanmeldoptie. Geen betaalde directories.

Sorteer op geschatte DR score van hoog naar laag.`;

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
              name: "suggest_directories",
              description: "Return a list of suggested directories for link building",
              parameters: {
                type: "object",
                properties: {
                  directories: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Directory name" },
                        url: { type: "string", description: "Homepage URL" },
                        category: { type: "string", description: "Category type" },
                        dr_score: { type: "number", description: "Estimated Domain Rating 0-100" },
                        reason: { type: "string", description: "Why this directory is relevant" },
                      },
                      required: ["name", "url", "category", "dr_score", "reason"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["directories"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "suggest_directories" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit bereikt, probeer het later opnieuw." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits op, voeg tegoed toe aan je workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("Geen gestructureerde output ontvangen van AI");
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("find-directories error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Onbekende fout" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
