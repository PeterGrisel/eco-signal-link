import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import SignaalLayout from "../components/SignaalLayout";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { Shield, CheckCircle2, FileText, Zap, Clock } from "lucide-react";

const SignaalStart = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'onboarding' | 'checkout' | 'confirming'>('email');
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Handle auth error from hash (expired/invalid magic link)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('error=')) {
      const params = new URLSearchParams(hash.replace('#', ''));
      const errorDesc = params.get('error_description');
      if (errorDesc?.toLowerCase().includes('expired')) {
        toast.error("Je magic link is verlopen. Vraag een nieuwe aan.");
      } else if (errorDesc) {
        toast.error(errorDesc);
      }
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const checkProfile = async (uid: string) => {
      setUserId(uid);
      const { data } = await supabase
        .from('signal_profiles')
        .select('name')
        .eq('id', uid)
        .maybeSingle();
      if (data?.name) {
        // Profile exists — check if they have a paid journey
        const { data: journeys } = await supabase
          .from('journeys')
          .select('id, paid')
          .eq('user_id', uid)
          .order('started_at', { ascending: false })
          .limit(1);

        if (journeys?.[0]?.paid) {
          navigate('/signaal/journey');
        } else {
          // Has profile but hasn't paid → show checkout
          setStep('checkout');
        }
      } else {
        setStep('onboarding');
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          checkProfile(session.user.id);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        checkProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/signaal/start` },
    });
    setLoading(false);
    if (error) {
      if (error.message?.includes('security purposes') || error.status === 429) {
        toast.error("Even geduld — probeer het over een minuut opnieuw.");
      } else {
        toast.error("Er ging iets mis. Probeer het opnieuw.");
      }
    } else {
      toast.success("Check je inbox voor de magic link!");
    }
  };

  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Je bent niet ingelogd.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('signal_profiles').upsert({
      id: session.user.id,
      email: session.user.email,
      name: name.trim(),
      company: company.trim() || null,
    });

    if (error) {
      toast.error("Kon profiel niet opslaan.");
    } else {
      setStep('checkout');
    }
    setLoading(false);
  };

  const fetchClientSecret = async (): Promise<string> => {
    const { data: { session } } = await supabase.auth.getSession();
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        priceId: "signaal_journey_once",
        customerEmail: session?.user?.email,
        userId: session?.user?.id,
        environment: getStripeEnvironment(),
        returnUrl: `${window.location.origin}/signaal/start?paid=true&session_id={CHECKOUT_SESSION_ID}`,
      },
    });
    if (error || !data?.clientSecret) throw new Error("Failed to create checkout session");
    return data.clientSecret;
  };

  // Handle return from checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('paid') === 'true') {
      setStep('confirming');
      const createJourney = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Check if journey already exists
        const { data: existing } = await supabase
          .from('journeys')
          .select('id, paid')
          .eq('user_id', session.user.id)
          .order('started_at', { ascending: false })
          .limit(1);

        if (existing?.[0]?.paid) {
          navigate('/signaal/journey');
          return;
        }

        if (existing?.[0]) {
          // Update existing journey to paid
          await supabase.from('journeys').update({ paid: true }).eq('id', existing[0].id);
        } else {
          // Create new paid journey
          await supabase.from('journeys').insert({
            user_id: session.user.id,
            paid: true,
          });
        }

        // Also ensure blueprint exists
        const { data: journeys } = await supabase
          .from('journeys')
          .select('id')
          .eq('user_id', session.user.id)
          .order('started_at', { ascending: false })
          .limit(1);

        if (journeys?.[0]) {
          await supabase.from('blueprints').upsert({
            journey_id: journeys[0].id,
            paid: true,
          }, { onConflict: 'journey_id' });
        }

        navigate('/signaal/journey');
      };
      createJourney();
    }
  }, [navigate]);

  return (
    <SignaalLayout className="flex items-center justify-center">
      <PaymentTestModeBanner />
      
      {step === 'checkout' ? (
        <div className="w-full max-w-lg mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl text-foreground mb-2">Ontgrendel je journey</h1>
            <p className="text-sm text-muted-foreground font-body">Eenmalig €97 — volledige toegang tot alles</p>
          </div>

          {/* Value props */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {[
              { icon: FileText, label: '7-laags systeem' },
              { icon: Zap, label: 'Blueprint export' },
              { icon: Clock, label: 'Bespaar 12+ uur/week' },
              { icon: Shield, label: 'Geld-terug-garantie' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border">
                <Icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs text-foreground font-body">{label}</span>
              </div>
            ))}
          </div>

          <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      ) : step === 'confirming' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-6"
        >
          <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="font-display text-2xl text-foreground mb-2">Betaling ontvangen!</h1>
          <p className="text-sm text-muted-foreground font-body">Je journey wordt voorbereid...</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm mx-auto px-6"
        >
          {step === 'email' ? (
            <form onSubmit={handleMagicLink} className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="font-display text-3xl text-foreground mb-2">Start je journey</h1>
                <p className="text-sm text-muted-foreground font-body">Voer je email in om te beginnen</p>
              </div>

              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jouw@email.com"
                  required
                  className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 font-body"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50 hover:shadow-[0_0_20px_rgba(232,148,90,0.2)] transition-all font-body"
              >
                {loading ? 'Versturen...' : 'Stuur magic link →'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOnboarding} className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="font-display text-3xl text-foreground mb-2">Welkom</h1>
                <p className="text-sm text-muted-foreground font-body">Vertel ons over jezelf</p>
              </div>

              <div className="space-y-4">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jouw naam"
                  required
                  className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 font-body"
                />
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Bedrijfsnaam (optioneel)"
                  className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 font-body"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50 hover:shadow-[0_0_20px_rgba(232,148,90,0.2)] transition-all font-body"
              >
                {loading ? 'Opslaan...' : 'Verder naar betaling →'}
              </button>
            </form>
          )}
        </motion.div>
      )}
    </SignaalLayout>
  );
};

export default SignaalStart;
