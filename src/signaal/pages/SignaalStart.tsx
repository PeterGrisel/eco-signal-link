import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SignaalLayout from "../components/SignaalLayout";
import { motion } from "framer-motion";
import { toast } from "sonner";

const SignaalStart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<'email' | 'onboarding'>('email');
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);

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
      // Clean hash from URL
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const checkProfile = async (userId: string) => {
      const { data } = await supabase
        .from('signal_profiles')
        .select('name')
        .eq('id', userId)
        .maybeSingle();
      if (data?.name) {
        navigate('/signaal/journey');
      } else {
        setStep('onboarding');
      }
    };

    // Listen for auth state changes (handles magic link redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          checkProfile(session.user.id);
        }
      }
    );

    // Also check existing session
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
      // Create a new journey
      const { error: journeyError } = await supabase.from('journeys').insert({
        user_id: session.user.id,
      });
      if (journeyError) {
        toast.error("Kon journey niet starten.");
      } else {
        navigate('/signaal/journey');
      }
    }
    setLoading(false);
  };

  return (
    <SignaalLayout className="flex items-center justify-center">
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
              className="w-full py-3 bg-primary text-[hsl(0, 0%, 7%)] rounded-lg text-sm font-medium disabled:opacity-50 hover:shadow-[0_0_20px_rgba(232,148,90,0.2)] transition-all font-body"
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
              className="w-full py-3 bg-primary text-[hsl(0, 0%, 7%)] rounded-lg text-sm font-medium disabled:opacity-50 hover:shadow-[0_0_20px_rgba(232,148,90,0.2)] transition-all font-body"
            >
              {loading ? 'Opslaan...' : 'Start de journey →'}
            </button>
          </form>
        )}
      </motion.div>
    </SignaalLayout>
  );
};

export default SignaalStart;
