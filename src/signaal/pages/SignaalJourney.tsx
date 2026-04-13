import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SignaalLayout from "../components/SignaalLayout";
import BlueprintPanel from "../components/BlueprintPanel";
import AgentPanel from "../components/AgentPanel";
import MobileBlueprintDrawer from "../components/MobileBlueprintDrawer";
import MobileAgentSheet from "../components/MobileAgentSheet";
import LayerProgress from "../components/LayerProgress";
import JourneyLayer from "../components/JourneyLayer";
import { LAYERS } from "../data/layers";
import { toast } from "sonner";
import JourneyOnboarding from "../components/JourneyOnboarding";
import { AnimatePresence } from "framer-motion";

interface AgentMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SignaalJourney = () => {
  const navigate = useNavigate();
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [currentLayer, setCurrentLayer] = useState(1);
  const [completedLayers, setCompletedLayers] = useState<number[]>([]);
  const [allInputs, setAllInputs] = useState<Record<number, Record<string, any>>>({});
  const [score, setScore] = useState(0);
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

      // Show onboarding for first-time users (layer 1, no inputs yet)
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

  // Save input to Supabase (debounced via onBlur in JourneyLayer)
  const handleInputChange = useCallback((fieldKey: string, value: any) => {
    setAllInputs(prev => ({
      ...prev,
      [currentLayer]: {
        ...(prev[currentLayer] || {}),
        [fieldKey]: value,
      },
    }));

    // Persist to Supabase
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

    // Save user message
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

      // Save assistant message
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

    // Update journey in Supabase
    await supabase.from('journeys').update({
      current_layer: nextLayer,
      score_total: newScore,
    }).eq('id', journeyId);

    // Update blueprint
    await supabase.from('blueprints').upsert({
      journey_id: journeyId,
      doc_json: allInputs,
    }, { onConflict: 'journey_id' });

    callAgent(`Laag ${currentLayer} afgerond. Geef een samenvatting.`);
    toast.success(`Laag ${String(currentLayer).padStart(2, '0')} afgerond!`);
  }, [journeyId, currentLayer, score, allInputs, callAgent]);

  const activeLayer = LAYERS.find(l => l.id === currentLayer);

  if (loading) {
    return (
      <SignaalLayout className="flex items-center justify-center">
        <div className="font-mono text-sm text-[#6B6B72]">Laden...</div>
      </SignaalLayout>
    );
  }

  if (!activeLayer) {
    return (
      <SignaalLayout className="flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-['DM_Serif_Display'] text-3xl text-[#F0F0EE] mb-4">Journey voltooid!</h2>
          <p className="text-sm text-[#6B6B72] font-['DM_Sans'] mb-6">Score: {score}/100</p>
          <a href="/signaal/blueprint" className="px-6 py-3 bg-[#E8FF47] text-[#0A0A0B] rounded-lg text-sm font-medium font-['DM_Sans']">
            Bekijk je Blueprint →
          </a>
        </div>
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

      <div className="flex h-screen overflow-hidden">
        {/* Left — Blueprint (desktop only) */}
        <div className="hidden lg:block">
          <BlueprintPanel inputs={allInputs} currentLayer={currentLayer} score={score} />
        </div>

        {/* Center — Journey Engine */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            {/* Layer progress */}
            <div className="mb-6 sm:mb-8 flex justify-center overflow-x-auto">
              <LayerProgress currentLayer={currentLayer} completedLayers={completedLayers} onLayerClick={(layer) => setCurrentLayer(layer)} />
            </div>

            {/* Active layer */}
            <JourneyLayer
              layer={activeLayer}
              inputs={allInputs[currentLayer] || {}}
              onInputChange={handleInputChange}
              onComplete={handleLayerComplete}
              onAskAgent={handleAskAgent}
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
