import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { sendTemplateEmail } from "../_shared/transactional-email-templates/send-email.ts";
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
        const link = `${Deno.env.get("PUBLIC_SITE_URL") || "https://www.b2bgroeimachine.io"}/give-aways/${it.slug}?u=1`;

        const logSend = async (status: string, errorMessage?: string) => {
          const { error: logError } = await supabase.from("email_send_log").insert({
            message_id: `give-deliver-${lead.id}`,
            template_name: "give-away-delivery",
            recipient_email: lead.email,
            status,
            error_message: errorMessage ?? null,
          });
          if (logError) console.error("email_send_log insert failed:", logError);
        };

        try {
          const result = await sendTemplateEmail("give-away-delivery", lead.email, {
            templateData: { title: it.title, link },
            idempotencyKey: `give-away-delivery-${lead.id}`,
          });
          await logSend(result.sent ? "sent" : "suppressed");
        } catch (mailError) {
          console.error("send give-away-delivery email failed:", mailError);
          await logSend("failed", mailError instanceof Error ? mailError.message : String(mailError));
        }

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