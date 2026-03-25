import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Convert PEM private key to CryptoKey for signing JWTs
async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const pemContents = pem
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\n/g, "");
  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

function base64url(data: Uint8Array): string {
  return btoa(String.fromCharCode(...data))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function createSignedJwt(serviceAccount: { client_email: string; private_key: string; token_uri: string }): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: serviceAccount.token_uri,
    iat: now,
    exp: now + 3600,
  };

  const encoder = new TextEncoder();
  const headerB64 = base64url(encoder.encode(JSON.stringify(header)));
  const payloadB64 = base64url(encoder.encode(JSON.stringify(payload)));
  const signingInput = `${headerB64}.${payloadB64}`;

  const key = await importPrivateKey(serviceAccount.private_key);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, encoder.encode(signingInput));

  return `${signingInput}.${base64url(new Uint8Array(signature))}`;
}

async function getAccessToken(serviceAccount: { client_email: string; private_key: string; token_uri: string }): Promise<string> {
  const jwt = await createSignedJwt(serviceAccount);
  const res = await fetch(serviceAccount.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Token exchange failed: ${data.error_description || data.error}`);
  return data.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { url, urls } = await req.json();
    const targetUrls = urls || (url ? [url] : []);
    if (targetUrls.length === 0) throw new Error("Geen URL(s) opgegeven");

    const saJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
    if (!saJson) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON secret niet geconfigureerd");

    console.log("Secret first 20 chars:", saJson.substring(0, 20));
    console.log("Secret length:", saJson.length);

    let serviceAccount;
    const trimmed = saJson.trim();
    if (trimmed.startsWith("{")) {
      serviceAccount = JSON.parse(trimmed);
    } else {
      // Secret may be stored without braces
      serviceAccount = JSON.parse(`{${trimmed}}`);
    }
    const accessToken = await getAccessToken(serviceAccount);

    const results = [];

    for (const targetUrl of targetUrls) {
      const { data: record } = await supabase.from("indexing_requests").insert({
        url: targetUrl,
        status: "requested",
        requested_at: new Date().toISOString(),
      }).select().single();

      try {
        const response = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: targetUrl, type: "URL_UPDATED" }),
        });

        const data = await response.json();

        if (response.ok) {
          await supabase.from("indexing_requests").update({
            status: "indexed",
            indexed_at: new Date().toISOString(),
            response_message: "Succesvol ingediend bij Google",
          }).eq("id", record.id);
          results.push({ url: targetUrl, status: "indexed" });
        } else {
          await supabase.from("indexing_requests").update({
            status: "failed",
            response_message: data.error?.message || "Google API fout",
          }).eq("id", record.id);
          results.push({ url: targetUrl, status: "failed", message: data.error?.message });
        }
      } catch (e) {
        await supabase.from("indexing_requests").update({
          status: "failed",
          response_message: e instanceof Error ? e.message : "Onbekende fout",
        }).eq("id", record.id);
        results.push({ url: targetUrl, status: "failed", message: e instanceof Error ? e.message : "Onbekende fout" });
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("request-indexing error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Onbekende fout" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
