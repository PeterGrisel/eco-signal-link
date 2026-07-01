import { Hono } from "hono";
import { McpServer, StreamableHttpTransport } from "mcp-lite";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const app = new Hono();

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const mcp = new McpServer({
  name: "b2bgroeimachine",
  version: "1.0.0",
});

// ─── BLOG TOOLS ───

mcp.tool("list_blog_posts", {
  description: "List blog posts. Optionally filter by status (draft, published, archived).",
  inputSchema: {
    type: "object",
    properties: {
      status: { type: "string", enum: ["draft", "published", "archived"], description: "Filter by post status" },
      limit: { type: "number", description: "Max results (default 20)" },
    },
  },
  handler: async ({ status, limit = 20 }: { status?: string; limit?: number }) => {
    let q = supabaseAdmin
      .from("blog_posts")
      .select("id, title, slug, status, published_at, created_at, excerpt, meta_description, category_id, topic_id")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  },
});

mcp.tool("get_blog_post", {
  description: "Get a single blog post by ID or slug, including full content.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Post UUID" },
      slug: { type: "string", description: "Post slug" },
    },
  },
  handler: async ({ id, slug }: { id?: string; slug?: string }) => {
    let q = supabaseAdmin.from("blog_posts").select("*");
    if (id) q = q.eq("id", id);
    else if (slug) q = q.eq("slug", slug);
    else return { content: [{ type: "text" as const, text: "Provide either id or slug" }] };
    const { data, error } = await q.single();
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  },
});

mcp.tool("create_blog_post", {
  description: "Create a new blog post (draft by default).",
  inputSchema: {
    type: "object",
    properties: {
      title: { type: "string" },
      slug: { type: "string" },
      content: { type: "string" },
      excerpt: { type: "string" },
      meta_description: { type: "string" },
      status: { type: "string", enum: ["draft", "published"] },
      category_id: { type: "string" },
      topic_id: { type: "string" },
    },
    required: ["title", "slug", "content"],
  },
  handler: async (input: Record<string, string>) => {
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .insert({
        title: input.title,
        slug: input.slug,
        content: input.content,
        excerpt: input.excerpt || null,
        meta_description: input.meta_description || null,
        status: input.status || "draft",
        category_id: input.category_id || null,
        topic_id: input.topic_id || null,
        published_at: input.status === "published" ? new Date().toISOString() : null,
      })
      .select("id, title, slug, status")
      .single();
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: `Created: ${JSON.stringify(data)}` }] };
  },
});

mcp.tool("update_blog_post", {
  description: "Update an existing blog post by ID.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string" },
      title: { type: "string" },
      content: { type: "string" },
      excerpt: { type: "string" },
      meta_description: { type: "string" },
      status: { type: "string", enum: ["draft", "published", "archived"] },
    },
    required: ["id"],
  },
  handler: async (input: Record<string, string>) => {
    const updates: Record<string, unknown> = {};
    for (const key of ["title", "content", "excerpt", "meta_description", "status"]) {
      if (input[key] !== undefined) updates[key] = input[key];
    }
    if (updates.status === "published") updates.published_at = new Date().toISOString();
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .update(updates)
      .eq("id", input.id)
      .select("id, title, slug, status")
      .single();
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: `Updated: ${JSON.stringify(data)}` }] };
  },
});

mcp.tool("delete_blog_post", {
  description: "Delete a blog post by ID.",
  inputSchema: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  handler: async ({ id }: { id: string }) => {
    const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", id);
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: `Deleted post ${id}` }] };
  },
});

// ─── BLOG CATEGORIES ───

mcp.tool("list_blog_categories", {
  description: "List all blog categories.",
  inputSchema: { type: "object", properties: {} },
  handler: async () => {
    const { data, error } = await supabaseAdmin.from("blog_categories").select("*").order("name");
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  },
});

// ─── CONTENT QUEUE ───

mcp.tool("list_content_queue", {
  description: "List content queue items. Filter by status: pending, approved, declined, generating, published, failed.",
  inputSchema: {
    type: "object",
    properties: {
      status: { type: "string", enum: ["pending", "approved", "declined", "generating", "published", "failed"] },
      limit: { type: "number", description: "Max results (default 30)" },
    },
  },
  handler: async ({ status, limit = 30 }: { status?: string; limit?: number }) => {
    let q = supabaseAdmin
      .from("content_queue")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  },
});

