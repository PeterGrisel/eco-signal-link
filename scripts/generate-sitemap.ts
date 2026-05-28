import { writeFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://b2bgroeimachine.io";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/over-ons", changefreq: "monthly", priority: "0.7" },
  { path: "/ons-team", changefreq: "monthly", priority: "0.6" },
  { path: "/full-sales-management", changefreq: "monthly", priority: "0.8" },
  { path: "/full-service-recruitment", changefreq: "monthly", priority: "0.8" },
  { path: "/pipeline-equation", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "daily", priority: "0.8" },
  { path: "/playbooks", changefreq: "daily", priority: "0.8" },
  { path: "/cheatsheets", changefreq: "weekly", priority: "0.7" },
  { path: "/trainingen", changefreq: "monthly", priority: "0.7" },
  { path: "/partners", changefreq: "monthly", priority: "0.6" },
  { path: "/brandstory", changefreq: "monthly", priority: "0.5" },
  { path: "/brandbook", changefreq: "monthly", priority: "0.4" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
  { path: "/b2b-leadgeneratie", changefreq: "monthly", priority: "0.9" },
  { path: "/leads-genereren-b2b", changefreq: "monthly", priority: "0.8" },
  { path: "/online-leadgeneratie", changefreq: "monthly", priority: "0.8" },
  { path: "/zakelijke-leads", changefreq: "monthly", priority: "0.8" },
  { path: "/signaal", changefreq: "weekly", priority: "0.8" },
  { path: "/cheatsheet/signal-prospecting", changefreq: "monthly", priority: "0.6" },
  { path: "/cheatsheet/linkedin-outreach", changefreq: "monthly", priority: "0.6" },
  { path: "/cheatsheet/hubspot-pipeline", changefreq: "monthly", priority: "0.6" },
  { path: "/cheatsheet/icp-ai", changefreq: "monthly", priority: "0.6" },
  { path: "/cheatsheet/multichannel-sequencing", changefreq: "monthly", priority: "0.6" },
  { path: "/cheatsheet/gamma-presentaties", changefreq: "monthly", priority: "0.6" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/cookies", changefreq: "yearly", priority: "0.3" },
  // Sector pages
  { path: "/sectoren/profvoetbal", changefreq: "monthly", priority: "0.7" },
  { path: "/sectoren/groothandel", changefreq: "monthly", priority: "0.7" },
  { path: "/sectoren/leasemaatschappijen", changefreq: "monthly", priority: "0.7" },
  { path: "/sectoren/engineering", changefreq: "monthly", priority: "0.7" },
  { path: "/sectoren/zakelijke-dienstverlening", changefreq: "monthly", priority: "0.7" },
  { path: "/sectoren/financiele-sector", changefreq: "monthly", priority: "0.7" },
  { path: "/sectoren/maakindustrie", changefreq: "monthly", priority: "0.7" },
  { path: "/sectoren/opleiding-training", changefreq: "monthly", priority: "0.7" },
  { path: "/sectoren/it-software", changefreq: "monthly", priority: "0.7" },
  { path: "/sectoren/bouw-en-renovatie", changefreq: "monthly", priority: "0.7" },
  { path: "/sectoren/technische-dienstverlening", changefreq: "monthly", priority: "0.7" },
  // Solution pages
  { path: "/solutions/voorspelbare-pipeline", changefreq: "monthly", priority: "0.7" },
  { path: "/solutions/outbound-automatisering", changefreq: "monthly", priority: "0.7" },
  { path: "/solutions/commercieel-talent", changefreq: "monthly", priority: "0.7" },
  { path: "/solutions/data-gedreven-sales", changefreq: "monthly", priority: "0.7" },
  { path: "/solutions/schaalbaar-groeisysteem", changefreq: "monthly", priority: "0.7" },
  { path: "/solutions/internationaal-uitbreiden", changefreq: "monthly", priority: "0.7" },
  { path: "/solutions/versnipperde-tools", changefreq: "monthly", priority: "0.7" },
  { path: "/solutions/weg-uit-excel", changefreq: "monthly", priority: "0.7" },
  { path: "/solutions/gerichte-prospecting", changefreq: "monthly", priority: "0.7" },
];

function formatDate(dateStr: string | null | undefined): string | undefined {
  if (!dateStr) return undefined;
  try {
    const d = new Date(dateStr);
    return d.toISOString().split("T")[0];
  } catch {
    return undefined;
  }
}

async function generateSitemap() {
  const entries: SitemapEntry[] = [...staticEntries];

  if (SUPABASE_URL && SUPABASE_KEY) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false },
    });

    // Fetch blog posts
    try {
      const { data: posts } = await supabase
        .from("blog_posts")
        .select("slug, published_at")
        .eq("status", "published")
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false })
        .limit(1000);

      if (posts && posts.length > 0) {
        for (const post of posts) {
          entries.push({
            path: `/blog/${post.slug}`,
            lastmod: formatDate(post.published_at),
            changefreq: "weekly",
            priority: "0.8",
          });
        }
      }
    } catch (err) {
      console.warn("Failed to fetch blog posts for sitemap:", err);
    }

    // Fetch playbooks
    try {
      const { data: playbooks } = await supabase
        .from("playbooks")
        .select("slug, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(1000);

      if (playbooks && playbooks.length > 0) {
        for (const pb of playbooks) {
          entries.push({
            path: `/playbooks/${pb.slug}`,
            lastmod: formatDate(pb.published_at),
            changefreq: "weekly",
            priority: "0.8",
          });
        }
      }
    } catch (err) {
      console.warn("Failed to fetch playbooks for sitemap:", err);
    }
  } else {
    console.warn("Supabase credentials not found, generating sitemap with static entries only.");
  }

  const urls = entries.map((e) => {
    const lines = [`  <url>`, `    <loc>${BASE_URL}${e.path}</loc>`];
    if (e.lastmod) lines.push(`    <lastmod>${e.lastmod}</lastmod>`);
    if (e.changefreq) lines.push(`    <changefreq>${e.changefreq}</changefreq>`);
    if (e.priority) lines.push(`    <priority>${e.priority}</priority>`);
    lines.push(`  </url>`);
    return lines.join("\n");
  });

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");

  writeFileSync(resolve("public/sitemap.xml"), xml);
  console.log(`sitemap.xml written (${entries.length} entries)`);
}

generateSitemap().catch((err) => {
  console.error("Sitemap generation failed:", err);
  process.exit(1);
});
