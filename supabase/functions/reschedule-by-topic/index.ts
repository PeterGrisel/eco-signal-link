import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { topic_id } = await req.json();
    if (!topic_id) throw new Error("topic_id is required");

    const { data: items, error } = await supabase
      .from("content_queue")
      .select("id, topic_id, scheduled_date, created_at")
      .eq("status", "approved")
      .not("scheduled_date", "is", null);
    if (error) throw error;

    const queue = items || [];
    const focus = queue
      .filter((i) => i.topic_id === topic_id)
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
    const others = queue
      .filter((i) => i.topic_id !== topic_id)
      .sort((a, b) => a.created_at.localeCompare(b.created_at));

    const dates = queue
      .map((i) => i.scheduled_date as string)
      .sort();

    const reordered = [...focus, ...others];
    const updates: { id: string; scheduled_date: string }[] = [];
    for (let i = 0; i < reordered.length; i++) {
      const item = reordered[i];
      const newDate = dates[i];
      if (item.scheduled_date !== newDate) {
        updates.push({ id: item.id, scheduled_date: newDate });
      }
    }

    for (const u of updates) {
      const { error: updErr } = await supabase
        .from("content_queue")
        .update({ scheduled_date: u.scheduled_date })
        .eq("id", u.id);
      if (updErr) throw updErr;
    }

    return new Response(
      JSON.stringify({
        focus_count: focus.length,
        other_count: others.length,
        dates_reassigned: updates.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Onbekende fout" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
