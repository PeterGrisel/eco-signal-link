// Cloudflare Worker: Bot Detection & Prerender Proxy
// Custom Domain: b2bgroeimachine.io
//
// Required environment variables (Worker Settings > Variables and Secrets):
//   SUPABASE_ANON_KEY  -- Supabase project API key (anon/public)
//   PRERENDER_SECRET   -- optional shared secret validated by your Supabase function

// De canonieke host van de site. Staat hier als losse constante zodat een
// eventuele overstap naar www (of terug) op één plek gebeurt -- let op: de
// sitemap, index.html en de prerender-functie moeten dan mee.
const SITE_ORIGIN          = "https://b2bgroeimachine.io";
const DEFAULT_OG_IMAGE     = `${SITE_ORIGIN}/og/default.png`;

const PRERENDER_URL        = "https://sdhsblejnzfacqafzbuc.supabase.co/functions/v1/prerender";
const SITEMAP_URL          = "https://sdhsblejnzfacqafzbuc.supabase.co/functions/v1/sitemap";
const RSS_URL              = "https://sdhsblejnzfacqafzbuc.supabase.co/functions/v1/rss";
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

// Supported language prefixes for Weglot subdirectory routing.
// /en/* and /en  -> origin path stripped, English version served.
// All other paths default to Dutch (no prefix).
const LANG_PREFIXES = ['en'];

function parseLangPrefix(pathname) {
  const match = pathname.match(/^\/([a-z]{2})(\/.*)?$/);
  if (match && LANG_PREFIXES.includes(match[1])) {
    return { lang: match[1], rest: match[2] || '/' };
  }
  return null;
}

// HTMLRewriter handler: injects window.__WG_LANG + hreflang + canonical for translated subpaths.
class LangInjector {
  constructor(lang, pathWithoutPrefix) {
    this.lang = lang;
    this.path = pathWithoutPrefix;
    this.injectedHead = false;
    this.replacedCanonical = false;
  }
  element(element) {
    if (element.tagName === 'head' && !this.injectedHead) {
      this.injectedHead = true;
      const base = 'https://b2bgroeimachine.io';
      element.prepend(
        `<script>window.__WG_LANG=${JSON.stringify(this.lang)};</script>` +
        `<link rel="alternate" hreflang="nl" href="${base}${this.path}">` +
        `<link rel="alternate" hreflang="en" href="${base}/${this.lang}${this.path === '/' ? '' : this.path}">` +
        `<link rel="alternate" hreflang="x-default" href="${base}${this.path}">`,
        { html: true }
      );
    }
    if (element.tagName === 'link' && element.getAttribute('rel') === 'canonical' && !this.replacedCanonical) {
      this.replacedCanonical = true;
      const base = 'https://b2bgroeimachine.io';
      element.setAttribute('href', `${base}/${this.lang}${this.path === '/' ? '' : this.path}`);
    }
    if (element.tagName === 'html') {
      element.setAttribute('lang', this.lang);
    }
  }
}

function rewriteForLang(response, lang, pathWithoutPrefix) {
  return new HTMLRewriter()
    .on('head', new LangInjector(lang, pathWithoutPrefix))
    .on('link[rel="canonical"]', new LangInjector(lang, pathWithoutPrefix))
    .on('html', new LangInjector(lang, pathWithoutPrefix))
    .transform(response);
}

// 301 redirects for removed routes -> most relevant live page
const REDIRECTS_301 = {
  '/datahub': '/pipeline-equation',
  '/pricing': '/pipeline-equation',
  '/hoe-het-werkt': '/',
};

function isBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_AGENTS.some(bot => ua.includes(bot));
}

// Scrapers die alleen een linkpreview bouwen. Voor hen is een 503 het einde
// van het verhaal -- ze tonen dan niets en onthouden dat ook nog even. Zoek-
// crawlers krijgen bij een storing juist wel een 503, zodat er geen dunne
// pagina in de index belandt.
const SOCIAL_AGENTS = [
  'facebookexternalhit', 'facebot', 'twitterbot', 'linkedinbot', 'whatsapp',
  'telegrambot', 'slackbot', 'discordbot', 'embedly', 'pinterest',
  'quora link preview', 'showyoubot', 'applebot',
];

