import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SOURCE_URL = "https://www.workflows.io/toolverse";
const FIRECRAWL_V2 = "https://api.firecrawl.dev/v2";

// Mapping van Workflows.io / Toolverse categorieën naar onze 6 Groeistack categorieën.
const categoryMap: Record<string, string> = {
  signal: "signalen",
  signals: "signalen",
  intent: "signalen",
  data: "signalen",
  enrich: "verrijking",
  enrichment: "verrijking",
  verify: "verrijking",
  prospect: "verrijking",
  outreach: "outreach",
  email: "outreach",
  linkedin: "outreach",
  sequenc: "outreach",
  crm: "crm",
  pipeline: "crm",
  sales: "crm",
  ai: "ai",
  content: "ai",
  video: "ai",
  writing: "ai",
  dashboard: "dashboard",
  analytics: "dashboard",
  attribution: "dashboard",
  report: "dashboard",
};

const normalizeCategory = (raw: string | undefined | null): string => {
  if (!raw) return "ai";
  const r = raw.toLowerCase();
  for (const key of Object.keys(categoryMap)) {
    if (r.includes(key)) return categoryMap[key];
  }
  return "ai";
};

const faviconFor = (website: string): string | null => {
  try {
    const host = new URL(website).hostname;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
  } catch {
    return null;
  }
};

const cleanWebsite = (url: string): string | null => {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.hostname}`;
  } catch {
    return null;
  }
};

interface ScrapedTool {
  name: string;
  category?: string;
  description?: string;
  website: string;
}

// Scrape Toolverse met Firecrawl's JSON extractie.
async function scrapeToolverse(apiKey: string): Promise<ScrapedTool[]> {
  const res = await fetch(`${FIRECRAWL_V2}/scrape`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: SOURCE_URL,
      onlyMainContent: true,
      formats: [
        {
          type: "json",
          prompt:
            "Extract every B2B GTM / sales / marketing tool listed on this page. For each tool return: name (string), category (short label string), description (one short sentence), website (the external homepage URL of the tool itself, not a workflows.io link).",
          schema: {
            type: "object",
            properties: {
              tools: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    category: { type: "string" },
                    description: { type: "string" },
                    website: { type: "string" },
                  },
                  required: ["name", "website"],
                },
              },
            },
            required: ["tools"],
          },
        },
      ],
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Firecrawl scrape failed [${res.status}]: ${JSON.stringify(data).slice(0, 400)}`);
  }

  // Firecrawl v2 returns { success, data: { json: {...}, metadata: ... } }
  const json = data?.data?.json ?? data?.json ?? {};
  const tools = Array.isArray(json?.tools) ? json.tools : [];
  return tools as ScrapedTool[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!apiKey) throw new Error("FIRECRAWL_API_KEY is not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const tools = await scrapeToolverse(apiKey);

    let upserted = 0;
    let skipped = 0;
    const now = new Date().toISOString();

    for (const t of tools) {
      const website = cleanWebsite(t.website || "");
      const name = (t.name || "").trim();
      if (!website || !name) {
        skipped++;
        continue;
      }
      // Sla workflows.io zelf en andere ruis-domeinen over.
      if (/workflows\.io|toolverse/i.test(website)) {
        skipped++;
        continue;
      }

      const payload = {
        name,
        category: normalizeCategory(t.category),
        description: (t.description || "").trim().slice(0, 280),
        website,
        logo_url: faviconFor(website),
        link_status: "ok",
        source_url: SOURCE_URL,
        last_scraped_at: now,
        last_checked_at: now,
        published: true,
      };

      const { error } = await supabase
        .from("groeistack_tools")
        .upsert(payload, { onConflict: "website" });

      if (error) {
        console.error("upsert error", website, error.message);
        skipped++;
      } else {
        upserted++;
      }
    }

    return new Response(
      JSON.stringify({ ok: true, source: SOURCE_URL, scraped: tools.length, upserted, skipped }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("groeistack-scrape error", e);
    return new Response(
      JSON.stringify({ ok: false, error: String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});