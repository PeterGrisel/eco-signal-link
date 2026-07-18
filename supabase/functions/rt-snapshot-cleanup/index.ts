// rt-snapshot-cleanup — verwijdert verlopen rt_snapshots inclusief hun
// Storage-objecten (bucket 'rt-snapshots'). Dagelijks aangeroepen door
// pg_cron (03:00 UTC); autorisatie via x-rt-internal-token.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkInternalToken } from "../rt-execute-skill/lib.ts";

serve(async (req) => {
  if (!checkInternalToken(req.headers.get("x-rt-internal-token"), Deno.env.get("RT_INTERNAL_TOKEN"))) {
    return new Response(JSON.stringify({ error: { code: "unauthorized", message: "Ongeldige of ontbrekende x-rt-internal-token header", retryable: false } }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const startedAt = Date.now();
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  let deleted = 0;
  let storageDeleted = 0;
  let status = "success";
  let message: string | null = null;

  try {
    // In batches zodat één run nooit onbegrensd groot wordt.
    for (let batch = 0; batch < 50; batch++) {
      const { data: expired, error } = await supabase
        .from("rt_snapshots")
        .select("id, storage_path")
        .lt("expires_at", new Date().toISOString())
        .limit(200);
      if (error) throw new Error(`select mislukt: ${error.message}`);
      if (!expired || expired.length === 0) break;

      const paths = expired.map((s: { storage_path: string | null }) => s.storage_path).filter((p: string | null): p is string => !!p);
      if (paths.length > 0) {
        const { error: stErr } = await supabase.storage.from("rt-snapshots").remove(paths);
        if (stErr) console.error("storage remove failed:", stErr.message);
        else storageDeleted += paths.length;
      }

      const ids = expired.map((s: { id: string }) => s.id);
      const { error: delErr } = await supabase.from("rt_snapshots").delete().in("id", ids);
      if (delErr) throw new Error(`delete mislukt: ${delErr.message}`);
      deleted += ids.length;
      if (expired.length < 200) break;
    }
  } catch (e) {
    status = "failed";
    message = e instanceof Error ? e.message : "onbekende fout";
  }

  const durationMs = Date.now() - startedAt;
  await supabase.from("job_runs").insert({
    job_key: "rt_snapshot_cleanup",
    status,
    message,
    metadata: { deleted, storage_deleted: storageDeleted },
    finished_at: new Date().toISOString(),
    duration_ms: durationMs,
  });

  return new Response(JSON.stringify({ status, deleted, storage_deleted: storageDeleted, duration_ms: durationMs }), {
    status: status === "success" ? 200 : 500,
    headers: { "Content-Type": "application/json" },
  });
});
