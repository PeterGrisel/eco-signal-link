import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const JOB_KEY = "enrich-ai-readiness";

const ANSWER_HEADINGS = ["kernantwoord", "tl;dr", "tldr", "antwoord", "samenvatting"];
const FAQ_HEADINGS = ["faq", "veelgestelde vragen", "vaak gestelde vragen"];

function hasHeading(md: string, names: string[]): boolean {
  const re = /^(#{2,3})\s+(.+?)\s*$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md))) {
    const t = m[2].toLowerCase().trim();
    if (names.some((n) => t === n || t.startsWith(n + " "))) return true;
  }
  return false;
}

/** Insert "## Kernantwoord\n\n<answer>\n\n" before the first H2, or at the top if none. */
function insertKernantwoord(md: string, answer: string): string {
  const block = `## Kernantwoord\n\n${answer.trim()}\n\n`;
  const lines = md.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) {
      return [...lines.slice(0, i), block.trimEnd(), "", ...lines.slice(i)].join("\n");
    }
  }
  return block + md;
}

function appendFaq(md: string, faqs: { question: string; answer: string }[]): string {
  const body = faqs
    .map((f) => `### ${f.question.replace(/\?+\s*$/, "")}?\n\n${f.answer.trim()}`)
    .join("\n\n");
  return md.trimEnd() + `\n\n## Veelgestelde vragen\n\n${body}\n`;
}

