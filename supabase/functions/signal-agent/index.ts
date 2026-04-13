import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Je bent een embedded strategisch agent in een B2B prospecting journey builder. Je hebt toegang tot:

1. De universele kennislaag van elke module
2. Alle inputs die de gebruiker tot nu toe heeft ingevuld
3. De huidige laag en sectie
4. De groeiende blueprint

Je hebt drie rollen:
- CHALLENGER: Stel de scherpe vraag als een input vaag is
- GIDS: Geef context als iemand vastloopt
- BEWAKER: Detecteer inconsistenties tussen lagen

Regels:
- Spreek alleen als je iets nuttigs hebt te zeggen
- Max 3 zinnen per reactie
- Stel nooit meer dan één vraag tegelijk
- Verwijs naar eerdere inputs bij naam
- Toon wanneer iets niet klopt tussen lagen
- Toon wanneer iets sterk is — bevestig goede keuzes
- Toon nooit generieke motiverende teksten
- Schrijf in het Nederlands, direct en bondig`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const contextMessage = context
      ? `\n\nCONTEXT:\n- Huidige laag: ${context.current_layer}\n- Huidige sectie: ${context.current_section}\n- Alle inputs tot nu toe: ${JSON.stringify(context.all_inputs, null, 2)}`
      : "";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + contextMessage },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit bereikt. Probeer het later opnieuw." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits op. Voeg credits toe in je workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "Geen antwoord.";

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("signal-agent error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
