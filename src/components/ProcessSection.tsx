import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CtaLink from "@/components/CtaLink";
import { COPY } from "@/content/copy";

const steps = [
  {
    phase: "Week 0",
    title: "Nulmeting",
    items: [
      "Sales- en serviceproces in kaart",
      "Quick wins identificeren",
      "Uw ideale klant bepalen",
      "De juiste tools kiezen",
    ],
  },
  {
    phase: "Week 1 tot 2",
    title: "Opzet",
    items: [
      "Infrastructuur inrichten op uw ICP",
      "CRM koppelen en dashboards inrichten",
      "Signalen en doelgroepen activeren",
      "Eerste engagement voorbereiden",
    ],
  },
  {
    phase: "Week 3 tot 4",
    title: "Eerste campagnes live",
    items: [
      "Signalen activeren",
      "Engagement starten via het juiste kanaal",
      "Testen welke aanpak het beste werkt",
      "Resultaten bijhouden en bijsturen",
    ],
  },
  {
    phase: "Maand 2 en verder",
    title: "Opschalen",
    items: [
      "Resultaten analyseren en verbeteren",
      "Warme signalen samen kwalificeren",
      "Nieuwe doelgroepen en signalen toevoegen",
      "Meer uren inzetten waar het werkt",
    ],
  },
];

const ProcessSection = () => {
  return (
    <section id="systeem" className="py-16 md:py-32 relative">
      <div className="absolute inset-0 glow-bg pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center max-w-2xl mx-auto"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            {COPY.process.eyebrow}
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            In 4 weken
            <br />
            <span className="text-gradient">live.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-24">
          {steps.map((step, i) => (
            <motion.div
              key={step.phase}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-gradient border border-glow rounded-lg p-6 md:p-8 hover:border-primary/30 transition-colors relative"
            >
              <span className="text-primary font-display font-bold text-xs tracking-[0.2em] uppercase">
                {step.phase}
              </span>
              <h3 className="font-display font-bold text-xl mt-3 mb-6">{step.title}</h3>
              <ul className="space-y-3">
                {step.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-muted-foreground text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {i < steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-primary/40" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA: samen bepalen */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h3 className="font-display font-bold text-xl md:text-2xl mb-3">
            {COPY.proposition.signalHeading}
          </h3>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {COPY.proposition.signalSubtext}
          </p>
          <Button variant="hero" size="lg" asChild>
            <CtaLink intent="nulmeting" location="Proces — Samen bepalen" />
          </Button>
        </motion.div>

        {/* Internal links to solutions */}
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
