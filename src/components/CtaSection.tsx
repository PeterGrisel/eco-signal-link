import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const CtaSection = () => {
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 glow-bg pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
            Klaar om uw
            <br />
            prospecting te
            <br />
            <span className="text-gradient">automatiseren?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Plan een vrijblijvende demo en ontdek hoe ons systeem 
            er voor uw organisatie uitziet. Van eerste contact tot gekwalificeerd gesprek.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="lg" asChild>
              <a href="https://app.usemotion.com/meet/Rebel-Force/meeting" target="_blank" rel="noopener noreferrer">
                Plan een gratis Demo →
              </a>
            </Button>
          </div>
          <p className="text-muted-foreground text-sm mt-6">
            €0 opstartkosten · Operationeel in 4 weken · Vanaf €1.500/maand
          </p>
          <p className="text-muted-foreground text-xs mt-2 max-w-md mx-auto">
            Wij raden minimaal 6 maanden aan — in een kleine markt is geduld de sleutel tot duurzame resultaten.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
