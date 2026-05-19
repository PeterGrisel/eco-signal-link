import { motion } from "framer-motion";
import {
  Database,
  Brain,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Lock,
  MessageCircleQuestion,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { trackCTA } from "@/lib/tracking";
import { COPY } from "@/content/copy";

const features = [
  {
    icon: MessageCircleQuestion,
    title: "Stel vragen aan uw data",
    description: "Welke doelgroep levert de meeste klanten? Welk kanaal werkt? Uw data geeft het antwoord.",
  },
  {
    icon: Database,
    title: "Alle data op één plek",
    description: "Contacten, campagnes, signalen en resultaten. Gebundeld in uw eigen omgeving.",
  },
  {
    icon: Brain,
    title: "AI wordt steeds slimmer",
    description: "Elk gesprek voegt context toe. Hoe langer het draait, hoe beter de AI werkt.",
  },
  {
    icon: ShieldCheck,
    title: "U bepaalt wat AI mag zien",
    description: "Volledige controle over welke data AI gebruikt. Transparant, veilig en GDPR-proof.",
  },
  {
    icon: Cpu,
    title: "Klaar voor automatisering",
    description: "Van scoring tot opvolging. Bouw stap voor stap richting automatische workflows.",
  },
  {
    icon: Lock,
    title: "Alles blijft van u",
    description: "Geen lock-in. De data, inzichten en modellen zijn van u. Altijd.",
  },
];

const summaryBullets = [
  "Eén bron van waarheid voor sales en marketing",
  "Realtime monitoring op datakwaliteit",
  "Audit trails en compliance ingebakken",
  "Naadloze koppeling met uw bestaande systemen",
];

const DatahubSection = () => {
  return (
    <section id="datahub" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 glow-bg pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary)/0.06),transparent_60%)]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
            <Database className="w-4 h-4" />
            <span className="text-sm font-medium">Dataplatform inbegrepen</span>
          </div>

          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-5">
            Aangedreven door{" "}
            <span className="text-gradient">Datahub</span>
          </h2>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Elke groeimachine die wij bouwen draait op Datahub. Een gegoverneerd dataplatform waarmee uw AI-investering staat op een solide fundament.
          </p>
        </motion.div>

        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card-gradient border border-glow rounded-2xl p-6 md:p-10 mb-12 md:mb-16"
        >
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h3 className="font-display font-bold text-2xl md:text-3xl mb-4">
                Fundament voor intelligentie
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Datahub levert AI-ready infrastructuur met Master Data Management, governance en redenerende agents. Van ruwe data naar bruikbare inzichten via een gestructureerde cyclus.
              </p>
              <ul className="space-y-3">
                {summaryBullets.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -5 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="flex items-center gap-3 text-sm md:text-base"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Code preview */}
            <div className="bg-background/60 rounded-xl p-5 md:p-6 font-mono text-sm border border-border/40">
              <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
                <span className="ml-2 text-xs">datahub.config.ts</span>
              </div>
              <pre className="text-xs md:text-sm overflow-x-auto leading-relaxed">
                <code>
                  <span className="text-primary">await</span>{" "}
                  <span className="text-foreground">rebelforce</span>
                  <span className="text-muted-foreground">.</span>
                  <span className="text-primary">intelligence</span>
                  <span className="text-muted-foreground">{"({"}</span>
                  {"\n"}
                  {"  "}<span className="text-primary/80">datahub</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-foreground">"governed"</span>
                  <span className="text-muted-foreground">,</span>
                  {"\n"}
                  {"  "}<span className="text-primary/80">mdm</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-foreground">"enabled"</span>
                  <span className="text-muted-foreground">,</span>
                  {"\n"}
                  {"  "}<span className="text-primary/80">aiReady</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-foreground">true</span>
                  <span className="text-muted-foreground">,</span>
                  {"\n"}
                  {"  "}<span className="text-primary/80">reasoning</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-foreground">"autonomous"</span>
                  {"\n"}
                  <span className="text-muted-foreground">{"});"}</span>
                </code>
              </pre>
            </div>
          </div>
        </motion.div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="group card-gradient border border-glow rounded-2xl p-6 hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
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
              Meer weten over Datahub
              <ArrowRight className="w-4 h-4 ml-2" />
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
