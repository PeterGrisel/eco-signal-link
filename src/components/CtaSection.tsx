import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import CtaLink from "@/components/CtaLink";
import { COPY } from "@/content/copy";
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
            {COPY.ctaSection.headingLine1}
            <br />
            <span className="text-gradient">{COPY.ctaSection.headingAccent}</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            {COPY.ctaSection.body}
          </p>
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-center gap-3">
              <img src={peterGrisel} alt="Peter Grisel" className="w-10 h-10 rounded-full object-cover border-2 border-primary/30" />
              <span className="text-muted-foreground text-sm">{COPY.ctaSection.speakWith}</span>
            </div>
            <Button variant="hero" size="lg" asChild>
              <CtaLink intent="gratisScan" location="CTA Section" />
            </Button>
          </div>
          {COPY.ctaSection.fineprint && (
            <p className="text-muted-foreground text-sm mt-6">
              {COPY.ctaSection.fineprint}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
