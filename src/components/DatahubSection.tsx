import { motion } from "framer-motion";
import { Database, Brain, RefreshCw, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Database,
    title: "Alle data op één plek",
    description: "Contacthistorie, campagneresultaten, signalen en kwalificatiedata gebundeld in uw eigen omgeving.",
  },
  {
    icon: Brain,
    title: "AI-context voor uw processen",
    description: "Het systeem leert van elke interactie. Hoe langer het draait, hoe gerichter de output.",
  },
  {
    icon: RefreshCw,
    title: "Doelgericht automatiseren",
    description: "Gebruik opgebouwde context om vervolgacties, nurturing en scoring volledig te automatiseren.",
  },
  {
    icon: Lock,
    title: "Volledig in uw eigendom",
    description: "Geen vendor lock-in. De data, inzichten en modellen blijven van u, ongeacht de samenwerking.",
  },
];

const DatahubSection = () => {
  return (
    <section id="datahub" className="py-32 relative">
      <div className="absolute inset-0 glow-bg pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Datahub
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Uw eigen
            <br />
            <span className="text-gradient">AI-contextcentrum.</span>
          </h2>
          <p className="text-muted-foreground mt-6 text-lg leading-relaxed max-w-xl">
            Elk gesprek, elk signaal en elke campagne bouwt context op. Die context slaan we op in uw omgeving, zodat u steeds slimmer kunt sturen en automatiseren.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-gradient border border-glow rounded-lg p-8 hover:border-primary/30 transition-colors group"
            >
              <feature.icon className="w-8 h-8 text-primary mb-5 group-hover:scale-110 transition-transform" />
              <h3 className="font-display font-bold text-xl mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Button variant="heroOutline" size="lg" asChild>
            <a href="https://app.usemotion.com/meet/Rebel-Force/meeting" target="_blank" rel="noopener noreferrer">
              Meer weten over Datahub →
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default DatahubSection;
