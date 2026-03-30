import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

async function getAccessToken(): Promise<string> {
  // Try GOOGLE_SERVICE_ACCOUNT_JSON first (full JSON), fallback to individual secrets
  let email: string;
  let privateKey: string;

  const saJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
  if (saJson) {
    try {
      // Handle case where the JSON might be double-escaped or have extra quotes
      let jsonStr = saJson.trim();
      if (jsonStr.startsWith("'") && jsonStr.endsWith("'")) {
        jsonStr = jsonStr.slice(1, -1);
      }
      const sa = JSON.parse(jsonStr);
      email = sa.client_email;
      privateKey = sa.private_key;
      if (!email || !privateKey) {
        throw new Error("Missing client_email or private_key in JSON");
      }
    } catch (e) {
      console.error("JSON parse error:", e);
      // Fallback to individual secrets
      email = Deno.env.get("GOOGLE_SA_CLIENT_EMAIL") || "";
      const pkRaw = Deno.env.get("GOOGLE_SA_PRIVATE_KEY") || "";
      if (!email || !pkRaw) throw new Error("Google Service Account credentials not configured");
      privateKey = pkRaw;
    }
  } else {
    email = Deno.env.get("GOOGLE_SA_CLIENT_EMAIL") || "";
    const pkRaw = Deno.env.get("GOOGLE_SA_PRIVATE_KEY") || "";
    if (!email || !pkRaw) throw new Error("Google Service Account credentials not configured");
    privateKey = pkRaw;
  }

  // Normalize the private key - handle all escape formats
  privateKey = privateKey
    .replace(/\\n/g, "\n")     // literal \n to real newlines
    .replace(/\\\\n/g, "\n")   // double-escaped
    .trim();

  // Create JWT
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const te = new TextEncoder();
  const b64url = (data: Uint8Array) => {
    let b = "";
    for (const byte of data) b += String.fromCharCode(byte);
    return btoa(b).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  };
  const encodeJson = (obj: any) => b64url(te.encode(JSON.stringify(obj)));
  const unsignedToken = `${encodeJson(header)}.${encodeJson(claim)}`;

  // Extract PEM body and decode
  const pemLines = privateKey.split("\n").filter(l => l.trim() && !l.includes("-----"));
  const pemBody = pemLines.join("").replace(/\s/g, "");
  
  console.log("PEM body length:", pemBody.length);
  console.log("PEM starts with:", pemBody.substring(0, 20));
  console.log("Private key starts with:", privateKey.substring(0, 40));
  
  const binaryStr = atob(pemBody);
  const binaryKey = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    binaryKey[i] = binaryStr.charCodeAt(i);
  }

  // Log first bytes to verify PKCS8 format (should start with 0x30 = SEQUENCE)
  console.log("First 4 bytes:", Array.from(binaryKey.slice(0, 4)).map(b => `0x${b.toString(16)}`).join(", "));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8", binaryKey.buffer, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5", cryptoKey, te.encode(unsignedToken)
  );

  const signedToken = `${unsignedToken}.${b64url(new Uint8Array(signature))}`;

  // Exchange for access token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${signedToken}`,
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error(`Token exchange failed: ${err}`);
  }

  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