function isSocialScraper(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return SOCIAL_AGENTS.some(bot => ua.includes(bot));
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
function botFallback(pathname, userAgent) {
  return new Response(
    `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex">
  <title>B2B Groeimachine | Van omzetdoel naar opportunity flow</title>
  <meta name="description" content="Wij bouwen een commerciële opportunity-engine: een digitale medewerker die nieuwe kansen creëert, bewijs stapelt en uw verkopers stuurt naar het account dat nu telt.">
  <link rel="canonical" href="${SITE_ORIGIN}${pathname}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="B2B Groeimachine | Van omzetdoel naar opportunity flow">
  <meta property="og:description" content="Wij bouwen een commerciële opportunity-engine: een digitale medewerker die nieuwe kansen creëert, bewijs stapelt en uw verkopers stuurt naar het account dat nu telt.">
  <meta property="og:url" content="${SITE_ORIGIN}${pathname}">
  <meta property="og:image" content="${DEFAULT_OG_IMAGE}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/png">
  <meta property="og:locale" content="nl_NL">
  <meta property="og:site_name" content="B2BGroeiMachine">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${DEFAULT_OG_IMAGE}">
</head>
<body>
  <h1>B2B Groeimachine</h1>
  <p>Van omzetdoel naar opportunity flow</p>
</body>
</html>`,
    {
      // 200 voor een linkpreview, 503 voor een zoekcrawler: zie SOCIAL_AGENTS.
      status: isSocialScraper(userAgent) ? 200 : 503,
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

    // 0-pre. Language subdirectory handling (Weglot subdirectory mode)
    // /en/foo -> origin /foo + injected EN language + SEO tags.
    const langInfo = parseLangPrefix(url.pathname);
    let activeLang = null;
    let internalPath = url.pathname;
    if (langInfo) {
      activeLang = langInfo.lang;
      internalPath = langInfo.rest;
    }

    // 0a. Permanent redirects for removed routes
    const redirectTarget = REDIRECTS_301[internalPath];
    if (redirectTarget) {
      const prefix = activeLang ? `/${activeLang}` : '';
      return Response.redirect(`${SITE_ORIGIN}${prefix}${redirectTarget}`, 301);
    }

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
      const originUrl = new URL(url.toString());
      originUrl.pathname = internalPath;
      const originResp = await fetch(toOrigin(request, originUrl));
      if (!activeLang) return originResp;
      const ct = originResp.headers.get('content-type') || '';
      if (!ct.includes('text/html')) return originResp;
      return rewriteForLang(originResp, activeLang, internalPath);
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
      return botFallback(url.pathname, userAgent);
    }

    let prerenderResponse;
    try {
      prerenderResponse = await fetchPrerendered(
        internalPath,
        userAgent,
        env.SUPABASE_ANON_KEY,
        env.PRERENDER_SECRET ?? null
      );
    } catch (err) {
      console.error(`[prerender] fetch error for ${url.pathname}:`, err?.message ?? err);
      return botFallback(url.pathname, userAgent);
    }

    if (!prerenderResponse.ok) {
      console.warn(`[prerender] non-OK ${prerenderResponse.status} for ${url.pathname}`);
      return botFallback(url.pathname, userAgent);
    }

    const html = await prerenderResponse.text();
    if (!html || html.trim().length < 100) {
      console.warn(`[prerender] empty body for ${url.pathname}`);
      return botFallback(url.pathname, userAgent);
    }

    let response = new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Prerendered': 'true',
        'Cache-Control': `public, max-age=${CACHE_TTL_WORKER}, s-maxage=${CACHE_TTL_EDGE}`,
      },
    });

    if (activeLang) {
      response = rewriteForLang(response, activeLang, internalPath);
    }

    // 5. Store in Worker cache without blocking the response
    ctx.waitUntil(cache.put(cacheKey, response.clone()));

    return response;
  },
};
