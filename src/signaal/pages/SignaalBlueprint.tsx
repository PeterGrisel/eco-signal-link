import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SignaalLayout from "../components/SignaalLayout";
import { LAYERS } from "../data/layers";
import { getSelectedToolGuides } from "../data/toolSetupGuides";
import SetupChecklist from "../components/SetupChecklist";
import { motion } from "framer-motion";
import { Download, Loader2, Wrench } from "lucide-react";
import { generateBlueprintPdf } from "../utils/generateBlueprintPdf";
import { toast } from "sonner";

const SignaalBlueprint = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [inputs, setInputs] = useState<Record<number, Record<string, any>>>({});
  const [score, setScore] = useState(0);
  const [company, setCompany] = useState("");
  const [exporting, setExporting] = useState(false);

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

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      await generateBlueprintPdf({ company, score, inputs });
      toast.success("PDF gedownload!");
    } catch (err) {
      console.error('PDF export failed:', err);
      toast.error("PDF export mislukt. Probeer het opnieuw.");
    }
    setExporting(false);
  };

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

          {/* Download button */}
          <button
            onClick={handleExportPdf}
            disabled={exporting}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:shadow-[0_0_20px_rgba(232,148,90,0.3)] transition-all font-body disabled:opacity-50"
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {exporting ? 'Genereren...' : 'Download als PDF'}
          </button>
        </motion.div>

        {/* Blueprint sections */}
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

        {/* Installation Setup Checklist */}
        {(() => {
          const toolGuides = getSelectedToolGuides(inputs);
          if (toolGuides.length === 0) return null;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-2xl text-foreground">Installatie Setup</h2>
                  <p className="text-xs text-muted-foreground font-body">
                    Stap-voor-stap checklist om je toolstack in te richten
                  </p>
                </div>
              </div>
              <SetupChecklist guides={toolGuides} />
            </motion.div>
          );
        })()}
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
