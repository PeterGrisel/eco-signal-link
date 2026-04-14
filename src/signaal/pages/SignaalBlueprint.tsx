import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import SignaalLayout from "../components/SignaalLayout";
import { LAYERS } from "../data/layers";
import { motion } from "framer-motion";
import { toast } from "sonner";

const SignaalBlueprint = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [inputs, setInputs] = useState<Record<number, Record<string, any>>>({});
  const [score, setScore] = useState(0);
  const [paid, setPaid] = useState(false);
  const [company, setCompany] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const isPaidParam = searchParams.get("paid") === "true";

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/signaal/start'); return; }

      setUserId(session.user.id);
      setUserEmail(session.user.email || null);

      // Get profile
      const { data: profile } = await supabase
        .from('signal_profiles')
        .select('company')
        .eq('id', session.user.id)
        .maybeSingle();
      if (profile?.company) setCompany(profile.company);

      // Get journey
      const { data: journeys } = await supabase
        .from('journeys')
        .select('*')
        .eq('user_id', session.user.id)
        .order('started_at', { ascending: false })
        .limit(1);

      if (!journeys?.[0]) { navigate('/signaal/journey'); return; }
      const journey = journeys[0];
      setJourneyId(journey.id);
      setScore(journey.score_total);

      // Check blueprint paid status
      const { data: blueprint } = await supabase
        .from('blueprints')
        .select('paid')
        .eq('journey_id', journey.id)
        .maybeSingle();

      if (blueprint?.paid || isPaidParam) {
        setPaid(true);
        // Update if came from checkout
        if (isPaidParam && !blueprint?.paid) {
          await supabase.from('blueprints').upsert({
            journey_id: journey.id,
            paid: true,
          }, { onConflict: 'journey_id' });
        }
      }

      // Load inputs
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
  }, [navigate, isPaidParam]);

  const fetchClientSecret = async (): Promise<string> => {
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        priceId: "blueprint_export_once",
        customerEmail: userEmail,
        userId,
        journeyId,
        environment: getStripeEnvironment(),
        returnUrl: `${window.location.origin}/signaal/blueprint?paid=true&session_id={CHECKOUT_SESSION_ID}`,
      },
    });
    if (error || !data?.clientSecret) throw new Error("Failed to create checkout session");
    return data.clientSecret;
  };

  if (loading) {
    return (
      <SignaalLayout className="flex items-center justify-center">
        <div className="font-mono text-sm text-muted-foreground">Laden...</div>
      </SignaalLayout>
    );
  }

  if (showCheckout) {
    return (
      <SignaalLayout>
        <div className="max-w-2xl mx-auto py-12 px-6">
          <button
            onClick={() => setShowCheckout(false)}
            className="text-sm text-muted-foreground hover:text-foreground mb-6 font-body"
          >
            ← Terug naar preview
          </button>
          <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
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

        {/* Blueprint sections */}
        <div className="space-y-6 relative">
          {LAYERS.map((layer, index) => {
            const layerInputs = inputs[layer.id] || {};
            const hasContent = Object.keys(layerInputs).length > 0;
            const isBlurred = !paid && index >= 4; // Blur sections 5-7 when unpaid

            return (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-6 rounded-xl bg-card border border-border ${isBlurred ? 'select-none' : ''}`}
              >
                {isBlurred && (
                  <div className="absolute inset-0 backdrop-blur-md bg-background/40 rounded-xl z-10 flex items-center justify-center">
                    <span className="font-mono text-xs text-muted-foreground">🔒 Betaal om te ontgrendelen</span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs px-2 py-1 rounded bg-[hsl(0, 0%, 13%)] text-primary">
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

          {/* Watermark overlay when unpaid */}
          {!paid && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-5">
              <span className="text-[80px] font-display text-primary/5 rotate-[-30deg] select-none">
                PREVIEW
              </span>
            </div>
          )}
        </div>

        {/* Export CTA */}
        {!paid ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 p-8 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-[hsl(0, 0%, 10%)] to-[hsl(0, 0%, 7%)]"
          >
            <h3 className="font-display text-2xl text-foreground mb-4">
              Download jouw Blueprint
            </h3>
            <p className="text-sm text-muted-foreground font-body mb-6">
              PDF + Configuratiebestanden
            </p>
            <ul className="space-y-2 mb-8 text-sm text-foreground/70 font-body">
              {[
                'Volledige blueprint als PDF',
                'Apollo saved search configuratie',
                'Email sequence templates (NL)',
                'HubSpot workflow beschrijving',
                '90-daagse review checklist',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-primary">✓</span> {item}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCheckout(true)}
                className="px-8 py-4 bg-primary text-[hsl(0, 0%, 7%)] rounded-lg text-base font-medium hover:shadow-[0_0_30px_rgba(232,148,90,0.3)] transition-all font-body"
              >
                Exporteer Blueprint — €97
              </button>
              <span className="text-xs text-muted-foreground font-mono">Eenmalig</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 p-8 rounded-xl border border-primary/30 bg-card text-center"
          >
            <span className="text-primary text-3xl mb-4 block">✓</span>
            <h3 className="font-display text-xl text-foreground mb-2">
              Blueprint ontgrendeld!
            </h3>
            <p className="text-sm text-muted-foreground font-body mb-6">
              Je hebt volledige toegang tot alle secties. PDF download komt binnenkort.
            </p>

            {/* 90-day reminder */}
            <div className="mt-6 p-4 rounded-lg bg-[hsl(0, 0%, 13%)]">
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
        )}
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
