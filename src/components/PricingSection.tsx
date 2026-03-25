import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Plus, Users, Briefcase } from "lucide-react";

const recruitmentAddOns = [
  {
    title: "Full Service Recruitment",
    description: "Volledig recruitmentproces van outreach tot aanname. Geen maandelijkse kosten, alleen een succesfee.",
    price: "15% bruto jaarsalaris",
  },
  {
    title: "Auto-Kwalificatie & AI-Testing",
    description: "AI-gestuurde vragenreeks via e-mail of chat. Alleen profielen boven de drempel komen door.",
    price: "Prijs op aanvraag",
  },
  {
    title: "Persoonlijke Kwalificatiegesprekken",
    description: "Onze recruiters voeren het kwalificatiegesprek namens u. Vaste prijs per gekwalificeerd gesprek.",
    price: "Vaste prijs per gesprek",
  },
];

const leadsAddOns = [
  {
    title: "Full Sales Management",
    description: "Van strategie tot uitvoering: wij nemen uw volledige salesproces over. Pipeline-opbouw, opvolging en closing.",
    price: "Prijs op aanvraag",
  },
  {
    title: "Website & SEO-Optimalisatie",
    description: "Technische SEO tot conversiegerichte landingspagina's zodat prospects u organisch vinden.",
    price: "Prijs op aanvraag",
  },
  {
    title: "AI Avatar Video",
    description: "Gepersonaliseerde video-outreach via AI-avatar, schaalbaar als eerste contact of follow-up.",
    price: "Prijs op aanvraag",
  },
];

const baseFeatures = [
  "Beide stromen actief (recruitment + leads)",
  "4-lagen systeemopzet & ICP-mapping",
  "Signaalgebaseerde targeting",
  "Omnichannel outreach (6 tot 8 touchpoints)",
  "Intent-scoring & kwalificatie",
  "Tweewekelijkse rapportage",
  "Dedicated campagnemanager",
  "€0 opstartkosten",
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-32 relative">
      <div className="absolute inset-0 glow-bg pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
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
            Één basis.
            <br />
            <span className="text-gradient">Twee stromen.</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Eén maandelijkse fee, gedeelde engagement-uren en stroomspecifieke add-ons die u naar behoefte activeert.
          </p>
        </motion.div>

        {/* Base package + engagement hours */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="border border-primary/30 bg-primary/5 rounded-lg p-8 relative"
          >
            <div className="absolute -top-3 left-6">
              <span className="bg-primary text-primary-foreground text-xs font-display font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full">
                Basisinfrastructuur
              </span>
            </div>

            <div className="mt-4 mb-6">
              <div className="flex items-baseline gap-1">
                <span className="font-display font-bold text-5xl">€1.500</span>
                <span className="text-muted-foreground text-sm">/maand</span>
              </div>
              <p className="text-muted-foreground text-sm mt-2">
                €0 opstartkosten · Beide stromen actief
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {baseFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button variant="hero" size="lg" className="w-full" asChild>
              <a href="https://app.usemotion.com/meet/Rebel-Force/meeting" target="_blank" rel="noopener noreferrer">
                Plan een Demo →
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="card-gradient border border-glow rounded-lg p-8 relative"
          >
            <div className="absolute -top-3 left-6">
              <span className="bg-secondary text-secondary-foreground text-xs font-display font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full border border-border">
                Engagement Uren
              </span>
            </div>

            <div className="mt-4 mb-6">
              <div className="flex items-baseline gap-1">
                <span className="font-display font-bold text-5xl">€67–€76</span>
                <span className="text-muted-foreground text-sm">/uur</span>
              </div>
              <p className="text-muted-foreground text-sm mt-2">
                Kwalificatie, personalisatie, omnichannel follow-up voor beide stromen
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { hours: "10 uur", total6: "€2.260", total12: "€2.170", label: "Startpakket" },
                { hours: "20 uur", total6: "€3.020", total12: "€2.840", label: "Meest gekozen", highlight: true },
                { hours: "40 uur", total6: "€4.540", total12: "€4.180", label: "Maximale output" },
              ].map((pkg) => (
                <div
                  key={pkg.hours}
                  className={`rounded-md p-4 border text-center ${
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
                  <p className="font-display font-bold text-2xl mt-1">{pkg.hours}</p>
                  <p className="text-muted-foreground text-xs mt-1">/maand</p>
                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <p>6 mnd: <span className="text-foreground font-semibold">{pkg.total6}</span></p>
                    <p>12 mnd: <span className="text-foreground font-semibold">{pkg.total12}</span></p>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 italic">{pkg.label}</p>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground text-xs mt-4 text-center">
              Minimale commitment: 6 maanden
            </p>
          </motion.div>
        </div>

        {/* Add-ons split by stream */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 lg:ml-2">
              <Users className="w-4 h-4 text-primary" />
              <p className="text-xs font-display font-semibold text-muted-foreground tracking-[0.15em] uppercase">
                Add-ons: Recruitment
              </p>
            </div>
            {recruitmentAddOns.map((addon, i) => (
              <motion.div
                key={addon.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="card-gradient border border-glow rounded-lg p-6 hover:border-primary/30 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Plus className="w-4 h-4 text-primary group-hover:rotate-90 transition-transform" />
                  <h3 className="font-display font-bold text-sm">{addon.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  {addon.description}
                </p>
                <span className="text-xs font-display font-semibold text-primary">
                  {addon.price}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 lg:ml-2">
              <Briefcase className="w-4 h-4 text-primary" />
              <p className="text-xs font-display font-semibold text-muted-foreground tracking-[0.15em] uppercase">
                Add-ons: Klantwerving
              </p>
            </div>
            {leadsAddOns.map((addon, i) => (
              <motion.div
                key={addon.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="card-gradient border border-glow rounded-lg p-6 hover:border-primary/30 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Plus className="w-4 h-4 text-primary group-hover:rotate-90 transition-transform" />
                  <h3 className="font-display font-bold text-sm">{addon.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  {addon.description}
                </p>
                <span className="text-xs font-display font-semibold text-primary">
                  {addon.price}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mt-8 card-gradient border border-dashed border-primary/20 rounded-lg p-6 text-center"
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
