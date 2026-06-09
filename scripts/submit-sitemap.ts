const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("[submit-sitemap] Supabase env ontbreekt — submit overgeslagen.");
    return;
  }
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/submit-sitemap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_KEY}`,
        apikey: SUPABASE_KEY,
      },
    });
    const body = await res.text();
    if (!res.ok) {
      console.warn(`[submit-sitemap] GSC submit faalde (${res.status}): ${body.slice(0, 200)}`);
      return;
    }
    console.log("[submit-sitemap] Sitemap ingediend bij Google Search Console.");
  } catch (e) {
    console.warn("[submit-sitemap] Kon submit-sitemap function niet bereiken:", e);
  }
}

main();