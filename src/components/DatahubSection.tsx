import { motion } from "framer-motion";
import { Database, Brain, RefreshCw, Lock, MessageCircleQuestion, ShieldCheck, Cpu, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import datahubScreenshot from "@/assets/datahub-screenshot.png";

const features = [
  {
    icon: MessageCircleQuestion,
    title: "Stel direct vragen aan uw data",
    description: "Welke doelgroep converteert het best? Welk kanaal levert de meeste gesprekken op? Uw commerciële data geeft het antwoord.",
  },
  {
    icon: Database,
    title: "Alle data op één plek",
    description: "Contacthistorie, campagneresultaten, signalen en kwalificatiedata gebundeld in uw eigen omgeving.",
  },
  {
    icon: Brain,
    title: "AI Context Centrum",
    description: "Elk gesprek, signaal en resultaat bouwt context op. Hoe langer het draait, hoe slimmer uw AI-modellen sturen en personaliseren.",
  },
  {
    icon: ShieldCheck,
    title: "AI Governance ingebouwd",
    description: "Volledige controle over welke data AI mag gebruiken. Transparante besluitvorming, audittrails en GDPR-conforme dataverwerking.",
  },
  {
    icon: Cpu,
    title: "Klaar voor full AI Automation",
    description: "De eerste stappen naar veilige AI-automatisering. Van scoring tot opvolging: bouw gecontroleerd op richting autonome workflows.",
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
            Ons SaaS Metadataplatform
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Datahub.
            <br />
            <span className="text-gradient">Uw commerciële geheugen.</span>
          </h2>
          <p className="text-muted-foreground mt-6 text-lg leading-relaxed max-w-xl">
            Wij bouwen met processen en automation. De context die ontstaat stelt u in staat om nog verder met AI te werken.
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
