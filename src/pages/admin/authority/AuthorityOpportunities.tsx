import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useAuthority } from "./AuthorityProvider";
import { Loader2, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const sb = supabase as any;
const STATUSES = ["all", "discovered", "qualified", "needs_asset", "ready_for_outreach", "contacted", "placed", "verified", "rejected", "lost"];

export const AuthorityOpportunities = () => {
  const { selectedId } = useAuthority();
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<any>(null);
  const [acting, setActing] = useState(false);
  const [scoring, setScoring] = useState(false);

  const load = async () => {
    if (!selectedId) return;
    let q = sb.from("authority_opportunities").select("*").eq("website_id", selectedId).order("priority_score", { ascending: false }).limit(200);
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    setItems(data || []);
  };
  useEffect(() => { load(); }, [selectedId, filter]);

  const scoreNew = async () => {
    if (!selectedId) return;
    setScoring(true);
    const { data: pages } = await sb.from("authority_crawled_pages").select("id, url").eq("website_id", selectedId).order("created_at", { ascending: false }).limit(20);
    const urls = (pages || []).map((p: any) => p.url);
    const { data: existing } = await sb.from("authority_opportunities").select("source_url").in("source_url", urls.length ? urls : [""]);
    const have = new Set((existing || []).map((r: any) => r.source_url));
    let n = 0;
    for (const p of pages || []) {
      if (have.has(p.url)) continue;
      try {
        await supabase.functions.invoke("authority-crawl-url", { body: { crawled_page_id: p.id } });
        await supabase.functions.invoke("authority-score-opportunity", { body: { crawled_page_id: p.id } });
        n++;
      } catch {}
    }
    setScoring(false);
    toast({ title: "Scoring klaar", description: `${n} nieuwe opportunities gescoord.` });
    load();
  };

  const updateStatus = async (id: string, status: string) => {
    setActing(true);
    await sb.from("authority_opportunities").update({ status }).eq("id", id);
    setActing(false); setOpen(null); load();
  };

  const generateOutreach = async (id: string) => {
    setActing(true);
    const { data, error } = await supabase.functions.invoke("authority-generate-outreach", { body: { opportunity_id: id } });
    setActing(false);
    if (error) { toast({ title: "Fout", description: error.message, variant: "destructive" }); return; }
    if (open) setOpen({ ...open, outreach_subject: (data as any).subject, outreach_body: (data as any).body, status: "ready_for_outreach" });
    load();
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex gap-1 flex-wrap">
          {STATUSES.map((s) => (
            <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)} className="text-xs h-7">{s}</Button>
          ))}
        </div>
        <Button size="sm" onClick={scoreNew} disabled={scoring}>
          {scoring ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />} Score nieuwe pagina's
        </Button>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((o) => (
              <TableRow key={o.id} onClick={() => setOpen(o)} className="cursor-pointer">
                <TableCell className="max-w-[280px] truncate text-xs">{o.source_domain}<div className="text-muted-foreground truncate">{o.source_title}</div></TableCell>
                <TableCell className="text-xs">{o.opportunity_type || "-"}</TableCell>
                <TableCell className="text-xs">{o.topic || "-"}</TableCell>
                <TableCell><Badge variant={o.priority_score >= 80 ? "default" : o.priority_score >= 65 ? "secondary" : "outline"}>{o.priority_score}</Badge></TableCell>
                <TableCell><Badge variant={o.risk_score >= 60 ? "destructive" : "outline"}>{o.risk_score}</Badge></TableCell>
                <TableCell><Badge variant="secondary" className="text-xs">{o.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Sheet open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {open && (
            <>
              <SheetHeader><SheetTitle className="text-sm">{open.source_domain}</SheetTitle></SheetHeader>
              <div className="mt-4 space-y-4 text-sm">
                <a href={open.source_url} target="_blank" rel="noreferrer" className="text-primary underline break-all">{open.source_url}</a>
                <div className="text-foreground">{open.source_title}</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {["context_fit","sector_fit","page_type_fit","authority_score","placement_probability","commercial_value","risk_score","priority_score"].map((k) => (
                    <div key={k} className="flex justify-between border-b border-border py-1">
                      <span className="text-muted-foreground">{k}</span><span className="font-medium">{open[k]}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1 text-xs">
                  <div><span className="text-muted-foreground">Type:</span> {open.opportunity_type}</div>
                  <div><span className="text-muted-foreground">Topic:</span> {open.topic}</div>
                  <div><span className="text-muted-foreground">Sector:</span> {open.sector}</div>
                  <div><span className="text-muted-foreground">Target:</span> {open.suggested_target_url}</div>
                  <div><span className="text-muted-foreground">Anchor:</span> {open.suggested_anchor} <Badge variant="outline" className="text-[10px]">{open.anchor_type}</Badge></div>
                </div>
                {open.relevance_reason && <div className="text-xs"><div className="text-muted-foreground mb-1">Reden</div>{open.relevance_reason}</div>}
                {open.recommended_action && <div className="text-xs"><div className="text-muted-foreground mb-1">Actie</div>{open.recommended_action}</div>}
                {open.asset_needed && (
                  <div className="p-3 rounded bg-muted text-xs">
                    <div className="font-medium mb-1">Asset nodig</div>
                    {open.asset_suggestion}
                  </div>
                )}
                {open.outreach_body && (
                  <div className="p-3 rounded border border-border text-xs space-y-2">
                    <div className="font-medium">{open.outreach_subject}</div>
                    <pre className="whitespace-pre-wrap font-sans">{open.outreach_body}</pre>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" onClick={() => updateStatus(open.id, "qualified")} disabled={acting}>Approve</Button>
                  <Button size="sm" variant="outline" onClick={() => updateStatus(open.id, "rejected")} disabled={acting}>Reject</Button>
                  <Button size="sm" variant="outline" onClick={() => generateOutreach(open.id)} disabled={acting}>Generate outreach</Button>
                  <Button size="sm" variant="outline" onClick={() => updateStatus(open.id, "contacted")} disabled={acting}>Mark contacted</Button>
                  <Button size="sm" variant="outline" onClick={() => updateStatus(open.id, "placed")} disabled={acting}>Mark placed</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};