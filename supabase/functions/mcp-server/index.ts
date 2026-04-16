import { Hono } from "hono";
import { McpServer, StreamableHttpTransport } from "mcp-lite";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const app = new Hono();

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const mcpServer = new McpServer({
  name: "b2bgroeimachine",
  version: "1.0.0",
});

// ─── BLOG TOOLS ───

mcpServer.tool({
  name: "list_blog_posts",
  description: "List blog posts. Optionally filter by status (draft, published, archived).",
  inputSchema: {
    type: "object",
    properties: {
      status: { type: "string", enum: ["draft", "published", "archived"], description: "Filter by status" },
      limit: { type: "number", description: "Max results (default 20)" },
    },
  },
  handler: async ({ status, limit }: { status?: string; limit?: number }) => {
    let q = supabaseAdmin
      .from("blog_posts")
      .select("id, title, slug, status, published_at, created_at, excerpt, meta_description, category_id, topic_id")
      .order("created_at", { ascending: false })
      .limit(limit || 20);
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
});

mcpServer.tool({
  name: "get_blog_post",
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
    else return { content: [{ type: "text", text: "Provide either id or slug" }] };
    const { data, error } = await q.single();
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
});

mcpServer.tool({
  name: "create_blog_post",
  description: "Create a new blog post (draft by default).",
  inputSchema: {
    type: "object",
    properties: {
      title: { type: "string" },
      slug: { type: "string" },
      content: { type: "string", description: "Markdown content" },
      excerpt: { type: "string" },
      meta_description: { type: "string" },
      status: { type: "string", enum: ["draft", "published"], default: "draft" },
      category_id: { type: "string" },
      topic_id: { type: "string" },
    },
    required: ["title", "slug", "content"],
  },
  handler: async (input: Record<string, unknown>) => {
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .insert({
        title: input.title as string,
        slug: input.slug as string,
        content: input.content as string,
        excerpt: (input.excerpt as string) || null,
        meta_description: (input.meta_description as string) || null,
        status: (input.status as string) || "draft",
        category_id: (input.category_id as string) || null,
        topic_id: (input.topic_id as string) || null,
        published_at: input.status === "published" ? new Date().toISOString() : null,
      })
      .select("id, title, slug, status")
      .single();
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    return { content: [{ type: "text", text: `Created: ${JSON.stringify(data)}` }] };
  },
});

mcpServer.tool({
  name: "update_blog_post",
  description: "Update an existing blog post by ID.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Post UUID" },
      title: { type: "string" },
      content: { type: "string" },
      excerpt: { type: "string" },
      meta_description: { type: "string" },
      status: { type: "string", enum: ["draft", "published", "archived"] },
    },
    required: ["id"],
  },
  handler: async (input: Record<string, unknown>) => {
    const id = input.id as string;
    const updates: Record<string, unknown> = {};
    for (const key of ["title", "content", "excerpt", "meta_description", "status"]) {
      if (input[key] !== undefined) updates[key] = input[key];
    }
    if (updates.status === "published") updates.published_at = new Date().toISOString();
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .update(updates)
      .eq("id", id)
      .select("id, title, slug, status")
      .single();
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    return { content: [{ type: "text", text: `Updated: ${JSON.stringify(data)}` }] };
  },
});

mcpServer.tool({
  name: "delete_blog_post",
  description: "Delete a blog post by ID.",
  inputSchema: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  handler: async ({ id }: { id: string }) => {
    const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", id);
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    return { content: [{ type: "text", text: `Deleted post ${id}` }] };
  },
});

// ─── BLOG CATEGORIES ───

