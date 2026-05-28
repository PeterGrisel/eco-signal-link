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

async function loadContext(supabase: any) {
  const { data: settings } = await supabase
    .from("seo_settings").select("config").limit(1).single();
  const cfg = settings?.config || {};
  const siteUrl = cfg.site_url || "https://b2bgroeimachine.io";

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

  return { siteUrl, toolsContext, blogContext, playbookContext, existingTerms, existingTermsLower, internalLinks };
}

async function proposeTerms(LOVABLE_API_KEY: string, ctx: any, count: number): Promise<string[]> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: `Je stelt ${count} nieuwe B2B-termen voor het woordenboek van B2BGroeiMachine voor. Focus: B2B-groei, signal-based prospecting, RevOps, ICP, intent data, sequencing, attributie, RFxAI, sales, marketing, growth, data, AI. Geen tool- of merknamen. Mix Nederlands en gangbare Engelse vaktermen (ICP, intent data, MQL, SQL, ARR, churn, etc.). Antwoord met alleen een lijst, één term per regel, geen nummering, geen uitleg.` },
        { role: "user", content: `Bestaande termen (NIET herhalen):\n${ctx.existingTerms.join(", ") || "(nog geen)"}\n\nContext blog:\n${ctx.blogContext}\n\nContext playbooks:\n${ctx.playbookContext}\n\nGeef precies ${count} unieke nieuwe relevante termen.` },
      ],
    }),
  });
  if (!res.ok) throw new Error(`AI propose ${res.status}`);
  const j = await res.json();
  const raw = (j.choices?.[0]?.message?.content || "").trim();
  const terms = raw.split("\n")
    .map((l: string) => l.replace(/^[\s\-*0-9.)]+/, "").replace(/^["'`*]+|["'`*]+$/g, "").trim())
    .filter((l: string) => l.length > 1 && l.length < 80);
  // dedupe (case-insensitive) tegen bestaande
  const seen = new Set(ctx.existingTermsLower);
  const out: string[] = [];
  for (const t of terms) {
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
    if (out.length >= count) break;
  }
  return out;
}

async function generateOne(
  supabase: any, supabaseUrl: string, serviceKey: string, LOVABLE_API_KEY: string,
  ctx: any, chosenTerm: string,
): Promise<{ ok: boolean; term: string; slug?: string; error?: string; termId?: string; log: string[] }> {
  const log: string[] = [];
  let termIdForRun: string | null = null;
  try {
    if (ctx.existingTermsLower.has(chosenTerm.toLowerCase())) {
      throw new Error(`Term "${chosenTerm}" bestaat al`);
    }
    log.push(`Term gekozen: "${chosenTerm}"`);

    const systemPrompt = `Je bent een redacteur bij B2BGroeiMachine. Je schrijft glasheldere woordenboek-definities voor B2B-groei en signal-based prospecting.

STIJL: Nederlands B1, u/uw, max 12 woorden per zin, geen em-dashes, geen jargon zonder uitleg. Sentence case in koppen.

CONTEXT (De Groeistack — tools die wij koppelen, niet promoten):
${ctx.toolsContext}

INTERNE LINKS (gebruik er 2-4 als [tekst](url)):
${ctx.internalLinks}

STRUCTUUR (Markdown, GEEN H1):
- Eerste zin: korte definitie (max 25 woorden).
- "## Wat het betekent" — uitleg in 2-3 alinea's.
- "## Waarom het ertoe doet" — concrete waarde voor B2B-groei.
- "## Hoe wij het inzetten" — 3-5 bullets, verwijs naar onze methode of Groeistack.
- Sluit af met 1 zin die linkt naar een relevant playbook of de gratis scan (${ctx.siteUrl}/#boek-gratis-scan).`;

    const userPrompt = `Schrijf het woordenboek-artikel voor de term: "${chosenTerm}".

Geef alle metadata terug. Related terms: kies 3-5 bestaande termen uit deze lijst die echt relateren (of laat leeg als geen): ${ctx.existingTerms.slice(0, 60).join(", ") || "(geen)"}.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 6000,
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
    log.push(`✓ Gepubliceerd: "${gt.term}"`);

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
        }
      }
    } catch { log.push("⚠ Link-validatie mislukt"); }

    // Indexering + prerender (best-effort, kort)
    const { data: finalRow } = await supabase
      .from("glossary_terms").select("status").eq("id", termIdForRun!).single();
    if (finalRow?.status === "published") {
      const fullUrl = `${ctx.siteUrl}/woordenboek/${slug}`;
      try {
        await supabase.from("indexing_requests").insert({ url: fullUrl, status: "pending" });
        fetch(`${supabaseUrl}/functions/v1/request-indexing`, {
          method: "POST",
          headers: { Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ urls: [fullUrl] }),
        }).catch(() => {});
        fetch(
          `${supabaseUrl}/functions/v1/prerender?path=${encodeURIComponent(`/woordenboek/${slug}`)}&nocache=1`,
          { headers: { Authorization: `Bearer ${serviceKey}` } },
        ).catch(() => {});
      } catch {}
    }

    await supabase.from("glossary_runs").insert({
      term_id: termIdForRun, status: "success", message: gt.term, log,
    });

    // Update lokale context zodat volgende termen niet dupliceren
    ctx.existingTerms.push(gt.term);
    ctx.existingTermsLower.add(gt.term.toLowerCase());

    return { ok: true, term: gt.term, slug, termId: termIdForRun || undefined, log };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    log.push(`✗ ${msg}`);
    try {
      await supabase.from("glossary_runs").insert({
        term_id: termIdForRun, status: "failed", message: msg, log,
      });
    } catch {}
    return { ok: false, term: chosenTerm, error: msg, log };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let body: { term?: string; count?: number } = {};
    try { body = await req.json(); } catch { /* cron */ }

    const ctx = await loadContext(supabase);
    const requestedCount = Math.min(Math.max(Number(body.count) || 1, 1), 50);

    // BULK MODUS — verwerkt op achtergrond, antwoordt direct
    if (requestedCount > 1) {
      const proposed = await proposeTerms(LOVABLE_API_KEY, ctx, requestedCount);
      if (proposed.length === 0) throw new Error("AI kon geen nieuwe termen voorstellen");

      await supabase.from("glossary_runs").insert({
        status: "success",
        message: `Bulk run gestart: ${proposed.length} termen`,
        log: [`Voorgesteld: ${proposed.join(", ")}`],
      });

      // Background: verwerk sequentieel
      const task = (async () => {
        for (const t of proposed) {
          await generateOne(supabase, supabaseUrl, serviceKey, LOVABLE_API_KEY, ctx, t);
        }
        await supabase.from("glossary_runs").insert({
          status: "success",
          message: `Bulk run afgerond (${proposed.length} termen verwerkt)`,
          log: [],
        });
      })();
      // @ts-ignore Deno-specific background runtime
      if (typeof EdgeRuntime !== "undefined" && (EdgeRuntime as any).waitUntil) {
        // @ts-ignore
        EdgeRuntime.waitUntil(task);
      } else {
        task.catch((e) => console.error("bulk bg", e));
      }

      return new Response(
        JSON.stringify({ ok: true, bulk: true, queued: proposed.length, terms: proposed }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ENKELE TERM
    let chosenTerm = (body.term || "").trim();
    if (!chosenTerm) {
      const [first] = await proposeTerms(LOVABLE_API_KEY, ctx, 1);
      if (!first) throw new Error("AI kon geen term voorstellen");
      chosenTerm = first;
    }
    const result = await generateOne(supabase, supabaseUrl, serviceKey, LOVABLE_API_KEY, ctx, chosenTerm);
    return new Response(
      JSON.stringify(result),
      { status: result.ok ? 200 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("generate-glossary error:", e);
    try {
      await supabase
      .from("seo_settings").select("config").limit(1).single();
      await supabase.from("glossary_runs").insert({
        status: "failed", message: e instanceof Error ? e.message : String(e), log: [],
      });
    } catch {}
    return new Response(
      JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});