// Cloudflare Worker: Bot Detection & Prerender Proxy
// Deploy via: Workers & Pages > [Worker Name] > Edit Code

const PRERENDER_URL = "https://snymrcialncxkcsibkjv.supabase.co/functions/v1/prerender";

// Comprehensive bot detection list (verified crawlers only)
const BOT_AGENTS = [
  'googlebot', 'bingbot', 'yandexbot', 'duckduckbot', 'baiduspider',
  'slurp', 'facebot', 'facebookexternalhit', 'twitterbot', 'linkedinbot',
  'whatsapp', 'telegrambot', 'applebot', 'semrushbot', 'ahrefsbot',
  'mj12bot', 'dotbot', 'petalbot', 'bytespider',
  'mediapartners-google', 'adsbot-google'
];

// AI crawler user-agents (tracked separately for AI visibility metrics)
const AI_AGENTS = [
  'chatgpt-user', 'gptbot', 'oai-searchbot',
  'perplexitybot',
  'claudebot', 'claude-web',
  'google-extended',
  'cohere-ai', 'cohere-training',
  'anthropic-ai',
  'youbot',
  'ccbot',
  'meta-externalagent'
];

// Cache for prerendered content (in-memory, TTL: 1 hour)
const prerenderCache = new Map();
const PRERENDER_CACHE_TTL = 3600;

function classifyAgent(userAgent) {
  if (!userAgent) return 'human';
  const ua = userAgent.toLowerCase();

  // Check AI crawlers first (more specific)
  const isAi = AI_AGENTS.some(bot => ua.includes(bot));
  if (isAi) return 'ai';

  // Check traditional bots
  const isTraditionalBot = BOT_AGENTS.some(bot =>
    ua.includes(bot) ||
    ua.includes(`/${bot}`) ||
    ua.includes(`${bot}/`)
  );
  if (isTraditionalBot) return 'bot';

  return 'human';
}

function shouldSkipAsset(url) {
  const extension = url.pathname.split('.').pop().toLowerCase();
  const staticExtensions = [
    'js', 'css', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico',
    'woff2', 'woff', 'ttf', 'eot', 'map', 'webp', 'avif',
    'json', 'xml', 'txt', 'pdf', 'zip', 'tar', 'gz'
  ];
  return staticExtensions.includes(extension) ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/_') ||
    url.pathname.startsWith('/assets/');
}

function getCacheKey(url) {
  // Remove query parameters for consistent caching
  return url.pathname.split('?')[0];
}

async function getPrerenderedContent(request) {
  const url = new URL(request.url);
  const cacheKey = getCacheKey(url);

  // Check cache first
  if (prerenderCache.has(cacheKey)) {
    const { data, timestamp } = prerenderCache.get(cacheKey);
    if (Date.now() - timestamp < PRERENDER_CACHE_TTL * 1000) {
      return new Response(data, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Prerendered': 'true',
          'X-Cache': 'HIT'
        }
      });
    }
  }

  // Fetch prerendered content
  try {
    const prerenderResponse = await fetch(
      `${PRERENDER_URL}?path=${encodeURIComponent(url.pathname)}`,
      {
        headers: {
          'User-Agent': request.headers.get('user-agent') || '',
          'Accept': 'text/html',
        },
      }
    );

    if (prerenderResponse.ok) {
      const html = await prerenderResponse.text();

      // Cache the response
      prerenderCache.set(cacheKey, { data: html, timestamp: Date.now() });

      // Limit cache size (remove oldest entries if needed)
      if (prerenderCache.size > 100) {
        const firstKey = prerenderCache.keys().next().value;
        prerenderCache.delete(firstKey);
      }

      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Prerendered': 'true',
          'X-Cache': 'MISS',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
          // Security headers
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'Referrer-Policy': 'no-referrer-when-downgrade',
          'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
        }
      });
    }
  } catch (err) {
    console.error('[Prerender] Fetch failed:', err.message);
  }

  return null;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const userAgent = request.headers.get('user-agent') || '';

    // Log for analytics (can be viewed in Workers Analytics)
    console.log(`[${isBot(userAgent) ? 'BOT' : 'HUMAN'}] ${userAgent.substring(0, 100)} → ${url.pathname}`);

    // Skip static assets and admin routes
    if (shouldSkipAsset(url)) {
      return fetch(request);
    }

    // Check Cloudflare's bot management header (high confidence bots)
    const cfBotManagement = request.headers.get('cf-bot-management');
    if (cfBotManagement) {
      try {
        const botInfo = JSON.parse(cfBotManagement);
        if (botInfo.score >= 10) { // High confidence bot
          const result = await getPrerenderedContent(request);
          if (result) return result;
        }
      } catch (e) {
        // Fall through to UA check
      }
    }

    // Check user agent for known bots
    if (isBot(userAgent)) {
      const result = await getPrerenderedContent(request);
      if (result) return result;
    }

    // Normal users → pass through to origin
    return fetch(request);
  },
};
