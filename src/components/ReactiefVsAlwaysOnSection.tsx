import { motion } from "framer-motion";
import {
  Zap,
  Settings2,
  TrendingUp,
  UserRound,
  HelpCircle,
  Infinity as InfinityIcon,
  ListChecks,
  LineChart,
  Hand,
  Users2,
  Clock,
} from "lucide-react";

const reactiveBadges = [
  { icon: TrendingUp, label: "Campagne pieken" },
  { icon: UserRound, label: "Handmatige opvolging" },
  { icon: HelpCircle, label: "Onvoorspelbare pipeline" },
];

const alwaysOnBadges = [
  { icon: InfinityIcon, label: "Continue signalen" },
  { icon: ListChecks, label: "Gestructureerde opvolging" },
  { icon: LineChart, label: "Compounding pipeline" },
];

const reactivePains = [
  { icon: Hand, label: "Stop-start beweging" },
  { icon: Users2, label: "Afhankelijk van mensen" },
  { icon: Clock, label: "Tijdverlies tussen momenten" },
];

// Reactive spike path — three sharp launches with quiet valleys
const spikePath =
  "M0,80 L20,72 L35,68 L50,74 L60,30 L65,8 L70,30 L80,70 L95,76 L110,72 L130,70 L140,30 L145,10 L150,30 L160,68 L180,74 L200,72 L220,70 L230,32 L235,12 L240,32 L250,68 L275,74 L300,72";

// Always-on exponential growth
const growthPath =
  "M0,90 C 60,88 120,82 170,70 C 220,58 250,40 275,18 L 300,8";