mcpServer.tool({
  name: "list_blog_categories",
  description: "List all blog categories.",
  inputSchema: { type: "object", properties: {} },
  handler: async () => {
    const { data, error } = await supabaseAdmin.from("blog_categories").select("*").order("name");
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
});

// ─── CONTENT QUEUE ───

mcpServer.tool({
  name: "list_content_queue",
  description: "List content queue items. Filter by status: pending, approved, declined, generating, published, failed.",
  inputSchema: {
    type: "object",
    properties: {
      status: { type: "string" },
      limit: { type: "number" },
    },
  },
  handler: async ({ status, limit }: { status?: string; limit?: number }) => {
    let q = supabaseAdmin
      .from("content_queue")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit || 30);
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
});

mcpServer.tool({
  name: "update_content_queue_item",
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
  handler: async (input: Record<string, unknown>) => {
    const id = input.id as string;
    const updates: Record<string, unknown> = {};
    if (input.status) updates.status = input.status;
    if (input.notes !== undefined) updates.notes = input.notes;
    const { data, error } = await supabaseAdmin
      .from("content_queue")
      .update(updates)
      .eq("id", id)
      .select("id, headline, status")
      .single();
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    return { content: [{ type: "text", text: `Updated: ${JSON.stringify(data)}` }] };
  },
});

// ─── CONTENT TOPICS ───

mcpServer.tool({
  name: "list_content_topics",
  description: "List all content topics (taxonomy).",
  inputSchema: { type: "object", properties: {} },
  handler: async () => {
    const { data, error } = await supabaseAdmin
      .from("content_topics")
      .select("*")
      .order("sort_order");
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
});

// ─── SEO & ANALYTICS ───

mcpServer.tool({
  name: "get_gsc_data",
  description: "Get Google Search Console data. Optionally filter by query or page.",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Filter by search query (contains)" },
      page: { type: "string", description: "Filter by page URL (contains)" },
      limit: { type: "number", default: 50 },
    },
  },
  handler: async ({ query, page, limit }: { query?: string; page?: string; limit?: number }) => {
    let q = supabaseAdmin
      .from("gsc_snapshots")
      .select("*")
      .order("date", { ascending: false })
      .limit(limit || 50);
    if (query) q = q.ilike("query", `%${query}%`);
    if (page) q = q.ilike("page", `%${page}%`);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
});

mcpServer.tool({
  name: "list_indexing_requests",
  description: "List indexing requests and their status.",
  inputSchema: {
    type: "object",
    properties: {
      status: { type: "string", enum: ["pending", "requested", "indexed", "failed"] },
      limit: { type: "number" },
    },
  },
  handler: async ({ status, limit }: { status?: string; limit?: number }) => {
    let q = supabaseAdmin
      .from("indexing_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit || 30);
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
});

mcpServer.tool({
  name: "request_indexing",
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
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    return { content: [{ type: "text", text: `Indexing requested: ${JSON.stringify(data)}` }] };
  },
});

mcpServer.tool({
  name: "get_monthly_evaluations",
  description: "Get monthly SEO evaluations with performance data.",
  inputSchema: {
    type: "object",
    properties: { limit: { type: "number" } },
  },
  handler: async ({ limit }: { limit?: number }) => {
    const { data, error } = await supabaseAdmin
      .from("monthly_evaluations")
      .select("*")
      .order("month", { ascending: false })
      .limit(limit || 6);
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
});

// ─── SITE ANALYTICS ───

mcpServer.tool({
  name: "get_site_events",
  description: "Get recent site analytics events.",
  inputSchema: {
    type: "object",
    properties: {
      event_name: { type: "string" },
      limit: { type: "number" },
    },
  },
  handler: async ({ event_name, limit }: { event_name?: string; limit?: number }) => {
    let q = supabaseAdmin
      .from("site_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit || 50);
    if (event_name) q = q.eq("event_name", event_name);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
});

// ─── CONTACT SUBMISSIONS ───

mcpServer.tool({
  name: "list_contact_submissions",
  description: "List recent contact form submissions.",
  inputSchema: {
    type: "object",
    properties: { limit: { type: "number" } },
  },
  handler: async ({ limit }: { limit?: number }) => {
    const { data, error } = await supabaseAdmin
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit || 20);
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
});

// ─── DIRECTORY LISTINGS ───

mcpServer.tool({
  name: "list_directory_listings",
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
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }] };
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
});

// ─── AUTH: API key check ───

const MCP_API_KEY = Deno.env.get("MCP_API_KEY");

const transport = new StreamableHttpTransport();

app.all("/*", async (c) => {
  // Simple API key auth
  if (MCP_API_KEY) {
    const authHeader = c.req.header("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (token !== MCP_API_KEY) {
      return c.json({ error: "Unauthorized" }, 401);
    }
  }
  return await transport.handleRequest(c.req.raw, mcpServer);
});

Deno.serve(app.fetch);
