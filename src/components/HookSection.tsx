import { motion } from "framer-motion";
import { Zap, Shield, Target } from "lucide-react";

const hooks = [
  {
    icon: Target,
    title: "Signaal-gestuurd prospecten",
    description: "Wij benaderen alleen bedrijven die nu koopsignalen afgeven. Geen koude lijsten.",
  },
  {
    icon: Zap,
    title: "Volledig geautomatiseerd systeem",
    description: "Outreach, opvolging en kwalificatie draaien op autopilot. U ontvangt alleen warme gesprekken.",
  },
  {
    icon: Shield,
    title: "Klanten, recruitment en partners",
    description: "Eén systeem voor meerdere groeistromen. Van nieuwe klanten tot talent en partnerships.",
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