const ReactiefVsAlwaysOnSection = () => {
  return (
    <section
      id="reactief-vs-alwayson"
      className="relative py-16 md:py-32 overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 max-w-3xl"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Het verschil
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Van reactief naar{" "}
            <span className="text-gradient">always-on.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-6">
            Traditionele teams groeien in pieken. Wij bouwen aan continue,
            voorspelbare groei.
          </p>
        </motion.div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* LEFT — Reactive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="card-gradient border-glow rounded-3xl p-6 md:p-8 flex flex-col"
          >
            {/* Heading */}
            <div className="flex items-center gap-3 mb-6">
              <span className="w-11 h-11 rounded-xl border border-primary/30 bg-card flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" strokeWidth={1.6} />
              </span>
              <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight">
                Traditioneel · Reactief
              </h3>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-8">
              {reactiveBadges.map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-card/60 text-xs md:text-sm text-muted-foreground"
                >
                  <b.icon className="w-3.5 h-3.5 text-primary" strokeWidth={1.8} />
                  {b.label}
                </span>
              ))}
            </div>

            {/* Chart — campaign spikes */}
            <div className="relative rounded-2xl border border-border/60 bg-background/40 p-4 md:p-5 mb-6">
              <div className="flex items-center justify-between text-[10px] md:text-xs text-muted-foreground mb-2 font-mono">
                <span>Activiteit</span>
                <span>Tijd</span>
              </div>
              <svg
                viewBox="0 0 300 100"
                className="w-full h-40 md:h-48"
                preserveAspectRatio="none"
              >
                {/* Baseline grid */}
                <line
                  x1="0"
                  y1="90"
                  x2="300"
                  y2="90"
                  stroke="hsl(var(--border))"
                  strokeWidth="0.5"
                />
                {/* Spike line */}
                <motion.path
                  d={spikePath}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.2, ease: "easeInOut" }}
                />
                {/* Launch markers */}
                {[{ x: 65, label: "Lancering" }, { x: 145, label: "Lancering" }, { x: 235, label: "Lancering" }].map((m, i) => (
                  <g key={i}>
                    <motion.line
                      x1={m.x}
                      y1={10}
                      x2={m.x}
                      y2={90}
                      stroke="hsl(var(--primary))"
                      strokeWidth="0.5"
                      strokeDasharray="2 2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 0.6 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.2 + i * 0.2, duration: 0.4 }}
                    />
                    <motion.circle
                      cx={m.x}
                      cy={10}
                      r="2.5"
                      fill="hsl(var(--primary))"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.3 + i * 0.2, duration: 0.3 }}
                    />
                  </g>
                ))}
              </svg>
            </div>

            {/* Pain points */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {reactivePains.map((p) => (
                <div key={p.label} className="flex flex-col items-start gap-2">
                  <span className="w-9 h-9 rounded-lg border border-primary/30 bg-card flex items-center justify-center">
                    <p.icon className="w-4 h-4 text-primary" strokeWidth={1.6} />
                  </span>
                  <span className="text-xs text-muted-foreground leading-tight">
                    {p.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Punchline */}
            <div className="mt-auto rounded-xl border border-border/60 bg-background/40 px-4 py-3">
              <p className="text-sm md:text-base italic text-muted-foreground">
                Groei hangt af van losse momenten.
              </p>
            </div>
          </motion.div>

          {/* RIGHT — Always-on */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-3xl p-6 md:p-8 flex flex-col border border-primary/40 bg-gradient-to-br from-primary/[0.06] via-card to-card overflow-hidden"
          >
            {/* Ambient glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            {/* Heading */}
            <div className="flex items-center gap-3 mb-6 relative">
              <span className="w-11 h-11 rounded-xl border border-primary/50 bg-primary/10 flex items-center justify-center">
                <Settings2 className="w-5 h-5 text-primary" strokeWidth={1.6} />
              </span>
              <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight">
                Always-on · Proactief
              </h3>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-8 relative">
              {alwaysOnBadges.map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-primary/30 bg-primary/5 text-xs md:text-sm text-foreground"
                >
                  <b.icon className="w-3.5 h-3.5 text-primary" strokeWidth={1.8} />
                  {b.label}
                </span>
              ))}
            </div>

            {/* Chart — compounding growth */}
            <div className="relative rounded-2xl border border-primary/20 bg-background/40 p-4 md:p-5 mb-6">
              <div className="flex items-center justify-between text-[10px] md:text-xs text-muted-foreground mb-2 font-mono">
                <span>Impact</span>
                <span>Tijd</span>
              </div>
              <svg
                viewBox="0 0 300 100"
                className="w-full h-40 md:h-48"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <line
                  x1="0"
                  y1="90"
                  x2="300"
                  y2="90"
                  stroke="hsl(var(--border))"
                  strokeWidth="0.5"
                />

                {/* Filled area under curve */}
                <motion.path
                  d={`${growthPath} L 300,90 L 0,90 Z`}
                  fill="url(#growthFill)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.6, duration: 0.8 }}
                />

                {/* Curve line */}
                <motion.path
                  d={growthPath}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />

                {/* End dot */}
                <motion.circle
                  cx="300"
                  cy="8"
                  r="3"
                  fill="hsl(var(--primary))"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 2, duration: 0.3 }}
                />
              </svg>
            </div>

            {/* System inputs/outputs row */}
            <div className="grid grid-cols-2 gap-4 mb-6 relative">
              <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                <p className="text-[10px] md:text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  Input
                </p>
                <ul className="space-y-1.5 text-xs md:text-sm">
                  <li className="text-foreground">Signalen</li>
                  <li className="text-foreground">Data</li>
                  <li className="text-foreground">Accounts</li>
                  <li className="text-foreground">Kanalen</li>
                </ul>
              </div>
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <p className="text-[10px] md:text-xs font-mono uppercase tracking-wider text-primary mb-2">
                  Output
                </p>
                <ul className="space-y-1.5 text-xs md:text-sm">
                  <li className="text-foreground">Gesprekken</li>
                  <li className="text-foreground">Kansen</li>
                  <li className="text-foreground">Pipeline</li>
                  <li className="text-foreground">Groei</li>
                </ul>
              </div>
            </div>

            {/* Punchline */}
            <div className="mt-auto rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
              <p className="text-sm md:text-base italic text-foreground">
                Groei stapelt door systeemlogica.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 md:mt-10 rounded-2xl border border-primary/30 bg-primary/[0.04] px-5 md:px-8 py-5 md:py-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5"
        >
          <span className="w-10 h-10 shrink-0 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center">
            <span className="font-display font-bold text-primary text-base">G</span>
          </span>
          <p className="font-display text-lg md:text-2xl tracking-tight">
            Geen losse campagnes.{" "}
            <span className="text-primary">
              Eén commerciële motor die continu draait.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ReactiefVsAlwaysOnSection;