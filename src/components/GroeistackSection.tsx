import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Radar, Database, Send, Workflow, Sparkles, BarChart3, ArrowRight } from "lucide-react";

const layers = [
  {
    icon: Radar,
    title: "Signalen & data",
    desc: "Intent- en koopsignalen plus actuele marktdata.",
  },
  {
    icon: Database,
    title: "Verrijking",
    desc: "Bedrijfs- en contactdata aangevuld en geverifieerd.",
  },
  {
    icon: Send,
    title: "Outreach",
    desc: "E-mail, LinkedIn en telefoon in één flow.",
  },
  {
    icon: Workflow,
    title: "CRM & pijplijn",
    desc: "Uw eigen CRM, strak ingericht. Bijvoorbeeld HubSpot.",
  },
  {
    icon: Sparkles,
    title: "AI & content",
    desc: "Personalisatie, video en content op schaal.",
  },
  {
    icon: BarChart3,
    title: "Dashboard & attributie",
    desc: "Eén bron van waarheid met lerende loops.",
  },
];

const GroeistackSection = () => {
  return (
    <section id="groeistack" className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 max-w-2xl"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            De Groeistack
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-tight">
            De beste tools.
            <br />
            <span className="text-gradient">Geïntegreerd in úw systemen.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-6">
            Wij zijn geen tool. Wij kennen de beste AI- en GTM-tools en smeden
            ze tot één werkend systeem, in uw eigen stack. Data en tools blijven
            van u.
          </p>
        </motion.div>

        {/* Stack-lagen */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {layers.map((l, i) => (
            <motion.div
              key={l.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="card-gradient border-glow rounded-2xl p-5 md:p-6 flex items-start gap-4 hover:border-primary/30 transition-colors"
            >
              <span className="shrink-0 w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <l.icon className="w-5 h-5 text-primary" strokeWidth={1.6} />
              </span>
              <div>
                <h3 className="font-display font-bold text-lg leading-tight mb-1">
                  {l.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {l.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sluit-regel + link naar de volledige Groeistack */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <Link
            to="/groeistack"
            className="inline-flex items-center gap-2 font-medium text-primary hover:gap-3 transition-all"
          >
            Bekijk de volledige Groeistack
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-sm text-muted-foreground">
            Geen lock-in. Uw stack, slimmer gemaakt.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default GroeistackSection;
