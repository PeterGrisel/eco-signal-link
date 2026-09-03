// social-generate: maakt uit één bron (blog, playbook, woordenboek-term,
// give-away of vrij onderwerp) drie invalshoeken, schrijft die per gekozen
// kanaal uit en kiest per invalshoek een visual-template met ingevulde velden.
//
// Input:  { source_type, source_id?, brief?, channels?, angle_count?, skin? }
// Output: { batch, posts }
//
// De posts worden als draft opgeslagen; pushen naar Planable gebeurt daarna
// met `social-planable-push`.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  CHANNELS,
  DEFAULT_CHANNELS,
  SOURCES,
  sourceUrl,
  TEMPLATES,
  type VisualFields,
} from "../_shared/social.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MODEL = "google/gemini-3-flash-preview";

function service() {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/** Bepaalt wie de aanroeper is en of die admin is. */
async function requireAdmin(req: Request): Promise<string> {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) throw new Error("Niet ingelogd");
  const supabase = service();
  const { data: userData, error } = await supabase.auth.getUser(token);
  if (error || !userData.user) throw new Error("Niet ingelogd");
  const { data: role } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (!role) throw new Error("Alleen beheerders kunnen posts genereren");
  return userData.user.id;
}

interface SourceContext {
  title: string;
  slug: string | null;
  url: string | null;
  body: string;
  extras: Record<string, unknown>;
}

/** Haalt de brontekst van de site op zodat de posts ergens over gaan. */
async function loadSource(sourceType: string, sourceId: string | null, brief: string): Promise<SourceContext> {
  const spec = SOURCES[sourceType];
  if (!spec) throw new Error(`Onbekend brontype: ${sourceType}`);
  if (sourceType === "custom" || !sourceId) {
    if (!brief.trim()) throw new Error("Geef een bron of een eigen onderwerp mee");
    return { title: brief.slice(0, 120), slug: null, url: null, body: brief, extras: {} };
  }

  const columns = ["id", "slug", spec.titleColumn, spec.bodyColumn, ...spec.extraColumns];
  const { data, error } = await service()
    .from(spec.table)
    .select([...new Set(columns)].join(", "))
    .eq("id", sourceId)
    .maybeSingle();
  if (error) throw new Error(`Bron ophalen mislukt: ${error.message}`);
  if (!data) throw new Error("Bron niet gevonden");

  const row = data as Record<string, unknown>;
  const extras: Record<string, unknown> = {};
  for (const col of spec.extraColumns) if (row[col]) extras[col] = row[col];

  return {
    title: String(row[spec.titleColumn] ?? ""),
    slug: (row.slug as string) ?? null,
    url: row.slug ? sourceUrl(sourceType, String(row.slug)) : null,
    // De volledige tekst is voor lange artikelen te veel context en levert
    // geen betere posts op; de eerste paar duizend tekens dragen de kern.
    body: String(row[spec.bodyColumn] ?? "").slice(0, 6000),
    extras,
  };
}

const HOUSE_STYLE = [
  "Schrijf in het Nederlands op B1-niveau: korte zinnen, gewone woorden, geen jargon zonder uitleg.",
  "Geen em-dashes. Gebruik een punt, een komma of een nieuwe zin.",
  "Geen uitroeptekens, geen emoji aan het begin van een zin, hooguit spaarzaam elders.",
  "Geen marketingclichés: vermijd 'game changer', 'ontzorgen', 'in het huidige landschap', 'onze unieke aanpak'.",
  "Geen beloftes die niet uit de bron blijken. Verzin geen cijfers, klantnamen of resultaten.",
  "Elke post gaat over één ding en is op zichzelf te lezen zonder de bron.",
].join(" ");

const POSITIONING = [
  "B2BGroeiMachine bouwt commerciële opportunity-engines voor B2B-bedrijven in Nederland en België.",
  "De kern: van omzetdoel naar opportunity flow. Signalen uit eigen data bepalen welk account nu telt,",
  "het systeem stapelt bewijs en stuurt verkopers naar de volgende beste actie in hun eigen CRM.",
  "De lezer is meestal directeur, commercieel manager of sales lead bij een MKB- of midmarket-bedrijf.",
].join(" ");

