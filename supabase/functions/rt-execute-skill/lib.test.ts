// Unit tests voor de pure functies van rt-execute-skill.
// De gedeelde helpers (validateSchema, versies, hashing) worden getest in
// _shared/rt-validation.test.ts.
// Draaien met: deno test supabase/functions/rt-execute-skill/lib.test.ts
import {
  RouteCandidate,
  SkillError,
  checkInternalToken,
  extractProviderPreferences,
  parseExecuteRequest,
  parseVaultRef,
  pickFreshSnapshot,
  selectProvider,
  snapshotExpiresAt,
  snapshotRowCount,
  unwrapProviderResponse,
} from "./lib.ts";

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`Assertion failed: ${msg}`);
}

function assertEquals(actual: unknown, expected: unknown, msg = "") {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) throw new Error(`Expected ${e}, got ${a}. ${msg}`);
}

// ============ routing ============

const routes: RouteCandidate[] = [
  { provider_id: "p1", provider_key: "apollo", provider_status: "active", priority: 10, is_active: true },
  { provider_id: "p2", provider_key: "hubspot", provider_status: "active", priority: 20, is_active: true },
  { provider_id: "p3", provider_key: "heyreach", provider_status: "disabled", priority: 5, is_active: true },
  { provider_id: "p4", provider_key: "pipedrive", provider_status: "active", priority: 1, is_active: false },
];

Deno.test("selectProvider: laagste priority wint zonder voorkeur", () => {
  assertEquals(selectProvider(routes, [])?.provider_key, "apollo");
});

Deno.test("selectProvider: tenant-voorkeur wint van priority", () => {
  assertEquals(selectProvider(routes, ["hubspot"])?.provider_key, "hubspot");
});

Deno.test("selectProvider: inactieve routes en providers doen niet mee", () => {
  assertEquals(selectProvider(routes, ["pipedrive", "heyreach"])?.provider_key, "apollo");
  assertEquals(selectProvider([], []), null);
});

Deno.test("extractProviderPreferences: string en array, dedupliceerd", () => {
  const prefs = extractProviderPreferences(
    [
      { provider_preferences: { sync_crm: "hubspot" } },
      { provider_preferences: { sync_crm: ["hubspot", "pipedrive"] } },
      { other: true },
      null,
    ],
    "sync_crm",
  );
  assertEquals(prefs, ["hubspot", "pipedrive"]);
  assertEquals(extractProviderPreferences([{ provider_preferences: { sync_crm: "hubspot" } }], "verify_email"), []);
});

// ============ vault refs ============

Deno.test("parseVaultRef", () => {
  assertEquals(parseVaultRef("vault://n8n/search-companies"), "n8n/search-companies");
  for (const bad of ["n8n/x", "vault://", 42, null]) {
    let threw = false;
    try {
      parseVaultRef(bad);
    } catch (e) {
      threw = e instanceof SkillError && e.code === "invalid_secret_reference";
    }
    assert(threw, `verwachtte SkillError voor ${JSON.stringify(bad)}`);
  }
});

// ============ provider envelope ============

Deno.test("unwrapProviderResponse", () => {
  assertEquals(unwrapProviderResponse({ data: { pushed: 3 }, confidence: 0.9, cost: 0.02 }), {
    data: { pushed: 3 },
    confidence: 0.9,
    cost: 0.02,
  });
  assertEquals(unwrapProviderResponse({ pushed: 3 }), { data: { pushed: 3 } });
  assertEquals(unwrapProviderResponse([1, 2]), { data: [1, 2] });
});

// ============ snapshot-cache ============

Deno.test("pickFreshSnapshot: cache-hit kiest nieuwste verse snapshot", () => {
  const now = new Date("2026-07-18T12:00:00Z");
  const rows = [
    { id: "oud", expires_at: "2026-07-19T00:00:00Z", created_at: "2026-07-16T00:00:00Z" },
    { id: "nieuw", expires_at: "2026-07-20T00:00:00Z", created_at: "2026-07-18T00:00:00Z" },
  ];
  assertEquals(pickFreshSnapshot(rows, now)?.id, "nieuw");
});

Deno.test("pickFreshSnapshot: cache-miss bij verlopen of lege set", () => {
  const now = new Date("2026-07-18T12:00:00Z");
  assertEquals(pickFreshSnapshot([{ id: "x", expires_at: "2026-07-18T11:59:59Z", created_at: "2026-07-17T00:00:00Z" }] as any, now), null);
  assertEquals(pickFreshSnapshot([], now), null);
});

Deno.test("snapshotExpiresAt: ttl en default", () => {
  const now = new Date("2026-07-18T00:00:00Z");
  assertEquals(snapshotExpiresAt(26, now), "2026-07-19T02:00:00.000Z");
  assertEquals(snapshotExpiresAt(null, now), "2026-07-25T00:00:00.000Z", "default 168 uur");
  assertEquals(snapshotExpiresAt(0, now), "2026-07-25T00:00:00.000Z", "0 valt terug op default");
});

Deno.test("snapshotRowCount: grootste top-level array", () => {
  assertEquals(snapshotRowCount({ accounts: [1, 2, 3], meta: [1] }), 3);
  assertEquals(snapshotRowCount([1, 2]), 2);
  assertEquals(snapshotRowCount({ score: 88 }), null);
  assertEquals(snapshotRowCount("x"), null);
});

// ============ autorisatie ============

Deno.test("checkInternalToken", () => {
  assertEquals(checkInternalToken("geheim-token", "geheim-token"), true);
  assertEquals(checkInternalToken("fout-token!!", "geheim-token"), false);
  assertEquals(checkInternalToken("geheim-toke", "geheim-token"), false, "andere lengte");
  assertEquals(checkInternalToken(null, "geheim-token"), false, "header ontbreekt");
  assertEquals(checkInternalToken("", "geheim-token"), false);
  assertEquals(checkInternalToken("x", ""), false, "niet-geconfigureerde token weigert alles");
  assertEquals(checkInternalToken("x", undefined), false, "env niet gezet weigert alles");
  assertEquals(checkInternalToken("", ""), false, "leeg == leeg is geen toegang");
});

// ============ request parsing ============

Deno.test("parseExecuteRequest: happy path en fouten", () => {
  const ok = parseExecuteRequest({
    tenantId: "0b7e1a52-9f6e-4b1c-8f0d-2f9f8a3f6c1e",
    skillKey: "verify_email",
    input: { emails: [] },
  });
  assertEquals(ok.skillKey, "verify_email");

  for (const bad of [
    null,
    {},
    { tenantId: "geen-uuid", skillKey: "x", input: {} },
    { tenantId: "0b7e1a52-9f6e-4b1c-8f0d-2f9f8a3f6c1e", skillKey: "", input: {} },
    { tenantId: "0b7e1a52-9f6e-4b1c-8f0d-2f9f8a3f6c1e", skillKey: "x", input: [] },
    { tenantId: "0b7e1a52-9f6e-4b1c-8f0d-2f9f8a3f6c1e", skillKey: "x", input: {}, stepRunId: "nope" },
    { tenantId: "0b7e1a52-9f6e-4b1c-8f0d-2f9f8a3f6c1e", skillKey: "x", input: {}, forceRefresh: "ja" },
  ]) {
    let threw = false;
    try {
      parseExecuteRequest(bad);
    } catch (e) {
      threw = e instanceof SkillError && e.code === "invalid_request";
    }
    assert(threw, `verwachtte invalid_request voor ${JSON.stringify(bad)}`);
  }
});
