import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, ExternalLink, Sparkles, Check, Loader2 } from "lucide-react";

type ListingStatus = "todo" | "submitted" | "live" | "rejected";

const statusColors: Record<ListingStatus, string> = {
  todo: "bg-muted text-muted-foreground",
  submitted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  live: "bg-green-500/10 text-green-400 border-green-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

interface DirectorySuggestion {
  name: string;
  url: string;
  category: string;
  dr_score: number;
  reason: string;
}

const AdminListings = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showFinder, setShowFinder] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [drScore, setDrScore] = useState("");
  const { toast } = useToast();

  // AI Finder state
  const [finderNiche, setFinderNiche] = useState("B2B sales en recruitment dienstverlening");
  const [finderCountry, setFinderCountry] = useState("Nederland");
  const [finderCount, setFinderCount] = useState("20");
  const [finderLoading, setFinderLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<DirectorySuggestion[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<number>>(new Set());

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

  // AI Finder
  const handleFindDirectories = async () => {
    setFinderLoading(true);
    setSuggestions([]);
    setSelectedSuggestions(new Set());

    try {
      const { data, error } = await supabase.functions.invoke("find-directories", {
        body: { niche: finderNiche, country: finderCountry, count: parseInt(finderCount) },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.directories) {
        setSuggestions(data.directories);
        // Auto-select all
        setSelectedSuggestions(new Set(data.directories.map((_: any, i: number) => i)));
        toast({ title: `${data.directories.length} directories gevonden!` });
      }
    } catch (e: any) {
      toast({ title: "Fout", description: e.message, variant: "destructive" });
    }
    setFinderLoading(false);
  };

  const toggleSuggestion = (index: number) => {
    setSelectedSuggestions(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleImportSelected = async () => {
    const existingUrls = new Set(listings.map(l => l.url.toLowerCase().replace(/\/$/, "")));
    const toImport = suggestions
      .filter((_, i) => selectedSuggestions.has(i))
      .filter(s => !existingUrls.has(s.url.toLowerCase().replace(/\/$/, "")));

    if (toImport.length === 0) {
      toast({ title: "Alle geselecteerde directories bestaan al" });
      return;
    }

    const rows = toImport.map(s => ({
      name: s.name,
      url: s.url,
      category: s.category,
      dr_score: s.dr_score,
      notes: s.reason,
    }));

    const { error } = await supabase.from("directory_listings").insert(rows);
    if (error) {
      toast({ title: "Fout bij importeren", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `${toImport.length} directories geïmporteerd!` });
      setSuggestions([]);
      setShowFinder(false);
      fetchListings();
    }
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
        <div className="flex gap-2">
          <Button variant="heroOutline" size="sm" onClick={() => { setShowFinder(!showFinder); setShowForm(false); }}>
            <Sparkles className="w-4 h-4" /> AI Finder
          </Button>
          <Button variant="hero" size="sm" onClick={() => { setShowForm(!showForm); setShowFinder(false); }}>
            <Plus className="w-4 h-4" /> Toevoegen
          </Button>
        </div>
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

      {/* AI Directory Finder */}
      {showFinder && (
        <div className="p-6 rounded-xl bg-card border border-primary/20 mb-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground">AI Directory Finder</h2>
          </div>
          <p className="text-sm text-muted-foreground">Laat AI relevante directories vinden voor jouw niche. Resultaten kun je direct importeren.</p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Niche / Beschrijving</Label>
              <Textarea
                value={finderNiche}
                onChange={(e) => setFinderNiche(e.target.value)}
                placeholder="B2B sales en recruitment..."
                rows={2}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Land</Label>
              <Input value={finderCountry} onChange={(e) => setFinderCountry(e.target.value)} placeholder="Nederland" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Aantal</Label>
              <Input type="number" value={finderCount} onChange={(e) => setFinderCount(e.target.value)} placeholder="20" />
            </div>
          </div>

          <Button variant="hero" size="sm" onClick={handleFindDirectories} disabled={finderLoading}>
            {finderLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Zoeken...</> : <><Sparkles className="w-4 h-4" /> Directories zoeken</>}
          </Button>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{suggestions.length} directories gevonden</p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedSuggestions(new Set(suggestions.map((_, i) => i)))}
                    className="text-xs"
                  >
                    Alles selecteren
                  </Button>
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={handleImportSelected}
                    disabled={selectedSuggestions.size === 0}
                  >
                    <Plus className="w-4 h-4" /> Importeer {selectedSuggestions.size} geselecteerd
                  </Button>
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => toggleSuggestion(i)}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedSuggestions.has(i)
                        ? "bg-primary/5 border-primary/30"
                        : "bg-card border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedSuggestions.has(i) ? "bg-primary border-primary" : "border-muted-foreground/40"
                    }`}>
                      {selectedSuggestions.has(i) && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground">{s.name}</span>
                        <span className="text-xs text-primary font-mono">DR {s.dr_score}</span>
                        <Badge variant="outline" className="text-xs">{s.category}</Badge>
                      </div>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                      >
                        {s.url} <ExternalLink className="w-3 h-3" />
                      </a>
                      <p className="text-xs text-muted-foreground mt-1">{s.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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
      ) : listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nog geen directories. Gebruik de AI Finder om te starten!</p>
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
                    {l.category && <Badge variant="outline" className="text-xs">{l.category}</Badge>}
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
