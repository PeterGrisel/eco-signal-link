import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trackCTA } from "@/lib/tracking";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import teamBanner from "@/assets/team-banner.jpg";

const rotatingWords = ["klanten.", "omzet.", "controle.", "groei."];

const Hero = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Vul alle velden in");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });
      if (error) throw error;
      toast.success("Bericht verzonden!");
      setFormData({ name: "", email: "", message: "" });
      trackCTA("Hero — Contact Form Submit", window.location.href);
    } catch {
      toast.error("Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-[85vh] lg:min-h-screen flex items-center pt-14 md:pt-16 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={teamBanner}
          alt="Team Rebel Force"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/50" />
      </div>

      <div className="absolute inset-0 glow-bg pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left: Hero text */}
          <div className="flex-1 max-w-2xl">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display font-bold text-[3rem] md:text-[5.5rem] lg:text-[6rem] leading-[1.05] tracking-tighter mb-6 md:mb-8"
            >
              Meer
              <br />
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ y: 40, opacity: 0, filter: "blur(6px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -40, opacity: 0, filter: "blur(6px)" }}
                  transition={{ duration: 0.35 }}
                  className="inline-block text-gradient"
                >
                  {rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-muted-foreground text-base md:text-xl max-w-2xl mb-8 md:mb-10 leading-relaxed"
            >
              U weet precies waar uw volgende klant vandaan komt.
              Elke week scherper. Elke maand meer resultaat.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Button variant="hero" size="lg" className="relative group" asChild>
                <a
                  href="https://app.usemotion.com/meet/Rebel-Force/meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackCTA(
                      "Hero — Plan een Gesprek",
                      "https://app.usemotion.com/meet/Rebel-Force/meeting"
                    )
                  }
                >
                  <span className="absolute inset-0 rounded-md bg-primary/20 animate-pulse group-hover:animate-none" />
                  Plan een Gesprek →
                </a>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <a href="#hoe-het-werkt">Hoe het werkt</a>
              </Button>
            </motion.div>
          </div>

          {/* Right: Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full max-w-sm lg:max-w-md"
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-border/50 bg-background/60 backdrop-blur-xl p-6 space-y-4 shadow-2xl"
            >
              <h3 className="font-display font-semibold text-lg text-foreground">
                Direct in gesprek
              </h3>
              <Input
                placeholder="Naam"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-background/50 border-border/40"
                maxLength={100}
              />
              <Input
                type="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-background/50 border-border/40"
                maxLength={255}
              />
              <Textarea
                placeholder="Waar kunnen we bij helpen?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-background/50 border-border/40 min-h-[80px] resize-none"
                maxLength={1000}
                rows={3}
              />
              <Button type="submit" variant="hero" className="w-full" disabled={submitting}>
                {submitting ? "Verzenden..." : "Verstuur →"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Reactie binnen 24 uur
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
