import { motion } from "framer-motion";
import { Building2, Calendar, Wallet, ArrowRight, Database, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import CtaLink from "@/components/CtaLink";
import { caseStudies } from "@/data/caseStudies";

/** Rekenmodel-defaults, gelijk aan het interactieve model verderop. */
const modelStats = [
  { icon: Building2, value: "2.000", label: "bedrijven in uw ICP" },
  { icon: Calendar, value: "20", label: "afspraken per maand" },
  { icon: Wallet, value: "€500k", label: "pipeline per cyclus" },
];

const pillars = [
  {
    icon: Database,
    title: "Op uw eigen tools",
    description:
      "Alle data, flows en contacten staan in uw eigen CRM. Die blijven van u.",
  },
  {
    icon: Clock,
    title: "Binnen 30 dagen live",
    description:
      "Scan en kaart in de eerste maand. Daarna draaien de eerste flows.",
  },
  {
    icon: ShieldCheck,
    title: "Geen lock-in",
    description:
      "Drie maanden opzegbaar. U houdt alle draaiboeken, data en flows.",
  },
];

const CaseStudiesSection = () => {
  const published = caseStudies.filter((c) => c.published);

  return (
    <section id="section-cases" className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 max-w-2xl"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Bewijs
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-tight">
            Cijfers,
            <br />
            <span className="text-gradient">geen beloftes.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-6">
            We werken met een rekenmodel, niet met loze claims. Zo ziet u vooraf
            wat het systeem voor uw markt kan betekenen.
          </p>
        </motion.div>

        {/* Rekenmodel-strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-primary/25 bg-primary/5 p-6 md:p-8 mb-12 shadow-[0_0_40px_-16px_hsl(var(--primary)/0.5)]"
        >
          <div className="grid sm:grid-cols-3 gap-6 md:gap-4 mb-6">
            {modelStats.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-background/50 border border-primary/20 flex items-center justify-center shrink-0">
                  <s.icon className="w-5 h-5 text-primary" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="font-display font-bold text-2xl md:text-3xl text-gradient leading-none tabular-nums">
                    {s.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-primary/15">
            <p className="text-sm text-muted-foreground italic max-w-md">
              Een voorbeeld, geen belofte. Tijdens de scan vullen we het model
              met uw eigen markt en cijfers.
            </p>
            <a
              href="#chapter-07"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Speel met het rekenmodel
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>

        {/* Cases of placeholders */}
        {published.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {published.map((c) => (
              <motion.div
                key={c.client}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="card-gradient border-glow rounded-2xl p-6 md:p-7 flex flex-col"
              >
                <p className="text-[10px] font-display font-semibold tracking-[0.2em] uppercase text-primary/80 mb-2">
                  {c.sector}
                </p>
                <h3 className="font-display font-bold text-xl mb-3">
                  {c.client}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {c.challenge}
                </p>
                <div className="grid grid-cols-3 gap-2 mt-auto pt-5 border-t border-border/40">
                  {c.results.map((r) => (
                    <div key={r.label}>
                      <p className="font-display font-bold text-xl text-gradient tabular-nums">
                        {r.metric}
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-tight mt-1">
                        {r.label}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-3 md:gap-4">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="card-gradient border-glow rounded-2xl p-6 md:p-7 flex flex-col"
              >
                <span className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <p.icon className="w-5 h-5 text-primary" strokeWidth={1.6} />
                </span>
                <h3 className="font-display font-bold text-lg mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {p.description}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mt-10 text-center"
        >
          <Button variant="hero" size="lg" asChild>
            <CtaLink intent="gratisScan" location="Cases" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