mcp.tool("update_content_queue_item", {
  description: "Update a content queue item status or notes.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string" },
      status: { type: "string", enum: ["pending", "approved", "declined", "generating", "published", "failed"] },
      notes: { type: "string" },
    },
    required: ["id"],
  },
  handler: async (input: Record<string, string>) => {
    const updates: Record<string, unknown> = {};
    if (input.status) updates.status = input.status;
    if (input.notes !== undefined) updates.notes = input.notes;
    const { data, error } = await supabaseAdmin
      .from("content_queue")
      .update(updates)
      .eq("id", input.id)
      .select("id, headline, status")
      .single();
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: `Updated: ${JSON.stringify(data)}` }] };
  },
});

// ─── CONTENT TOPICS ───

mcp.tool("list_content_topics", {
  description: "List all content topics (taxonomy).",
  inputSchema: { type: "object", properties: {} },
  handler: async () => {
    const { data, error } = await supabaseAdmin.from("content_topics").select("*").order("sort_order");
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  },
});

// ─── SEO & ANALYTICS ───

mcp.tool("get_gsc_data", {
  description: "Get Google Search Console data. Optionally filter by query or page.",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Filter by search query (partial match)" },
      page: { type: "string", description: "Filter by page URL (partial match)" },
      limit: { type: "number", description: "Max results (default 50)" },
    },
  },
  handler: async ({ query, page, limit = 50 }: { query?: string; page?: string; limit?: number }) => {
    let q = supabaseAdmin
      .from("gsc_snapshots")
      .select("*")
      .order("date", { ascending: false })
      .limit(limit);
    if (query) q = q.ilike("query", `%${query}%`);
    if (page) q = q.ilike("page", `%${page}%`);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  },
});

mcp.tool("list_indexing_requests", {
  description: "List indexing requests and their status.",
  inputSchema: {
    type: "object",
    properties: {
      status: { type: "string", enum: ["pending", "requested", "indexed", "failed"] },
      limit: { type: "number", description: "Max results (default 30)" },
    },
  },
  handler: async ({ status, limit = 30 }: { status?: string; limit?: number }) => {
    let q = supabaseAdmin
      .from("indexing_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  },
});

mcp.tool("request_indexing", {
  description: "Submit a URL for Google indexing.",
  inputSchema: {
    type: "object",
    properties: { url: { type: "string" } },
    required: ["url"],
  },
  handler: async ({ url }: { url: string }) => {
    const { data, error } = await supabaseAdmin
      .from("indexing_requests")
      .insert({ url, status: "pending" })
      .select("id, url, status")
      .single();
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: `Indexing requested: ${JSON.stringify(data)}` }] };
  },
});

mcp.tool("get_monthly_evaluations", {
  description: "Get monthly SEO evaluations with performance data.",
  inputSchema: {
    type: "object",
    properties: { limit: { type: "number", description: "Max results (default 6)" } },
  },
  handler: async ({ limit = 6 }: { limit?: number }) => {
    const { data, error } = await supabaseAdmin
      .from("monthly_evaluations")
      .select("*")
      .order("month", { ascending: false })
      .limit(limit);
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  },
});

// ─── SITE ANALYTICS ───

