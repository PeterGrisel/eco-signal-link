// Gedeelde JSON Schema-validatie voor de Rebel Force GTM Runtime.
// Gebruikt door rt-execute-skill (input/output van skills) en mcp-server
// (playbook-input bij start_workflow_run).
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
