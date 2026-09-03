// Unit tests voor de Planable-mapping.
// Draaien met: deno test supabase/functions/social-planable-push/planable.test.ts
import {
  type CanonicalPayload,
  composeContent,
  extractPostId,
  findCreatePostOperation,
  mapPayload,
} from "./planable.ts";

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`Assertion failed: ${msg}`);
}

function assertEquals(actual: unknown, expected: unknown, msg = "") {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) throw new Error(`Expected ${e}, got ${a}. ${msg}`);
}

const canonical: CanonicalPayload = {
  workspaceId: "ws_1",
  pageId: "page_1",
  content: "Een post",
  mediaUrls: ["https://example.com/a.png"],
  state: "draft",
};

// ============ spec lezen ============

const spec = {
  paths: {
    "/posts/{id}": { get: {} },
    "/posts": {
      post: {
        requestBody: {
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreatePost" } } },
        },
      },
    },
  },
  components: {
    schemas: {
      CreatePost: {
        type: "object",
        required: ["workspace_id", "page_ids", "text"],
        properties: {
          workspace_id: { type: "string" },
          page_ids: { type: "array", items: { type: "string" } },
          text: { type: "string" },
          media: { type: "array", items: { type: "string" } },
          status: { type: "string" },
        },
      },
    },
  },
};

Deno.test("findCreatePostOperation: vindt het pad en lost de $ref op", () => {
  const op = findCreatePostOperation(spec);
  assert(op !== null, "operatie niet gevonden");
  assertEquals(op!.path, "/posts");
  assertEquals(op!.required, ["workspace_id", "page_ids", "text"]);
  assert("media" in op!.properties, "media-veld ontbreekt in de properties");
});

Deno.test("findCreatePostOperation: geeft null bij een onbruikbare spec", () => {
  assertEquals(findCreatePostOperation(null), null);
  assertEquals(findCreatePostOperation({}), null);
  assertEquals(findCreatePostOperation({ paths: { "/pages": { get: {} } } }), null);
});

// ============ payload mappen ============

Deno.test("mapPayload: gebruikt de veldnamen uit de spec", () => {
  const mapped = mapPayload(canonical, findCreatePostOperation(spec));
  assertEquals(mapped.body.workspace_id, "ws_1");
  assertEquals(mapped.body.text, "Een post");
  assertEquals(mapped.missing, [], "niets zou mogen ontbreken");
  assertEquals(mapped.dropped, [], "niets zou mogen afvallen");
});

Deno.test("mapPayload: maakt een lijst van een enkele waarde als de spec dat vraagt", () => {
  const mapped = mapPayload(canonical, findCreatePostOperation(spec));
  assertEquals(mapped.body.page_ids, ["page_1"], "page_ids moet een array zijn");
});

Deno.test("mapPayload: pakt de eerste waarde als de spec geen lijst wil", () => {
  const op = {
    path: "/posts",
    required: [],
    properties: { pageId: { type: "string" }, media: { type: "string" }, content: { type: "string" } },
  };
  const mapped = mapPayload(canonical, op);
  assertEquals(mapped.body.pageId, "page_1");
  assertEquals(mapped.body.media, "https://example.com/a.png");
});

Deno.test("mapPayload: laat onbekende velden vallen en meldt dat", () => {
  const op = { path: "/posts", required: [], properties: { content: { type: "string" } } };
  const mapped = mapPayload(canonical, op);
  assertEquals(Object.keys(mapped.body), ["content"]);
  assert(mapped.dropped.includes("workspaceId"), "workspaceId zou moeten afvallen");
});

Deno.test("mapPayload: meldt verplichte velden die wij niet kunnen invullen", () => {
  const op = {
    path: "/posts",
    required: ["content", "channelType"],
    properties: { content: { type: "string" }, channelType: { type: "string" } },
  };
  assertEquals(mapPayload(canonical, op).missing, ["channelType"]);
});

Deno.test("mapPayload: valt zonder spec terug op de voorkeursnamen", () => {
  const mapped = mapPayload(canonical, null);
  assertEquals(mapped.body.workspaceId, "ws_1");
  assertEquals(mapped.body.pageId, "page_1");
  assertEquals(mapped.body.mediaUrls, ["https://example.com/a.png"]);
  assertEquals(mapped.body.state, "draft");
});

Deno.test("mapPayload: laat lege en ontbrekende waarden weg", () => {
  const mapped = mapPayload({ ...canonical, mediaUrls: [], scheduledAt: undefined }, null);
  assert(!("mediaUrls" in mapped.body), "lege medialijst mag niet mee");
  assert(!("scheduledAt" in mapped.body), "ontbrekende planning mag niet mee");
});

// ============ tekst samenstellen ============

Deno.test("composeContent: houdt de link uit de persoonlijke LinkedIn-post", () => {
  const out = composeContent({
    channel: "linkedin_personal",
    body: "De post zelf.",
    hashtags: ["b2b", "#sales"],
    cta_url: "https://www.b2bgroeimachine.io/blog/x",
  });
  assert(!out.content.includes("b2bgroeimachine.io"), "link hoort niet in de post");
  assertEquals(out.firstComment, "https://www.b2bgroeimachine.io/blog/x");
  assert(out.content.includes("#b2b #sales"), "hashtags ontbreken of zijn dubbel gemarkeerd");
});

Deno.test("composeContent: zet de link wel in een Facebook-post", () => {
  const out = composeContent({
    channel: "facebook",
    body: "De post zelf.",
    hashtags: [],
    cta_url: "https://www.b2bgroeimachine.io/blog/x",
  });
  assert(out.content.includes("https://www.b2bgroeimachine.io/blog/x"), "link hoort in de post");
  assertEquals(out.firstComment, null);
});

Deno.test("composeContent: werkt zonder hashtags en zonder link", () => {
  const out = composeContent({ channel: "x", body: "Kort.", hashtags: null, cta_url: null });
  assertEquals(out.content, "Kort.");
  assertEquals(out.firstComment, null);
});

// ============ antwoord lezen ============

Deno.test("extractPostId: leest de id uit de gangbare vormen", () => {
  assertEquals(extractPostId({ id: "a" }), "a");
  assertEquals(extractPostId({ data: { _id: "b" } }), "b");
  assertEquals(extractPostId({ post: { id: "c" } }), "c");
  assertEquals(extractPostId(null), null);
  assertEquals(extractPostId({ nope: 1 }), null);
});
