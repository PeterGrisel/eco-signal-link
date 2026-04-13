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
        <div className="font-mono text-sm text-[#6B6B72]">Laden...</div>
      </SignaalLayout>
    );
  }

  if (showCheckout) {
    return (
      <SignaalLayout>
        <div className="max-w-2xl mx-auto py-12 px-6">
          <button
            onClick={() => setShowCheckout(false)}
            className="text-sm text-[#6B6B72] hover:text-[#F0F0EE] mb-6 font-['DM_Sans']"
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
          <h1 className="font-['DM_Serif_Display'] text-4xl text-[#F0F0EE] mb-2">
            Jouw Signaaldetectie Blueprint
          </h1>
          <p className="text-sm text-[#6B6B72] font-['DM_Sans']">
            {company && `${company} · `}Gegenereerd op {new Date().toLocaleDateString('nl-NL')}
          </p>
          <div className="mt-4">
            <span className="font-mono text-3xl text-[#E8FF47]">{score}</span>
            <span className="text-sm text-[#6B6B72]">/100</span>
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
                className={`relative p-6 rounded-xl bg-[#111113] border border-[#1E1E22] ${isBlurred ? 'select-none' : ''}`}
              >
                {isBlurred && (
                  <div className="absolute inset-0 backdrop-blur-md bg-[#0A0A0B]/40 rounded-xl z-10 flex items-center justify-center">
                    <span className="font-mono text-xs text-[#6B6B72]">🔒 Betaal om te ontgrendelen</span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs px-2 py-1 rounded bg-[#1E1E22] text-[#E8FF47]">
                    0{layer.id}
                  </span>
                  <h2 className="font-['DM_Serif_Display'] text-lg text-[#F0F0EE]">{layer.title}</h2>
                  {layer.scoreContribution > 0 && (
                    <span className="ml-auto font-mono text-xs text-[#6B6B72]">+{layer.scoreContribution}pts</span>
                  )}
                </div>

                {hasContent ? (
                  <pre className="text-xs font-mono text-[#6B6B72] whitespace-pre-wrap leading-relaxed">
                    {layer.blueprintTemplate(layerInputs)}
                  </pre>
                ) : (
                  <p className="text-xs text-[#6B6B72] italic font-['DM_Sans']">Nog niet ingevuld</p>
                )}
              </motion.div>
            );
          })}

          {/* Watermark overlay when unpaid */}
          {!paid && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-5">
              <span className="text-[80px] font-['DM_Serif_Display'] text-[#E8FF47]/5 rotate-[-30deg] select-none">
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
            className="mt-12 p-8 rounded-xl border-2 border-[#E8FF47]/20 bg-gradient-to-br from-[#111113] to-[#0A0A0B]"
          >
            <h3 className="font-['DM_Serif_Display'] text-2xl text-[#F0F0EE] mb-4">
              Download jouw Blueprint
            </h3>
            <p className="text-sm text-[#6B6B72] font-['DM_Sans'] mb-6">
              PDF + Configuratiebestanden
            </p>
            <ul className="space-y-2 mb-8 text-sm text-[#F0F0EE]/70 font-['DM_Sans']">
              {[
                'Volledige blueprint als PDF',
                'Apollo saved search configuratie',
                'Email sequence templates (NL)',
                'HubSpot workflow beschrijving',
                '90-daagse review checklist',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-[#E8FF47]">✓</span> {item}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCheckout(true)}
                className="px-8 py-4 bg-[#E8FF47] text-[#0A0A0B] rounded-lg text-base font-medium hover:shadow-[0_0_30px_rgba(232,255,71,0.3)] transition-all font-['DM_Sans']"
              >
                Exporteer Blueprint — €97
              </button>
              <span className="text-xs text-[#6B6B72] font-mono">Eenmalig</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 p-8 rounded-xl border border-[#E8FF47]/30 bg-[#111113] text-center"
          >
            <span className="text-[#E8FF47] text-3xl mb-4 block">✓</span>
            <h3 className="font-['DM_Serif_Display'] text-xl text-[#F0F0EE] mb-2">
              Blueprint ontgrendeld!
            </h3>
            <p className="text-sm text-[#6B6B72] font-['DM_Sans'] mb-6">
              Je hebt volledige toegang tot alle secties. PDF download komt binnenkort.
            </p>

            {/* 90-day reminder */}
            <div className="mt-6 p-4 rounded-lg bg-[#1E1E22]">
              <p className="text-xs text-[#6B6B72] font-['DM_Sans'] mb-3">
                Zet een reminder voor over 90 dagen om je systeem te reviewen
              </p>
              <div className="flex justify-center gap-3">
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Signaaldetectie+Review&dates=${getReviewDate()}/${getReviewDate()}&details=Review+je+prospecting+systeem+en+pas+drempelwaarden+aan.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-[#111113] border border-[#1E1E22] text-xs text-[#F0F0EE] hover:border-[#E8FF47]/30 transition-colors font-['DM_Sans']"
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
