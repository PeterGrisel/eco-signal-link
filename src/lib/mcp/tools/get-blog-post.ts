import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_blog_post",
  title: "Haal blogpost op",
  description: "Haalt één blogpost op inclusief volledige inhoud, op slug of id.",
  inputSchema: {
    slug: z.string().trim().min(1).optional().describe("Slug van de post."),
    id: z.string().uuid().optional().describe("Id van de post."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug, id }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Niet ingelogd." }], isError: true };
    }
    if (!slug && !id) {
      return { content: [{ type: "text", text: "Geef een slug of id op." }], isError: true };
    }
    let query = supabaseForUser(ctx).from("blog_posts").select("*");
    query = id ? query.eq("id", id) : query.eq("slug", slug!);
    const { data, error } = await query.maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: "Geen blogpost gevonden." }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { post: data },
    };
  },
});
