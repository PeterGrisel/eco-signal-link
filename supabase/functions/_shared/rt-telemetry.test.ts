// Unit tests voor de telemetrie-compositie en tenant-limieten.
// Draaien met: deno test supabase/functions/_shared/rt-telemetry.test.ts
import {
  DEFAULT_DAILY_TENANT_SKILL_CALLS,
  TELEMETRY_BLOCK_KEYS,
  composeTelemetry,
  dailyTenantSkillLimit,
  startOfTodayUtcIso,
  strongestStairoidsMover,
} from "./rt-telemetry.ts";

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`Assertion failed: ${msg}`);
}

function assertEquals(actual: unknown, expected: unknown, msg = "") {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) throw new Error(`Expected ${e}, got ${a}. ${msg}`);
}

const NOW = new Date("2026-07-18T12:00:00Z");
const FRESH = "2026-07-18T06:30:00Z"; // 5,5 uur oud
const STALE = "2026-07-17T06:00:00Z"; // 30 uur oud
const EXPIRES = "2026-07-19T12:00:00Z";

Deno.test("composeTelemetry: alle negen contract-keys aanwezig", () => {
  const c = composeTelemetry([], NOW);
  assertEquals(Object.keys(c.data).sort(), [...TELEMETRY_BLOCK_KEYS].sort());
  assertEquals(
    Object.keys(c.data).sort(),
    ["apollo", "herkomst", "heyreach", "monthly", "pipedrive", "planable", "salescycle", "staroids", "winloss"],
  );
});

Deno.test("composeTelemetry: pipedrive-payload splitst in vijf blokken", () => {
  const payload = {
    pipedrive: { open: { count: 12, value: 480000 } },
    salescycle: { medianFunnel: 41 },
    winloss: { stages: [] },
    herkomst: { open: {} },
    monthly: [{ month: "2026-06" }],
  };
  const c = composeTelemetry(
    [{ skill_key: "pull_pipedrive_stats", payload, created_at: FRESH, expires_at: EXPIRES }],
    NOW,
  );
  assertEquals(c.data.pipedrive, payload.pipedrive);
  assertEquals(c.data.salescycle, payload.salescycle);
  assertEquals(c.data.monthly, payload.monthly);
  assertEquals(c.snapshot_dates.pipedrive, FRESH);
  assertEquals(c.stale.pipedrive, false);
  assertEquals(c.data.heyreach, null, "ontbrekende skill => null");
  assert(c.missing.heyreach.includes("pull_heyreach_stats"), "reden bij ontbrekend blok");
});

Deno.test("composeTelemetry: stale-markering boven 26 uur", () => {
  const c = composeTelemetry(
    [{ skill_key: "pull_heyreach_stats", payload: { acceptRate: 31 }, created_at: STALE, expires_at: EXPIRES }],
    NOW,
  );
  assertEquals(c.stale.heyreach, true);
  assertEquals(c.data.heyreach, { acceptRate: 31 }, "stale data blijft zichtbaar");
});

Deno.test("composeTelemetry: verlopen snapshot telt niet mee, nieuwste wint", () => {
  const rows = [
    { skill_key: "pull_apollo_sequence_stats", payload: { openRate: 55 }, created_at: FRESH, expires_at: "2026-07-18T11:00:00Z" },
    { skill_key: "pull_apollo_sequence_stats", payload: { openRate: 48 }, created_at: "2026-07-18T01:00:00Z", expires_at: EXPIRES },
  ];
  const c = composeTelemetry(rows, NOW);
  assertEquals(c.data.apollo, { openRate: 48 }, "verlopen (55) genegeerd, verse (48) gekozen");
});

Deno.test("dailyTenantSkillLimit: config, default en randgevallen", () => {
  assertEquals(dailyTenantSkillLimit({ limits: { daily_tenant_skill_calls: 10 } }), 10);
  assertEquals(dailyTenantSkillLimit({ limits: {} }), DEFAULT_DAILY_TENANT_SKILL_CALLS);
  assertEquals(dailyTenantSkillLimit(null), 25);
  assertEquals(dailyTenantSkillLimit({ limits: { daily_tenant_skill_calls: "veel" } }), 25);
  assertEquals(dailyTenantSkillLimit({ limits: { daily_tenant_skill_calls: 0 } }), 0, "0 = tenant-calls uit");
});

Deno.test("startOfTodayUtcIso", () => {
  assertEquals(startOfTodayUtcIso(new Date("2026-07-18T23:59:59Z")), "2026-07-18T00:00:00.000Z");
});

Deno.test("strongestStairoidsMover: delta tussen snapshots, fallback topscorer", () => {
  const latest = [
    { company: "Wefabricate", score: 82 },
    { company: "Acme", score: 74 },
  ];
  const previous = [
    { company: "Wefabricate", score: 70 },
    { company: "Acme", score: 73 },
  ];
  assertEquals(strongestStairoidsMover(latest, previous), { company: "Wefabricate", score: 82, delta: 12 });
  assertEquals(strongestStairoidsMover(latest, null), { company: "Wefabricate", score: 82, delta: null });
  assertEquals(strongestStairoidsMover(null, previous), null);
});
