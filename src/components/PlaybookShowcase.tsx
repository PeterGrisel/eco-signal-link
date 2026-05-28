import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Radar,
  Crosshair,
  Send,
  Network,
  Inbox,
  LineChart,
  BookOpenCheck,
} from "lucide-react";

/**
 * Agnostische playbook showcase — geïnspireerd op workflows.io/workflows,
 * maar zonder tool-logos. Elke card heeft een eigen geabstraheerd SVG-diagram
 * dat de structuur van het playbook laat zien.
 */

type Playbook = {
  slug: string;
  phase: string;
  title: string;
  desc: string;
  steps: number;
  icon: typeof Radar;
  diagram: React.ReactNode;
};

// Herbruikbare diagram-primitives (alles agnostisch — geen merknamen)
const Node = ({
  x,
  y,
  label,
  accent = false,
  w = 78,
}: {
  x: number;
  y: number;
  label: string;
  accent?: boolean;
  w?: number;
}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect
      x={-w / 2}
      y={-13}
      width={w}
      height={26}
      rx={6}
      fill={accent ? "hsl(var(--primary) / 0.18)" : "hsl(var(--card))"}
      stroke={accent ? "hsl(var(--primary))" : "hsl(var(--border))"}
      strokeWidth={accent ? 1.2 : 1}
    />
    <text
      x={0}
      y={4}
      textAnchor="middle"
      fontSize={10}
      fontFamily="Inter, sans-serif"
      fill={accent ? "hsl(var(--primary))" : "hsl(var(--foreground) / 0.85)"}
      fontWeight={500}
    >
      {label}
    </text>
  </g>
);

const Edge = ({
  d,
  dashed = false,
}: {
  d: string;
  dashed?: boolean;
}) => (
  <path
    d={d}
    fill="none"
    stroke="hsl(var(--border))"
    strokeWidth={1}
    strokeDasharray={dashed ? "3 3" : undefined}
  />
);

