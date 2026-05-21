import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CtaLink from "@/components/CtaLink";
import { CTA } from "@/content/copy";
import ParallaxBrain from "@/components/hero/ParallaxBrain";

const rotatingWords = ["handmatig werk.", "reactief reageren.", "gemiste signalen."];

const Hero = () => {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[85vh] lg:min-h-screen flex items-center pt-14 md:pt-16 overflow-hidden">
      {/* Brain visual — scoped to hero only (no fixed sticky behind page) */}
      <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
        <ParallaxBrain />
      </div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Glass-morph hero card */}
          <div className="flex-1 max-w-2xl rounded-[2rem] border border-white/[0.08] bg-white/[0.04] shadow-[0_8px_32px_0_rgba(0,5,5,0.2)] p-6 md:p-10">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display font-bold text-[3rem] md:text-[5.5rem] lg:text-[6rem] leading-[1.05] tracking-tighter mb-6 md:mb-8"
            >
              Minder
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
              <br />
              Meer resultaat.
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
              className="flex flex-wrap gap-4"
            >
              <Button variant="hero" size="lg" className="relative group" asChild>
                <CtaLink intent="nulmeting" location="Hero">
                  <span className="absolute inset-0 rounded-md bg-primary/20 animate-pulse group-hover:animate-none" />
                  {CTA.nulmeting.label}
                </CtaLink>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <CtaLink intent="hoeHetWerkt" location="Hero" />
              </Button>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
