import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Key, Plus, Copy, Trash2, Shield, Eye, EyeOff, Loader2, Server } from "lucide-react";
import { McpHealthPanel } from "@/components/admin/McpHealthPanel";

interface McpApiKey {
  id: string;
  name: string;
  api_key: string;
  permissions: string[] | null;
  is_master: boolean;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
}

const AVAILABLE_TOOLS = [
  "list_blog_posts", "get_blog_post", "create_blog_post", "update_blog_post", "delete_blog_post",
  "list_blog_categories", "list_content_queue", "update_content_queue_item", "list_content_topics",
  "get_gsc_data", "list_indexing_requests", "request_indexing", "get_monthly_evaluations",
  "get_site_events", "list_contact_submissions", "list_directory_listings",
  "get_seo_settings", "update_seo_settings",
];

const TOOL_GROUPS: Record<string, string[]> = {
  "Blog": ["list_blog_posts", "get_blog_post", "create_blog_post", "update_blog_post", "delete_blog_post", "list_blog_categories"],
  "Content Queue": ["list_content_queue", "update_content_queue_item", "list_content_topics"],
  "SEO & Analytics": ["get_gsc_data", "list_indexing_requests", "request_indexing", "get_monthly_evaluations"],
  "Admin": ["get_site_events", "list_contact_submissions", "list_directory_listings", "get_seo_settings", "update_seo_settings"],
};

