import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Plus, Users, Briefcase } from "lucide-react";

const recruitmentAddOns = [
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
  {
    title: "Full Service Recruitment",
    description: "Volledig recruitmentproces van outreach tot aanname. Geen maandelijkse kosten — alleen een succesfee.",
    price: "15% bruto jaarsalaris",
  },
];

const leadsAddOns = [
  {
    title: "Website & SEO-Optimalisatie",
    description: "Technische SEO tot conversiegerichte landingspagina's zodat prospects u organisch vinden.",
    price: "Prijs op aanvraag",
  },
  {
    title: "AI Avatar Video",
    description: "Gepersonaliseerde video-outreach via AI-avatar — schaalbaar als eerste contact of follow-up.",
    price: "Prijs op aanvraag",
  },
  {
    title: "META Ads Management",
    description: "Betaalde advertentiecampagnes op Meta-platformen als extra kanaal naast outbound.",
    price: "Prijs op aanvraag",
  },
];

const baseFeatures = [
  "Beide stromen actief (recruitment + leads)",
  "4-lagen systeemopzet & ICP-mapping",
  "Signaal-gebaseerde targeting",
  "Omnichannel outreach (6-8 touchpoints)",
  "Intent-scoring & kwalificatie",
  "2-wekelijkse rapportage",
  "Dedicated campagnemanager",
  "€0 opstartkosten",
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-32 relative">
      <div className="absolute inset-0 glow-bg pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
            Eén maandelijkse fee, gedeelde engagement-uren en stroom-specifieke add-ons die u naar behoefte activeert.
          </p>
        </motion.div>

        {/* Base package + engagement hours */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Base */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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

          {/* Engagement hours */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card-gradient border border-glow rounded-lg p-8 relative"
          >
            <div className="absolute -top-3 left-6">
              <span className="bg-secondary text-secondary-foreground text-xs font-display font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full border border-border">
                Engagement Uren
              </span>
            </div>

            <div className="mt-4 mb-6">
              <div className="flex items-baseline gap-1">
                <span className="font-display font-bold text-5xl">€67–€84</span>
                <span className="text-muted-foreground text-sm">/uur</span>
              </div>
              <p className="text-muted-foreground text-sm mt-2">
                Kwalificatie, personalisatie, omnichannel follow-up — voor beide stromen
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { period: "3 maanden", price: "€84/uur", discount: "" },
                { period: "6 maanden", price: "€76/uur", discount: "–10%" },
                { period: "12 maanden", price: "€67/uur", discount: "–20%" },
              ].map((tier) => (
                <div key={tier.period} className="flex items-center justify-between p-3 rounded-md bg-secondary/50 border border-border">
                  <span className="text-sm font-medium text-foreground">{tier.period}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-foreground">{tier.price}</span>
                    {tier.discount && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                        {tier.discount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-md bg-secondary/30 border border-border">
              <p className="text-xs font-display font-semibold text-primary tracking-[0.1em] uppercase mb-2">
                Voorbeeld — 20 uur bij 6 maanden
              </p>
              <div className="flex items-baseline gap-1">
                <span className="font-display font-bold text-xl">€3.020</span>
                <span className="text-muted-foreground text-xs">/maand totaal</span>
              </div>
              <p className="text-muted-foreground text-xs mt-1">
                €1.500 basis + €1.520 engagement (20 × €76)
              </p>
            </div>
          </motion.div>
        </div>

        {/* Add-ons split by stream */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recruitment add-ons */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 lg:ml-2">
              <Users className="w-4 h-4 text-primary" />
              <p className="text-xs font-display font-semibold text-muted-foreground tracking-[0.15em] uppercase">
                Add-ons — Recruitment
              </p>
            </div>
            {recruitmentAddOns.map((addon, i) => (
              <motion.div
                key={addon.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1 }}
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

          {/* Leads add-ons */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 lg:ml-2">
              <Briefcase className="w-4 h-4 text-primary" />
              <p className="text-xs font-display font-semibold text-muted-foreground tracking-[0.15em] uppercase">
                Add-ons — Klantwerving
              </p>
            </div>
            {leadsAddOns.map((addon, i) => (
              <motion.div
                key={addon.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1 }}
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
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 card-gradient border border-dashed border-primary/20 rounded-lg p-6 text-center"
        >
          <p className="text-muted-foreground text-sm">
            Verwachte output: <span className="text-foreground font-semibold">3-5 hooggekwalificeerde meetings per maand</span> — voor klanten én kandidaten.{" "}
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
