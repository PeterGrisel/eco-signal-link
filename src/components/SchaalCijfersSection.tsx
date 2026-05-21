import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CtaLink from "@/components/CtaLink";
import { COPY } from "@/content/copy";

const SchaalCijfersSection = () => {
  const { eyebrow, heading, headingAccent, body, steps, fineprint } = COPY.schaal;
  return (
    <section className="py-20 md:py-32 border-b border-border/30 relative">
      <div className="absolute inset-0 glow-bg opacity-30 pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-12 md:mb-16"
        >
          <p className="text-primary font-display font-semibold text-xs tracking-[0.25em] uppercase mb-5">
            {eyebrow}
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
            {heading} <span className="text-gradient">{headingAccent}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mt-5 max-w-2xl">
            {body}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-4 md:gap-3">
          {steps.map((s, i) => {
            const isLast = i === steps.length - 1;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                className={`relative rounded-2xl border p-5 md:p-6 backdrop-blur-sm ${
                  isLast
                    ? "border-primary/50 bg-primary/5 shadow-[0_0_40px_-12px_hsl(var(--primary)/0.4)]"
                    : "border-border/40 bg-card/40"
                }`}
              >
                <p className="font-mono text-[0.65rem] md:text-xs text-muted-foreground/70 tracking-widest mb-2">
                  0{i + 1} · {s.label.toUpperCase()}
                </p>
                <p
                  className={`font-display font-bold tracking-tighter leading-none mb-2 ${
                    isLast
                      ? "text-3xl md:text-4xl lg:text-5xl text-gradient"
                      : "text-3xl md:text-4xl lg:text-5xl text-foreground"
                  }`}
                >
                  {s.value}
                </p>
                <p className="text-xs md:text-sm font-medium text-foreground/80 mb-2">
                  {s.unit}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {s.note}
                </p>
                {!isLast && (
                  <div className="hidden md:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-primary/60" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <p className="text-xs md:text-sm text-muted-foreground mt-8 max-w-2xl">
          {fineprint}
        </p>

        <div className="mt-10 flex">
          <Button variant="hero" size="lg" asChild>
            <CtaLink intent="nulmeting" location="Schaal Cijfers Section" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SchaalCijfersSection;