mcp.tool("get_site_events", {
  description: "Get recent site analytics events.",
  inputSchema: {
    type: "object",
    properties: {
      event_name: { type: "string", description: "Filter by event name" },
      limit: { type: "number", description: "Max results (default 50)" },
    },
  },
  handler: async ({ event_name, limit = 50 }: { event_name?: string; limit?: number }) => {
    let q = supabaseAdmin
      .from("site_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (event_name) q = q.eq("event_name", event_name);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  },
});

// ─── CONTACT SUBMISSIONS ───

mcp.tool("list_contact_submissions", {
  description: "List recent contact form submissions.",
  inputSchema: {
    type: "object",
    properties: { limit: { type: "number", description: "Max results (default 20)" } },
  },
  handler: async ({ limit = 20 }: { limit?: number }) => {
    const { data, error } = await supabaseAdmin
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  },
});

// ─── DIRECTORY LISTINGS ───

mcp.tool("list_directory_listings", {
  description: "List directory/backlink listings and their status.",
  inputSchema: {
    type: "object",
    properties: {
      status: { type: "string", enum: ["todo", "submitted", "live", "rejected"] },
    },
  },
  handler: async ({ status }: { status?: string }) => {
    let q = supabaseAdmin
      .from("directory_listings")
      .select("*")
      .order("created_at", { ascending: false });
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  },
});

// ─── SEO SETTINGS ───

mcp.tool("get_seo_settings", {
  description: "Get the current SEO settings configuration (target audience, prompts, CTA, backlinks, etc.).",
  inputSchema: { type: "object", properties: {} },
  handler: async () => {
    const { data, error } = await supabaseAdmin
      .from("seo_settings")
      .select("*")
      .limit(1)
      .single();
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  },
});

mcp.tool("update_seo_settings", {
  description: "Update SEO settings. Pass a partial config object that will be merged with existing settings. Keys include: site_name, site_url, default_author, target_audience, tone_of_voice, competitors, cta_text, cta_url, image_style, system_prompt, backlink_domains, news_sources, video_channels, and more.",
  inputSchema: {
    type: "object",
    properties: {
      config: { type: "object", description: "Partial config object to merge with existing settings" },
    },
    required: ["config"],
  },
  handler: async ({ config }: { config: Record<string, unknown> }) => {
    const { data: current, error: fetchErr } = await supabaseAdmin
      .from("seo_settings")
      .select("id, config")
      .limit(1)
      .single();
    if (fetchErr) return { content: [{ type: "text" as const, text: `Error: ${fetchErr.message}` }] };

    const merged = { ...(current.config as Record<string, unknown>), ...config };
    const { data, error } = await supabaseAdmin
      .from("seo_settings")
      .update({ config: merged })
      .eq("id", current.id)
      .select("id, config")
      .single();
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: `Updated SEO settings: ${JSON.stringify(data, null, 2)}` }] };
  },
});

// ─── AUTH: DB-based API key validation ───

// ─── LOVART BLOG VISUAL ───

const LOVART_BASE = "https://lgw.lovart.ai";
const LOVART_PREFIX = "/v1/openapi";
const LOVART_PROJECT_ID = "odODxVnkpG";
const LOVART_STYLE_REF = "https://a.lovart.ai/artifacts/user/Sg8fWUDPMVGzWngL.png";
const LOVART_LOGO_REF = "https://a.lovart.ai/context-forge/kits/kit_b5276abe/logo/7bdd1e88.png";

async function lovartSign(method: string, path: string): Promise<Record<string, string>> {
  const ak = Deno.env.get("LOVART_ACCESS_KEY")!;
  const sk = Deno.env.get("LOVART_SECRET_KEY")!;
  const ts = Math.floor(Date.now() / 1000).toString();
  const msg = `${method}\n${path}\n${ts}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(sk),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  const sig = Array.from(new Uint8Array(sigBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return {
    "X-Access-Key": ak,
    "X-Timestamp": ts,
    "X-Signature": sig,
    "X-Signed-Method": method,
    "X-Signed-Path": path,
    "Content-Type": "application/json",
  };
}

async function lovartRequest(method: "GET" | "POST", path: string, body?: unknown, params?: Record<string, string>) {
  let url = `${LOVART_BASE}${path}`;
  if (params) url += "?" + new URLSearchParams(params).toString();
  const headers = await lovartSign(method, path);
  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Lovart ${res.status}: ${text}`);
  const json = JSON.parse(text);
  if (typeof json.code === "number" && json.code !== 0) {
    throw new Error(json.message || "Lovart error");
  }
  return json.data ?? json;
}

