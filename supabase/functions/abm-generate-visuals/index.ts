import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-publish-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SECTIONS = ["hero", "observations", "cta"] as const;
type Section = typeof SECTIONS[number];

const STYLE_PROMPT =
  "Editorial flat outline illustration, monochromatic two-tone using the brand color, soft duotone shading, clean vector lines, generous negative space, subtle geometric grid pattern in background, premium B2B aesthetic, no text, no logos, no human faces, no brand names.";

function sectionPrompt(section: Section, ctx: { company: string; sector: string; primary: string }) {
  const base = `${STYLE_PROMPT} Primary brand color: ${ctx.primary}. Context: B2B partner for ${ctx.company} in ${ctx.sector}.`;
  if (section === "hero") return `${base} Abstract scene representing account-based growth and signal-driven pipeline: stylised nodes, flowing data lines, target rings converging.`;
  if (section === "observations") return `${base} Abstract diagram of three observation points being mapped on a market grid, magnifier shapes, soft connecting lines.`;
  return `${base} Abstract handshake-meets-arrow scene representing partnership and growth trajectory, upward composition.`;
}

async function generateImage(prompt: string, apiKey: string): Promise<Uint8Array> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "openai/gpt-image-2",
      prompt,
      quality: "low",
      size: "1536x1024",
      n: 1,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI gateway ${res.status}: ${text.slice(0, 300)}`);
  }
  const json = await res.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) throw new Error("No image data returned");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const expected = Deno.env.get("ABM_PUBLISH_KEY");
  const auth = req.headers.get("authorization") || "";
  const provided = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : (req.headers.get("x-publish-key") || "");
  if (!expected || provided !== expected) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!apiKey || !supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: "Server missing env" }), {
      status: 500, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  let body: any;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const slug = String(body.slug || "").trim();
  if (!slug) {
    return new Response(JSON.stringify({ error: "slug is required" }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
  const requested: Section[] = Array.isArray(body.sections) && body.sections.length
    ? body.sections.filter((s: string) => SECTIONS.includes(s as Section))
    : [...SECTIONS];

  const supabase = createClient(supabaseUrl, serviceKey);
  const { data: page, error: fetchErr } = await supabase
    .from("abm_pages")
    .select("id, slug, company_name, payload")
    .eq("slug", slug)
    .maybeSingle();
  if (fetchErr || !page) {
    return new Response(JSON.stringify({ error: "Page not found" }), {
      status: 404, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const payload = (page.payload || {}) as any;
  const branding = payload.branding || {};
  const primary = branding.primary || "#0B3E91";
  const sector = body.sector || payload.sector || "B2B";

  const assets: Record<string, string> = { ...(payload.assets || {}) };
  const errors: Record<string, string> = {};

  for (const section of requested) {
    try {
      const prompt = sectionPrompt(section, { company: page.company_name, sector, primary });
      const bytes = await generateImage(prompt, apiKey);
      const path = `abm/${slug}/${section}-${Date.now()}.png`;
      const { error: upErr } = await supabase.storage
        .from("blog-images")
        .upload(path, bytes, { contentType: "image/png", upsert: true });
      if (upErr) throw new Error(upErr.message);
      const { data: pub } = supabase.storage.from("blog-images").getPublicUrl(path);
      assets[section] = pub.publicUrl;
    } catch (e) {
      errors[section] = (e as Error).message;
    }
  }

  const newPayload = { ...payload, assets };
  if (!payload.hero?.image && assets.hero) {
    newPayload.hero = { ...(payload.hero || {}), image: assets.hero };
  }

  const { error: updErr } = await supabase
    .from("abm_pages")
    .update({ payload: newPayload })
    .eq("id", page.id);
  if (updErr) {
    return new Response(JSON.stringify({ error: updErr.message, assets }), {
      status: 500, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true, slug, assets, errors }), {
    status: 200, headers: { ...cors, "Content-Type": "application/json" },
  });
});