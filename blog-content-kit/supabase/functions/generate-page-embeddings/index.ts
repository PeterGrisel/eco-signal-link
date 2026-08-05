import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const JOB_KEY = "generate-page-embeddings";
const MODEL = "openai/text-embedding-3-small";

async function sha256(s: string): Promise<string> {
  const bytes = new TextEncoder().encode(s);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function embed(text: string, key: string): Promise<number[]> {
  const r = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, input: text.slice(0, 8000) }),
  });
  if (!r.ok) throw new Error(`embed ${r.status}: ${await r.text()}`);
  const j = await r.json();
  return j.data[0].embedding;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const started = Date.now();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

  try {
    const sources: Array<{ url: string; type: string; title: string; body: string }> = [];

    const { data: posts } = await supabase
      .from("blog_posts").select("slug,title,excerpt,content")
      .eq("status", "published").limit(500);
    for (const p of posts || []) sources.push({
      url: `/blog/${p.slug}`, type: "blog", title: p.title,
      body: `${p.title}\n\n${p.excerpt || ""}\n\n${(p.content || "").slice(0, 6000)}`,
    });

    const { data: terms } = await supabase
      .from("glossary_terms").select("slug,term,short_def,content")
      .eq("status", "published").limit(500);
    for (const t of terms || []) sources.push({
      url: `/woordenboek/${t.slug}`, type: "glossary", title: t.term,
      body: `${t.term}\n\n${t.short_def || ""}\n\n${(t.content || "").slice(0, 4000)}`,
    });

    const { data: plays } = await supabase
      .from("playbooks").select("slug,title,excerpt,content")
      .eq("status", "published").limit(500);
    for (const p of plays || []) sources.push({
      url: `/playbooks/${p.slug}`, type: "playbook", title: p.title,
      body: `${p.title}\n\n${p.excerpt || ""}\n\n${(p.content || "").slice(0, 4000)}`,
    });

    let updated = 0; let skipped = 0; let failed = 0;
    for (const s of sources) {
      try {
        const hash = await sha256(s.body);
        const { data: existing } = await supabase
          .from("page_embeddings").select("id,content_hash").eq("page_url", s.url).maybeSingle();
        if (existing && existing.content_hash === hash) { skipped++; continue; }
        const vec = await embed(s.body, LOVABLE_API_KEY);
        const row = {
          page_url: s.url, page_type: s.type, title: s.title,
          content_hash: hash, embedding: vec as unknown as string,
          updated_at: new Date().toISOString(),
        };
        if (existing) await supabase.from("page_embeddings").update(row).eq("id", existing.id);
        else await supabase.from("page_embeddings").insert(row);
        updated++;
        await new Promise((r) => setTimeout(r, 100));
      } catch (e) {
        failed++;
        console.error("embed failed for", s.url, e);
      }
    }

    const duration = Date.now() - started;
    await supabase.from("job_runs").insert({
      job_key: JOB_KEY, status: failed > 0 && updated === 0 ? "error" : "success",
      message: `${updated} embeddings vernieuwd, ${skipped} ongewijzigd, ${failed} mislukt`,
      finished_at: new Date().toISOString(), duration_ms: duration,
    });
    return new Response(JSON.stringify({ ok: true, updated, skipped, failed }), {
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