function buildBlogVisualPrompt(input: {
  headline: string;
  visual_concept: string;
  structure_content: string;
  key_phrases: string[];
  accent_usage: string;
  closing_question: string;
}): string {
  return `CRITICAL CONSTRAINTS - follow exactly:
- ASPECT RATIO: 1:1 SQUARE (1024x1024). NOT portrait. NOT vertical.
- LOGO: Use attachment #2 (the orange circular G icon) as the LITERAL logo image in the top-left corner. Do NOT redraw it, do NOT write logo text - paste the supplied logo file exactly as provided.
- STYLE: match attachment #1 reference exactly - spacious 3-part layout, illustrated photo-realistic characters (not flat icons), generous breathing room.

COLOR BALANCE (strict):
- Background #121212 dominates ~60%
- Cream text #EEEAE4 dominates ~30%
- Terracotta orange #E8945A only ~10% (highlights, accent words, key icons - NOT large filled shapes)

Main headline in large bold cream text: "${input.headline}"

Visual concept: ${input.visual_concept}

${input.structure_content}

Key phrases to include:
${input.key_phrases.map((p) => `- "${p}"`).join("\n")}

Use terracotta orange (#E8945A) for ${input.accent_usage}. Style: Clean, modern B2B infographic - professional with iconography. Include website "b2bgroeimachine.io" at the bottom.

Closing question at bottom in a pill-shaped box with orange question mark icon: "${input.closing_question}"

Typography: Space Grotesk for headlines, Inter for body.`;
}

mcp.tool("generate_blog_visual", {
  description:
    "Generate a B2BGroeiMachine blog visual via Lovart (project odODxVnkpG, 1:1, gpt-image-2, brand kit refs). Returns thread_id immediately - use get_blog_visual_result to fetch the image once done (typically 60-120s).",
  inputSchema: {
    type: "object",
    properties: {
      headline: { type: "string", description: "Main headline, taken verbatim from the blog" },
      slug: { type: "string", description: "Blog slug, used in output filename" },
      template_type: {
        type: "string",
        enum: ["split_comparison", "funnel_leaks", "system_engine", "signal_targeting", "framework_comparison"],
        description: "Which of the 5 canonical visual templates to use",
      },
      visual_concept: { type: "string", description: "1-2 sentence visual metaphor (e.g. 'central growth engine with two output streams')" },
      structure_content: { type: "string", description: "Detailed layout description - zones, characters, icons, labels" },
      key_phrases: { type: "array", items: { type: "string" }, description: "2-3 supporting quotes to include in the visual" },
      accent_usage: { type: "string", description: "What gets highlighted in orange (e.g. 'engine and output flows')" },
      closing_question: { type: "string", description: "Closing question for the bottom pill" },
    },
    required: ["headline", "slug", "visual_concept", "structure_content", "key_phrases", "accent_usage", "closing_question"],
  },
  handler: async (input: {
    headline: string;
    slug: string;
    template_type?: string;
    visual_concept: string;
    structure_content: string;
    key_phrases: string[];
    accent_usage: string;
    closing_question: string;
  }) => {
    try {
      const prompt = buildBlogVisualPrompt(input);
      const data = await lovartRequest("POST", `${LOVART_PREFIX}/chat`, {
        prompt,
        project_id: LOVART_PROJECT_ID,
        attachments: [LOVART_STYLE_REF, LOVART_LOGO_REF],
        tool_config: { include_tools: ["generate_image_gpt_image_2"] },
      });
      const threadId = data.thread_id;
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                thread_id: threadId,
                project_id: LOVART_PROJECT_ID,
                slug: input.slug,
                template_type: input.template_type ?? null,
                status: "running",
                canvas_url: `https://www.lovart.ai/canvas?projectId=${LOVART_PROJECT_ID}`,
                next: `Call get_blog_visual_result with thread_id="${threadId}" in 60-120s to fetch the image URL.`,
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (e) {
      return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }] };
    }
  },
});

