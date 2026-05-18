import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

/**
 * Validate external links in blog markdown.
 *
 * POST { content: string, ignoreHosts?: string[] }
 * → { checked, ok, broken: [{ url, status, reason }] }
 *
 * Strategy:
 * - Extract URLs from markdown ([..](url)) and bare http(s)://… occurrences.
 * - Skip internal hosts and any host in ignoreHosts.
 * - HEAD request with browser-like UA + 10s timeout.
 * - Fall back to ranged GET when HEAD returns 4xx/5xx/0 (many sites block HEAD).
 * - Treat 2xx and 3xx as ok. 401/403/405/429 are treated as "ok" (bot-blocking, not dead).
 */

const INTERNAL_HOSTS = new Set([
  "b2bgroeimachine.io",
  "www.b2bgroeimachine.io",
  "eco-signal-link.lovable.app",
  "id-preview--b8be2034-b241-4c9e-a46b-78ae7a9fb035.lovable.app",
]);

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const REQUEST_TIMEOUT_MS = 10_000;
const CONCURRENCY = 6;

/** Treat these as "site blocks bots" → not a dead link. */
const SOFT_OK_STATUSES = new Set([401, 403, 405, 429, 503]);

function extractUrls(md: string): string[] {
  const urls = new Set<string>();
  // Markdown links [text](url) — capture until ) or whitespace
  for (const m of md.matchAll(/\]\((https?:\/\/[^\s)]+)\)/g)) {
    urls.add(cleanUrl(m[1]));
  }
  // Bare URLs (skip ones already inside markdown — Set dedupes anyway)
  for (const m of md.matchAll(/(?<![\("'\]])https?:\/\/[^\s)<>"']+/g)) {
    urls.add(cleanUrl(m[0]));
  }
  return [...urls];
}

function cleanUrl(u: string): string {
  // Strip trailing punctuation that's almost certainly markdown/sentence noise
  return u.replace(/[.,;:!?)]+$/g, "");
}

function isInternal(url: string, ignoreHosts: Set<string>): boolean {
  try {
    const h = new URL(url).hostname.toLowerCase();
    if (INTERNAL_HOSTS.has(h)) return true;
    if (ignoreHosts.has(h)) return true;
    return false;
  } catch {
    return true; // malformed → skip
  }
}

async function checkOne(url: string): Promise<{ url: string; status: number; ok: boolean; reason?: string }> {
  const tryFetch = async (method: "HEAD" | "GET") => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        signal: ctrl.signal,
        headers: {
          "User-Agent": UA,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          // Ask for a tiny slice to avoid downloading the whole page on GET fallback
          ...(method === "GET" ? { Range: "bytes=0-1024" } : {}),
        },
      });
      // Drain body to avoid resource leak
      try {
        await res.body?.cancel();
      } catch {
        /* noop */
      }
      return res.status;
    } finally {
      clearTimeout(timer);
    }
  };

  let status = 0;
  try {
    status = await tryFetch("HEAD");
  } catch {
    status = 0;
  }
  // Fallback to GET if HEAD failed, was 0, or returned a hard error
  if (status === 0 || status === 404 || status === 410 || status >= 500) {
    try {
      const getStatus = await tryFetch("GET");
      if (getStatus !== 0) status = getStatus;
    } catch {
      /* keep prior status */
    }
  }

  const ok =
    (status >= 200 && status < 400) || SOFT_OK_STATUSES.has(status);
  return {
    url,
    status,
    ok,
    reason: ok ? undefined : status === 0 ? "unreachable" : `HTTP ${status}`,
  };
}

async function checkAll(urls: string[]) {
  const results: Array<{ url: string; status: number; ok: boolean; reason?: string }> = [];
  const queue = [...urls];
  const workers = Array.from({ length: Math.min(CONCURRENCY, urls.length) }, async () => {
    while (queue.length) {
      const u = queue.shift()!;
      results.push(await checkOne(u));
    }
  });
  await Promise.all(workers);
  return results;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "POST only" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => null);
    const content = typeof body?.content === "string" ? body.content : "";
    const ignoreHosts = new Set<string>(
      Array.isArray(body?.ignoreHosts) ? body.ignoreHosts.map((s: string) => String(s).toLowerCase()) : []
    );

    if (!content) {
      return new Response(JSON.stringify({ error: "content (string) is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const all = extractUrls(content);
    const external = all.filter((u) => !isInternal(u, ignoreHosts));
    const results = await checkAll(external);
    const broken = results.filter((r) => !r.ok);

    return new Response(
      JSON.stringify({
        checked: results.length,
        ok: results.length - broken.length,
        broken,
        skipped_internal: all.length - external.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? "unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});