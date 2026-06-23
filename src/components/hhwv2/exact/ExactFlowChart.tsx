import { Fragment, useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Sparkles,
  FileText,
  Layers,
  Share2,
  Database,
  Send,
  Mail,
  BarChart3,
  Wrench,
  CheckCircle2,
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
  Bell,
  Workflow,
  Calendar,
  type LucideIcon,
} from "lucide-react";
import { groeistackSeed, faviconFor } from "@/data/groeistack";
import { BorderBeam, Spotlight } from "@/components/hhwv2/ui/magic";

/* ---------- tool lookup (real favicons) ---------- */
const toolWebsite: Record<string, string> = Object.fromEntries(
  groeistackSeed.map((t) => [t.name, t.website]),
);

const ToolChip = ({ name }: { name: string }) => {
  const [err, setErr] = useState(false);
  const src = toolWebsite[name] ? faviconFor(toolWebsite[name]) : "";
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-[hsl(var(--col)/0.2)] bg-background/50 px-1.5 py-1">
      <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-white/90 overflow-hidden shrink-0">
        {err || !src ? (
          <span className="text-[8px] font-display font-bold text-neutral-700">{name[0]}</span>
        ) : (
          <img src={src} alt="" className="h-3 w-3 object-contain" loading="lazy" onError={() => setErr(true)} />
        )}
      </span>
      <span className="text-[10px] font-display font-medium text-foreground/80 whitespace-nowrap">{name}</span>
    </span>
  );
};

/* ---------- data ---------- */
type Tier = { items: { label: string; sub: string }[]; active: number };
type Step = { title: string; icon: LucideIcon; tools?: string[]; tier?: Tier };
type Column = { key: string; label: string; sub: string; icon: LucideIcon; cssVar: string; steps: Step[] };

const COLUMNS: Column[] = [
  {
    key: "awareness",
    label: "Awareness",
    sub: "We worden zichtbaar",
    icon: Target,
    cssVar: "var(--funnel-awareness)",
    steps: [
      { title: "ICP & Segmentatie", icon: Target, tools: ["Apollo", "Ocean.io", "Clay"] },
      { title: "Intent Signals", icon: Sparkles, tools: ["Common Room", "Koala", "Trigify"] },
      { title: "Content Strategy", icon: FileText, tools: ["Claude", "ChatGPT"] },
      {
        title: "Prioritering",
        icon: Layers,
        tier: {
          active: 0,
          items: [
            { label: "Tier 1", sub: "High intent" },
            { label: "Tier 2", sub: "Mid intent" },
            { label: "Tier 3", sub: "Low intent" },
          ],
        },
      },
      { title: "Channels", icon: Share2, tools: ["HeyReach", "lemlist"] },
      { title: "Bronnen & data", icon: Database, tools: ["Common Room", "Koala", "Clay"] },
    ],
  },
  {
    key: "engagement",
    label: "Engagement",
    sub: "We bouwen interesse",
    icon: Sparkles,
    cssVar: "var(--funnel-engagement)",
    steps: [
      { title: "Personalized Outreach", icon: Send, tools: ["lemlist", "HeyReach"] },
      { title: "Multi-Touch Sequences", icon: Mail, tools: ["Smartlead", "Instantly"] },
      { title: "Value Content", icon: FileText, tools: ["HeyGen", "Claude"] },
      { title: "Engagement Scoring", icon: BarChart3, tools: ["Dreamdata"] },
      {
        title: "Warmte",
        icon: Layers,
        tier: {
          active: 0,
          items: [
            { label: "Tier 1", sub: "Hot" },
            { label: "Tier 2", sub: "Warm" },
            { label: "Tier 3", sub: "Cold" },
          ],
        },
      },
      { title: "Tools", icon: Wrench, tools: ["Smartlead", "Clay", "HubSpot"] },
    ],
  },
  {
    key: "activities",
    label: "Activities",
    sub: "We starten gesprekken",
    icon: Calendar,
    cssVar: "var(--funnel-conversion)",
    steps: [
      { title: "Qualify & Route", icon: CheckCircle2, tools: ["HubSpot", "Clay"] },
      { title: "Meeting Prep", icon: CalendarClock, tools: ["Claude", "HubSpot"] },
      { title: "Book Meetings", icon: CalendarPlus, tools: ["HubSpot", "lemlist"] },
      {
        title: "Kwalificatie",
        icon: Layers,
        tier: {
          active: 0,
          items: [
            { label: "Tier 1", sub: "SQL" },
            { label: "Tier 2", sub: "MQL" },
            { label: "Tier 3", sub: "Nurture" },
          ],
        },
      },
      { title: "Follow-up & Nurture", icon: Bell, tools: ["lemlist", "Smartlead"] },
      { title: "CRM & Systems", icon: Workflow, tools: ["HubSpot", "Salesforce", "Pipedrive"] },
    ],
  },
];

/* ---------- pieces ---------- */
const ColHeader = ({ col }: { col: Column }) => (
  <div className="flex items-center gap-2.5 mb-3">
    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[hsl(var(--col)/0.4)] bg-[hsl(var(--col)/0.12)]">
      <col.icon className="h-4 w-4 text-[hsl(var(--col))]" strokeWidth={1.8} />
    </span>
    <div className="leading-tight">
      <p className="font-display font-bold text-sm text-foreground">{col.label}</p>
      <p className="text-[11px] text-muted-foreground">{col.sub}</p>
    </div>
  </div>
);

