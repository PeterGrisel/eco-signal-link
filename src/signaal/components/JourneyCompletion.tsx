import { motion } from "framer-motion";
import { Trophy, Check, FileText, ArrowRight, Sparkles, Download, Loader2, RotateCcw } from "lucide-react";
import { LAYERS } from "../data/layers";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateBlueprintPdf } from "../utils/generateBlueprintPdf";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PartnerOptIn from "./PartnerOptIn";

interface JourneyCompletionProps {
  score: number;
  quizScore: number;
  totalQuizQuestions: number;
  completedLayers: number[];
  allInputs: Record<number, Record<string, any>>;
  journeyId?: string;
}

const Confetti = () => {
  const [particles] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      color: ['#E8945A', '#34D399', '#60A5FA', '#F59E0B', '#A78BFA'][Math.floor(Math.random() * 5)],
      size: 4 + Math.random() * 6,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: -10,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: '100vh', opacity: 0, rotate: 360 + Math.random() * 360 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
};

const JourneyCompletion = ({ score, quizScore, totalQuizQuestions, completedLayers, allInputs, journeyId }: JourneyCompletionProps) => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [forking, setForking] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | undefined>();
  const [userCompany, setUserCompany] = useState<string | undefined>();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserId(session.user.id);
        supabase.from("signal_profiles").select("name, company").eq("id", session.user.id).single().then(({ data }) => {
          if (data) {
            setUserName(data.name || undefined);
            setUserCompany(data.company || undefined);
          }
        });
      }
    });
  }, []);

  const cappedScore = Math.min(score, 100);

  const handleDownloadPdf = async () => {
    setExporting(true);
    try {
      await generateBlueprintPdf({ company: '', score: cappedScore, inputs: allInputs });
      toast.success("PDF gedownload!");
    } catch (err) {
      console.error('PDF export failed:', err);
      toast.error("PDF export mislukt.");
    }
    setExporting(false);
  };

  const handleForkJourney = async () => {
    setForking(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Je bent niet ingelogd.");
        setForking(false);
        return;
      }

      // Create new journey (paid = true, same user)
      const { data: newJourney, error: journeyError } = await supabase
        .from('journeys')
        .insert({
          user_id: session.user.id,
          paid: true,
          current_layer: 1,
          score_total: 0,
        })
        .select('id')
        .single();

      if (journeyError || !newJourney) throw journeyError;

      // Copy all inputs from previous journey to new one
      const inputRows = Object.entries(allInputs).flatMap(([layerId, fields]) =>
        Object.entries(fields).map(([fieldKey, value]) => ({
          journey_id: newJourney.id,
          layer_id: Number(layerId),
          section_type: 'wat',
          field_key: fieldKey,
          value_json: value,
        }))
      );

      if (inputRows.length > 0) {
        const { error: inputError } = await supabase
          .from('journey_inputs')
          .insert(inputRows);
        if (inputError) console.error('Failed to copy inputs:', inputError);
      }

      toast.success("Nieuw Signaal gestart met je vorige configuratie!");
      navigate(`/signaal/journey/${newJourney.id}`);
    } catch (err) {
      console.error('Fork failed:', err);
      toast.error("Kon geen nieuw Signaal starten.");
    }
    setForking(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative max-w-2xl mx-auto py-12 px-6">
      {showConfetti && <Confetti />}

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6"
        >
          <Trophy className="w-10 h-10 text-primary" />
        </motion.div>
        <h1 className="font-display text-4xl text-foreground mb-3">
          Je systeem is compleet!
        </h1>
        <p className="text-sm text-muted-foreground font-body max-w-md mx-auto">
          Je hebt alle 7 lagen van het Signaaldetectiesysteem geconfigureerd. 
          Jouw persoonlijke blueprint staat klaar.
        </p>
      </motion.div>

      {/* Score cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-4 mb-8"
      >
        <div className="p-5 rounded-xl bg-card border border-border text-center">
          <span className="font-mono text-4xl font-bold text-primary">{cappedScore}</span>
          <span className="text-sm text-muted-foreground">/100</span>
          <p className="text-xs text-muted-foreground font-body mt-1">Systeem Score</p>
        </div>
        <div className="p-5 rounded-xl bg-card border border-border text-center">
          <span className="font-mono text-4xl font-bold text-primary">
            {totalQuizQuestions > 0 ? Math.round((quizScore / totalQuizQuestions) * 100) : 0}%
          </span>
          <p className="text-xs text-muted-foreground font-body mt-1">Quiz Score</p>
        </div>
      </motion.div>

      {/* Layer overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl border border-border bg-card overflow-hidden mb-8"
      >
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-body text-sm font-semibold text-foreground">Jouw 7 lagen</span>
        </div>
        <div className="divide-y divide-border">
          {LAYERS.map((layer) => {
            const completed = completedLayers.includes(layer.id);
            return (
              <div key={layer.id} className="flex items-center gap-3 px-4 py-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    completed ? 'bg-primary/10' : 'bg-secondary'
                  }`}
                >
                  {completed ? (
                    <Check className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <span className="font-mono text-[9px] text-muted-foreground">{layer.id}</span>
                  )}
                </div>
                <span className="font-body text-sm text-foreground flex-1">{layer.title}</span>
                {layer.scoreContribution > 0 && (
                  <span className="font-mono text-[10px] text-muted-foreground">+{layer.scoreContribution}pts</span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-3"
      >
        <a
          href="/signaal/blueprint"
          className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:shadow-[0_0_30px_rgba(232,148,90,0.3)] transition-all font-body"
        >
          <FileText className="w-4 h-4" />
          Bekijk je Blueprint
          <ArrowRight className="w-4 h-4" />
        </a>

        <button
          onClick={handleDownloadPdf}
          disabled={exporting}
          className="flex items-center justify-center gap-2 w-full py-4 bg-card border border-primary/30 text-primary rounded-xl text-sm font-semibold hover:bg-primary/5 transition-all font-body disabled:opacity-50"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {exporting ? 'Genereren...' : 'Download Blueprint als PDF'}
        </button>

        <button
          onClick={handleForkJourney}
          disabled={forking}
          className="flex items-center justify-center gap-2 w-full py-4 bg-card border border-primary/30 text-primary rounded-xl text-sm font-semibold hover:bg-primary/5 transition-all font-body disabled:opacity-50"
        >
          {forking ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
          {forking ? 'Aanmaken...' : 'Nieuw Signaal bouwen (Fork & Edit)'}
        </button>

        <a
          href="/contact"
          className="flex items-center justify-center gap-2 w-full py-4 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:border-primary/30 transition-all font-body"
        >
          Wil je dat wij dit systeem voor je implementeren? →
        </a>
      </motion.div>

      {/* Partner Opt-In */}
      {userId && journeyId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <PartnerOptIn
            userId={userId}
            journeyId={journeyId}
            userName={userName}
            userCompany={userCompany}
          />
        </motion.div>
      )}
    </div>
  );
};

export default JourneyCompletion;
