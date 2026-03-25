import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import teamBanner from "@/assets/team-banner.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Glow effect */}
      <div className="absolute inset-0 glow-bg pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-6"
          >
            Proces · Data · Resultaat
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-8"
          >
            Wij bouwen
            <br />
            <span className="text-gradient">het systeem.</span>
            <br />
            U plukt de vruchten.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
          >
            Een voorspelbaar groeiproces dat data oplevert. Met die data optimaliseert u continu 
            en stuurt u gerichter. Voor klanten, recruitment, partners of internationale expansie.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Button variant="hero" size="lg" asChild>
              <a href="https://app.usemotion.com/meet/Rebel-Force/meeting" target="_blank" rel="noopener noreferrer">
                Plan een Demo →
              </a>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <a href="#hoe-het-werkt">
                Hoe het werkt
              </a>
            </Button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-12 right-6 hidden lg:flex flex-col gap-8 text-right"
        >
          {[
            { value: "2", label: "Parallelle stromen" },
            { value: "4", label: "Systeemlagen" },
            { value: "6‑8", label: "Touchpoints per contact" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-4xl font-display font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
