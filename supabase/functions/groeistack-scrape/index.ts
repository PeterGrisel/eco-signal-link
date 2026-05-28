import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SOURCE_URL = "https://www.workflows.io/toolverse";

// Mapping van Toolverse categorieën (exact label) naar onze 6 Groeistack buckets.
const exactCategoryMap: Record<string, string> = {
  // signalen
  "Signal Tracking": "signalen",
  "Website Visitor Identification": "signalen",
  "ABM": "signalen",
  "Inbound Orchestration": "signalen",
  // verrijking
  "CRM Enrichment": "verrijking",
  "Email Finder": "verrijking",
  "Phone Number Finder": "verrijking",
  "General Databases": "verrijking",
  "Lookalike Databases": "verrijking",
  "Specialized Databases": "verrijking",
  "Data Orchestration": "verrijking",
  "Data Scraping": "verrijking",
  "Search API": "verrijking",
  // outreach
  "Cold Email Sequencer": "outreach",
  "LinkedIn Sequencer": "outreach",
  "Multi-channel Sequencer": "outreach",
  "Manual Sequencer": "outreach",
  "Cold Call Dialer": "outreach",
  "Email Deliverability": "outreach",
  "AI SDR": "outreach",
  "All-in-one Sales Prospecting": "outreach",
  "Newsletter": "outreach",
  // crm
  "CRM": "crm",
  "Meeting Scheduling": "crm",
  "Sales Enablement": "crm",
  "Sales Proposal Builder": "crm",
  "Contract Management": "crm",
  "Revenue Infrastructure": "crm",
  "Customer Support": "crm",
  "Form Builders": "crm",
  // ai
  "AI Agent Builder": "ai",
  "AI Notetaker": "ai",
  "Content Ideation": "ai",
  "Copywriting": "ai",
  "Content Design": "ai",
  "Workflow Automation": "ai",
  // dashboard
  "Marketing Attribution": "dashboard",
  "Marketing Automation": "dashboard",
  "Product Analytics": "dashboard",
  "SEO": "dashboard",
};

const fuzzyFallback = (raw: string): string => {
  const r = raw.toLowerCase();
  if (/signal|intent|visitor|abm|inbound/.test(r)) return "signalen";
  if (/enrich|database|finder|scrap|orchestrat|search api/.test(r)) return "verrijking";
  if (/sequenc|email|linkedin|sdr|prospect|dial|newsletter/.test(r)) return "outreach";
  if (/crm|meeting|sales|contract|support|form/.test(r)) return "crm";
  if (/ai|content|copy|workflow|notetaker/.test(r)) return "ai";
  if (/analyt|attribution|seo|report|dashboard/.test(r)) return "dashboard";
  return "ai";
};

const pickCategory = (cats: string[]): string => {
  for (const c of cats) {
    const m = exactCategoryMap[c];
    if (m) return m;
  }
  return cats.length ? fuzzyFallback(cats[0]) : "ai";
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
    const withProto = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const u = new URL(withProto);
    return `${u.protocol}//${u.hostname}`;
  } catch {
    return null;
  }
};

interface ScrapedTool {
  name: string;
  categories: string[];
  description?: string;
  website: string;
  logo?: string;
}

// Toolverse is een Next.js SPA die crasht in headless browsers (Firecrawl).
// Maar de SSR-streaming HTML bevat álle tools als JSON in __next_f.push chunks.
// We fetchen de raw HTML met een normale User-Agent en parsen die direct.
async function scrapeToolverse(): Promise<ScrapedTool[]> {
  const res = await fetch(SOURCE_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml",
    },
  });
  if (!res.ok) throw new Error(`Toolverse fetch failed [${res.status}]`);
  const html = await res.text();

  // Verzamel alle Next streaming chunks en decode ze als JSON-strings.
  const chunkRe = /self\.__next_f\.push\(\[1,("(?:[^"\\]|\\.)*")\]\)/g;
  let buf = "";
  let m: RegExpExecArray | null;
  while ((m = chunkRe.exec(html)) !== null) {
    try {
      buf += JSON.parse(m[1]);
    } catch {
      // skip malformed chunk
    }
  }

  // Tool-objecten in de gestreamde RSC payload.
  const toolRe =
    /\{"id":"[^"]+","title":"([^"]+)","description":"((?:[^"\\]|\\.)*)","url":"([^"]+)","logo":"([^"]*)","pricingPlans":\[[^\]]*\],"categories":(\[[^\]]*\])\}/g;

  const tools: ScrapedTool[] = [];
  const seen = new Set<string>();
  let t: RegExpExecArray | null;
  while ((t = toolRe.exec(buf)) !== null) {
    const name = t[1].trim();
    let description = "";
    try {
      description = JSON.parse(`"${t[2]}"`);
    } catch {
      description = t[2];
    }
    const url = t[3];
    const logo = t[4] || undefined;
    let categories: string[] = [];
    try {
      const parsed = JSON.parse(t[5]);
      if (Array.isArray(parsed)) {
        categories = parsed
          .map((c: { name?: string }) => (c && typeof c.name === "string" ? c.name : ""))
          .filter(Boolean);
      }
    } catch {
      // ignore
    }
    if (!name || !url) continue;
    const key = url.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    tools.push({ name, description, website: url, logo, categories });
  }

  return tools;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const tools = await scrapeToolverse();

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
        category: pickCategory(t.categories || []),
        description: (t.description || "").trim().slice(0, 280),
        website,
        logo_url: t.logo || faviconFor(website),
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