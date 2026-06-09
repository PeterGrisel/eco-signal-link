// Shared helpers for SEO Authority Agent edge functions
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

export function svc() {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
}

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function errJson(message: string, status = 500) {
  return json({ error: message }, status);
}

const FIRECRAWL_V2 = "https://api.firecrawl.dev/v2";

export async function firecrawlScrape(url: string, formats: string[] = ["markdown", "links"]) {
  const key = Deno.env.get("FIRECRAWL_API_KEY");
  if (!key) throw new Error("FIRECRAWL_API_KEY missing");
  const res = await fetch(`${FIRECRAWL_V2}/scrape`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ url, formats, onlyMainContent: true }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `firecrawl scrape ${res.status}`);
  return data?.data ?? data;
}

export async function firecrawlSearch(query: string, limit = 10) {
  const key = Deno.env.get("FIRECRAWL_API_KEY");
  if (!key) throw new Error("FIRECRAWL_API_KEY missing");
  const res = await fetch(`${FIRECRAWL_V2}/search`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, limit }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `firecrawl search ${res.status}`);
  // v2 returns { data: { web: [...] } } or { data: [...] }
  const web = data?.data?.web ?? data?.data ?? [];
  return Array.isArray(web) ? web : [];
}

export async function callGemini(systemPrompt: string, userPrompt: string, opts?: { tool?: { name: string; description: string; parameters: any } }) {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) throw new Error("LOVABLE_API_KEY missing");
  const body: any = {
    model: "google/gemini-2.5-flash",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  };
  if (opts?.tool) {
    body.tools = [{ type: "function", function: opts.tool }];
    body.tool_choice = { type: "function", function: { name: opts.tool.name } };
  }
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`AI ${res.status}: ${t.slice(0, 200)}`);
  }
  const data = await res.json();
  if (opts?.tool) {
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) throw new Error("No tool call returned");
    return JSON.parse(call.function.arguments);
  }
  return data?.choices?.[0]?.message?.content ?? "";
}

export function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function clamp(n: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

export function calcPriority(s: {
  context_fit: number;
  sector_fit: number;
  page_type_fit: number;
  authority_score: number;
  placement_probability: number;
  commercial_value: number;
  risk_score: number;
}): number {
  const score =
    s.context_fit * 0.35 +
    s.sector_fit * 0.20 +
    s.page_type_fit * 0.15 +
    s.authority_score * 0.10 +
    s.placement_probability * 0.10 +
    s.commercial_value * 0.10 -
    s.risk_score * 0.30;
  return clamp(score);
}

export function matchesNegative(text: string, negatives: string[]): boolean {
  const t = text.toLowerCase();
  return negatives.some((n) => n && t.includes(n.toLowerCase()));
}