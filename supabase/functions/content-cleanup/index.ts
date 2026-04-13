import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const log: string[] = [];
    const now = new Date();
    const cutoffDate = new Date(now);
    cutoffDate.setDate(cutoffDate.getDate() - 40);
    const cutoffISO = cutoffDate.toISOString();

    log.push(`🧹 Content cleanup gestart — cutoff: ${cutoffDate.toISOString().split("T")[0]} (40 dagen)`);

    // ═══════════════════════════════════════════
    // STEP 1: Find published posts older than 40 days
    // ═══════════════════════════════════════════
    const { data: oldPosts, error: postsError } = await supabase
      .from("blog_posts")
      .select("id, title, slug, published_at, meta_description")
      .eq("status", "published")
      .lt("published_at", cutoffISO)
      .order("published_at", { ascending: true });

    if (postsError) throw postsError;
    if (!oldPosts?.length) {
      log.push("✓ Geen posts ouder dan 40 dagen gevonden.");
      return new Response(JSON.stringify({ log, archived: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    log.push(`📄 ${oldPosts.length} posts ouder dan 40 dagen gevonden`);

    // ═══════════════════════════════════════════
    // STEP 2: Count pageviews per post from site_events
    // ═══════════════════════════════════════════
    const postSlugs = oldPosts.map(p => `/blog/${p.slug}`);

    // Get pageview counts for these posts (all time since publish)
    const { data: pageviews, error: pvError } = await supabase
      .from("site_events")
      .select("page_path")
      .eq("event_name", "page_view")
      .in("page_path", postSlugs);

    if (pvError) throw pvError;

    // Count pageviews per path
    const pvCounts: Record<string, number> = {};
    for (const pv of pageviews || []) {
      if (pv.page_path) {
        pvCounts[pv.page_path] = (pvCounts[pv.page_path] || 0) + 1;
      }
    }

    // ═══════════════════════════════════════════
    // STEP 3: Find low-performing posts (< 10 pageviews)
    // ═══════════════════════════════════════════
    const LOW_PV_THRESHOLD = 10;
    const lowPerformers = oldPosts.filter(p => {
      const count = pvCounts[`/blog/${p.slug}`] || 0;
      return count < LOW_PV_THRESHOLD;
    });

    log.push(`📉 ${lowPerformers.length} posts met < ${LOW_PV_THRESHOLD} pageviews`);

    // ═══════════════════════════════════════════
    // STEP 4: Find keyword duplicates among old posts
    // Extract primary keyword from meta_description/title
    // ═══════════════════════════════════════════
    const { data: allPublished } = await supabase
      .from("blog_posts")
      .select("id, title, slug, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: true });

    // Simple keyword extraction: normalize title to find near-duplicates
    function extractKeywords(title: string): string[] {
      const stopWords = new Set([
        "de", "het", "een", "van", "voor", "in", "op", "met", "en", "je", "jouw",
        "uw", "die", "dat", "is", "zijn", "als", "naar", "hoe", "wat", "waarom",
        "the", "a", "an", "of", "for", "and", "to", "how", "your", "with",
        "zo", "dé", "bij", "door", "om", "te", "er", "ook", "nog", "maar",
      ]);
      return title
        .toLowerCase()
        .replace(/[^a-z0-9\sàáâãäåèéêëìíîïòóôõöùúûüýÿ]/g, "")
        .split(/\s+/)
        .filter(w => w.length > 2 && !stopWords.has(w));
    }

    // Find posts with heavily overlapping keywords (>= 60% overlap)
    const duplicateCandidates = new Set<string>();

    if (allPublished && allPublished.length > 1) {
      const postKeywords = allPublished.map(p => ({
        id: p.id,
        slug: p.slug,
        keywords: extractKeywords(p.title),
        publishedAt: p.published_at,
      }));

      for (let i = 0; i < postKeywords.length; i++) {
        for (let j = i + 1; j < postKeywords.length; j++) {
          const a = postKeywords[i];
          const b = postKeywords[j];
          if (a.keywords.length < 2 || b.keywords.length < 2) continue;

          const setA = new Set(a.keywords);
          const overlap = b.keywords.filter(w => setA.has(w)).length;
          const overlapRatio = overlap / Math.min(a.keywords.length, b.keywords.length);

          if (overlapRatio >= 0.6) {
            // Archive the newer one (keep the older, established post)
            const newer = a.publishedAt! > b.publishedAt! ? a : b;
            // Only archive if it's also older than 40 days
            const isOldEnough = oldPosts.some(p => p.id === newer.id);
            if (isOldEnough) {
              duplicateCandidates.add(newer.id);
              log.push(`  🔄 Duplicate: "${allPublished.find(p => p.id === newer.id)?.title}" overlapt met "${allPublished.find(p => p.id === (newer.id === a.id ? b.id : a.id))?.title}"`);
            }
          }
        }
      }
    }

    log.push(`🔄 ${duplicateCandidates.size} keyword-duplicaten gevonden`);

    // ═══════════════════════════════════════════
    // STEP 5: Combine and archive
    // ═══════════════════════════════════════════
    const toArchiveIds = new Set<string>();

    // Add low performers
    for (const p of lowPerformers) {
      toArchiveIds.add(p.id);
    }

    // Add duplicates
    for (const id of duplicateCandidates) {
      toArchiveIds.add(id);
    }

    if (toArchiveIds.size === 0) {
      log.push("✅ Geen posts om te archiveren.");
      return new Response(JSON.stringify({ log, archived: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Archive the posts
    const archiveIds = Array.from(toArchiveIds);
    const { error: archiveError } = await supabase
      .from("blog_posts")
      .update({ status: "archived" } as any)
      .in("id", archiveIds);

    if (archiveError) throw archiveError;

    // Log which posts were archived
    const archivedTitles = oldPosts
      .filter(p => toArchiveIds.has(p.id))
      .map(p => p.title);

    for (const title of archivedTitles) {
      log.push(`  📦 Gearchiveerd: "${title}"`);
    }

    log.push(`✅ ${archiveIds.length} posts gearchiveerd`);

    return new Response(JSON.stringify({ log, archived: archiveIds.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("content-cleanup error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Onbekende fout" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
