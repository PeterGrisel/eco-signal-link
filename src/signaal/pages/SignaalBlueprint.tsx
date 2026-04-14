import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SignaalLayout from "../components/SignaalLayout";
import { LAYERS } from "../data/layers";
import { motion } from "framer-motion";

const SignaalBlueprint = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [inputs, setInputs] = useState<Record<number, Record<string, any>>>({});
  const [score, setScore] = useState(0);
  const [company, setCompany] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/signaal/start'); return; }

      const { data: profile } = await supabase
        .from('signal_profiles')
        .select('company')
        .eq('id', session.user.id)
        .maybeSingle();
      if (profile?.company) setCompany(profile.company);

      const { data: journeys } = await supabase
        .from('journeys')
        .select('*')
        .eq('user_id', session.user.id)
        .order('started_at', { ascending: false })
        .limit(1);

      if (!journeys?.[0]) { navigate('/signaal/journey'); return; }
      const journey = journeys[0];
      setScore(journey.score_total);

      const { data: inputData } = await supabase
        .from('journey_inputs')
        .select('*')
        .eq('journey_id', journey.id);

      if (inputData) {
        const grouped: Record<number, Record<string, any>> = {};
        inputData.forEach((input) => {
          if (!grouped[input.layer_id]) grouped[input.layer_id] = {};
          grouped[input.layer_id][input.field_key] = input.value_json;
        });
        setInputs(grouped);
      }

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

  return (
    <SignaalLayout>
      <div className="max-w-3xl mx-auto py-12 px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl text-foreground mb-2">
            Jouw Signaaldetectie Blueprint
          </h1>
          <p className="text-sm text-muted-foreground font-body">
            {company && `${company} · `}Gegenereerd op {new Date().toLocaleDateString('nl-NL')}
          </p>
          <div className="mt-4">
            <span className="font-mono text-3xl text-primary">{score}</span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
        </motion.div>

        {/* Blueprint sections — all visible (paid upfront) */}
        <div className="space-y-6">
          {LAYERS.map((layer, index) => {
            const layerInputs = inputs[layer.id] || {};
            const hasContent = Object.keys(layerInputs).length > 0;

            return (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-card border border-border"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs px-2 py-1 rounded bg-secondary text-primary">
                    0{layer.id}
                  </span>
                  <h2 className="font-display text-lg text-foreground">{layer.title}</h2>
                  {layer.scoreContribution > 0 && (
                    <span className="ml-auto font-mono text-xs text-muted-foreground">+{layer.scoreContribution}pts</span>
                  )}
                </div>

                {hasContent ? (
                  <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {layer.blueprintTemplate(layerInputs)}
                  </pre>
                ) : (
                  <p className="text-xs text-muted-foreground italic font-body">Nog niet ingevuld</p>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* 90-day reminder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 p-8 rounded-xl border border-primary/30 bg-card text-center"
        >
          <span className="text-primary text-3xl mb-4 block">✓</span>
          <h3 className="font-display text-xl text-foreground mb-2">
            Blueprint ontgrendeld
          </h3>
          <p className="text-sm text-muted-foreground font-body mb-6">
            Je hebt volledige toegang tot alle secties.
          </p>

          <div className="mt-6 p-4 rounded-lg bg-secondary">
            <p className="text-xs text-muted-foreground font-body mb-3">
              Zet een reminder voor over 90 dagen om je systeem te reviewen
            </p>
            <div className="flex justify-center gap-3">
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Signaaldetectie+Review&dates=${getReviewDate()}/${getReviewDate()}&details=Review+je+prospecting+systeem+en+pas+drempelwaarden+aan.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-card border border-border text-xs text-foreground hover:border-primary/30 transition-colors font-body"
              >
                Google Calendar
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </SignaalLayout>
  );
};

function getReviewDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 90);
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export default SignaalBlueprint;
