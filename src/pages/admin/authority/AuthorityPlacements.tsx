import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuthority } from "./AuthorityProvider";
import { Plus, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const sb = supabase as any;

export const AuthorityPlacements = () => {
  const { selectedId } = useAuthority();
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("");
  const [target, setTarget] = useState("");
  const [anchor, setAnchor] = useState("");
  const [verifying, setVerifying] = useState<string | null>(null);

  const load = async () => {
    if (!selectedId) return;
    const { data } = await sb.from("authority_placements").select("*").eq("website_id", selectedId).order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, [selectedId]);

  const add = async () => {
    if (!placement || !target || !selectedId) return;
    await sb.from("authority_placements").insert({ website_id: selectedId, placement_url: placement, target_url: target, expected_anchor: anchor, status: "pending" });
    setPlacement(""); setTarget(""); setAnchor(""); setOpen(false); load();
  };

  const verify = async (id: string) => {
    setVerifying(id);
    const { error } = await supabase.functions.invoke("authority-verify-placement", { body: { placement_id: id } });
    setVerifying(null);
    if (error) toast({ title: "Verify mislukt", description: error.message, variant: "destructive" });
    else load();
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="w-3 h-3" /> Placement</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nieuwe placement</DialogTitle></DialogHeader>
            <div className="space-y-2">
              <Input placeholder="Placement URL (waar de link staat)" value={placement} onChange={(e) => setPlacement(e.target.value)} />
              <Input placeholder="Target URL (waar de link naartoe wijst)" value={target} onChange={(e) => setTarget(e.target.value)} />
              <Input placeholder="Verwachte anchor (optioneel)" value={anchor} onChange={(e) => setAnchor(e.target.value)} />
              <Button onClick={add} className="w-full">Opslaan</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Placement</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Anchor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last check</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="text-xs max-w-[220px] truncate"><a href={p.placement_url} target="_blank" rel="noreferrer" className="text-primary underline">{p.placement_url}</a></TableCell>
                <TableCell className="text-xs max-w-[220px] truncate">{p.target_url}</TableCell>
                <TableCell className="text-xs">{p.actual_anchor || p.expected_anchor || "-"}</TableCell>
                <TableCell><Badge variant={p.status === "verified" ? "default" : p.status === "lost" ? "destructive" : "secondary"} className="text-xs">{p.status}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{p.last_checked_at ? new Date(p.last_checked_at).toLocaleString("nl-NL") : "-"}</TableCell>
                <TableCell><Button size="sm" variant="ghost" disabled={verifying === p.id} onClick={() => verify(p.id)}>{verifying === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};