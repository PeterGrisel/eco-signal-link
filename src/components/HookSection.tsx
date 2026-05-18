import { motion } from "framer-motion";
import { Hand, AlarmClock, EyeOff } from "lucide-react";

const hooks = [
  {
    icon: Hand,
    title: "Handmatig werk dat blijft hangen",
    description: "Offertes, opvolging en data-invoer slokken uren op. Wij brengen het in kaart en automatiseren wat herhaalt.",
  },
  {
    icon: AlarmClock,
    title: "Reactief in plaats van vooruit",
    description: "Uw team reageert op binnenkomende vragen, maar mist de signalen die er écht toe doen. Dat keren we om.",
  },
  {
    icon: EyeOff,
    title: "Signalen die u nu niet ziet",
    description: "Klanten geven hints af: een reparatie, een wisseling, een groei. Wij vangen ze op en zetten ze om in omzet.",
  },
];

const HookSection = () => {
  return (
    <section className="py-14 md:py-20 border-b border-border/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {hooks.map((hook, i) => (
            <motion.div
              key={hook.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl border border-border/50 bg-card p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <hook.icon className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-display font-semibold text-foreground text-lg mb-2">
                {hook.title}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {hook.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HookSection;
