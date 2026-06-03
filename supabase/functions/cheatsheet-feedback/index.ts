import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const url = new URL(req.url);

    if (req.method === "GET") {
      const slug = url.searchParams.get("slug");
      const sessionId = url.searchParams.get("session_id");
      if (!slug) {
        return new Response(JSON.stringify({ error: "slug required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: all } = await supabase
        .from("cheatsheet_feedback")
        .select("helpful, rating, session_id")
        .eq("cheatsheet_slug", slug);

      const rows = all ?? [];
      const totalHelpful = rows.filter((r) => r.helpful).length;
      const rated = rows.filter((r) => r.rating != null);
      const avgRating = rated.length
        ? rated.reduce((s, r) => s + (r.rating ?? 0), 0) / rated.length
        : 0;
      const mine = sessionId ? rows.find((r) => r.session_id === sessionId) : null;

      return new Response(
        JSON.stringify({
          totalHelpful,
          totalRatings: rated.length,
          avgRating,
          mine: mine ? { helpful: mine.helpful, rating: mine.rating } : null,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    const body = await req.json();
    const slug = String(body.slug ?? "").slice(0, 200);
    const sessionId = String(body.session_id ?? "").slice(0, 100);
    const helpful = typeof body.helpful === "boolean" ? body.helpful : null;
    const rating =
      typeof body.rating === "number" && body.rating >= 1 && body.rating <= 5
        ? Math.round(body.rating)
        : null;

    if (!slug || !sessionId) {
      return new Response(JSON.stringify({ error: "slug and session_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload: Record<string, unknown> = {
      cheatsheet_slug: slug,
      session_id: sessionId,
    };
    if (helpful !== null) payload.helpful = helpful;
    if (rating !== null) payload.rating = rating;

    const { error } = await supabase
      .from("cheatsheet_feedback")
      .upsert(payload, { onConflict: "cheatsheet_slug,session_id" });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});