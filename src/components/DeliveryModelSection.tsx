import { motion } from "framer-motion";
import { Settings, Rocket, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackCTA } from "@/lib/tracking";

const DeliveryModelSection = () => {
  return (
    <section className="py-16 md:py-32 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Uw keuze
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
            Wij beheren de toolstack.
            <br />
            <span className="text-gradient">Jij betaalt voor resultaat.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Geen software om te implementeren. Geen IT-afdeling die toestemming
            moet geven. Geen licenties, geen koppelingen, geen onboarding-traject.
            Waar nodig krijg je van ons een login, verder hoef je niets te regelen.
          </p>
        </motion.div>

        {/* Two cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Build & Transfer */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="card-gradient border border-glow rounded-xl p-8 md:p-10 flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6">
              <Settings className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-2">Build &amp; Transfer</h3>
            <p className="text-primary font-display text-sm font-semibold mb-4">Capex · Jij wordt de beheerder</p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Voor wie zelf wilt beheren en alles in eigen hand wilt houden.
              Wij bouwen het op jouw tools, trainen je team en dragen over.
            </p>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                "Gebouwd op je eigen tools",
                "Training en handleiding voor je team",
                "Eenmalige investering",
                "Prijs altijd op aanvraag",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-muted-foreground/60 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button variant="outline" size="lg" asChild className="w-full">
              <a
                href="https://app.usemotion.com/meet/Rebel-Force/meeting"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCTA("Delivery — Build & Transfer", "https://app.usemotion.com/meet/Rebel-Force/meeting")}
              >
                Meer weten →
              </a>
            </Button>
          </motion.div>

          {/* Done-for-you */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative card-gradient border border-primary/30 rounded-xl p-8 md:p-10 flex flex-col"
          >
            {/* Popular badge */}
            <div className="absolute -top-3 right-6 bg-primary text-primary-foreground text-xs font-display font-semibold px-3 py-1 rounded-full tracking-wide uppercase">
              Meest gekozen
            </div>

            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Rocket className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-2">Done-for-you</h3>
            <p className="text-primary font-display text-sm font-semibold mb-4">Opex · Je stapt in en groeit</p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Wij kiezen de beste tools, richten alles in en beheren het dagelijks.
              Je krijgt afspraken in je agenda, zonder gedoe.
            </p>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                "Wij kiezen en koppelen de beste tools",
                "Dagelijks beheer en verbetering",
                "Geen technische kennis nodig",
                "Groeit mee zonder extra personeel",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button variant="hero" size="lg" asChild className="w-full">
              <a
                href="https://app.usemotion.com/meet/Rebel-Force/meeting"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCTA("Delivery — Done-for-you", "https://app.usemotion.com/meet/Rebel-Force/meeting")}
              >
                Plan een Demo <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </Button>
          </motion.div>
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-muted-foreground text-sm mt-10 max-w-xl mx-auto"
        >
          Welke tools het beste passen, verschilt per markt.
          Daarom kiezen de meeste klanten voor <span className="text-foreground font-medium">Done-for-you</span>: je stapt in, je ziet wat we doen, en je groeit.
        </motion.p>
      </div>
    </section>
  );
};

export default DeliveryModelSection;
