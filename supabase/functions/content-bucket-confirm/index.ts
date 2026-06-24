import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const url = new URL(req.url);
    const token = url.searchParams.get("token") || (await req.json().catch(() => ({})))?.token;
    if (!token) throw new Error("token verplicht");

    const { data: lead, error } = await supabase
      .from("content_bucket_leads")
      .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
      .eq("confirm_token", token)
      .eq("status", "pending")
      .select("id,email,item_id")
      .maybeSingle();
    if (error) throw error;
    if (!lead) return new Response(JSON.stringify({ ok: true, already: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

    // Optional delivery mail with deep-link
    if (lead.item_id) {
      const { data: it } = await supabase.from("content_bucket_items").select("slug,title").eq("id", lead.item_id).maybeSingle();
      if (it) {
        const link = `${Deno.env.get("PUBLIC_SITE_URL") || "https://b2bgroeimachine.io"}/give-aways/${it.slug}?u=1`;
        await supabase.rpc("enqueue_email", {
          queue_name: "transactional_emails",
          payload: {
            to: lead.email,
            subject: `${it.title} — open en print`,
            label: "give-away-delivery",
            message_id: `give-deliver-${lead.id}`,
            from: "B2BGroeiMachine <hi@notify.b2bgroeimachine.io>",
            html: `<!DOCTYPE html><html><body style="font-family:Inter,Arial,sans-serif;background:#fff;color:#121212;padding:24px;">
              <div style="max-width:520px;margin:0 auto;border:1px solid #eee;border-radius:12px;padding:32px;">
                <div style="font-family:'Space Grotesk',Arial,sans-serif;font-weight:700;font-size:18px;">B2B<span style="color:#E8945A">GroeiMachine</span></div>
                <h1 style="font-family:'Space Grotesk',Arial,sans-serif;font-weight:700;font-size:22px;margin:18px 0 6px;">${it.title}</h1>
                <p style="color:#555;line-height:1.6;margin:0 0 18px;">Open de template hieronder. Met "Print / PDF" maak je er direct een A4 van.</p>
                <p style="margin:24px 0;"><a href="${link}" style="background:#E8945A;color:#121212;text-decoration:none;padding:12px 20px;border-radius:8px;font-family:'Space Grotesk',Arial,sans-serif;font-weight:600;display:inline-block;">Open template</a></p>
              </div>
            </body></html>`,
          },
        });
        await supabase.from("content_bucket_leads").update({ delivered_at: new Date().toISOString() }).eq("id", lead.id);
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Onbekende fout" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});