async function fetchSearchAnalytics(accessToken: string, siteUrl: string, startDate: string, endDate: string, dimensions: string[] = ["query", "page"]) {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions,
        rowLimit: 1000,
        startRow: 0,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GSC API error [${res.status}]: ${err}`);
  }

  return await res.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = getSupabase();
    const { days = 28, mode = "snapshot" } = await req.json().catch(() => ({}));

    // Load site URL from settings
    const { data: settings } = await supabase.from("seo_settings").select("config").limit(1).single();
    const rawSiteUrl = settings?.config?.site_url || "https://b2bgroeimachine.io";

    const accessToken = await getAccessToken();

    // Try URL-prefix first, then domain property format
    let siteUrl = rawSiteUrl;
    const tryFormats = [rawSiteUrl];
    // If it's an https URL, also try sc-domain: format
    if (rawSiteUrl.startsWith("https://")) {
      const domain = rawSiteUrl.replace("https://", "").replace(/\/$/, "");
      tryFormats.push(`sc-domain:${domain}`);
    }
    console.log("Will try site URL formats:", tryFormats);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 3); // GSC data has ~3 day delay
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);

    const fmt = (d: Date) => d.toISOString().split("T")[0];

    if (mode === "snapshot") {
      // Try each URL format until we get data
      let data: any = { rows: [] };
      for (const tryUrl of tryFormats) {
        try {
          console.log("Trying GSC site URL:", tryUrl);
          data = await fetchSearchAnalytics(accessToken, tryUrl, fmt(startDate), fmt(endDate), ["query", "page", "date"]);
          if (data.rows && data.rows.length > 0) {
            siteUrl = tryUrl;
            console.log("Got data with format:", tryUrl, "rows:", data.rows.length);
            break;
          }
        } catch (e) {
          console.log("Format failed:", tryUrl, e instanceof Error ? e.message : e);
        }
      }

      const rows = (data.rows || []).map((r: any) => ({
        date: r.keys[2],
        query: r.keys[0],
        page: r.keys[1],
        impressions: r.impressions || 0,
        clicks: r.clicks || 0,
        ctr: r.ctr || 0,
        position: r.position || 0,
      }));

      if (rows.length > 0) {
        // Upsert in batches
        const batchSize = 100;
        for (let i = 0; i < rows.length; i += batchSize) {
          const batch = rows.slice(i, i + batchSize);
          const { error } = await supabase.from("gsc_snapshots").upsert(batch, {
            onConflict: "date,query,page,device",
          });
          if (error) console.error("Upsert batch error:", error);
        }
      }

      return new Response(JSON.stringify({ 
        rows_synced: rows.length,
        date_range: { start: fmt(startDate), end: fmt(endDate) },
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (mode === "overview") {
      // Return aggregated overview for dashboard
      const queryData = await fetchSearchAnalytics(accessToken, siteUrl, fmt(startDate), fmt(endDate), ["query"]);
      const pageData = await fetchSearchAnalytics(accessToken, siteUrl, fmt(startDate), fmt(endDate), ["page"]);

      // Get conversion pages
      const { data: convPages } = await supabase.from("conversion_pages").select("url, label").eq("is_active", true);
      const convUrls = convPages?.map(p => p.url) || [];

      // Calculate conversion clicks
      let conversionClicks = 0;
      (pageData.rows || []).forEach((r: any) => {
        const page = r.keys[0];
        if (convUrls.some(u => page.includes(u))) {
          conversionClicks += r.clicks || 0;
        }
      });

      // Totals
      let totalImpressions = 0, totalClicks = 0;
      (queryData.rows || []).forEach((r: any) => {
        totalImpressions += r.impressions || 0;
        totalClicks += r.clicks || 0;
      });

      return new Response(JSON.stringify({
        period: { start: fmt(startDate), end: fmt(endDate), days },
        totals: {
          impressions: totalImpressions,
          clicks: totalClicks,
          ctr: totalImpressions > 0 ? totalClicks / totalImpressions : 0,
          conversion_clicks: conversionClicks,
        },
        top_queries: (queryData.rows || [])
          .sort((a: any, b: any) => b.impressions - a.impressions)
          .slice(0, 20)
          .map((r: any) => ({
            query: r.keys[0],
            impressions: r.impressions,
            clicks: r.clicks,
            ctr: r.ctr,
            position: r.position,
          })),
        top_pages: (pageData.rows || [])
          .sort((a: any, b: any) => b.clicks - a.clicks)
          .slice(0, 20)
          .map((r: any) => ({
            page: r.keys[0],
            impressions: r.impressions,
            clicks: r.clicks,
            ctr: r.ctr,
            position: r.position,
            is_conversion: convUrls.some(u => r.keys[0].includes(u)),
          })),
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown mode" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fetch-gsc-data error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Onbekende fout" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
