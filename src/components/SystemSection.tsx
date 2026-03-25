import { motion } from "framer-motion";
import { Settings, Brain, MessageSquare, Target } from "lucide-react";

const layers = [
  {
    icon: Settings,
    number: "01",
    title: "Infrastructuur",
    description: "Subdomein-architectuur, mailbox-verdeling, LinkedIn-automatisering en CRM-integratie. Alles veilig voor uw domeinreputatie.",
  },
  {
    icon: Brain,
    number: "02",
    title: "Intelligence",
    description: "Ideale profielen in kaart brengen en signalen monitoren: functiewijzigingen, bedrijfsontwikkelingen, websitebezoek.",
  },
  {
    icon: MessageSquare,
    number: "03",
    title: "Betrokkenheid",
    description: "Persoonlijke mix van e-mail en LinkedIn met 6 tot 8 contactmomenten. Natuurlijk, rustig en op het juiste moment.",
  },
  {
    icon: Target,
    number: "04",
    title: "Kwalificatie",
    description: "Intent-scoring en handmatige kwalificatie. Alleen gesprekken die ertoe doen landen in uw agenda.",
  },
];

const SystemSection = () => {
  return (
    <section id="hoe-het-werkt" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Het 4-Laags Systeem
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Gebouwd voor
            <br />
            <span className="text-gradient">voorspelbaarheid.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.number}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-gradient border border-glow rounded-lg p-8 group hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-primary font-display font-bold text-sm">{layer.number}</span>
                <layer.icon className="w-5 h-5 text-primary mt-0.5" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3">{layer.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{layer.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SystemSection;