export const McpTabContent = () => {
  const [keys, setKeys] = useState<McpApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIsMaster, setNewIsMaster] = useState(false);
  const [newPermissions, setNewPermissions] = useState<string[]>([...AVAILABLE_TOOLS]);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  const fetchKeys = async () => {
    const { data, error } = await supabase
      .from("mcp_api_keys" as any)
      .select("*")
      .order("created_at", { ascending: true });
    if (!error && data) setKeys(data as any);
    setLoading(false);
  };

  useEffect(() => { fetchKeys(); }, []);

  const generateKey = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, "0")).join("");
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    const apiKey = generateKey();
    const { error } = await supabase.from("mcp_api_keys" as any).insert({
      name: newName.trim(),
      api_key: apiKey,
      is_master: newIsMaster,
      permissions: newIsMaster ? null : newPermissions,
    } as any);
    setCreating(false);
    if (error) {
      toast({ title: "Fout", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "API Key aangemaakt", description: "Kopieer de key voordat je dit scherm sluit." });
    setCreateOpen(false);
    setNewName("");
    setNewIsMaster(false);
    setNewPermissions([...AVAILABLE_TOOLS]);
    fetchKeys();
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await supabase.from("mcp_api_keys" as any).update({ is_active: !isActive } as any).eq("id", id);
    fetchKeys();
  };

  const deleteKey = async (id: string) => {
    await supabase.from("mcp_api_keys" as any).delete().eq("id", id);
    fetchKeys();
    toast({ title: "Key verwijderd" });
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: "Gekopieerd naar klembord" });
  };

  const copyEndpoint = () => {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mcp-server`;
    navigator.clipboard.writeText(url);
    toast({ title: "Endpoint URL gekopieerd" });
  };

  const claudeProxyScript = `const u=process.argv[1],k=process.argv[2];process.stdin.setEncoding('utf8');let b='';process.stdin.on('data',c=>{b+=c;let i;while((i=b.indexOf('\\n'))>=0){const l=b.slice(0,i).trim();b=b.slice(i+1);if(l)send(l)}});async function send(l){let id=null;try{id=JSON.parse(l).id}catch{}try{const r=await fetch(u,{method:'POST',headers:{'content-type':'application/json','accept':'application/json, text/event-stream','x-api-key':k},body:l});const t=await r.text();if(!r.ok){if(id!==undefined&&id!==null)process.stdout.write(JSON.stringify({jsonrpc:'2.0',id,error:{code:r.status,message:t||r.statusText}})+'\\n');return}for(const p of t.split(/\\r?\\n/)){const s=p.trim();if(!s)continue;const d=s.startsWith('data:')?s.slice(5).trim():s;if(d&&d!=='[DONE]')process.stdout.write(d+'\\n')}}catch(e){if(id!==undefined&&id!==null)process.stdout.write(JSON.stringify({jsonrpc:'2.0',id,error:{code:-32000,message:e.message}})+'\\n')}}`;

  const claudeConfig = `{
  "mcpServers": {
    "b2bgroeimachine": {
      "command": "node",
      "args": [
        "-e",
        ${JSON.stringify(claudeProxyScript)},
        "${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mcp-server",
        "<jouw-api-key>"
      ]
    }
  }
}`;

  const copyClaudeConfig = () => {
    navigator.clipboard.writeText(claudeConfig);
    toast({ title: "Claude config gekopieerd" });
  };

  const togglePermission = (tool: string) => {
    setNewPermissions(prev =>
      prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
    );
  };

  const toggleGroup = (tools: string[]) => {
    const allSelected = tools.every(t => newPermissions.includes(t));
    if (allSelected) {
      setNewPermissions(prev => prev.filter(t => !tools.includes(t)));
    } else {
      setNewPermissions(prev => [...new Set([...prev, ...tools])]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Server className="w-6 h-6 text-primary" /> MCP Server
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Beheer API keys en rechten voor de MCP (Model Context Protocol) server
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyEndpoint} className="gap-2">
            <Copy className="w-4 h-4" /> Endpoint URL
          </Button>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" className="gap-2">
                <Plus className="w-4 h-4" /> Nieuwe Key
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nieuwe API Key</DialogTitle>
                <DialogDescription>
                  Maak een nieuwe API key aan voor toegang tot de MCP server
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Naam</Label>
                  <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="bijv. Claude Desktop" />
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={newIsMaster} onCheckedChange={setNewIsMaster} />
                  <div>
                    <Label>Master Key</Label>
                    <p className="text-xs text-muted-foreground">Volledige toegang tot alle tools</p>
                  </div>
                </div>
                {!newIsMaster && (
                  <div className="space-y-3">
                    <Label>Rechten</Label>
                    {Object.entries(TOOL_GROUPS).map(([group, tools]) => (
                      <div key={group} className="space-y-1">
                        <button
                          type="button"
                          onClick={() => toggleGroup(tools)}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          {group} ({tools.filter(t => newPermissions.includes(t)).length}/{tools.length})
                        </button>
                        <div className="flex flex-wrap gap-1">
                          {tools.map(tool => (
                            <Badge
                              key={tool}
                              variant={newPermissions.includes(tool) ? "default" : "outline"}
                              className="cursor-pointer text-[10px]"
                              onClick={() => togglePermission(tool)}
                            >
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={handleCreate} disabled={creating || !newName.trim()} className="gap-2">
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                  Aanmaken
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Connection info */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="pt-4 pb-4 text-sm space-y-1">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium text-foreground">Claude Desktop configuratie:</p>
              <p className="text-xs text-muted-foreground">Stabiele proxy zonder mcp-remote. Vervang alleen &lt;jouw-api-key&gt;.</p>
            </div>
            <Button variant="outline" size="sm" onClick={copyClaudeConfig} className="gap-2 shrink-0">
              <Copy className="w-4 h-4" /> Kopieer
            </Button>
          </div>
          <code className="block bg-card p-3 rounded text-xs break-all whitespace-pre-wrap">
            {claudeConfig}
          </code>
        </CardContent>
      </Card>

      {/* Health panel */}
      <div className="mb-6">
        <McpHealthPanel />
      </div>

      {/* Keys list */}
      <div className="space-y-3">
        {keys.map(key => (
          <Card key={key.id} className={!key.is_active ? "opacity-50" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">{key.name}</CardTitle>
                  {key.is_master && (
                    <Badge variant="default" className="gap-1 text-[10px]">
                      <Shield className="w-3 h-3" /> Master
                    </Badge>
                  )}
                  {!key.is_active && <Badge variant="secondary">Inactief</Badge>}
                </div>
                <div className="flex items-center gap-1">
                  <Switch checked={key.is_active} onCheckedChange={() => toggleActive(key.id, key.is_active)} />
                  <Button variant="ghost" size="icon" onClick={() => deleteKey(key.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="text-xs">
                Aangemaakt: {new Date(key.created_at).toLocaleDateString("nl-NL")}
                {key.last_used_at && ` · Laatst gebruikt: ${new Date(key.last_used_at).toLocaleDateString("nl-NL")}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-secondary px-3 py-1.5 rounded text-xs font-mono">
                  {visibleKeys[key.id] ? key.api_key : "••••••••••••••••••••••••"}
                </code>
                <Button variant="ghost" size="icon" onClick={() => setVisibleKeys(v => ({ ...v, [key.id]: !v[key.id] }))}>
                  {visibleKeys[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => copyKey(key.api_key)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              {!key.is_master && key.permissions && (
                <div className="flex flex-wrap gap-1">
                  {(key.permissions as string[]).map(p => (
                    <Badge key={p} variant="outline" className="text-[10px]">{p}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

