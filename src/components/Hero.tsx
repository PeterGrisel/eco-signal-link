import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CtaLink from "@/components/CtaLink";
import { CTA } from "@/content/copy";
import ParallaxBrain from "@/components/hero/ParallaxBrain";
import ClientOrbit from "@/components/hero/ClientOrbit";
import { Users, ArrowLeft, UserPlus, MapPin, Globe, Handshake, Briefcase, RotateCcw } from "lucide-react";
import { trackCTA } from "@/lib/tracking";

const motions = [
  { icon: UserPlus, n: "01", title: "Klanten werven" },
  { icon: MapPin, n: "02", title: "Lokaal uitbreiden" },
  { icon: Globe, n: "03", title: "Nieuwe markten openen" },
  { icon: Handshake, n: "04", title: "Partners vinden" },
  { icon: Briefcase, n: "05", title: "Talent werven" },
  { icon: RotateCcw, n: "06", title: "Relaties reactiveren" },
];

const Hero = () => {
  const [showClients, setShowClients] = useState(false);
  return (
    <section className="relative pt-28 md:pt-36 pb-12 md:pb-16 overflow-hidden">
      {/* Themed radial background */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 40%, hsl(var(--primary) / 0.18), transparent 70%)",
        }}
      />
      <div className="container max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        {/* Glass-card header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="group glass-readability relative mx-auto max-w-3xl rounded-2xl bg-card/95 border border-foreground/10 px-6 py-8 md:px-10 md:py-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] text-center mb-14 md:mb-20 overflow-hidden"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent"
          />
          <div className="relative">
            <div className="flex items-center justify-center mb-5">
              <span className="text-[10px] uppercase tracking-[0.3em] text-primary">
                B2B-groeisysteem · één fundament
              </span>
            </div>

            <h1 className="font-display font-bold text-[2.25rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.05] tracking-tighter mb-6 text-foreground [text-wrap:pretty] [hyphens:none] [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]">
              Wilt u uw bedrijf schalen?
            </h1>

            <p className="text-foreground/80 text-base md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]">
              Stop met wachten op aanvragen.{" "}
              <span className="text-gradient">
                Bouw een systeem dat interesse herkent
              </span>{" "}
              vóórdat klanten actief zoeken.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="hero" size="lg" className="relative group" asChild>
                <CtaLink intent="gratisScan" location="Hero">
                  <span className="absolute inset-0 rounded-md bg-primary/20 animate-pulse group-hover:animate-none" />
                  {CTA.gratisScan.label}
                </CtaLink>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* 6 bewegingen */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {motions.map((m) => (
            <div
              key={m.n}
              className="group rounded-2xl border border-foreground/10 bg-card/95 shadow-lg p-6 hover:border-primary/40 hover:bg-background/60 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] tabular-nums text-primary/70 tracking-[0.2em]">{m.n}</span>
                <span className="h-px flex-1 bg-foreground/10 group-hover:bg-primary/40 transition-colors" />
                <m.icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-lg md:text-xl text-foreground">{m.title}</h3>
            </div>
          ))}
        </motion.div>

        {/* Pill */}
        <div className="mt-10 flex items-center justify-center">
          <div className="rounded-full border border-primary/30 bg-primary/[0.06] px-5 py-2 text-[10px] uppercase tracking-[0.3em] text-primary">
            Eén fundament · B2B-groeisysteem
          </div>
        </div>

        {/* Brain stage */}
        <div className="relative w-full h-[60vh] md:h-[70vh] mt-12 md:mt-16">
          <motion.div
            aria-hidden
            animate={{ opacity: showClients ? 0.15 : 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <ParallaxBrain />
          </motion.div>

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

          <div className="absolute inset-x-0 bottom-4 md:bottom-8 z-10 flex justify-center">
            {!showClients ? (
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
            ) : (
              <Button
                variant="heroOutline"
                size="lg"
                onClick={() => setShowClients(false)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
