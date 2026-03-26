import { motion } from "framer-motion";
import {
  Database,
  Brain,
  RefreshCw,
  Lock,
  MessageCircleQuestion,
  ShieldCheck,
  Cpu,
  Workflow,
  BookOpen,
  GitBranch,
  FileCheck,
  Search,
  Bot,
  FileText,
  Settings,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import datahubScreenshot from "@/assets/datahub-screenshot.png";

const coreModules = [
  {
    icon: BookOpen,
    title: "Business Glossary",
    description: "Eén gedeelde taal voor al uw commerciële data en definities.",
  },
  {
    icon: GitBranch,
    title: "Business Processes",
    description: "Breng uw processen in kaart en beheer ze centraal.",
  },
  {
    icon: Search,
    title: "Data Catalog",
    description: "Ontdek en documenteer al uw data-assets op één plek.",
  },
  {
    icon: FileCheck,
    title: "Data Contracts",
    description: "Waarborg datakwaliteit op schaal met heldere afspraken.",
  },
];

const capabilities = [
  {
    icon: Bot,
    title: "AI Assistant",
    description: "Stel vragen aan uw data en ontvang direct AI-gedreven inzichten.",
  },
  {
    icon: FileText,
    title: "Document Hub",
    description: "Gecentraliseerde documentatie voor uw hele commerciële operatie.",
  },
  {
    icon: Settings,
    title: "Workflows",
    description: "Goedkeurings- en reviewprocessen volledig geautomatiseerd.",
  },
];

const valueProps = [
  {
    icon: MessageCircleQuestion,
    title: "Stel direct vragen aan uw data",
    description:
      "Welke doelgroep converteert het best? Welk kanaal levert de meeste gesprekken op? Uw commerciële data geeft het antwoord.",
  },
  {
    icon: Brain,
    title: "AI Context Centrum",
    description:
      "Elk gesprek, signaal en resultaat bouwt context op. Hoe langer het draait, hoe slimmer uw AI-modellen sturen en personaliseren.",
  },
  {
    icon: ShieldCheck,
    title: "AI Governance ingebouwd",
    description:
      "Volledige controle over welke data AI mag gebruiken. Transparante besluitvorming, audittrails en GDPR-conforme dataverwerking.",
  },
  {
    icon: Cpu,
    title: "Klaar voor full AI Automation",
    description:
      "De eerste stappen naar veilige AI-automatisering. Van scoring tot opvolging: bouw gecontroleerd op richting autonome workflows.",
  },
  {
    icon: RefreshCw,
    title: "Doelgericht automatiseren",
    description:
      "Gebruik opgebouwde context om vervolgacties, nurturing en scoring volledig te automatiseren.",
  },
  {
    icon: Lock,
    title: "Volledig in uw eigendom",
    description:
      "Geen vendor lock-in. De data, inzichten en modellen blijven van u, ongeacht de samenwerking.",
  },
];

const ModuleCard = ({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: typeof Database;
  title: string;
  description: string;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.4, delay: index * 0.06 }}
    className="flex items-start gap-4 p-5 rounded-lg border border-glow card-gradient hover:border-primary/30 transition-colors group"
  >
    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div>
      <h3 className="font-display font-bold text-base mb-1">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const Datahub = () => {
  return (
    <div className="min-h-screen">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://b2bgroeimachine.io/" },
          { name: "Datahub", url: "https://b2bgroeimachine.io/datahub" },
        ]}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative">
        <div className="absolute inset-0 glow-bg pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
              Ons SaaS Metadataplatform
            </p>
            <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight leading-tight mb-6">
              Datahub.
              <br />
              <span className="text-gradient">Uw commerciële geheugen.</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mb-8">
              Centraliseer al uw commerciële data en AI-context in één platform.
              Wij bouwen met processen en automation — de context die ontstaat stelt u in
              staat om nog verder met AI te werken, zonder vendor lock-in.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" asChild>
                <a
                  href="https://app.usemotion.com/meet/Rebel-Force/meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Plan een Demo →
                </a>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <a href="#modules">Bekijk modules</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Screenshot */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="rounded-lg border border-glow overflow-hidden shadow-2xl shadow-primary/5"
          >
            <img
              src={datahubScreenshot}
              alt="Datahub platform interface — commercieel metadataplatform"
              className="w-full h-auto"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* Core Modules & Capabilities */}
      <section id="modules" className="py-16 md:py-24 relative">
        <div className="absolute inset-0 glow-bg pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Core Modules */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <p className="text-primary font-display font-semibold text-sm tracking-[0.15em] uppercase mb-2">
              Core Modules
            </p>
            <h2 className="font-display font-bold text-2xl md:text-4xl tracking-tight">
              Het fundament van uw dataplatform
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 mb-16">
            {coreModules.map((mod, i) => (
              <ModuleCard key={mod.title} {...mod} index={i} />
            ))}
          </div>

          {/* Capabilities */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <p className="text-primary font-display font-semibold text-sm tracking-[0.15em] uppercase mb-2">
              Capabilities
            </p>
            <h2 className="font-display font-bold text-2xl md:text-4xl tracking-tight">
              Intelligente tools bovenop uw data
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((cap, i) => (
              <ModuleCard key={cap.title} {...cap} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-12 max-w-2xl"
          >
            <p className="text-primary font-display font-semibold text-sm tracking-[0.15em] uppercase mb-2">
              Waarom Datahub
            </p>
            <h2 className="font-display font-bold text-2xl md:text-4xl tracking-tight">
              Van data naar commerciële impact
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {valueProps.map((prop, i) => (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="card-gradient border border-glow rounded-lg p-8 hover:border-primary/30 transition-colors group"
              >
                <prop.icon className="w-8 h-8 text-primary mb-5 group-hover:scale-110 transition-transform" />
                <h3 className="font-display font-bold text-xl mb-3">{prop.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{prop.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing callout */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="border border-primary/30 bg-primary/5 rounded-lg p-8 md:p-12 text-center max-w-2xl mx-auto"
          >
            <Database className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl md:text-3xl mb-3">
              Datahub toevoegen aan uw pakket
            </h2>
            <div className="flex items-baseline justify-center gap-1 mb-4">
              <span className="font-display font-bold text-4xl md:text-5xl">€500</span>
              <span className="text-muted-foreground text-sm">/maand</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Voeg Datahub toe aan uw bestaande service fee en centraliseer uw volledige
              commerciële data-infrastructuur.
            </p>
            <Button variant="hero" size="lg" asChild>
              <a
                href="https://app.usemotion.com/meet/Rebel-Force/meeting"
                target="_blank"
                rel="noopener noreferrer"
              >
                Plan een Demo →
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Datahub;
