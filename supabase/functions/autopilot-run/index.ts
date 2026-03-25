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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = getSupabase();
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const log: string[] = [];

    // Step 1: Check if there are topics with gaps
    const { data: topics } = await supabase
      .from("content_topics")
      .select("id, name, target_article_count, status")
      .eq("status", "active");

    if (!topics?.length) {
      log.push("Geen actieve topics gevonden. Maak topics aan in Content Strategie.");
      return new Response(JSON.stringify({ log, actions: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 2: Check for approved items ready to generate
    const { data: approved } = await supabase
      .from("content_queue")
      .select("id, headline, keyword, content_type, topic_id")
      .eq("status", "approved")
      .limit(2); // Max 2 per run to avoid rate limits

    let articlesGenerated = 0;

    if (approved?.length) {
      for (const item of approved) {
        log.push(`Genereren: "${item.headline}"`);
        await supabase.from("content_queue").update({ status: "generating" as any }).eq("id", item.id);

        try {
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
            }),
          });

          if (!articleRes.ok) throw new Error(`Article generation failed: ${articleRes.status}`);
          const articleData = await articleRes.json();
          if (articleData.error) throw new Error(articleData.error);

          // Generate image (non-blocking)
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
          } catch (imgErr) {
            log.push(`Afbeelding generatie mislukt voor "${item.headline}", doorgaan zonder`);
          }

          // Save and publish directly
          const { data: post, error: postError } = await supabase.from("blog_posts").insert({
            title: articleData.title,
            slug: articleData.slug,
            content: articleData.content,
            excerpt: articleData.excerpt,
            meta_description: articleData.meta_description,
            featured_image: featuredImage,
            topic_id: item.topic_id || null,
            status: "published",
            published_at: new Date().toISOString(),
          }).select("id").single();

          if (postError) throw postError;

          await supabase.from("content_queue").update({
            status: "published" as any,
            blog_post_id: post.id,
          }).eq("id", item.id);

          log.push(`✓ "${articleData.title}" opgeslagen als draft`);
          articlesGenerated++;
        } catch (e: any) {
          await supabase.from("content_queue").update({
            status: "failed" as any,
            error_message: e.message,
          }).eq("id", item.id);
          log.push(`✗ Mislukt: "${item.headline}" — ${e.message}`);
        }
      }
    }

    // Step 3: If no approved items, check if we need new headlines
    if (!approved?.length) {
      const { data: pending } = await supabase
        .from("content_queue")
        .select("id")
        .in("status", ["pending", "approved"])
        .limit(1);

      if (!pending?.length) {
        log.push("Geen pending/approved headlines. Genereren van nieuwe headlines...");

        // Get existing headlines to avoid duplicates
        const { data: existing } = await supabase
          .from("content_queue")
          .select("headline")
          .order("created_at", { ascending: false })
          .limit(100);

        const existingHeadlines = existing?.map(e => e.headline) || [];

        const headlineRes = await fetch(`${supabaseUrl}/functions/v1/generate-headlines`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${serviceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            count: 5,
            content_types: ["article", "tool"],
            existing_headlines: existingHeadlines,
          }),
        });

        if (headlineRes.ok) {
          const headlineData = await headlineRes.json();
          if (headlineData.headlines?.length) {
            // Auto-approve headlines in full autopilot mode
            const rows = headlineData.headlines.map((h: any) => ({
              headline: h.headline,
              content_type: h.content_type,
              keyword: h.keyword,
              notes: h.notes,
              topic_id: h.topic_id || null,
              status: "approved", // Auto-approve in full autopilot
            }));

            const { error: insertError } = await supabase.from("content_queue").insert(rows);
            if (insertError) throw insertError;
            log.push(`✓ ${headlineData.headlines.length} headlines gegenereerd en auto-approved`);
          }
        }
      } else {
        log.push("Er staan al headlines in de queue. Wachten op verwerking.");
      }
    }

    return new Response(JSON.stringify({ log, articles_generated: articlesGenerated }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("autopilot-run error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Onbekende fout" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
