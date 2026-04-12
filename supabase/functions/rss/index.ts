import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

Deno.serve(async () => {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("title, slug, excerpt, meta_description, published_at, featured_image, updated_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);

  const lastModified = posts?.[0]?.updated_at
    ? new Date(posts[0].updated_at).toUTCString()
    : new Date().toUTCString();

  const siteUrl = "https://b2bgroeimachine.io";
  const items = (posts || [])
    .map((p) => {
      const desc = p.excerpt || p.meta_description || "";
      const pubDate = p.published_at ? new Date(p.published_at).toUTCString() : "";
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${siteUrl}/blog/${escapeXml(p.slug)}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${escapeXml(p.slug)}</guid>
      <description>${escapeXml(desc)}</description>
      ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ""}
      ${p.featured_image ? `<enclosure url="${escapeXml(p.featured_image)}" type="image/jpeg" />` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>B2BGroeiMachine Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Inzichten over B2B sales, prospecting en groeistrategieën.</description>
    <language>nl</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
});
