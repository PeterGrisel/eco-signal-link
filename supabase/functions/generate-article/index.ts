import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function loadSettings() {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
  const { data } = await supabase.from("seo_settings").select("config").limit(1).single();
  return data?.config || {};
}

async function loadExistingPosts() {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
  const { data } = await supabase
    .from("blog_posts")
    .select("title, slug")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);
  return data || [];
}

async function loadGroeistackTools() {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
  const { data } = await supabase
    .from("groeistack_tools")
    .select("name, category, description, website, link_status")
    .eq("published", true)
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });
  // alleen tools met werkende link gebruiken in artikelen
  return (data || []).filter(
    (t: { website?: string | null; link_status?: string | null }) =>
      !!t.website && t.link_status !== "broken"
  );
}

const GROEISTACK_CATEGORY_LABELS: Record<string, string> = {
  signalen: "Signalen & intent",
  verrijking: "Data & verrijking",
  outreach: "Outreach & sequencing",
  crm: "CRM & routing",
  ai: "AI & automation",
  dashboard: "Dashboards & rapportage",
};

function buildGroeistackContext(
  tools: Array<{ name: string; category: string; description: string; website: string }>
) {
  if (!tools.length) return "";
  const grouped = new Map<string, typeof tools>();
  for (const t of tools) {
    const arr = grouped.get(t.category) || [];
    arr.push(t);
    grouped.set(t.category, arr);
  }
  const blocks: string[] = [];
  for (const [category, items] of grouped) {
    const label = GROEISTACK_CATEGORY_LABELS[category] || category;
    const lines = items
      .slice(0, 8) // beperk tot 8 per categorie om context niet te laten ontploffen
      .map(
        (t) =>
          `- [${t.name}](${t.website}) — ${(t.description || "").slice(0, 140)}`
      )
      .join("\n");
    blocks.push(`### ${label}\n${lines}`);
  }
  return `\nGROEISTACK (onze gecureerde tool-bibliotheek - gebruik alleen waar relevant):
${blocks.join("\n\n")}

GROEISTACK GEBRUIK:
- Refereer aan tools uit deze lijst wanneer het onderwerp van de sectie overlapt met hun categorie
- Gebruik ALTIJD de exacte markdown link uit de lijst hierboven: [Naam](website)
- Verzin geen URLs en gebruik geen tools die niet in deze lijst staan
- Blijf agnostisch: noem 2 tot 3 alternatieven naast elkaar, push geen enkele vendor
- Verwerk ze natuurlijk in de tekst, niet als losse opsomming
- Deze tool-links tellen mee als externe links voor de SEO check`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const [settings, existingPosts, groeistackTools] = await Promise.all([
      loadSettings(),
      loadExistingPosts(),
      loadGroeistackTools(),
    ]);
    const { keyword, audience, length, headline, content_type, brief } = await req.json();
    const topic = headline || keyword;
    if (!topic) throw new Error("keyword or headline is required");

    const siteName = settings.name || "B2BGroeiMachine";
    const lang = settings.primary_language || "Nederlands";
    const targetAudience = audience || settings.target_audience_summary || "MKB en midmarket B2B-bedrijven in Nederland";
    const blogTheme = settings.blog_theme || "";
    const competitorPrompt = settings.competitor_prompt || "";
    const ctaTitle = settings.cta_title || "";
    const ctaDescription = settings.cta_description || "";
    const ctaButtonText = settings.cta_button_text || "";
    const ctaNote = settings.cta_note || "";
    const wordCount = length === "kort" ? 800 : length === "lang" ? 2500 : 1500;
    const siteUrl = settings.site_url || "https://b2bgroeimachine.io";

    // Build internal links context
    const internalLinksContext = existingPosts.length > 0
      ? `\nBESCHIKBARE INTERNE LINKS (gebruik er 2-4 waar relevant):
${existingPosts.map(p => `- [${p.title}](${siteUrl}/blog/${p.slug})`).join("\n")}

Vaste pagina's:
- [Home](${siteUrl}/)
- [Over ons](${siteUrl}/over-ons)
- [Full Sales Management](${siteUrl}/full-sales-management)
- [Full Service Recruitment](${siteUrl}/full-service-recruitment)
- [Blog overzicht](${siteUrl}/blog)`
      : "";

    const groeistackContext = buildGroeistackContext(groeistackTools);

    const systemPrompt = `Je bent een expert SEO content schrijver voor ${siteName}. Je schrijft in het ${lang} voor een professionele B2B doelgroep.

Doelgroep: ${targetAudience}

Blog thema: ${blogTheme}

SCHRIJFSTIJL:
- Gebruik eenvoudige, heldere, conversationele taal, alsof je het aan een collega uitlegt
- Begin met een bold statement, verrassend feit of de conclusie (inverted pyramid)
- Gebruik "u" of "je" om de lezer direct aan te spreken
- Houd alinea's kort (2 tot 3 zinnen max)
- Gebruik bullet points, bold tekst en tabellen voor scanbaarheid
- Geef specifiek, actionable advies, geen generieke tips
- Vermijd marketing fluff, promotionele taal of te complex vocabulaire
- Gebruik alledaagse woorden en duidelijke, beknopte formuleringen
- Breek complexe concepten op in hapklare uitleg
- Behoud professionele en technische termen die cruciaal zijn voor het onderwerp
- Vermijd herhalende taalpatronen (begin niet meerdere punten met "Onthoud..." of "Vergeet niet...")
- Vermijd overmatig gebruik van streepjes, gebruik komma's of dubbele punten

ARTIKELSTRUCTUUR:
1. Hook (1 zin): Bold statement, verrassend feit of key benefit
2. Waarde-samenvatting (2 tot 3 zinnen): Belangrijkste bevindingen of inzichten
3. Quick Overview: Bullet points of vergelijkingstabel
4. Hoofdsecties (max 5 root secties, elk met 0 tot 3 subsecties)
5. Conclusie: Samenvatting van essentiële punten

FORMATTING:
- Gebruik ## voor H2, ### voor H3, #### voor H4 headers
- BELANGRIJK: Schrijf headers in normale zinsopbouw, NIET in Title Case. Alleen het eerste woord en eigennamen krijgen een hoofdletter. Dus "Hoe je conversie verbetert" in plaats van "Hoe Je Conversie Verbetert"
- Headers moeten koud, simpel, recht-door-zee zijn, geen marketing fluff
- Gebruik Markdown tabellen waar informatie beter past (min 3 data rows)
- Gebruik > syntax voor quotes
- Gebruik bold, italic voor nadruk
- Vergelijkingstabellen voor versus/vergelijkingsartikelen
- Geen verzonnen of gehalluccineerde details
- Markeer hypothetische voorbeelden duidelijk als zodanig

SEO:
- Front-load het primaire keyword in de titel
- Gebruik het keyword natuurlijk in de eerste alinea, headings en door het artikel
- Schrijf een meta description die key points samenvat (50 tot 140 tekens)
- Genereer 5 tot 10 relevante meta keywords

EXTERNE LINKS (ABSOLUUT VERPLICHT - minimaal 5 per artikel):
- ELKE sectie moet minstens 1 hyperlink bevatten in markdown formaat: [anchor text](https://url)
- Link naar gezaghebbende bronnen: officiële documentatie, research, branche-organisaties, tools
- Gebruik ALTIJD volledige markdown link syntax: [beschrijvende tekst](https://www.voorbeeld.com/pagina)
- Gebruik NOOIT kale URLs zonder markdown link syntax
- Gebruik beschrijvende anchor text, NOOIT "klik hier" of "lees meer"
- Gebruik ALLEEN echte, bestaande URLs van bekende websites. Verzin geen URLs.
- Voorbeelden van goede bronnen en formaat:
  - "Uit [onderzoek van HubSpot](https://www.hubspot.com/marketing-statistics) blijkt dat..."
  - "Tools zoals [Apollo.io](https://www.apollo.io/) bieden..."
  - "Volgens [Gartner's B2B rapport](https://www.gartner.com/en/sales) is..."
  - "De [LinkedIn Sales Navigator](https://business.linkedin.com/sales-solutions) helpt bij..."
- CONTROLEER: als je artikel minder dan 5 externe [text](url) links bevat, voeg er meer toe

INTERNE LINKS (ABSOLUUT VERPLICHT - minimaal 2 per artikel):
- Gebruik markdown link syntax: [anchor text](${siteUrl}/pad)
- Link naar relevante eigen blogposts en pagina's waar dat natuurlijk past
- Gebruik contextrijke anchor text die beschrijft waar de link naartoe gaat
- Plaats interne links in de eerste helft van het artikel waar mogelijk
- Link NIET naar het artikel zelf
- CONTROLEER: als je artikel minder dan 2 interne links bevat, voeg er meer toe
${internalLinksContext}
${groeistackContext}

QUOTES MET BRONVERMELDING (VERPLICHT - minimaal 2 per artikel):
- Gebruik > blockquote syntax voor citaten
- Citeer echte, bekende experts, auteurs of organisaties met naam en functie/titel
- Formaat:
> "Het citaat hier."
>
> – Naam, Functie bij Organisatie
- Gebruik citaten die het punt van de sectie versterken
- Mix tussen bekende industrie-experts en relevante onderzoeken/rapporten
- Citaten moeten inhoudelijk kloppen en geloofwaardig zijn

INFOGRAPHICS (VERPLICHT - gebruik minimaal 2 per artikel):
Voeg visuele infographics toe als speciale code blocks in de markdown. De beschikbare types:

1. Process Flow (stap-voor-stap processen, fases):
\\\`\\\`\\\`infographic-process
{"title":"Titel","phases":[{"title":"Fase 1","icon":"search","items":["Punt 1","Punt 2"]},{"title":"Fase 2","icon":"brain","items":["Punt 1","Punt 2"]}],"stats":[{"value":"50%","label":"Verbetering"}]}
\\\`\\\`\\\`

2. Comparison (vergelijking van opties):
\\\`\\\`\\\`infographic-compare
{"title":"A vs B","columns":[{"title":"Optie A","items":{"Snelheid":"Laag","Kosten":"Hoog"}},{"title":"Optie B","highlight":true,"items":{"Snelheid":"Hoog","Kosten":"Laag"}}]}
\\\`\\\`\\\`

3. Stats (key metrics):
\\\`\\\`\\\`infographic-stats
{"title":"Resultaten","stats":[{"value":"70%","label":"Hogere conversie","trend":"up"},{"value":"3x","label":"Meer leads","trend":"up"}]}
\\\`\\\`\\\`

4. Layers (architectuur, stapelmodellen):
\\\`\\\`\\\`infographic-layers
{"title":"Architectuur","layers":[{"title":"Laag 1","subtitle":"Basis","items":[{"label":"Kenmerk","value":"Waarde"}]}]}
\\\`\\\`\\\`

Beschikbare icons: search, lightbulb, rocket, check, settings, brain, target, shield, trending, zap, database, users, chart, globe, mail, message, filter.
Plaats infographics op logische plekken waar visuele verduidelijking waarde toevoegt. JSON moet geldig zijn.

${competitorPrompt ? `CONCURRENTEN: ${competitorPrompt}` : ""}

CTA: Sluit af met een subtiele call-to-action:
${ctaTitle ? `Titel: "${ctaTitle}"` : ""}
${ctaDescription ? `Beschrijving: "${ctaDescription}"` : ""}
${ctaButtonText ? `Button: "${ctaButtonText}"` : ""}
${ctaNote ? `Noot: "${ctaNote}"` : ""}`;

    const userPrompt = `Schrijf een uitgebreid, SEO-geoptimaliseerd blogartikel over: "${topic}"

Vereisten:
- Ongeveer ${wordCount} woorden
- Content type: ${content_type || "article"}
- Volg alle stijl-, structuur- en formatting-regels uit de system prompt
- Genereer alle metadata (title, meta_description, excerpt, slug, keywords)
- Schrijf in het ${lang}

Het artikel moet echte waarde en actionable inzichten bieden. Wees direct en concreet.

LAATSTE CHECK VOOR JE INDIENT:
- Tel het aantal [text](url) links in je content. Er moeten MINIMAAL 5 externe links en 2 interne links zijn.
- Elke H2-sectie moet minstens 1 link bevatten.
- Als er te weinig links zijn, voeg ze alsnog toe aan relevante zinnen.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        max_tokens: 32000,
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
                  meta_description: { type: "string", description: "Meta description, 50-140 characters" },
                  excerpt: { type: "string", description: "Short excerpt, max 200 characters" },
                  slug: { type: "string", description: "URL slug based on title" },
                  content: { type: "string", description: "Full article content in Markdown format" },
                  keywords: { type: "string", description: "Comma-separated meta keywords, 5-10" },
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
