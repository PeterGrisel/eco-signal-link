import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SECTORS = [
  "Profvoetbal",
  "Groothandel",
  "Leasemaatschappijen",
  "Engineering",
  "Zakelijke Dienstverlening",
  "Financiële Sector",
  "Maakindustrie",
  "Opleiding & Training",
  "IT & Software",
  "Bouw & Renovatie",
  "Technische Dienstverlening",
  "Overig",
];

async function scrapeSummary(url: string, firecrawlKey: string): Promise<string> {
  try {
    const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
      method: "POST",
      headers: { Authorization: `Bearer ${firecrawlKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        formats: ["summary", "markdown"],
        onlyMainContent: true,
      }),
    });
    if (!res.ok) return "";
    const j = await res.json();
    const summary = j?.data?.summary || j?.summary || "";
    const md = j?.data?.markdown || j?.markdown || "";
    // Cap context length
    return (summary + "\n\n" + md).slice(0, 6000);
  } catch {
    return "";
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { client_id } = await req.json();
    if (!client_id) {
      return new Response(JSON.stringify({ error: "client_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY") ?? "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: client, error: clientErr } = await supabase
      .from("client_logos").select("*").eq("id", client_id).single();
    if (clientErr || !client) {
      return new Response(JSON.stringify({ error: "client not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: posts } = await supabase
      .from("blog_posts").select("slug, title")
      .eq("status", "published").order("published_at", { ascending: false }).limit(60);

    const websiteUrl = (client.website || `https://${client.domain}`).replace(/\/$/, "");
    const scraped = FIRECRAWL_API_KEY ? await scrapeSummary(websiteUrl, FIRECRAWL_API_KEY) : "";

    const blogList = (posts || []).map((p: any) => `- ${p.slug} :: ${p.title}`).join("\n");

    const system = `Je verrijkt klantkaarten voor B2BGroeiMachine. Schrijf in B1-Nederlands, direct ('u/uw'), max 12 woorden per zin. Geen em-dashes. Geen marketing-fluff. Antwoord ALLEEN met geldige JSON.`;

    const user = `Klant: ${client.name}
Domein: ${client.domain}
Website: ${websiteUrl}

Website-context (samenvatting + markdown):
${scraped || "(geen scrape beschikbaar)"}

Toegestane sectoren (kies exact één):
${SECTORS.map(s => `- ${s}`).join("\n")}

Beschikbare blog-slugs (kies max 1 die echt past, anders null):
${blogList || "(geen)"}

Geef terug:
{
  "sector": "<exact één uit lijst>",
  "description": "<2 korte zinnen over wat dit bedrijf doet, B1, neutraal>",
  "blog_slug": "<slug of null>"
}`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (aiRes.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit. Probeer later opnieuw." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiRes.status === 402) {
      return new Response(JSON.stringify({ error: "AI-credits op. Voeg credits toe." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiRes.ok) {
      const t = await aiRes.text();
      return new Response(JSON.stringify({ error: `AI ${aiRes.status}: ${t}` }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiRes.json();
    const raw = aiJson?.choices?.[0]?.message?.content || "{}";
    let proposal: any = {};
    try { proposal = JSON.parse(raw); } catch { proposal = {}; }

    // Validate
    const sector = SECTORS.includes(proposal.sector) ? proposal.sector : null;
    const description = typeof proposal.description === "string" ? proposal.description.trim() : "";
    const validSlugs = new Set((posts || []).map((p: any) => p.slug));
    const blog_slug = proposal.blog_slug && validSlugs.has(proposal.blog_slug)
      ? proposal.blog_slug : null;

    return new Response(JSON.stringify({
      proposal: { sector, description, blog_slug, website: websiteUrl },
      scraped_chars: scraped.length,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});