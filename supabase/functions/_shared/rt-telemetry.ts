// Gedeelde telemetrie-logica voor de GTM Runtime (opdracht v3, deel F9/I4).
// Pure functies: compositie van het DATA-object uit rt_snapshots-rijen en
// de tenant-limieten uit rt_tenant_playbooks.config. Gebruikt door de
// mcp-server (get_telemetry, execute_skill-daglimiet) en portal-telemetry.

// Belangrijke naamconventie: de PROVIDER heet 'stairoids', maar het
// DATA-blok in het dashboard-contract heet 'staroids' (conform de
// voorbeeld-JSX / opdracht F9).

export const TELEMETRY_STALE_AFTER_HOURS = 26;

// Per telemetrie-skill: welke DATA-blokken de snapshot-payload levert.
// pull_pipedrive_stats levert vijf blokken in één payload; de rest één.
export const TELEMETRY_SKILLS: { skillKey: string; blocks: string[] }[] = [
  { skillKey: "pull_pipedrive_stats", blocks: ["pipedrive", "salescycle", "winloss", "herkomst", "monthly"] },
  { skillKey: "pull_heyreach_stats", blocks: ["heyreach"] },
  { skillKey: "pull_apollo_sequence_stats", blocks: ["apollo"] },
  { skillKey: "pull_planable_stats", blocks: ["planable"] },
  { skillKey: "pull_stairoids_scores", blocks: ["staroids"] },
];

export const TELEMETRY_BLOCK_KEYS = TELEMETRY_SKILLS.flatMap((s) => s.blocks);

export interface TelemetrySnapshotRow {
  skill_key: string;
  payload: unknown;
  created_at: string;
  expires_at: string;
}

export interface TelemetryComposition {
  data: Record<string, unknown | null>;
  snapshot_dates: Record<string, string | null>;
  stale: Record<string, boolean>;
  missing: Record<string, string>;
}

// Componeert het DATA-object exact volgens het dashboard-contract:
// keys pipedrive, heyreach, apollo, planable, staroids, salescycle, winloss,
// herkomst, monthly — plus snapshot_dates en stale (> 26 uur) per blok.
// Ontbrekend of verlopen blok => data null + reden in missing.
export function composeTelemetry(rows: TelemetrySnapshotRow[], now: Date = new Date()): TelemetryComposition {
  const data: Record<string, unknown | null> = {};
  const snapshotDates: Record<string, string | null> = {};
  const stale: Record<string, boolean> = {};
  const missing: Record<string, string> = {};

  for (const skill of TELEMETRY_SKILLS) {
    const candidates = rows
      .filter((r) => r.skill_key === skill.skillKey && Date.parse(r.expires_at) > now.getTime())
      .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
    const snap = candidates[0] ?? null;

    for (const block of skill.blocks) {
      if (!snap) {
        data[block] = null;
        snapshotDates[block] = null;
        stale[block] = false;
        missing[block] = `Geen (verse) snapshot voor ${skill.skillKey}`;
        continue;
      }
      const payload = snap.payload as Record<string, unknown> | null;
      // Multi-blok-skill: payload bevat het blok als key; single-blok-skill:
      // de payload ís het blok.
      const value = skill.blocks.length > 1 ? payload?.[block] ?? null : payload ?? null;
      data[block] = value;
      snapshotDates[block] = snap.created_at;
      stale[block] = now.getTime() - Date.parse(snap.created_at) > TELEMETRY_STALE_AFTER_HOURS * 3_600_000;
      if (value === null) missing[block] = `Snapshot van ${skill.skillKey} bevat geen blok "${block}"`;
    }
  }

  return { data, snapshot_dates: snapshotDates, stale, missing };
}

// ============ Tenant-limieten ============

export const DEFAULT_DAILY_TENANT_SKILL_CALLS = 25;

export function dailyTenantSkillLimit(config: unknown): number {
  if (config !== null && typeof config === "object") {
    const limits = (config as Record<string, unknown>).limits;
    if (limits !== null && typeof limits === "object") {
      const n = (limits as Record<string, unknown>).daily_tenant_skill_calls;
      if (typeof n === "number" && Number.isFinite(n) && n >= 0) return Math.floor(n);
    }
  }
  return DEFAULT_DAILY_TENANT_SKILL_CALLS;
}

export function startOfTodayUtcIso(now: Date = new Date()): string {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
}

// Sterkste Stairoids-mover: grootste score-stijging tussen de twee meest
// recente snapshots; met één snapshot valt hij terug op de topscorer.
export function strongestStairoidsMover(
  latestTop: { company: string; score: number }[] | null,
  previousTop: { company: string; score: number }[] | null,
): { company: string; score: number; delta: number | null } | null {
  if (!latestTop || latestTop.length === 0) return null;
  if (!previousTop || previousTop.length === 0) {
    const top = [...latestTop].sort((a, b) => b.score - a.score)[0];
    return { company: top.company, score: top.score, delta: null };
  }
  const prevByCompany = new Map(previousTop.map((t) => [t.company, t.score]));
  let best: { company: string; score: number; delta: number } | null = null;
  for (const t of latestTop) {
    const prev = prevByCompany.get(t.company);
    const delta = prev === undefined ? t.score : t.score - prev;
    if (!best || delta > best.delta) best = { company: t.company, score: t.score, delta };
  }
  return best;
}
