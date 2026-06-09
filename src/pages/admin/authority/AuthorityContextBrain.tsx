import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuthority } from "./AuthorityProvider";
import { Loader2, Save, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const sb = supabase as any;

const ChipField = ({ label, values }: { label: string; values: string[] }) => (
  <div>
    <div className="text-xs text-muted-foreground mb-1">{label}</div>
    <div className="flex flex-wrap gap-1.5">
      {(values || []).map((v, i) => <Badge key={i} variant="secondary" className="text-xs">{v}</Badge>)}
      {(!values || values.length === 0) && <span className="text-xs text-muted-foreground">—</span>}
    </div>
  </div>
);

export const AuthorityContextBrain = () => {
  const { selectedId } = useAuthority();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const load = async () => {
    if (!selectedId) return;
    const { data } = await sb.from("authority_context_profiles").select("*").eq("website_id", selectedId).maybeSingle();
    setProfile(data);
  };
  useEffect(() => { load(); }, [selectedId]);

  const save = async () => {
    if (!profile?.id) return;
    setLoading(true);
    const { error } = await sb.from("authority_context_profiles").update({
      proposition: profile.proposition,
    }).eq("id", profile.id);
    setLoading(false);
    if (error) toast({ title: "Fout", description: error.message, variant: "destructive" });
    else toast({ title: "Opgeslagen" });
  };

  const generateQueries = async () => {
    if (!selectedId) return;
    setGenerating(true);
    const { data, error } = await supabase.functions.invoke("authority-generate-queries", { body: { website_id: selectedId } });
    setGenerating(false);
    if (error) toast({ title: "Fout", description: error.message, variant: "destructive" });
    else toast({ title: "Queries gegenereerd", description: `${(data as any)?.inserted ?? 0} nieuwe queries.` });
  };

  if (!profile) return <div className="py-12 text-center text-sm text-muted-foreground">Geen contextprofiel. Run eerst een Context scan vanaf de Websites tab.</div>;

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={generateQueries} disabled={generating}>
          {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Genereer queries
        </Button>
        <Button size="sm" onClick={save} disabled={loading}>
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Opslaan
        </Button>
      </div>
      <Card className="p-4 space-y-4">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Propositie</div>
          <Textarea value={profile.proposition || ""} onChange={(e) => setProfile({ ...profile, proposition: e.target.value })} rows={2} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChipField label="ICP" values={profile.icp} />
          <ChipField label="Core topics" values={profile.core_topics} />
          <ChipField label="Secondary topics" values={profile.secondary_topics} />
          <ChipField label="Sectoren" values={profile.sectors} />
          <ChipField label="Differentiators" values={profile.differentiators} />
          <ChipField label="Money pages" values={profile.money_pages} />
          <ChipField label="Recommended pages" values={profile.recommended_pages} />
          <ChipField label="Linkable assets" values={profile.linkable_assets} />
          <ChipField label="Negative keywords" values={profile.negative_keywords} />
        </div>
      </Card>
    </div>
  );
};