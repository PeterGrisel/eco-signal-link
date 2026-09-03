import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendTemplateEmail } from "../_shared/transactional-email-templates/send-email.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = Deno.env.get("PUBLIC_SITE_URL") || "https://www.b2bgroeimachine.io";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { bucket_slug, item_slug, email, name, utm } = await req.json();
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanEmail.includes("@") || cleanEmail.length > 254) throw new Error("Ongeldig e-mailadres");
    if (!bucket_slug || !item_slug) throw new Error("bucket_slug en item_slug verplicht");

    const { data: bucket } = await supabase.from("content_buckets").select("id,name,cta_text").eq("slug", bucket_slug).maybeSingle();
    if (!bucket) throw new Error("Bucket niet gevonden");

    const { data: item } = await supabase
      .from("content_bucket_items")
      .select("id,slug,title")
      .eq("bucket_id", bucket.id)
      .eq("slug", item_slug)
      .eq("status", "published")
      .maybeSingle();
    if (!item) throw new Error("Item niet gevonden");

    const ipHash = req.headers.get("x-forwarded-for") || "";
    const userAgent = req.headers.get("user-agent") || "";

    const { data: lead, error: insErr } = await supabase
      .from("content_bucket_leads")
      .insert({
        bucket_id: bucket.id,
        item_id: item.id,
        email: cleanEmail,
        name: name || null,
        utm: utm || null,
        ip_hash: ipHash,
        user_agent: userAgent,
      })
      .select("id,confirm_token")
      .single();
    if (insErr) throw insErr;

    const confirmUrl = `${SITE_URL}/give-aways/${item.slug}?u=1&t=${lead.confirm_token}`;

    const logSend = async (status: string, errorMessage?: string) => {
      const { error: logError } = await supabase.from("email_send_log").insert({
        message_id: `give-${lead.id}`,
        template_name: "give-away-confirm",
        recipient_email: cleanEmail,
        status,
        error_message: errorMessage ?? null,
      });
      if (logError) console.error("email_send_log insert failed:", logError);
    };

    try {
      const result = await sendTemplateEmail("give-away-confirm", cleanEmail, {
        templateData: { title: item.title, confirmUrl },
        idempotencyKey: `give-away-confirm-${lead.id}`,
      });
      await logSend(result.sent ? "sent" : "suppressed");
    } catch (mailError) {
      console.error("send give-away-confirm email failed:", mailError);
      await logSend("failed", mailError instanceof Error ? mailError.message : String(mailError));
    }


    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Onbekende fout" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});