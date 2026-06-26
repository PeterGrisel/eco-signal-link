import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

/**
 * Verwijder kapotte externe links uit markdown content.
 * Houdt de anchor text (tussen [..]) over en gooit de link weg.
 * Verwijdert ook bare <url> en bare http(s) URLs.
 */
function stripBrokenLinks(content: string, brokenUrls: string[]): string {
  let out = content;
  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (const url of brokenUrls) {
    const u = esc(url);
    // [anchor](url)  -> anchor
    out = out.replace(new RegExp(`\\[([^\\]]+)\\]\\(${u}\\)`, "g"), "$1");
    // <url> -> ""
    out = out.replace(new RegExp(`<${u}>`, "g"), "");
    // bare url -> ""
    out = out.replace(new RegExp(u, "g"), "");
  }
  return out;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = getSupabase();
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const log: string[] = [];

    const body = await req.json().catch(() => ({}));
    const { mode = "nightly" } = body;

    // ═══════════════════════════════════════════════
    // MODE: full_pipeline — Strategy → Headlines → Schedule
    // ═══════════════════════════════════════════════
    if (mode === "full_pipeline") {
      log.push("🚀 Full AI Pipeline gestart...");

      // Step 1: Run strategy agent
      log.push("📊 Stap 1: Content strategie analyseren...");
      const strategyRes = await fetch(`${supabaseUrl}/functions/v1/strategy-agent`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mode: "generate" }),
      });

      if (!strategyRes.ok) throw new Error(`Strategy agent failed: ${strategyRes.status}`);
      const strategy = await strategyRes.json();
      if (strategy.error) throw new Error(strategy.error);

      log.push(`✓ Strategie: ${strategy.clusters?.length || 0} clusters geïdentificeerd`);

      // Step 2: Insert topic clusters
      if (strategy.clusters?.length) {
        for (const cluster of strategy.clusters) {
          const { data: existing } = await supabase
            .from("content_topics")
            .select("id")
            .eq("slug", cluster.slug)
            .maybeSingle();

          if (!existing) {
            await supabase.from("content_topics").insert({
              name: cluster.name,
              slug: cluster.slug,
              description: cluster.description,
              target_keywords: cluster.target_keywords || [],
              target_article_count: cluster.target_article_count || 5,
              priority: cluster.priority || 0,
              status: "active",
            });
            log.push(`  + Topic: "${cluster.name}"`);
          } else {
            log.push(`  ○ Topic "${cluster.name}" bestaat al`);
          }
        }
      }

      // Step 3: Generate headlines for gaps
      log.push("📝 Stap 2: Headlines genereren voor gaps...");
      const { data: existingQueue } = await supabase
        .from("content_queue")
        .select("headline")
        .limit(200);

      const headlineRes = await fetch(`${supabaseUrl}/functions/v1/generate-headlines`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          count: 20,
          content_types: ["article", "tool"],
          existing_headlines: existingQueue?.map(e => e.headline) || [],
        }),
      });

      if (!headlineRes.ok) throw new Error(`Headline generation failed: ${headlineRes.status}`);
      const headlineData = await headlineRes.json();
      if (headlineData.error) throw new Error(headlineData.error);

      // Step 4: Insert headlines with scheduled dates (weekdays only, skip dates already taken)
      if (headlineData.headlines?.length) {
        // Fetch existing scheduled dates to avoid duplicates
        const { data: existingDates } = await supabase
          .from("content_queue")
          .select("scheduled_date")
          .in("status", ["approved", "generating", "published"])
          .not("scheduled_date", "is", null);

        const takenDates = new Set((existingDates || []).map(d => d.scheduled_date));

        const today = new Date();
        let scheduledDate = new Date(today);
        scheduledDate.setDate(scheduledDate.getDate() + 1);

        const rows = headlineData.headlines.map((h: any) => {
          // Skip weekends and already-taken dates
          while (
            scheduledDate.getDay() === 0 ||
            scheduledDate.getDay() === 6 ||
            takenDates.has(scheduledDate.toISOString().split("T")[0])
          ) {
            scheduledDate.setDate(scheduledDate.getDate() + 1);
          }
          const dateStr = scheduledDate.toISOString().split("T")[0];
          takenDates.add(dateStr); // mark as taken for next iteration
          scheduledDate.setDate(scheduledDate.getDate() + 1);

          return {
            headline: h.headline,
            content_type: h.content_type,
            keyword: h.keyword,
            notes: h.notes,
            topic_id: h.topic_id || null,
            status: "approved",
            scheduled_date: dateStr,
          };
        });

        const { error: insertError } = await supabase.from("content_queue").insert(rows);
        if (insertError) throw insertError;
        log.push(`✓ ${rows.length} headlines ingepland van ${rows[0].scheduled_date} t/m ${rows[rows.length - 1].scheduled_date}`);
      }

      log.push("✅ Full pipeline compleet!");
      return new Response(JSON.stringify({ log, strategy_summary: strategy.summary }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ═══════════════════════════════════════════════
    // MODE: nightly — Generate article for today's scheduled item
    // Runs at 2:00 AM via cron
    // ═══════════════════════════════════════════════
    if (mode === "nightly") {
      const today = body.target_date || new Date().toISOString().split("T")[0];
      log.push(`🌙 Nachtelijke generatie voor ${today}`);

      // Guard: skip if ANY post is created OR published on `today` (covers manual + autopilot)
      const dayStart = `${today}T00:00:00Z`;
      const dayEnd = `${today}T23:59:59Z`;
      const [{ data: createdToday }, { data: publishedToday }] = await Promise.all([
        supabase.from("blog_posts").select("id, slug").gte("created_at", dayStart).lt("created_at", dayEnd).limit(1),
        supabase.from("blog_posts").select("id, slug").gte("published_at", dayStart).lt("published_at", dayEnd).limit(1),
      ]);
      const existing = (createdToday?.[0] || publishedToday?.[0]) ?? null;
      if (existing) {
        log.push(`⚠ Er bestaat al een blogpost voor ${today} (${existing.slug}), overslaan.`);
        return new Response(JSON.stringify({ log, articles_generated: 0, skipped: "post_exists_for_date" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Also guard: check if any queue item for today is already generating/published
      const { data: todayQueue } = await supabase
        .from("content_queue")
        .select("id, status")
        .eq("scheduled_date", today)
        .in("status", ["generating", "published"])
        .limit(1);

      if (todayQueue && todayQueue.length > 0) {
        log.push("⚠ Er is vandaag al een item in verwerking/gepubliceerd, overslaan.");
        return new Response(JSON.stringify({ log, articles_generated: 0 }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Find today's scheduled + approved item (strict limit 1)
      const { data: todayItems } = await supabase
        .from("content_queue")
        .select("id, headline, keyword, content_type, topic_id, notes")
        .eq("status", "approved")
        .eq("scheduled_date", today)
        .order("created_at", { ascending: true })
        .limit(1);

      let item = todayItems?.[0] || null;

      if (!item) {
        // Fallback: pick oldest approved item without date
        const { data: fallback } = await supabase
          .from("content_queue")
          .select("id, headline, keyword, content_type, topic_id, notes")
          .eq("status", "approved")
          .is("scheduled_date", null)
          .order("created_at", { ascending: true })
          .limit(1);

        item = fallback?.[0] || null;
      }

      // Last resort: ask the gap-keyword-miner to create one on-the-fly.
      if (!item) {
        log.push("🔎 Geen item gepland — gap-keyword-miner uitvoeren...");
        try {
          const minerRes = await fetch(`${supabaseUrl}/functions/v1/gap-keyword-miner`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${serviceKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ target_date: today, force: true }),
          });
          if (minerRes.ok) {
            const minerData = await minerRes.json();
            if (minerData.queue_id) {
              const { data: fresh } = await supabase
                .from("content_queue")
                .select("id, headline, keyword, content_type, topic_id, notes")
                .eq("id", minerData.queue_id)
                .single();
              item = fresh || null;
              if (item) log.push(`✓ Brief gegenereerd: "${item.headline}"`);
            }
          } else {
            log.push(`⚠ gap-keyword-miner faalde (${minerRes.status})`);
          }
        } catch (e) {
          log.push(`⚠ gap-keyword-miner crashte: ${(e as Error).message}`);
        }
      }

      if (!item) {
        log.push("Geen artikelen gepland voor vandaag.");
        return new Response(JSON.stringify({ log, articles_generated: 0 }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      log.push(`Genereren: "${item.headline}"`);
      await supabase.from("content_queue").update({ status: "generating" as any }).eq("id", item.id);

      try {
        // Duplicate guard: skip if a blog post with same topic_id OR same date already exists
        const dupQueries: Promise<any>[] = [
          supabase.from("blog_posts").select("id, slug")
            .gte("created_at", dayStart).lt("created_at", dayEnd).limit(1),
          supabase.from("blog_posts").select("id, slug")
            .gte("published_at", dayStart).lt("published_at", dayEnd).limit(1),
        ];
        if (item.topic_id) {
          dupQueries.push(
            supabase.from("blog_posts").select("id, slug").eq("topic_id", item.topic_id).limit(1),
          );
        }
        const dupResults = await Promise.all(dupQueries);
        const dup = dupResults.map((r: any) => r?.data?.[0]).find(Boolean);
        if (dup) {
          log.push(`⚠ Duplicate guard: er bestaat al een post voor ${today} of topic (${dup.slug}), overslaan.`);
          await supabase.from("content_queue").update({
            status: "published" as any,
            blog_post_id: dup.id,
            error_message: "Skipped: duplicate (date of topic_id)",
          }).eq("id", item.id);
          return new Response(JSON.stringify({ log, articles_generated: 0, skipped: "duplicate_for_date_or_topic" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Generate article
        const articleRes = await fetch(`${supabaseUrl}/functions/v1/generate-article`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${serviceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            headline: item.headline,
            keyword: item.keyword || item.headline,
            content_type: item.content_type,
            length: "lang",
            brief: item.notes || undefined,
          }),
        });

        if (!articleRes.ok) throw new Error(`Article generation failed: ${articleRes.status}`);
        const articleData = await articleRes.json();
        if (articleData.error) throw new Error(articleData.error);

        // Generate image
        let featuredImage: string | null = null;
        try {
          const imgRes = await fetch(`${supabaseUrl}/functions/v1/generate-blog-image`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${serviceKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: articleData.title,
              keyword: item.keyword || item.headline,
            }),
          });
          if (imgRes.ok) {
            const imgData = await imgRes.json();
            if (imgData.image_url) featuredImage = imgData.image_url;
          }
        } catch {
          log.push("Afbeelding generatie mislukt, doorgaan zonder");
        }

        // Auto-publish: save as published immediately
        // First validate external links — broken links worden uit de content gestript zodat
        // de post alsnog gepubliceerd wordt. Voorkomt dat één 404 de hele publish-flow blokkeert.
        let publishStatus: "published" | "draft" = "published";
        let brokenLinks: Array<{ url: string; status: number; reason?: string }> = [];
        let cleanedContent = articleData.content as string;
        try {
          const validateRes = await fetch(`${supabaseUrl}/functions/v1/validate-external-links`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${serviceKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: articleData.content }),
          });
          if (validateRes.ok) {
            const v = await validateRes.json();
            brokenLinks = v.broken || [];
            if (brokenLinks.length > 0) {
              cleanedContent = stripBrokenLinks(cleanedContent, brokenLinks.map((b) => b.url));
              log.push(
                `⚠ ${brokenLinks.length} dode externe link(s) gestript, post wordt alsnog gepubliceerd:`
              );
              for (const b of brokenLinks.slice(0, 5)) {
                log.push(`   • [${b.reason ?? b.status}] ${b.url}`);
              }
            } else {
              log.push(`✓ Externe links gecheckt (${v.checked} ok)`);
            }
          } else {
            await validateRes.text();
            log.push("⚠ Link-validatie mislukt, doorgaan met publiceren");
          }
        } catch {
          log.push("⚠ Link-validatie crashte, doorgaan met publiceren");
        }

        const { data: post, error: postError } = await supabase.from("blog_posts").insert({
          title: articleData.title,
          slug: articleData.slug,
          content: cleanedContent,
          excerpt: articleData.excerpt,
          meta_description: articleData.meta_description,
          featured_image: featuredImage,
          topic_id: item.topic_id || null,
          status: publishStatus,
          published_at: publishStatus === "published" ? new Date().toISOString() : null,
        }).select("id, slug").single();

        if (postError) throw postError;

        // Update queue item — only mark as published when we actually published.
        // When link-check failed we mark as 'failed' with an error_message so it surfaces
        // in the admin queue for manual fix + re-approve.
        await supabase.from("content_queue").update({
          status: (publishStatus === "published" ? "published" : "failed") as any,
          blog_post_id: post.id,
          ...(brokenLinks.length > 0
            ? { error_message: `Dode externe links: ${brokenLinks.map((b) => b.url).join(", ").slice(0, 500)}` }
            : {}),
        }).eq("id", item.id);

        if (publishStatus === "published") {
          log.push(`✓ "${articleData.title}" automatisch gepubliceerd`);
        } else {
          log.push(`⏸ "${articleData.title}" opgeslagen als draft (link-check vereist)`);
        }

        // Skip indexing + prerender when we didn't actually publish.
        if (publishStatus !== "published") {
          return new Response(JSON.stringify({ log, articles_generated: 1, broken_links: brokenLinks }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Auto-request indexing
        try {
          const { data: settings } = await supabase.from("seo_settings").select("config").limit(1).single();
          const siteUrl = (settings?.config as any)?.site_url || "https://b2bgroeimachine.io";
          const fullUrl = `${siteUrl}/blog/${post.slug}`;

          await supabase.from("indexing_requests").insert({
            url: fullUrl,
            status: "pending",
          });

          try {
            await fetch(`${supabaseUrl}/functions/v1/request-indexing`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${serviceKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ urls: [fullUrl] }),
            });
            log.push(`✓ Indexering aangevraagd voor ${fullUrl}`);
          } catch {
            log.push(`⚠ Indexering aanvraag mislukt`);
          }

          // Cache warming
          try {
            const prerenderRes = await fetch(
              `${supabaseUrl}/functions/v1/prerender?path=${encodeURIComponent(`/blog/${post.slug}`)}&nocache=1`,
              { headers: { Authorization: `Bearer ${serviceKey}` } }
            );
            if (prerenderRes.ok) {
              await prerenderRes.text();
              log.push(`✓ Prerender cache opgewarmd voor /blog/${post.slug}`);
            } else {
              await prerenderRes.text();
            }
          } catch {}
        } catch {
          log.push("⚠ Kon indexering niet starten");
        }
      } catch (e: any) {
        await supabase.from("content_queue").update({
          status: "failed" as any,
          error_message: e.message,
        }).eq("id", item.id);
        log.push(`✗ Mislukt: "${item.headline}" — ${e.message}`);
      }

      return new Response(JSON.stringify({ log, articles_generated: 1 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ═══════════════════════════════════════════════
    // MODE: approve_publish — Admin approves → publish + index
    // ═══════════════════════════════════════════════
    if (mode === "approve_publish") {
      const { queue_id } = body;
      if (!queue_id) throw new Error("queue_id is required");

      const { data: queueItem } = await supabase
        .from("content_queue")
        .select("id, blog_post_id, headline")
        .eq("id", queue_id)
        .single();

      if (!queueItem?.blog_post_id) throw new Error("Geen blog post gekoppeld");

      // Publish the blog post
      const { error: publishError } = await supabase
        .from("blog_posts")
        .update({
          status: "published",
          published_at: new Date().toISOString(),
        } as any)
        .eq("id", queueItem.blog_post_id);

      if (publishError) throw publishError;

      // Update queue status
      await supabase.from("content_queue").update({
        status: "published" as any,
      }).eq("id", queue_id);

      log.push(`✓ "${queueItem.headline}" gepubliceerd`);

      // Auto-request indexing
      try {
        const { data: post } = await supabase
          .from("blog_posts")
          .select("slug")
          .eq("id", queueItem.blog_post_id)
          .single();

        if (post?.slug) {
          const { data: settings } = await supabase.from("seo_settings").select("config").limit(1).single();
          const siteUrl = (settings?.config as any)?.site_url || "https://b2bgroeimachine.io";
          const fullUrl = `${siteUrl}/blog/${post.slug}`;

          // Insert indexing request
          await supabase.from("indexing_requests").insert({
            url: fullUrl,
            status: "pending",
          });

          // Try to request indexing
          try {
            await fetch(`${supabaseUrl}/functions/v1/request-indexing`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${serviceKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ urls: [fullUrl] }),
            });
            log.push(`✓ Indexering aangevraagd voor ${fullUrl}`);
          } catch {
            log.push(`⚠ Indexering aanvraag mislukt, handmatig opnieuw proberen`);
          }

          // Cache warming: prerender de nieuwe blogpost zodat bots en AI-crawlers direct content krijgen
          try {
            const prerenderRes = await fetch(
              `${supabaseUrl}/functions/v1/prerender?path=${encodeURIComponent(`/blog/${post.slug}`)}&nocache=1`,
              { headers: { Authorization: `Bearer ${serviceKey}` } }
            );
            if (prerenderRes.ok) {
              await prerenderRes.text(); // consume body
              log.push(`✓ Prerender cache opgewarmd voor /blog/${post.slug}`);
            } else {
              log.push(`⚠ Prerender warming mislukt (${prerenderRes.status})`);
              await prerenderRes.text();
            }
          } catch {
            log.push(`⚠ Prerender warming mislukt`);
          }
        }
      } catch {
        log.push("⚠ Kon indexering niet starten");
      }

      return new Response(JSON.stringify({ log }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown mode" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("autopilot-run error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Onbekende fout" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
