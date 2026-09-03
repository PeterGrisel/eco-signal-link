// social-image: rendert de vaste visual-templates van de post-generator.
//
//   GET ?catalog=1                      → de standaard (templates, formaten, kanalen) als JSON
//   GET ?id=<social_post_id>            → de visual van een opgeslagen post
//   GET ?template=stat&format=square&…  → een visual uit losse velden
//   &as=svg                             → SVG in plaats van PNG (gebruikt door de admin-preview)
//
// De PNG-URL is publiek en zonder JWT bereikbaar, zodat Planable en de
// social-kanalen het beeld zelf kunnen ophalen.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { initWasm, Resvg } from "https://esm.sh/@resvg/resvg-wasm@2.6.2";
import { buildSvg, catalog, fieldsFromParams, type Skin, type VisualFields } from "../_shared/social.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

let wasmReady: Promise<void> | null = null;
function ensureWasm() {
  if (!wasmReady) {
    wasmReady = (async () => {
      const res = await fetch("https://esm.sh/@resvg/resvg-wasm@2.6.2/index_bg.wasm");
      await initWasm(await res.arrayBuffer());
    })();
  }
  return wasmReady;
}

// Space Grotesk draagt de koppen, Inter de lopende tekst; dezelfde combinatie
// als op de site. Valt de display-font weg, dan rendert alles in Inter.
const FONT_URLS = [
  "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/spacegrotesk/SpaceGrotesk%5Bwght%5D.ttf",
  "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/inter/Inter%5Bopsz,wght%5D.ttf",
];
let fontsPromise: Promise<Uint8Array[]> | null = null;
function ensureFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all(
      FONT_URLS.map(async (url) => {
        const r = await fetch(url);
        if (!r.ok) throw new Error(`font ${url} → HTTP ${r.status}`);
        return new Uint8Array(await r.arrayBuffer());
      }),
    ).then((buffers) => buffers.filter((b) => b.length > 0));
  }
  return fontsPromise;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/** Haalt de visual-instellingen van een opgeslagen post op. */
async function loadPost(id: string) {
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data, error } = await supabase
    .from("social_posts")
    .select("visual_template, visual_format, visual_skin, visual_fields")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`post ophalen mislukt: ${error.message}`);
  if (!data) throw new Error(`post ${id} bestaat niet`);
  return data;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const params = req.method === "POST"
      ? new URLSearchParams(
        Object.entries(await req.json().catch(() => ({}))).map(([k, v]) => [
          k,
          Array.isArray(v) ? v.join("|") : String(v ?? ""),
        ]),
      )
      : url.searchParams;

    if (params.get("catalog")) return json(catalog());

    let template = params.get("template") ?? "statement";
    let format = params.get("format") ?? "portrait";
    let skin = (params.get("skin") ?? "dark") as Skin;
    let fields: VisualFields = fieldsFromParams(params);

    const postId = params.get("id");
    if (postId) {
      const post = await loadPost(postId);
      template = post.visual_template ?? template;
      format = post.visual_format ?? format;
      skin = (post.visual_skin ?? skin) as Skin;
      fields = (post.visual_fields ?? {}) as VisualFields;
    }

    const svg = buildSvg({ template, format, skin, fields });

    // Een URL met losse velden is inhoudsadresseerbaar en mag lang gecachet
    // worden. Bij `?id=` verandert de URL niet als de post wordt bijgewerkt,
    // dus cachen we kort tenzij de aanroeper zelf een versie meegeeft (`v`).
    const cache = !postId || params.get("v") ? "public, max-age=86400" : "public, max-age=60";

    if (params.get("as") === "svg") {
      return new Response(svg, {
        headers: { ...corsHeaders, "Content-Type": "image/svg+xml", "Cache-Control": cache },
      });
    }

    await ensureWasm();
    const fonts = await ensureFonts();
    const resvg = new Resvg(svg, {
      font: { fontBuffers: fonts, defaultFontFamily: "Inter", loadSystemFonts: false },
    });
    const png = resvg.render().asPng();

    return new Response(png, {
      headers: { ...corsHeaders, "Content-Type": "image/png", "Cache-Control": cache },
    });
  } catch (e) {
    console.error("social-image error:", e);
    return json({ error: e instanceof Error ? e.message : "Onbekende fout" }, 500);
  }
});
