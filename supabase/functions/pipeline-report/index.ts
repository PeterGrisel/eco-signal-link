import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { scores, phaseScores, percentage, bottleneck, industry, teamSize, deepDiveAnswers } =
      await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build a concise context string from scores
    const scoreLines = Object.entries(scores as Record<string, number>)
      .map(([key, val]) => `${key.toUpperCase()}: ${val}/10`)
      .join(", ");

    const phaseLines = (phaseScores as { label: string; pct: number }[])
      .map((p) => `${p.label}: ${p.pct}%`)
      .join(", ");

    // Format deep dive answers if provided
    const deepDiveContext = Array.isArray(deepDiveAnswers) && deepDiveAnswers.length > 0
      ? `\n\nVerdiepende antwoorden:\n${deepDiveAnswers.map((a: { question: string; answer: string }) => `- ${a.question} → ${a.answer}`).join("\n")}`
      : "";

    const hasDeepDive = Array.isArray(deepDiveAnswers) && deepDiveAnswers.length > 0;

    const systemPrompt = `Je bent de Pipeline Equation™ AI-adviseur van B2BGroeiMachine.
Je schrijft op B1-taalniveau: korte zinnen (max 12 woorden), concreet, directe aanspreking (u/uw).
Geen jargon. Geen opsommingstekens langer dan één regel.

Je genereert een Pipeline Score™ rapport.

Structuur (gebruik exact deze markdown koppen):
## Uw Pipeline Score: [score]/100

### Samenvatting
2-3 zinnen over de totaalscore en het grootste risico.

### Per fase
Voor elke fase (Attract, Reach, Resonate, Execution, Convert):
**[Fase] — [score]%**
${hasDeepDive
  ? `3-5 zinnen per fase. Verwijs specifiek naar hun antwoorden op de verdiepende vragen. Benoem wat ze al goed doen (bij "ja"), waar ze halverwege zijn (bij "deels") en wat ze missen (bij "nee"). Geef per fase één concrete, uitvoerbare actie.`
  : `1-2 zinnen: wat gaat goed of fout, en één concrete actie.`}

### Uw grootste kans
${hasDeepDive ? `3-4 zinnen. Koppel de grootste kans aan specifieke antwoorden die ze gaven. Leg uit waarom dit de snelste verbetering oplevert.` : `2-3 zinnen over de snelste verbetering die ze kunnen doorvoeren.`}

${hasDeepDive ? `### Wat u al goed doet
Benoem 2-3 dingen die ze al goed doen op basis van hun "ja" antwoorden. Dit geeft vertrouwen.

` : ""}### Volgende stap
Eindig met een korte uitnodiging om een gesprek te plannen.

${hasDeepDive ? "Houd het geheel onder 600 woorden." : "Houd het geheel onder 400 woorden."} Wees direct en concreet.`;

    const userPrompt = `Genereer een Pipeline Score™ rapport voor dit bedrijf.

Branche: ${industry || "Niet opgegeven"}
Teamgrootte: ${teamSize || "Niet opgegeven"}
Totaalscore: ${percentage}/100
Zwakste fase: ${bottleneck}

Scores per factor: ${scoreLines}
Scores per fase: ${phaseLines}${deepDiveContext}`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
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
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Te veel verzoeken. Probeer het straks opnieuw." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI-credits zijn op." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI-rapport kon niet worden gegenereerd." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("pipeline-report error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
