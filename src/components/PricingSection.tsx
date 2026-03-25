import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";

const addOns = [
  {
    title: "Extra Stroom",
    description: "Activeer een parallelle stroom — bijv. recruitment naast klantwerving",
    price: "Op aanvraag",
  },
  {
    title: "LinkedIn Automatisering",
    description: "Geautomatiseerde connectieverzoeken, profielbezoeken en DM-sequenties",
    price: "Op aanvraag",
  },
  {
    title: "CRM-integratie & Dashboarding",
    description: "Koppeling met uw bestaande CRM + real-time pipeline-inzicht",
    price: "Op aanvraag",
  },
  {
    title: "Domeinbescherming & Compliance",
    description: "Subdomein-architectuur, opwarmprotocollen en reputatiebewaking",
    price: "Op aanvraag",
  },
];

const baseFeatures = [
  "1 actieve prospecting-stroom",
  "4-lagen systeemopzet",
  "Signaal-gebaseerde targeting",
  "E-mail outreach (6-8 touchpoints)",
  "Intent-scoring & kwalificatie",
  "Maandelijkse rapportage",
  "Dedicated accountmanager",
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
            Modulair & Transparant
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Eén basis.
            <br />
            <span className="text-gradient">Uw configuratie.</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Start met het fundament en breid uit met de modules die passen bij uw groeidoelen.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6 items-start">
          {/* Base package */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 border border-primary/30 bg-primary/5 rounded-lg p-8 relative"
          >
            <div className="absolute -top-3 left-6">
              <span className="bg-primary text-primary-foreground text-xs font-display font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full">
                Fundament
              </span>
            </div>

            <div className="mt-4 mb-6">
              <div className="flex items-baseline gap-1">
                <span className="font-display font-bold text-5xl">€1.500</span>
                <span className="text-muted-foreground text-sm">/maand</span>
              </div>
              <p className="text-muted-foreground text-sm mt-2">
                Excl. BTW · Geen langetermijncontract vereist
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

            <div className="mb-4 p-4 rounded-md bg-secondary/50 border border-border">
              <p className="text-xs font-display font-semibold text-primary tracking-[0.1em] uppercase mb-1">
                Extra engagement-uren
              </p>
              <div className="flex items-baseline gap-1">
                <span className="font-display font-bold text-xl">€75</span>
                <span className="text-muted-foreground text-xs">/uur</span>
              </div>
              <p className="text-muted-foreground text-xs mt-1">
                Voor extra kwalificatie, opvolging of campagne-uitbreiding
              </p>
            </div>

            <Button variant="hero" size="lg" className="w-full" asChild>
              <a href="https://app.usemotion.com/meet/Rebel-Force/meeting" target="_blank" rel="noopener noreferrer">
                Plan een Demo →
              </a>
            </Button>
          </motion.div>

          {/* Add-ons grid */}
          <div className="lg:col-span-3 space-y-4">
            <p className="text-xs font-display font-semibold text-muted-foreground tracking-[0.15em] uppercase mb-2 lg:ml-2">
              Uitbreidingsmodules
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {addOns.map((addon, i) => (
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

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="card-gradient border border-dashed border-primary/20 rounded-lg p-6 text-center"
            >
              <p className="text-muted-foreground text-sm">
                Iets specifieks nodig? Wij bouwen op maat.{" "}
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
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
