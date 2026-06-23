import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SLACK_GATEWAY = "https://connector-gateway.lovable.dev/slack/api";

async function postToSlack(text: string, blocks: any[]) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const SLACK_API_KEY = Deno.env.get("SLACK_API_KEY");
  const channel = Deno.env.get("SLACK_REPORT_CHANNEL");
  if (!LOVABLE_API_KEY || !SLACK_API_KEY || !channel) {
    console.warn("Slack not fully configured; skipping notification");
    return;
  }
  const res = await fetch(`${SLACK_GATEWAY}/chat.postMessage`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": SLACK_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel,
      text,
      blocks,
      username: "B2BGM Lead Capture",
      icon_emoji: ":inbox_tray:",
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!data.ok) console.error("Slack postMessage failed:", data);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    const source = String(body.source ?? "hoe-het-werkt-hero");
    const sessionId = body.session_id ? String(body.session_id) : null;
    const pageUrl = body.page_url ? String(body.page_url) : null;
    const userAgent = req.headers.get("user-agent") ?? null;
    const referer = req.headers.get("referer") ?? null;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const name = email.split("@")[0] || "lead";
    const message = `Lead via ${source}${pageUrl ? ` (${pageUrl})` : ""}`;

    const { error } = await supabase.from("contact_submissions").insert({
      name,
      email,
      message,
      session_id: sessionId,
    });
    if (error) console.error("insert contact_submissions failed:", error);

    await postToSlack(
      `Nieuwe lead: ${email}`,
      [
        {
          type: "header",
          text: { type: "plain_text", text: "📥 Nieuwe lead" },
        },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*E-mail:*\n${email}` },
            { type: "mrkdwn", text: `*Bron:*\n${source}` },
          ],
        },
        {
          type: "context",
          elements: [
            { type: "mrkdwn", text: `Pagina: ${pageUrl ?? referer ?? "—"}` },
            { type: "mrkdwn", text: `UA: ${userAgent ?? "—"}` },
          ],
        },
      ],
    );

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("hhw-lead error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});