import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://b2bgroeimachine.io";

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch active site pages from database
    const { data: sitePages } = await supabase
      .from("site_pages")
      .select("path, changefreq, priority")
      .eq("is_active", true)
      .order("priority", { ascending: false });

    // Fetch published blog posts
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    const today = new Date().toISOString().split("T")[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages from database
    if (sitePages) {
      for (const page of sitePages) {
        xml += `  <url>\n`;
        xml += `    <loc>${SITE_URL}${page.path}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += `  </url>\n`;
      }
    }

    // Blog posts
    if (posts) {
      for (const post of posts) {
        const lastmod = (post.updated_at || post.published_at || today).split("T")[0];
        xml += `  <url>\n`;
        xml += `    <loc>${SITE_URL}/blog/${post.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
      }
    }

    xml += `</urlset>`;

    // JSON format for admin dashboard
    const url = new URL(req.url);
    if (url.searchParams.get("format") === "json") {
      const allUrls = [
        ...(sitePages || []).map(p => ({ url: `${SITE_URL}${p.path}`, type: "static" as const })),
        ...(posts || []).map(p => ({ url: `${SITE_URL}/blog/${p.slug}`, type: "blog" as const })),
      ];
      return new Response(JSON.stringify({ urls: allUrls, total: allUrls.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(xml, {
      headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8" },
    });
  } catch (e) {
    console.error("sitemap error:", e);
    return new Response("Error generating sitemap", { status: 500, headers: corsHeaders });
  }
});
