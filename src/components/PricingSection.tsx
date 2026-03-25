import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Plus, Users, Briefcase, Database, ArrowDown } from "lucide-react";

const baseFeatures = [
  "Beide stromen actief (recruitment + leads)",
  "4-lagen systeemopzet & ICP-mapping",
  "Signaalgebaseerde targeting",
  "Omnichannel outreach (6 tot 8 touchpoints)",
  "Intent-scoring & kwalificatie",
  "Tweewekelijkse rapportage",
  "Dedicated campagnemanager",
  "Tot 5 gebruikers inbegrepen",
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

const PricingSection = () => {
  return (
    <section id="pricing" className="py-32 relative">
      <div className="absolute inset-0 glow-bg pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center max-w-2xl mx-auto"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Dienstmodellen
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Bouw uw pakket
            <br />
            <span className="text-gradient">in 4 stappen.</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Start met een vaste service fee, kies uw engagement-uren, voeg Datahub toe en activeer add-ons naar behoefte.
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
          <div className="border border-primary/30 bg-primary/5 rounded-lg p-8 relative">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
              <div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-display font-bold text-5xl">€1.500</span>
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
                  <a href="https://app.usemotion.com/meet/Rebel-Force/meeting" target="_blank" rel="noopener noreferrer">
                    Plan een Demo →
                  </a>
                </Button>
              </div>
            </div>
            <Button variant="hero" size="lg" className="w-full mt-6 md:hidden" asChild>
              <a href="https://app.usemotion.com/meet/Rebel-Force/meeting" target="_blank" rel="noopener noreferrer">
                Plan een Demo →
              </a>
            </Button>
          </div>
        </motion.div>

        <StepDivider />

        {/* STEP 2 — Engagement Hours */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <StepBadge step={2} label="Kies uw engagement-uren" />
          <div className="card-gradient border border-glow rounded-lg p-8">
            <div className="mb-6">
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-display font-bold text-4xl">€67–€76</span>
                <span className="text-muted-foreground text-sm">/uur</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Kwalificatie, personalisatie, omnichannel follow-up voor beide stromen
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { hours: "10 uur", total6: "€2.260", total12: "€2.170", label: "Startpakket" },
                { hours: "20 uur", total6: "€3.020", total12: "€2.840", label: "Meest gekozen", highlight: true },
                { hours: "40 uur", total6: "€4.540", total12: "€4.180", label: "Maximale output" },
              ].map((pkg) => (
                <div
                  key={pkg.hours}
                  className={`rounded-lg p-5 border text-center ${
                    pkg.highlight
                      ? "border-primary/40 bg-primary/5"
                      : "border-border bg-secondary/50"
                  }`}
                >
                  {pkg.highlight && (
                    <span className="text-[10px] font-display font-bold text-primary tracking-[0.1em] uppercase">
                      Populair
                    </span>
                  )}
                  <p className="font-display font-bold text-3xl mt-1">{pkg.hours}</p>
                  <p className="text-muted-foreground text-xs mt-1">/maand</p>
                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <p>6 mnd: <span className="text-foreground font-semibold">{pkg.total6}</span></p>
                    <p>12 mnd: <span className="text-foreground font-semibold">{pkg.total12}</span></p>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 italic">{pkg.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <StepDivider />

        {/* STEP 3 — Datahub */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <StepBadge step={3} label="Voeg Datahub toe" />
          <div className="card-gradient border border-glow rounded-lg p-8 group hover:border-primary/30 transition-colors">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Database className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-bold text-xl">Datahub</h3>
                  <span className="text-xs font-display font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    + €500/mnd
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  Uw commercieel geheugen. Centraliseer al uw commerciële data en AI-context in één platform. 
                  Stel duizenden vragen aan uw data zonder vendor lock-in.
                </p>
                <ul className="space-y-2">
                  {[
                    "Commerciële data & AI-context gecentraliseerd",
                    "Query-based inzichten (1.000+ vragen/maand)",
                    "Geen vendor lock-in, uw data blijft van u",
                    "Integratie met uw bestaande CRM en tools",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hidden md:flex items-start pt-2">
                <span className="font-display font-bold text-4xl text-foreground">€500</span>
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
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Users,
                label: "Add-on: Recruitment",
                title: "Full Service Recruitment",
                description: "Volledig recruitmentproces van outreach tot aanname. Geen maandelijkse kosten, alleen een succesfee.",
                price: "15% bruto jaarsalaris",
                items: [
                  "Auto-kwalificatie & AI-testing via e-mail of chat",
                  "Persoonlijke kwalificatiegesprekken namens u",
                ],
              },
              {
                icon: Briefcase,
                label: "Add-on: Klantwerving",
                title: "Full Sales Management",
                description: "Van strategie tot uitvoering: wij nemen uw volledige salesproces over. Pipeline-opbouw, opvolging en closing.",
                price: "Prijs op aanvraag",
                items: [
                  "Website & SEO-optimalisatie",
                  "AI Avatar video-outreach",
                ],
              },
            ].map(({ icon: Icon, label, title, description, price, items }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="card-gradient border border-glow rounded-lg p-8 hover:border-primary/30 transition-colors group"
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

                <ul className="space-y-2 mb-5">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <span className="text-xs font-display font-semibold text-primary">
                  {price}
                </span>
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
            Verwachte output: <span className="text-foreground font-semibold">3 tot 5 hooggekwalificeerde meetings per maand</span> voor klanten én kandidaten.{" "}
            <a
              href="https://app.usemotion.com/meet/Rebel-Force/meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
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
