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

// Relative luminance per WCAG for contrast checks.
function relLuminance(hex: string): number {
  const v = hex.replace("#", "");
  const ch = [v.slice(0, 2), v.slice(2, 4), v.slice(4, 6)].map((c) => {
    const n = parseInt(c, 16) / 255;
    return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}
function contrastRatio(a: string, b: string): number {
  const la = relLuminance(a), lb = relLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}
// Lighten a hex by adjusting HSL lightness to reach the target lightness.
function lightenHex(hex: string, targetL: number): string {
  const hsl = hexToHsl(hex); // "H S% L%"
  const m = hsl.match(/^(\d+) (\d+)% (\d+)%$/);
  if (!m) return hex;
  const h = parseInt(m[1], 10);
  const s = parseInt(m[2], 10);
  const l = Math.min(95, Math.max(parseInt(m[3], 10), targetL));
  // Convert HSL back to hex
  const sN = s / 100, lN = l / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const hh = h / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  let r = 0, g = 0, b = 0;
  if (hh < 1) { r = c; g = x; }
  else if (hh < 2) { r = x; g = c; }
  else if (hh < 3) { g = c; b = x; }
  else if (hh < 4) { g = x; b = c; }
  else if (hh < 5) { r = x; b = c; }
  else { r = c; b = x; }
  const mm = lN - c / 2;
  const toHex = (n: number) => Math.round((n + mm) * 255).toString(16).padStart(2, "0");
  return ("#" + toHex(r) + toHex(g) + toHex(b)).toUpperCase();
}
// Ensure glow color has >=4.5:1 contrast on the dark app background (#0B0B0F).
// If primary is brighter than glow, swap so the readable color becomes the accent.
function ensureReadableOnDark(primary: string, glow: string): { primary: string; glow: string } {
  const BG = "#0B0B0F";
  let p = primary, g = glow;
  if (contrastRatio(p, BG) > contrastRatio(g, BG)) {
    [p, g] = [g, p];
  }
  let tries = 0;
  while (contrastRatio(g, BG) < 4.5 && tries < 6) {
    g = lightenHex(g, parseInt(hexToHsl(g).split(" ")[2], 10) + 10);
    tries++;
  }
  return { primary: p, glow: g };
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
    const readable = ensureReadableOnDark(brand.primary, brand.glow);
    const primaryHex = readable.primary;
    const glowHex = readable.glow;

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