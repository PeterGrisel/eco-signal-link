import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const JOB_KEY = "orphan-link-detector";

function cosineFromString(a: string, b: number[]): number {
  // pgvector returns vectors as JSON string like "[0.1,0.2,...]"
  const arr = JSON.parse(a) as number[];
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < arr.length; i++) {
    dot += arr[i] * b[i];
    na += arr[i] * arr[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const started = Date.now();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const { data: pages } = await supabase
      .from("page_embeddings").select("page_url,page_type,title,embedding").limit(2000);
    if (!pages || pages.length < 2) {
      await supabase.from("job_runs").insert({
        job_key: JOB_KEY, status: "success", message: "Te weinig embeddings",
        finished_at: new Date().toISOString(), duration_ms: Date.now() - started,
      });
      return new Response(JSON.stringify({ ok: true, suggestions: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build inbound link count from blog markdown
    const { data: posts } = await supabase
      .from("blog_posts").select("slug,content").eq("status", "published").limit(500);
    const inbound = new Map<string, number>();
    for (const p of posts || []) {
      const matches = (p.content || "").match(/\]\((\/[^\s)#?]+)/g) || [];
      for (const m of matches) {
        const url = m.slice(2);
        inbound.set(url, (inbound.get(url) || 0) + 1);
      }
    }

    const parsed = pages.map((p) => ({
      ...p,
      vec: typeof p.embedding === "string" ? JSON.parse(p.embedding) : p.embedding,
    }));

    const orphans = parsed.filter((p) => (inbound.get(p.page_url) || 0) < 2);

    let added = 0;
    for (const orphan of orphans.slice(0, 100)) {
      // Find top 3 most similar pages
      const scored = parsed
        .filter((other) => other.page_url !== orphan.page_url)
        .map((other) => {
          let dot = 0, na = 0, nb = 0;
          const a = orphan.vec as number[];
          const b = other.vec as number[];
          for (let i = 0; i < a.length; i++) {
            dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i];
          }
          return { url: other.page_url, score: dot / (Math.sqrt(na) * Math.sqrt(nb) || 1) };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      for (const s of scored) {
        if (s.score < 0.6) continue;
        await supabase.from("link_suggestions").upsert({
          source_url: s.url, target_url: orphan.page_url,
          score: Number(s.score.toFixed(3)),
          reason: "Semantisch verwant + weinig inbound links",
          status: "open",
        }, { onConflict: "source_url,target_url" });
        added++;
      }
    }

    await supabase.from("job_runs").insert({
      job_key: JOB_KEY, status: "success",
      message: `${orphans.length} weespagina's, ${added} suggesties`,
      finished_at: new Date().toISOString(), duration_ms: Date.now() - started,
    });
    return new Response(JSON.stringify({ ok: true, orphans: orphans.length, suggestions: added }), {
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