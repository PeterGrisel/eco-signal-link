import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = Deno.env.get("PUBLIC_SITE_URL") || "https://b2bgroeimachine.io";

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

    const html = `<!DOCTYPE html><html><body style="font-family:Inter,Arial,sans-serif;background:#fff;color:#121212;padding:24px;">
      <div style="max-width:520px;margin:0 auto;border:1px solid #eee;border-radius:12px;padding:32px;">
        <div style="font-family:'Space Grotesk',Arial,sans-serif;font-weight:700;font-size:18px;">B2B<span style="color:#E8945A">GroeiMachine</span></div>
        <h1 style="font-family:'Space Grotesk',Arial,sans-serif;font-weight:700;font-size:22px;margin:18px 0 6px;">Bevestig je aanvraag</h1>
        <p style="color:#555;line-height:1.6;margin:0 0 18px;">Klik op de knop om <strong>${item.title}</strong> te ontvangen.</p>
        <p style="margin:24px 0;"><a href="${confirmUrl}" style="background:#E8945A;color:#121212;text-decoration:none;padding:12px 20px;border-radius:8px;font-family:'Space Grotesk',Arial,sans-serif;font-weight:600;display:inline-block;">Bevestig en open template</a></p>
        <p style="color:#888;font-size:12px;line-height:1.5;">Heb je deze niet aangevraagd? Negeer dan deze mail.</p>
      </div>
    </body></html>`;

    await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        to: cleanEmail,
        subject: `Bevestig: ${item.title}`,
        html,
        label: "give-away-confirm",
        message_id: `give-${lead.id}`,
        from: "B2BGroeiMachine <hi@notify.b2bgroeimachine.io>",
      },
    });

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