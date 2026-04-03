import { motion } from "framer-motion";
import { Zap, Shield, Target } from "lucide-react";

const hooks = [
  {
    icon: Target,
    title: "Altijd weten waar uw klant zit",
    description: "U weet precies waar uw volgende klant vandaan komt. Elke week scherper, elke maand meer resultaat.",
  },
  {
    icon: Zap,
    title: "Meer tijd voor wat telt",
    description: "Wij automatiseren de repetitieve taken zodat uw team zich volledig kan richten op klantcontact en groei.",
  },
  {
    icon: Shield,
    title: "Eén systeem, meerdere groeistromen",
    description: "Nieuwe klanten, talent én partners. Alles vanuit één geautomatiseerd systeem dat voor u draait.",
  },
];

const HookSection = () => {
  return (
    <section className="py-12 md:py-16 border-b border-border/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {hooks.map((hook, i) => (
            <motion.div
              key={hook.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <hook.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground text-base mb-1">
                  {hook.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {hook.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HookSection;
