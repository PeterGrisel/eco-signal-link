// og-image: dynamic 1200x630 Open Graph image for /voor/:slug client pages.
// Renders SVG with brand colors + company name, converts to PNG via resvg-wasm.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { initWasm, Resvg } from "https://esm.sh/@resvg/resvg-wasm@2.6.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

let wasmReady: Promise<void> | null = null;
async function ensureWasm() {
  if (!wasmReady) {
    wasmReady = (async () => {
      const res = await fetch("https://esm.sh/@resvg/resvg-wasm@2.6.2/index_bg.wasm");
      const buf = await res.arrayBuffer();
      await initWasm(buf);
    })();
  }
  return wasmReady;
}

let fontBuf: Uint8Array | null = null;
let fontBoldBuf: Uint8Array | null = null;
async function ensureFonts() {
  if (!fontBuf) {
    const r = await fetch("https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2");
    // resvg accepts TTF/OTF; fetch a TTF instead
    const ttf = await fetch("https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Regular.otf");
    fontBuf = new Uint8Array(await ttf.arrayBuffer());
    const ttfB = await fetch("https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Bold.otf");
    fontBoldBuf = new Uint8Array(await ttfB.arrayBuffer());
    void r; // unused
  }
  return { regular: fontBuf!, bold: fontBoldBuf! };
}

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;",
  }[c]!));
}

function buildSvg(opts: {
  company: string;
  headline: string;
  subline: string;
  primary: string;
  glow: string;
}): string {
  const { company, headline, subline, primary, glow } = opts;
  const title = escapeXml(`${company} × B2BGroeiMachine`);
  const sub = escapeXml(`${headline} ${subline}`).slice(0, 110);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B0B0F"/>
      <stop offset="100%" stop-color="#15151B"/>
    </linearGradient>
    <radialGradient id="g1" cx="0.15" cy="0.2" r="0.6">
      <stop offset="0%" stop-color="${primary}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${primary}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="0.9" cy="0.85" r="0.6">
      <stop offset="0%" stop-color="${glow}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#g1)"/>
  <rect width="1200" height="630" fill="url(#g2)"/>
  <text x="80" y="120" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="600" fill="${glow}" letter-spacing="4">MARKET ACTIVATION PLAYBOOK</text>
  <text x="80" y="280" font-family="Helvetica, Arial, sans-serif" font-size="84" font-weight="800" fill="#FFFFFF">${title}</text>
  <text x="80" y="360" font-family="Helvetica, Arial, sans-serif" font-size="32" font-weight="400" fill="#FFFFFF" opacity="0.85">${sub}</text>
  <rect x="80" y="500" width="120" height="4" fill="${glow}"/>
  <text x="80" y="560" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="600" fill="#FFFFFF" opacity="0.7">b2bgroeimachine.io</text>
</svg>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    if (!slug) return new Response("missing slug", { status: 400, headers: corsHeaders });

    const supa = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data, error } = await supa
      .from("abm_pages")
      .select("company_name, hero_headline, hero_subline, brand_primary_hex, brand_glow_hex")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) return new Response("not found", { status: 404, headers: corsHeaders });

    const svg = buildSvg({
      company: data.company_name,
      headline: data.hero_headline || "Slimmer werken door",
      subline: data.hero_subline || "automatiseren.",
      primary: data.brand_primary_hex || "#0F4C75",
      glow: data.brand_glow_hex || "#3282B8",
    });

    await ensureWasm();
    const fonts = await ensureFonts();
    const resvg = new Resvg(svg, {
      fitTo: { mode: "width", value: 1200 },
      font: {
        fontBuffers: [fonts.regular, fonts.bold],
        loadSystemFonts: false,
        defaultFontFamily: "Inter",
      },
    });
    const png = resvg.render().asPng();

    return new Response(png, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("og-image error:", msg);
    return new Response(`error: ${msg}`, { status: 500, headers: corsHeaders });
  }
});