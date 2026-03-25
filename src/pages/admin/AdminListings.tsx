import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, ExternalLink } from "lucide-react";

type ListingStatus = "todo" | "submitted" | "live" | "rejected";

const statusColors: Record<ListingStatus, string> = {
  todo: "bg-muted text-muted-foreground",
  submitted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  live: "bg-green-500/10 text-green-400 border-green-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

const AdminListings = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [drScore, setDrScore] = useState("");
  const { toast } = useToast();

  const fetchListings = async () => {
    const { data } = await supabase
      .from("directory_listings")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setListings(data);
    setLoading(false);
  };

  useEffect(() => { fetchListings(); }, []);

  const handleAdd = async () => {
    if (!name || !url) { toast({ title: "Vul naam en URL in", variant: "destructive" }); return; }
    const { error } = await supabase.from("directory_listings").insert({
      name, url, category: category || null, dr_score: drScore ? parseInt(drScore) : null,
    });
    if (error) toast({ title: "Fout", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Toegevoegd!" });
      setName(""); setUrl(""); setCategory(""); setDrScore("");
      setShowForm(false);
      fetchListings();
    }
  };

  const handleStatusChange = async (id: string, status: ListingStatus) => {
    const updates: any = { status };
    if (status === "submitted") updates.submitted_at = new Date().toISOString();
    if (status === "live") updates.live_at = new Date().toISOString();
    await supabase.from("directory_listings").update(updates).eq("id", id);
    fetchListings();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Verwijderen?")) return;
    await supabase.from("directory_listings").delete().eq("id", id);
    fetchListings();
  };

  // Stats
  const liveCount = listings.filter((l) => l.status === "live").length;
  const avgDR = listings.filter((l) => l.dr_score).reduce((a, b) => a + (b.dr_score || 0), 0) / (listings.filter((l) => l.dr_score).length || 1);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Directory Listings</h1>
          <p className="text-sm text-muted-foreground mt-1">Track je directory submissions</p>
        </div>
        <Button variant="hero" size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" /> Toevoegen
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-2xl font-bold text-foreground">{listings.length}</p>
          <p className="text-xs text-muted-foreground">Totaal</p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-2xl font-bold text-green-400">{liveCount}</p>
          <p className="text-xs text-muted-foreground">Live</p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-2xl font-bold text-primary">{avgDR.toFixed(0)}</p>
          <p className="text-xs text-muted-foreground">Gem. DR</p>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="p-6 rounded-xl bg-card border border-border mb-6 space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Naam</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Clutch.co" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">URL</Label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Categorie</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="B2B" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">DR Score</Label>
              <Input type="number" value={drScore} onChange={(e) => setDrScore(e.target.value)} placeholder="50" />
            </div>
          </div>
          <Button variant="hero" size="sm" onClick={handleAdd}>Toevoegen</Button>
        </div>
      )}

      {/* Listings */}
      {loading ? (
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-card rounded-lg" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {listings.map((l) => (
            <div key={l.id} className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground truncate">{l.name}</span>
                    {l.dr_score && <span className="text-xs text-primary font-mono">DR {l.dr_score}</span>}
                  </div>
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 truncate">
                    {l.url} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Select value={l.status} onValueChange={(v) => handleStatusChange(l.id, v as ListingStatus)}>
                  <SelectTrigger className="w-32">
                    <Badge variant="outline" className={statusColors[l.status as ListingStatus]}>{l.status}</Badge>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(l.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminListings;
