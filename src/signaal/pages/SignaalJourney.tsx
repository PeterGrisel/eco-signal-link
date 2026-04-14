import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SignaalLayout from "../components/SignaalLayout";
import BlueprintPanel from "../components/BlueprintPanel";
import AgentPanel from "../components/AgentPanel";
import MobileBlueprintDrawer from "../components/MobileBlueprintDrawer";
import MobileAgentSheet from "../components/MobileAgentSheet";
import LayerProgress from "../components/LayerProgress";
import JourneyLayer from "../components/JourneyLayer";
import JourneyCompletion from "../components/JourneyCompletion";
import { LAYERS } from "../data/layers";
import { toast } from "sonner";
import JourneyOnboarding from "../components/JourneyOnboarding";
import { AnimatePresence } from "framer-motion";
import { Clock, TrendingUp } from "lucide-react";

interface AgentMessage {
  role: 'user' | 'assistant';
  content: string;
}

const TIME_SAVINGS = [0, 2, 4, 6, 8, 10, 12, 14]; // hrs/week per completed layer (cumulative index)

const SignaalJourney = () => {
  const navigate = useNavigate();
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [currentLayer, setCurrentLayer] = useState(1);
  const [completedLayers, setCompletedLayers] = useState<number[]>([]);
  const [allInputs, setAllInputs] = useState<Record<number, Record<string, any>>>({});
  const [score, setScore] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [totalQuizQuestions, setTotalQuizQuestions] = useState(0);
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([
    { role: 'assistant', content: 'Welkom. Laten we je prospecting systeem bouwen. Begin met laag 01 — Definitie.' }
  ]);
  const [agentLoading, setAgentLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Load journey on mount
  useEffect(() => {
    const loadJourney = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/signaal/start');
        return;
      }

      // Get latest journey
      const { data: journeys } = await supabase
        .from('journeys')
        .select('*')
        .eq('user_id', session.user.id)
        .order('started_at', { ascending: false })
        .limit(1);

      if (!journeys || journeys.length === 0) {
        navigate('/signaal/start');
        return;
      }

      const journey = journeys[0];

      // Gate: must be paid
      if (!(journey as any).paid) {
        navigate('/signaal/start');
        return;
      }

      setJourneyId(journey.id);
      setCurrentLayer(journey.current_layer);
      setScore(journey.score_total);

      // Load existing inputs
      const { data: inputs } = await supabase
        .from('journey_inputs')
        .select('*')
        .eq('journey_id', journey.id);

      if (inputs) {
        const grouped: Record<number, Record<string, any>> = {};
        inputs.forEach((input) => {
          if (!grouped[input.layer_id]) grouped[input.layer_id] = {};
          grouped[input.layer_id][input.field_key] = input.value_json;
        });
        setAllInputs(grouped);
        setCompletedLayers(
          Object.keys(grouped)
            .map(Number)
            .filter(layerId => layerId < journey.current_layer)
        );
      }

      // Show onboarding for first-time users
      if (journey.current_layer === 1 && (!inputs || inputs.length === 0)) {
        const seen = localStorage.getItem('signaal_onboarding_seen');
        if (!seen) setShowOnboarding(true);
      }

      // Load agent messages
      const { data: msgs } = await supabase
        .from('agent_messages')
        .select('*')
        .eq('journey_id', journey.id)
        .order('created_at', { ascending: true });

      if (msgs && msgs.length > 0) {
        setAgentMessages(msgs.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })));
      }

      setLoading(false);
    };
    loadJourney();
  }, [navigate]);

  const handleInputChange = useCallback((fieldKey: string, value: any) => {
    setAllInputs(prev => ({
      ...prev,
      [currentLayer]: {
        ...(prev[currentLayer] || {}),
        [fieldKey]: value,
      },
    }));

    if (journeyId) {
      supabase.from('journey_inputs').upsert(
        {
          journey_id: journeyId,
          layer_id: currentLayer,
          section_type: 'wat',
          field_key: fieldKey,
          value_json: value,
        },
        { onConflict: 'journey_id,layer_id,section_type,field_key' }
      ).then(({ error }) => {
        if (error) console.error('Failed to save input:', error);
      });
    }
  }, [currentLayer, journeyId]);

  const callAgent = useCallback(async (userMessage: string) => {
    if (!journeyId) return;
    setAgentLoading(true);

    const newUserMsg: AgentMessage = { role: 'user', content: userMessage };
    setAgentMessages(prev => [...prev, newUserMsg]);

    await supabase.from('agent_messages').insert({
      journey_id: journeyId,
      layer_id: currentLayer,
      role: 'user',
      content: userMessage,
    });

    try {
      const resp = await supabase.functions.invoke('signal-agent', {
        body: {
          messages: [...agentMessages, newUserMsg].map(m => ({ role: m.role, content: m.content })),
          context: {
            current_layer: currentLayer,
            current_section: 'wat',
            all_inputs: allInputs,
          },
        },
      });

      if (resp.error) throw resp.error;

      const assistantContent = resp.data?.content || resp.data?.choices?.[0]?.message?.content || 'Ik kon geen antwoord genereren.';
      const assistantMsg: AgentMessage = { role: 'assistant', content: assistantContent };
      setAgentMessages(prev => [...prev, assistantMsg]);

      await supabase.from('agent_messages').insert({
        journey_id: journeyId,
        layer_id: currentLayer,
        role: 'assistant',
        content: assistantContent,
      });
    } catch (err) {
      console.error('Agent error:', err);
      setAgentMessages(prev => [...prev, { role: 'assistant', content: 'Er ging iets mis. Probeer het opnieuw.' }]);
    }

    setAgentLoading(false);
  }, [journeyId, currentLayer, agentMessages, allInputs]);

  const handleAskAgent = useCallback((fieldKey: string, value: any) => {
    const layer = LAYERS.find(l => l.id === currentLayer);
    if (!layer) return;
    const field = layer.wat.fields.find(f => f.key === fieldKey);
    const label = field?.label || fieldKey;
    callAgent(`Ik heb "${label}" ingevuld: ${JSON.stringify(value)}`);
  }, [currentLayer, callAgent]);

  const handleLayerComplete = useCallback(async () => {
    if (!journeyId) return;

    const layer = LAYERS.find(l => l.id === currentLayer);
    const newScore = score + (layer?.scoreContribution || 0);
    const nextLayer = currentLayer + 1;

    setCompletedLayers(prev => [...prev, currentLayer]);
    setCurrentLayer(nextLayer);
    setScore(newScore);

    await supabase.from('journeys').update({
      current_layer: nextLayer,
      score_total: newScore,
    }).eq('id', journeyId);

    await supabase.from('blueprints').upsert({
      journey_id: journeyId,
      doc_json: allInputs,
    }, { onConflict: 'journey_id' });

    callAgent(`Laag ${currentLayer} afgerond. Geef een samenvatting.`);
    toast.success(`Laag ${String(currentLayer).padStart(2, '0')} afgerond!`);
  }, [journeyId, currentLayer, score, allInputs, callAgent]);

  const activeLayer = LAYERS.find(l => l.id === currentLayer);
  const estimatedTimeSaved = TIME_SAVINGS[Math.min(completedLayers.length, TIME_SAVINGS.length - 1)];

  if (loading) {
    return (
      <SignaalLayout className="flex items-center justify-center">
        <div className="font-mono text-sm text-muted-foreground">Laden...</div>
      </SignaalLayout>
    );
  }

  // Journey completed — show celebration screen
  if (!activeLayer) {
    return (
      <SignaalLayout>
        <JourneyCompletion
          score={score}
          quizScore={quizScore}
          totalQuizQuestions={totalQuizQuestions}
          completedLayers={completedLayers}
          allInputs={allInputs}
        />
      </SignaalLayout>
    );
  }

  return (
    <SignaalLayout>
      {/* Onboarding overlay */}
      <AnimatePresence>
        {showOnboarding && (
          <JourneyOnboarding
            onComplete={() => {
              setShowOnboarding(false);
              localStorage.setItem('signaal_onboarding_seen', 'true');
            }}
          />
        )}
      </AnimatePresence>

      {/* Mobile blueprint drawer */}
      <MobileBlueprintDrawer inputs={allInputs} currentLayer={currentLayer} score={score} />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left — Blueprint (desktop only) */}
        <div className="hidden lg:block">
          <BlueprintPanel inputs={allInputs} currentLayer={currentLayer} score={score} />
        </div>

        {/* Center — Journey Engine */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            {/* ── Waarde-meter ── */}
            <div className="mb-4 sm:mb-6 max-w-[600px] mx-auto">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <TrendingUp className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-body text-[11px] font-medium text-muted-foreground">Blueprint voortgang</span>
                      <span className="font-mono text-xs font-bold text-primary">{completedLayers.length}/7</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${(completedLayers.length / 7) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pl-3 border-l border-border shrink-0">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-mono text-[10px] text-muted-foreground">~{estimatedTimeSaved} uur/week bespaard</span>
                </div>
              </div>
            </div>

            {/* Global Quiz Score Indicator */}
            {totalQuizQuestions > 0 && (
              <div className="mb-4 sm:mb-6 max-w-[600px] mx-auto">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-primary/20 bg-card">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm">🧠</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-body text-[11px] font-medium text-muted-foreground">Quiz Score</span>
                      <span className="font-mono text-xs font-bold text-primary">{quizScore}/{totalQuizQuestions}</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${(quizScore / totalQuizQuestions) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                    {Math.round((quizScore / totalQuizQuestions) * 100)}%
                  </span>
                </div>
              </div>
            )}

            {/* Layer progress */}
            <div className="mb-6 sm:mb-8 flex justify-center overflow-x-auto">
              <LayerProgress currentLayer={currentLayer} completedLayers={completedLayers} onLayerClick={(layer) => setCurrentLayer(layer)} />
            </div>

            {/* Active layer */}
            <JourneyLayer
              layer={activeLayer}
              inputs={allInputs[currentLayer] || {}}
              completedLayers={completedLayers}
              onInputChange={handleInputChange}
              onComplete={handleLayerComplete}
              onAskAgent={handleAskAgent}
              onQuizScoreUpdate={(correct, total) => {
                setQuizScore(prev => prev + correct);
                setTotalQuizQuestions(prev => prev + total);
              }}
            />
          </div>
        </div>

        {/* Right — Agent (desktop only) */}
        <div className="hidden lg:block">
          <AgentPanel
            messages={agentMessages}
            isLoading={agentLoading}
            onSendMessage={callAgent}
          />
        </div>
      </div>

      {/* Mobile agent bottom sheet */}
      <MobileAgentSheet
        messages={agentMessages}
        isLoading={agentLoading}
        onSendMessage={callAgent}
      />
    </SignaalLayout>
  );
};

export default SignaalJourney;
