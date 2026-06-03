import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function nextWorkday(from = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + 1);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const log: string[] = [];

  try {
    const body = await req.json().catch(() => ({}));
    const target_date: string = body.target_date || nextWorkday();
    const exclude: string[] = Array.isArray(body.exclude) ? body.exclude : [];
    const force: boolean = body.force === true;

    // Skip when this date already has an approved/generating/published item.
    if (!force) {
      const { data: taken } = await supabase
        .from("content_queue")
        .select("id, headline, status")
        .eq("scheduled_date", target_date)
        .in("status", ["approved", "generating", "published"])
        .limit(1);
      if (taken && taken.length > 0) {
        return new Response(
          JSON.stringify({ skipped: true, reason: "date_taken", existing: taken[0] }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    // 1. Load context
    const [{ data: settingsRow }, { data: posts }, { data: pages }, { data: gscRows }] =
      await Promise.all([
        supabase.from("seo_settings").select("config").limit(1).single(),
        supabase.from("blog_posts").select("title, slug").eq("status", "published").limit(200),
        supabase.from("site_pages").select("path, label").eq("is_active", true).limit(200),
        supabase
          .from("gsc_snapshots")
          .select("query, impressions, clicks, position")
          .gte("date", new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0])
          .order("impressions", { ascending: false })
          .limit(300),
      ]);

    const config = (settingsRow?.config || {}) as Record<string, any>;
    const competitorReports = config.competitor_reports || {};
    const siteUrl: string = config.site_url || "https://b2bgroeimachine.io";

    const existingSlugs = new Set<string>([
      ...((posts || []).map((p: any) => p.slug)),
      ...((pages || []).map((p: any) => String(p.path).replace(/^\//, ""))),
    ]);
    const existingTitles = (posts || []).map((p: any) => p.title);

    // Build competitor gap summary (compact)
    const competitorBlocks: string[] = [];
    for (const [domain, report] of Object.entries(competitorReports)) {
      if (domain === "__full__") continue;
      const r = report as any;
      const clusters = Array.isArray(r?.clusters) ? r.clusters.slice(0, 6) : [];
      const recs = Array.isArray(r?.recommendations) ? r.recommendations.slice(0, 5) : [];
      competitorBlocks.push(
        `### ${domain}\nClusters: ${clusters.map((c: any) => c.name || c.title || c).join(" | ")}\nAanbevelingen: ${recs.map((x: any) => (typeof x === "string" ? x : x.title || x.recommendation || "")).join(" | ")}`,
      );
    }
    const competitorSummary = competitorBlocks.join("\n\n").slice(0, 6000);

    // Long-tail candidates from GSC (impressions < 300/mnd, position > 10)
    const longTailGsc = (gscRows || [])
      .filter((r: any) => (r.impressions ?? 0) < 300 && (r.position ?? 0) > 10)
      .slice(0, 40)
      .map((r: any) => `- ${r.query} (impr ${r.impressions}, pos ${Math.round(r.position)})`)
      .join("\n");

    // Excluded items: recent headlines + caller exclude
    const { data: recentQueue } = await supabase
      .from("content_queue")
      .select("headline")
      .order("created_at", { ascending: false })
      .limit(100);
    const excludeList = [
      ...exclude,
      ...((recentQueue || []).map((r: any) => r.headline)),
      ...existingTitles,
    ];

    // 2. Ask AI
    const systemPrompt = `Je bent een SEO content strateeg voor B2BGroeiMachine.io.
Je taak: één Nederlandstalige long-tail SEO pagina voorstellen die een concrete gap dicht t.o.v. concurrenten.

REGELS:
- Long-tail: zoekvolume <300/mnd, lage concurrentie (SEO Avalanche strategie).
- B1 Nederlands, "u/uw", max 12 woorden per zin, geen em-dashes.
- Sentence case in headers (alleen eerste woord/eigennaam hoofdletter).
- Vendor-agnostisch: GEEN tool-namen als productbelofte (Clay, HubSpot, Apollo mogen genoemd worden als voorbeeld, niet als afhankelijkheid).
- Sluit healthcare en non-profit voorbeelden uit.
- Onderwerp moet aansluiten bij: signal-based prospecting, B2B leadgen automatisering, data & integraties, recruitment marketing, CLV/retention, ROI sales automation.
- Mag NIET overlappen met bestaande titels/slugs.

OUTPUT: geldig JSON, niets erbuiten.`;

    const userPrompt = `CONCURRENT GAPS:
${competitorSummary || "(geen reports)"}

LONG-TAIL KANSEN UIT GSC (vorige 30 dagen):
${longTailGsc || "(geen GSC data)"}

BESTAANDE TITELS (NIET overlappen):
${existingTitles.slice(0, 60).join(" | ")}

EXCLUDE (recent gepland of afgewezen):
${excludeList.slice(0, 40).join(" | ")}

Geef 1 voorstel als JSON met dit schema:
{
  "headline": "...",                       // titel, max 65 tekens
  "keyword": "...",                        // primair long-tail keyword
  "slug": "...",                           // url-slug, kebab-case
  "search_intent": "informational|commercial|transactional",
  "competitor_gap_source": "...",          // welke concurrent of GSC-query
  "rationale": "...",                      // 1-2 zinnen waarom dit een gap is
  "brief": {
    "search_question": "...",              // de vraag die gebruiker stelt
    "target_audience": "...",              // B2B segment
    "outline": [                           // 4-6 H2's
      { "h2": "...", "key_points": ["...", "..."] }
    ],
    "faq": [                               // 3-5 vragen
      { "q": "...", "a_hint": "..." }
    ],
    "internal_links": ["/oplossingen/...", "/sectoren/..."],
    "external_sources": ["https://..."],   // 2-3 gezaghebbende bronnen
    "primary_cta": "..."                   // 1 actie
  }
}`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiRes.ok) {
      const txt = await aiRes.text();
      throw new Error(`AI gateway ${aiRes.status}: ${txt.slice(0, 300)}`);
    }
    const aiData = await aiRes.json();
    const raw = aiData.choices?.[0]?.message?.content || "{}";
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("AI returned invalid JSON");
    }

    if (!parsed.headline || !parsed.keyword) {
      throw new Error("AI proposal missing headline or keyword");
    }

    // Guard against slug collision
    const slug = String(parsed.slug || parsed.keyword)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);
    if (existingSlugs.has(slug)) {
      throw new Error(`Slug collision: ${slug}`);
    }

    // 3. Build markdown brief stored in notes
    const b = parsed.brief || {};
    const briefMd = [
      `# Content brief: ${parsed.headline}`,
      ``,
      `**Keyword:** ${parsed.keyword}`,
      `**Intent:** ${parsed.search_intent || "informational"}`,
      `**Gap-bron:** ${parsed.competitor_gap_source || "—"}`,
      `**Doelgroep:** ${b.target_audience || "—"}`,
      ``,
      `## Zoekvraag`,
      b.search_question || "—",
      ``,
      `## Outline`,
      ...((b.outline || []).map((s: any) => `### ${s.h2}\n${(s.key_points || []).map((p: string) => `- ${p}`).join("\n")}`)),
      ``,
      `## FAQ`,
      ...((b.faq || []).map((f: any) => `- **${f.q}** — ${f.a_hint}`)),
      ``,
      `## Interne links`,
      ...((b.internal_links || []).map((l: string) => `- ${siteUrl}${l.startsWith("/") ? l : "/" + l}`)),
      ``,
      `## Externe bronnen`,
      ...((b.external_sources || []).map((u: string) => `- ${u}`)),
      ``,
      `## Primaire CTA`,
      b.primary_cta || "—",
      ``,
      `_Rationale: ${parsed.rationale || "—"}_`,
    ].join("\n");

    // 4. Insert into content_queue
    const { data: inserted, error: insertErr } = await supabase
      .from("content_queue")
      .insert({
        headline: parsed.headline,
        keyword: parsed.keyword,
        content_type: "article",
        notes: briefMd,
        scheduled_date: target_date,
        status: "approved",
      })
      .select("id")
      .single();

    if (insertErr) throw insertErr;

    log.push(`✓ Brief klaargezet: "${parsed.headline}" voor ${target_date}`);

    return new Response(
      JSON.stringify({
        queue_id: inserted.id,
        headline: parsed.headline,
        keyword: parsed.keyword,
        slug,
        scheduled_date: target_date,
        brief: parsed.brief,
        log,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("gap-keyword-miner error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Onbekende fout", log }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});