mcp.tool("get_blog_visual_result", {
  description:
    "Fetch the result of a generate_blog_visual call by thread_id. Returns artifact URLs when done, or status='running' if still generating.",
  inputSchema: {
    type: "object",
    properties: { thread_id: { type: "string" } },
    required: ["thread_id"],
  },
  handler: async ({ thread_id }: { thread_id: string }) => {
    try {
      const status = await lovartRequest("GET", `${LOVART_PREFIX}/chat/status`, undefined, { thread_id });
      if (status.status !== "done") {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ thread_id, status: status.status }, null, 2) }],
        };
      }
      const result = await lovartRequest("GET", `${LOVART_PREFIX}/chat/result`, undefined, { thread_id });
      const artifacts: { type: string; url: string }[] = [];
      for (const item of result.items ?? []) {
        for (const a of item.artifacts ?? []) {
          if (a.content) artifacts.push({ type: a.type, url: a.content });
        }
      }

      // Mirror image artifacts to the blog-images bucket so the blog can use a self-hosted URL.
      const mirrored: { lovart_url: string; storage_url: string }[] = [];
      for (const a of artifacts) {
        if (a.type !== "image") continue;
        try {
          const r = await fetch(a.url);
          if (!r.ok) continue;
          const buf = new Uint8Array(await r.arrayBuffer());
          const ext = (a.url.split("?")[0].split(".").pop() || "png").toLowerCase();
          const safeExt = ["png", "jpg", "jpeg", "webp"].includes(ext) ? ext : "png";
          const contentType = safeExt === "jpg" ? "image/jpeg" : `image/${safeExt}`;
          const fileName = `lovart-${thread_id}-${Date.now()}.${safeExt}`;
          const { error: upErr } = await supabaseAdmin.storage
            .from("blog-images")
            .upload(fileName, buf, { contentType, upsert: false });
          if (upErr) continue;
          const { data: pub } = supabaseAdmin.storage.from("blog-images").getPublicUrl(fileName);
          mirrored.push({ lovart_url: a.url, storage_url: pub.publicUrl });
        } catch {
          // skip on failure; lovart_url stays available in artifacts
        }
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                thread_id,
                status: "done",
                artifacts,
                mirrored,
                featured_image: mirrored[0]?.storage_url ?? null,
                next: mirrored[0]
                  ? `Use update_blog_post with featured_image="${mirrored[0].storage_url}" to set this on a post.`
                  : "No image artifacts to mirror.",
                canvas_url: `https://www.lovart.ai/canvas?projectId=${LOVART_PROJECT_ID}`,
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (e) {
      return { content: [{ type: "text" as const, text: `Error: ${(e as Error).message}` }] };
    }
  },
});

// ─── CONTENT BUCKETS ───

mcp.tool("list_content_buckets", {
  description: "List all content buckets (give-away collections). Returns id, slug, name, tagline, is_published.",
  inputSchema: {
    type: "object",
    properties: {
      published_only: { type: "boolean", description: "If true, only return published buckets" },
    },
  },
  handler: async ({ published_only }: { published_only?: boolean }) => {
    let q = supabaseAdmin
      .from("content_buckets")
      .select("id, slug, name, tagline, description, cta_text, is_published, accent_color, created_at")
      .order("created_at", { ascending: false });
    if (published_only) q = q.eq("is_published", true);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  },
});

mcp.tool("get_content_bucket", {
  description: "Get a single content bucket by id or slug, including its items.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string" },
      slug: { type: "string" },
    },
  },
  handler: async ({ id, slug }: { id?: string; slug?: string }) => {
    let q = supabaseAdmin.from("content_buckets").select("*");
    if (id) q = q.eq("id", id);
    else if (slug) q = q.eq("slug", slug);
    else return { content: [{ type: "text" as const, text: "Provide either id or slug" }] };
    const { data: bucket, error } = await q.single();
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    const { data: items } = await supabaseAdmin
      .from("content_bucket_items")
      .select("id, slug, title, subtitle, layout, position, category, status, cta_text, cta_url")
      .eq("bucket_id", bucket.id)
      .order("position");
    return { content: [{ type: "text" as const, text: JSON.stringify({ ...bucket, items }, null, 2) }] };
  },
});

mcp.tool("list_bucket_items", {
  description: "List items inside a content bucket. Filter by status.",
  inputSchema: {
    type: "object",
    properties: {
      bucket_id: { type: "string" },
      bucket_slug: { type: "string", description: "Alternative to bucket_id" },
      status: { type: "string", enum: ["draft", "published", "archived"] },
    },
  },
  handler: async ({ bucket_id, bucket_slug, status }: { bucket_id?: string; bucket_slug?: string; status?: string }) => {
    let bid = bucket_id;
    if (!bid && bucket_slug) {
      const { data: b } = await supabaseAdmin.from("content_buckets").select("id").eq("slug", bucket_slug).single();
      bid = b?.id;
    }
    if (!bid) return { content: [{ type: "text" as const, text: "Provide bucket_id or bucket_slug" }] };
    let q = supabaseAdmin
      .from("content_bucket_items")
      .select("id, slug, title, subtitle, layout, position, category, status, cta_text, cta_url, updated_at")
      .eq("bucket_id", bid)
      .order("position");
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  },
});

