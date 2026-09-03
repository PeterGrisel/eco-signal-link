// Pure hulpfuncties voor de Planable-push.
//
// De Planable Public API (https://api.planable.io/api/v1) publiceert haar eigen
// OpenAPI-spec op /openapi.json. We gebruiken die spec om het pad en de
// veldnamen van de "post aanmaken"-operatie te bepalen, in plaats van namen
// hard te coderen. Zo blijft de push werken als Planable een veld anders noemt,
// en krijgt de beheerder een leesbare fout in plaats van een kale HTTP 422.
//
// Testen met: deno test supabase/functions/social-planable-push/planable.test.ts

export interface CanonicalPayload {
  workspaceId: string;
  pageId: string;
  content: string;
  mediaUrls: string[];
  scheduledAt?: string;
  /** Posts landen als concept in Planable; publiceren blijft mensenwerk. */
  state: "draft";
}

export interface OperationInfo {
  path: string;
  properties: Record<string, unknown>;
  required: string[];
}

/** Synoniemen per canoniek veld, in volgorde van voorkeur. */
const SYNONYMS: Record<keyof CanonicalPayload, string[]> = {
  workspaceId: ["workspaceId", "workspace_id", "workspace"],
  pageId: ["pageId", "page_id", "page", "pageIds", "page_ids", "pages"],
  content: ["content", "text", "body", "message", "caption"],
  mediaUrls: ["mediaUrls", "media_urls", "media", "attachments", "images", "imageUrls"],
  scheduledAt: ["scheduledAt", "scheduled_at", "scheduleAt", "publishAt", "publish_at", "date"],
  state: ["state", "status", "postState"],
};

/** Velden die als lijst verstuurd moeten worden, ongeacht onze canonieke vorm. */
function wantsArray(schema: unknown): boolean {
  return typeof schema === "object" && schema !== null && (schema as { type?: string }).type === "array";
}

/**
 * Zoekt in de OpenAPI-spec de POST-operatie waarmee een post wordt aangemaakt.
 * Geeft `null` terug als de spec onbruikbaar is; de aanroeper valt dan terug
 * op het standaardpad.
 */
export function findCreatePostOperation(spec: unknown): OperationInfo | null {
  const paths = (spec as { paths?: Record<string, Record<string, unknown>> })?.paths;
  if (!paths || typeof paths !== "object") return null;

  const candidates = Object.keys(paths)
    .filter((p) => /\/posts\/?$/.test(p) && (paths[p] as Record<string, unknown>).post)
    // Het kortste pad zonder padparameters is de generieke "maak een post".
    .sort((a, b) => a.split("/").length - b.split("/").length || a.length - b.length);
  const path = candidates[0];
  if (!path) return null;

  const post = (paths[path] as Record<string, any>).post;
  const schema = resolveRef(
    spec,
    post?.requestBody?.content?.["application/json"]?.schema ??
      post?.requestBody?.content?.["multipart/form-data"]?.schema,
  );

  return {
    path,
    properties: (schema?.properties as Record<string, unknown>) ?? {},
    required: Array.isArray(schema?.required) ? (schema.required as string[]) : [],
  };
}

/** Lost een `$ref` één niveau diep op; genoeg voor de vorm die Planable gebruikt. */
function resolveRef(spec: unknown, schema: any): any {
  if (!schema) return null;
  if (typeof schema.$ref !== "string") return schema;
  const parts = schema.$ref.replace(/^#\//, "").split("/");
  let node: any = spec;
  for (const part of parts) {
    node = node?.[part];
    if (!node) return null;
  }
  return node;
}

export interface MappedPayload {
  body: Record<string, unknown>;
  /** Canonieke velden die de API niet kent en dus zijn weggelaten. */
  dropped: string[];
  /** Verplichte velden uit de spec die wij niet kunnen invullen. */
  missing: string[];
}

/**
 * Zet de canonieke payload om naar de veldnamen die de API verwacht. Zonder
 * bruikbare spec worden de voorkeursnamen gebruikt.
 */
export function mapPayload(canonical: CanonicalPayload, op: OperationInfo | null): MappedPayload {
  const body: Record<string, unknown> = {};
  const dropped: string[] = [];
  const known = op && Object.keys(op.properties).length > 0 ? op.properties : null;

  for (const [key, aliases] of Object.entries(SYNONYMS) as [keyof CanonicalPayload, string[]][]) {
    const value = canonical[key];
    if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) continue;

    const name = known ? aliases.find((a) => a in known) : aliases[0];
    if (!name) {
      dropped.push(key);
      continue;
    }
    const schema = known ? known[name] : null;
    body[name] = wantsArray(schema) && !Array.isArray(value)
      ? [value]
      : !wantsArray(schema) && Array.isArray(value) && schema
        ? value[0]
        : value;
  }

  const missing = (op?.required ?? []).filter((r) => !(r in body));
  return { body, dropped, missing };
}

/**
 * Stelt de definitieve posttekst samen: de body, daarna de hashtags en, waar
 * dat mag, de link. Op de persoonlijke LinkedIn-post blijft de link eruit; die
 * hoort in de eerste reactie en wordt apart teruggegeven.
 */
export function composeContent(post: {
  body: string;
  hashtags?: string[] | null;
  cta_url?: string | null;
  channel: string;
}): { content: string; firstComment: string | null } {
  const parts = [String(post.body ?? "").trim()];
  const tags = (post.hashtags ?? []).map((t) => `#${String(t).replace(/^#/, "")}`).filter((t) => t.length > 1);

  const linkInPost = post.channel !== "linkedin_personal" && post.channel !== "instagram";
  if (linkInPost && post.cta_url) parts.push(post.cta_url);
  if (tags.length) parts.push(tags.join(" "));

  return {
    content: parts.filter(Boolean).join("\n\n"),
    firstComment: !linkInPost && post.cta_url ? post.cta_url : null,
  };
}

/** Leest de post-id uit een antwoord dat op meerdere manieren genest kan zijn. */
export function extractPostId(body: unknown): string | null {
  const node = body as Record<string, any> | null;
  if (!node || typeof node !== "object") return null;
  const candidates = [node.id, node._id, node.postId, node.data?.id, node.data?._id, node.post?.id];
  for (const c of candidates) if (typeof c === "string" && c) return c;
  return null;
}
