import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { trackCTA } from "@/lib/tracking";
import peterGrisel from "@/assets/peter-grisel.png";

const CtaSection = () => {
  return (
    <section className="py-16 md:py-32 relative">
      <div className="absolute inset-0 glow-bg pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
            Klaar voor uw
            <br />
            <span className="text-gradient">nulmeting?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            30 minuten. Wij brengen uw proces in kaart en laten zien
            waar de winst zit. Geen verkoopgesprek.
          </p>
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-center gap-3">
              <img src={peterGrisel} alt="Peter Grisel" className="w-10 h-10 rounded-full object-cover border-2 border-primary/30" />
              <span className="text-muted-foreground text-sm">Spreek direct met Peter</span>
            </div>
            <Button variant="hero" size="lg" asChild>
              <a href="https://app.usemotion.com/meet/Rebel-Force/meeting" target="_blank" rel="noopener noreferrer"
                onClick={() => trackCTA("CTA Section — Plan de nulmeting", "https://app.usemotion.com/meet/Rebel-Force/meeting")}>
                Plan de nulmeting →
              </a>
            </Button>
          </div>
          <p className="text-muted-foreground text-sm mt-6">
            €0 · 30 minuten · Vrijblijvend
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
