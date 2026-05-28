import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const lineToSlug: Record<string, string> = {
  "Outbound Engine": "outbound-engine",
  "ABM & Key Accounts": "abm-key-accounts",
  "Commercieel Brein": "commercieel-brein",
  "Content & Autoriteit": "content-autoriteit",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Optioneel: specifiek scenario meegeven (admin "Genereer nu")
    let body: { scenario_id?: string } = {};
    try { body = await req.json(); } catch { /* cron stuurt geen body */ }

    // Context laden
    const { data: settings } = await supabase
      .from("seo_settings").select("config").limit(1).single();
    const cfg = settings?.config || {};
    const siteUrl = cfg.site_url || "https://b2bgroeimachine.io";
    const lang = cfg.primary_language || "Nederlands";

    const { data: tools } = await supabase
      .from("groeistack_tools")
      .select("name, category, description, website")
      .eq("published", true);

    // Scenario kiezen: meegegeven id, anders minst recent gebruikte
    let scenario: any = null;
    if (body.scenario_id) {
      const { data } = await supabase
        .from("playbook_scenarios").select("*").eq("id", body.scenario_id).single();
      scenario = data;
    } else {
      const { data } = await supabase
        .from("playbook_scenarios")
        .select("*")
        .eq("active", true)
        .order("used_at", { ascending: true, nullsFirst: true })
        .order("sort_order", { ascending: true })
        .limit(1);
      scenario = data?.[0] ?? null;
    }
    if (!scenario) throw new Error("Geen actief scenario gevonden");

    const { data: existing } = await supabase
      .from("playbooks")
      .select("title, slug")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(30);

    const dienstSlug = lineToSlug[scenario.service_line];
    const toolsContext = (tools || [])
      .map((t: any) => `- ${t.name} (${t.category}): ${t.description}`)
      .join("\n");
    const internalLinks = [
      `- De Groeistack: ${siteUrl}/groeistack`,
      `- Hoe het werkt: ${siteUrl}/hoe-het-werkt`,
      dienstSlug ? `- Dienstlijn: ${siteUrl}/diensten/${dienstSlug}` : "",
      ...(existing || []).map((p: any) => `- ${p.title}: ${siteUrl}/playbooks/${p.slug}`),
    ].filter(Boolean).join("\n");

    const systemPrompt = `Je bent een senior GTM-strateeg bij B2BGroeiMachine, een AI-first groeipartner voor B2B-bedrijven in Nederland en België. Je schrijft praktische, originele playbooks: stap-voor-stap gidsen voor een concreet groei-scenario.

STIJL: ${lang}, B1-niveau, u/uw, concreet en zonder jargon. Geen em-dashes. Geen overdreven claims; verwijs naar het rekenmodel in plaats van garanties.

JULLIE METHODE (gebruik als rode draad): één Commercieel Brein als fundament, daarna acht stappen: 1) context & ICP, 2) Commercieel Brein, 3) segmenteren & verrijken, 4) schaal & volume, 5) funnel activeren, 6) modules (LinkedIn, e-mail, telefoon, video), 7) routeren naar sales, 8) monitoren & lerende loops. Alles draait op de eigen tools van de klant; geen lock-in.

DE GROEISTACK (noem per stap concrete, passende tools uit deze lijst; verzin geen tools):
${toolsContext}

INTERNE LINKS (gebruik er 2-4 als [tekst](url)):
${internalLinks}

STRUCTUUR van het playbook (Markdown):
- Korte intro: voor wie en waarom dit scenario nu telt.
- "## Het speelveld" — ICP, signalen en uitgangspunten.
- "## Het playbook" — genummerde stappen, elk met welke Groeistack-tools je inzet en waarom.
- "## Wat je nodig hebt" — bulletlijst van tools uit de Groeistack.
- "## Wat het oplevert" — verwijs naar het rekenmodel (markt → beslissers → meetings → pipeline), geen harde belofte.
- Sluit af met een subtiele CTA naar de gratis scan (link naar ${siteUrl}/#boek-gratis-scan).`;

    const userPrompt = `Schrijf een origineel, praktisch playbook voor dit scenario:
Titel-onderwerp: "${scenario.title}"
Doelgroep: ${scenario.audience}
Dienstlijn: ${scenario.service_line}
Invalshoek: ${scenario.angle}

Ongeveer 1400 woorden. Genereer alle metadata. Noem alleen tools die in De Groeistack-lijst staan.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        max_tokens: 16000,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "create_playbook",
            description: "Create a structured GTM playbook with SEO metadata",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string", description: "Playbook-titel, max 70 tekens" },
                slug: { type: "string", description: "URL-slug op basis van de titel" },
                excerpt: { type: "string", description: "Korte samenvatting, max 200 tekens" },
                meta_description: { type: "string", description: "Meta description, 50-155 tekens" },
                tools: { type: "array", items: { type: "string" }, description: "Namen van gebruikte Groeistack-tools" },
                content: { type: "string", description: "Volledig playbook in Markdown" },
              },
              required: ["title", "slug", "excerpt", "content"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "create_playbook" } },
      }),
    });

    if (!aiRes.ok) {
      const t = await aiRes.text();
      throw new Error(`AI ${aiRes.status}: ${t.slice(0, 200)}`);
    }

    const data = await aiRes.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("Geen playbook gegenereerd");
    const pb = JSON.parse(toolCall.function.arguments);

    // Slug uniek maken
    let slug = String(pb.slug || "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `playbook-${Date.now()}`;
    const { data: clash } = await supabase
      .from("playbooks").select("id").eq("slug", slug).maybeSingle();
    if (clash) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

    const { error: insErr } = await supabase.from("playbooks").insert({
      slug,
      title: pb.title,
      excerpt: pb.excerpt,
      meta_description: pb.meta_description || pb.excerpt,
      content: pb.content,
      tools: Array.isArray(pb.tools) ? pb.tools : [],
      service_line: scenario.service_line,
      audience: scenario.audience,
      scenario_id: scenario.id,
      status: "published",
      published_at: new Date().toISOString(),
    });
    if (insErr) throw insErr;

    await supabase
      .from("playbook_scenarios")
      .update({ used_at: new Date().toISOString() })
      .eq("id", scenario.id);

    return new Response(
      JSON.stringify({ ok: true, slug, title: pb.title, scenario: scenario.title }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("generate-playbook error:", e);
    return new Response(
      JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
