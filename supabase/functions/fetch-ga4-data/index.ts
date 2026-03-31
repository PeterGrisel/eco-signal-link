import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GA4_PROPERTY_ID = "502568051";

async function getAccessToken(): Promise<string> {
  let email: string;
  let privateKey: string;

  const saJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
  if (saJson) {
    try {
      let jsonStr = saJson.trim();
      if (jsonStr.startsWith("'") && jsonStr.endsWith("'")) {
        jsonStr = jsonStr.slice(1, -1);
      }
      const sa = JSON.parse(jsonStr);
      email = sa.client_email;
      privateKey = sa.private_key;
      if (!email || !privateKey) throw new Error("Missing client_email or private_key in JSON");
    } catch (e) {
      console.error("JSON parse error:", e);
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

  privateKey = privateKey.replace(/\\n/g, "\n").replace(/\\\\n/g, "\n").trim();

  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: email,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
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
  const encodeJson = (obj: unknown) => b64url(te.encode(JSON.stringify(obj)));
  const unsignedToken = `${encodeJson(header)}.${encodeJson(claim)}`;

  const pemLines = privateKey.split("\n").filter(l => l.trim() && !l.includes("-----"));
  const pemBody = pemLines.join("").replace(/\s/g, "");
  const binaryStr = atob(pemBody);
  const binaryKey = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) binaryKey[i] = binaryStr.charCodeAt(i);

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8", binaryKey.buffer, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]
  );
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, te.encode(unsignedToken));
  const signedToken = `${unsignedToken}.${b64url(new Uint8Array(signature))}`;

  // Retry logic for transient TLS handshake errors in Deno edge runtime
  let tokenRes: Response | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${signedToken}`,
      });
      break; // success
    } catch (fetchErr) {
      console.warn(`[fetch-ga4-data] Token fetch attempt ${attempt + 1} failed:`, fetchErr);
      if (attempt === 2) throw fetchErr;
      await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
    }
  }

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error(`Token exchange failed: ${err}`);
  }

  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

interface GA4Request {
  dateRanges: Array<{ startDate: string; endDate: string }>;
  metrics: Array<{ name: string }>;
  dimensions?: Array<{ name: string }>;
  orderBys?: Array<{ metric?: { metricName: string }; desc?: boolean }>;
  limit?: number;
}

async function runGA4Report(accessToken: string, body: GA4Request) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GA4 API error [${res.status}]: ${err}`);
  }

  return await res.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { days = 28 } = await req.json().catch(() => ({}));
    const accessToken = await getAccessToken();

    const endDate = "today";
    const startDate = `${days}daysAgo`;

    // Fetch overview metrics
    const overviewData = await runGA4Report(accessToken, {
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: "sessions" },
        { name: "totalUsers" },
        { name: "screenPageViews" },
        { name: "bounceRate" },
        { name: "averageSessionDuration" },
        { name: "engagedSessions" },
      ],
    });

    // Fetch top pages
    const pagesData = await runGA4Report(accessToken, {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "pagePath" }],
      metrics: [
        { name: "screenPageViews" },
        { name: "sessions" },
        { name: "bounceRate" },
        { name: "averageSessionDuration" },
      ],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 20,
    });

    // Fetch traffic sources
    const sourcesData = await runGA4Report(accessToken, {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [
        { name: "sessions" },
        { name: "totalUsers" },
        { name: "engagedSessions" },
      ],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 10,
    });

    // Parse overview
    const ov = overviewData.rows?.[0]?.metricValues || [];
    const totals = {
      sessions: parseInt(ov[0]?.value || "0"),
      users: parseInt(ov[1]?.value || "0"),
      pageviews: parseInt(ov[2]?.value || "0"),
      bounce_rate: parseFloat(ov[3]?.value || "0"),
      avg_session_duration: parseFloat(ov[4]?.value || "0"),
      engaged_sessions: parseInt(ov[5]?.value || "0"),
    };

    // Parse top pages
    const top_pages = (pagesData.rows || []).map((r: any) => ({
      path: r.dimensionValues[0].value,
      pageviews: parseInt(r.metricValues[0].value),
      sessions: parseInt(r.metricValues[1].value),
      bounce_rate: parseFloat(r.metricValues[2].value),
      avg_duration: parseFloat(r.metricValues[3].value),
    }));

    // Parse sources
    const traffic_sources = (sourcesData.rows || []).map((r: any) => ({
      channel: r.dimensionValues[0].value,
      sessions: parseInt(r.metricValues[0].value),
      users: parseInt(r.metricValues[1].value),
      engaged_sessions: parseInt(r.metricValues[2].value),
    }));

    return new Response(JSON.stringify({
      period: { days },
      totals,
      top_pages,
      traffic_sources,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fetch-ga4-data error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Onbekende fout" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
