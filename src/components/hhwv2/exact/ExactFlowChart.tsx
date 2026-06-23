import { motion } from "framer-motion";
import {
  Target,
  Sparkles,
  FileText,
  Linkedin,
  Youtube,
  Mail,
  StickyNote,
  Phone,
  BarChart3,
  Megaphone,
  Calendar,
  CheckCircle2,
  Workflow,
  Database,
  Bell,
  Search,
} from "lucide-react";

/* --- shared tiny components --- */

const ColHeader = ({ icon: Icon, label, sub, tint }: { icon: typeof Target; label: string; sub: string; tint: string }) => (
  <div className="flex items-center gap-2.5 mb-3">
    <span className={`flex h-9 w-9 items-center justify-center rounded-lg border ${tint}`}>
      <Icon className="h-4 w-4" strokeWidth={1.8} />
    </span>
    <div className="leading-tight">
      <p className="font-display font-bold text-[13px] text-foreground">{label}</p>
      <p className="text-[10px] text-muted-foreground">{sub}</p>
    </div>
  </div>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`rounded-lg border border-primary/20 bg-card/70 backdrop-blur px-3 py-2.5 shadow-[0_0_24px_-12px_hsl(var(--primary)/0.5)] ${className}`}
  >
    {children}
  </div>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="font-display font-semibold text-[11px] text-foreground text-center mb-2">{children}</p>
);

const IconRow = ({ icons }: { icons: { i: typeof Mail; c?: string }[] }) => (
  <div className="flex items-center justify-center gap-2">
    {icons.map((x, i) => (
      <span
        key={i}
        className={`flex h-6 w-6 items-center justify-center rounded-md border border-primary/20 bg-background/50 ${x.c ?? "text-primary"}`}
      >
        <x.i className="h-3 w-3" strokeWidth={1.8} />
      </span>
    ))}
  </div>
);

const TierRow = ({
  items,
  active,
}: {
  items: { label: string; sub: string }[];
  active: 0 | 1 | 2;
}) => (
  <div>
    <div className="grid grid-cols-3 gap-1.5 mb-1.5">
      {items.map((t, i) => (
        <span
          key={t.label}
          className={`text-center text-[10px] font-display font-semibold py-1 rounded-md border ${
            i === active
              ? "bg-primary/20 border-primary/60 text-primary"
              : "bg-card/60 border-primary/15 text-foreground/70"
          }`}
        >
          {t.label}
        </span>
      ))}
    </div>
    <div className="grid grid-cols-3 gap-1.5">
      {items.map((t) => (
        <span key={t.sub} className="text-center text-[9px] text-muted-foreground">
          {t.sub}
        </span>
      ))}
    </div>
  </div>
);

/* --- main chart --- */

const ExactFlowChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
      className="relative rounded-2xl border border-primary/20 card-gradient p-5 md:p-7 shadow-[0_0_80px_-20px_hsl(var(--primary)/0.3)]"
    >
      {/* Internal header */}
      <div className="relative flex items-center justify-between mb-4 px-1">
        <p className="font-display font-bold text-[13px] text-foreground">Van signaal naar salesproces</p>
        <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground">System of revenue</p>
      </div>

      {/* SVG dotted connectors layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
        <defs>
          <pattern id="dots" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="hsl(var(--primary) / 0.35)" />
          </pattern>
        </defs>
      </svg>

      {/* 3 columns */}
      <div className="relative grid grid-cols-3 gap-3 md:gap-4">
        {/* COL 1 — Awareness */}
        <div className="space-y-2.5">
          <ColHeader
            icon={Target}
            label="Awareness"
            sub="We worden zichtbaar"
            tint="border-primary/40 bg-primary/10 text-primary"
          />
          <Card>
            <CardTitle>ICP & Segmentation</CardTitle>
            <IconRow icons={[{ i: Linkedin }, { i: Search }]} />
          </Card>
          <DottedV />
          <Card>
            <CardTitle>Intent Signals</CardTitle>
            <IconRow icons={[{ i: Sparkles }, { i: Search }]} />
          </Card>
          <DottedV />
          <Card>
            <CardTitle>Content Strategy</CardTitle>
            <IconRow icons={[{ i: FileText }, { i: StickyNote }]} />
          </Card>
          <DottedV />
          <Card className="!py-3">
            <TierRow
              active={0}
              items={[
                { label: "Tier 1", sub: "High intent" },
                { label: "Tier 2", sub: "Mid intent" },
                { label: "Tier 3", sub: "Low intent" },
              ]}
            />
          </Card>
          <DottedV />
          <Card>
            <CardTitle>Channels</CardTitle>
            <IconRow icons={[{ i: Linkedin }, { i: Youtube }, { i: Mail }, { i: StickyNote }]} />
          </Card>
        </div>

        {/* COL 2 — Engagement */}
        <div className="space-y-2.5">
          <ColHeader
            icon={Sparkles}
            label="Engagement"
            sub="We bouwen interesse"
            tint="border-[hsl(var(--funnel-engagement))]/40 bg-[hsl(var(--funnel-engagement))]/15 text-[hsl(var(--funnel-engagement))]"
          />
          <Card>
            <CardTitle>Personalized Outreach</CardTitle>
            <IconRow icons={[{ i: Linkedin }, { i: Mail }]} />
          </Card>
          <DottedV />
          <Card>
            <CardTitle>Multi-Touch Sequences</CardTitle>
            <IconRow icons={[{ i: Mail }, { i: Phone }]} />
          </Card>
          <DottedV />
          <Card>
            <CardTitle>Value Content</CardTitle>
            <IconRow icons={[{ i: FileText }, { i: BarChart3 }, { i: Megaphone }]} />
          </Card>
          <DottedV />
          <Card>
            <CardTitle>Engagement Scoring</CardTitle>
            <IconRow icons={[{ i: BarChart3 }]} />
          </Card>
          <DottedV />
          <Card className="!py-3">
            <TierRow
              active={0}
              items={[
                { label: "Tier 1", sub: "Hot" },
                { label: "Tier 2", sub: "Warm" },
                { label: "Tier 3", sub: "Cold" },
              ]}
            />
          </Card>
          <DottedV />
          <Card>
            <CardTitle>Tools</CardTitle>
            <IconRow icons={[{ i: Mail }, { i: Database }, { i: Workflow }]} />
          </Card>
        </div>

        {/* COL 3 — Activities */}
        <div className="space-y-2.5">
          <ColHeader
            icon={Calendar}
            label="Activities"
            sub="We starten gesprekken"
            tint="border-[hsl(var(--funnel-conversion))]/40 bg-[hsl(var(--funnel-conversion))]/15 text-[hsl(var(--funnel-conversion))]"
          />
          <Card>
            <CardTitle>Qualify & Route</CardTitle>
            <IconRow icons={[{ i: CheckCircle2 }, { i: Workflow }]} />
          </Card>
          <DottedV />
          <Card>
            <CardTitle>Meeting Prep</CardTitle>
            <IconRow icons={[{ i: Calendar }, { i: FileText }]} />
          </Card>
          <DottedV />
          <Card>
            <CardTitle>Book Meetings</CardTitle>
            <IconRow icons={[{ i: Calendar }, { i: Mail }, { i: Phone }]} />
          </Card>
          <DottedV />
          <Card className="!py-3">
            <TierRow
              active={0}
              items={[
                { label: "Tier 1", sub: "SQL" },
                { label: "Tier 2", sub: "MQL" },
                { label: "Tier 3", sub: "Nurture" },
              ]}
            />
          </Card>
          <DottedV />
          <Card>
            <CardTitle>Follow-up & Nurture</CardTitle>
            <IconRow icons={[{ i: Bell }, { i: Mail }]} />
          </Card>
          <DottedV />
          <Card>
            <CardTitle>CRM & Systems</CardTitle>
            <IconRow icons={[{ i: Database }, { i: Workflow }, { i: BarChart3 }]} />
          </Card>
        </div>
      </div>

      {/* Horizontal dotted bridges between columns */}
      <div className="relative my-4 grid grid-cols-3 gap-3 md:gap-4 items-center">
        <DottedH />
        <DottedH />
        <DottedH />
      </div>

      {/* Bottom converged steps */}
      <div className="relative max-w-md mx-auto space-y-2.5">
        <Card className="!py-3">
          <div className="flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4 text-primary" strokeWidth={1.8} />
            <span className="font-display font-semibold text-sm text-foreground">Meeting Booked</span>
          </div>
        </Card>
        <DottedV />
        <Card className="!py-3">
          <div className="flex items-center justify-center gap-2">
            <Workflow className="h-4 w-4 text-primary" strokeWidth={1.8} />
            <span className="font-display font-semibold text-sm text-foreground">Sales Process</span>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

const DottedV = () => (
  <div className="flex justify-center" aria-hidden>
    <span
      className="block w-px h-3"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, hsl(var(--primary) / 0.5) 50%, transparent 50%)",
        backgroundSize: "1px 4px",
      }}
    />
  </div>
);

const DottedH = () => (
  <span
    className="block h-px w-full"
    style={{
      backgroundImage:
        "linear-gradient(to right, hsl(var(--primary) / 0.35) 50%, transparent 50%)",
      backgroundSize: "6px 1px",
    }}
    aria-hidden
  />
);

export default ExactFlowChart;