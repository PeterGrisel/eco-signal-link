import { motion } from "framer-motion";
import { Building2, Users, Activity, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import CtaLink from "@/components/CtaLink";
import { COPY } from "@/content/copy";

const STAGE_ICONS = [Building2, Users, Activity, Calendar, TrendingUp];

const SchaalCijfersSection = () => {
  const { eyebrow, heading, headingAccent, body, steps, fineprint } = COPY.schaal;

  return (
    <section className="py-20 md:py-32 border-b border-border/30 relative">
      <div className="absolute inset-0 glow-bg opacity-30 pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-16 md:mb-20"
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

        {/* Horizontal stat row with connecting line */}
        <div className="relative">
          {/* Connecting line — sits behind icon circles, hidden on mobile */}
          <div
            aria-hidden
            className="hidden md:block absolute left-[10%] right-[10%] top-7 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.4) 15%, hsl(var(--primary) / 0.4) 85%, transparent)",
            }}
          />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-y-12 gap-x-4 relative">
            {steps.map((s, i) => {
              const Icon = STAGE_ICONS[i];
              const isHighlight = i === steps.length - 1;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Icon circle */}
                  <div
                    className={`relative flex items-center justify-center w-14 h-14 rounded-full border bg-background mb-5 ${
                      isHighlight
                        ? "border-primary/60 shadow-[0_0_24px_-6px_hsl(var(--primary)/0.7)]"
                        : "border-primary/40"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-primary" strokeWidth={1.6} />
                  </div>

                  {/* Big number */}
                  <p
                    className={`font-display font-bold tracking-tighter leading-none mb-3 text-4xl md:text-5xl lg:text-6xl tabular-nums ${
                      isHighlight ? "text-gradient" : "text-foreground"
                    }`}
                  >
                    {s.value}
                  </p>

                  {/* Label */}
                  <p className="text-sm md:text-base font-medium text-foreground/90 mb-1.5 [text-wrap:balance]">
                    {s.label}
                  </p>

                  {/* Subtitle */}
                  <p className="text-xs md:text-sm text-muted-foreground [text-wrap:balance]">
                    {s.note}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Fineprint */}
        <p className="text-sm md:text-base italic text-muted-foreground text-center max-w-3xl mx-auto mt-16 md:mt-20 leading-relaxed">
          {fineprint}
        </p>

        <div className="mt-10 flex justify-center">
          <Button variant="hero" size="lg" asChild>
            <CtaLink intent="gratisScan" location="Schaal Cijfers Section" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SchaalCijfersSection;