function buildSystemPrompt(channels: string[], angleCount: number): string {
  const channelBlock = channels
    .map((c) => {
      const spec = CHANNELS[c];
      return `- ${c} (${spec.label}): maximaal ${spec.maxChars} tekens, ${spec.hashtags[0]} tot ${spec.hashtags[1]} hashtags. ${spec.rules}`;
    })
    .join("\n");

  const templateBlock = Object.values(TEMPLATES)
    .map((t) => `- ${t.slug}: ${t.description} Kies dit als: ${t.useWhen} Velden: ${t.fields.join(", ")}.`)
    .join("\n");

  return `Je schrijft social-posts voor B2BGroeiMachine.

${POSITIONING}

HUISSTIJL
${HOUSE_STYLE}

OPDRACHT
Maak ${angleCount} verschillende invalshoeken op dezelfde bron. Ze mogen elkaar niet overlappen:
kies bijvoorbeeld één observatie uit de praktijk, één concreet cijfer of voorbeeld, en één aanpak of stappenplan.
Schrijf elke invalshoek uit voor elk gevraagd kanaal. Dezelfde inhoud, andere lengte en toon per kanaal.

KANALEN
${channelBlock}

VISUAL-TEMPLATES
Kies per invalshoek het template dat bij de inhoud past en vul alleen de velden van dat template.
${templateBlock}

REGELS VOOR DE VISUAL
- kicker: maximaal 4 woorden, dient als label boven de kop.
- headline: maximaal 14 woorden, staat groot in beeld en moet zonder de post te lezen kloppen.
- De tekst op de visual herhaalt de eerste regel van de post niet letterlijk.
- steps: 3 tot 5 items van maximaal 8 woorden.
- stat: een kort getal zoals "3×", "62%" of "11 dagen". Alleen gebruiken als het cijfer echt in de bron staat.
- left_items en right_items: 2 tot 4 items van maximaal 7 woorden.`;
}

function buildUserPrompt(source: SourceContext, sourceType: string, brief: string, angleCount: number): string {
  const extras = Object.entries(source.extras)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
    .join("\n");

  return `BRON (${SOURCES[sourceType]?.label ?? sourceType})
Titel: ${source.title}
${source.url ? `URL: ${source.url}` : ""}
${extras ? `${extras}\n` : ""}
Tekst:
${source.body}

${brief && sourceType !== "custom" ? `EXTRA STURING VAN DE REDACTIE\n${brief}\n` : ""}
Maak ${angleCount} invalshoeken volgens de opdracht.`;
}

