import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuthority } from "./AuthorityProvider";
import { Loader2, Play } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const sb = supabase as any;

export const AuthorityRuns = () => {
  const { selectedId } = useAuthority();
  const [runs, setRuns] = useState<any[]>([]);
  const [discovering, setDiscovering] = useState(false);

  const load = async () => {
    if (!selectedId) return;
    const { data } = await sb.from("authority_runs").select("*").eq("website_id", selectedId).order("created_at", { ascending: false }).limit(50);
    setRuns(data || []);
  };
  useEffect(() => { load(); }, [selectedId]);

  const discover = async () => {
    if (!selectedId) return;
    setDiscovering(true);
    const { data, error } = await supabase.functions.invoke("authority-discover", { body: { website_id: selectedId, query_limit: 10, results_per_query: 5 } });
    setDiscovering(false);
    if (error) toast({ title: "Discovery mislukt", description: error.message, variant: "destructive" });
    else { toast({ title: "Discovery klaar", description: `${(data as any)?.urls_discovered ?? 0} URLs ontdekt.` }); load(); }
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={discover} disabled={discovering}>
          {discovering ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />} Start discovery
        </Button>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Queries</TableHead>
              <TableHead>URLs</TableHead>
              <TableHead>Opportunities</TableHead>
              <TableHead>Started</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runs.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="text-xs">{r.run_type}</TableCell>
                <TableCell><Badge variant={r.status === "completed" ? "secondary" : "outline"}>{r.status}</Badge></TableCell>
                <TableCell>{r.queries_count}</TableCell>
                <TableCell>{r.urls_discovered}</TableCell>
                <TableCell>{r.opportunities_created}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.started_at ? new Date(r.started_at).toLocaleString("nl-NL") : "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};