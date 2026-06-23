import { motion } from "framer-motion";
import {
  Globe,
  Database,
  Briefcase,
  Linkedin,
  Cpu,
  CheckCircle2,
  PlayCircle,
  PhoneCall,
  Megaphone,
  ListChecks,
  Bell,
  Zap,
} from "lucide-react";

const SIGNALS = [
  { label: "Website-activiteit", icon: Globe },
  { label: "CRM-data", icon: Database },
  { label: "Funding news", icon: Briefcase },
  { label: "Hiring & job change", icon: ListChecks },
  { label: "LinkedIn engagement", icon: Linkedin },
  { label: "Tech-stack wijziging", icon: Cpu },
];

const ENGINE_STEPS = [
  { label: "Clean", meta: "DEDUPE · NORMALIZE" },
  { label: "Verrijken", meta: "WATERFALL" },
  { label: "Score", meta: "FIT · SIGNALEN" },
  { label: "Human in the loop", meta: "GOEDKEUREN / NEGEREN", accent: true },
  { label: "Route", meta: "NAAR DE PLAY" },
];

const ROUTED = [
  { label: "Accountlijst gebouwd", icon: ListChecks },
  { label: "Sequence gestart", icon: PlayCircle },
  { label: "Belwachtrij klaar", icon: PhoneCall },
  { label: "Ad audience gesynct", icon: Megaphone },
  { label: "CRM-taak aangemaakt", icon: CheckCircle2 },
  { label: "Owner genotificeerd", icon: Bell },
];

const ChipRow = ({ icon: Icon, label }: { icon: typeof Globe; label: string }) => (
  <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-card/60 backdrop-blur px-3 py-2.5">
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10">
      <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />
    </span>
    <span className="font-display font-semibold text-[12px] text-foreground leading-tight">
      {label}
    </span>
  </div>
);

const ExactRevenueEngine = () => (
  <section className="relative py-20 md:py-28 border-t border-primary/10 overflow-hidden">
    <div
      className="absolute inset-0 pointer-events-none opacity-60"
      style={{ background: "var(--gradient-glow)" }}
    />
    <div className="container mx-auto px-4 md:px-6 relative">
      <div className="max-w-3xl mb-12 md:mb-16">
        <p className="text-primary font-display font-semibold text-[11px] tracking-[0.28em] uppercase mb-4 font-mono">
          04 / De Revenue Engine
        </p>
        <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] mb-5">
          Signalen worden <span className="font-serif italic text-gradient">gerichte actie</span>.
        </h2>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          Echte signalen uit jouw tools. Opgeschoond, verrijkt en gescoord. Een mens keurt de juiste
          accounts goed en negeert de ruis. De rest gaat automatisch naar de juiste play.
        </p>
      </div>

      <div className="relative grid lg:grid-cols-[1fr_1.1fr_1fr] gap-6 md:gap-10 items-start">
        {/* Connector SVG — desktop only */}
        <svg
          className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="re-line-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="re-line-r" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          {/* Left: 6 signals -> engine convergence point (~35%, 50%) */}
          {Array.from({ length: 6 }).map((_, i) => {
            const y = 12 + i * 13.5;
            return (
              <path
                key={`l-${i}`}
                d={`M 22 ${y} C 30 ${y}, 30 50, 36 50`}
                fill="none"
                stroke="url(#re-line-l)"
                strokeWidth="0.35"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
          {/* Right: engine divergence (~65%, 50%) -> 6 routed steps */}
          {Array.from({ length: 6 }).map((_, i) => {
            const y = 12 + i * 13.5;
            return (
              <path
                key={`r-${i}`}
                d={`M 64 50 C 70 50, 70 ${y}, 78 ${y}`}
                fill="none"
                stroke="url(#re-line-r)"
                strokeWidth="0.35"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {/* COL 1 — Revenue Signals */}
        <div className="relative z-10">
          <p className="text-[10px] font-display font-semibold tracking-[0.28em] uppercase text-primary/80 mb-4 font-mono">
            Revenue signalen
          </p>
          <div className="space-y-2.5">
            {SIGNALS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <ChipRow icon={s.icon} label={s.label} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* COL 2 — Engine */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative z-10 rounded-2xl border border-primary/30 card-gradient p-6 md:p-7 shadow-[0_0_80px_-20px_hsl(var(--primary)/0.4)]"
        >
          <div className="text-center mb-6">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary/40 bg-primary/15 mb-3">
              <Zap className="h-6 w-6 text-primary" strokeWidth={1.8} />
            </span>
            <p className="font-display font-bold text-xl text-foreground">B2BGM Revenue Engine</p>
            <div className="mt-2 inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.22em] uppercase text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              Live · Routing
            </div>
          </div>

          <div className="border-t border-primary/15">
            {ENGINE_STEPS.map((step, i) => (
              <div
                key={step.label}
                className="flex items-center justify-between gap-4 py-3.5 border-b border-primary/10 last:border-b-0"
              >
                <span
                  className={`font-display font-semibold text-sm ${
                    step.accent ? "text-primary" : "text-foreground"
                  }`}
                >
                  {step.label}
                </span>
                {step.accent ? (
                  <span className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 text-[10px] font-mono tracking-[0.18em] uppercase text-primary">
                    {step.meta}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-muted-foreground">
                    {step.meta}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* COL 3 — Routed Sequence */}
        <div className="relative">
          <p className="text-[10px] font-display font-semibold tracking-[0.28em] uppercase text-primary/80 mb-4 font-mono text-right">
            Routed sequence
          </p>
          <div className="space-y-2.5">
            {ROUTED.map((r, i) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-center justify-between gap-3 rounded-lg border border-primary/20 bg-card/60 backdrop-blur px-3 py-2.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-[10px] text-muted-foreground w-4 text-right">
                    {i + 1}
                  </span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10">
                    <r.icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />
                  </span>
                  <span className="font-display font-semibold text-[12px] text-foreground leading-tight truncate">
                    {r.label}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[9px] font-mono tracking-[0.18em] uppercase text-primary shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Routed
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ExactRevenueEngine;