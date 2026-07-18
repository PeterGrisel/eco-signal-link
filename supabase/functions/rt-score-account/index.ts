// rt-score-account — AI-scoring van een account tegen de tenant-ICP.
// Port van de Claude Haiku ICP-filter (RELEVANT/RUIS) uit de n8n Website
// Visitors Sync-flow, conform het dispatch-contract van rt-execute-skill:
//   input : { tenantId, skillKey, skillVersion, input: {account, icp_context},
//             credential, credential_reference, context }
//   output: envelope { data: {score, reasons, disqualifiers}, confidence, cost }
// Mapping verdict → score: RUIS < 30, RELEVANT-zwak 50-70, RELEVANT-sterk 70-100.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const MODEL = "claude-haiku-4-5";
// Prijzen per 1M tokens (Haiku 4.5): input $1, output $5.
const INPUT_COST_PER_TOKEN = 1 / 1_000_000;
const OUTPUT_COST_PER_TOKEN = 5 / 1_000_000;

const VERDICT_SCHEMA = {
  type: "object",
  properties: {
    verdict: { type: "string", enum: ["RUIS", "RELEVANT_ZWAK", "RELEVANT_STERK"] },
    score: { type: "integer" },
    reasons: { type: "array", items: { type: "string" } },
    disqualifiers: { type: "array", items: { type: "string" } },
    confidence: { type: "number" },
  },
  required: ["verdict", "score", "reasons", "disqualifiers", "confidence"],
  additionalProperties: false,
} as const;

function buildPrompt(account: Record<string, unknown>, icpContext: string): string {
  return `Je bent de AI prospect-filter van een B2B GTM-runtime. Beoordeel of het onderstaande bedrijf RELEVANT of RUIS is voor de klant, uitsluitend op basis van de meegegeven ICP-context.

## ICP-CONTEXT VAN DE KLANT
${icpContext}

## TE BEOORDELEN BEDRIJF
${JSON.stringify(account, null, 2)}

## BEOORDELING
Geef je oordeel als JSON:
- verdict: "RUIS" (past niet bij de ICP), "RELEVANT_ZWAK" (past, maar met twijfels of beperkte fit) of "RELEVANT_STERK" (duidelijke ICP-match)
- score: integer 0-100, consistent met het verdict: RUIS => 0-29, RELEVANT_ZWAK => 50-70, RELEVANT_STERK => 70-100
- reasons: korte, concrete redenen voor het oordeel (max 5)
- disqualifiers: expliciete diskwalificaties uit de ICP-context die van toepassing zijn (leeg bij geen)
- confidence: 0-1, hoe zeker je bent gezien de beschikbare data (weinig bedrijfsdata => lager)

Wees streng: bij twijfel tussen RUIS en RELEVANT_ZWAK op basis van de RUIS-criteria kies je RUIS.`;
}

function clampScore(verdict: string, score: number): number {
  const bands: Record<string, [number, number]> = {
    RUIS: [0, 29],
    RELEVANT_ZWAK: [50, 70],
    RELEVANT_STERK: [70, 100],
  };
  const [lo, hi] = bands[verdict] ?? [0, 100];
  const s = Number.isFinite(score) ? Math.round(score) : lo;
  return Math.min(hi, Math.max(lo, s));
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method !== "POST") {
    return jsonResponse(405, { error: { code: "method_not_allowed", message: "Gebruik POST", retryable: false } });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse(400, { error: { code: "invalid_request", message: "Body moet JSON zijn", retryable: false } });
  }

  const input = payload.input as Record<string, unknown> | undefined;
  const account = input?.account as Record<string, unknown> | undefined;
  const icpContext = input?.icp_context as string | undefined;
  if (!account || typeof account !== "object" || typeof icpContext !== "string" || icpContext.length === 0) {
    return jsonResponse(400, {
      error: { code: "invalid_request", message: "input.account (object) en input.icp_context (string) zijn verplicht", retryable: false },
    });
  }

  // Env-key eerst; anders de door de executor intern geresolvede credential.
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY") ?? (typeof payload.credential === "string" ? payload.credential : null);
  if (!apiKey) {
    return jsonResponse(500, {
      error: { code: "credential_missing", message: "Geen ANTHROPIC_API_KEY geconfigureerd en geen credential meegegeven", retryable: false },
    });
  }

  let response: Response;
  try {
    response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        output_config: { format: { type: "json_schema", schema: VERDICT_SCHEMA } },
        messages: [{ role: "user", content: buildPrompt(account, icpContext) }],
      }),
    });
  } catch {
    return jsonResponse(502, { error: { code: "provider_unreachable", message: "Anthropic API niet bereikbaar", retryable: true } });
  }

  const bodyText = await response.text();
  if (!response.ok) {
    // Geen response-body doorgeven: kan prompt-/accountdata bevatten, en bij
    // 401 verwijzingen naar de key. Alleen status + generiek bericht.
    const retryable = response.status === 429 || response.status >= 500;
    return jsonResponse(502, {
      error: { code: "provider_error", message: `Anthropic API gaf HTTP ${response.status}`, retryable },
    });
  }

  let verdictRaw: {
    verdict: string;
    score: number;
    reasons: string[];
    disqualifiers: string[];
    confidence: number;
  };
  let usage: { input_tokens?: number; output_tokens?: number } = {};
  try {
    const message = JSON.parse(bodyText);
    if (message.stop_reason === "refusal") {
      return jsonResponse(502, { error: { code: "provider_refusal", message: "Model weigerde de beoordeling", retryable: false } });
    }
    usage = message.usage ?? {};
    const textBlock = (message.content as { type: string; text?: string }[]).find((b) => b.type === "text");
    verdictRaw = JSON.parse(textBlock?.text ?? "");
  } catch {
    return jsonResponse(502, { error: { code: "provider_invalid_response", message: "Model gaf geen geldige JSON terug", retryable: true } });
  }

  const cost = (usage.input_tokens ?? 0) * INPUT_COST_PER_TOKEN + (usage.output_tokens ?? 0) * OUTPUT_COST_PER_TOKEN;
  const confidence = Math.min(1, Math.max(0, Number(verdictRaw.confidence) || 0.5));

  // Envelope conform het rt-execute-skill contract; `data` voldoet aan het
  // score_account output_schema (score/reasons/disqualifiers, geen extra keys).
  return jsonResponse(200, {
    data: {
      score: clampScore(verdictRaw.verdict, verdictRaw.score),
      reasons: (verdictRaw.reasons ?? []).slice(0, 5).map(String),
      disqualifiers: (verdictRaw.disqualifiers ?? []).map(String),
    },
    confidence,
    cost: Math.round(cost * 1_000_000) / 1_000_000,
  });
});
