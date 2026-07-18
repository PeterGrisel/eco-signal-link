// Unit tests voor de pure functies van rt-execute-skill.
// Draaien met: deno test supabase/functions/rt-execute-skill/lib.test.ts
import {
  RouteCandidate,
  SkillError,
  canonicalJson,
  compareVersions,
  extractProviderPreferences,
  hashInput,
  parseBearerToken,
  parseExecuteRequest,
  parseVaultRef,
  pickHighestVersion,
  selectProvider,
  unwrapProviderResponse,
  validateSchema,
} from "./lib.ts";

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`Assertion failed: ${msg}`);
}

function assertEquals(actual: unknown, expected: unknown, msg = "") {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) throw new Error(`Expected ${e}, got ${a}. ${msg}`);
}

// ============ validateSchema ============

const searchCompaniesInput = {
  type: "object",
  required: ["country"],
  properties: {
    country: { type: "string" },
    industries: { type: "array", items: { type: "string" } },
    employee_min: { type: "integer" },
    target_count: { type: "integer", default: 100 },
  },
  additionalProperties: false,
};

Deno.test("validateSchema: geldige input geeft geen fouten", () => {
  const errors = validateSchema(searchCompaniesInput, {
    country: "NL",
    industries: ["manufacturing"],
    employee_min: 10,
  });
  assertEquals(errors, []);
});

Deno.test("validateSchema: missende required property", () => {
  const errors = validateSchema(searchCompaniesInput, { industries: [] });
  assert(errors.some((e) => e.includes('required property "country"')), errors.join("; "));
});

Deno.test("validateSchema: additionalProperties false weigert onbekende keys", () => {
  const errors = validateSchema(searchCompaniesInput, { country: "NL", foo: 1 });
  assert(errors.some((e) => e.includes('unexpected property "foo"')), errors.join("; "));
});

Deno.test("validateSchema: verkeerd type", () => {
  const errors = validateSchema(searchCompaniesInput, { country: 42 });
  assert(errors.some((e) => e.includes("expected type string")), errors.join("; "));
});

Deno.test("validateSchema: integer vs number", () => {
  assertEquals(validateSchema({ type: "integer" }, 1.5), ["$: expected type integer, got number"]);
  assertEquals(validateSchema({ type: "number" }, 3), []);
});

Deno.test("validateSchema: enum, minimum en maximum", () => {
  const schema = {
    type: "object",
    required: ["score"],
    properties: {
      score: { type: "integer", minimum: 0, maximum: 100 },
      status: { type: "string", enum: ["verified", "risky", "invalid", "unknown"] },
    },
  };
  assertEquals(validateSchema(schema, { score: 50, status: "risky" }), []);
  assert(validateSchema(schema, { score: 101 }).length === 1, "boven maximum");
  assert(validateSchema(schema, { score: -1 }).length === 1, "onder minimum");
  assert(validateSchema(schema, { score: 5, status: "wat" }).length === 1, "buiten enum");
});

Deno.test("validateSchema: array-van-types (nullable)", () => {
  const schema = { type: ["string", "null"] };
  assertEquals(validateSchema(schema, null), []);
  assertEquals(validateSchema(schema, "x"), []);
  assert(validateSchema(schema, 5).length === 1, "nummer is niet string|null");
});

Deno.test("validateSchema: geneste array-items", () => {
  const schema = {
    type: "object",
    required: ["accounts"],
    properties: {
      accounts: {
        type: "array",
        items: { type: "object", required: ["name"], properties: { name: { type: "string" } } },
      },
    },
  };
  assertEquals(validateSchema(schema, { accounts: [{ name: "Acme" }] }), []);
  const errors = validateSchema(schema, { accounts: [{ name: "Acme" }, {}] });
  assert(errors.some((e) => e.includes("$.accounts[1]")), errors.join("; "));
});

// ============ versies ============

Deno.test("compareVersions en pickHighestVersion", () => {
  assert(compareVersions("1.10.0", "1.9.9") > 0, "1.10.0 > 1.9.9");
  assert(compareVersions("2.0.0", "10.0.0") < 0, "2.0.0 < 10.0.0");
  assertEquals(compareVersions("1.0.0", "1.0.0"), 0);
  const highest = pickHighestVersion([{ version: "1.0.0" }, { version: "1.2.0" }, { version: "1.10.1" }]);
  assertEquals(highest?.version, "1.10.1");
  assertEquals(pickHighestVersion([]), null);
});

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

// ============ idempotency hash ============

Deno.test("canonicalJson: key-volgorde maakt niet uit", () => {
  assertEquals(canonicalJson({ b: 1, a: { d: 2, c: 3 } }), canonicalJson({ a: { c: 3, d: 2 }, b: 1 }));
  assert(canonicalJson({ a: [1, 2] }) !== canonicalJson({ a: [2, 1] }), "array-volgorde telt wel");
});

Deno.test("hashInput: deterministisch, gevoelig voor skill en versie", async () => {
  const h1 = await hashInput("verify_email", "1.0.0", { emails: ["a@b.nl"] });
  const h2 = await hashInput("verify_email", "1.0.0", { emails: ["a@b.nl"] });
  const h3 = await hashInput("verify_email", "1.1.0", { emails: ["a@b.nl"] });
  assertEquals(h1, h2);
  assert(h1 !== h3, "andere versie geeft andere hash");
  assert(/^[0-9a-f]{64}$/.test(h1), "sha-256 hex");
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

// ============ autorisatie ============

Deno.test("parseBearerToken", () => {
  assertEquals(parseBearerToken("Bearer abc.def.ghi"), "abc.def.ghi");
  assertEquals(parseBearerToken("bearer abc"), "abc", "scheme is case-insensitive");
  assertEquals(parseBearerToken("Basic abc"), null);
  assertEquals(parseBearerToken("Bearer "), null);
  assertEquals(parseBearerToken("Bearer a b"), null, "token mag geen spaties bevatten");
  assertEquals(parseBearerToken(null), null);
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
