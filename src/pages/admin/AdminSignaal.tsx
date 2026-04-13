import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, MessageSquare, BarChart3, Layers, Clock, CheckCircle2 } from "lucide-react";

interface JourneyRow {
  id: string;
  current_layer: number;
  score_total: number;
  started_at: string;
  completed_at: string | null;
  module_id: string;
  user_id: string;
  profile?: { name: string | null; email: string | null; company: string | null };
}

interface AgentMsg {
  id: string;
  journey_id: string;
  layer_id: number | null;
  role: string;
  content: string;
  created_at: string;
}

const AdminSignaal = () => {
  const [journeys, setJourneys] = useState<JourneyRow[]>([]);
  const [messages, setMessages] = useState<AgentMsg[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [jRes, mRes] = await Promise.all([
        supabase.from("journeys").select("*").order("started_at", { ascending: false }).limit(100),
        supabase.from("agent_messages").select("*").order("created_at", { ascending: false }).limit(500),
      ]);

      const jData = (jRes.data || []) as JourneyRow[];

      // Fetch profiles for all user_ids
      const userIds = [...new Set(jData.map((j) => j.user_id))];
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("signal_profiles")
          .select("id, name, email, company")
          .in("id", userIds);

        const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));
        jData.forEach((j) => {
          j.profile = profileMap.get(j.user_id) || undefined;
        });
      }

      setJourneys(jData);
      setMessages((mRes.data || []) as AgentMsg[]);
      setLoading(false);
    };
    load();
  }, []);

  const completedCount = journeys.filter((j) => j.completed_at).length;
  const avgLayer = journeys.length ? (journeys.reduce((s, j) => s + j.current_layer, 0) / journeys.length).toFixed(1) : "0";
  const avgScore = journeys.length ? Math.round(journeys.reduce((s, j) => s + j.score_total, 0) / journeys.length) : 0;
  const totalMessages = messages.length;

  const filteredMessages = selectedJourney
    ? messages.filter((m) => m.journey_id === selectedJourney)
    : [];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-muted-foreground animate-pulse">Laden...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Signaal Admin</h1>
          <p className="text-muted-foreground text-sm">Journey overzicht, agent gesprekken &amp; analytics</p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Journeys" value={journeys.length} />
          <StatCard icon={CheckCircle2} label="Voltooid" value={completedCount} />
          <StatCard icon={Layers} label="Gem. laag" value={avgLayer} />
          <StatCard icon={MessageSquare} label="Agent berichten" value={totalMessages} />
        </div>

        <Tabs defaultValue="journeys" className="space-y-4">
          <TabsList>
            <TabsTrigger value="journeys">Journeys</TabsTrigger>
            <TabsTrigger value="conversations">Gesprekken</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* --- Journeys tab --- */}
          <TabsContent value="journeys" className="space-y-2">
            <div className="rounded-lg border overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium">Gebruiker</th>
                    <th className="text-left p-3 font-medium">Bedrijf</th>
                    <th className="text-center p-3 font-medium">Laag</th>
                    <th className="text-center p-3 font-medium">Score</th>
                    <th className="text-center p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Gestart</th>
                  </tr>
                </thead>
                <tbody>
                  {journeys.map((j) => (
                    <tr
                      key={j.id}
                      className="border-t hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => setSelectedJourney(j.id)}
                    >
                      <td className="p-3">{j.profile?.name || j.profile?.email || j.user_id.slice(0, 8)}</td>
                      <td className="p-3 text-muted-foreground">{j.profile?.company || "—"}</td>
                      <td className="p-3 text-center">{j.current_layer}/7</td>
                      <td className="p-3 text-center">{j.score_total}</td>
                      <td className="p-3 text-center">
                        {j.completed_at ? (
                          <Badge variant="default" className="bg-green-600 text-white">Voltooid</Badge>
                        ) : (
                          <Badge variant="secondary">Actief</Badge>
                        )}
                      </td>
                      <td className="p-3 text-muted-foreground text-xs">
                        {new Date(j.started_at).toLocaleDateString("nl-NL")}
                      </td>
                    </tr>
                  ))}
                  {journeys.length === 0 && (
                    <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Nog geen journeys</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* --- Conversations tab --- */}
          <TabsContent value="conversations" className="space-y-4">
            {!selectedJourney ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Klik op een journey in het overzicht om het gesprek te bekijken.
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    Gesprek — Journey {selectedJourney.slice(0, 8)}
                  </CardTitle>
                  <CardDescription>{filteredMessages.length} berichten</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                      {filteredMessages.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">Geen berichten voor deze journey.</p>
                      )}
                      {[...filteredMessages].reverse().map((m) => (
                        <div
                          key={m.id}
                          className={`rounded-lg p-3 text-sm ${
                            m.role === "assistant"
                              ? "bg-primary/10 border border-primary/20"
                              : "bg-muted"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={m.role === "assistant" ? "default" : "outline"} className="text-[10px]">
                              {m.role === "assistant" ? "Agent" : "User"}
                            </Badge>
                            {m.layer_id && (
                              <span className="text-[10px] text-muted-foreground">Laag {m.layer_id}</span>
                            )}
                            <span className="text-[10px] text-muted-foreground ml-auto">
                              {new Date(m.created_at).toLocaleString("nl-NL")}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap">{m.content}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* --- Analytics tab --- */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Laag distributie</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((layer) => {
                      const count = journeys.filter((j) => j.current_layer >= layer).length;
                      const pct = journeys.length ? Math.round((count / journeys.length) * 100) : 0;
                      return (
                        <div key={layer} className="flex items-center gap-3">
                          <span className="text-xs w-14 text-muted-foreground">Laag {layer}</span>
                          <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                            <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs w-16 text-right tabular-nums">{count} ({pct}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Overzicht</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <Row label="Totale journeys" value={journeys.length} />
                  <Row label="Voltooid" value={completedCount} />
                  <Row label="Gemiddelde score" value={avgScore} />
                  <Row label="Gemiddelde laag" value={avgLayer} />
                  <Row label="Agent berichten" value={totalMessages} />
                  <Row label="Berichten / journey" value={journeys.length ? (totalMessages / journeys.length).toFixed(1) : "0"} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

const StatCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => (
  <Card>
    <CardContent className="p-4 flex items-center gap-3">
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </CardContent>
  </Card>
);

const Row = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium tabular-nums">{value}</span>
  </div>
);

export default AdminSignaal;
