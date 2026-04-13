import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LAYER_CONTEXT: Record<number, string> = {
  1: `LAAG 01 — DEFINITIE
Focus: ICP-definitie (industrie, grootte, beslisser, geografie, triggers).
Check: Is de industrie specifiek genoeg? ("Tech" is te breed, "B2B SaaS 10-200 FTE" is scherp.) Heeft de gebruiker een organisatorische trigger én een groeidruk trigger? Zijn de uitsluiting criteria concreet?
Rode vlag: vage functietitels ("management"), te brede industrie, geen uitsluitingen.`,
  2: `LAAG 02 — SIGNAALGEWICHTEN
Focus: Scorematrix voor signalen.
Check: Tellen de gewichten op tot een logisch totaal? Is de drempel voor actie realistisch vs. de max mogelijke score? Zijn de zwaarste gewichten consistent met de triggers uit Laag 1?
Rode vlag: alle signalen even zwaar (geen prioritering), drempel te laag (<20) of te hoog (>80).`,
  3: `LAAG 03 — BRONNEN
Focus: Databronnen selecteren voor signaaldetectie.
Check: Zijn de geselecteerde bronnen congruent met de signalen uit Laag 2? Elke bron moet minstens één signaal uit de scorematrix voeden. Geen onnodige bronnen.
Rode vlag: bronnen geselecteerd zonder detail, meer dan 4 bronnen tegelijk (overload risico).`,
  4: `LAAG 04 — KRITISCHE VRAGEN
Focus: Per bron één exacte vraag formuleren.
Check: Is de vraag meetbaar en specifiek? Bevat de gewenste output concrete velden? Past de vertraging bij het type signaal?
Rode vlag: vage vragen ("wie groeit er?"), geen gewenste output gedefinieerd.`,
  5: `LAAG 05 — DETECTIE
Focus: Automatisering van monitoring.
Check: Matcht de frequentie met de vertraging uit Laag 4? Zijn de filters specifiek genoeg om ruis te voorkomen?
Rode vlag: realtime monitoring zonder filter, alert naar email voor hoog-volume signalen.`,
  6: `LAAG 06 — DREMPELWAARDE
Focus: Score-zones definiëren.
Check: Zijn de zones logisch verdeeld? Past het actie-drempel bij de gewichten uit Laag 2? Is het signaalvenster (dagen) realistisch voor de markt?
Rode vlag: overlappende zones, te kort venster (<30d), geen verschil tussen nurture en actief.`,
  7: `LAAG 07 — RESPONS
Focus: Actie per scorezone.
Check: Wordt de respons persoonlijker naarmate de score hoger is? Zijn de CRM-acties logisch? Past de timing bij het type respons?
Rode vlag: dezelfde respons voor alle zones, call als respons voor nurture (te agressief).`,
};

function buildSystemPrompt(context: any): string {
  const layerNum = context?.current_layer || 1;
  const layerHint = LAYER_CONTEXT[layerNum] || '';
  const allInputs = context?.all_inputs || {};

  // Cross-layer consistency checks
  const consistencyNotes: string[] = [];
  if (layerNum >= 2 && allInputs[1]) {
    const l1 = allInputs[1];
    if (l1.industrie && allInputs[2]) {
      consistencyNotes.push(`Gebruiker target: ${l1.industrie}, ${l1.bedrijfsgrootte || '?'} FTE, beslisser: ${l1.functietitel || '?'}`);
    }
  }
  if (layerNum >= 3 && allInputs[2]) {
    const weights = ['leidinggevende_gewisseld', 'funding_ontvangen', 'specifieke_vacature', 'competitor_churned', 'tech_stack_wijziging', 'headcount_groei'];
    const topSignals = weights
      .filter(w => (allInputs[2][w] || 0) >= 20)
      .map(w => w.replace(/_/g, ' '));
    if (topSignals.length > 0) {
      consistencyNotes.push(`Sterkste signalen: ${topSignals.join(', ')}`);
    }
  }
  if (layerNum >= 5 && allInputs[3]) {
    const activeSources = ['linkedin', 'jobboards', 'funding_data', 'technografie', 'nieuws', 'crm_historiek', 'intent_platforms']
      .filter(s => allInputs[3][s]);
    if (activeSources.length > 0) {
      consistencyNotes.push(`Actieve bronnen: ${activeSources.join(', ')}`);
    }
  }

  const consistencyBlock = consistencyNotes.length > 0
    ? `\n\nCROSS-LAAG CONTEXT (gebruik dit om inconsistenties te detecteren):\n${consistencyNotes.map(n => `- ${n}`).join('\n')}`
    : '';

  return `Je bent de Systeem Agent in het Signaaldetectiesysteem — een B2B prospecting journey builder. Je hebt drie rollen:
- CHALLENGER: Stel de scherpe vraag als een input vaag is
- GIDS: Geef context als iemand vastloopt
- BEWAKER: Detecteer inconsistenties tussen lagen

Regels:
- Max 3 zinnen per reactie
- Stel nooit meer dan één vraag tegelijk
- Verwijs naar eerdere inputs bij naam
- Toon wanneer iets niet klopt tussen lagen
- Toon wanneer iets sterk is — bevestig goede keuzes
- Geen generieke motivatie — wees concreet en specifiek
- Schrijf in het Nederlands, direct en bondig
- Als een input vaag is, geef een concreet voorbeeld van hoe het beter kan

HUIDIGE LAAG:
${layerHint}${consistencyBlock}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = buildSystemPrompt(context);
    const inputsSummary = context?.all_inputs
      ? `\nINGEVULDE DATA:\n${JSON.stringify(context.all_inputs, null, 2)}`
      : '';

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt + inputsSummary },
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
