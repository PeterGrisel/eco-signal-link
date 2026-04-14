import { createClient } from "npm:@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = new URL(req.url);
  const env = (url.searchParams.get('env') || 'sandbox') as StripeEnv;

  try {
    const event = await verifyWebhook(req, env);
    console.log("Received event:", event.type, "env:", env);

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;
      default:
        console.log("Unhandled event:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Webhook error", { status: 400 });
  }
});

async function handleCheckoutCompleted(session: any) {
  const userId = session.metadata?.userId;
  const journeyId = session.metadata?.journeyId;

  // Handle journey payment (upfront €97)
  if (userId) {
    // Find the user's latest journey and mark it paid
    const { data: journeys } = await supabase
      .from("journeys")
      .select("id")
      .eq("user_id", userId)
      .order("started_at", { ascending: false })
      .limit(1);

    if (journeys?.[0]) {
      await supabase
        .from("journeys")
        .update({ paid: true })
        .eq("id", journeys[0].id);

      await supabase
        .from("blueprints")
        .upsert({
          journey_id: journeys[0].id,
          paid: true,
          stripe_session_id: session.id,
        }, { onConflict: "journey_id" });

      console.log("Journey marked as paid for user:", userId);
    }
  }

  // Legacy: handle journeyId in metadata (blueprint-only purchase)
  if (journeyId && !userId) {
    await supabase
      .from("blueprints")
      .update({
        paid: true,
        stripe_session_id: session.id,
      })
      .eq("journey_id", journeyId);

    console.log("Blueprint marked as paid for journey:", journeyId);
  }
}