const Frame = ({ children }: { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 380 200"
    className="w-full h-full"
    preserveAspectRatio="xMidYMid meet"
  >
    {/* grid */}
    <defs>
      <pattern id="pbgrid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path
          d="M 20 0 L 0 0 0 20"
          fill="none"
          stroke="hsl(var(--border))"
          strokeOpacity={0.25}
          strokeWidth={0.5}
        />
      </pattern>
    </defs>
    <rect width="380" height="200" fill="url(#pbgrid)" />
    {children}
  </svg>
);

// ────────── Diagrammen ──────────

const SignaalDiagram = () => (
  <Frame>
    {/* triggers links */}
    <Node x={60} y={50} label="Jobchange" />
    <Node x={60} y={100} label="Funding" />
    <Node x={60} y={150} label="Tech-stack" />
    <Edge d="M 100 50 C 140 50, 140 100, 180 100" />
    <Edge d="M 100 100 L 180 100" />
    <Edge d="M 100 150 C 140 150, 140 100, 180 100" />
    <Node x={220} y={100} label="Scoring" accent />
    <Edge d="M 260 100 L 300 60" />
    <Edge d="M 260 100 L 300 140" />
    <Node x={340} y={60} label="Alert" w={60} />
    <Node x={340} y={140} label="CRM" w={60} />
  </Frame>
);

const ICPDiagram = () => (
  <Frame>
    {/* funnel-ish */}
    <Node x={190} y={40} label="Totale markt" w={180} />
    <Edge d="M 100 53 L 140 90" />
    <Edge d="M 280 53 L 240 90" />
    <Node x={190} y={100} label="ICP-filter" w={120} accent />
    <Edge d="M 145 113 L 110 150" />
    <Edge d="M 190 113 L 190 150" />
    <Edge d="M 235 113 L 270 150" />
    <Node x={110} y={160} label="Tier 1" w={70} />
    <Node x={190} y={160} label="Tier 2" w={70} />
    <Node x={270} y={160} label="Tier 3" w={70} />
  </Frame>
);

const OutboundDiagram = () => (
  <Frame>
    <Node x={70} y={100} label="Lijst" accent />
    <Edge d="M 110 100 L 150 50" />
    <Edge d="M 110 100 L 150 100" />
    <Edge d="M 110 100 L 150 150" />
    <Node x={190} y={50} label="E-mail" />
    <Node x={190} y={100} label="LinkedIn" />
    <Node x={190} y={150} label="Bellen" />
    <Edge d="M 230 50 C 270 50, 270 100, 310 100" />
    <Edge d="M 230 100 L 310 100" />
    <Edge d="M 230 150 C 270 150, 270 100, 310 100" />
    <Node x={340} y={100} label="Reply" w={60} accent />
  </Frame>
);

const CRMDiagram = () => (
  <Frame>
    <Node x={60} y={100} label="Lead in" />
    <Edge d="M 100 100 L 150 100" />
    <Node x={190} y={100} label="Verrijking" accent />
    <Edge d="M 230 100 L 270 60" />
    <Edge d="M 230 100 L 270 100" />
    <Edge d="M 230 100 L 270 140" />
    <Node x={320} y={60} label="AE" w={70} />
    <Node x={320} y={100} label="SDR" w={70} />
    <Node x={320} y={140} label="Nurture" w={70} />
  </Frame>
);

const InboundDiagram = () => (
  <Frame>
    <Node x={50} y={100} label="Form" w={60} />
    <Edge d="M 80 100 L 130 100" />
    <Node x={160} y={100} label="Verrijken" />
    <Edge d="M 200 100 L 240 100" />
    <Node x={270} y={100} label="Routeren" accent />
    <Edge d="M 300 100 C 330 100, 330 60, 350 60" />
    <Edge d="M 300 100 C 330 100, 330 140, 350 140" />
    <Node x={350} y={60} label="Meeting" w={60} />
    <Node x={350} y={140} label="Owner" w={60} />
  </Frame>
);

const PipelineDiagram = () => (
  <Frame>
    <Node x={60} y={50} label="Outbound" />
    <Node x={60} y={100} label="Inbound" />
    <Node x={60} y={150} label="Events" />
    <Edge d="M 100 50 L 180 100" />
    <Edge d="M 100 100 L 180 100" />
    <Edge d="M 100 150 L 180 100" />
    <Node x={220} y={100} label="Attributie" accent />
    <Edge d="M 260 100 L 310 100" />
    <rect
      x={310}
      y={70}
      width={60}
      height={60}
      rx={6}
      fill="hsl(var(--primary) / 0.1)"
      stroke="hsl(var(--primary) / 0.6)"
    />
    <text
      x={340}
      y={95}
      textAnchor="middle"
      fontSize={9}
      fill="hsl(var(--muted-foreground))"
      fontFamily="Inter, sans-serif"
    >
      Pipeline
    </text>
    <text
      x={340}
      y={115}
      textAnchor="middle"
      fontSize={14}
      fontWeight={700}
      fill="hsl(var(--primary))"
      fontFamily="Space Grotesk, sans-serif"
    >
      €
    </text>
  </Frame>
);

// ────────── Data ──────────

const PLAYBOOKS: Playbook[] = [
  {
    slug: "signaal",
    phase: "Doelgroep",
    title: "Signaal-playbook",
    desc: "Vang koopintent uit jobchanges, funding en tech-stack. Scoor en route automatisch.",
    steps: 7,
    icon: Radar,
    diagram: <SignaalDiagram />,
  },
  {
    slug: "icp-tam",
    phase: "Fundament",
    title: "ICP & TAM-playbook",
    desc: "Maak uw markt zichtbaar. Van totale markt naar tier-1, tier-2, tier-3 accounts.",
    steps: 5,
    icon: Crosshair,
    diagram: <ICPDiagram />,
  },
  {
    slug: "outbound",
    phase: "Activatie",
    title: "Outbound-playbook",
    desc: "Multi-channel sequenties via e-mail, LinkedIn en telefoon die in één pipeline landen.",
    steps: 8,
    icon: Send,
    diagram: <OutboundDiagram />,
  },
  {
    slug: "crm-routing",
    phase: "Activatie",
    title: "CRM Routing-playbook",
    desc: "Elke lead verrijkt, gescoord en automatisch toegewezen aan de juiste owner.",
    steps: 6,
    icon: Network,
    diagram: <CRMDiagram />,
  },
  {
    slug: "inbound",
    phase: "Sales",
    title: "Inbound Orchestratie-playbook",
    desc: "Van form-fill tot geboekte meeting in minuten, zonder handmatige tussenstap.",
    steps: 6,
    icon: Inbox,
    diagram: <InboundDiagram />,
  },
  {
    slug: "pipeline",
    phase: "Optimalisatie",
    title: "Pipeline Rapportage-playbook",
    desc: "Eén dashboard met attributie die klopt. Stuur op de cijfers die er echt toe doen.",
    steps: 5,
    icon: LineChart,
    diagram: <PipelineDiagram />,
  },
];

const PlaybookShowcase = () => {
  return (
    <section id="playbooks" className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6">
            <BookOpenCheck className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary font-display font-semibold text-xs tracking-[0.2em] uppercase">
              Playbooks
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tighter leading-[1.04] mb-4">
            Concrete playbooks uit het{" "}
            <span className="text-gradient">systeem</span>.
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Elk playbook is een bewezen werkstroom. Klaar om in te zetten,
            volledig aan te passen aan uw markt.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/40 rounded-2xl overflow-hidden border border-border/40">
          {PLAYBOOKS.map((pb, i) => {
            const Icon = pb.icon;
            return (
              <motion.article
                key={pb.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative bg-card/60 backdrop-blur-sm p-6 md:p-7 flex flex-col gap-5 hover:bg-card/90 transition-colors"
              >
                {/* Visual */}
                <div className="relative aspect-[19/10] rounded-lg border border-border/60 bg-background/60 overflow-hidden">
                  <div className="absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity">
                    {pb.diagram}
                  </div>
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-background/80 border border-border/60 backdrop-blur">
                    <Icon className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-display font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                      Playbook · {pb.phase}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1">
                  <h3 className="font-display font-bold text-xl md:text-2xl tracking-tight mb-2 group-hover:text-primary transition-colors">
                    {pb.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {pb.desc}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                  <span className="text-xs text-muted-foreground font-mono">
                    {pb.steps} stappen
                  </span>
                  <Link
                    to="/playbooks"
                    className="inline-flex items-center gap-1 text-xs font-display font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    Bekijk playbook
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/playbooks"
            className="inline-flex items-center gap-2 font-medium text-primary hover:gap-3 transition-all"
          >
            Bekijk alle playbooks
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PlaybookShowcase;