// One-off function: apply backdated publish to specified drafts.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const body = await req.json();
    const updates = body.updates as Array<{ id: string; content: string; publishAt: string }>;
    const archive = body.archive as string[] | undefined;
    const results: any[] = [];
    for (const u of updates) {
      const { error } = await supabase.from("blog_posts").update({
        content: u.content,
        status: "published",
        published_at: u.publishAt,
        updated_at: u.publishAt,
      }).eq("id", u.id);
      results.push({ id: u.id, ok: !error, error: error?.message });
    }
    if (archive?.length) {
      const { error } = await supabase.from("blog_posts").update({ status: "archived" }).in("id", archive);
      results.push({ archive_ok: !error, error: error?.message });
    }
    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
