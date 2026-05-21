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

        <div className="grid gap-4 md:gap-5 max-w-5xl">
          {COPY.methode.layers.map((layer, i) => (
            <motion.div
              key={layer.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-6 md:p-8 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start gap-6 md:gap-10">
                <span className="font-mono text-xs text-muted-foreground/70 tracking-widest shrink-0 pt-1">
                  {layer.number}
                </span>
                <div className="flex-1 grid md:grid-cols-[1fr_1fr] gap-4 md:gap-10 items-start">
                  <div>
                    <h3 className="font-display font-semibold text-xl md:text-2xl tracking-tight mb-2 text-foreground">
                      {layer.title}
                    </h3>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                      {layer.line}
                    </p>
                  </div>
                  <div className="md:border-l md:border-border/50 md:pl-8">
                    <p className="text-sm md:text-base text-foreground/90 leading-relaxed font-medium">
                      {layer.output}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 flex justify-center">
          <Button variant="hero" size="lg" asChild>
            <CtaLink intent="nulmeting" location="Methode Section" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MethodeSection;