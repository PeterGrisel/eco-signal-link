import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { title, keyword, style } = await req.json();
    if (!title) throw new Error("title is required");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

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
