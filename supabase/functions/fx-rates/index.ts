import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// Simple in-memory cache (per warm instance)
let cache: { ts: number; data: Record<string, number> } | null = null;
const TTL_MS = 6 * 60 * 60 * 1000; // 6h

const FALLBACK: Record<string, number> = { EUR: 1, USD: 1.08, GBP: 0.85 };

async function fetchRates(): Promise<Record<string, number>> {
  // Free, no key required. Base EUR.
  const url = "https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD,GBP";
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`status ${res.status}`);
    const json = await res.json();
    const r = json?.rates ?? {};
    return {
      EUR: 1,
      USD: Number(r.USD) || FALLBACK.USD,
      GBP: Number(r.GBP) || FALLBACK.GBP,
    };
  } catch (e) {
    console.error("fx-rates fetch failed", e);
    return FALLBACK;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const now = Date.now();
    if (!cache || now - cache.ts > TTL_MS) {
      cache = { ts: now, data: await fetchRates() };
    }
    return new Response(
      JSON.stringify({ base: "EUR", rates: cache.data, fetchedAt: cache.ts }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=21600",
        },
      },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ base: "EUR", rates: FALLBACK, error: String(e) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  }
});