import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ─── LOVART CONFIG (mirrors mcp-server) ───
const LOVART_BASE = "https://lgw.lovart.ai";
const LOVART_PREFIX = "/v1/openapi";
const LOVART_PROJECT_ID = "odODxVnkpG";
const LOVART_STYLE_REF = "https://a.lovart.ai/artifacts/user/Sg8fWUDPMVGzWngL.png";
const LOVART_LOGO_REF = "https://a.lovart.ai/context-forge/kits/kit_b5276abe/logo/7bdd1e88.png";

async function lovartSign(method: string, path: string): Promise<Record<string, string>> {
  const ak = Deno.env.get("LOVART_ACCESS_KEY")!;
  const sk = Deno.env.get("LOVART_SECRET_KEY")!;
  const ts = Math.floor(Date.now() / 1000).toString();
  const msg = `${method}\n${path}\n${ts}`;
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(sk),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  const sig = Array.from(new Uint8Array(sigBuf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return {
    "X-Access-Key": ak, "X-Timestamp": ts, "X-Signature": sig,
    "X-Signed-Method": method, "X-Signed-Path": path,
    "Content-Type": "application/json",
  };
}

async function lovartRequest(method: "GET" | "POST", path: string, body?: unknown, params?: Record<string, string>) {
  let url = `${LOVART_BASE}${path}`;
  if (params) url += "?" + new URLSearchParams(params).toString();
  const headers = await lovartSign(method, path);
  const res = await fetch(url, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
  const text = await res.text();
  if (!res.ok) throw new Error(`Lovart ${res.status}: ${text}`);
  const json = JSON.parse(text);
  if (typeof json.code === "number" && json.code !== 0) throw new Error(json.message || "Lovart error");
  return json.data ?? json;
}

function buildLovartPrompt(title: string, keyword: string): string {
  return `CRITICAL CONSTRAINTS - follow exactly:
- ASPECT RATIO: 1:1 SQUARE (1024x1024). NOT portrait. NOT vertical.
- LOGO: Use attachment #2 (the orange circular G icon) as the LITERAL logo image in the top-left corner. Do NOT redraw it, do NOT write logo text - paste the supplied logo file exactly as provided.
- STYLE: match attachment #1 reference exactly - spacious 3-part layout, illustrated photo-realistic characters (not flat icons), generous breathing room.

COLOR BALANCE (strict):
- Background #121212 dominates ~60%
- Cream text #EEEAE4 dominates ~30%
- Terracotta orange #E8945A only ~10% (highlights, accent words, key icons - NOT large filled shapes)

Main headline in large bold cream text: "${title}"

Visual concept: a clean editorial B2B infographic illustrating the concept of "${keyword || title}" with a 3-zone layout (problem, mechanism, outcome), iconography and short labels.

Use terracotta orange (#E8945A) for accent words, key icons and the central mechanism. Include the website "b2bgroeimachine.io" at the bottom.

Typography: Space Grotesk for headlines, Inter for body. NO logos other than the supplied one. NO partner brand names.`;
}

async function generateViaLovart(title: string, keyword: string, supabase: ReturnType<typeof createClient>): Promise<string | null> {
  if (!Deno.env.get("LOVART_ACCESS_KEY") || !Deno.env.get("LOVART_SECRET_KEY")) return null;
  const prompt = buildLovartPrompt(title, keyword);
  const start = await lovartRequest("POST", `${LOVART_PREFIX}/chat`, {
    prompt,
    project_id: LOVART_PROJECT_ID,
    attachments: [LOVART_STYLE_REF, LOVART_LOGO_REF],
    tool_config: { include_tools: ["generate_image_gpt_image_2"] },
  });
  const threadId = start.thread_id as string;
  if (!threadId) return null;

  // Poll up to ~4 minutes
  const maxAttempts = 48;
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const status = await lovartRequest("GET", `${LOVART_PREFIX}/chat/status`, undefined, { thread_id: threadId });
    if (status.status === "done") break;
    if (status.status === "abort" || status.status === "error") {
      console.error("Lovart aborted:", status);
      return null;
    }
    if (i === maxAttempts - 1) {
      console.warn("Lovart timeout for thread", threadId);
      return null;
    }
  }

  const result = await lovartRequest("GET", `${LOVART_PREFIX}/chat/result`, undefined, { thread_id: threadId });
  const imageUrls: string[] = [];
  for (const item of result.items ?? []) {
    for (const a of item.artifacts ?? []) {
      if (a.type === "image" && a.content) imageUrls.push(a.content);
    }
  }
  if (imageUrls.length === 0) return null;

  // Mirror first image to blog-images bucket
  const url = imageUrls[0];
  const r = await fetch(url);
  if (!r.ok) return null;
  const buf = new Uint8Array(await r.arrayBuffer());
  const ext = (url.split("?")[0].split(".").pop() || "png").toLowerCase();
  const safeExt = ["png", "jpg", "jpeg", "webp"].includes(ext) ? ext : "png";
  const contentType = safeExt === "jpg" ? "image/jpeg" : `image/${safeExt}`;
  const fileName = `lovart-${threadId}-${Date.now()}.${safeExt}`;
  const { error: upErr } = await supabase.storage.from("blog-images").upload(fileName, buf, { contentType, upsert: false });
  if (upErr) {
    console.error("Lovart mirror upload failed:", upErr);
    return null;
  }
  const { data: pub } = supabase.storage.from("blog-images").getPublicUrl(fileName);
  return pub.publicUrl;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { title, keyword, style, provider } = await req.json();
    if (!title) throw new Error("title is required");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Primary path: Lovart (brand-compliant). Falls through to Gemini on failure.
    if (provider !== "gemini") {
      try {
        const lovartUrl = await generateViaLovart(title, keyword || "", supabase);
        if (lovartUrl) {
          return new Response(JSON.stringify({ image_url: lovartUrl, provider: "lovart" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        console.warn("Lovart returned no image, falling back to Gemini");
      } catch (e) {
        console.error("Lovart generation failed, falling back to Gemini:", e);
      }
    }

    const imageStyle = style || "modern 3D";
    const prompt = `Create a visually striking ${imageStyle} illustration for a B2B blog article titled "${title}". 
The image should be:
- Professional and modern, suitable for a B2B SaaS/tech company
- Use warm orange/amber tones as accent colors against a clean background
- Abstract and conceptual - NOT text-heavy, no visible text or words in the image
- 3D rendered objects, geometric shapes, or abstract data visualizations
- High quality, editorial style like a premium tech blog header image
- Landscape orientation (16:9 aspect ratio)
- Related to the concept: ${keyword || title}

Do NOT include any text, letters, words, or logos in the image.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit bereikt, probeer het later opnieuw." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits op. Voeg credits toe in Lovable Settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI image error:", response.status, t);
      throw new Error("Afbeelding generatie mislukt");
    }

    const data = await response.json();
    const imageData = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!imageData) throw new Error("Geen afbeelding gegenereerd");

    // Upload to Supabase Storage
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    const fileName = `generated-${Date.now()}.png`;

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(fileName, binaryData, { contentType: "image/png" });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    const { data: urlData } = supabase.storage
      .from("blog-images")
      .getPublicUrl(fileName);

    return new Response(JSON.stringify({ image_url: urlData.publicUrl, provider: "gemini" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-blog-image error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Onbekende fout" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
