import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface LighthouseCategory {
  id: string;
  title: string;
  score: number | null;
}

interface LighthouseAuditItem {
  id: string;
  title: string;
  description: string;
  score: number | null;
  displayValue?: string;
  numericValue?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const url = body.url || "https://b2bgroeimachine.io";
    const strategy = body.strategy || "mobile"; // "mobile" or "desktop"

    const categories = ["performance", "seo", "accessibility", "best-practices"];
    const catParam = categories.map(c => `category=${c}`).join("&");
    const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&${catParam}`;

    const res = await fetch(psiUrl);
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`PageSpeed API error ${res.status}: ${errText.slice(0, 200)}`);
    }

    const psi = await res.json();
    const lhr = psi.lighthouseResult;

    // Extract category scores
    const scores: Record<string, number> = {};
    for (const [key, cat] of Object.entries(lhr.categories as Record<string, LighthouseCategory>)) {
      scores[key] = Math.round((cat.score || 0) * 100);
    }

    // Extract key metrics
    const audits = lhr.audits || {};
    const metrics: LighthouseAuditItem[] = [];
    const keyAudits = [
      "first-contentful-paint",
      "largest-contentful-paint",
      "total-blocking-time",
      "cumulative-layout-shift",
      "speed-index",
      "interactive",
      "server-response-time",
      "render-blocking-resources",
      "uses-text-compression",
      "uses-responsive-images",
      "unused-javascript",
      "unused-css-rules",
      "dom-size",
      "meta-description",
      "document-title",
      "http-status-code",
      "is-crawlable",
      "robots-txt",
      "hreflang",
      "canonical",
      "structured-data",
      "viewport",
      "font-size",
      "tap-targets",
      "image-alt",
      "link-name",
      "color-contrast",
    ];

    for (const id of keyAudits) {
      const a = audits[id];
      if (!a) continue;
      metrics.push({
        id: a.id,
        title: a.title,
        description: (a.description || "").replace(/\[.*?\]\(.*?\)/g, "").slice(0, 200),
        score: a.score,
        displayValue: a.displayValue || undefined,
        numericValue: a.numericValue || undefined,
      });
    }

    // Extract opportunities (things to fix)
    const opportunities: LighthouseAuditItem[] = [];
    for (const id of Object.keys(audits)) {
      const a = audits[id];
      if (a.score !== null && a.score < 1 && a.details?.type === "opportunity") {
        opportunities.push({
          id: a.id,
          title: a.title,
          description: (a.description || "").replace(/\[.*?\]\(.*?\)/g, "").slice(0, 200),
          score: a.score,
          displayValue: a.displayValue || undefined,
          numericValue: a.numericValue || undefined,
        });
      }
    }
    opportunities.sort((a, b) => (a.score ?? 1) - (b.score ?? 1));

    return new Response(JSON.stringify({
      url,
      strategy,
      scores,
      metrics: metrics.slice(0, 30),
      opportunities: opportunities.slice(0, 10),
      fetchTime: lhr.fetchTime,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("lighthouse-audit error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
