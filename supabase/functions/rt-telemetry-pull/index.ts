// rt-telemetry-pull — implementatie van de vijf telemetrie-skills (deel I2).
// Wordt via rt-execute-skill aangeroepen (dispatch-contract) en dispatcht
// intern op skillKey. Pure API-reads; alle berekeningen (salescycle, win/loss,
// herkomst, monthly) horen HIER, niet in de frontend.
//
// Input:  { tenantId, skillKey, input: { tenant_config }, credential, ... }
//   tenant_config = source_context uit rt_tenant_playbooks.config, met o.a.
//   optionele endpoints voor providers zonder vast publiek API-pad
//   (planable.stats_url, stairoids.scores_url) en heyreach.campaign_ids.
// Output: het DATA-blok van de skill (zie rt_skill_versions output_schema).
// Bij deelfout binnen pull_pipedrive_stats: de gelukte blokken + partial:true.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

type Json = Record<string, unknown>;

const round1 = (n: number) => Math.round(n * 10) / 10;
const pct = (num: number, den: number) => (den > 0 ? round1((num / den) * 100) : 0);
const num = (v: unknown, fallback = 0): number => (typeof v === "number" && Number.isFinite(v) ? v : fallback);
const daysAgoIso = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

function providerError(message: string, retryable = true): Response {
  return jsonResponse(502, { error: { code: "provider_error", message, retryable } });
}

// ============ Pipedrive ============

interface PipedriveDeal {
  id: number;
  title: string;
  value: number | null;
  status: string; // open | won | lost
  stage_id: number;
  add_time: string | null;
  won_time: string | null;
  lost_reason: string | null;
  label: string | number | null; // komma-lijst van label-optie-ids
  org_name?: string | null;
}

async function pipedriveGet(path: string, token: string, params: Record<string, string> = {}): Promise<Json> {
  const url = new URL(`https://api.pipedrive.com/v1/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("api_token", token);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Pipedrive ${path} gaf HTTP ${res.status}`);
  return await res.json();
}

