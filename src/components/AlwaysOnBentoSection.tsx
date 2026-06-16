import * as React from "react";
import { motion } from "framer-motion";
import DottedMap from "dotted-map";
import {
  Activity,
  ArrowRight,
  Radio,
  MapPin,
  Layers,
  Infinity as InfinityIcon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// ---------- Map ----------
const map = new DottedMap({ height: 55, grid: "diagonal" });
const points = map.getPoints();

const SignalMap = () => (
  <svg
    viewBox="0 0 120 60"
    className="w-full h-auto text-primary/40"
    aria-hidden="true"
  >
    {points.map((point, i) => (
      <circle
        key={i}
        cx={point.x}
        cy={point.y}
        r={0.18}
        fill="currentColor"
      />
    ))}
    {/* Highlight a few "live" signal pulses */}
    {[
      { x: 58, y: 22 }, // NL
      { x: 60, y: 24 }, // BE
      { x: 62, y: 20 }, // DE
      { x: 56, y: 26 }, // UK
    ].map((p, i) => (
      <g key={`pulse-${i}`}>
        <circle cx={p.x} cy={p.y} r={0.6} fill="hsl(var(--primary))" />
        <motion.circle
          cx={p.x}
          cy={p.y}
          r={0.6}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={0.15}
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut",
          }}
          style={{ transformOrigin: `${p.x}px ${p.y}px` }}
        />
      </g>
    ))}
  </svg>
);

// ---------- Chart ----------
const chartData = [
  { week: "W1", reactief: 40, alwayson: 30 },
  { week: "W2", reactief: 90, alwayson: 55 },
  { week: "W3", reactief: 20, alwayson: 95 },
  { week: "W4", reactief: 110, alwayson: 150 },
  { week: "W5", reactief: 15, alwayson: 220 },
  { week: "W6", reactief: 85, alwayson: 320 },
  { week: "W7", reactief: 25, alwayson: 460 },
];

const chartConfig = {
  alwayson: { label: "Always-on", color: "hsl(var(--primary))" },
  reactief: { label: "Reactief", color: "hsl(var(--muted-foreground))" },
} satisfies ChartConfig;

function PipelineChart() {
  return (
    <ChartContainer className="h-56 md:h-64 aspect-auto" config={chartConfig}>
      <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="fillAlwayson" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
            <stop offset="80%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="fillReactief" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.35} />
            <stop offset="80%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="2 4" />
        <XAxis
          dataKey="week"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
        />
        <YAxis hide />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Area
          dataKey="reactief"
          type="monotone"
          strokeWidth={1.5}
          stroke="hsl(var(--muted-foreground))"
          fill="url(#fillReactief)"
        />
        <Area
          dataKey="alwayson"
          type="monotone"
          strokeWidth={2}
          stroke="hsl(var(--primary))"
          fill="url(#fillAlwayson)"
        />
      </AreaChart>
    </ChartContainer>
  );
}

// ---------- Signal stream card ----------
type Signal = {
  type: string;
  time: string;
  message: string;
};

const signals: Signal[] = [
  { type: "Funding", time: "1 min", message: "Scale-up haalt nieuwe ronde op." },
  { type: "Hire", time: "4 min", message: "Nieuwe Head of Sales aangesteld." },
  { type: "Vacature", time: "9 min", message: "Team opent rol voor revenue ops." },
  { type: "Tech-stack", time: "14 min", message: "Bedrijf voegt nieuw CRM toe." },
  { type: "Intent", time: "21 min", message: "Account zoekt actief naar uw oplossing." },
  { type: "Trigger", time: "28 min", message: "Kwartaalcijfers laten groei zien." },
];

