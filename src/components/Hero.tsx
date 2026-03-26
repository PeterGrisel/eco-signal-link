import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { trackCTA } from "@/lib/tracking";
import teamBanner from "@/assets/team-banner.jpg";

const rotatingWords = ["klanten.", "recruitment.", "partners.", "groei."];

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
      {/* Background banner image */}
      <div className="absolute inset-0">
        <img
          src={teamBanner}
          alt="Team Rebel Force"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/50" />
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 glow-bg pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display font-bold text-[2.5rem] md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-6 md:mb-8"
          >
            Wij bouwen
            <br />
            <span className="text-gradient">het systeem</span>
            <br />
            voor uw{" "}
            <span className="relative inline-block min-w-[5ch]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ y: 30, opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -30, opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.4 }}
                  className="text-gradient inline-block"
                >
                  {rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
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
      </div>
    </section>
  );
};

export default Hero;

  return (
    <section className="relative min-h-[85vh] lg:min-h-screen flex items-center pt-14 md:pt-16 overflow-hidden">
      {/* Background banner image */}
      <div className="absolute inset-0">
        <img
          src={teamBanner}
          alt="Team Rebel Force"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/50" />
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 glow-bg pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display font-bold text-[2.5rem] md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-6 md:mb-8"
          >
            Wij bouwen
            <br />
            <span className="text-gradient">het systeem</span>
            <br />
            voor uw{" "}
            <span className="relative inline-block min-w-[5ch]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ y: 30, opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -30, opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.4 }}
                  className="text-gradient inline-block"
                >
                  {rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted-foreground text-base md:text-xl max-w-2xl mb-8 md:mb-10 leading-relaxed"
          >
            Een voorspelbaar groeiproces dat data oplevert. Met die data optimaliseert u continu
            en stuurt u gerichter.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 mb-12 md:mb-16"
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
      </div>
    </section>
  );
};

export default Hero;
