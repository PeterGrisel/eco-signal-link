import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface AuditCheck {
  category: "indexing" | "performance" | "mobile" | "content" | "structure" | "agentic";
  status: "pass" | "warning" | "fail";
  title: string;
  detail: string;
  impact: "high" | "medium" | "low";
}

async function fetchWithTimeout(url: string, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json().catch(() => ({}));
    const { site_url } = body;

    // Get site URL from settings if not provided
    let baseUrl = site_url;
    if (!baseUrl) {
      const { data: settings } = await supabase.from("seo_settings").select("config").limit(1).single();
      baseUrl = (settings?.config as any)?.site_url || "https://b2bgroeimachine.io";
    }
    baseUrl = baseUrl.replace(/\/$/, "");

    const checks: AuditCheck[] = [];
    const startTime = Date.now();

    // ── 1. Homepage load & response time ──
    try {
      const t0 = Date.now();
      const homeRes = await fetchWithTimeout(baseUrl);
      const loadTime = Date.now() - t0;
      const html = await homeRes.text();

      checks.push({
        category: "performance",
        status: loadTime < 1500 ? "pass" : loadTime < 3000 ? "warning" : "fail",
        title: "Homepage laadtijd",
        detail: `${loadTime}ms (server response). ${loadTime < 1500 ? "Uitstekend" : loadTime < 3000 ? "Acceptabel maar kan beter" : "Te traag, optimalisatie nodig"}`,
        impact: loadTime > 3000 ? "high" : "medium",
      });

      // ── 2. Meta tags check ──
      const hasTitle = /<title[^>]*>.+<\/title>/i.test(html);
      const hasMetaDesc = /<meta[^>]*name=["']description["'][^>]*content=["'][^"']+["']/i.test(html);
      const hasViewport = /<meta[^>]*name=["']viewport["']/i.test(html);
      const hasCanonical = /<link[^>]*rel=["']canonical["']/i.test(html);
      const hasHreflang = /<link[^>]*hreflang/i.test(html);
      const hasJsonLd = /application\/ld\+json/i.test(html);
      const hasOgTags = /<meta[^>]*property=["']og:/i.test(html);
      const h1Count = (html.match(/<h1[\s>]/gi) || []).length;

      checks.push({
        category: "content",
        status: hasTitle && hasMetaDesc ? "pass" : "fail",
        title: "Title & Meta Description",
        detail: `Title: ${hasTitle ? "✓" : "✗"}, Meta desc: ${hasMetaDesc ? "✓" : "✗"}`,
        impact: "high",
      });

      checks.push({
        category: "mobile",
        status: hasViewport ? "pass" : "fail",
        title: "Viewport meta tag",
        detail: hasViewport ? "Viewport tag aanwezig" : "Viewport tag ontbreekt — mobiele weergave is broken",
        impact: "high",
      });

      checks.push({
        category: "structure",
        status: hasCanonical ? "pass" : "warning",
        title: "Canonical tag",
        detail: hasCanonical ? "Canonical tag aanwezig" : "Canonical tag ontbreekt — risico op duplicate content",
        impact: "medium",
      });

      checks.push({
        category: "structure",
        status: hasJsonLd ? "pass" : "warning",
        title: "Structured Data (JSON-LD)",
        detail: hasJsonLd ? "JSON-LD structured data gevonden" : "Geen structured data — minder rich snippets",
        impact: "medium",
      });

      checks.push({
        category: "content",
        status: hasOgTags ? "pass" : "warning",
        title: "Open Graph tags",
        detail: hasOgTags ? "OG tags aanwezig voor social sharing" : "Geen OG tags — social previews ontbreken",
        impact: "low",
      });

      checks.push({
        category: "content",
        status: h1Count === 1 ? "pass" : h1Count === 0 ? "fail" : "warning",
        title: "H1 heading",
        detail: h1Count === 1 ? "Precies 1 H1 tag ✓" : h1Count === 0 ? "Geen H1 tag gevonden" : `${h1Count} H1 tags gevonden — er moet er 1 zijn`,
        impact: h1Count === 0 ? "high" : "medium",
      });

      // ── 3. HTTPS check ──
      checks.push({
        category: "performance",
        status: baseUrl.startsWith("https") ? "pass" : "fail",
        title: "HTTPS",
        detail: baseUrl.startsWith("https") ? "Site gebruikt HTTPS ✓" : "Geen HTTPS — Google bestraft dit zwaar",
        impact: "high",
      });

    } catch (e: any) {
      checks.push({
        category: "performance",
        status: "fail",
        title: "Homepage bereikbaarheid",
        detail: `Kan homepage niet laden: ${e.message}`,
        impact: "high",
      });
    }

    // ── 4. Robots.txt ──
    try {
      const robotsRes = await fetchWithTimeout(`${baseUrl}/robots.txt`);
      const robotsTxt = await robotsRes.text();
      const hasSitemap = /sitemap/i.test(robotsTxt);
      const blocksAll = /Disallow:\s*\/\s*$/m.test(robotsTxt);

      checks.push({
        category: "indexing",
        status: robotsRes.ok && !blocksAll ? "pass" : blocksAll ? "fail" : "warning",
        title: "Robots.txt",
        detail: blocksAll
          ? "KRITIEK: robots.txt blokkeert alle crawlers!"
          : robotsRes.ok
            ? `Robots.txt gevonden${hasSitemap ? " met sitemap referentie ✓" : " maar GEEN sitemap referentie"}`
            : "Robots.txt niet gevonden",
        impact: blocksAll ? "high" : "medium",
      });
    } catch {
      checks.push({
        category: "indexing",
        status: "warning",
        title: "Robots.txt",
        detail: "Kon robots.txt niet ophalen",
        impact: "medium",
      });
    }

    // ── 5. Sitemap.xml ──
    try {
      const sitemapRes = await fetchWithTimeout(`${baseUrl}/sitemap.xml`);
      if (sitemapRes.ok) {
        const sitemapText = await sitemapRes.text();
        const urlCount = (sitemapText.match(/<url>/gi) || []).length;
        checks.push({
          category: "indexing",
          status: urlCount > 0 ? "pass" : "warning",
          title: "Sitemap.xml",
          detail: `Sitemap gevonden met ${urlCount} URL's`,
          impact: "high",
        });
      } else {
        checks.push({
          category: "indexing",
          status: "fail",
          title: "Sitemap.xml",
          detail: `Sitemap retourneerde status ${sitemapRes.status}`,
          impact: "high",
        });
      }
    } catch {
      checks.push({
        category: "indexing",
        status: "fail",
        title: "Sitemap.xml",
        detail: "Sitemap niet bereikbaar",
        impact: "high",
      });
    }

    // ── 6. Key pages check (conversion pages) ──
    const { data: convPages } = await supabase.from("conversion_pages").select("url, label").eq("is_active", true);
    if (convPages?.length) {
      for (const page of convPages.slice(0, 5)) {
        try {
          const pageUrl = page.url.startsWith("http") ? page.url : `${baseUrl}${page.url}`;
          const t0 = Date.now();
          const pRes = await fetchWithTimeout(pageUrl);
          const pTime = Date.now() - t0;
          checks.push({
            category: "performance",
            status: pRes.ok && pTime < 2000 ? "pass" : pRes.ok ? "warning" : "fail",
            title: `Conversie-pagina: ${page.label}`,
            detail: pRes.ok ? `Status ${pRes.status}, ${pTime}ms` : `Status ${pRes.status} — pagina niet bereikbaar!`,
            impact: "high",
          });
        } catch {
          checks.push({
            category: "performance",
            status: "fail",
            title: `Conversie-pagina: ${page.label}`,
            detail: "Pagina niet bereikbaar",
            impact: "high",
          });
        }
      }
    }

    // ── 6b. Agentic browsing (Lighthouse-inspired) ──
    // Inspired by Lighthouse's agentic-browsing category: signals that help
    // AI agents (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.)
    // discover, parse en interact with the site.
    try {
      const homeRes = await fetchWithTimeout(baseUrl);
      const html = await homeRes.text();

      // llms.txt — emerging standard for AI-readable site guidance
      try {
        const llmsRes = await fetchWithTimeout(`${baseUrl}/llms.txt`);
        if (llmsRes.ok) {
          const txt = (await llmsRes.text()).trim();
          checks.push({
            category: "agentic",
            status: txt.length > 100 ? "pass" : "warning",
            title: "llms.txt aanwezig",
            detail: txt.length > 100
              ? `llms.txt gevonden (${txt.length} tekens) — geeft AI-agents context over uw site`
              : "llms.txt bestaat maar is erg kort — voeg meer context toe voor AI-agents",
            impact: "medium",
          });
        } else {
          checks.push({
            category: "agentic",
            status: "warning",
            title: "llms.txt aanwezig",
            detail: "Geen /llms.txt gevonden — AI-agents missen gestructureerde site-context",
            impact: "medium",
          });
        }
      } catch {
        checks.push({
          category: "agentic",
          status: "warning",
          title: "llms.txt aanwezig",
          detail: "Kon /llms.txt niet ophalen",
          impact: "low",
        });
      }

      // AI bot allowlist in robots.txt
      try {
        const robotsRes = await fetchWithTimeout(`${baseUrl}/robots.txt`);
        const robotsTxt = robotsRes.ok ? await robotsRes.text() : "";
        const aiBots = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "OAI-SearchBot"];
        const blocked: string[] = [];
        for (const bot of aiBots) {
          const re = new RegExp(`User-agent:\\s*${bot}[\\s\\S]*?Disallow:\\s*/\\s*$`, "im");
          if (re.test(robotsTxt)) blocked.push(bot);
        }
        checks.push({
          category: "agentic",
          status: blocked.length === 0 ? "pass" : "warning",
          title: "AI-crawlers toegelaten",
          detail: blocked.length === 0
            ? "Geen AI-bots geblokkeerd in robots.txt — site is vindbaar voor LLM's"
            : `Geblokkeerd: ${blocked.join(", ")} — overweeg of dit gewenst is voor AI-zichtbaarheid`,
          impact: "medium",
        });
      } catch {
        // skip silently
      }

      // Semantic landmarks — agents leunen op <main>, <nav>, <header>, <article>
      const hasMain = /<main[\s>]/i.test(html);
      const hasNav = /<nav[\s>]/i.test(html);
      const hasHeader = /<header[\s>]/i.test(html);
      const landmarkCount = [hasMain, hasNav, hasHeader].filter(Boolean).length;
      checks.push({
        category: "agentic",
        status: landmarkCount === 3 ? "pass" : landmarkCount >= 2 ? "warning" : "fail",
        title: "Semantische landmarks",
        detail: `Gevonden: ${[hasMain && "<main>", hasNav && "<nav>", hasHeader && "<header>"].filter(Boolean).join(", ") || "geen"}. AI-agents gebruiken deze om content te scopen.`,
        impact: "medium",
      });

      // Accessible names — buttons & links zonder zichtbare tekst of aria-label
      const buttons = [...html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi)];
      let unnamed = 0;
      for (const b of buttons) {
        const tag = b[0];
        const inner = b[1].replace(/<[^>]+>/g, "").trim();
        const hasAria = /aria-label\s*=\s*["'][^"']+["']/i.test(tag);
        if (!inner && !hasAria) unnamed++;
      }
      if (buttons.length > 0) {
        checks.push({
          category: "agentic",
          status: unnamed === 0 ? "pass" : unnamed <= 2 ? "warning" : "fail",
          title: "Knoppen met toegankelijke naam",
          detail: unnamed === 0
            ? `Alle ${buttons.length} knoppen hebben tekst of aria-label`
            : `${unnamed}/${buttons.length} knoppen missen tekst én aria-label — agents kunnen ze niet betrouwbaar bedienen`,
          impact: unnamed > 2 ? "high" : "medium",
        });
      }

      // Images zonder alt
      const imgs = [...html.matchAll(/<img\b[^>]*>/gi)];
      const noAlt = imgs.filter(m => !/alt\s*=\s*["']/i.test(m[0])).length;
      if (imgs.length > 0) {
        checks.push({
          category: "agentic",
          status: noAlt === 0 ? "pass" : noAlt <= 2 ? "warning" : "fail",
          title: "Alt-teksten op afbeeldingen",
          detail: noAlt === 0
            ? `Alle ${imgs.length} afbeeldingen hebben een alt-attribuut`
            : `${noAlt}/${imgs.length} afbeeldingen zonder alt — AI-agents missen visuele context`,
          impact: "medium",
        });
      }

      // JSON-LD breedte (Organization / Article / FAQPage signalen)
      const jsonLdBlocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
      const types = new Set<string>();
      for (const block of jsonLdBlocks) {
        const m = block[1].match(/"@type"\s*:\s*"([^"]+)"/g) || [];
        m.forEach(s => {
          const t = s.match(/"@type"\s*:\s*"([^"]+)"/);
          if (t) types.add(t[1]);
        });
      }
      checks.push({
        category: "agentic",
        status: types.size >= 2 ? "pass" : types.size === 1 ? "warning" : "fail",
        title: "Rijkdom structured data",
        detail: types.size > 0
          ? `${types.size} @type(s) gevonden: ${[...types].slice(0, 6).join(", ")}`
          : "Geen JSON-LD types gevonden — agents missen entiteitsinformatie",
        impact: "medium",
      });
    } catch (e: any) {
      checks.push({
        category: "agentic",
        status: "warning",
        title: "Agentic browsing scan",
        detail: `Scan onvolledig: ${e.message}`,
        impact: "low",
      });
    }

    // ── 7. Blog posts without meta ──
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("title, slug, meta_description, featured_image, content, topic_id")
      .eq("status", "published")
      .limit(200);

    if (posts?.length) {
      const noMeta = posts.filter(p => !p.meta_description);
      const noImage = posts.filter(p => !p.featured_image);

      // Internal linking analysis
      const slugSet = new Set(posts.map(p => p.slug));
      const linkStats = posts.map(p => {
        const content = p.content || "";
        const mdLinks = [...content.matchAll(/\]\((\/[^)\s]+|https?:\/\/[^)\s]+)\)/g)].map(m => m[1]);
        let internalOut = 0;
        let intraCluster = 0;
        let linksToPillar = false;
        for (const href of mdLinks) {
          const path = href.replace(/^https?:\/\/[^/]+/, "");
          if (path.startsWith("/pipeline-equation")) linksToPillar = true;
          const blogMatch = path.match(/^\/blog\/([^/?#]+)/);
          if (blogMatch && blogMatch[1] !== p.slug && slugSet.has(blogMatch[1])) {
            internalOut++;
            const target = posts.find(pp => pp.slug === blogMatch[1]);
            if (target && p.topic_id && target.topic_id === p.topic_id) intraCluster++;
          }
        }
        return { slug: p.slug, title: p.title, internalOut, intraCluster, linksToPillar, topic_id: p.topic_id };
      });

      const orphans = linkStats.filter(s => s.internalOut === 0);
      const noPillar = linkStats.filter(s => !s.linksToPillar);
      const topicHasSiblings = (topicId: string | null) =>
        !!topicId && posts.filter(pp => pp.topic_id === topicId).length > 1;
      const weakCluster = linkStats.filter(s => topicHasSiblings(s.topic_id) && s.intraCluster === 0);

      if (orphans.length > 0) {
        checks.push({
          category: "structure",
          status: orphans.length > posts.length / 3 ? "fail" : "warning",
          title: "Orphan posts (geen interne links)",
          detail: `${orphans.length}/${posts.length} posts linken naar geen enkele andere blogpost: ${orphans.slice(0, 3).map(o => o.title).join(", ")}${orphans.length > 3 ? "..." : ""}`,
          impact: "medium",
        });
      }

      if (noPillar.length > 0) {
        checks.push({
          category: "structure",
          status: noPillar.length > posts.length / 2 ? "fail" : "warning",
          title: "Posts zonder link naar Pipeline Score",
          detail: `${noPillar.length}/${posts.length} posts linken niet naar /pipeline-equation (de primaire lead magnet)`,
          impact: "high",
        });
      }

      if (weakCluster.length > 0) {
        checks.push({
          category: "structure",
          status: "warning",
          title: "Posts zonder intra-cluster links",
          detail: `${weakCluster.length} posts hebben topic-siblings maar linken er niet naar — topical authority lekt weg: ${weakCluster.slice(0, 3).map(w => w.title).join(", ")}${weakCluster.length > 3 ? "..." : ""}`,
          impact: "medium",
        });
      }
      
      if (noMeta.length > 0) {
        checks.push({
          category: "content",
          status: noMeta.length > 5 ? "fail" : "warning",
          title: "Blog posts zonder meta description",
          detail: `${noMeta.length}/${posts.length} posts missen een meta description: ${noMeta.slice(0, 3).map(p => p.title).join(", ")}${noMeta.length > 3 ? "..." : ""}`,
          impact: "high",
        });
      }

      if (noImage.length > 0) {
        checks.push({
          category: "content",
          status: "warning",
          title: "Blog posts zonder featured image",
          detail: `${noImage.length}/${posts.length} posts missen een afbeelding`,
          impact: "low",
        });
      }
    }

    // ── 8. Indexing status ──
    const { data: indexReqs } = await supabase
      .from("indexing_requests")
      .select("url, status")
      .limit(200);

    if (indexReqs?.length) {
      const failed = indexReqs.filter(r => r.status === "failed");
      const pending = indexReqs.filter(r => r.status === "pending");
      if (failed.length > 0) {
        checks.push({
          category: "indexing",
          status: "fail",
          title: "Mislukte indexering verzoeken",
          detail: `${failed.length} URL's zijn niet geïndexeerd: ${failed.slice(0, 3).map(f => f.url.replace(baseUrl, "")).join(", ")}`,
          impact: "high",
        });
      }
      if (pending.length > 0) {
        checks.push({
          category: "indexing",
          status: "warning",
          title: "Pending indexering verzoeken",
          detail: `${pending.length} URL's wachten nog op indexering`,
          impact: "medium",
        });
      }
    }

    const auditTime = Date.now() - startTime;

    // Calculate score
    const totalChecks = checks.length;
    const passed = checks.filter(c => c.status === "pass").length;
    const warnings = checks.filter(c => c.status === "warning").length;
    const fails = checks.filter(c => c.status === "fail").length;
    const score = Math.round(((passed + warnings * 0.5) / totalChecks) * 100);

    const result = {
      score,
      audit_time_ms: auditTime,
      summary: {
        total: totalChecks,
        passed,
        warnings,
        fails,
      },
      checks,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("seo-audit error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Onbekende fout" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
