import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const slugify = (s: string) =>
  s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const log: string[] = [];
  let termIdForRun: string | null = null;

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let body: { term?: string } = {};
    try { body = await req.json(); } catch { /* cron */ }

    const { data: settings } = await supabase
      .from("seo_settings").select("config").limit(1).single();
    const cfg = settings?.config || {};
    const siteUrl = cfg.site_url || "https://b2bgroeimachine.io";

    // Website context
    const [{ data: tools }, { data: posts }, { data: playbooks }, { data: existing }] = await Promise.all([
      supabase.from("groeistack_tools").select("name, category").eq("published", true).limit(80),
      supabase.from("blog_posts").select("title, slug").eq("status", "published").order("published_at", { ascending: false }).limit(30),
      supabase.from("playbooks").select("title, slug").eq("status", "published").order("published_at", { ascending: false }).limit(30),
      supabase.from("glossary_terms").select("term, slug").eq("status", "published").order("published_at", { ascending: false }),
    ]);

    const existingTerms = (existing || []).map((t: any) => t.term);
    const existingTermsLower = new Set(existingTerms.map((t: string) => t.toLowerCase()));

    const toolsContext = (tools || []).map((t: any) => `- ${t.name} (${t.category})`).join("\n");
    const blogContext = (posts || []).map((p: any) => `- ${p.title}`).join("\n");
    const playbookContext = (playbooks || []).map((p: any) => `- ${p.title}`).join("\n");

    const internalLinks = [
      `- De Groeistack: ${siteUrl}/groeistack`,
      `- Hoe het werkt: ${siteUrl}/hoe-het-werkt`,
      `- Playbooks: ${siteUrl}/playbooks`,
      ...(existing || []).slice(0, 12).map((t: any) => `- ${t.term}: ${siteUrl}/woordenboek/${t.slug}`),
    ].join("\n");

    // Term kiezen: handmatig of AI laat zelf een nieuwe term voorstellen
    let chosenTerm = (body.term || "").trim();
    if (!chosenTerm) {
      const pickRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "Je stelt één nieuwe B2B-term voor het woordenboek van B2BGroeiMachine voor. Focus: B2B-groei, signal-based prospecting, RevOps, ICP, intent data, sequencing, attributie, RFxAI. Geen tool-namen. Eén term, Nederlands waar logisch, anders Engels (zoals ICP, intent data). Antwoord met alleen de term, geen uitleg." },
            { role: "user", content: `Bestaande termen (niet herhalen):\n${existingTerms.join(", ") || "(nog geen)"}\n\nContext blog:\n${blogContext}\n\nContext playbooks:\n${playbookContext}\n\nGeef één nieuwe relevante term.` },
          ],
        }),
      });
      if (!pickRes.ok) throw new Error(`AI pick ${pickRes.status}`);
      const pickJson = await pickRes.json();
      chosenTerm = (pickJson.choices?.[0]?.message?.content || "").trim().replace(/^["'`*]+|["'`*]+$/g, "").split("\n")[0].trim();
      if (!chosenTerm) throw new Error("AI kon geen term voorstellen");
    }

    if (existingTermsLower.has(chosenTerm.toLowerCase())) {
      throw new Error(`Term "${chosenTerm}" bestaat al`);
    }
    log.push(`Term gekozen: "${chosenTerm}"`);

    const systemPrompt = `Je bent een redacteur bij B2BGroeiMachine. Je schrijft glasheldere woordenboek-definities voor B2B-groei en signal-based prospecting.

STIJL: Nederlands B1, u/uw, max 12 woorden per zin, geen em-dashes, geen jargon zonder uitleg. Sentence case in koppen.

CONTEXT (De Groeistack — tools die wij koppelen, niet promoten):
${toolsContext}

INTERNE LINKS (gebruik er 2-4 als [tekst](url)):
${internalLinks}

STRUCTUUR (Markdown, GEEN H1):
- Eerste zin: korte definitie (max 25 woorden).
- "## Wat het betekent" — uitleg in 2-3 alinea's.
- "## Waarom het ertoe doet" — concrete waarde voor B2B-groei.
- "## Hoe wij het inzetten" — 3-5 bullets, verwijs naar onze methode of Groeistack.
- Sluit af met 1 zin die linkt naar een relevant playbook of de gratis scan (${siteUrl}/#boek-gratis-scan).`;

    const userPrompt = `Schrijf het woordenboek-artikel voor de term: "${chosenTerm}".

Geef alle metadata terug. Related terms: kies 3-5 bestaande termen uit deze lijst die echt relateren (of laat leeg als geen): ${existingTerms.slice(0, 60).join(", ") || "(geen)"}.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        max_tokens: 8000,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "create_glossary_term",
            description: "Create a glossary term entry with SEO metadata",
            parameters: {
              type: "object",
              properties: {
                term: { type: "string", description: "De term, exact zoals deze gebruikt wordt" },
                slug: { type: "string", description: "URL-slug" },
                short_def: { type: "string", description: "Eénzins definitie, max 200 tekens" },
                meta_description: { type: "string", description: "Meta description 50-155 tekens" },
                category: { type: "string", description: "Categorie zoals: Prospecting, Data, RevOps, Sequencing, ICP, Attributie" },
                related_terms: { type: "array", items: { type: "string" } },
                content: { type: "string", description: "Volledig artikel in Markdown, geen H1" },
              },
              required: ["term", "slug", "short_def", "content"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "create_glossary_term" } },
      }),
    });

    if (!aiRes.ok) {
      const t = await aiRes.text();
      throw new Error(`AI ${aiRes.status}: ${t.slice(0, 200)}`);
    }
    const data = await aiRes.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("Geen term gegenereerd");
    const gt = JSON.parse(toolCall.function.arguments);

    let slug = slugify(gt.slug || gt.term);
    if (!slug) slug = `term-${Date.now()}`;
    const { data: clash } = await supabase
      .from("glossary_terms").select("id").eq("slug", slug).maybeSingle();
    if (clash) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

    const { data: inserted, error: insErr } = await supabase.from("glossary_terms").insert({
      slug,
      term: gt.term,
      short_def: gt.short_def,
      meta_description: gt.meta_description || gt.short_def,
      category: gt.category || null,
      related_terms: Array.isArray(gt.related_terms) ? gt.related_terms : [],
      content: gt.content,
      status: "published",
      published_at: new Date().toISOString(),
    }).select("id").single();
    if (insErr) throw insErr;
    termIdForRun = inserted?.id ?? null;
    log.push(`✓ Term gepubliceerd: "${gt.term}"`);

    // Externe link-validatie
    try {
      const v = await fetch(`${supabaseUrl}/functions/v1/validate-external-links`, {
        method: "POST",
        headers: { Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ content: gt.content }),
      });
      if (v.ok) {
        const vj = await v.json();
        const broken = vj.broken || [];
        if (broken.length > 0 && termIdForRun) {
          await supabase.from("glossary_terms")
            .update({ status: "draft", published_at: null }).eq("id", termIdForRun);
          log.push(`⚠ ${broken.length} dode link(s) → draft`);
        } else {
          log.push(`✓ Externe links ok (${vj.checked || 0} gecheckt)`);
        }
      }
    } catch { log.push("⚠ Link-validatie mislukt"); }

    // Indexering + prerender
    const { data: finalRow } = await supabase
      .from("glossary_terms").select("status").eq("id", termIdForRun!).single();
    if (finalRow?.status === "published") {
      const fullUrl = `${siteUrl}/woordenboek/${slug}`;
      try {
        await supabase.from("indexing_requests").insert({ url: fullUrl, status: "pending" });
        await fetch(`${supabaseUrl}/functions/v1/request-indexing`, {
          method: "POST",
          headers: { Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ urls: [fullUrl] }),
        }).catch(() => {});
        log.push(`✓ Indexering aangevraagd: ${fullUrl}`);
      } catch { log.push("⚠ Indexering aanvragen mislukt"); }
      try {
        await fetch(
          `${supabaseUrl}/functions/v1/prerender?path=${encodeURIComponent(`/woordenboek/${slug}`)}&nocache=1`,
          { headers: { Authorization: `Bearer ${serviceKey}` } },
        );
        log.push(`✓ Prerender cache opgewarmd`);
      } catch {}
    }

    await supabase.from("glossary_runs").insert({
      term_id: termIdForRun, status: "success", message: gt.term, log,
    });

    return new Response(
      JSON.stringify({ ok: true, slug, term: gt.term, log }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("generate-glossary error:", e);
    try {
      await supabase.from("glossary_runs").insert({
        term_id: termIdForRun,
        status: "failed",
        message: e instanceof Error ? e.message : String(e),
        log,
      });
    } catch {}
    return new Response(
      JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});