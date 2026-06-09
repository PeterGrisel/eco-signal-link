import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuthority } from "./AuthorityProvider";
import { Plus } from "lucide-react";

const sb = supabase as any;

export const AuthorityAssets = () => {
  const { selectedId } = useAuthority();
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [assetType, setAssetType] = useState("");

  const load = async () => {
    if (!selectedId) return;
    const { data } = await sb.from("authority_assets").select("*").eq("website_id", selectedId).order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, [selectedId]);

  const add = async () => {
    if (!title || !selectedId) return;
    await sb.from("authority_assets").insert({ website_id: selectedId, title, asset_type: assetType, status: "idea" });
    setTitle(""); setAssetType(""); setOpen(false); load();
  };

  const setStatus = async (id: string, status: string) => {
    await sb.from("authority_assets").update({ status }).eq("id", id); load();
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="w-3 h-3" /> Asset</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nieuwe asset</DialogTitle></DialogHeader>
            <div className="space-y-2">
              <Input placeholder="Titel" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Input placeholder="Type (checklist, gids, whitepaper...)" value={assetType} onChange={(e) => setAssetType(e.target.value)} />
              <Button onClick={add} className="w-full">Opslaan</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titel</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium text-xs">{a.title}</TableCell>
                <TableCell className="text-xs">{a.asset_type}</TableCell>
                <TableCell className="text-xs">{a.topic || "-"}</TableCell>
                <TableCell><Badge variant="secondary" className="text-xs">{a.status}</Badge></TableCell>
                <TableCell className="text-right space-x-1">
                  {["idea","planned","in_progress","published","archived"].map((s) => (
                    <Button key={s} size="sm" variant="ghost" className="text-[10px] h-6" onClick={() => setStatus(a.id, s)}>{s}</Button>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};