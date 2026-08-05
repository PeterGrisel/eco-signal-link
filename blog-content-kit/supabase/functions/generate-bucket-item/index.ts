import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LAYOUT_SCHEMAS: Record<string, any> = {
  scorecard: {
    type: "object",
    properties: {
      scoreRowLabel: { type: "string" },
      scoreColLabel: { type: "string" },
      scoreRows: { type: "array", items: { type: "object", properties: { label: { type: "string" }, right: { type: "string" } }, required: ["label"] } },
      scoreBands: { type: "array", items: { type: "string" } },
    },
    required: ["scoreRows", "scoreBands"],
  },
  canvas: {
    type: "object",
    properties: {
      canvasLayout: { type: "string", enum: ["columns", "grid", "matrix"] },
      canvasBlocks: { type: "array", items: { type: "object", properties: { label: { type: "string" }, hint: { type: "string" } }, required: ["label"] } },
      axisX: { type: "string" }, axisY: { type: "string" },
    },
    required: ["canvasLayout"],
  },
  worksheet: {
    type: "object",
    properties: { prompts: { type: "array", items: { type: "string" }, minItems: 4 } },
    required: ["prompts"],
  },
  checklist: {
    type: "object",
    properties: {
      groups: { type: "array", items: { type: "object", properties: { heading: { type: "string" }, items: { type: "array", items: { type: "string" } } }, required: ["heading", "items"] } },
    },
    required: ["groups"],
  },
  framework: {
    type: "object",
    properties: {
      frameVariant: { type: "string", enum: ["flow", "funnel"] },
      steps: { type: "array", items: { type: "object", properties: { label: { type: "string" }, desc: { type: "string" } }, required: ["label"] } },
      conclusion: { type: "string" },
    },
    required: ["frameVariant", "steps"],
  },
  playbook: {
    type: "object",
    properties: {
      plays: { type: "array", items: { type: "object", properties: { trigger: { type: "string" }, move: { type: "string" } }, required: ["trigger", "move"] } },
    },
    required: ["plays"],
  },
};

function slugify(t: string) {
  return t.toLowerCase()
    .replace(/[áä]/g, "a").replace(/[éë]/g, "e").replace(/[íï]/g, "i").replace(/[óö]/g, "o").replace(/[úü]/g, "u")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const { bucket_id, topic, layout } = await req.json();
    if (!bucket_id || !topic || !layout) throw new Error("bucket_id, topic en layout verplicht");
    const schema = LAYOUT_SCHEMAS[layout];
    if (!schema) throw new Error(`Onbekend layout: ${layout}`);

    const { data: bucket } = await supabase.from("content_buckets").select("*").eq("id", bucket_id).maybeSingle();
    if (!bucket) throw new Error("Bucket niet gevonden");

    const typeLabelMap: Record<string, string> = { scorecard: "SCORECARD", canvas: "CANVAS", worksheet: "WERKBLAD", checklist: "CHECKLIST", framework: "FRAMEWORK", playbook: "PLAYBOOK" };

    const sys = (bucket.generator_system_prompt as string) || "Schrijf in B1 Nederlands, helder en direct.";

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: `Genereer één ${layout}-template voor B2B-groei over: ${topic}.\nGeef een korte titel (max 4 woorden, eindigend op een woord als "Scorecard.", "Canvas.", "Playbook." passend bij het layout), een subtitel (1 woord met punt), en een intro (1 zin, max 14 woorden). En een payload die exact het schema volgt.` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "create_item",
            description: `Create one ${layout} item`,
            parameters: {
              type: "object",
              properties: {
                title: { type: "string" },
                subtitle: { type: "string" },
                intro: { type: "string" },
                payload: schema,
              },
              required: ["title", "intro", "payload"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "create_item" } },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      throw new Error(`AI fout ${resp.status}: ${t.slice(0, 200)}`);
    }
    const data = await resp.json();
    const tc = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!tc) throw new Error("Geen tool call");
    const args = JSON.parse(tc.function.arguments);

    const { count } = await supabase.from("content_bucket_items").select("id", { count: "exact", head: true }).eq("bucket_id", bucket_id);
    const position = count || 0;

    const base = slugify(args.title || topic);
    let slug = base;
    for (let i = 2; i < 20; i++) {
      const { data: dup } = await supabase.from("content_bucket_items").select("id").eq("bucket_id", bucket_id).eq("slug", slug).maybeSingle();
      if (!dup) break;
      slug = `${base}-${i}`;
    }

    const { data: created, error: insErr } = await supabase
      .from("content_bucket_items")
      .insert({
        bucket_id,
        slug,
        title: args.title,
        subtitle: args.subtitle || null,
        intro: args.intro,
        layout,
        position,
        slot_label: `AI-concept`,
        type_label: typeLabelMap[layout] || layout.toUpperCase(),
        category: "ai",
        is_bonus: false,
        status: "draft",
        payload: args.payload,
      })
      .select("*")
      .single();
    if (insErr) throw insErr;

    return new Response(JSON.stringify(created), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Onbekende fout" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});