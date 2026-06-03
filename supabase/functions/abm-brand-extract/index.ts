import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-publish-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// --- contrast helpers (mirror of frontend) ---
function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.trim().replace("#", "");
  const v = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  if (!/^[0-9a-fA-F]{6}$/.test(v)) return null;
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}
function relLum([r, g, b]: [number, number, number]) {
  const f = (c: number) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(a: string, b: string) {
  const ra = hexToRgb(a), rb = hexToRgb(b);
  if (!ra || !rb) return 1;
  const la = relLum(ra), lb = relLum(rb);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}
function isDark(hex: string) {
  const r = hexToRgb(hex); return r ? relLum(r) < 0.5 : true;
}
function normalizeHex(c?: string): string | undefined {
  if (!c || typeof c !== "string") return undefined;
  const t = c.trim();
  if (/^#?[0-9a-fA-F]{3}$/.test(t)) {
    const s = t.replace("#", "");
    return "#" + s.split("").map((x) => x + x).join("").toUpperCase();
  }
  if (/^#?[0-9a-fA-F]{6}$/.test(t)) return "#" + t.replace("#", "").toUpperCase();
  return undefined;
}

async function firecrawlBranding(url: string, key: string) {
  const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      formats: ["branding", "screenshot"],
      onlyMainContent: true,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Firecrawl ${res.status}: ${JSON.stringify(json).slice(0, 300)}`);
  // v2 may wrap in { data: { ... } }
  return json.data || json;
}

async function uploadFromUrl(supabase: any, slug: string, name: string, sourceUrl: string): Promise<string | undefined> {
  try {
    const r = await fetch(sourceUrl);
    if (!r.ok) return undefined;
    const ct = r.headers.get("content-type") || "image/png";
    const ext = ct.includes("svg") ? "svg" : ct.includes("jpeg") ? "jpg" : ct.includes("webp") ? "webp" : "png";
    const bytes = new Uint8Array(await r.arrayBuffer());
    const path = `abm/${slug}/brand-${name}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, bytes, { contentType: ct, upsert: true });
    if (error) return undefined;
    return supabase.storage.from("blog-images").getPublicUrl(path).data.publicUrl;
  } catch { return undefined; }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const expected = Deno.env.get("ABM_PUBLISH_KEY");
  const auth = req.headers.get("authorization") || "";
  const provided = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : (req.headers.get("x-publish-key") || "");
  if (!expected || provided !== expected) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const fcKey = Deno.env.get("FIRECRAWL_API_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!fcKey || !supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: "Server missing env (FIRECRAWL_API_KEY / SUPABASE_*)" }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }

  let body: any;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
  }
  const slug = String(body.slug || "").trim();
  const url = String(body.url || "").trim();
  if (!slug || !url) {
    return new Response(JSON.stringify({ error: "slug and url are required" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const { data: page, error: fetchErr } = await supabase
    .from("abm_pages").select("id, slug, company_name, payload").eq("slug", slug).maybeSingle();
  if (fetchErr || !page) {
    return new Response(JSON.stringify({ error: "Page not found" }), { status: 404, headers: { ...cors, "Content-Type": "application/json" } });
  }

  let scraped: any;
  try { scraped = await firecrawlBranding(url, fcKey); }
  catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 502, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const b = scraped.branding || {};
  const colors = b.colors || {};
  const fonts: Array<{ family: string }> = b.fonts || b.typography?.fontFamilies ? (b.fonts || []) : [];

  // Map Firecrawl branding → our schema
  const primary = normalizeHex(colors.primary) || normalizeHex(colors.accent);
  const accent = normalizeHex(colors.secondary) || normalizeHex(colors.accent) || primary;
  const bg = normalizeHex(colors.background);
  const text = normalizeHex(colors.textPrimary);
  const muted = normalizeHex(colors.textSecondary);
  const headingFamily = b.typography?.fontFamilies?.heading || fonts?.[0]?.family;
  const bodyFamily = b.typography?.fontFamilies?.primary || b.typography?.fontFamilies?.body || fonts?.[1]?.family || fonts?.[0]?.family;

  const newBranding: Record<string, any> = { ...(page.payload?.branding || {}) };
  if (primary) newBranding.primary = primary;
  if (accent) newBranding.accent = accent;
  if (bg) {
    newBranding.bg = bg;
    // derive surface: nudge surface 6% toward opposite luminance
    newBranding.surface = newBranding.surface || (isDark(bg) ? lighten(bg, 0.06) : darken(bg, 0.04));
  }
  if (text) newBranding.text = text;
  if (muted) newBranding.muted = muted;
  if (headingFamily) newBranding.headingFont = headingFamily;
  if (bodyFamily) newBranding.bodyFont = bodyFamily;

  // Upload logo + favicon + screenshot to our bucket so they don't break
  const logoSrc = b.logo || b.images?.logo;
  const screenshotSrc = scraped.screenshot;

  const [logoUploaded, shotUploaded] = await Promise.all([
    logoSrc ? uploadFromUrl(supabase, slug, "logo", logoSrc) : Promise.resolve(undefined),
    screenshotSrc ? uploadFromUrl(supabase, slug, "site", screenshotSrc) : Promise.resolve(undefined),
  ]);
  if (logoUploaded) newBranding.logoLight = logoUploaded;

  // Readability sanity: ensure text contrast on bg ≥ 4.5, else override
  if (newBranding.bg && newBranding.text && contrast(newBranding.text, newBranding.bg) < 4.5) {
    newBranding.text = isDark(newBranding.bg) ? "#F5F7FB" : "#0B1220";
  }
  if (newBranding.bg && newBranding.muted && contrast(newBranding.muted, newBranding.bg) < 3.2) {
    newBranding.muted = isDark(newBranding.bg) ? "#C9D1E0" : "#4B5563";
  }

  const newPayload = {
    ...(page.payload || {}),
    branding: newBranding,
    assets: { ...((page.payload || {}).assets || {}), ...(shotUploaded ? { siteScreenshot: shotUploaded } : {}) },
    sourceUrl: url,
  };

  const { error: updErr } = await supabase.from("abm_pages").update({ payload: newPayload }).eq("id", page.id);
  if (updErr) {
    return new Response(JSON.stringify({ error: updErr.message, branding: newBranding }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify({ ok: true, slug, branding: newBranding, assets: newPayload.assets }), {
    status: 200, headers: { ...cors, "Content-Type": "application/json" },
  });
});

function clamp(n: number) { return Math.max(0, Math.min(255, Math.round(n))); }
function toHex(n: number) { return clamp(n).toString(16).padStart(2, "0"); }
function lighten(hex: string, amt: number) {
  const r = hexToRgb(hex); if (!r) return hex;
  return "#" + r.map((c) => toHex(c + (255 - c) * amt)).join("").toUpperCase();
}
function darken(hex: string, amt: number) {
  const r = hexToRgb(hex); if (!r) return hex;
  return "#" + r.map((c) => toHex(c * (1 - amt))).join("").toUpperCase();
}