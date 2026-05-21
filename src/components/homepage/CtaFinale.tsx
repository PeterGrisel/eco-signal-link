import { motion } from "framer-motion";
import CtaLink from "@/components/CtaLink";
import { FeatureCard } from "@/components/ui/feature-card";

export default function CtaFinale() {
  return (
    <section
      id="act-finale"
      className="relative py-32 md:py-48 overflow-hidden border-t border-foreground/5"
    >
      {/* Background glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(var(--primary) / 0.18), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />

      <div className="container max-w-4xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-6">
            Begin hier
          </div>
          <h2 className="font-display text-5xl md:text-7xl font-medium leading-[1.02] mb-8 text-foreground [text-wrap:balance]">
            Eén gesprek.<br />
            <span className="text-primary">Eén machine.</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            30 minuten over uw markt, uw ICP en welke signalen er nu al zichtbaar zijn. Vrijblijvend.
          </p>
          <div className="flex justify-center">
            <FeatureCard
              title="Uw nulmeting in 30 minuten"
              description="We kijken samen naar uw markt, uw ICP en de signalen die er nu al zijn. Vrijblijvend."
              items={[
                "Analyse van uw huidige funnel",
                "Eerste signalen uit uw markt",
                "Concreet groeiplan op maat",
                "Heldere volgende stap",
              ]}
              action={<CtaLink intent="gratisScan" location="Cinematic Finale" />}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}