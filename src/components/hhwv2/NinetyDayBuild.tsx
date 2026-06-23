import { motion } from "framer-motion";
import { Database, Radio, PlayCircle, ArrowRight } from "lucide-react";
import ConnectorFlow from "./ConnectorFlow";

const PHASES = [
  {
    n: "1",
    phase: "Fase 1",
    title: "Data",
    sub: "Wie en waarom.",
    icon: Database,
    weeks: "Week 1 tot 3",
    bullets: ["Schone account- en contactdata", "ICP en marktmapping", "Verrijking + scoring"],
    mock: (
      <div className="space-y-2">
        {[
          { c: "Acme Robotics", s: 92 },
          { c: "Globex Tooling", s: 54 },
          { c: "Initech Labs", s: 88 },
        ].map((r) => (
          <div key={r.c} className="flex items-center justify-between p-2.5 rounded-md border border-primary/20 bg-background/40 text-xs">
            <span className="text-foreground/80">{r.c}</span>
            <span className="font-display font-bold text-primary">{r.s}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    n: "2",
    phase: "Fase 2",
    title: "Signaal",
    sub: "Wanneer te handelen.",
    icon: Radio,
    weeks: "Week 3 tot 7",
    bullets: ["10 tot 15 live signalen, gescoord", "CRM-routering + alerts", "Resultaten loopen terug"],
    mock: (
      <div className="space-y-2">
        {["Funding", "Nieuwe hire", "Website", "Job change"].map((l) => (
          <div key={l} className="flex items-center gap-2 p-2.5 rounded-md border border-primary/20 bg-background/40 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-foreground/80">{l}</span>
            <span className="ml-auto text-[9px] font-display font-semibold tracking-wider uppercase text-primary/60">live</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    n: "3",
    phase: "Fase 3",
    title: "Plays",
    sub: "Wat er gebeurt.",
    icon: PlayCircle,
    weeks: "Week 7 tot 12",
    bullets: ["Play-bibliotheek op jouw maat", "4 tot 6 plays gebouwd", "Dashboards + overdracht"],
    mock: (
      <div className="space-y-2 text-xs">
        {[
          { k: "Signaal", v: "Champion vertrok" },
          { k: "Score", v: "Fit nieuw account" },
          { k: "Run", v: "Warme sequence" },
          { k: "Resultaat", v: "Afspraak geboekt" },
        ].map((r) => (
          <div key={r.k} className="flex items-center justify-between p-2.5 rounded-md border border-primary/20 bg-background/40">
            <span className="text-[10px] font-display font-semibold tracking-[0.16em] uppercase text-primary/70">{r.k}</span>
            <span className="text-foreground/85">{r.v}</span>
          </div>
        ))}
      </div>
    ),
  },
];

const NinetyDayBuild = () => {
  return (
    <section id="90dagen" className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            05 / De 90-dagen build
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Bouw het fundament
            <br />
            <span className="text-gradient">in 90 dagen.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-5">
            De B2B Engine is de voordeur. Drie fases zetten het fundament neer waar je team mee schaalt.
          </p>
        </div>

        <ConnectorFlow className="grid md:grid-cols-3 gap-4 md:gap-6">
          {PHASES.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="cf-node card-gradient border-glow rounded-2xl p-6 md:p-7 flex flex-col"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="w-10 h-10 rounded-lg border border-primary/30 bg-card flex items-center justify-center">
                  <p.icon className="w-5 h-5 text-primary" strokeWidth={1.6} />
                </span>
                <span className="font-display font-bold text-3xl text-gradient">{p.n}</span>
              </div>
              <p className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-primary/80 mb-1">
                {p.phase}
              </p>
              <h3 className="font-display font-bold text-2xl mb-1">{p.title}</h3>
              <p className="text-sm text-muted-foreground mb-5 italic">{p.sub}</p>

              <div className="mb-5">{p.mock}</div>

              <ul className="space-y-1.5 mb-5">
                {p.bullets.map((b) => (
                  <li key={b} className="text-sm text-foreground/80 flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-primary mt-1 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-auto text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-primary border-t border-primary/15 pt-4">
                {p.weeks}
              </p>
            </motion.div>
          ))}
        </ConnectorFlow>
      </div>
    </section>
  );
};

export default NinetyDayBuild;