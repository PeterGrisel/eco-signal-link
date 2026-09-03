import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, ExternalLink, Send, Share2, Sparkles } from "lucide-react";

// Nieuwe tabellen staan nog niet in de gegenereerde Supabase-types.
const sb = supabase as any;

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

interface CatalogEntry {
  slug: string;
  label: string;
}
interface Catalog {
  formats: (CatalogEntry & { width: number; height: number; note: string })[];
  templates: (CatalogEntry & { description: string; useWhen: string })[];
  channels: (CatalogEntry & { maxChars: number; defaultFormat: string })[];
  sources: CatalogEntry[];
  skins: string[];
  defaults: { format: string; template: string; channels: string[]; skin: string };
}

interface SocialPost {
  id: string;
  batch_id: string;
  channel: string;
  angle: string;
  position: number;
  hook: string;
  body: string;
  cta: string | null;
  cta_url: string | null;
  hashtags: string[];
  visual_template: string;
  visual_format: string;
  visual_skin: string;
  visual_fields: Record<string, unknown>;
  status: string;
  planable_post_id: string | null;
  planable_error: string | null;
  updated_at: string;
}

interface PushResult {
  post_id: string;
  ok: boolean;
  error?: string;
}

interface Batch {
  id: string;
  source_type: string;
  source_title: string;
  source_url: string | null;
  channels: string[];
  status: string;
  created_at: string;
}

/** Tabel en titelkolom per brontype, zodat de keuzelijst gevuld kan worden. */
const SOURCE_TABLES: Record<string, { table: string; title: string; filter?: [string, string] }> = {
  blog: { table: "blog_posts", title: "title", filter: ["status", "published"] },
  playbook: { table: "playbooks", title: "title", filter: ["status", "published"] },
  glossary: { table: "glossary_terms", title: "term", filter: ["status", "published"] },
  giveaway: { table: "content_bucket_items", title: "title", filter: ["status", "published"] },
};

function errorText(e: unknown): string {
  return e instanceof Error ? e.message : "Onbekende fout";
}

function visualUrl(post: SocialPost, as: "svg" | "png" = "svg"): string {
  const params = new URLSearchParams({ id: post.id, v: post.updated_at });
  if (as === "svg") params.set("as", "svg");
  return `${FUNCTIONS_URL}/social-image?${params.toString()}`;
}

