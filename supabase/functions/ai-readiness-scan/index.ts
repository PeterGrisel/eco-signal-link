import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const JOB_KEY = "ai-readiness-scan";

const ANSWER_HEADINGS = ["kernantwoord", "tl;dr", "tldr", "antwoord", "samenvatting"];
const FAQ_HEADINGS = ["faq", "veelgestelde vragen", "vaak gestelde vragen"];

function hasHeading(md: string, names: string[]): boolean {
  const re = /^#{2,3}\s+(.+?)\s*$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md))) {
    const t = m[1].toLowerCase().trim();
    if (names.some((n) => t === n || t.startsWith(n + " "))) return true;
  }
  return false;
}

function hasConcreteExamples(md: string): boolean {
  // Indicatie: bevat cijfers met % of "EUR" of jaartallen of stappenlijst
  if (/\d+\s*%/.test(md)) return true;
  if (/€\s*\d|EUR\s*\d/i.test(md)) return true;
  if (/(20\d{2})/.test(md)) return true;
  if (/^\s*\d+\.\s+/m.test(md)) return true;
  return false;
}

function countInternalLinks(md: string): number {
  // Markdown links die niet beginnen met http (relatieve interne links)
  const re = /\]\(([^)]+)\)/g;
  let count = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md))) {
    const href = m[1].trim();
    if (href.startsWith("/") || href.startsWith("#")) count++;
    else if (/^https?:\/\/(www\.)?b2bgroeimachine\.io/i.test(href)) count++;
  }
  return count;
}

function computeScore(r: {
  has_answer_block: boolean;
  has_faq: boolean;
  has_schema: boolean;
  has_author_entity: boolean;
  has_recent_date: boolean;
  has_concrete_examples: boolean;
  html_crawlable: boolean;
  internal_links_count: number;
}): number {
  let s = 0;
  if (r.has_answer_block) s += 20;
  if (r.has_faq) s += 15;
  if (r.has_schema) s += 15;
  s += Math.min(r.internal_links_count * 5, 15);
  if (r.has_author_entity) s += 10;
  if (r.has_recent_date) s += 10;
  if (r.has_concrete_examples) s += 10;
  if (r.html_crawlable) s += 5;
  return s;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const started = Date.now();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const summary = { blogs: 0, playbooks: 0, glossary: 0, updated: 0, refresh_added: 0 };
    const now = Date.now();
    const sixMonthsAgo = now - 1000 * 60 * 60 * 24 * 180;

    // ── 1. Blog posts ────────────────────────────────────────────
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, content, updated_at, published_at, status")
      .eq("status", "published");

    for (const p of posts || []) {
      summary.blogs++;
      const md = p.content || "";
      const has_answer_block = hasHeading(md, ANSWER_HEADINGS);
      const has_faq = hasHeading(md, FAQ_HEADINGS);
      const internal_links_count = countInternalLinks(md);
      const has_concrete_examples = hasConcreteExamples(md);
      const refreshDate = p.updated_at || p.published_at;
      const has_recent_date = refreshDate ? new Date(refreshDate).getTime() > sixMonthsAgo : false;

      const factors = {
        has_answer_block,
        has_faq,
        has_schema: true, // BlogPost.tsx + prerender emit BlogPosting + Breadcrumb
        has_author_entity: true, // publisher Organization in JSON-LD
        has_recent_date,
        has_concrete_examples,
        html_crawlable: true, // via prerender
        internal_links_count,
      };
      const score = computeScore(factors);
      const missing: string[] = [];
      if (!has_answer_block) missing.push("answer_block");
      if (!has_faq) missing.push("faq");
      if (internal_links_count < 3) missing.push("internal_links");
      if (!has_recent_date) missing.push("recent_date");
      if (!has_concrete_examples) missing.push("concrete_examples");

      const { error } = await supabase.from("seo_ai_readiness").upsert({
        slug: `/blog/${p.slug}`,
        page_type: "blog",
        ...factors,
        ai_readiness_score: score,
        missing_factors: missing,
        last_scanned_at: new Date().toISOString(),
        last_refreshed_at: refreshDate,
      });
      if (!error) summary.updated++;

      // Refresh queue: score < 60 of geen recente datum → high; ouder dan 180d zonder hoge score → medium
      if (score < 60 || !has_recent_date) {
        const priority = score < 40 ? "high" : "medium";
        const reason = !has_recent_date
          ? "Artikel ouder dan 180 dagen"
          : `AI Readiness score ${score}/100 (mist: ${missing.join(", ")})`;
        const { error: qErr } = await supabase
          .from("content_refresh_queue")
          .upsert(
            {
              slug: `/blog/${p.slug}`,
              reason,
              priority,
              status: "open",
              signal_data: { score, missing },
              last_updated_at: refreshDate,
            },
            { onConflict: "slug", ignoreDuplicates: false },
          );
        if (!qErr) summary.refresh_added++;
      }
    }

    // ── 2. Playbooks ─────────────────────────────────────────────
    const { data: playbooks } = await supabase
      .from("playbooks")
      .select("slug, content, updated_at, published_at, status")
      .eq("status", "published");

    for (const p of playbooks || []) {
      summary.playbooks++;
      const md = p.content || "";
      const refreshDate = p.updated_at || p.published_at;
      const factors = {
        has_answer_block: hasHeading(md, ANSWER_HEADINGS),
        has_faq: hasHeading(md, FAQ_HEADINGS),
        has_schema: true,
        has_author_entity: true,
        has_recent_date: refreshDate ? new Date(refreshDate).getTime() > sixMonthsAgo : false,
        has_concrete_examples: hasConcreteExamples(md),
        html_crawlable: true,
        internal_links_count: countInternalLinks(md),
      };
      const score = computeScore(factors);
      const missing: string[] = [];
      if (!factors.has_answer_block) missing.push("answer_block");
      if (!factors.has_faq) missing.push("faq");
      if (factors.internal_links_count < 3) missing.push("internal_links");

      await supabase.from("seo_ai_readiness").upsert({
        slug: `/playbooks/${p.slug}`,
        page_type: "playbook",
        ...factors,
        ai_readiness_score: score,
        missing_factors: missing,
        last_scanned_at: new Date().toISOString(),
        last_refreshed_at: refreshDate,
      });
      summary.updated++;
    }

    const duration = Date.now() - started;
    await supabase.from("job_runs").insert({
      job_key: JOB_KEY,
      status: "success",
      finished_at: new Date().toISOString(),
      duration_ms: duration,
      message: `Scanned ${summary.blogs} blogs + ${summary.playbooks} playbooks`,
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
    });
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});