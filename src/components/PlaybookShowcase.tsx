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
  Sparkles,
  Users,
} from "lucide-react";
import { FeatureCard } from "@/components/blocks/grid-feature-cards";

const PLAYBOOKS = [
  {
    slug: "signaal",
    phase: "Doelgroep",
    title: "Signaal-playbook",
    description:
      "Vang koopintent uit jobchanges, funding en tech-stack. Scoor en route automatisch.",
    icon: Radar,
  },
  {
    slug: "icp-tam",
    phase: "Fundament",
    title: "ICP & TAM-playbook",
    description:
      "Maak uw markt zichtbaar. Van totale markt naar tier-1, tier-2 en tier-3 accounts.",
    icon: Crosshair,
  },
  {
    slug: "outbound",
    phase: "Activatie",
    title: "Outbound-playbook",
    description:
      "Multi-channel sequenties via e-mail, LinkedIn en telefoon in één pipeline.",
    icon: Send,
  },
  {
    slug: "crm-routing",
    phase: "Activatie",
    title: "CRM Routing-playbook",
    description:
      "Elke lead verrijkt, gescoord en automatisch toegewezen aan de juiste owner.",
    icon: Network,
  },
  {
    slug: "inbound",
    phase: "Sales",
    title: "Inbound Orchestratie-playbook",
    description:
      "Van form-fill tot geboekte meeting in minuten, zonder handmatige tussenstap.",
    icon: Inbox,
  },
  {
    slug: "pipeline",
    phase: "Optimalisatie",
    title: "Pipeline Rapportage-playbook",
    description:
      "Eén dashboard met attributie die klopt. Stuur op de cijfers die er echt toe doen.",
    icon: LineChart,
  },
  {
    slug: "abm",
    phase: "Strategie",
    title: "ABM-playbook",
    description:
      "Account-based campagnes op uw tier-1 lijst. Persoonlijk, gecoördineerd en meetbaar.",
    icon: Users,
  },
  {
    slug: "ai-personalisatie",
    phase: "Optimalisatie",
    title: "AI-personalisatie-playbook",
    description:
      "Genereer relevante openers en context per account. Zonder ruis, met hogere replyrate.",
    icon: Sparkles,
  },
];

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
const PlaybookShowcase = () => {
  return (
    <section id="playbooks" className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="mb-12 md:mb-16 text-center max-w-2xl mx-auto">
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
        </div>

        {/* Grid — geïnspireerd op grid-feature-cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 rounded-2xl overflow-hidden border border-border/60 bg-card/30 divide-x divide-y divide-border/60 [&>*:nth-child(-n+4)]:border-t-0 [&>*:nth-child(4n+1)]:border-l-0">
          {PLAYBOOKS.map((pb) => (
            <Link
              key={pb.slug}
              to="/playbooks"
              className="group block hover:bg-card/60 transition-colors"
            >
              <FeatureCard
                feature={{
                  title: pb.title,
                  description: pb.description,
                  icon: pb.icon,
                }}
              />
              <div className="px-6 pb-6 -mt-2 flex items-center justify-between">
                <span className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-primary/80">
                  {pb.phase}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                  Bekijk
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
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