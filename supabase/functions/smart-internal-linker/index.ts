import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const JOB_KEY = "smart-internal-linker";
const MAX_INSERTS_PER_TARGET = 2;
const MAX_LINKS_PER_POST = 7;
const STOP_WORDS = new Set([
  "de","het","een","en","of","maar","van","voor","met","op","in","bij","aan",
  "is","zijn","wordt","heeft","worden","te","dat","die","dit","deze","als",
  "gratis","blog","contact","nieuwsbrief","meer","lees"
]);

function classifyAnchor(keyword: string, anchor: string): "exact" | "partial" | "descriptive" | "generic" {
  const k = keyword.trim().toLowerCase();
  const a = anchor.trim().toLowerCase();
  if (a === k) return "exact";
  if (a.includes(k) || k.includes(a)) return "partial";
  if (["lees meer", "klik hier", "hier", "meer info"].includes(a)) return "generic";
  return "descriptive";
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function injectLinks(
  markdown: string,
  targets: Array<{ keyword: string; target_url: string; priority: number; pillar_slugs?: string[] }>
): { content: string; inserted: number; suggestions: Array<{ source_url: string; target_url: string; anchor_text: string; anchor_type: string }> } {
  // Split by code fences to skip code blocks
  const parts = markdown.split(/(```[\s\S]*?```)/g);
  let totalInserted = 0;
  const suggestions: Array<{ source_url: string; target_url: string; anchor_text: string; anchor_type: string }> = [];

  const filtered = targets.filter(t => !STOP_WORDS.has(t.keyword.trim().toLowerCase()) && t.keyword.trim().length >= 3);
  const sorted = [...filtered].sort((a, b) => b.priority - a.priority || b.keyword.length - a.keyword.length);

  for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith("```")) continue;
    let segment = parts[i];

    for (const t of sorted) {
      if (totalInserted >= MAX_LINKS_PER_POST) break;
      // Skip if already linked anywhere to this target_url
      const alreadyLinked = new RegExp(`\\]\\(${escapeRegex(t.target_url)}[#?)\\s]`, "i").test(segment);
      if (alreadyLinked) continue;

      const kwRegex = new RegExp(`\\b(${escapeRegex(t.keyword)})\\b`, "gi");
      let inserted = 0;

      // Process line by line so we can skip headings and existing links
      const lines = segment.split("\n");
      for (let li = 0; li < lines.length; li++) {
        if (inserted >= MAX_INSERTS_PER_TARGET || totalInserted >= MAX_LINKS_PER_POST) break;
        const line = lines[li];
        if (/^\s*#/.test(line)) continue; // heading
        if (/^\s*>/.test(line)) continue; // quote

        // Replace only first occurrence not already inside a link
        let replaced = false;
        lines[li] = line.replace(kwRegex, (match, _g, offset, full) => {
          if (replaced || inserted >= MAX_INSERTS_PER_TARGET || totalInserted >= MAX_LINKS_PER_POST) return match;
          // Check if inside an existing markdown link [text](url) — look behind for "[" without "]("
          const before = full.slice(0, offset);
          const openBrackets = (before.match(/\[/g) || []).length;
          const closeBrackets = (before.match(/\]\(/g) || []).length;
          if (openBrackets > closeBrackets) return match;
          // Check inline code
          const backticksBefore = (before.match(/`/g) || []).length;
          if (backticksBefore % 2 === 1) return match;
          replaced = true;
          inserted++;
          totalInserted++;
          suggestions.push({
            source_url: "",
            target_url: t.target_url,
            anchor_text: match,
            anchor_type: classifyAnchor(t.keyword, match),
          });
          return `[${match}](${t.target_url})`;
        });
      }
      segment = lines.join("\n");
    }

    parts[i] = segment;
  }

  return { content: parts.join(""), inserted: totalInserted, suggestions };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const started = Date.now();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    let body: any = {};
    try { body = await req.json(); } catch {}
    const onlySlug: string | undefined = body?.slug;

    const { data: targets, error: tErr } = await supabase
      .from("link_targets")
      .select("keyword,target_url,priority")
      .eq("active", true);
    if (tErr) throw tErr;

    let q = supabase.from("blog_posts").select("id,slug,content").eq("status", "published");
    if (onlySlug) q = q.eq("slug", onlySlug);
    const { data: posts, error: pErr } = await q.limit(500);
    if (pErr) throw pErr;

    let updated = 0;
    let totalInserted = 0;
    for (const post of posts || []) {
      const { content, inserted, suggestions } = injectLinks(post.content || "", targets || []);
      if (inserted > 0 && content !== post.content) {
        await supabase.from("blog_posts").update({ content }).eq("id", post.id);
        updated++;
        totalInserted += inserted;
        const sourceUrl = `/blog/${post.slug}`;
        const rows = suggestions.map(s => ({
          source_url: sourceUrl,
          target_url: s.target_url,
          anchor_text: s.anchor_text,
          anchor_type: s.anchor_type,
          reason: "auto-inserted",
          score: 1,
          status: "applied",
        }));
        if (rows.length > 0) {
          await supabase.from("link_suggestions").insert(rows);
        }
      }
    }

    const duration = Date.now() - started;
    const msg = `${updated} posts geüpdatet, ${totalInserted} links toegevoegd`;
    await supabase.from("job_runs").insert({
      job_key: JOB_KEY, status: "success", message: msg,
      finished_at: new Date().toISOString(), duration_ms: duration,
      metadata: { posts_scanned: (posts || []).length, posts_updated: updated, links_inserted: totalInserted },
    });

    return new Response(JSON.stringify({ ok: true, posts_updated: updated, links_inserted: totalInserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    await supabase.from("job_runs").insert({
      job_key: JOB_KEY, status: "error", message: String(e),
      finished_at: new Date().toISOString(), duration_ms: Date.now() - started,
    });
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});