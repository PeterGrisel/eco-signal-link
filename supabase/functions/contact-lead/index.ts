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

    const html = `<!doctype html><html><body style="background:#121212;padding:24px;font-family:Arial,sans-serif;color:#eee;">
      <div style="max-width:560px;margin:0 auto;background:#1b1b1b;border:1px solid #2a2a2a;border-radius:12px;padding:24px;">
        <h2 style="color:#E8945A;margin:0 0 16px;">Nieuwe lead via /contact</h2>
        <p style="margin:4px 0;"><strong>Naam:</strong> ${esc(name)}</p>
        <p style="margin:4px 0;"><strong>E-mail:</strong> ${esc(email)}</p>
        <p style="margin:4px 0;"><strong>Bedrijf:</strong> ${esc(company ?? "—")}</p>
        <p style="margin:4px 0;"><strong>Telefoon:</strong> ${esc(phone ?? "—")}</p>
        <p style="margin:16px 0 4px;"><strong>Bericht:</strong></p>
        <p style="white-space:pre-wrap;margin:0;">${esc(message)}</p>
        <p style="color:#888;font-size:12px;margin-top:20px;">Pagina: ${esc(pageUrl ?? "—")}</p>
      </div>
    </body></html>`;

    const { error: mailError } = await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        to: NOTIFY_TO,
        subject: `Nieuwe lead: ${name}${company ? ` (${company})` : ""}`,
        html,
        label: "contact-lead",
        message_id: `contact-${inserted?.id ?? Date.now()}`,
        from: "B2BGroeiMachine <hi@notify.b2bgroeimachine.io>",
      },
    });
    if (mailError) console.error("enqueue_email failed:", mailError);

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
