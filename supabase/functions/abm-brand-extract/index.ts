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
      formats: ["branding", "screenshot", "markdown", "summary", "links"],
      onlyMainContent: true,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Firecrawl ${res.status}: ${JSON.stringify(json).slice(0, 300)}`);
  // v2 may wrap in { data: { ... } }
  return json.data || json;
}

function absUrl(src: string, base: string): string | undefined {
  try { return new URL(src, base).toString(); } catch { return undefined; }
}

function harvestImagesFromMarkdown(md: string, baseUrl: string): string[] {
  if (!md) return [];
  const out = new Set<string>();
  const re = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md))) {
    const u = absUrl(m[1], baseUrl);
    if (u && /\.(jpe?g|png|webp|avif)(\?|$)/i.test(u) && !/(icon|favicon|logo|sprite|pixel|tracking|1x1)/i.test(u)) {
      out.add(u);
    }
  }
  return [...out].slice(0, 8);
}

function harvestTextFromMarkdown(md: string): { pitch?: string; bullets: string[]; tagline?: string } {
  if (!md) return { bullets: [] };
  const lines = md.split("\n").map((l) => l.trim()).filter(Boolean);
  const skip = /^(home|menu|cookies?|privacy|©|contact|inloggen|login|nieuws|blog|search|zoek)/i;
  const hasResidue = (s: string) => /https?:\/\/|]\(|!\[|\\\\|\|/.test(s);
  // Pitch: first non-heading paragraph 60–260 chars
  let pitch: string | undefined;
  for (const l of lines) {
    if (l.startsWith("#") || l.startsWith("!") || l.startsWith("|") || l.startsWith("-")) continue;
    const c = cleanInline(l);
    if (!c || skip.test(c) || hasResidue(c)) continue;
    if (c.length >= 60 && c.length <= 280) { pitch = c; break; }
  }
  // Bullets: short H2/H3 titles or list items 8–90 chars
  const bullets: string[] = [];
  const seen = new Set<string>();
  for (const l of lines) {
    if (bullets.length >= 5) break;
    const h = l.match(/^#{2,3}\s+(.+)/);
    const bul = l.match(/^[-*]\s+(.+)/);
    const raw = (h?.[1] || bul?.[1] || "").trim();
    if (!raw) continue;
    const txt = cleanInline(raw);
    if (!txt) continue;
    if (txt.length < 8 || txt.length > 90) continue;
    if (skip.test(txt) || hasResidue(txt)) continue;
    const key = txt.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    bullets.push(txt);
  }
  // Tagline: first heading
  let tagline: string | undefined;
  for (const l of lines) {
    const h = l.match(/^#\s+(.+)/);
    if (!h) continue;
    const c = cleanInline(h[1]);
    if (c && c.length <= 140 && !hasResidue(c)) { tagline = c; break; }
  }
  return { pitch, bullets, tagline };
}

function cleanInline(s: string): string {
  if (!s) return "";
  let t = s;
  // Remove image tags ![alt](url) (and stray ![alt or ![..\\)
  t = t.replace(/!\[[^\]]*\]\([^)]*\)/g, "");
  t = t.replace(/!\[[^\]]*\]?/g, "");
  // Proper links [text](url) -> text
  t = t.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
  // Stray closing link fragments like "text](https://...)"
  t = t.replace(/\]\([^)]*\)/g, "");
  // Drop remaining standalone URLs
  t = t.replace(/https?:\/\/\S+/g, "");
  // Bold/italic/code markers
  t = t.replace(/\*\*|__|`+/g, "");
  // Backslash escapes
  t = t.replace(/\\+/g, "");
  // Stray brackets
  t = t.replace(/[\[\]]/g, "");
  // Collapse whitespace
  t = t.replace(/\s+/g, " ").trim();
  return t;
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

  const fcKey = Deno.env.get("FIRECRAWL_API_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!fcKey || !supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: "Server missing env (FIRECRAWL_API_KEY / SUPABASE_*)" }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }

  // Auth: accept ABM_PUBLISH_KEY OR an admin JWT
  const expected = Deno.env.get("ABM_PUBLISH_KEY");
  const authHeader = req.headers.get("authorization") || "";
  const bearer = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7).trim() : "";
  const xKey = req.headers.get("x-publish-key") || "";
  let authorized = !!expected && (bearer === expected || xKey === expected);
  if (!authorized && bearer) {
    try {
      const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY") || serviceKey, {
        global: { headers: { Authorization: `Bearer ${bearer}` } },
      });
      const { data: u } = await userClient.auth.getUser();
      if (u?.user?.id) {
        const admin = createClient(supabaseUrl, serviceKey);
        const { data: isAdmin } = await admin.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
        if (isAdmin === true) authorized = true;
      }
    } catch { /* ignore */ }
  }
  if (!authorized) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...cors, "Content-Type": "application/json" } });
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

  // ---- Persoonlijke content + galerij ----
  const md: string = scraped.markdown || scraped.content || "";
  const meta = scraped.metadata || {};
  const baseUrl = meta.sourceURL || url;
  const summary: string | undefined = typeof scraped.summary === "string" ? scraped.summary : undefined;
  const harvested = harvestTextFromMarkdown(md);

  const rawImages = harvestImagesFromMarkdown(md, baseUrl);
  // Add OG image from metadata if present
  const ogSrc: string | undefined = meta.ogImage || meta["og:image"] || meta.image;
  const galleryQueue = [...rawImages];
  if (ogSrc) {
    const abs = absUrl(ogSrc, baseUrl);
    if (abs && !galleryQueue.includes(abs)) galleryQueue.unshift(abs);
  }

  const gallery: string[] = [];
  let ogUploaded: string | undefined;
  for (let i = 0; i < galleryQueue.length && gallery.length < 6; i++) {
    const src = galleryQueue[i];
    const up = await uploadFromUrl(supabase, slug, `g${i}`, src);
    if (up) {
      gallery.push(up);
      if (src === absUrl(ogSrc || "", baseUrl)) ogUploaded = up;
    }
  }

  const personal: Record<string, any> = {
    siteName: meta.title || page.company_name,
    siteClaim: (meta.description || "").slice(0, 160) || undefined,
    tagline: harvested.tagline,
    pitch: harvested.pitch || summary,
    bullets: harvested.bullets,
    gallery,
    ogImage: ogUploaded || gallery[0],
  };

  const newPayload = {
    ...(page.payload || {}),
    branding: newBranding,
    assets: { ...((page.payload || {}).assets || {}), ...(shotUploaded ? { siteScreenshot: shotUploaded } : {}) },
    personal: { ...((page.payload || {}).personal || {}), ...personal },
    sourceUrl: url,
  };

  const { error: updErr } = await supabase.from("abm_pages").update({ payload: newPayload }).eq("id", page.id);
  if (updErr) {
    return new Response(JSON.stringify({ error: updErr.message, branding: newBranding }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify({ ok: true, slug, branding: newBranding, assets: newPayload.assets, personal }), {
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