const TierRow = ({ tier }: { tier: Tier }) => (
  <div>
    <div className="grid grid-cols-3 gap-1.5 mb-1.5">
      {tier.items.map((t, i) => (
        <span
          key={t.label}
          className={`text-center text-[10px] font-display font-semibold py-1 rounded-md border ${
            i === tier.active
              ? "bg-[hsl(var(--col)/0.18)] border-[hsl(var(--col)/0.6)] text-[hsl(var(--col))]"
              : "bg-card/60 border-[hsl(var(--col)/0.15)] text-foreground/60"
          }`}
        >
          {t.label}
        </span>
      ))}
    </div>
    <div className="grid grid-cols-3 gap-1.5">
      {tier.items.map((t) => (
        <span key={t.sub} className="text-center text-[9px] text-muted-foreground">
          {t.sub}
        </span>
      ))}
    </div>
  </div>
);

const StepCard = ({ step, index }: { step: Step; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.45, delay: index * 0.05 }}
    className="group relative rounded-xl border border-[hsl(var(--col)/0.22)] bg-card/60 backdrop-blur px-3.5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[hsl(var(--col)/0.55)] hover:shadow-[0_8px_30px_-12px_hsl(var(--col)/0.55)]"
  >
    {/* left accent */}
    <span className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-[hsl(var(--col)/0.6)]" aria-hidden />
    <div className="flex items-center gap-2 mb-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-md border border-[hsl(var(--col)/0.3)] bg-[hsl(var(--col)/0.1)] shrink-0">
        <step.icon className="h-3 w-3 text-[hsl(var(--col))]" strokeWidth={1.9} />
      </span>
      <p className="font-display font-semibold text-[12px] text-foreground leading-tight">{step.title}</p>
    </div>
    {step.tier ? (
      <TierRow tier={step.tier} />
    ) : (
      <div className="flex flex-wrap gap-1.5">
        {step.tools?.map((t) => (
          <ToolChip key={t} name={t} />
        ))}
      </div>
    )}
  </motion.div>
);

const FlowConnector = () => (
  <div className="flex justify-center py-1.5" aria-hidden>
    <div
      className="relative h-5 w-px"
      style={{ background: "linear-gradient(to bottom, hsl(var(--col)/0.1), hsl(var(--col)/0.55))" }}
    >
      <span
        className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
        style={{
          top: 0,
          background: "hsl(var(--col))",
          boxShadow: "0 0 8px hsl(var(--col)/0.9)",
          animation: "fc-flow 1.9s linear infinite",
        }}
      />
    </div>
  </div>
);

const ResultCard = ({
  icon: Icon,
  label,
  highlight,
}: {
  icon: LucideIcon;
  label: string;
  highlight?: boolean;
}) => (
  <div
    className={`flex items-center justify-center gap-2.5 rounded-xl border px-5 py-3.5 backdrop-blur ${
      highlight
        ? "border-primary/45 bg-primary/10 shadow-[0_0_50px_-15px_hsl(var(--primary)/0.7)]"
        : "border-primary/25 bg-card/70"
    }`}
  >
    <Icon className="h-5 w-5 text-primary" strokeWidth={1.9} />
    <span className="font-display font-bold text-base text-foreground">{label}</span>
  </div>
);

/* ---------- main ---------- */
const ExactFlowChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
      className="relative overflow-hidden rounded-2xl border border-primary/20 card-gradient p-5 md:p-7 shadow-[0_0_80px_-20px_hsl(var(--primary)/0.3)]"
    >
      <style>{`@keyframes fc-flow{0%{top:-6px;opacity:0}25%{opacity:1}100%{top:20px;opacity:0}}`}</style>
      <Spotlight size={500} />
      <BorderBeam size={280} duration={12} />

      {/* header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <p className="font-display font-bold text-sm md:text-base text-foreground">Van signaal naar salesproces</p>
        <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground">B2B Growth Machine™</p>
      </div>

      {/* 3 columns */}
      <div className="grid gap-6 md:gap-5 md:grid-cols-3">
        {COLUMNS.map((col) => (
          <div key={col.key} className="flex flex-col" style={{ ["--col" as string]: col.cssVar }}>
            <ColHeader col={col} />
            {col.steps.map((step, i) => (
              <Fragment key={step.title}>
                <StepCard step={step} index={i} />
                {i < col.steps.length - 1 && <FlowConnector />}
              </Fragment>
            ))}
          </div>
        ))}
      </div>

      {/* convergence */}
      <div className="relative mt-8" style={{ ["--col" as string]: "var(--primary)" }}>
        {/* converging lines */}
        <div className="relative h-10 w-full" aria-hidden>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 40" preserveAspectRatio="none" fill="none">
            {[50, 150, 250].map((x, i) => (
              <path
                key={i}
                d={`M ${x} 0 C ${x} 24, 150 18, 150 40`}
                stroke="hsl(var(--primary))"
                strokeOpacity="0.5"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ))}
          </svg>
        </div>

        <div className="mx-auto max-w-md space-y-0">
          <ResultCard icon={CalendarCheck} label="Meeting Booked" highlight />
          <FlowConnector />
          <ResultCard icon={Workflow} label="Sales Process" />
        </div>
      </div>
    </motion.div>
  );
};

export default ExactFlowChart;
