import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://b2bgroeimachine.io";
const SITE_NAME = "B2BGroeiMachine";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

// In-memory cache with TTL
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const cache = new Map<string, { html: string; timestamp: number }>();

function getCached(key: string): string | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.html;
}

function setCache(key: string, html: string) {
  // Limit cache size to 200 entries
  if (cache.size >= 200) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
  cache.set(key, { html, timestamp: Date.now() });
}

// Static page meta data
const STATIC_PAGES: Record<
  string,
  { title: string; description: string; h1: string; content: string }
> = {
  "/": {
    title:
      "B2BGroeiMachine — Schaalbare Sales Automation & Prospecting Systemen",
    description:
      "Wij bouwen schaalbare B2B sales engines: van prospecting tot geboekte afspraken. Proces, data en resultaat voor ambitieuze bedrijven in Nederland en België.",
    h1: "Van prospecting tot geboekte afspraken",
    content: `B2BGroeiMachine bouwt schaalbare sales engines voor ambitieuze B2B-bedrijven. 
      Onze aanpak combineert signal-based prospecting, multichannel outreach en data-gedreven optimalisatie. 
      We identificeren koopsignalen, bouwen gerichte prospectlijsten, en automatiseren outreach via LinkedIn, e-mail en telefonie. 
      Het resultaat: een voorspelbare pipeline met gekwalificeerde afspraken.`,
  },
  "/over-ons": {
    title: "Over Ons — B2BGroeiMachine",
    description:
      "Leer het team achter B2BGroeiMachine kennen. Wij zijn specialisten in B2B sales automation en signal-based prospecting.",
    h1: "Over B2BGroeiMachine",
    content:
      "B2BGroeiMachine is opgericht om ambitieuze B2B-bedrijven te helpen groeien met schaalbare sales systemen.",
  },
  "/pricing": {
    title: "Pricing — B2BGroeiMachine",
    description:
      "Bekijk onze pakketten voor B2B sales automation. Van Kickstart tot Scale — kies het pakket dat past bij jouw groeiambitie.",
    h1: "Onze pakketten",
    content:
      "Kies het pakket dat past bij jouw groeiambitie. Kickstart, Growth en Scale — elk pakket bevat prospecting, outreach en een dedicated team.",
  },
  "/contact": {
    title: "Contact — B2BGroeiMachine",
    description:
      "Neem contact op met B2BGroeiMachine. Plan een vrijblijvend gesprek over B2B sales automation en prospecting.",
    h1: "Neem contact op",
    content:
      "Heb je vragen over onze diensten of wil je een vrijblijvend gesprek plannen? Neem contact met ons op.",
  },
  "/blog": {
    title: "Blog — B2BGroeiMachine",
    description:
      "Lees onze artikelen over B2B sales automation, prospecting, outreach en data-gedreven groei.",
    h1: "Blog",
    content:
      "Inzichten en best practices over B2B sales automation, signal-based prospecting en multichannel outreach.",
  },
  "/datahub": {
    title: "Datahub — B2BGroeiMachine",
    description:
      "Ontdek onze Datahub: het centrale zenuwstelsel voor al je prospecting data, signalen en campagne-inzichten.",
    h1: "Datahub",
    content:
      "De Datahub is het centrale zenuwstelsel van je sales engine. Alle data, signalen en inzichten op één plek.",
  },
  "/full-sales-management": {
    title: "Full Sales Management — B2BGroeiMachine",
    description:
      "Volledig salesmanagement uitbesteden? Wij nemen het hele traject over: van strategie tot geboekte afspraken.",
    h1: "Full Sales Management",
    content:
      "Besteed je volledige salesoperatie uit aan B2BGroeiMachine. Van strategie en prospecting tot afspraken en opvolging.",
  },
  "/full-service-recruitment": {
    title: "Full Service Recruitment — B2BGroeiMachine",
    description:
      "Recruitment via outbound? Wij bouwen een schaalbaar wervingssysteem met signal-based prospecting.",
    h1: "Full Service Recruitment",
    content:
      "Schaalbare recruitment via signal-based prospecting. Wij vinden en benaderen de juiste kandidaten proactief.",
  },
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildHtml(meta: {
  title: string;
  description: string;
  url: string;
  h1: string;
  content: string;
  extraHead?: string;
  bodyContent?: string;
}): string {
  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(meta.title)}</title>
  <meta name="description" content="${escapeHtml(meta.description)}">
  <link rel="canonical" href="${escapeHtml(meta.url)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(meta.title)}">
  <meta property="og:description" content="${escapeHtml(meta.description)}">
  <meta property="og:url" content="${escapeHtml(meta.url)}">
  <meta property="og:image" content="${DEFAULT_OG_IMAGE}">
  <meta property="og:locale" content="nl_NL">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(meta.title)}">
  <meta name="twitter:description" content="${escapeHtml(meta.description)}">
  <meta name="twitter:image" content="${DEFAULT_OG_IMAGE}">
  ${meta.extraHead || ""}
</head>
<body>
  <header>
    <nav>
      <a href="${SITE_URL}/">${SITE_NAME}</a>
      <a href="${SITE_URL}/over-ons">Over Ons</a>
      <a href="${SITE_URL}/pricing">Pricing</a>
      <a href="${SITE_URL}/blog">Blog</a>
      <a href="${SITE_URL}/contact">Contact</a>
    </nav>
  </header>
  <main>
    <h1>${escapeHtml(meta.h1)}</h1>
    <p>${escapeHtml(meta.content)}</p>
    ${meta.bodyContent || ""}
  </main>
  <footer>
    <p>&copy; 2024 ${SITE_NAME}. Alle rechten voorbehouden.</p>
  </footer>
</body>
</html>`;
}

const cacheHeaders = {
  ...corsHeaders,
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=86400",
  "X-Prerender": "1",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path") || "/";
    const noCache = url.searchParams.get("nocache") === "1";
    const pageUrl = `${SITE_URL}${path}`;

    // Check cache first
    if (!noCache) {
      const cached = getCached(path);
      if (cached) {
        return new Response(cached, {
          headers: { ...cacheHeaders, "X-Cache": "HIT" },
        });
      }
    }

    // 1. Static pages
    if (STATIC_PAGES[path]) {
      const page = STATIC_PAGES[path];
      const html = buildHtml({
        title: page.title,
        description: page.description,
        url: pageUrl,
        h1: page.h1,
        content: page.content,
      });
      setCache(path, html);
      return new Response(html, {
        headers: { ...cacheHeaders, "X-Cache": "MISS" },
      });
    }

    // 2. Blog post: /blog/:slug
    const blogMatch = path.match(/^\/blog\/([^/]+)$/);
    if (blogMatch) {
      const slug = blogMatch[1];
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const { data: post } = await supabase
        .from("blog_posts")
        .select("title, excerpt, meta_description, content, featured_image, published_at")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (post) {
        // Strip markdown to plain text for body content (simple approach)
        const plainContent = post.content
          .replace(/#{1,6}\s/g, "")
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/\*(.*?)\*/g, "$1")
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
          .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
          .replace(/```[\s\S]*?```/g, "")
          .replace(/`([^`]+)`/g, "$1")
          .replace(/\n{3,}/g, "\n\n")
          .substring(0, 2000);

        const ogImage = post.featured_image || DEFAULT_OG_IMAGE;
        const extraHead = `
          <meta property="og:type" content="article">
          <meta property="og:image" content="${escapeHtml(ogImage)}">
          <meta name="twitter:image" content="${escapeHtml(ogImage)}">
          ${post.published_at ? `<meta property="article:published_time" content="${post.published_at}">` : ""}
          <script type="application/ld+json">
          ${JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.meta_description || post.excerpt || "",
            image: ogImage,
            datePublished: post.published_at,
            author: { "@type": "Organization", name: SITE_NAME },
            publisher: { "@type": "Organization", name: SITE_NAME },
          })}
          </script>`;

        const html = buildHtml({
            title: `${post.title} — ${SITE_NAME}`,
            description: post.meta_description || post.excerpt || "",
            url: pageUrl,
            h1: post.title,
            content: plainContent,
            extraHead,
          });
        setCache(path, html);
        return new Response(html, {
          headers: { ...cacheHeaders, "X-Cache": "MISS" },
        });
      }
    }

    // 3. Sector page: /sectoren/:slug
    const sectorMatch = path.match(/^\/sectoren\/([^/]+)$/);
    if (sectorMatch) {
      const html = buildHtml({
          title: `${sectorMatch[1].replace(/-/g, " ")} — ${SITE_NAME}`,
          description: `B2B sales automation voor de ${sectorMatch[1].replace(/-/g, " ")} sector. Signal-based prospecting en multichannel outreach.`,
          url: pageUrl,
          h1: sectorMatch[1].replace(/-/g, " "),
          content: `Ontdek hoe B2BGroeiMachine bedrijven in de ${sectorMatch[1].replace(/-/g, " ")} sector helpt met schaalbare sales automation.`,
        });
      setCache(path, html);
      return new Response(html, {
        headers: { ...cacheHeaders, "X-Cache": "MISS" },
      });
    }

    // 4. Solution page: /solutions/:slug
    const solutionMatch = path.match(/^\/solutions\/([^/]+)$/);
    if (solutionMatch) {
      const html = buildHtml({
          title: `${solutionMatch[1].replace(/-/g, " ")} — ${SITE_NAME}`,
          description: `${solutionMatch[1].replace(/-/g, " ")} — onze oplossing voor ambitieuze B2B-bedrijven.`,
          url: pageUrl,
          h1: solutionMatch[1].replace(/-/g, " "),
          content: `Lees meer over onze ${solutionMatch[1].replace(/-/g, " ")} oplossing voor B2B sales automation.`,
        });
      setCache(path, html);
      return new Response(html, {
        headers: { ...cacheHeaders, "X-Cache": "MISS" },
      });
    }

    // 5. Blog index with posts list
    if (path === "/blog") {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const { data: posts } = await supabase
        .from("blog_posts")
        .select("title, slug, excerpt, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(50);

      const postsList = (posts || [])
        .map(
          (p) =>
            `<article><h2><a href="${SITE_URL}/blog/${escapeHtml(p.slug)}">${escapeHtml(p.title)}</a></h2><p>${escapeHtml(p.excerpt || "")}</p></article>`
        )
        .join("\n");

      const page = STATIC_PAGES["/blog"];
      const html = buildHtml({
          title: page.title,
          description: page.description,
          url: pageUrl,
          h1: page.h1,
          content: page.content,
          bodyContent: postsList,
        });
      setCache(path, html);
      return new Response(html, {
        headers: { ...cacheHeaders, "X-Cache": "MISS" },
      });
    }

    // Fallback: 404
    return new Response(
      buildHtml({
        title: `Pagina niet gevonden — ${SITE_NAME}`,
        description: "Deze pagina bestaat niet.",
        url: pageUrl,
        h1: "Pagina niet gevonden",
        content: "De pagina die je zoekt bestaat niet. Ga terug naar de homepage.",
      }),
      {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
      }
    );
  } catch (error) {
    console.error("Prerender error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