async function pullPipedrive(token: string): Promise<Json> {
  const errors: string[] = [];

  // Deals (gepagineerd, cap 2000) — fataal als dit niet lukt.
  const deals: PipedriveDeal[] = [];
  let start = 0;
  for (let page = 0; page < 4; page++) {
    const body = await pipedriveGet("deals", token, { status: "all_not_deleted", limit: "500", start: String(start) });
    const items = (body.data ?? []) as PipedriveDeal[];
    deals.push(...items);
    const more = (body.additional_data as Json | undefined)?.pagination as Json | undefined;
    if (!more?.more_items_in_collection) break;
    start = num(more.next_start, start + 500);
  }

  // Stages en deal-labels: best-effort.
  let stageNames = new Map<number, { name: string; order: number }>();
  try {
    const body = await pipedriveGet("stages", token);
    stageNames = new Map(
      ((body.data ?? []) as { id: number; name: string; order_nr?: number }[]).map((s, i) => [s.id, { name: s.name, order: s.order_nr ?? i }]),
    );
  } catch (e) {
    errors.push(`stages: ${(e as Error).message}`);
  }
  let labelNames = new Map<string, string>();
  try {
    const body = await pipedriveGet("dealFields", token);
    const labelField = ((body.data ?? []) as Json[]).find((f) => f.key === "label");
    for (const opt of ((labelField?.options ?? []) as { id: number | string; label: string }[])) {
      labelNames.set(String(opt.id), opt.label);
    }
  } catch (e) {
    errors.push(`dealFields: ${(e as Error).message}`);
  }

  const dealLabels = (d: PipedriveDeal): string[] =>
    d.label == null ? [] : String(d.label).split(",").map((id) => labelNames.get(id.trim()) ?? "").filter(Boolean);

  const open = deals.filter((d) => d.status === "open");
  const won = deals.filter((d) => d.status === "won");
  const lost = deals.filter((d) => d.status === "lost");
  const sumValue = (list: PipedriveDeal[]) => Math.round(list.reduce((s, d) => s + num(d.value), 0));

  const out: Json = {};

  try {
    const stageAgg = new Map<number, { count: number; value: number }>();
    for (const d of open) {
      const agg = stageAgg.get(d.stage_id) ?? { count: 0, value: 0 };
      agg.count++;
      agg.value += num(d.value);
      stageAgg.set(d.stage_id, agg);
    }
    out.pipedrive = {
      open: { count: open.length, value: sumValue(open) },
      won: { count: won.length, value: sumValue(won) },
      lost: { count: lost.length, value: sumValue(lost) },
      winRateCount: pct(won.length, won.length + lost.length),
      winRateValue: pct(sumValue(won), sumValue(won) + sumValue(lost)),
      stages: [...stageAgg.entries()]
        .map(([id, agg]) => ({ name: stageNames.get(id)?.name ?? `stage ${id}`, order: stageNames.get(id)?.order ?? 0, count: agg.count, value: Math.round(agg.value) }))
        .sort((a, b) => a.order - b.order)
        .map(({ name, count, value }) => ({ name, count, value })),
      topOpen: [...open]
        .sort((a, b) => num(b.value) - num(a.value))
        .slice(0, 6)
        .map((d) => ({ title: d.title, org: d.org_name ?? null, value: Math.round(num(d.value)), stage: stageNames.get(d.stage_id)?.name ?? null })),
      recentWon: [...won]
        .sort((a, b) => Date.parse(b.won_time ?? "0") - Date.parse(a.won_time ?? "0"))
        .slice(0, 4)
        .map((d) => ({ title: d.title, org: d.org_name ?? null, value: Math.round(num(d.value)), won_time: d.won_time })),
    };
  } catch (e) {
    errors.push(`pipedrive: ${(e as Error).message}`);
  }

  try {
    // Salescycle uit add_time -> won_time.
    const cycles = won
      .filter((d) => d.add_time && d.won_time)
      .map((d) => Math.max(0, (Date.parse(d.won_time!) - Date.parse(d.add_time!)) / 86_400_000));
    const sorted = [...cycles].sort((a, b) => a - b);
    const median = sorted.length === 0 ? 0 : sorted.length % 2 === 1
      ? sorted[(sorted.length - 1) / 2]
      : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
    out.salescycle = {
      medianFunnel: round1(median),
      meanFunnel: round1(cycles.length ? cycles.reduce((s, c) => s + c, 0) / cycles.length : 0),
      sameDayPct: pct(cycles.filter((c) => c < 1).length, cycles.length),
      funnelDeals: cycles.length,
    };
  } catch (e) {
    errors.push(`salescycle: ${(e as Error).message}`);
  }

  try {
    const perStage = new Map<string, { wonC: number; wonV: number; lostC: number; lostV: number }>();
    for (const d of [...won, ...lost]) {
      const name = stageNames.get(d.stage_id)?.name ?? `stage ${d.stage_id}`;
      const agg = perStage.get(name) ?? { wonC: 0, wonV: 0, lostC: 0, lostV: 0 };
      if (d.status === "won") { agg.wonC++; agg.wonV += num(d.value); } else { agg.lostC++; agg.lostV += num(d.value); }
      perStage.set(name, agg);
    }
    const lostReasons = new Map<string, number>();
    for (const d of lost) {
      const reason = (d.lost_reason ?? "onbekend").trim() || "onbekend";
      lostReasons.set(reason, (lostReasons.get(reason) ?? 0) + 1);
    }
    out.winloss = {
      stages: [...perStage.entries()].map(([stage, a]) => ({ stage, wonC: a.wonC, wonV: Math.round(a.wonV), lostC: a.lostC, lostV: Math.round(a.lostV) })),
      lostReasons: [...lostReasons.entries()].map(([reason, count]) => ({ reason, count })).sort((a, b) => b.count - a.count),
    };
  } catch (e) {
    errors.push(`winloss: ${(e as Error).message}`);
  }

  try {
    // Herkomst via deal-labels: bron (Netwerk/Outbound/Training), overige
    // labels als kanaal-verdeling, plus de hot-lijst.
    const BRONNEN = ["Netwerk", "Outbound", "Training"];
    const bron = (d: PipedriveDeal) => dealLabels(d).find((l) => BRONNEN.some((b) => l.toLowerCase() === b.toLowerCase())) ?? "Overig";
    const perBron = new Map<string, { open: number; won: number }>();
    for (const b of [...BRONNEN, "Overig"]) perBron.set(b, { open: 0, won: 0 });
    for (const d of [...open, ...won]) {
      const key = BRONNEN.find((b) => b.toLowerCase() === bron(d).toLowerCase()) ?? "Overig";
      const agg = perBron.get(key)!;
      if (d.status === "open") agg.open++;
      else agg.won++;
    }
    const channels = new Map<string, number>();
    for (const d of deals) {
      for (const l of dealLabels(d)) {
        if (!BRONNEN.some((b) => b.toLowerCase() === l.toLowerCase()) && l.toLowerCase() !== "hot") {
          channels.set(l, (channels.get(l) ?? 0) + 1);
        }
      }
    }
    out.herkomst = {
      bronnen: [...perBron.entries()].map(([naam, a]) => ({ naam, open: a.open, won: a.won })),
      channels: [...channels.entries()].map(([naam, count]) => ({ naam, count })).sort((a, b) => b.count - a.count),
      hot: open
        .filter((d) => dealLabels(d).some((l) => l.toLowerCase() === "hot"))
        .map((d) => ({ title: d.title, org: d.org_name ?? null, value: Math.round(num(d.value)) })),
    };
  } catch (e) {
    errors.push(`herkomst: ${(e as Error).message}`);
  }

  try {
    // Nieuwe deals per maand (laatste 12), netwerk vs outbound via bron-label.
    const months = new Map<string, { total: number; netwerk: number; outbound: number }>();
    for (const d of deals) {
      if (!d.add_time) continue;
      const month = d.add_time.slice(0, 7);
      const agg = months.get(month) ?? { total: 0, netwerk: 0, outbound: 0 };
      agg.total++;
      const labels = dealLabels(d).map((l) => l.toLowerCase());
      if (labels.includes("netwerk")) agg.netwerk++;
      if (labels.includes("outbound")) agg.outbound++;
      months.set(month, agg);
    }
    out.monthly = [...months.entries()]
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .slice(-12)
      .map(([month, a]) => ({ month, total: a.total, netwerk: a.netwerk, outbound: a.outbound }));
  } catch (e) {
    errors.push(`monthly: ${(e as Error).message}`);
  }

  if (errors.length > 0) {
    out.partial = true;
    out.errors = errors.map((e) => e.slice(0, 120));
  }
  return out;
}

