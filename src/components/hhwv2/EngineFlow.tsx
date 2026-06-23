import { motion } from "framer-motion";
import {
  TrendingUp,
  UserPlus,
  MousePointerClick,
  Users,
  Layers,
  Target,
  Sparkles,
  Database,
  BarChart3,
  CheckCircle2,
  Workflow,
  Mail,
  PhoneCall,
  Megaphone,
  ListChecks,
  Bell,
} from "lucide-react";

const SOURCES = [
  { label: "Websiteactiviteit", icon: MousePointerClick },
  { label: "CRM-data", icon: Database },
  { label: "Funding-nieuws", icon: TrendingUp },
  { label: "Hiring & job changes", icon: UserPlus },
  { label: "LinkedIn-engagement", icon: Users },
  { label: "Tech-stack signalen", icon: Layers },
];

const STEPS = [
  { label: "Clean", sub: "dedupliceer & normaliseer", icon: Sparkles },
  { label: "Enrich", sub: "waterfall verrijking", icon: Database },
  { label: "Score", sub: "fit + signalen gestapeld", icon: BarChart3 },
  { label: "Mens beslist", sub: "akkoord / negeer", icon: CheckCircle2 },
  { label: "Route", sub: "naar de juiste play", icon: Workflow },
];

const ROUTED = [
  { n: "1", label: "Accountlijst gebouwd", icon: ListChecks },
  { n: "2", label: "Sequence gestart", icon: Mail },
  { n: "3", label: "Belwachtrij klaar", icon: PhoneCall },
  { n: "4", label: "Ads-audience gesynct", icon: Megaphone },
  { n: "5", label: "CRM-taak aangemaakt", icon: Target },
  { n: "6", label: "Owner genotificeerd", icon: Bell },
];

const EngineFlow = () => {
  return (
    <section id="engine" className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            04 / De B2B Engine
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Signalen worden
            <br />
            <span className="text-gradient">geroute acties.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-5">
            Echte signalen uit jouw tools. Schoongemaakt, gescoord en gestapeld. Een mens beoordeelt wat ertoe doet. De rest gaat in plays.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-4 md:gap-6 items-stretch">
          {/* Sources */}
          <div className="lg:col-span-3 space-y-2">
            <p className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-primary mb-3">
              Bronnen
            </p>
            {SOURCES.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg border border-primary/20 bg-card/60"
              >
                <s.icon className="w-4 h-4 text-primary shrink-0" strokeWidth={1.6} />
                <span className="text-sm text-foreground/90">{s.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Engine */}
          <div className="lg:col-span-5 relative">
            <div className="card-gradient border-glow rounded-2xl p-6 md:p-7 h-full shadow-[0_0_60px_hsl(var(--primary)/0.25)]">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-primary">
                  De B2B Engine
                </span>
                <span className="inline-flex items-center gap-2 text-[10px] font-display font-semibold text-primary/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  live · routeert
                </span>
              </div>
              <div className="space-y-2.5">
                {STEPS.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                    className="flex items-center gap-4 p-3.5 rounded-lg border border-primary/30 bg-background/50"
                  >
                    <span className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/40 flex items-center justify-center shrink-0">
                      <s.icon className="w-4 h-4 text-primary" strokeWidth={1.7} />
                    </span>
                    <div className="flex-1">
                      <p className="font-display font-semibold text-sm">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.sub}</p>
                    </div>
                    <span className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-primary/60">
                      0{i + 1}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Routed */}
          <div className="lg:col-span-4 space-y-2">
            <p className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-primary mb-3">
              Geroute acties
            </p>
            {ROUTED.map((r, i) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.06 }}
                className="flex items-center gap-3 p-3 rounded-lg border border-primary/20 bg-card/60"
              >
                <span className="w-7 h-7 rounded-md border border-primary/30 bg-primary/5 flex items-center justify-center text-[10px] font-display font-bold text-primary shrink-0">
                  {r.n}
                </span>
                <r.icon className="w-4 h-4 text-primary/80 shrink-0" strokeWidth={1.6} />
                <span className="text-sm text-foreground/90 flex-1">{r.label}</span>
                <span className="text-[9px] font-display font-semibold tracking-[0.18em] uppercase text-primary/60">
                  geroute
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EngineFlow;