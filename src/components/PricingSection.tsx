import { useState } from "react";
import { motion } from "framer-motion";
import { trackCTA } from "@/lib/tracking";
import { Button } from "@/components/ui/button";
import { Check, Plus, Users, Briefcase, Database, ArrowDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type CommitmentPeriod = "6" | "12";

const packages = [
  {
    label: "Startpakket",
    hours: 10,
    rates: { "6": 100, "12": 90 },
  },
  {
    label: "Meest gekozen",
    hours: 20,
    highlight: true,
    rates: { "6": 90, "12": 81 },
  },
  {
    label: "Maximale output",
    hours: 40,
    rates: { "6": 80, "12": 72 },
  },
];

const baseFeatures = [
  "Klantwerving en recruitment tegelijk",
  "Uw ideale klant in kaart gebracht",
  "Signalen herkennen en erop inspelen",
  "Contact via e-mail en LinkedIn (6 tot 8 keer)",
  "Elke reactie wordt beoordeeld",
  "Elke twee weken een helder overzicht",
  "Uw eigen contactpersoon",
  "Tot 5 gebruikers",
  "€0 opstartkosten",
];

const StepBadge = ({ step, label }: { step: number; label: string }) => (
  <div className="flex items-center gap-3 mb-8">
    <div className="w-10 h-10 rounded-full border-2 border-primary/40 bg-primary/10 flex items-center justify-center shrink-0">
      <span className="text-primary font-display font-bold text-sm">{step}</span>
    </div>
    <p className="text-primary font-display font-semibold text-sm tracking-[0.15em] uppercase">{label}</p>
  </div>
);

const StepDivider = () => (
  <div className="flex justify-center py-6">
    <ArrowDown className="w-5 h-5 text-primary/30" />
  </div>
);

const EngagementStep = () => {
  const [period, setPeriod] = useState<CommitmentPeriod>("6");
  const discount = period === "12" ? 10 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      <StepBadge step={2} label="Optioneel: engagement-uren" />
      <div className="card-gradient border border-glow rounded-lg p-5 md:p-8">
        {/* Header + Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-display font-bold text-xl">Persoonlijke opvolging</span>
              <span className="text-[10px] font-display font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Optioneel
              </span>
            </div>
            <p className="text-muted-foreground text-sm">Kwalificatie & opvolging voor beide stromen</p>
          </div>

          {/* Commitment toggle */}
          <div className="flex items-center gap-1 bg-secondary/80 border border-border rounded-full p-1">
            <button
              onClick={() => setPeriod("6")}
              className={`px-4 py-1.5 rounded-full text-xs font-display font-semibold transition-all ${
                period === "6"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              6 maanden
            </button>
            <button
              onClick={() => setPeriod("12")}
              className={`px-4 py-1.5 rounded-full text-xs font-display font-semibold transition-all flex items-center gap-1.5 ${
                period === "12"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              12 maanden
              <span className="text-[10px] font-bold text-primary">-10%</span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {packages.map((pkg) => {
            const rate = pkg.rates[period];
            const total = pkg.hours * rate;

            return (
              <div
                key={pkg.hours}
                className={`rounded-lg p-6 border text-center transition-all ${
                  pkg.highlight
                    ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                    : "border-border bg-secondary/50"
                }`}
              >
                {/* Plan label */}
                <span className={`text-[10px] font-display font-bold tracking-[0.12em] uppercase ${
                  pkg.highlight ? "text-primary" : "text-muted-foreground"
                }`}>
                  {pkg.label}
                </span>

                {/* Hours */}
                <p className="font-display font-bold text-4xl mt-2">{pkg.hours}h</p>
                <p className="text-muted-foreground text-xs mt-0.5">/ maand</p>

                {/* Pricing */}
                <div className="mt-5 pt-4 border-t border-border/50">
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="font-display font-bold text-2xl text-foreground">€{total}</span>
                    <span className="text-muted-foreground text-xs">/ mo</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <span className="text-primary font-display font-semibold text-sm">€{rate}</span>
                    <span className="text-muted-foreground text-xs">/ uur</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

const PricingSection = () => {
  return (
    <section id="pricing" className="py-16 md:py-32 relative">
      <div className="absolute inset-0 glow-bg pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center max-w-2xl mx-auto"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Zo werkt de prijs
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Stel uw pakket samen
            <br />
            <span className="text-gradient">in 4 stappen.</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Begin met een vaste fee. Kies daarna hoeveel uren u wilt. Voeg eventueel Datahub en extra diensten toe.
          </p>
        </motion.div>

        {/* STEP 1 — Fixed Service Fee */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <StepBadge step={1} label="Vaste service fee" />
          <div className="border border-primary/30 bg-primary/5 rounded-lg p-5 md:p-8 relative">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
              <div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-display font-bold text-4xl md:text-5xl">€1.500</span>
                  <span className="text-muted-foreground text-sm">/maand</span>
                </div>
                <p className="text-muted-foreground text-sm mb-6">
                  €0 opstartkosten · Tot 5 personen · Minimaal 6 maanden
                </p>
                <ul className="space-y-3">
                  {baseFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hidden md:flex flex-col items-center justify-center">
                <Button variant="hero" size="lg" asChild>
                  <a
                    href="https://app.usemotion.com/meet/Rebel-Force/meeting"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCTA("Homepage Pricing — Plan een Demo (desktop)", "https://app.usemotion.com/meet/Rebel-Force/meeting")}
                  >
                    Plan een Demo →
                  </a>
                </Button>
              </div>
            </div>
            <Button variant="hero" size="lg" className="w-full mt-6 md:hidden" asChild>
              <a
                href="https://app.usemotion.com/meet/Rebel-Force/meeting"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCTA("Homepage Pricing — Plan een Demo (mobile)", "https://app.usemotion.com/meet/Rebel-Force/meeting")}
              >
                Plan een Demo →
              </a>
            </Button>
          </div>
        </motion.div>

        <StepDivider />

        {/* STEP 2 — Engagement Hours */}
        <EngagementStep />

        <StepDivider />

        {/* STEP 3 — Datahub */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <StepBadge step={3} label="Voeg Datahub toe" />
          <div className="card-gradient border border-glow rounded-lg p-5 md:p-8 group hover:border-primary/30 transition-colors">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Database className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-bold text-xl">Datahub</h3>
                  <span className="text-xs font-display font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    vanaf €499/mnd
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                   Uw commercieel geheugen. Al uw data op één plek.
                   Stel vragen aan uw data, zonder verplichtingen.
                </p>
                <ul className="space-y-2">
                  {[
                    "Alle data en AI-context op één plek",
                    "Geen verplichtingen: uw data blijft van u",
                    "Werkt met uw bestaande CRM en tools",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hidden md:flex items-start pt-2">
                <span className="text-muted-foreground text-sm mr-1 mt-2">vanaf</span>
                <span className="font-display font-bold text-4xl text-foreground">€499</span>
                <span className="text-muted-foreground text-sm ml-1 mt-2">/maand</span>
              </div>
            </div>
          </div>
        </motion.div>

        <StepDivider />

        {/* STEP 4 — Add-ons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <StepBadge step={4} label="Activeer add-ons" />
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {[
              {
                icon: Users,
                label: "Add-on: Recruitment",
                title: "Full Service Recruitment",
                description: "Wij nemen het hele recruitmentproces over. Geen maandelijkse kosten, alleen een fee bij succes.",
                price: "15% bruto jaarsalaris",
                highlights: ["Sourcing & Selectie", "AI-kwalificatie", "Begeleiding tot aanname", "Teamopbouw"],
                link: "/full-service-recruitment",
              },
              {
                icon: Briefcase,
                label: "Add-on: Klantwerving",
                title: "Full Sales Management",
                description: "Wij nemen uw volledige commerciële proces over. Van strategie tot uitvoering.",
                price: "Prijs op aanvraag",
                highlights: ["Sales", "Marketing", "Strategie", "Relatiebeheer"],
                link: "/full-sales-management",
              },
            ].map(({ icon: Icon, label, title, description, price, highlights, link }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="card-gradient border border-glow rounded-lg p-5 md:p-8 hover:border-primary/30 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-5">
                  <Icon className="w-4 h-4 text-primary" />
                  <p className="text-xs font-display font-semibold text-muted-foreground tracking-[0.15em] uppercase">
                    {label}
                  </p>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Plus className="w-4 h-4 text-primary group-hover:rotate-90 transition-transform" />
                  <h3 className="font-display font-bold text-lg">{title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {description}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {highlights.map((h) => (
                    <span key={h} className="text-xs text-muted-foreground bg-secondary/80 border border-border px-2.5 py-1 rounded-md">
                      {h}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-display font-semibold text-primary">
                    {price}
                  </span>
                  <Link
                    to={link}
                    className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
                  >
                    Meer info <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mt-12 card-gradient border border-dashed border-primary/20 rounded-lg p-6 text-center"
        >
          <p className="text-muted-foreground text-sm">
            Wilt u weten wat dit voor uw situatie betekent?{" "}
            <a
              href="https://app.usemotion.com/meet/Rebel-Force/meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
              onClick={() => trackCTA("Homepage Pricing — Bespreek uw situatie", "https://app.usemotion.com/meet/Rebel-Force/meeting")}
            >
              Bespreek uw situatie →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
