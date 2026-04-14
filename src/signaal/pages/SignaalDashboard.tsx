import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SignaalLayout from "../components/SignaalLayout";
import { motion } from "framer-motion";
import { FileText, ArrowRight, Clock, TrendingUp, Plus } from "lucide-react";
import { LAYERS } from "../data/layers";

interface JourneyRow {
  id: string;
  current_layer: number;
  score_total: number;
  started_at: string;
  completed_at: string | null;
  paid: boolean;
}

const SignaalDashboard = () => {
  const navigate = useNavigate();
  const [journeys, setJourneys] = useState<JourneyRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/signaal/start');
        return;
      }

      const { data } = await supabase
        .from('journeys')
        .select('id, current_layer, score_total, started_at, completed_at, paid')
        .eq('user_id', session.user.id)
        .eq('paid', true)
        .order('started_at', { ascending: false });

      setJourneys(data || []);
      setLoading(false);
    };
    load();
  }, [navigate]);

  if (loading) {
    return (
      <SignaalLayout className="flex items-center justify-center">
        <div className="font-mono text-sm text-muted-foreground">Laden...</div>
      </SignaalLayout>
    );
  }

  if (journeys.length === 0) {
    navigate('/signaal/start');
    return null;
  }

  // If only 1 journey, go directly to it
  if (journeys.length === 1) {
    navigate(`/signaal/journey/${journeys[0].id}`, { replace: true });
    return null;
  }

  return (
    <SignaalLayout>
      <div className="max-w-3xl mx-auto py-10 px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-foreground mb-1">Mijn Signalen</h1>
            <p className="text-sm text-muted-foreground font-body">
              Bekijk en beheer je prospecting configuraties
            </p>
          </div>
          <button
            onClick={() => navigate(`/signaal/journey/${journeys[0].id}`)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:shadow-[0_0_20px_rgba(232,148,90,0.3)] transition-all font-body"
          >
            <Plus className="w-4 h-4" />
            Nieuw Signaal
          </button>
        </div>

        <div className="space-y-3">
          {journeys.map((journey, index) => {
            const isComplete = journey.current_layer > 7;
            const progress = Math.min(((journey.current_layer - 1) / 7) * 100, 100);
            const currentLayerName = LAYERS.find(l => l.id === journey.current_layer)?.title;
            const date = new Date(journey.started_at);
            const dateStr = date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });

            return (
              <motion.button
                key={journey.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/signaal/journey/${journey.id}`)}
                className="w-full text-left p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isComplete ? 'bg-primary/10' : 'bg-secondary'
                  }`}>
                    {isComplete ? (
                      <TrendingUp className="w-5 h-5 text-primary" />
                    ) : (
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-body text-sm font-semibold text-foreground">
                        Signaal #{journeys.length - index}
                      </span>
                      {isComplete ? (
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-mono font-bold">
                          COMPLEET
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-[10px] font-mono">
                          {currentLayerName}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                        {Math.min(journey.score_total, 100)}/100
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-mono text-[10px]">{dateStr}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </SignaalLayout>
  );
};

export default SignaalDashboard;