mcp.tool("get_bucket_item", {
  description: "Get a single bucket item by id, including its full payload.",
  inputSchema: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  handler: async ({ id }: { id: string }) => {
    const { data, error } = await supabaseAdmin
      .from("content_bucket_items")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  },
});

mcp.tool("update_bucket_item", {
  description: "Update a bucket item (title, subtitle, intro, layout, status, payload, cta_text, cta_url, position, category).",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string" },
      title: { type: "string" },
      subtitle: { type: "string" },
      intro: { type: "string" },
      layout: { type: "string" },
      status: { type: "string", enum: ["draft", "published", "archived"] },
      cta_text: { type: "string" },
      cta_url: { type: "string" },
      category: { type: "string" },
      position: { type: "number" },
      payload: { type: "object", description: "Full payload JSON for the item renderer" },
    },
    required: ["id"],
  },
  handler: async (input: Record<string, unknown>) => {
    const updates: Record<string, unknown> = {};
    for (const key of ["title", "subtitle", "intro", "layout", "status", "cta_text", "cta_url", "category", "position", "payload"]) {
      if (input[key] !== undefined) updates[key] = input[key];
    }
    const { data, error } = await supabaseAdmin
      .from("content_bucket_items")
      .update(updates)
      .eq("id", input.id as string)
      .select("id, slug, title, status")
      .single();
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: `Updated: ${JSON.stringify(data)}` }] };
  },
});

mcp.tool("list_bucket_leads", {
  description: "List leads captured via content buckets. Filter by bucket and status.",
  inputSchema: {
    type: "object",
    properties: {
      bucket_id: { type: "string" },
      bucket_slug: { type: "string" },
      status: { type: "string", enum: ["pending", "confirmed", "unsubscribed"] },
      limit: { type: "number", description: "Max results (default 50)" },
    },
  },
  handler: async ({ bucket_id, bucket_slug, status, limit = 50 }: { bucket_id?: string; bucket_slug?: string; status?: string; limit?: number }) => {
    let bid = bucket_id;
    if (!bid && bucket_slug) {
      const { data: b } = await supabaseAdmin.from("content_buckets").select("id").eq("slug", bucket_slug).single();
      bid = b?.id;
    }
    let q = supabaseAdmin
      .from("content_bucket_leads")
      .select("id, bucket_id, item_id, email, name, company, status, confirmed_at, delivered_at, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (bid) q = q.eq("bucket_id", bid);
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  },
});

// ─── AUTH: DB-based API key validation ───

async function validateApiKey(token: string | undefined): Promise<{ valid: boolean; permissions: string[] | null }> {
  if (!token) return { valid: false, permissions: null };

  const { data, error } = await supabaseAdmin
    .from("mcp_api_keys")
    .select("id, is_master, permissions, is_active")
    .eq("api_key", token)
    .eq("is_active", true)
    .single();

  if (error || !data) return { valid: false, permissions: null };

  await supabaseAdmin
    .from("mcp_api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id);

  if (data.is_master) return { valid: true, permissions: null };
  return { valid: true, permissions: data.permissions as string[] | null };
}

const transport = new StreamableHttpTransport();
const httpHandler = transport.bind(mcp);

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key, accept",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const withCors = (res: Response): Response => {
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(corsHeaders)) headers.set(k, v);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
};

app.options("/*", (c) => {
  return new Response(null, { status: 204, headers: corsHeaders });
});

app.all("/*", async (c) => {
  const apiKeyHeader = c.req.header("x-api-key");
  const authHeader = c.req.header("Authorization");
  const token = apiKeyHeader || authHeader?.replace("Bearer ", "");
  const { valid } = await validateApiKey(token);
  if (!valid) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const res = await httpHandler(c.req.raw);
  return withCors(res);
});

Deno.serve(app.fetch);
