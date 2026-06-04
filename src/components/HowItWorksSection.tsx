import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Compass,
  Brain,
  Layers,
  Calculator,
  Filter,
  Send,
  Route,
  LineChart,
  ArrowRight,
  BookOpenCheck,
} from "lucide-react";
import { COPY } from "@/content/copy";

const stepIcons = [Compass, Brain, Filter, Calculator, Layers, Send, Route, LineChart];

const PHASES = ["Fundament", "Fundament", "Doelgroep", "Doelgroep", "Activatie", "Activatie", "Sales", "Optimalisatie"] as const;

const steps = COPY.methode.layers.map((l, i) => ({
  n: l.number,
  phase: PHASES[i],
  icon: stepIcons[i],
  title: l.title,
  desc: l.line,
  output: l.output,
}));

interface HowItWorksSectionProps {
  accent?: string; // custom brand accent (hex). When set, overrides primary tokens.
}

const HowItWorksSection = ({ accent }: HowItWorksSectionProps = {}) => {
  const accentStyle = accent ? { color: accent } : undefined;
  const accentBorder = accent ? { borderColor: `${accent}55` } : undefined;
  const accentNumberStyle = accent
    ? { color: accent, WebkitTextFillColor: accent, backgroundImage: "none" }
    : undefined;
  const accentPhaseStyle = accent ? { color: `${accent}CC` } : undefined;
  const accentOutputStyle = accent
    ? { color: `${accent}CC`, borderColor: `${accent}33` }
    : undefined;
  return (
    <section id="proces" className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 max-w-2xl mx-auto text-center"
        >
          <p
            className="inline-flex items-center justify-center gap-2 text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4 w-full"
            style={accentStyle}
          >
            <BookOpenCheck className="w-4 h-4" strokeWidth={1.8} />
            Het Playbook-systeem
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-tight">
            Acht playbooks.
            <br />
            <span className="text-gradient" style={accent ? { backgroundImage: "none", WebkitTextFillColor: accent, color: accent } : undefined}>Eén werkend groeisysteem.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-6">
            Elke fase is een playbook dat in uw eigen tools draait.
            Samen vormen ze één werkend groeisysteem dat blijft staan.
          </p>
        </motion.div>

        {/* 8 playbooks in raster (zelfde stijl als Groeistack) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="card-gradient border-glow rounded-2xl p-5 md:p-6 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span
                  className="w-11 h-11 rounded-xl border border-primary/30 bg-card flex items-center justify-center"
                  style={accentBorder}
                >
                  <s.icon className="w-5 h-5 text-primary" strokeWidth={1.6} style={accentStyle} />
                </span>
                <span
                  className="font-display font-bold text-3xl text-gradient leading-none"
                  style={accentNumberStyle}
                >
                  {s.n}
                </span>
              </div>
              <span
                className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-primary/80"
                style={accentPhaseStyle}
              >
                Playbook · {s.phase}
              </span>
              <h3 className="font-display font-bold text-lg leading-tight">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
              <p
                className="text-xs text-primary/80 leading-relaxed border-t border-primary/15 pt-3 mt-auto"
                style={accentOutputStyle}
              >
                {s.output}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Link naar de volledige methode */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mt-10 text-center"
        >
          <Link
            to="/playbooks"
            className="inline-flex items-center gap-2 font-medium text-primary hover:gap-3 transition-all"
            style={accentStyle}
          >
            Bekijk alle playbooks in detail
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
