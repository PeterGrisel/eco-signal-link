import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, CheckCircle2, XCircle, Loader2, RefreshCw, Clock, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mcp-server`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

// Read-only payloads — geen mutaties
const TOOL_TESTS: { name: string; args: Record<string, unknown>; mutating?: boolean }[] = [
  { name: "list_blog_posts", args: { limit: 1 } },
  { name: "get_blog_post", args: { slug: "__healthcheck__" } }, // mag falen op "no rows" — tel als "reachable"
  { name: "list_blog_categories", args: {} },
  { name: "list_content_queue", args: { limit: 1 } },
  { name: "list_content_topics", args: {} },
  { name: "get_gsc_data", args: { limit: 1 } },
  { name: "list_indexing_requests", args: { limit: 1 } },
  { name: "get_monthly_evaluations", args: { limit: 1 } },
  { name: "get_site_events", args: { limit: 1 } },
  { name: "list_contact_submissions", args: { limit: 1 } },
  { name: "list_directory_listings", args: {} },
  { name: "get_seo_settings", args: {} },
  // mutating tools — niet auto-getest
  { name: "create_blog_post", args: {}, mutating: true },
  { name: "update_blog_post", args: {}, mutating: true },
  { name: "delete_blog_post", args: {}, mutating: true },
  { name: "update_content_queue_item", args: {}, mutating: true },
  { name: "request_indexing", args: {}, mutating: true },
  { name: "update_seo_settings", args: {}, mutating: true },
];

type Status = "idle" | "running" | "ok" | "warn" | "error";

interface Result {
  status: Status;
  ms?: number;
  message?: string;
  code?: number | string;
  lastSuccessAt?: string;
  testedAt?: string;
}

interface KeyOpt { id: string; name: string; api_key: string; is_active: boolean }

const STORAGE_KEY = "mcp_health_results_v1";
const loadResults = (): Record<string, Result> => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
};
const saveResults = (r: Record<string, Result>) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(r)); } catch { /* ignore */ }
};

async function callMcp(payload: object, apiKey: string, timeoutMs = 15000): Promise<{ status: number; body: unknown; ms: number; error?: string }> {
  const start = performance.now();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
        "x-api-key": apiKey,
        "Authorization": `Bearer ${ANON}`,
      },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    const ms = Math.round(performance.now() - start);
    const text = await res.text();
    let body: unknown = text;
    try { body = JSON.parse(text); } catch { /* keep text */ }
    return { status: res.status, body, ms };
  } catch (err) {
    const ms = Math.round(performance.now() - start);
    return { status: 0, body: null, ms, error: (err as Error).message };
  } finally {
    clearTimeout(timer);
  }
}

export const McpHealthPanel = () => {
  const [keys, setKeys] = useState<KeyOpt[]>([]);
  const [activeKeyId, setActiveKeyId] = useState<string>("");
  const [results, setResults] = useState<Record<string, Result>>(loadResults());
  const [running, setRunning] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [connStatus, setConnStatus] = useState<Result>({ status: "idle" });
  const [toolListStatus, setToolListStatus] = useState<Result & { count?: number }>({ status: "idle" });
  const intervalRef = useRef<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("mcp_api_keys" as never)
        .select("id, name, api_key, is_active")
        .eq("is_active", true)
        .order("created_at", { ascending: true });
      const opts = (data as KeyOpt[] | null) || [];
      setKeys(opts);
      if (opts.length && !activeKeyId) setActiveKeyId(opts[0].id);
    })();
  }, []);

  const apiKey = keys.find(k => k.id === activeKeyId)?.api_key;

  const updateResult = (name: string, r: Result) => {
    setResults(prev => {
      const merged = { ...prev, [name]: { ...prev[name], ...r } };
      saveResults(merged);
      return merged;
    });
  };

  const runConnectionCheck = async () => {
    if (!apiKey) return;
    setConnStatus({ status: "running" });
    const r = await callMcp({
      jsonrpc: "2.0", id: 1, method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "health-panel", version: "1.0" } },
    }, apiKey);
    if (r.status === 200) setConnStatus({ status: "ok", ms: r.ms, code: 200, testedAt: new Date().toISOString(), lastSuccessAt: new Date().toISOString() });
    else setConnStatus({ status: "error", ms: r.ms, code: r.status || r.error || "ERR", message: typeof r.body === "string" ? r.body : JSON.stringify(r.body), testedAt: new Date().toISOString() });
  };

  const runToolsList = async () => {
    if (!apiKey) return;
    setToolListStatus({ status: "running" });
    const r = await callMcp({ jsonrpc: "2.0", id: 2, method: "tools/list" }, apiKey);
    const body = r.body as { result?: { tools?: unknown[] }, error?: { message?: string } } | null;
    if (r.status === 200 && body?.result?.tools) {
      setToolListStatus({ status: "ok", ms: r.ms, code: 200, count: body.result.tools.length, testedAt: new Date().toISOString(), lastSuccessAt: new Date().toISOString() });
    } else {
      setToolListStatus({ status: "error", ms: r.ms, code: r.status || r.error || "ERR", message: body?.error?.message || (typeof r.body === "string" ? r.body : JSON.stringify(r.body)), testedAt: new Date().toISOString() });
    }
  };

  const runToolTest = async (toolName: string, args: Record<string, unknown>) => {
    if (!apiKey) return;
    updateResult(toolName, { status: "running" });
    const r = await callMcp({
      jsonrpc: "2.0", id: Date.now(), method: "tools/call",
      params: { name: toolName, arguments: args },
    }, apiKey);
    const body = r.body as { result?: { content?: { text?: string }[] }, error?: { message?: string, code?: number } } | null;
    const now = new Date().toISOString();
    if (r.status !== 200) {
      updateResult(toolName, { status: "error", ms: r.ms, code: r.status || r.error || "ERR", message: typeof r.body === "string" ? r.body.slice(0, 200) : JSON.stringify(r.body).slice(0, 200), testedAt: now });
      return;
    }
    if (body?.error) {
      updateResult(toolName, { status: "error", ms: r.ms, code: body.error.code ?? "MCP_ERR", message: body.error.message, testedAt: now });
      return;
    }
    const text = body?.result?.content?.[0]?.text || "";
    if (text.startsWith("Error:")) {
      // tool reachable, maar query gaf db-fout — markeer als warn
      updateResult(toolName, { status: "warn", ms: r.ms, code: "DB", message: text.slice(0, 200), testedAt: now, lastSuccessAt: now });
    } else {
      updateResult(toolName, { status: "ok", ms: r.ms, code: 200, message: undefined, testedAt: now, lastSuccessAt: now });
    }
  };

  const runAll = async () => {
    if (!apiKey) {
      toast({ title: "Geen actieve API key", description: "Maak eerst een MCP key aan.", variant: "destructive" });
      return;
    }
    setRunning(true);
    await runConnectionCheck();
    await runToolsList();
    // Sequentieel zodat we de server niet ddos'en
    for (const t of TOOL_TESTS) {
      if (t.mutating) continue;
      await runToolTest(t.name, t.args);
    }
    setRunning(false);
  };

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = window.setInterval(() => { if (!running) runAll(); }, 15000);
      return () => { if (intervalRef.current) window.clearInterval(intervalRef.current); };
    }
    if (intervalRef.current) window.clearInterval(intervalRef.current);
  }, [autoRefresh, apiKey]);

  const summary = TOOL_TESTS.filter(t => !t.mutating).reduce((acc, t) => {
    const s = results[t.name]?.status || "idle";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className="p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> MCP Endpoint Status
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Realtime health-check per tool · response-tijd, foutcodes en laatste succes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={activeKeyId} onValueChange={setActiveKeyId}>
            <SelectTrigger className="w-[200px] h-9">
              <SelectValue placeholder="Kies API key" />
            </SelectTrigger>
            <SelectContent>
              {keys.map(k => <SelectItem key={k.id} value={k.id}>{k.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} id="auto" />
            <label htmlFor="auto" className="text-xs text-muted-foreground">Auto 15s</label>
          </div>
          <Button size="sm" onClick={runAll} disabled={running || !apiKey} className="gap-2">
            {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Test alles
          </Button>
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2 text-xs">
        <Badge variant="outline" className="gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" />OK: {summary.ok || 0}</Badge>
        <Badge variant="outline" className="gap-1"><Zap className="w-3 h-3 text-yellow-500" />Warn: {summary.warn || 0}</Badge>
        <Badge variant="outline" className="gap-1"><XCircle className="w-3 h-3 text-destructive" />Error: {summary.error || 0}</Badge>
        <Badge variant="outline" className="gap-1"><Clock className="w-3 h-3 text-muted-foreground" />Idle: {summary.idle || 0}</Badge>
      </div>

      {/* Connection + tools/list */}
      <div className="grid sm:grid-cols-2 gap-3">
        <StatusRow label="Connection (initialize)" result={connStatus} onTest={runConnectionCheck} disabled={!apiKey || running} />
        <StatusRow label={`tools/list${toolListStatus.count !== undefined ? ` · ${toolListStatus.count} tools` : ""}`} result={toolListStatus} onTest={runToolsList} disabled={!apiKey || running} />
      </div>

      {/* Per-tool list */}
      <div className="space-y-1">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Read-only tool tests</div>
        {TOOL_TESTS.filter(t => !t.mutating).map(t => (
          <StatusRow
            key={t.name}
            label={t.name}
            result={results[t.name] || { status: "idle" }}
            onTest={() => runToolTest(t.name, t.args)}
            disabled={!apiKey || running}
            compact
          />
        ))}
      </div>

      {/* Mutating tools — geen auto-test */}
      <div className="space-y-1">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Mutating tools (handmatig)</div>
        {TOOL_TESTS.filter(t => t.mutating).map(t => (
          <div key={t.name} className="flex items-center justify-between text-xs py-1.5 px-2 rounded border border-dashed border-border">
            <span className="font-mono text-muted-foreground">{t.name}</span>
            <Badge variant="secondary" className="text-[10px]">skipped (mutates data)</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};

const StatusRow = ({
  label, result, onTest, disabled, compact,
}: { label: string; result: Result; onTest: () => void; disabled?: boolean; compact?: boolean }) => {
  const dot = {
    idle: "bg-muted-foreground/40",
    running: "bg-blue-500 animate-pulse",
    ok: "bg-green-500",
    warn: "bg-yellow-500",
    error: "bg-destructive",
  }[result.status];

  const fmtAge = (iso?: string) => {
    if (!iso) return "—";
    const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60) return `${s}s geleden`;
    if (s < 3600) return `${Math.round(s / 60)}m geleden`;
    return `${Math.round(s / 3600)}u geleden`;
  };

  return (
    <div className={`flex items-center justify-between gap-3 ${compact ? "py-1.5 px-2" : "p-3"} rounded border border-border bg-card/50 hover:bg-card transition-colors`}>
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
        <span className={`font-mono ${compact ? "text-xs" : "text-sm"} truncate`}>{label}</span>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
        {result.code !== undefined && (
          <span className={`font-mono ${result.status === "error" ? "text-destructive" : result.status === "warn" ? "text-yellow-500" : ""}`}>
            {result.code}
          </span>
        )}
        {result.ms !== undefined && <span>{result.ms}ms</span>}
        <span className="hidden sm:inline">{fmtAge(result.lastSuccessAt)}</span>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]" onClick={onTest} disabled={disabled}>
          {result.status === "running" ? <Loader2 className="w-3 h-3 animate-spin" /> : "Test"}
        </Button>
      </div>
      {result.message && result.status !== "ok" && (
        <div className="hidden lg:block text-[10px] text-destructive max-w-[300px] truncate" title={result.message}>
          {result.message}
        </div>
      )}
    </div>
  );
};
