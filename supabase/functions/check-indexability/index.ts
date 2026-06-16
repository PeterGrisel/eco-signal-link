import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

interface CheckResult {
  url: string;
  ok: boolean;
  status: number | null;
  finalUrl?: string;
  redirected?: boolean;
  xRobotsTag?: string | null;
  metaRobots?: string | null;
  noindex: boolean;
  nofollow: boolean;
  canonical?: string | null;
  canonicalSelfReference?: boolean | null;
  metaRefresh?: string | null;
  title?: string | null;
  description?: string | null;
  ogUrl?: string | null;
  issues: string[];
  error?: string;
}

function pickAttr(html: string, tagRegex: RegExp, attr: string): string | null {
  const m = html.match(tagRegex);
  if (!m) return null;
  const re = new RegExp(`${attr}\\s*=\\s*["']([^"']+)["']`, 'i');
  const v = m[0].match(re);
  return v ? v[1].trim() : null;
}

function normalize(u: string): string {
  try {
    const url = new URL(u);
    url.hash = '';
    let s = url.toString();
    if (s.endsWith('/') && url.pathname !== '/') s = s.slice(0, -1);
    return s.toLowerCase();
  } catch {
    return u.toLowerCase();
  }
}

async function checkOne(rawUrl: string): Promise<CheckResult> {
  const result: CheckResult = {
    url: rawUrl,
    ok: false,
    status: null,
    noindex: false,
    nofollow: false,
    issues: [],
  };

  try {
    const res = await fetch(rawUrl, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IndexabilityBot/1.0; +https://www.b2bgroeimachine.io)' },
    });

    result.status = res.status;
    result.finalUrl = res.url;
    result.redirected = normalize(res.url) !== normalize(rawUrl);
    result.xRobotsTag = res.headers.get('x-robots-tag');

    if (!res.ok) {
      result.issues.push(`HTTP ${res.status}`);
      return result;
    }

    const html = await res.text();
    const head = html.split(/<\/head>/i)[0] ?? html;

    // meta robots
    const robotsTag = head.match(/<meta[^>]+name\s*=\s*["']robots["'][^>]*>/i);
    if (robotsTag) {
      const content = robotsTag[0].match(/content\s*=\s*["']([^"']+)["']/i)?.[1] ?? '';
      result.metaRobots = content;
      if (/noindex/i.test(content)) result.noindex = true;
      if (/nofollow/i.test(content)) result.nofollow = true;
    }
    if (result.xRobotsTag && /noindex/i.test(result.xRobotsTag)) result.noindex = true;
    if (result.xRobotsTag && /nofollow/i.test(result.xRobotsTag)) result.nofollow = true;

    // canonical
    const canonical = pickAttr(head, /<link[^>]+rel\s*=\s*["']canonical["'][^>]*>/i, 'href');
    result.canonical = canonical;
    if (canonical) {
      try {
        const absCanonical = new URL(canonical, res.url).toString();
        result.canonicalSelfReference = normalize(absCanonical) === normalize(res.url);
      } catch {
        result.canonicalSelfReference = false;
      }
    }

    // meta refresh
    const refresh = head.match(/<meta[^>]+http-equiv\s*=\s*["']refresh["'][^>]*>/i);
    if (refresh) {
      result.metaRefresh = refresh[0].match(/content\s*=\s*["']([^"']+)["']/i)?.[1] ?? null;
    }

    // title / description / og:url
    result.title = head.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? null;
    result.description = pickAttr(head, /<meta[^>]+name\s*=\s*["']description["'][^>]*>/i, 'content');
    result.ogUrl = pickAttr(head, /<meta[^>]+property\s*=\s*["']og:url["'][^>]*>/i, 'content');

    // Build issues list
    if (result.noindex) result.issues.push('meta/header noindex aanwezig');
    if (!canonical) result.issues.push('Geen canonical-tag');
    else if (result.canonicalSelfReference === false) result.issues.push('Canonical wijst naar andere URL');
    if (result.metaRefresh) result.issues.push(`meta refresh actief (${result.metaRefresh})`);
    if (result.redirected) result.issues.push(`Redirect naar ${res.url}`);
    if (!result.title) result.issues.push('Geen <title>');
    if (!result.description) result.issues.push('Geen meta description');
    if (result.ogUrl && normalize(result.ogUrl) !== normalize(res.url)) {
      result.issues.push('og:url komt niet overeen met pagina');
    }

    result.ok = !result.noindex && result.status === 200 && result.issues.filter((i) => !i.startsWith('Redirect')).length === 0;
    return result;
  } catch (e) {
    result.error = (e as Error).message;
    result.issues.push(`Fetch-fout: ${result.error}`);
    return result;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    let urls: string[] = Array.isArray(body?.urls) ? body.urls : [];
    urls = urls.filter((u) => typeof u === 'string' && /^https?:\/\//.test(u)).slice(0, 60);

    if (urls.length === 0) {
      return new Response(JSON.stringify({ error: 'Geen geldige URL\'s ontvangen' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Run in batches of 6 to be polite
    const results: CheckResult[] = [];
    for (let i = 0; i < urls.length; i += 6) {
      const chunk = urls.slice(i, i + 6);
      const part = await Promise.all(chunk.map(checkOne));
      results.push(...part);
    }

    const summary = {
      total: results.length,
      ok: results.filter((r) => r.ok).length,
      withIssues: results.filter((r) => r.issues.length > 0).length,
      noindex: results.filter((r) => r.noindex).length,
    };

    return new Response(JSON.stringify({ summary, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});