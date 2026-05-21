import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Package, Rocket, Settings, TrendingUp, Clock, Calendar, Infinity, Target, Send, BarChart3, RefreshCw, Check, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CtaLink from "@/components/CtaLink";
import { COPY } from "@/content/copy";

const steps = [
  {
    icon: MessageSquare,
    title: "Kennismaking + behoefte",
    duration: "60 min",
    durationIcon: Clock,
    items: [
      "Kennismaking en intake",
      "Huidige situatie en doelen",
      "Uitdagingen, markt en doelgroep",
      "Kansrijke signalen verkennen",
    ],
  },
  {
    icon: Package,
    title: "Keuze pakket",
    duration: "60 min",
    durationIcon: Clock,
    items: [
      "Keuze voor Build & Transfer of Done-for-you",
      "Optioneel: System of Intelligence activeren",
      "Heldere scope, KPI's en verwachtingen",
    ],
  },
  {
    icon: Rocket,
    title: "Kick-off",
    duration: "120 min",
    durationIcon: Clock,
    items: [
      "Gezamenlijke kick-off",
      "Doelen, KPI's en planning",
      "Proces, rollen en afspraken",
      "Toegang en resources beschikbaar",
    ],
  },
  {
    icon: Settings,
    title: "Technische inrichting",
    duration: "Doorgaans 1 week",
    durationIcon: Calendar,
    items: [
      "Tools en connecties inrichten",
      "CRM, data en tracking",
      "Automatiseringen en flows",
      "Rapportages en dashboards klaarzetten",
    ],
  },
  {
    icon: TrendingUp,
    title: "Engagement service",
    duration: "Doorlopend",
    durationIcon: Infinity,
    items: [
      "Signal-based campagnes live",
      "Multichannel uitvoering",
      "Opvolging en monitoring",
      "Optimalisatie op basis van data",
    ],
  },
];

const doorlopend = [
  { icon: Target, title: "Signalen detecteren", text: "Wij monitoren continu uw markt, doelgroepen en koop-intenties." },
  { icon: Send, title: "Gericht engageren", text: "De juiste boodschap, via het juiste kanaal, op het juiste moment." },
  { icon: BarChart3, title: "Meten en leren", text: "Realtime data, analyses en inzichten in wat werkt." },
  { icon: RefreshCw, title: "Optimaliseren", text: "We sturen continu bij voor maximaal rendement en groei." },
];

const resultaat = [
  "Meer relevante gesprekken",
  "Gezonde pipeline",
  "Hogere conversie",
  "Voorspelbare groei",
];

const ProcessSection = () => {
  return (
    <section id="systeem" className="py-16 md:py-32 relative">
      <div className="absolute inset-0 glow-bg pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-20 text-center max-w-3xl mx-auto"
        >
          <p className="text-primary font-display font-semibold text-xs md:text-sm tracking-[0.2em] uppercase mb-4">
            Van scan tot resultaat
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-4">
            Een bewezen <span className="text-gradient">proces.</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Duidelijke stappen. Meetbaar resultaat.
          </p>
        </motion.div>

        {/* Timeline rail (desktop) */}
        <div className="relative">
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-16 md:mb-20">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const DurIcon = step.durationIcon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative flex flex-col"
                >
                  {/* Step number + icon */}
                  <div className="flex flex-col items-center mb-4">
                    <span className="font-display font-bold text-xs tracking-[0.2em] text-primary mb-2">
                      0{i + 1}
                    </span>
                    <div className="relative w-16 h-16 rounded-full border border-primary/40 bg-card flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="card-gradient border border-glow rounded-xl p-5 md:p-6 flex-1 flex flex-col">
                    <h3 className="font-display font-bold text-sm md:text-base uppercase tracking-wider text-primary text-center mb-4 min-h-[2.5rem] flex items-center justify-center">
                      {step.title}
                    </h3>
                    <ul className="space-y-2.5 flex-1">
                      {step.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-muted-foreground text-sm leading-snug">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <DurIcon className="w-3.5 h-3.5 text-primary" />
                      <span className="uppercase tracking-wider">{step.duration}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Doorlopend + Resultaat */}
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 card-gradient border border-glow rounded-xl p-6 md:p-8"
          >
            <p className="font-display font-semibold text-xs tracking-[0.2em] uppercase text-primary mb-6">
              Doorlopend: engagement en optimalisatie
            </p>
            <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
              {doorlopend.map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.title} className="flex gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-full border border-primary/40 bg-card flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-1">
                        {d.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-snug">{d.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card-gradient border border-glow rounded-xl p-6 md:p-8"
          >
            <p className="font-display font-semibold text-xs tracking-[0.2em] uppercase text-primary mb-6">
              Resultaat
            </p>
            <ul className="space-y-3">
              {resultaat.map((r) => (
                <li key={r} className="flex items-center gap-3 text-sm md:text-base">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Optional: System of Intelligence */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border border-primary/20 bg-primary/[0.04] p-5 md:p-6 mb-16 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6"
        >
          <div className="shrink-0 w-12 h-12 rounded-full border border-primary/40 bg-card flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-display font-semibold text-sm uppercase tracking-wider text-primary mb-1">
              Optioneel: System of Intelligence
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Het zenuwcentrum dat al uw data, signalen en interacties verbindt. Maakt uw B2B groeimachine slimmer, sneller en steeds effectiever.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h3 className="font-display font-bold text-xl md:text-2xl mb-3">
            {COPY.proposition.signalHeading}
          </h3>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {COPY.proposition.signalSubtext}
          </p>
          <Button variant="hero" size="lg" asChild>
            <CtaLink intent="gratisScan" location="Proces — Samen bepalen" />
          </Button>
        </motion.div>

        {/* Internal links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <Link to="/solutions/voorspelbare-pipeline" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
            Voorspelbare pipeline <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-border">·</span>
          <Link to="/solutions/internationaal-uitbreiden" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
            Internationaal uitbreiden <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-border">·</span>
          <Link to="/solutions/commercieel-talent" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
            Commercieel talent vinden <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSection;