// ============ HeyReach ============

async function pullHeyReach(apiKey: string, tenantConfig: Json): Promise<Json> {
  const since = daysAgoIso(30);
  const heyreachCfg = (tenantConfig.heyreach ?? {}) as Json;
  const res = await fetch("https://api.heyreach.io/api/public/stats/GetOverallStats", {
    method: "POST",
    headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      accountIds: heyreachCfg.account_ids ?? [],
      campaignIds: heyreachCfg.campaign_ids ?? [],
      startDate: `${since}T00:00:00Z`,
      endDate: new Date().toISOString(),
    }),
  });
  if (!res.ok) throw new Error(`HeyReach gaf HTTP ${res.status}`);
  const body = await res.json();
  // HeyReach nest de totalen onder overallStats/byDayStats afhankelijk van
  // versie; defensief mappen.
  const s = (body.overallStats ?? body.stats ?? body) as Json;
  const connectionsSent = num(s.connectionsSent);
  const connectionsAccepted = num(s.connectionsAccepted);
  const messagesStarted = num(s.messagesSent ?? s.messagesStarted);
  const messageReplies = num(s.messageReplies);
  const inmailStarted = num(s.inMailsSent ?? s.inmailsSent);
  const inmailReplies = num(s.inMailReplies ?? s.inmailReplies);
  const interested = num(s.interested ?? s.leadsInterested);
  const uniqueLeads = num(s.uniqueLeadsContacted ?? s.uniqueLeads);
  return {
    uniqueLeads,
    connectionsSent,
    connectionsAccepted,
    acceptRate: pct(connectionsAccepted, connectionsSent),
    messagesStarted,
    messageReplies,
    replyRate: pct(messageReplies, messagesStarted),
    inmailStarted,
    inmailReplies,
    inmailReplyRate: pct(inmailReplies, inmailStarted),
    interested,
    tagged: num(s.tagged),
    interestedRate: pct(interested, uniqueLeads),
    profileViews: num(s.profileViews),
    postLikes: num(s.postLikes),
    since,
  };
}

