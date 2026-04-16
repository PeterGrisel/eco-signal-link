import { Hono } from "hono";
import { McpServer, StreamableHttpTransport } from "mcp-lite";
import { z } from "zod";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const app = new Hono();

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const mcp = new McpServer({
  name: "b2bgroeimachine",
  version: "1.0.0",
  schemaAdapter: (schema) => z.toJSONSchema(schema as z.ZodType),
});

// ─── BLOG TOOLS ───

mcp.tool("list_blog_posts", {
  description: "List blog posts. Optionally filter by status (draft, published, archived).",
  inputSchema: z.object({
    status: z.enum(["draft", "published", "archived"]).optional(),
    limit: z.number().optional().default(20),
  }),
  handler: async ({ status, limit }) => {
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
  inputSchema: z.object({
    id: z.string().optional(),
    slug: z.string().optional(),
  }),
  handler: async ({ id, slug }) => {
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
  inputSchema: z.object({
    title: z.string(),
    slug: z.string(),
    content: z.string(),
    excerpt: z.string().optional(),
    meta_description: z.string().optional(),
    status: z.enum(["draft", "published"]).optional().default("draft"),
    category_id: z.string().optional(),
    topic_id: z.string().optional(),
  }),
  handler: async (input) => {
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .insert({
        title: input.title,
        slug: input.slug,
        content: input.content,
        excerpt: input.excerpt || null,
        meta_description: input.meta_description || null,
        status: input.status,
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
  inputSchema: z.object({
    id: z.string(),
    title: z.string().optional(),
    content: z.string().optional(),
    excerpt: z.string().optional(),
    meta_description: z.string().optional(),
    status: z.enum(["draft", "published", "archived"]).optional(),
  }),
  handler: async (input) => {
    const updates: Record<string, unknown> = {};
    for (const key of ["title", "content", "excerpt", "meta_description", "status"] as const) {
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
  inputSchema: z.object({ id: z.string() }),
  handler: async ({ id }) => {
    const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", id);
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: `Deleted post ${id}` }] };
  },
});

// ─── BLOG CATEGORIES ───

mcp.tool("list_blog_categories", {
  description: "List all blog categories.",
  inputSchema: z.object({}),
  handler: async () => {
    const { data, error } = await supabaseAdmin.from("blog_categories").select("*").order("name");
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  },
});

// ─── CONTENT QUEUE ───

mcp.tool("list_content_queue", {
  description: "List content queue items. Filter by status: pending, approved, declined, generating, published, failed.",
  inputSchema: z.object({
    status: z.string().optional(),
    limit: z.number().optional().default(30),
  }),
  handler: async ({ status, limit }) => {
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
  inputSchema: z.object({
    id: z.string(),
    status: z.enum(["pending", "approved", "declined", "generating", "published", "failed"]).optional(),
    notes: z.string().optional(),
  }),
  handler: async (input) => {
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
  inputSchema: z.object({}),
  handler: async () => {
    const { data, error } = await supabaseAdmin.from("content_topics").select("*").order("sort_order");
    if (error) return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  },
});

// ─── SEO & ANALYTICS ───

mcp.tool("get_gsc_data", {
  description: "Get Google Search Console data. Optionally filter by query or page.",
  inputSchema: z.object({
    query: z.string().optional(),
    page: z.string().optional(),
    limit: z.number().optional().default(50),
  }),
  handler: async ({ query, page, limit }) => {
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
  inputSchema: z.object({
    status: z.enum(["pending", "requested", "indexed", "failed"]).optional(),
    limit: z.number().optional().default(30),
  }),
  handler: async ({ status, limit }) => {
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
  inputSchema: z.object({ url: z.string() }),
  handler: async ({ url }) => {
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
  inputSchema: z.object({ limit: z.number().optional().default(6) }),
  handler: async ({ limit }) => {
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
  inputSchema: z.object({
    event_name: z.string().optional(),
    limit: z.number().optional().default(50),
  }),
  handler: async ({ event_name, limit }) => {
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
  inputSchema: z.object({ limit: z.number().optional().default(20) }),
  handler: async ({ limit }) => {
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
  inputSchema: z.object({
    status: z.enum(["todo", "submitted", "live", "rejected"]).optional(),
  }),
  handler: async ({ status }) => {
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
  inputSchema: z.object({}),
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
  inputSchema: z.object({
    config: z.record(z.unknown()).describe("Partial config object to merge with existing settings"),
  }),
  handler: async ({ config }) => {
    // Get current settings first
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

async function validateApiKey(token: string | undefined): Promise<{ valid: boolean; permissions: string[] | null }> {
  if (!token) return { valid: false, permissions: null };

  const { data, error } = await supabaseAdmin
    .from("mcp_api_keys")
    .select("id, is_master, permissions, is_active")
    .eq("api_key", token)
    .eq("is_active", true)
    .single();

  if (error || !data) return { valid: false, permissions: null };

  // Update last_used_at
  await supabaseAdmin
    .from("mcp_api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id);

  if (data.is_master) return { valid: true, permissions: null }; // null = all permissions
  return { valid: true, permissions: data.permissions as string[] | null };
}

const transport = new StreamableHttpTransport();
const httpHandler = transport.bind(mcp);

app.all("/*", async (c) => {
  // Support x-api-key header (preferred) or Authorization: Bearer
  const apiKeyHeader = c.req.header("x-api-key");
  const authHeader = c.req.header("Authorization");
  const token = apiKeyHeader || authHeader?.replace("Bearer ", "");
  const { valid } = await validateApiKey(token);
  if (!valid) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  return await httpHandler(c.req.raw);
});

Deno.serve(app.fetch);