async function generateEnrichment(
  title: string,
  content: string,
  needAnswer: boolean,
  needFaq: boolean,
): Promise<{ answer?: string; faqs?: { question: string; answer: string }[] }> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

  const tasks: string[] = [];
  if (needAnswer)
    tasks.push(
      '- "answer": 2-3 zinnen die de kernvraag van het artikel direct beantwoorden. Geen bullets, geen opsomming, geen herhaling van de titel. Max 60 woorden. B1 Nederlands, korte zinnen.',
    );
  if (needFaq)
    tasks.push(
      '- "faqs": array van minimaal 3, maximaal 5 objecten met {question, answer}. Vragen die lezers daadwerkelijk googlen rond dit onderwerp. Antwoord max 3 zinnen, concreet, B1 Nederlands.',
    );

  const props: Record<string, unknown> = {};
  const required: string[] = [];
  if (needAnswer) {
    props.answer = { type: "string" };
    required.push("answer");
  }
  if (needFaq) {
    props.faqs = {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          answer: { type: "string" },
        },
        required: ["question", "answer"],
        additionalProperties: false,
      },
    };
    required.push("faqs");
  }

  const systemPrompt = `Je bent een Nederlandse B2B content editor. Je krijgt een bestaand artikel en moet missende AI-citatie blokken toevoegen ZONDER de rest van het artikel te herschrijven. Lever de gevraagde velden via de tool aan.\n\nRegels:\n${tasks.join("\n")}\n- Geen markdown-headers in de output (geen ##, geen ###).\n- Geen verwijzingen naar "dit artikel" of "hieronder". Sta op zichzelf.\n- Geen em-dashes.`;

  const userPrompt = `Titel: ${title}\n\nArtikel (markdown, ingekort indien lang):\n\n${content.slice(0, 12000)}`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "enrich",
            description: "Lever Kernantwoord en/of FAQ aan",
            parameters: {
              type: "object",
              properties: props,
              required,
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "enrich" } },
    }),
  });

  if (!response.ok) {
    const txt = await response.text();
    throw new Error(`AI gateway ${response.status}: ${txt.slice(0, 300)}`);
  }
  const data = await response.json();
  const args = data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) throw new Error("Geen tool_call response van model");
  return JSON.parse(args);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const started = Date.now();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const summary = {
    scanned: 0,
    enriched: 0,
    skipped: 0,
    failed: 0,
    errors: [] as { slug: string; error: string }[],
  };

  try {
    const body = await req.json().catch(() => ({}));
    const limit: number = Math.min(body?.limit ?? 50, 100);
    const onlySlug: string | undefined = body?.slug;

    // ── Blog posts ───────────────────────────────────────────────
    let blogQuery = supabase
      .from("blog_posts")
      .select("id, slug, title, content")
      .eq("status", "published");
    if (onlySlug?.startsWith("/blog/")) {
      blogQuery = blogQuery.eq("slug", onlySlug.replace("/blog/", ""));
    }
    const { data: posts } = await blogQuery.limit(limit);

    for (const p of posts || []) {
      summary.scanned++;
      const md = p.content || "";
      const needAnswer = !hasHeading(md, ANSWER_HEADINGS);
      const needFaq = !hasHeading(md, FAQ_HEADINGS);
      if (!needAnswer && !needFaq) {
        summary.skipped++;
        continue;
      }
      try {
        const enr = await generateEnrichment(p.title, md, needAnswer, needFaq);
        let newContent = md;
        if (needAnswer && enr.answer) newContent = insertKernantwoord(newContent, enr.answer);
        if (needFaq && enr.faqs && enr.faqs.length >= 3) newContent = appendFaq(newContent, enr.faqs);
        if (newContent === md) {
          summary.skipped++;
          continue;
        }
        const { error } = await supabase
          .from("blog_posts")
          .update({ content: newContent, updated_at: new Date().toISOString() })
          .eq("id", p.id);
        if (error) throw error;
        summary.enriched++;
      } catch (e) {
        summary.failed++;
        summary.errors.push({ slug: `/blog/${p.slug}`, error: e instanceof Error ? e.message : String(e) });
      }
    }

    // ── Playbooks ────────────────────────────────────────────────
    let pbQuery = supabase
      .from("playbooks")
      .select("id, slug, title, content")
      .eq("status", "published");
    if (onlySlug?.startsWith("/playbooks/")) {
      pbQuery = pbQuery.eq("slug", onlySlug.replace("/playbooks/", ""));
    }
    const { data: playbooks } = await pbQuery.limit(limit);

    for (const p of playbooks || []) {
      summary.scanned++;
      const md = p.content || "";
      const needAnswer = !hasHeading(md, ANSWER_HEADINGS);
      const needFaq = !hasHeading(md, FAQ_HEADINGS);
      if (!needAnswer && !needFaq) {
        summary.skipped++;
        continue;
      }
      try {
        const enr = await generateEnrichment(p.title, md, needAnswer, needFaq);
        let newContent = md;
        if (needAnswer && enr.answer) newContent = insertKernantwoord(newContent, enr.answer);
        if (needFaq && enr.faqs && enr.faqs.length >= 3) newContent = appendFaq(newContent, enr.faqs);
        if (newContent === md) {
          summary.skipped++;
          continue;
        }
        const { error } = await supabase
          .from("playbooks")
          .update({ content: newContent, updated_at: new Date().toISOString() })
          .eq("id", p.id);
        if (error) throw error;
        summary.enriched++;
      } catch (e) {
        summary.failed++;
        summary.errors.push({ slug: `/playbooks/${p.slug}`, error: e instanceof Error ? e.message : String(e) });
      }
    }

    // ── Trigger re-scan zodat scores meteen kloppen ───────────────
    try {
      await supabase.functions.invoke("ai-readiness-scan");
    } catch (_) {
      // niet kritiek; volgende cron pikt het op
    }

    await supabase.from("job_runs").insert({
      job_key: JOB_KEY,
      status: summary.failed > 0 && summary.enriched === 0 ? "error" : "success",
      finished_at: new Date().toISOString(),
      duration_ms: Date.now() - started,
      message: `Enriched ${summary.enriched}/${summary.scanned} (skipped ${summary.skipped}, failed ${summary.failed})`,
      metadata: summary,
    });

    return new Response(JSON.stringify({ ok: true, summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await supabase.from("job_runs").insert({
      job_key: JOB_KEY,
      status: "error",
      finished_at: new Date().toISOString(),
      duration_ms: Date.now() - started,
      message: msg,
      metadata: summary,
    });
    return new Response(JSON.stringify({ ok: false, error: msg, summary }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});