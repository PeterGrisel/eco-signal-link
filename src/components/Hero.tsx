import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CtaLink from "@/components/CtaLink";
import { CTA } from "@/content/copy";
import ParallaxBrain from "@/components/hero/ParallaxBrain";
import ClientOrbit from "@/components/hero/ClientOrbit";
import { Users, ArrowLeft } from "lucide-react";
import { trackCTA } from "@/lib/tracking";

const Hero = () => {
  const [showClients, setShowClients] = useState(false);

  return (
    <section className="relative min-h-[85vh] lg:min-h-screen flex items-center pt-14 md:pt-16 overflow-hidden">
      {/* Brain visual — scoped to hero only (no fixed sticky behind page) */}
      <motion.div
        aria-hidden
        animate={{ opacity: showClients ? 0.15 : 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <ParallaxBrain />
      </motion.div>

      {/* Klanten orbit — fades in when toggle active */}
      <AnimatePresence>
        {showClients && (
          <motion.div
            key="orbit"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 z-[5] pointer-events-none"
          >
            <ClientOrbit rings={3} baseSize={22} gap={14} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          {!showClients ? (
            <motion.div
              key="hero-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full border-y border-white/[0.08] bg-white/[0.04] shadow-[0_8px_32px_0_rgba(0,5,5,0.2)] py-8 md:py-14 lg:py-20"
            >
              <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-2xl mx-auto text-center">
                  <motion.h1
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.1 }}
                    className="font-display font-bold text-[2.25rem] md:text-[3.75rem] lg:text-[4.25rem] leading-[1.05] tracking-tighter mb-6 md:mb-8"
                  >
                    Wilt u uw bedrijf schalen?
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-foreground/80 text-base md:text-xl max-w-2xl mb-8 md:mb-10 leading-relaxed"
                  >
                    Eén commercieel brein. Eén levend groeisysteem.
                    Van marktdata en koopsignalen tot outreach, opvolging,
                    CRM-discipline en geboekte gesprekken.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-wrap gap-4 justify-center"
                  >
                    <Button variant="hero" size="lg" className="relative group" asChild>
                      <CtaLink intent="nulmeting" location="Hero">
                        <span className="absolute inset-0 rounded-md bg-primary/20 animate-pulse group-hover:animate-none" />
                        {CTA.nulmeting.label}
                      </CtaLink>
                    </Button>
                    <Button
                      variant="heroOutline"
                      size="lg"
                      onClick={() => {
                        setShowClients(true);
                        trackCTA("Hero — Toon klanten", "#klanten");
                      }}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Klanten
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="clients-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 1, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="container mx-auto px-4 md:px-6"
            >
              <div className="max-w-2xl mx-auto text-center">
                <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                  Onze klanten
                </p>
                <h2 className="font-display font-bold text-4xl md:text-6xl tracking-tighter mb-6">
                  In <span className="text-gradient">goed gezelschap</span>
                </h2>
                <p className="text-foreground/80 text-base md:text-lg mb-8 leading-relaxed">
                  B2B-bedrijven die hun groei niet meer aan toeval overlaten.
                </p>
                <Button
                  variant="heroOutline"
                  size="lg"
                  onClick={() => setShowClients(false)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Terug
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Hero;
