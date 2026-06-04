// abm-generate: one-shot client page generator.
// Input (JSON): { pdfBase64, filename }
// Steps: derive companyName from filename -> upload PDF -> AI brand colors -> AI hero copy -> upsert abm_pages.
function companyFromFilename(filename: string): string {
  const base = (filename || "").replace(/\.pdf$/i, "");
  // Strip common suffixes like "playbook", "flyer", "abm", "voor", separators
  const cleaned = base
    .replace(/[_\-]+/g, " ")
    .replace(/\b(playbook|flyer|abm|voor|deck|presentation|presentatie|brochure|onepager|one[- ]?pager)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return base.trim() || "Klant";
  // Capitalize first letter of each word
  return cleaned.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

function slugify(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

function hexToHsl(hex: string): string {
  const m = hex.replace("#", "");
  const v = m.length === 3 ? m.split("").map(c => c + c).join("") : m;
  const r = parseInt(v.slice(0, 2), 16) / 255;
  const g = parseInt(v.slice(2, 4), 16) / 255;
  const b = parseInt(v.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h *= 60;
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function isValidHex(x: unknown): x is string {
  return typeof x === "string" && /^#?[0-9a-fA-F]{6}$/.test(x.trim());
}
function normHex(x: string): string {
  const v = x.trim().replace(/^#/, "");
  return "#" + v.toUpperCase();
}

function extractDomain(website?: string): string | null {
  if (!website) return null;
  try {
    const u = new URL(/^https?:\/\//i.test(website) ? website : `https://${website}`);
    return u.hostname.replace(/^www\./, "");
  } catch { return null; }
}

async function tryLogo(domain: string): Promise<string | null> {
  const url = `https://logo.clearbit.com/${domain}`;
  try {
    const res = await fetch(url, { method: "HEAD" });
    if (res.ok) return url;
  } catch { /* ignore */ }
  return null;
}

async function callAI(messages: any[], expectJson = true): Promise<any> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages,
      ...(expectJson ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`AI gateway ${res.status}: ${t.slice(0, 300)}`);
  }
  const json = await res.json();
  const txt = json.choices?.[0]?.message?.content ?? "";
  if (!expectJson) return txt;
  try { return JSON.parse(txt); } catch { return null; }
}

async function generateBrand(companyName: string, website: string | null): Promise<{ primary: string; glow: string }> {
  const out = await callAI([
    {
      role: "system",
      content: "U bent een brand-designer. Geef altijd alleen geldige JSON terug.",
    },
    {
      role: "user",
      content: `Bepaal de huisstijlkleuren voor ${companyName}${website ? ` (${website})` : ""}. ` +
        `Geef twee kleuren: een primaire (donker/diep) en een glow-accent (helderder, complementair). ` +
        `Geef ALLEEN JSON: {"primary_hex":"#RRGGBB","glow_hex":"#RRGGBB"}. Geen toelichting.`,
    },
  ]);
  const fallback = { primary: "#0F4C75", glow: "#3282B8" };
  if (!out || !isValidHex(out.primary_hex) || !isValidHex(out.glow_hex)) return fallback;
  return { primary: normHex(out.primary_hex), glow: normHex(out.glow_hex) };
}

async function generateCopy(companyName: string, website: string | null): Promise<{ headline: string; subline: string; intro: string }> {
  const out = await callAI([
    {
      role: "system",
      content: "U schrijft Nederlandse B2B-copy op B1-niveau. Korte zinnen, maximaal 12 woorden. Spreek met 'u/uw'. Geen em-dash. Alleen JSON terug.",
    },
    {
      role: "user",
      content: `Schrijf hero-copy voor de persoonlijke playbook-pagina van ${companyName}${website ? ` (${website})` : ""}.\n` +
        `Format: {"headline":"...","accent":"...","intro":"..."}\n` +
        `- headline: max 5 woorden, neutraal (bijv. "Slimmer werken door").\n` +
        `- accent: max 7 woorden, prikkelend vervolg op headline.\n` +
        `- intro: 1 zin van max 20 woorden, leg uit wat de klant in dit playbook vindt.`,
    },
  ]);
  const fallback = {
    headline: "Slimmer werken door",
    subline: "automatiseren van handmatige acties.",
    intro: `Persoonlijk Market Activation Playbook voor ${companyName}. Onze analyse, aanpak en eerste plan.`,
  };
  if (!out) return fallback;
  return {
    headline: typeof out.headline === "string" ? out.headline : fallback.headline,
    subline: typeof out.accent === "string" ? out.accent : fallback.subline,
    intro: typeof out.intro === "string" ? out.intro : fallback.intro,
  };
}

function b64ToBytes(b64: string): Uint8Array {
  const clean = b64.replace(/^data:[^,]+,/, "");
  const bin = atob(clean);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    if (!body.pdfBase64) {
      return new Response(JSON.stringify({ error: "pdfBase64 is verplicht" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const filename = (body.filename || "").toString();
    const companyName = companyFromFilename(filename);
    if (!companyName) {
      return new Response(JSON.stringify({ error: "Kon bedrijfsnaam niet afleiden uit bestandsnaam" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const slug = slugify(companyName);
    if (!slug) {
      return new Response(JSON.stringify({ error: "Kon geen geldige slug afleiden" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const website: string | null = null;
    const domain: string | null = null;

    const supa = createClient(SUPABASE_URL, SERVICE_ROLE);

    // 1. Upload PDF
    const pdfBytes = b64ToBytes(body.pdfBase64);
    const pdfPath = `${slug}/playbook.pdf`;
    const { error: upErr } = await supa.storage.from("abm-assets").upload(pdfPath, pdfBytes, {
      contentType: "application/pdf",
      upsert: true,
    });
    if (upErr) throw new Error(`PDF upload mislukt: ${upErr.message}`);
    const pdfUrl = `${SUPABASE_URL}/storage/v1/object/public/abm-assets/${pdfPath}`;

    // 2. Logo
    const logoUrl = domain ? await tryLogo(domain) : null;

    // 3. Brand colors (AI)
    const brand = await generateBrand(companyName, website);
    const primaryHex = brand.primary;
    const glowHex = brand.glow;

    // 4. Hero copy
    const copy = await generateCopy(companyName, website);

    // 5. Upsert
    const payload = {
      slug,
      company_name: companyName,
      website,
      pdf_url: pdfUrl,
      logo_url: logoUrl,
      brand_primary_hex: primaryHex,
      brand_glow_hex: glowHex,
      brand_primary_hsl: hexToHsl(primaryHex),
      brand_glow_hsl: hexToHsl(glowHex),
      hero_headline: copy.headline,
      hero_subline: copy.subline,
      intro: copy.intro,
      status: "live",
      expires_at: new Date(Date.now() + 2 * 365 * 24 * 3600 * 1000).toISOString(),
      payload: {},
    };

    const { error: dbErr } = await supa.from("abm_pages").upsert(payload, { onConflict: "slug" });
    if (dbErr) throw new Error(`Database upsert mislukt: ${dbErr.message}`);

    return new Response(JSON.stringify({
      ok: true,
      slug,
      url: `/voor/${slug}`,
      pdf_url: pdfUrl,
      logo_url: logoUrl,
      brand_primary_hex: primaryHex,
      brand_glow_hex: glowHex,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("abm-generate error:", msg);
    return new Response(JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});