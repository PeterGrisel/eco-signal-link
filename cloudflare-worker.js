// Cloudflare Worker: Bot Detection & Prerender Proxy
// Custom Domain: b2bgroeimachine.io
//
// Required environment variables (Worker Settings > Variables and Secrets):
//   SUPABASE_ANON_KEY  -- Supabase project API key (anon/public)
//   PRERENDER_SECRET   -- optional shared secret validated by your Supabase function

const PRERENDER_URL        = "https://snymrcialncxkcsibkjv.supabase.co/functions/v1/prerender";
const SITEMAP_URL          = "https://snymrcialncxkcsibkjv.supabase.co/functions/v1/sitemap";
const RSS_URL              = "https://snymrcialncxkcsibkjv.supabase.co/functions/v1/rss";
const ORIGIN_URL           = "https://eco-signal-link.lovable.app";
const PRERENDER_TIMEOUT_MS = 5000;
const CACHE_TTL_EDGE       = 86400; // 24h CDN cache
const CACHE_TTL_WORKER     = 3600;  // 1h  Worker cache

const BOT_AGENTS = [
  'googlebot', 'google-inspectiontool', 'googleweblight',
  'bingbot', 'yandexbot', 'duckduckbot', 'baiduspider',
  'slurp', 'facebot', 'facebookexternalhit', 'twitterbot', 'linkedinbot',
  'whatsapp', 'telegrambot', 'applebot', 'semrushbot', 'ahrefsbot',
  'mj12bot', 'dotbot', 'petalbot', 'bytespider', 'gptbot', 'chatgpt',
  'claudebot', 'claudeai', 'anthropic', 'ia_archiver', 'pinterest',
  'slackbot', 'discordbot', 'embedly', 'quora link preview', 'showyoubot',
  'outbrain', 'rogerbot', 'seznambot', 'developers.google.com',
  'mediapartners-google', 'adsbot-google', 'screaming frog',
  'chrome-lighthouse',
];

const STATIC_EXTENSIONS = /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot|map|webp|avif|json)$/i;

function isBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_AGENTS.some(bot => ua.includes(bot));
}

function isStaticAsset(pathname) {
  return (
    STATIC_EXTENSIONS.test(pathname) ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_') ||
    pathname.startsWith('/assets/')
  );
}

// Forward to Lovable origin, preserving path and query string.
function toOrigin(request, url) {
  return new Request(
    `${ORIGIN_URL}${url.pathname}${url.search}`,
    {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow',
    }
  );
}

// Minimal fallback for bots when prerender is unavailable.
function botFallback(pathname) {
  return new Response(
    `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex">
  <title>B2BGroeiMachine - Schaalbare Sales Automation &amp; Prospecting</title>
  <meta name="description" content="Schaalbare B2B sales automation en prospecting systemen voor groeiende bedrijven.">
  <link rel="canonical" href="https://b2bgroeimachine.io${pathname}">
</head>
<body>
  <h1>B2BGroeiMachine</h1>
  <p>Schaalbare Sales Automation &amp; Prospecting Systemen</p>
</body>
</html>`,
    {
      status: 503,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Prerendered': 'fallback',
        'Cache-Control': 'no-store',
      },
    }
  );
}

async function fetchPrerendered(pathname, userAgent, anonKey, secret) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PRERENDER_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${PRERENDER_URL}?path=${encodeURIComponent(pathname)}`,
      {
        signal: controller.signal,
        headers: {
          'User-Agent': userAgent,
          'Accept': 'text/html',
          'Authorization': `Bearer ${anonKey}`,
          'X-Forwarded-Host': 'b2bgroeimachine.io',
          'X-Original-Path': pathname,
          ...(secret ? { 'X-Prerender-Secret': secret } : {}),
        },
      }
    );
    return response;
  } finally {
    clearTimeout(timer);
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const userAgent = request.headers.get('user-agent') || '';

    // 0. Proxy /sitemap.xml to dynamic Edge Function
    if (url.pathname === '/sitemap.xml') {
      try {
        const sitemapRes = await fetch(SITEMAP_URL, {
          headers: { 'Accept': 'application/xml' },
        });
        return new Response(sitemapRes.body, {
          status: 200,
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      } catch (e) {
        return new Response('Sitemap error', { status: 502 });
      }
    }

    // 0b. Serve robots.txt directly (bypass origin)
    if (url.pathname === '/robots.txt') {
      return fetch(toOrigin(request, url));
    }

    // 0c. Proxy /rss.xml to dynamic Edge Function
    if (url.pathname === '/rss.xml') {
      try {
        const rssRes = await fetch(RSS_URL, {
          headers: { 'apikey': env.SUPABASE_ANON_KEY || '' },
        });
        return new Response(await rssRes.text(), {
          status: rssRes.status,
          headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': `public, max-age=${CACHE_TTL_WORKER}`,
          },
        });
      } catch {
        return new Response('RSS feed unavailable', { status: 502 });
      }
    }

    // 1. Static assets -> straight to Lovable origin
    if (isStaticAsset(url.pathname)) {
      return fetch(toOrigin(request, url));
    }

    // 2. Normal users -> Lovable origin
    if (!isBot(userAgent)) {
      return fetch(toOrigin(request, url));
    }

    // 3. Bot path: check Worker cache first
    const cache = caches.default;
    const cacheKey = new Request(
      `https://prerender-cache.internal${url.pathname}`,
      { method: 'GET' }
    );

    const cached = await cache.match(cacheKey);
    if (cached) {
      return new Response(cached.body, {
        status: cached.status,
        headers: cached.headers,
      });
    }

    // 4. Cache miss: fetch from Supabase prerender function
    if (!env.SUPABASE_ANON_KEY) {
      console.error('[prerender] SUPABASE_ANON_KEY is not set');
      return botFallback(url.pathname);
    }

    let prerenderResponse;
    try {
      prerenderResponse = await fetchPrerendered(
        url.pathname,
        userAgent,
        env.SUPABASE_ANON_KEY,
        env.PRERENDER_SECRET ?? null
      );
    } catch (err) {
      console.error(`[prerender] fetch error for ${url.pathname}:`, err?.message ?? err);
      return botFallback(url.pathname);
    }

    if (!prerenderResponse.ok) {
      console.warn(`[prerender] non-OK ${prerenderResponse.status} for ${url.pathname}`);
      return botFallback(url.pathname);
    }

    const html = await prerenderResponse.text();
    if (!html || html.trim().length < 100) {
      console.warn(`[prerender] empty body for ${url.pathname}`);
      return botFallback(url.pathname);
    }

    const response = new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Prerendered': 'true',
        'Cache-Control': `public, max-age=${CACHE_TTL_WORKER}, s-maxage=${CACHE_TTL_EDGE}`,
      },
    });

    // 5. Store in Worker cache without blocking the response
    ctx.waitUntil(cache.put(cacheKey, response.clone()));

    return response;
  },
};
