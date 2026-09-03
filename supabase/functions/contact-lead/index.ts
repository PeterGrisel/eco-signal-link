import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const NOTIFY_TO = "peter.grisel@rebelforce.nl";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const name = String(body.name ?? "").trim().slice(0, 100);
    const email = String(body.email ?? "").trim().toLowerCase().slice(0, 255);
    const company = body.company ? String(body.company).trim().slice(0, 100) : null;
    const phone = body.phone ? String(body.phone).trim().slice(0, 20) : null;
    const message = String(body.message ?? "").trim().slice(0, 2000);
    const sessionId = body.session_id ? String(body.session_id) : null;
    const pageUrl = body.page_url ? String(body.page_url) : null;

    if (!name || !message || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Ongeldige invoer" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: inserted, error } = await supabase
      .from("contact_submissions")
      .insert({ name, email, company, phone, message, session_id: sessionId })
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("insert contact_submissions failed:", error);
      return new Response(JSON.stringify({ error: "Opslaan mislukt" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const submissionId = inserted?.id ?? Date.now();

    const logSend = async (status: string, errorMessage?: string) => {
      const { error: logError } = await supabase.from("email_send_log").insert({
        message_id: `contact-${submissionId}`,
        template_name: "contact-lead",
        recipient_email: NOTIFY_TO,
        status,
        error_message: errorMessage ?? null,
      });
      if (logError) console.error("email_send_log insert failed:", logError);
    };

    try {
      const result = await sendTemplateEmail("contact-lead", NOTIFY_TO, {
        templateData: { name, email, company, phone, message, pageUrl },
        idempotencyKey: `contact-lead-${submissionId}`,
      });
      await logSend(result.sent ? "sent" : "suppressed");
    } catch (mailError) {
      console.error("send contact-lead email failed:", mailError);
      await logSend("failed", mailError instanceof Error ? mailError.message : String(mailError));
    }


    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("contact-lead error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
