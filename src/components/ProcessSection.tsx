import { motion } from "framer-motion";

const steps = [
  {
    phase: "Week 1-2",
    title: "Setup & Infrastructuur",
    items: [
      "ICP-mapping voor elke stroom",
      "Subdomein-architectuur opzetten",
      "CRM-integratie & dashboards",
      "LinkedIn-automatisering activeren",
    ],
  },
  {
    phase: "Week 3-4",
    title: "Campagne Launch",
    items: [
      "Signaal-databases activeren",
      "Eerste outreach-sequenties live",
      "A/B tests op messaging",
      "Monitoring & optimalisatie",
    ],
  },
  {
    phase: "Maand 2+",
    title: "Schaal & Optimaliseer",
    items: [
      "Pipeline-analyse & bijsturing",
      "Nurturing van warme contacten",
      "Nieuwe stromen activeren",
      "Engagement-uren opschalen",
    ],
  },
];

const ProcessSection = () => {
  return (
    <section id="systeem" className="py-32 relative">
      <div className="absolute inset-0 glow-bg pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center max-w-2xl mx-auto"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Van Setup tot Resultaat
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            In 4 weken
            <br />
            <span className="text-gradient">operationeel.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.phase}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="card-gradient border border-glow rounded-lg p-8 hover:border-primary/30 transition-colors relative"
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
