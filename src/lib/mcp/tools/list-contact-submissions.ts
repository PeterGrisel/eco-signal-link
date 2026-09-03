import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_contact_submissions",
  title: "Lijst contactaanvragen",
  description: "Geeft de meest recente aanvragen uit het contactformulier terug.",
  inputSchema: {
    limit: z.number().int().min(1).max(50).default(20).describe("Maximum aantal aanvragen."),
    search: z.string().trim().min(1).optional().describe("Zoekterm in naam of bedrijf."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, search }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Niet ingelogd." }], isError: true };
    }
    let query = supabaseForUser(ctx)
      .from("contact_submissions")
      .select("id, name, email, company, phone, message, created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);
    if (search) query = query.or(`name.ilike.%${search}%,company.ilike.%${search}%`);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { submissions: data ?? [] },
    };
  },
});