// ============ Apollo ============

async function pullApolloSequences(apiKey: string): Promise<Json> {
  const res = await fetch("https://api.apollo.io/v1/emailer_campaigns/search", {
    method: "POST",
    headers: { "X-Api-Key": apiKey, "Content-Type": "application/json", "Cache-Control": "no-cache" },
    body: JSON.stringify({ page: 1, per_page: 100 }),
  });
  if (!res.ok) throw new Error(`Apollo gaf HTTP ${res.status}`);
  const body = await res.json();
  const campaigns = ((body.emailer_campaigns ?? []) as Json[]).filter((c) => c.active !== false);
  const sum = (key: string) => campaigns.reduce((s, c) => s + num(c[key]), 0);
  const contactsInSequence = sum("num_contacted") || sum("unique_scheduled");
  const emailsSent = sum("emails_sent") || sum("unique_scheduled");
  const delivered = sum("unique_delivered");
  const opened = sum("unique_opened");
  const replied = sum("unique_replied");
  return {
    contactsInSequence,
    emailsSent,
    delivered,
    opened,
    openRate: pct(opened, delivered || emailsSent),
    replied,
    replyRate: pct(replied, delivered || emailsSent),
    meetings: sum("num_meetings_booked") || sum("unique_demoed"),
  };
}

// ============ Planable / Stairoids ============
// Beide zonder vast publiek statistiek-endpoint: de URL komt uit
// tenant_config (source_context), de credential gaat mee als Bearer.

async function pullConfiguredJson(url: unknown, credential: string, providerName: string): Promise<Json> {
  if (typeof url !== "string" || url.length === 0) {
    throw new Error(`${providerName} is niet geconfigureerd: zet de stats-URL in rt_tenant_playbooks.config.source_context`);
  }
  const res = await fetch(url, { headers: { Authorization: `Bearer ${credential}`, "Content-Type": "application/json" } });
  if (!res.ok) throw new Error(`${providerName} gaf HTTP ${res.status}`);
  return await res.json();
}

// Planable Public API (base https://api.planable.io/api/v1, token pln_...,
// Bearer-auth). Vereist planable.workspace_id in source_context; optioneel
// blijft planable.stats_url als escape hatch voor een kant-en-klaar blok.
async function planableGet(base: string, path: string, token: string, params: Record<string, string> = {}): Promise<Json> {
  const url = new URL(`${base}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Planable ${path} gaf HTTP ${res.status} — check api.planable.io/api/v1/docs`);
  return await res.json();
}

function planableList(body: Json): Json[] {
  if (Array.isArray(body)) return body as Json[];
  for (const key of ["data", "items", "pages", "posts", "results"]) {
    if (Array.isArray(body[key])) return body[key] as Json[];
  }
  return [];
}

