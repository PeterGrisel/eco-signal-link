import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_blog_posts",
  title: "Lijst blogposts",
  description: "Geeft blogposts terug, optioneel gefilterd op status of zoekterm in de titel.",
  inputSchema: {
    status: z.enum(["draft", "published", "archived"]).optional().describe("Filter op status."),
    search: z.string().trim().min(1).optional().describe("Zoekterm in de titel."),
    limit: z.number().int().min(1).max(50).default(20).describe("Maximum aantal posts."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, search, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Niet ingelogd." }], isError: true };
    }
    let query = supabaseForUser(ctx)
      .from("blog_posts")
      .select("id, title, slug, status, excerpt, published_at, updated_at, is_featured")
      .order("updated_at", { ascending: false })
      .limit(limit ?? 20);
    if (status) query = query.eq("status", status);
    if (search) query = query.ilike("title", `%${search}%`);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { posts: data ?? [] },
    };
  },
});
