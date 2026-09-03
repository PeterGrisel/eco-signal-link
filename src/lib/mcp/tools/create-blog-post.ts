import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "create_blog_post",
  title: "Maak blogpost",
  description: "Maakt een nieuwe blogpost aan, standaard als concept.",
  inputSchema: {
    title: z.string().trim().min(1).describe("Titel van de post."),
    slug: z.string().trim().min(1).describe("URL-slug, kleine letters en streepjes."),
    content: z.string().min(1).describe("Inhoud in markdown, zonder H1."),
    excerpt: z.string().trim().optional().describe("Korte samenvatting."),
    meta_description: z.string().trim().optional().describe("SEO meta description."),
    status: z.enum(["draft", "published"]).default("draft").describe("Publicatiestatus."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ title, slug, content, excerpt, meta_description, status }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Niet ingelogd." }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("blog_posts")
      .insert({
        title,
        slug,
        content,
        excerpt,
        meta_description,
        status: status ?? "draft",
        author_id: ctx.getUserId(),
        published_at: status === "published" ? new Date().toISOString() : null,
      })
      .select("id, title, slug, status")
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { post: data },
    };
  },
});