async function pullPlanable(credential: string, tenantConfig: Json): Promise<Json> {
  const cfg = (tenantConfig.planable ?? {}) as Json;
  const since = daysAgoIso(30);
  const until = daysAgoIso(0);

  if (typeof cfg.stats_url === "string" && cfg.stats_url.length > 0) {
    const s = await pullConfiguredJson(cfg.stats_url, credential, "Planable");
    const likes = num(s.likes);
    const comments = num(s.comments);
    const shares = num(s.shares);
    const engagement = num(s.engagement, likes + comments + shares);
    const impressions = num(s.impressions);
    return {
      posts: num(s.posts),
      impressions,
      engagement,
      likes,
      comments,
      shares,
      engagementRate: typeof s.engagementRate === "number" ? round1(s.engagementRate) : pct(engagement, impressions),
      pages: Array.isArray(s.pages) ? s.pages : [],
      since: typeof s.since === "string" ? s.since : since,
    };
  }

  const base = typeof cfg.base_url === "string" && cfg.base_url ? cfg.base_url : "https://api.planable.io/api/v1";
  const workspaceId = cfg.workspace_id;
  if (typeof workspaceId !== "string" || workspaceId.length === 0) {
    throw new Error("Planable: zet planable.workspace_id in rt_tenant_playbooks.config.source_context");
  }

  // Pagina's van de workspace; parameternaam defensief (workspaceId | workspace).
  let pagesBody: Json;
  try {
    pagesBody = await planableGet(base, "/pages", credential, { workspaceId });
  } catch {
    pagesBody = await planableGet(base, "/pages", credential, { workspace: workspaceId });
  }
  const pages = planableList(pagesBody);

  const totals = { impressions: 0, likes: 0, comments: 0, shares: 0, engagement: 0 };
  const pageSummaries: Json[] = [];
  for (const p of pages.slice(0, 10)) {
    const id = String(p.id ?? p._id ?? "");
    const name = String(p.name ?? p.title ?? id);
    if (!id) continue;
    try {
      const a = await planableGet(base, `/pages/${id}/analytics`, credential, { from: since, to: until });
      const m = ((a.data ?? a.metrics ?? a) as Json) ?? {};
      const impressions = num(m.impressions ?? m.totalImpressions ?? m.reach);
      const likes = num(m.likes ?? m.reactions);
      const comments = num(m.comments);
      const shares = num(m.shares ?? m.reposts);
      const engagement = num(m.engagement ?? m.totalEngagement, likes + comments + shares);
      totals.impressions += impressions;
      totals.likes += likes;
      totals.comments += comments;
      totals.shares += shares;
      totals.engagement += engagement;
      pageSummaries.push({ name, impressions, engagement });
    } catch {
      pageSummaries.push({ name, error: "analytics niet beschikbaar" });
    }
  }

  // Aantal posts in de periode (best-effort; telling mag ontbreken).
  let posts = 0;
  try {
    const postsBody = await planableGet(base, "/posts", credential, { workspaceId, from: since, to: until });
    const list = planableList(postsBody);
    posts = list.length > 0 ? list.length : num(postsBody.total);
  } catch { /* optioneel */ }

  const engagement = totals.engagement || totals.likes + totals.comments + totals.shares;
  return {
    posts,
    impressions: totals.impressions,
    engagement,
    likes: totals.likes,
    comments: totals.comments,
    shares: totals.shares,
    engagementRate: pct(engagement, totals.impressions),
    pages: pageSummaries,
    since,
  };
}

function mapStairoidsPayload(raw: unknown): Json {
  // Accepteert {scored, stages, top} of een kale array van scores.
  const s = (Array.isArray(raw) ? { top: raw } : (raw ?? {})) as Json;
  const top = (Array.isArray(s.top) ? s.top : []) as Json[];
  return {
    scored: num(s.scored, top.length),
    stages: Array.isArray(s.stages) ? s.stages : [],
    top: top.slice(0, 8).map((t) => ({
      company: String(t.company ?? t.name ?? t.organization ?? ""),
      score: Math.round(num(t.score)),
      segment: (t.segment as string | undefined) ?? null,
      person: (t.person as string | undefined) ?? null,
      role: (t.role as string | undefined) ?? null,
      stage: (t.stage as string | undefined) ?? null,
      employees: (t.employees as string | number | undefined) ?? null,
      fit: (t.fit as string | undefined) ?? null,
    })),
  };
}

// Stairoids levert alleen een MCP-server. Minimale Streamable-HTTP MCP-client:
// initialize -> tools/list -> beste scores-tool aanroepen. De mcpKey (de
// vault-credential) wordt aan de URL toegevoegd; de URL zelf staat zonder key
// in source_context (stairoids.mcp_url).
async function mcpRpc(url: string, body: Json, sessionId?: string): Promise<{ json: Json | null; sessionId?: string }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json, text/event-stream",
  };
  if (sessionId) headers["Mcp-Session-Id"] = sessionId;
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`Stairoids MCP gaf HTTP ${res.status}`);
  const sid = res.headers.get("mcp-session-id") ?? sessionId;
  const text = await res.text();
  if (!text) return { json: null, sessionId: sid };
  if ((res.headers.get("content-type") ?? "").includes("text/event-stream")) {
    let last: Json | null = null;
    for (const line of text.split("\n")) {
      const m = line.match(/^data:\s*(.+)$/);
      if (m) {
        try { last = JSON.parse(m[1]); } catch { /* geen JSON-regel */ }
      }
    }
    return { json: last, sessionId: sid };
  }
  return { json: JSON.parse(text), sessionId: sid };
}

