// Pure, unit-testbare functies voor rt-execute-skill.
// Geen Deno/Supabase-imports: alles hier draait ook onder `deno test` zonder netwerk.

// ============ Error model ============

export interface ExecError {
  code: string;
  message: string;
  retryable: boolean;
}

export class SkillError extends Error {
  code: string;
  retryable: boolean;
  httpStatus: number;

  constructor(code: string, message: string, retryable: boolean, httpStatus = 400) {
    super(message);
    this.code = code;
    this.retryable = retryable;
    this.httpStatus = httpStatus;
  }

  toExecError(): ExecError {
    return { code: this.code, message: this.message, retryable: this.retryable };
  }
}

// ============ JSON Schema validatie ============
// Verplaatst naar _shared/rt-validation.ts zodat ook de mcp-server dezelfde
// validator gebruikt; hier ge-re-exporteerd voor bestaande imports en tests.

export { validateSchema } from "../_shared/rt-validation.ts";

// ============ Versie-selectie ============

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

// ============ Provider-routing ============

export interface RouteCandidate {
  provider_id: string;
  provider_key: string;
  provider_status: string;
  priority: number;
  is_active: boolean;
}

// Voorkeuren uit rt_tenant_playbooks.config, conventie:
//   { "provider_preferences": { "<skill_key>": "apollo" | ["apollo", "hubspot"] } }
export function extractProviderPreferences(configs: unknown[], skillKey: string): string[] {
  const prefs: string[] = [];
  for (const config of configs) {
    if (config === null || typeof config !== "object") continue;
    const map = (config as Record<string, unknown>).provider_preferences;
    if (map === null || typeof map !== "object") continue;
    const entry = (map as Record<string, unknown>)[skillKey];
    if (typeof entry === "string") prefs.push(entry);
    else if (Array.isArray(entry)) prefs.push(...entry.filter((e): e is string => typeof e === "string"));
  }
  return [...new Set(prefs)];
}

// Tenant-voorkeur wint; anders laagste priority-waarde. Alleen actieve routes
// naar actieve providers doen mee.
export function selectProvider(
  routes: RouteCandidate[],
  preferredKeys: string[],
): RouteCandidate | null {
  const eligible = routes.filter((r) => r.is_active && r.provider_status === "active");
  if (eligible.length === 0) return null;

  for (const key of preferredKeys) {
    const match = eligible.find((r) => r.provider_key === key);
    if (match) return match;
  }
  return [...eligible].sort((a, b) => a.priority - b.priority)[0];
}

// ============ Vault-referenties ============

export function parseVaultRef(ref: unknown): string {
  if (typeof ref !== "string" || !ref.startsWith("vault://") || ref.length <= "vault://".length) {
    throw new SkillError("invalid_secret_reference", "implementation bevat geen geldige vault:// referentie", false, 500);
  }
  return ref.slice("vault://".length);
}

// ============ Idempotency-hash ============

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

// ============ Provider-response envelope ============

export interface ProviderResult {
  data: unknown;
  confidence?: number;
  cost?: number;
}

// Providers mogen een envelope { data, confidence?, cost? } teruggeven of een
// kaal object; in dat laatste geval is het hele body de data.
export function unwrapProviderResponse(body: unknown): ProviderResult {
  if (body !== null && typeof body === "object" && !Array.isArray(body) && "data" in body) {
    const b = body as Record<string, unknown>;
    return {
      data: b.data,
      confidence: typeof b.confidence === "number" ? b.confidence : undefined,
      cost: typeof b.cost === "number" ? b.cost : undefined,
    };
  }
  return { data: body };
}

// ============ Autorisatie ============

// Alleen callers met de interne token (env RT_INTERNAL_TOKEN) mogen de
// executor aanroepen: de MCP-server en de toekomstige workflow-runner.
// Constant-time vergelijking; een niet-geconfigureerde token weigert alles.
export function checkInternalToken(
  provided: string | null | undefined,
  expected: string | null | undefined,
): boolean {
  if (typeof expected !== "string" || expected.length === 0) return false;
  if (typeof provided !== "string" || provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

// ============ Request-validatie ============

export interface ExecuteRequest {
  tenantId: string;
  skillKey: string;
  skillVersion?: string;
  input: Record<string, unknown>;
  workflowRunId?: string;
  stepRunId?: string;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function parseExecuteRequest(body: unknown): ExecuteRequest {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    throw new SkillError("invalid_request", "Request body moet een JSON-object zijn", false, 400);
  }
  const b = body as Record<string, unknown>;
  if (typeof b.tenantId !== "string" || !UUID_RE.test(b.tenantId)) {
    throw new SkillError("invalid_request", "tenantId (uuid) is verplicht", false, 400);
  }
  if (typeof b.skillKey !== "string" || b.skillKey.length === 0) {
    throw new SkillError("invalid_request", "skillKey is verplicht", false, 400);
  }
  if (b.input === null || typeof b.input !== "object" || Array.isArray(b.input)) {
    throw new SkillError("invalid_request", "input moet een JSON-object zijn", false, 400);
  }
  for (const field of ["workflowRunId", "stepRunId"] as const) {
    if (b[field] !== undefined && (typeof b[field] !== "string" || !UUID_RE.test(b[field] as string))) {
      throw new SkillError("invalid_request", `${field} moet een uuid zijn`, false, 400);
    }
  }
  if (b.skillVersion !== undefined && typeof b.skillVersion !== "string") {
    throw new SkillError("invalid_request", "skillVersion moet een string zijn", false, 400);
  }
  return {
    tenantId: b.tenantId,
    skillKey: b.skillKey,
    skillVersion: b.skillVersion as string | undefined,
    input: b.input as Record<string, unknown>,
    workflowRunId: b.workflowRunId as string | undefined,
    stepRunId: b.stepRunId as string | undefined,
  };
}
