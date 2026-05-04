import { motion } from "framer-motion";
import { Database, Brain, RefreshCw, Lock, MessageCircleQuestion, ShieldCheck, Cpu, Workflow, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { trackCTA } from "@/lib/tracking";
import datahubScreenshot from "@/assets/datahub-screenshot.png";

const features = [
  {
    icon: MessageCircleQuestion,
    title: "Stel vragen aan uw data",
    description: "Welke doelgroep levert de meeste klanten? Welk kanaal werkt het best? Uw data geeft het antwoord.",
  },
  {
    icon: Database,
    title: "Alle data op één plek",
    description: "Contacten, campagnes, signalen en resultaten. Alles gebundeld in uw eigen omgeving.",
  },
  {
    icon: Brain,
    title: "AI wordt steeds slimmer",
    description: "Elk gesprek en resultaat voegt context toe. Hoe langer het draait, hoe beter de AI werkt.",
  },
  {
    icon: ShieldCheck,
    title: "U bepaalt wat AI mag zien",
    description: "Volledige controle over welke data AI gebruikt. Transparant, veilig en GDPR-proof.",
  },
  {
    icon: Cpu,
    title: "Klaar voor AI-automatisering",
    description: "Van scoring tot opvolging: bouw stap voor stap richting automatische workflows.",
  },
  {
    icon: RefreshCw,
    title: "Automatisch opvolgen",
    description: "Gebruik uw data om vervolgacties en opvolging automatisch te laten lopen.",
  },
  {
    icon: Lock,
    title: "Alles blijft van u",
    description: "Geen verplichtingen. De data, inzichten en modellen zijn van u. Altijd.",
  },
];

const DatahubSection = () => {
  return (
    <section id="datahub" className="py-16 md:py-32 relative">
      <div className="absolute inset-0 glow-bg pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Ons dataplatform
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Datahub.
            <br />
            <span className="text-gradient">Uw commercieel geheugen.</span>
          </h2>
          <p className="text-muted-foreground mt-6 text-lg leading-relaxed max-w-xl">
            Alle data uit uw campagnes op één plek. Zo kunt u met AI steeds slimmer werken.
          </p>
        </motion.div>

        {/* Screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16 rounded-lg border border-glow overflow-hidden shadow-2xl shadow-primary/5"
        >
          <img
            src={datahubScreenshot}
            alt="Datahub platform interface"
            className="w-full h-auto"
            loading="lazy"
          />
        </motion.div>
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-12">
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
          className="text-center space-y-6"
        >
          <Button variant="heroOutline" size="lg" asChild>
            <a
              href="https://app.usemotion.com/meet/Rebel-Force/meeting"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTA("Datahub — Meer weten", "https://app.usemotion.com/meet/Rebel-Force/meeting")}
            >
              Meer weten over Datahub →
            </a>
          </Button>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/solutions/weg-uit-excel" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
              Weg uit Excel <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-border">·</span>
            <Link to="/solutions/data-gedreven-sales" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
              Data-gedreven sales <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-border">·</span>
            <Link to="/solutions/versnipperde-tools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
              Versnipperde tools <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DatahubSection;
