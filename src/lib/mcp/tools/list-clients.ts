import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_clients",
  title: "Lijst klanten",
  description: "Geeft de klanten (logo's) van B2BGroeiMachine terug met sector en website.",
  inputSchema: {
    only_visible: z.boolean().default(true).describe("Alleen zichtbare klanten tonen."),
    limit: z.number().int().min(1).max(100).default(50).describe("Maximum aantal klanten."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ only_visible, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Niet ingelogd." }], isError: true };
    }
    let query = supabaseForUser(ctx)
      .from("client_logos")
      .select("id, name, domain, website, sector, description, is_visible, sort_order")
      .order("sort_order", { ascending: true })
      .limit(limit ?? 50);
    if (only_visible !== false) query = query.eq("is_visible", true);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { clients: data ?? [] },
    };
  },
});