/** Tool-schema: dwingt het model in de vorm die de tabellen verwachten. */
function toolSchema(channels: string[]) {
  return {
    type: "function",
    function: {
      name: "deliver_posts",
      description: "Lever de gegenereerde invalshoeken met per kanaal een uitgeschreven post",
      parameters: {
        type: "object",
        properties: {
          angles: {
            type: "array",
            items: {
              type: "object",
              properties: {
                angle: { type: "string", description: "Korte naam van de invalshoek, maximaal 6 woorden" },
                visual_template: { type: "string", enum: Object.keys(TEMPLATES) },
                visual: {
                  type: "object",
                  properties: {
                    kicker: { type: "string" },
                    headline: { type: "string" },
                    subline: { type: "string" },
                    stat: { type: "string" },
                    stat_label: { type: "string" },
                    steps: { type: "array", items: { type: "string" } },
                    left_label: { type: "string" },
                    left_items: { type: "array", items: { type: "string" } },
                    right_label: { type: "string" },
                    right_items: { type: "array", items: { type: "string" } },
                  },
                  additionalProperties: false,
                },
                posts: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      channel: { type: "string", enum: channels },
                      hook: { type: "string", description: "De eerste een of twee regels van de post" },
                      body: { type: "string", description: "De volledige posttekst inclusief de hook" },
                      cta: { type: "string", description: "De afsluitende zin of vraag" },
                      hashtags: { type: "array", items: { type: "string" } },
                    },
                    required: ["channel", "hook", "body"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["angle", "visual_template", "visual", "posts"],
              additionalProperties: false,
            },
          },
        },
        required: ["angles"],
        additionalProperties: false,
      },
    },
  };
}

/** Houdt alleen de velden over die bij het gekozen template horen. */
function cleanVisual(template: string, raw: Record<string, unknown>): VisualFields {
  const spec = TEMPLATES[template] ?? TEMPLATES.statement;
  const out: Record<string, unknown> = {};
  for (const field of spec.fields) {
    const value = raw[field];
    if (Array.isArray(value)) {
      const items = value.map((v) => String(v).trim()).filter(Boolean);
      if (items.length) out[field] = items;
    } else if (typeof value === "string" && value.trim()) {
      out[field] = value.trim();
    }
  }
  return out as VisualFields;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const userId = await requireAdmin(req);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is niet geconfigureerd");

    const payload = await req.json();
    const sourceType = String(payload.source_type ?? "custom");
    const sourceId = payload.source_id ? String(payload.source_id) : null;
    const brief = String(payload.brief ?? "");
    const skin = payload.skin === "light" ? "light" : "dark";
    const angleCount = Math.min(5, Math.max(1, Number(payload.angle_count) || 3));
    const channels: string[] = (Array.isArray(payload.channels) && payload.channels.length
      ? payload.channels
      : DEFAULT_CHANNELS).filter((c: string) => CHANNELS[c]);
    if (!channels.length) throw new Error("Kies minstens één geldig kanaal");

    const source = await loadSource(sourceType, sourceId, brief);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: buildSystemPrompt(channels, angleCount) },
          { role: "user", content: buildUserPrompt(source, sourceType, brief, angleCount) },
        ],
        tools: [toolSchema(channels)],
        tool_choice: { type: "function", function: { name: "deliver_posts" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return json({ error: "Rate limit bereikt, probeer het zo opnieuw." }, 429);
      if (response.status === 402) return json({ error: "Credits op, voeg tegoed toe." }, 402);
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway gaf HTTP ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("Het model leverde geen posts op");
    const result = JSON.parse(toolCall.function.arguments);
    const angles: Array<Record<string, any>> = Array.isArray(result.angles) ? result.angles : [];
    if (!angles.length) throw new Error("Het model leverde geen invalshoeken op");

    const supabase = service();
    const { data: batch, error: batchError } = await supabase
      .from("social_post_batches")
      .insert({
        source_type: sourceType,
        source_id: sourceId,
        source_slug: source.slug,
        source_title: source.title,
        source_url: source.url,
        brief: brief || null,
        channels,
        angle_count: angles.length,
        model: MODEL,
        created_by: userId,
      })
      .select()
      .single();
    if (batchError) throw new Error(`Batch opslaan mislukt: ${batchError.message}`);

    const rows: Record<string, unknown>[] = [];
    angles.forEach((angle, angleIndex) => {
      const template = TEMPLATES[angle.visual_template] ? angle.visual_template : "statement";
      const visual = cleanVisual(template, (angle.visual ?? {}) as Record<string, unknown>);
      if (source.url && !visual.source_label && TEMPLATES[template].fields.includes("source_label")) {
        visual.source_label = new URL(source.url).host.replace(/^www\./, "") +
          new URL(source.url).pathname;
      }

      for (const post of (angle.posts ?? []) as Array<Record<string, any>>) {
        const channel = CHANNELS[post.channel] ? post.channel : channels[0];
        rows.push({
          batch_id: batch.id,
          channel,
          angle: String(angle.angle ?? `Invalshoek ${angleIndex + 1}`),
          position: angleIndex,
          hook: String(post.hook ?? "").trim(),
          body: String(post.body ?? "").trim(),
          cta: post.cta ? String(post.cta).trim() : null,
          cta_url: source.slug ? sourceUrl(sourceType, source.slug, channel) : null,
          hashtags: Array.isArray(post.hashtags)
            ? post.hashtags.map((h: unknown) => String(h).replace(/^#/, "")).filter(Boolean)
            : [],
          visual_template: template,
          visual_format: CHANNELS[channel].defaultFormat,
          visual_skin: skin,
          visual_fields: visual,
        });
      }
    });

    if (!rows.length) throw new Error("Het model leverde geen bruikbare posts op");

    const { data: posts, error: postsError } = await supabase.from("social_posts").insert(rows).select();
    if (postsError) throw new Error(`Posts opslaan mislukt: ${postsError.message}`);

    return json({ batch, posts });
  } catch (e) {
    console.error("social-generate error:", e);
    const message = e instanceof Error ? e.message : "Onbekende fout";
    const status = message.includes("ingelogd") || message.includes("beheerders") ? 403 : 500;
    return json({ error: message }, status);
  }
});