async function pullStairoidsViaMcp(mcpUrl: string, mcpKey: string): Promise<Json> {
  const url = mcpUrl.includes("mcpKey=") ? mcpUrl : `${mcpUrl}${mcpUrl.includes("?") ? "&" : "?"}mcpKey=${encodeURIComponent(mcpKey)}`;

  const init = await mcpRpc(url, {
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2025-03-26",
      capabilities: {},
      clientInfo: { name: "rt-telemetry-pull", version: "1.0.0" },
    },
  });
  const sid = init.sessionId;
  await mcpRpc(url, { jsonrpc: "2.0", method: "notifications/initialized" }, sid).catch(() => null);

  const listed = await mcpRpc(url, { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} }, sid);
  const tools = (((listed.json?.result as Json | undefined)?.tools ?? []) as { name: string; description?: string }[]);
  if (tools.length === 0) throw new Error("Stairoids MCP heeft geen tools");
  const tool = tools.find((t) => /score|stair|top|lead|signal/i.test(`${t.name} ${t.description ?? ""}`)) ?? tools[0];

  const called = await mcpRpc(url, {
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: { name: tool.name, arguments: {} },
  }, sid);
  const result = (called.json?.result ?? {}) as Json;
  if (called.json?.error) throw new Error(`Stairoids MCP tool "${tool.name}" gaf een fout`);

  let raw: unknown = result.structuredContent ?? null;
  if (raw == null) {
    const textBlock = ((result.content ?? []) as { type: string; text?: string }[]).find((c) => c.type === "text");
    if (!textBlock?.text) throw new Error(`Stairoids MCP tool "${tool.name}" gaf geen bruikbare content`);
    try {
      raw = JSON.parse(textBlock.text);
    } catch {
      throw new Error(`Stairoids MCP tool "${tool.name}" gaf geen JSON terug`);
    }
  }
  return mapStairoidsPayload(raw);
}

async function pullStairoids(credential: string, tenantConfig: Json): Promise<Json> {
  const cfg = (tenantConfig.stairoids ?? {}) as Json;
  if (typeof cfg.mcp_url === "string" && cfg.mcp_url.length > 0) {
    return await pullStairoidsViaMcp(cfg.mcp_url, credential);
  }
  return mapStairoidsPayload(await pullConfiguredJson(cfg.scores_url, credential, "Stairoids"));
}

// ============ Dispatcher ============

serve(async (req) => {
  if (req.method !== "POST") {
    return jsonResponse(405, { error: { code: "method_not_allowed", message: "Gebruik POST", retryable: false } });
  }

  let payload: Json;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse(400, { error: { code: "invalid_request", message: "Body moet JSON zijn", retryable: false } });
  }

  const skillKey = payload.skillKey as string;
  const tenantConfig = ((payload.input as Json | undefined)?.tenant_config ?? {}) as Json;
  const credential = typeof payload.credential === "string" ? payload.credential : null;
  if (!credential) {
    return jsonResponse(500, {
      error: { code: "credential_missing", message: "Geen provider-credential meegegeven; registreer die in rt_provider_credentials", retryable: false },
    });
  }

  try {
    let data: Json;
    switch (skillKey) {
      case "pull_pipedrive_stats":
        data = await pullPipedrive(credential);
        break;
      case "pull_heyreach_stats":
        data = await pullHeyReach(credential, tenantConfig);
        break;
      case "pull_apollo_sequence_stats":
        data = await pullApolloSequences(credential);
        break;
      case "pull_planable_stats":
        data = await pullPlanable(credential, tenantConfig);
        break;
      case "pull_stairoids_scores":
        data = await pullStairoids(credential, tenantConfig);
        break;
      default:
        return jsonResponse(400, { error: { code: "unknown_skill", message: `Onbekende telemetrie-skill "${skillKey}"`, retryable: false } });
    }
    return jsonResponse(200, { data, cost: 0 });
  } catch (e) {
    // Geen bodies/keys doorgeven — alleen een korte, generieke melding.
    const message = e instanceof Error ? e.message.slice(0, 160) : "onbekende providerfout";
    return providerError(message);
  }
});
