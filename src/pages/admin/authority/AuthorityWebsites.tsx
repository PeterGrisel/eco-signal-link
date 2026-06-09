import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuthority } from "./AuthorityProvider";
import { Plus, Play, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const sb = supabase as any;

export const AuthorityWebsites = () => {
  const { websites, refresh, setSelectedId, selectedId } = useAuthority();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [running, setRunning] = useState<string | null>(null);

  const add = async () => {
    if (!name || !domain) return;
    const clean = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
    const { error } = await sb.from("authority_websites").insert({ name, domain: clean, status: "active" });
    if (error) { toast({ title: "Fout", description: error.message, variant: "destructive" }); return; }
    setName(""); setDomain(""); setOpen(false);
    await refresh();
  };

  const runContext = async (id: string) => {
    setRunning(id);
    const { error } = await supabase.functions.invoke("authority-analyze-context", { body: { website_id: id } });
    setRunning(null);
    if (error) toast({ title: "Context scan mislukt", description: error.message, variant: "destructive" });
    else toast({ title: "Context bijgewerkt", description: "Profiel is opnieuw gegenereerd." });
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-foreground">Websites</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4" /> Add website</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nieuwe website</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Naam" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="example.com" value={domain} onChange={(e) => setDomain(e.target.value)} />
              <Button onClick={add} className="w-full">Opslaan</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Naam</TableHead>
              <TableHead>Domein</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actie</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {websites.map((w) => (
              <TableRow key={w.id} className={selectedId === w.id ? "bg-muted/40" : ""}>
                <TableCell className="font-medium">{w.name}</TableCell>
                <TableCell className="text-muted-foreground">{w.domain}</TableCell>
                <TableCell><Badge variant="secondary">{w.status}</Badge></TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => setSelectedId(w.id)}>Selecteer</Button>
                  <Button size="sm" variant="outline" disabled={running === w.id} onClick={() => runContext(w.id)}>
                    {running === w.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />} Context scan
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};