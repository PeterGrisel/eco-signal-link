import { motion } from "framer-motion";
import { ArrowRight, RefreshCw, Send } from "lucide-react";

const steps = [
  {
    phase: "Week 1 tot 2",
    title: "Analyse en opzet",
    items: [
      "Uw ideale klant bepalen",
      "De juiste tools kiezen",
      "E-mail en LinkedIn klaarzetten",
      "CRM koppelen en dashboards inrichten",
    ],
  },
  {
    phase: "Week 3 tot 4",
    title: "Eerste campagnes live",
    items: [
      "Signalen activeren",
      "Eerste berichten versturen",
      "Testen welke aanpak het beste werkt",
      "Resultaten bijhouden en bijsturen",
    ],
  },
  {
    phase: "Maand 2 en verder",
    title: "Opschalen",
    items: [
      "Resultaten analyseren en verbeteren",
      "Warme contacten opvolgen",
      "Nieuwe doelgroepen toevoegen",
      "Meer uren inzetten waar het werkt",
    ],
  },
];

const deliveryModels = [
  {
    icon: Send,
    title: "Done-for-you",
    subtitle: "Wij doen het voor u",
    description:
      "U focust op gesprekken voeren. Wij runnen het systeem, elke dag. Alsof u een heel team heeft, zonder de kosten.",
    tags: ["Dagelijks beheer", "Elke maand beter", "Wij kwalificeren voor u"],
  },
  {
    icon: RefreshCw,
    title: "Build & Transfer",
    subtitle: "Wij bouwen, u neemt over",
    description:
      "Wij zetten alles op, trainen uw team en dragen het over. U houdt alle tools en data zelf in handen.",
    tags: ["Volledige overdracht", "Training voor uw team", "Handleiding en draaiboek"],
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
            Van Setup tot Resultaat
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            In 4 weken
            <br />
            <span className="text-gradient">operationeel.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-16 md:mb-24">
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
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-primary/40" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Delivery Models */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center max-w-2xl mx-auto"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Uw keuze
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight">
            Wij beheren, of
            <br />
            <span className="text-gradient">u doet het zelf.</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Geen verplichtingen. Geen eigen platform. Het systeem draait op uw tools. Wij passen in wat werkt.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {deliveryModels.map((model, i) => (
            <motion.div
              key={model.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-gradient border border-glow rounded-lg p-6 md:p-10 hover:border-primary/30 transition-colors group"
            >
              <model.icon className="w-8 h-8 text-primary mb-5 group-hover:scale-110 transition-transform" />
              <div className="mb-4">
                <h3 className="font-display font-bold text-2xl">{model.title}</h3>
                <p className="text-primary font-display text-sm font-semibold mt-1">{model.subtitle}</p>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">{model.description}</p>
              <div className="flex flex-wrap gap-2">
                {model.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
