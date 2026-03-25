import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { keyword, audience, length, headline, content_type } = await req.json();
    const topic = headline || keyword;
    if (!topic) throw new Error("keyword or headline is required");

    const wordCount = length === "kort" ? 800 : length === "lang" ? 2500 : 1500;

    const systemPrompt = `You are an expert SEO content writer. You write in English for a professional B2B audience.

Target audience: ${audience || "Mid-to-large enterprises, business leaders, and decision-makers focused on leveraging data and AI to transform their organizations."}

Blog theme: Practical and in-depth content on AI Enablement, data-driven transformation, and flow management. Rebel Force shows how organizations apply focus, discipline, and system-level interventions to turn AI into measurable business value.

WRITING STYLE (Apply this style, voice and tone):
- Use simple, clear, conversational language — as if explaining to a friend
- Start with a bold statement, surprising fact, or the conclusion (inverted pyramid)
- Use "you" to directly address the reader
- Keep paragraphs short (2-3 sentences max)
- Use bullet points, bold text, and tables for scannability
- Include specific, actionable advice — not generic tips
- Avoid marketing fluff, promotional language, or overly complex vocabulary
- Use plain, everyday words and clear, concise phrasing
- Break down complicated concepts into bite-sized explanations
- Retain professional and technical terms critical to the subject area
- Avoid repetitive language patterns (don't start multiple points with "Remember..." or "Keep in mind...")

ARTICLE STRUCTURE:
1. Hook (1 sentence): Bold statement, surprising fact, or key benefit
2. Value Summary (2-3 sentences): Key findings, solutions, or insights
3. Quick Overview: Bullet points or comparison table of key information
4. Main sections (max 5 root sections, each with 0-3 subsections)
5. Conclusion: Summary of essential points

FORMATTING RULES:
- Use ## for H2, ### for H3, #### for H4 headers
- Headers must be cold, simple, straightforward — no marketing fluff
- Use Markdown tables where information is better suited for tabular presentation (min 3 data rows)
- Format quotes with > syntax
- Use bold, italic for emphasis
- Include comparison tables for versus/comparison articles
- No fabricated or hallucinated details
- If real examples are not available, clearly mark hypothetical cases

SEO RULES:
- Front-load the primary keyword in the title
- Use the keyword naturally in the first paragraph, headings, and throughout
- Write a meta description that summarizes key points (50-140 chars)
- Generate 5-10 relevant meta keywords

CTA: Include a subtle call-to-action mentioning Rebel Force's AI-powered enablement systems at the end.

Do not mention, reference, or compare with any direct competitors.`;

    const userPrompt = `Write a comprehensive, SEO-optimized blog article about: "${topic}"

Requirements:
- Approximately ${wordCount} words
- Content type: ${content_type || "article"}
- Follow all style, structure, and formatting rules from the system prompt
- Generate all metadata (title, meta_description, excerpt, slug, keywords)

The article should provide genuine value and actionable insights. Be direct and concrete.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
        tools: [
          {
            type: "function",
            function: {
              name: "create_article",
              description: "Create a structured blog article with SEO metadata",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Article title, max 60 characters" },
                  meta_description: { type: "string", description: "Meta description, 50-140 characters" },
                  excerpt: { type: "string", description: "Short excerpt, max 200 characters" },
                  slug: { type: "string", description: "URL slug based on title" },
                  content: { type: "string", description: "Full article content in Markdown format" },
                  keywords: { type: "string", description: "Comma-separated meta keywords, 5-10" },
                },
                required: ["title", "meta_description", "excerpt", "slug", "content"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "create_article" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit bereikt, probeer het later opnieuw." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits op. Voeg credits toe in Lovable Settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI generatie mislukt");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("Geen artikel gegenereerd");

    const article = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(article), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-article error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Onbekende fout" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
