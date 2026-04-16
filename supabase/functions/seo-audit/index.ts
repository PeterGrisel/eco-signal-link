import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface AuditCheck {
  category: "indexing" | "performance" | "mobile" | "content" | "structure";
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