const AdminSocialPosts = () => {
  const { toast } = useToast();

  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [sourceType, setSourceType] = useState("blog");
  const [sourceOptions, setSourceOptions] = useState<{ id: string; title: string }[]>([]);
  const [sourceId, setSourceId] = useState("");
  const [brief, setBrief] = useState("");
  const [channels, setChannels] = useState<string[]>(["linkedin_personal"]);
  const [skin, setSkin] = useState("dark");
  const [angleCount, setAngleCount] = useState(3);

  const [generating, setGenerating] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [history, setHistory] = useState<Batch[]>([]);

  useEffect(() => {
    fetch(`${FUNCTIONS_URL}/social-image?catalog=1`)
      .then((r) => r.json())
      .then((data: Catalog) => {
        setCatalog(data);
        setChannels(data.defaults.channels);
        setSkin(data.defaults.skin);
      })
      .catch(() => toast({ title: "Catalogus laden mislukt", variant: "destructive" }));
    loadHistory();
  }, []);

  useEffect(() => {
    setSourceId("");
    const spec = SOURCE_TABLES[sourceType];
    if (!spec) {
      setSourceOptions([]);
      return;
    }
    let query = sb.from(spec.table).select(`id, ${spec.title}`).order("created_at", { ascending: false }).limit(100);
    if (spec.filter) query = query.eq(spec.filter[0], spec.filter[1]);
    query.then(({ data }: { data: Record<string, string>[] | null }) =>
      setSourceOptions((data ?? []).map((row) => ({ id: row.id, title: row[spec.title] })))
    );
  }, [sourceType]);

  async function loadHistory() {
    const { data } = await sb
      .from("social_post_batches")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    setHistory(data ?? []);
  }

  async function loadBatch(batchId: string) {
    const [{ data: b }, { data: p }] = await Promise.all([
      sb.from("social_post_batches").select("*").eq("id", batchId).single(),
      sb.from("social_posts").select("*").eq("batch_id", batchId).order("position"),
    ]);
    setBatch(b ?? null);
    setPosts(p ?? []);
  }

  async function handleGenerate() {
    if (sourceType !== "custom" && !sourceId) {
      toast({ title: "Kies eerst een bron", variant: "destructive" });
      return;
    }
    if (sourceType === "custom" && !brief.trim()) {
      toast({ title: "Beschrijf het onderwerp", variant: "destructive" });
      return;
    }
    if (!channels.length) {
      toast({ title: "Kies minstens één kanaal", variant: "destructive" });
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("social-generate", {
        body: {
          source_type: sourceType,
          source_id: sourceType === "custom" ? null : sourceId,
          brief,
          channels,
          angle_count: angleCount,
          skin,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setBatch(data.batch);
      setPosts(data.posts ?? []);
      loadHistory();
      toast({ title: `${data.posts?.length ?? 0} posts gegenereerd` });
    } catch (e) {
      toast({ title: "Genereren mislukt", description: errorText(e), variant: "destructive" });
    }
    setGenerating(false);
  }

  async function savePost(post: SocialPost, patch: Partial<SocialPost>) {
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, ...patch } : p)));
    const { data, error } = await sb.from("social_posts").update(patch).eq("id", post.id).select().single();
    if (error) {
      toast({ title: "Opslaan mislukt", description: error.message, variant: "destructive" });
      return;
    }
    // updated_at is de cachesleutel van de visual; die moet meelopen.
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, ...data } : p)));
  }

  async function handlePush() {
    if (!batch) return;
    setPushing(true);
    try {
      const { data, error } = await supabase.functions.invoke("social-planable-push", {
        body: { batch_id: batch.id },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const results: PushResult[] = data.results ?? [];
      const ok = results.filter((r) => r.ok).length;
      const failed = results.filter((r) => !r.ok);
      toast({
        title: `${ok} van de ${results.length} posts staan klaar in Planable`,
        description: failed.length ? failed[0].error : undefined,
        variant: failed.length ? "destructive" : undefined,
      });
      loadBatch(batch.id);
    } catch (e) {
      toast({ title: "Pushen mislukt", description: errorText(e), variant: "destructive" });
    }
    setPushing(false);
  }

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} gekopieerd` });
  }

  /** Volledige posttekst zoals die in Planable belandt. */
  function fullText(post: SocialPost): string {
    const tags = (post.hashtags ?? []).map((t) => `#${t}`).join(" ");
    return [post.body, tags].filter(Boolean).join("\n\n");
  }

  const grouped = useMemo(() => {
    const map = new Map<number, SocialPost[]>();
    for (const post of posts) {
      const list = map.get(post.position) ?? [];
      list.push(post);
      map.set(post.position, list);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [posts]);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Share2 className="w-6 h-6 text-primary" /> Post-generator
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Van blog, playbook of woordenboek naar drie posts met visual, klaar voor Planable
        </p>
      </div>

      {/* ── Bron en instellingen ─────────────────────────────────────────── */}
      <div className="p-6 rounded-xl bg-card border border-border space-y-4 mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Bron</Label>
            <Select value={sourceType} onValueChange={setSourceType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(catalog?.sources ?? []).map((s) => (
                  <SelectItem key={s.slug} value={s.slug}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>{sourceType === "custom" ? "Onderwerp" : "Kies een item"}</Label>
            {sourceType === "custom" ? (
              <Input
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Waar gaat het over? Bijvoorbeeld: waarom intent-signalen belangrijker zijn dan bedrijfsgrootte"
              />
            ) : (
              <Select value={sourceId} onValueChange={setSourceId}>
                <SelectTrigger><SelectValue placeholder="Selecteer…" /></SelectTrigger>
                <SelectContent>
                  {sourceOptions.map((o) => (
                    <SelectItem key={o.id} value={o.id}>{o.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {sourceType !== "custom" && (
          <div className="space-y-2">
            <Label>Extra sturing (optioneel)</Label>
            <Textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              rows={2}
              placeholder="Bijvoorbeeld: leg de nadruk op de maakindustrie, of gebruik het voorbeeld uit hoofdstuk 2"
            />
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label>Kanalen</Label>
            <div className="flex flex-wrap gap-4 pt-1">
              {(catalog?.channels ?? []).map((c) => (
                <label key={c.slug} className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <Checkbox
                    checked={channels.includes(c.slug)}
                    onCheckedChange={(checked) =>
                      setChannels((prev) => (checked ? [...prev, c.slug] : prev.filter((x) => x !== c.slug)))
                    }
                  />
                  {c.label}
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Invalshoeken</Label>
              <Select value={String(angleCount)} onValueChange={(v) => setAngleCount(Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Beeldstijl</Label>
              <Select value={skin} onValueChange={setSkin}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Donker</SelectItem>
                  <SelectItem value="light">Licht</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button variant="hero" onClick={handleGenerate} disabled={generating}>
          <Sparkles className="w-4 h-4" />
          {generating ? "Genereren…" : `Genereer ${angleCount} posts`}
        </Button>
      </div>

      {/* ── Resultaat ────────────────────────────────────────────────────── */}
      {batch && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">{batch.source_title}</h2>
              {batch.source_url && (
                <a
                  href={batch.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary inline-flex items-center gap-1"
                >
                  {batch.source_url} <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <Button variant="hero" onClick={handlePush} disabled={pushing}>
              <Send className="w-4 h-4" />
              {pushing ? "Versturen…" : "Zet klaar in Planable"}
            </Button>
          </div>

          {grouped.map(([position, group]) => (
            <div key={position} className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="text-primary border-primary/40">
                  Invalshoek {position + 1}
                </Badge>
                <span className="text-sm text-muted-foreground">{group[0].angle}</span>
              </div>

              <div className="grid lg:grid-cols-[320px_1fr] gap-6">
                {/* Visual */}
                <div className="space-y-3">
                  <img
                    key={group[0].updated_at}
                    src={visualUrl(group[0])}
                    alt={`Visual voor ${group[0].angle}`}
                    className="w-full rounded-lg border border-border bg-muted"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={group[0].visual_template}
                      onValueChange={(v) => group.forEach((p) => savePost(p, { visual_template: v }))}
                    >
                      <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(catalog?.templates ?? []).map((t) => (
                          <SelectItem key={t.slug} value={t.slug}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={group[0].visual_format}
                      onValueChange={(v) => group.forEach((p) => savePost(p, { visual_format: v }))}
                    >
                      <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(catalog?.formats ?? []).map((f) => (
                          <SelectItem key={f.slug} value={f.slug}>{f.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <a href={visualUrl(group[0], "png")} target="_blank" rel="noreferrer" className="block">
                    <Button variant="heroOutline" size="sm" className="w-full">
                      <Download className="w-4 h-4" /> PNG openen
                    </Button>
                  </a>
                  <div className="space-y-2 pt-1">
                    {["kicker", "headline", "subline", "stat", "stat_label"].map((field) =>
                      field in (group[0].visual_fields ?? {}) ? (
                        <Input
                          key={field}
                          className="text-xs"
                          defaultValue={String(group[0].visual_fields[field] ?? "")}
                          onBlur={(e) =>
                            group.forEach((p) =>
                              savePost(p, {
                                visual_fields: { ...p.visual_fields, [field]: e.target.value },
                              })
                            )
                          }
                        />
                      ) : null
                    )}
                  </div>
                </div>

                {/* Teksten per kanaal */}
                <div className="space-y-5">
                  {group.map((post) => (
                    <div key={post.id} className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">
                            {catalog?.channels.find((c) => c.slug === post.channel)?.label ?? post.channel}
                          </Label>
                          <span className="text-[11px] text-muted-foreground">
                            {fullText(post).length} tekens
                          </span>
                          {post.status === "pushed" && (
                            <Badge variant="outline" className="text-[10px] text-primary border-primary/40">
                              in Planable
                            </Badge>
                          )}
                          {post.status === "failed" && (
                            <Badge variant="destructive" className="text-[10px]">mislukt</Badge>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => copy(fullText(post), "Post")}>
                          <Copy className="w-4 h-4" /> Kopieer
                        </Button>
                      </div>
                      <Textarea
                        defaultValue={post.body}
                        rows={10}
                        className="text-sm"
                        onBlur={(e) => savePost(post, { body: e.target.value })}
                      />
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {(post.hashtags ?? []).map((t) => (
                          <Badge key={t} variant="secondary" className="text-[10px]">#{t}</Badge>
                        ))}
                        {post.cta_url && (
                          <button
                            type="button"
                            onClick={() => copy(post.cta_url!, "Link voor de eerste reactie")}
                            className="text-primary underline-offset-2 hover:underline"
                          >
                            link voor eerste reactie
                          </button>
                        )}
                      </div>
                      {post.planable_error && (
                        <p className="text-xs text-destructive">{post.planable_error}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Eerdere batches ──────────────────────────────────────────────── */}
      {history.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">
            Eerder gegenereerd
          </h2>
          <div className="space-y-2">
            {history.map((b) => (
              <button
                key={b.id}
                onClick={() => loadBatch(b.id)}
                className="w-full text-left p-3 rounded-lg bg-card border border-border hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-foreground truncate">{b.source_title}</span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(b.created_at).toLocaleDateString("nl-NL")}
                    {b.status === "pushed" ? " · in Planable" : ""}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSocialPosts;