const SignalStreamCard = () => (
  <div className="relative w-full max-w-sm h-[280px] overflow-hidden font-body">
    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none" />
    <div className="space-y-2 relative z-0">
      {signals.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/40 p-3"
        >
          <span className="mt-0.5 w-7 h-7 shrink-0 rounded-md border border-primary/30 bg-primary/10 flex items-center justify-center">
            <Radio className="w-3.5 h-3.5 text-primary" strokeWidth={1.8} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-display font-semibold text-foreground tracking-tight">
                {s.type}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                {s.time}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-snug truncate">
              {s.message}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// ---------- Feature card ----------
function FeatureCard({
  icon,
  eyebrow,
  title,
  description,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative flex flex-col gap-3 p-6 border border-border/60 bg-card/40 transition hover:bg-card/60">
      <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
        {icon}
        {eyebrow}
      </span>
      <h4 className="text-lg font-display font-semibold tracking-tight text-foreground leading-snug">
        {title}{" "}
        <span className="text-muted-foreground font-normal">{description}</span>
      </h4>
      <div className="absolute bottom-3 right-3 p-2.5 flex items-center justify-center border border-border/60 rounded-full bg-background/60 transition-transform group-hover:-rotate-45">
        <ArrowRight className="w-3.5 h-3.5 text-primary" />
      </div>
    </div>
  );
}

// ---------- Section ----------
const AlwaysOnBentoSection = () => {
  return (
    <section
      id="always-on-bento"
      className="relative py-16 md:py-28 overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-14 max-w-3xl"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Always-on
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Eén motor die{" "}
            <span className="text-gradient">continu draait.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-6">
            Geen losse campagnes. Signalen, data en opvolging werken samen
            in één systeem.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 border border-border/60 rounded-2xl overflow-hidden bg-background/30 backdrop-blur-sm">
          {/* 1. MAP — top-left */}
          <div className="relative overflow-hidden bg-card/30 border-b border-r-0 md:border-r border-border/60 p-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              Signalen live
            </div>
            <h3 className="text-xl font-display font-semibold text-foreground leading-snug">
              Pulse op accounts in Europa.{" "}
              <span className="text-muted-foreground font-normal">
                Realtime triggers uit publieke en private bronnen.
              </span>
            </h3>
            <div className="relative mt-6">
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 bg-card border border-primary/30 text-foreground rounded-md text-xs font-mono shadow-lg flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Nieuw signaal in NL
              </div>
              <SignalMap />
            </div>
          </div>

          {/* 2. SIGNAL STREAM — top-right */}
          <div className="flex flex-col justify-between gap-4 p-6 bg-card/30 border-b border-border/60">
            <div>
              <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                <Activity className="w-3.5 h-3.5 text-primary" />
                Continue stream
              </span>
              <h3 className="text-xl font-display font-semibold text-foreground leading-snug">
                Elk signaal direct in beeld.{" "}
                <span className="text-muted-foreground font-normal">
                  Funding, hires, vacatures en intent in één feed.
                </span>
              </h3>
            </div>
            <div className="flex justify-center items-start w-full">
              <SignalStreamCard />
            </div>
          </div>

          {/* 3. CHART — bottom-left */}
          <div className="bg-card/30 border-r-0 md:border-r border-border/60 p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <Activity className="w-3.5 h-3.5 text-primary" />
              Pipeline groei
            </div>
            <h3 className="text-xl font-display font-semibold text-foreground leading-snug">
              Reactief piekt. Always-on stapelt.{" "}
              <span className="text-muted-foreground font-normal">
                Het verschil na zeven weken in één beeld.
              </span>
            </h3>
            <PipelineChart />
          </div>

          {/* 4. FEATURE CARDS — bottom-right */}
          <div className="grid sm:grid-cols-2 bg-card/20">
            <FeatureCard
              icon={<InfinityIcon className="w-3.5 h-3.5 text-primary" />}
              eyebrow="Altijd aan"
              title="Signalen 24/7."
              description="Uw motor blijft draaien, ook zonder dat uw team actief zoekt."
            />
            <FeatureCard
              icon={<Layers className="w-3.5 h-3.5 text-primary" />}
              eyebrow="Compounding"
              title="Elke week meer."
              description="Data, modellen en opvolging worden samen sterker."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlwaysOnBentoSection;