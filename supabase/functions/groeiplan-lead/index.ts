import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendTemplateEmail } from "../_shared/transactional-email-templates/send-email.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const NOTIFY_TO = "peter.grisel@rebelforce.nl";

// Zelfde volgorde en titels als src/data/groeiplan.ts
const VAKKEN: [string, string][] = [
  ["doelmarkt", "01 Mijn doelmarkt"],
  ["boodschap", "02 Mijn boodschap"],
  ["kanalen", "03 Mijn kanalen"],
  ["vangmechanisme", "04 Mijn vangmechanisme"],
  ["opwarm", "05 Mijn opwarmsysteem"],
  ["conversie", "06 Mijn conversiestrategie"],
  ["ervaring", "07 Mijn klantervaring"],
  ["waarde", "08 Mijn klantwaarde"],
  ["referral", "09 Mijn referralmotor"],
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase().slice(0, 255);
    const name = body.name ? String(body.name).trim().slice(0, 100) : null;
    const company = body.company ? String(body.company).trim().slice(0, 100) : null;
    const mode = body.mode === "klant" ? "klant" : "visitor";
    const sourceUrl = body.source_url ? String(body.source_url).slice(0, 500) : null;
    const format = body.format === "md" ? "md" : "pdf";
    const rawFields = body.fields && typeof body.fields === "object" ? body.fields : {};
    const fields: Record<string, string> = Object.fromEntries(
      VAKKEN.map(([id]) => [id, String(rawFields[id] ?? "").trim().slice(0, 4000)]),
    );

    if (!email || (mode === "visitor" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
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
      .from("groeiplan_submissions")
      .insert({ email, name, company, mode, fields, source_url: sourceUrl })
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("insert groeiplan_submissions failed:", error);
      return new Response(JSON.stringify({ error: "Opslaan mislukt" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const submissionId = inserted?.id ?? Date.now();
    const vakken = VAKKEN.map(([id, titel]) => ({ titel, tekst: fields[id] }));

    const logSend = async (status: string, errorMessage?: string) => {
      const { error: logError } = await supabase.from("email_send_log").insert({
        message_id: `groeiplan-${submissionId}`,
        template_name: "groeiplan-lead",
        recipient_email: NOTIFY_TO,
        status,
        error_message: errorMessage ?? null,
      });
      if (logError) console.error("email_send_log insert failed:", logError);
    };

    try {
      const result = await sendTemplateEmail("groeiplan-lead", NOTIFY_TO, {
        templateData: { name, email, company, mode, format, vakken, sourceUrl },
        idempotencyKey: `groeiplan-lead-${submissionId}`,
        replyTo: mode === "visitor" ? email : undefined,
      });
      await logSend(result.sent ? "sent" : "suppressed");
    } catch (mailError) {
      console.error("send groeiplan-lead email failed:", mailError);
      await logSend("failed", mailError instanceof Error ? mailError.message : String(mailError));
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("groeiplan-lead error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
