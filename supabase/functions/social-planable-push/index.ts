// social-planable-push: zet de gegenereerde posts als concept klaar in Planable.
//
// Input:  { batch_id } of { post_ids: [...] }, optioneel { dry_run: true }
// Output: { results: [{ post_id, ok, planable_post_id?, error?, first_comment? }] }
//
// Configuratie:
// - Secret  PLANABLE_API_TOKEN   (token pln_..., nooit in code of in de client)
// - Secret  PLANABLE_WORKSPACE_ID en PLANABLE_PAGES (JSON: kanaal → page-id),
//   of hetzelfde onder seo_settings.config.planable zodat het in de admin
//   aan te passen is zonder opnieuw te deployen.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  type CanonicalPayload,
  composeContent,
  extractPostId,
  findCreatePostOperation,
  mapPayload,
  type OperationInfo,
} from "./planable.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BASE = "https://api.planable.io/api/v1";
const DEFAULT_CREATE_PATH = "/posts";

function service() {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function requireAdmin(req: Request): Promise<void> {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) throw new Error("Niet ingelogd");
  const supabase = service();
  const { data: userData, error } = await supabase.auth.getUser(token);
  if (error || !userData.user) throw new Error("Niet ingelogd");
  const { data: role } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (!role) throw new Error("Alleen beheerders kunnen posts naar Planable sturen");
}

interface PlanableConfig {
  workspaceId: string;
  pages: Record<string, string>;
}

/** Env gaat voor; de rest komt uit seo_settings zodat het in de admin instelbaar is. */
async function loadConfig(): Promise<PlanableConfig> {
  const { data } = await service().from("seo_settings").select("config").limit(1).maybeSingle();
  const stored = ((data?.config ?? {}) as Record<string, any>).planable ?? {};

  let envPages: Record<string, string> = {};
  const rawPages = Deno.env.get("PLANABLE_PAGES");
  if (rawPages) {
    try {
      envPages = JSON.parse(rawPages);
    } catch {
      console.warn("PLANABLE_PAGES is geen geldige JSON en wordt genegeerd");
    }
  }

  return {
    workspaceId: Deno.env.get("PLANABLE_WORKSPACE_ID") ?? stored.workspace_id ?? "",
    pages: { ...(stored.pages ?? {}), ...envPages },
  };
}

/** Haalt de spec één keer per aanroep op; een fout is niet fataal. */
async function loadOperation(token: string): Promise<OperationInfo | null> {
  try {
    const res = await fetch(`${BASE}/openapi.json`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    if (!res.ok) return null;
    return findCreatePostOperation(await res.json());
  } catch (e) {
    console.warn("Planable openapi.json niet leesbaar:", e);
    return null;
  }
}

function imageUrl(postId: string, updatedAt: string | null): string {
  const base = `${Deno.env.get("SUPABASE_URL")}/functions/v1/social-image`;
  const version = updatedAt ? `&v=${encodeURIComponent(updatedAt)}` : "";
  return `${base}?id=${postId}${version}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    await requireAdmin(req);

    const payload = await req.json();
    const dryRun = payload.dry_run === true;
    const supabase = service();

    let query = supabase.from("social_posts").select("*").order("position");
    if (payload.batch_id) query = query.eq("batch_id", String(payload.batch_id));
    else if (Array.isArray(payload.post_ids) && payload.post_ids.length) {
      query = query.in("id", payload.post_ids.map(String));
    } else throw new Error("Geef een batch_id of post_ids mee");

    const { data: posts, error } = await query;
    if (error) throw new Error(`Posts ophalen mislukt: ${error.message}`);
    if (!posts?.length) throw new Error("Geen posts gevonden om te versturen");

    const token = Deno.env.get("PLANABLE_API_TOKEN");
    if (!token && !dryRun) {
      throw new Error(
        "PLANABLE_API_TOKEN ontbreekt. Zet het Planable-token als Supabase secret; " +
          "tot die tijd kunt u de posts kopiëren uit het adminscherm.",
      );
    }

    const config = await loadConfig();
    if (!config.workspaceId && !dryRun) {
      throw new Error(
        "Planable-workspace onbekend. Zet PLANABLE_WORKSPACE_ID als secret of " +
          "seo_settings.config.planable.workspace_id in de database.",
      );
    }

    const operation = token ? await loadOperation(token) : null;
    const createPath = operation?.path ?? DEFAULT_CREATE_PATH;
    const results: Record<string, unknown>[] = [];

    for (const post of posts) {
      const pageId = config.pages[post.channel];
      const { content, firstComment } = composeContent(post);

      if (!pageId && !dryRun) {
        const message = `Geen Planable-page ingesteld voor kanaal "${post.channel}"`;
        await supabase.from("social_posts").update({ status: "failed", planable_error: message }).eq("id", post.id);
        results.push({ post_id: post.id, ok: false, error: message });
        continue;
      }

      const canonical: CanonicalPayload = {
        workspaceId: config.workspaceId,
        pageId: pageId ?? "",
        content,
        mediaUrls: [imageUrl(post.id, post.updated_at)],
        scheduledAt: post.scheduled_for ?? undefined,
        state: "draft",
      };
      const mapped = mapPayload(canonical, operation);

      if (dryRun) {
        results.push({ post_id: post.id, ok: true, dry_run: true, payload: mapped.body, first_comment: firstComment });
        continue;
      }

      if (mapped.missing.length) {
        const message = `Planable verwacht velden die wij niet kunnen invullen: ${mapped.missing.join(", ")}`;
        await supabase.from("social_posts").update({ status: "failed", planable_error: message }).eq("id", post.id);
        results.push({ post_id: post.id, ok: false, error: message });
        continue;
      }

      try {
        const res = await fetch(`${BASE}${createPath}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify(mapped.body),
        });
        const text = await res.text();

        if (!res.ok) {
          const detail = operation
            ? ` Velden die Planable verwacht: ${operation.required.join(", ") || "geen verplichte velden in de spec"}.`
            : " De API-spec was niet leesbaar, dus de veldnamen zijn een aanname.";
          const message = `Planable gaf HTTP ${res.status}: ${text.slice(0, 400)}.${detail}`;
          await supabase.from("social_posts").update({ status: "failed", planable_error: message }).eq("id", post.id);
          results.push({ post_id: post.id, ok: false, error: message });
          continue;
        }

        const planableId = extractPostId(text ? JSON.parse(text) : null);
        await supabase
          .from("social_posts")
          .update({
            status: "pushed",
            planable_post_id: planableId,
            planable_page_id: pageId,
            planable_error: null,
            pushed_at: new Date().toISOString(),
          })
          .eq("id", post.id);
        results.push({ post_id: post.id, ok: true, planable_post_id: planableId, first_comment: firstComment });
      } catch (e) {
        const message = e instanceof Error ? e.message : "Onbekende fout";
        await supabase.from("social_posts").update({ status: "failed", planable_error: message }).eq("id", post.id);
        results.push({ post_id: post.id, ok: false, error: message });
      }
    }

    if (payload.batch_id && !dryRun && results.some((r) => r.ok)) {
      await supabase.from("social_post_batches").update({ status: "pushed" }).eq("id", String(payload.batch_id));
    }

    return json({ results, dry_run: dryRun });
  } catch (e) {
    console.error("social-planable-push error:", e);
    const message = e instanceof Error ? e.message : "Onbekende fout";
    const status = message.includes("ingelogd") || message.includes("beheerders") ? 403 : 500;
    return json({ error: message }, status);
  }
});
