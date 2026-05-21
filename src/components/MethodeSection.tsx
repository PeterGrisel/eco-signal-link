import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import CtaLink from "@/components/CtaLink";
import { COPY } from "@/content/copy";

const MethodeSection = () => {
  return (
    <section id="methode" className="py-20 md:py-32 border-b border-border/30 relative">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-12 md:mb-16"
        >
          <p className="text-primary font-display font-semibold text-xs tracking-[0.25em] uppercase mb-5">
            {COPY.methode.eyebrow}
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
            {COPY.methode.heading}{" "}
            <span className="text-gradient">{COPY.methode.headingAccent}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mt-5 max-w-2xl">
            {COPY.methode.body}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {COPY.methode.layers.map((layer, i) => (
            <motion.div
              key={layer.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="group rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-5 md:p-6 hover:border-primary/40 transition-colors"
            >
              <p className="font-mono text-xs text-primary/80 tracking-widest mb-3">
                {layer.number}
              </p>
              <h3 className="font-display font-semibold text-base md:text-lg tracking-tight mb-2 text-foreground leading-snug">
                {layer.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {layer.line}
              </p>
              <p className="text-xs md:text-sm text-foreground/85 leading-relaxed font-medium pt-4 border-t border-border/30">
                {layer.output}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 flex justify-center">
          <Button variant="hero" size="lg" asChild>
            <CtaLink intent="gratisScan" location="Methode Section" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MethodeSection;