// Gedeelde pure helpers voor de Rebel Force GTM Runtime: JSON Schema-
// validatie, canonieke JSON + idempotency-hash en versievergelijking.
// Gebruikt door rt-execute-skill (input/output van skills) en mcp-server
// (playbook-input bij start_workflow_run, versie-selectie).
//
// Ajv gebruikt runtime-codegeneratie (`new Function`) en werkt niet in de
// Supabase Edge Runtime. Deze pure validator dekt de subset die de
// rt_-schemas gebruiken: type (incl. array-van-types), required, properties,
// additionalProperties, items, enum, minimum, maximum.

type Schema = Record<string, unknown>;

function jsonType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (typeof value === "number") return Number.isInteger(value) ? "integer" : "number";
  return typeof value;
}

function typeMatches(expected: string, actual: string): boolean {
  if (expected === actual) return true;
  return expected === "number" && actual === "integer";
}

export function validateSchema(schema: unknown, value: unknown, path = "$"): string[] {
  const errors: string[] = [];
  if (schema === null || typeof schema !== "object" || Array.isArray(schema)) return errors;
  const s = schema as Schema;
  const actual = jsonType(value);

  if (s.type !== undefined) {
    const allowed = Array.isArray(s.type) ? (s.type as string[]) : [s.type as string];
    if (!allowed.some((t) => typeMatches(t, actual))) {
      errors.push(`${path}: expected type ${allowed.join("|")}, got ${actual}`);
      return errors;
    }
  }

  if (Array.isArray(s.enum) && !s.enum.some((e) => e === value)) {
    errors.push(`${path}: value not in enum [${(s.enum as unknown[]).join(", ")}]`);
  }

  if (typeof value === "number") {
    if (typeof s.minimum === "number" && value < s.minimum) {
      errors.push(`${path}: ${value} is below minimum ${s.minimum}`);
    }
    if (typeof s.maximum === "number" && value > s.maximum) {
      errors.push(`${path}: ${value} is above maximum ${s.maximum}`);
    }
  }

  if (actual === "object") {
    const obj = value as Record<string, unknown>;
    const props = (s.properties ?? {}) as Record<string, unknown>;
    if (Array.isArray(s.required)) {
      for (const key of s.required as string[]) {
        if (!(key in obj)) errors.push(`${path}: missing required property "${key}"`);
      }
    }
    for (const [key, child] of Object.entries(obj)) {
      if (key in props) {
        errors.push(...validateSchema(props[key], child, `${path}.${key}`));
      } else if (s.additionalProperties === false) {
        errors.push(`${path}: unexpected property "${key}"`);
      }
    }
  }

  if (actual === "array" && s.items !== undefined) {
    (value as unknown[]).forEach((item, i) => {
      errors.push(...validateSchema(s.items, item, `${path}[${i}]`));
    });
  }

  return errors;
}

// ============ Versievergelijking ============

export function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map((n) => parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}

export function pickHighestVersion<T extends { version: string }>(versions: T[]): T | null {
  if (versions.length === 0) return null;
  return [...versions].sort((a, b) => compareVersions(b.version, a.version))[0];
}

// ============ Canonieke JSON + idempotency-hash ============

// Deterministische JSON-serialisatie (gesorteerde keys) zodat dezelfde input
// altijd dezelfde hash geeft, ongeacht key-volgorde.
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`);
  return `{${entries.join(",")}}`;
}

export async function hashInput(skillKey: string, skillVersion: string, input: unknown): Promise<string> {
  const payload = new TextEncoder().encode(`${skillKey}@${skillVersion}:${canonicalJson(input)}`);
  const digest = await crypto.subtle.digest("SHA-256", payload);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
