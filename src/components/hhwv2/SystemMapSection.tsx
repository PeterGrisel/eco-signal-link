import { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  TrendingUp,
  UserPlus,
  MousePointerClick,
  Users,
  Layers,
  Target,
  Mail,
  PhoneCall,
  Megaphone,
  ListChecks,
  Bell,
  Sparkles,
} from "lucide-react";

/* ---------- data ---------- */

type SignalKey =
  | "websitebezoek"
  | "funding"
  | "hiring"
  | "jobchange"
  | "techstack"
  | "intent";

type PlayKey = "sequence" | "belwachtrij" | "ads" | "crm" | "owner" | "lijst";

const SIGNALS: { key: SignalKey; label: string; icon: typeof TrendingUp; sub: string }[] = [
  { key: "websitebezoek", label: "Websitebezoek", icon: MousePointerClick, sub: "Pricing-pagina" },
  { key: "funding", label: "Funding", icon: TrendingUp, sub: "Serie A / B nieuws" },
  { key: "hiring", label: "Hiring", icon: UserPlus, sub: "Sales-rol open" },
  { key: "jobchange", label: "Job change", icon: Users, sub: "Champion verhuist" },
  { key: "techstack", label: "Tech-stack", icon: Layers, sub: "Tool toegevoegd" },
  { key: "intent", label: "Intent", icon: Target, sub: "G2 / search" },
];

const PLAYS: { key: PlayKey; label: string; icon: typeof Mail; sub: string }[] = [
  { key: "lijst", label: "Accountlijst", icon: ListChecks, sub: "gebouwd & verrijkt" },
  { key: "sequence", label: "Sequence", icon: Mail, sub: "gestart in eigen stack" },
  { key: "belwachtrij", label: "Belwachtrij", icon: PhoneCall, sub: "klaar voor SDR" },
  { key: "ads", label: "Ads-audience", icon: Megaphone, sub: "gesynct LinkedIn / Google" },
  { key: "crm", label: "CRM-taak", icon: Target, sub: "owner toegewezen" },
  { key: "owner", label: "Owner notify", icon: Bell, sub: "Slack / e-mail" },
];

/** Welke plays worden er per signaal aangezet. */
const ROUTES: Record<SignalKey, PlayKey[]> = {
  websitebezoek: ["lijst", "sequence", "belwachtrij", "owner"],
  funding: ["lijst", "sequence", "ads", "crm"],
  hiring: ["lijst", "sequence", "crm"],
  jobchange: ["lijst", "sequence", "owner"],
  techstack: ["lijst", "ads", "sequence"],
  intent: ["lijst", "belwachtrij", "ads", "owner"],
};

/* ---------- custom nodes ---------- */

type SignalData = { label: string; sub: string; icon: typeof TrendingUp; active: boolean; onClick: () => void };
type EngineData = { active: boolean };
type PlayData = { label: string; sub: string; icon: typeof Mail; active: boolean };

const SignalNode = ({ data }: NodeProps<Node<SignalData>>) => {
  const Icon = data.icon;
  return (
    <button
      onClick={data.onClick}
      className={`group flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all w-[185px] ${
        data.active
          ? "border-primary bg-primary/10 shadow-[0_0_24px_hsl(var(--primary)/0.45)]"
          : "border-primary/25 bg-card/70 hover:border-primary/60"
      }`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
          data.active ? "border-primary bg-primary/20" : "border-primary/30 bg-primary/5"
        }`}
      >
        <Icon className="h-4 w-4 text-primary" strokeWidth={1.7} />
      </span>
      <span className="flex flex-col min-w-0">
        <span className="font-display font-semibold text-sm text-foreground truncate">{data.label}</span>
        <span className="text-[10px] text-muted-foreground truncate">{data.sub}</span>
      </span>
      <Handle type="source" position={Position.Right} className="!opacity-0" />
    </button>
  );
};

const EngineNode = ({ data }: NodeProps<Node<EngineData>>) => (
  <div
    className={`flex flex-col items-center justify-center rounded-2xl border-2 px-6 py-7 w-[210px] backdrop-blur transition-all ${
      data.active
        ? "border-primary bg-primary/10 shadow-[0_0_60px_hsl(var(--primary)/0.55)]"
        : "border-primary/40 bg-card/80 shadow-[0_0_30px_hsl(var(--primary)/0.25)]"
    }`}
  >
    <Handle type="target" position={Position.Left} className="!opacity-0" />
    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/50 bg-primary/15 mb-3">
      <Sparkles className="h-6 w-6 text-primary" strokeWidth={1.6} />
    </span>
    <span className="font-display font-bold text-base">B2B Engine</span>
    <span className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-primary/70 mt-1">
      clean · enrich · score · route
    </span>
    <Handle type="source" position={Position.Right} className="!opacity-0" />
  </div>
);

const PlayNode = ({ data }: NodeProps<Node<PlayData>>) => {
  const Icon = data.icon;
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 w-[210px] transition-all ${
        data.active
          ? "border-primary bg-primary/10 shadow-[0_0_24px_hsl(var(--primary)/0.4)]"
          : "border-primary/15 bg-card/40 opacity-50"
      }`}
    >
      <Handle type="target" position={Position.Left} className="!opacity-0" />
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
          data.active ? "border-primary bg-primary/20" : "border-primary/20 bg-primary/5"
        }`}
      >
        <Icon className="h-4 w-4 text-primary" strokeWidth={1.7} />
      </span>
      <span className="flex flex-col min-w-0">
        <span className="font-display font-semibold text-sm text-foreground truncate">{data.label}</span>
        <span className="text-[10px] text-muted-foreground truncate">{data.sub}</span>
      </span>
    </div>
  );
};

const nodeTypes = { signal: SignalNode, engine: EngineNode, play: PlayNode };

/* ---------- section ---------- */

const SystemMapSection = () => {
  const [active, setActive] = useState<SignalKey>("websitebezoek");

  const handleSignalClick = useCallback((key: SignalKey) => setActive(key), []);

  const { nodes, edges } = useMemo(() => {
    const activePlays = new Set(ROUTES[active]);

    const signalNodes: Node[] = SIGNALS.map((s, i) => ({
      id: `s-${s.key}`,
      type: "signal",
      position: { x: 0, y: i * 78 },
      data: {
        label: s.label,
        sub: s.sub,
        icon: s.icon,
        active: s.key === active,
        onClick: () => handleSignalClick(s.key),
      } satisfies SignalData,
      draggable: false,
      selectable: false,
    }));

    const engineNode: Node = {
      id: "engine",
      type: "engine",
      position: { x: 360, y: SIGNALS.length * 78 * 0.5 - 60 },
      data: { active: true } satisfies EngineData,
      draggable: false,
      selectable: false,
    };

    const playNodes: Node[] = PLAYS.map((p, i) => ({
      id: `p-${p.key}`,
      type: "play",
      position: { x: 720, y: i * 70 },
      data: {
        label: p.label,
        sub: p.sub,
        icon: p.icon,
        active: activePlays.has(p.key),
      } satisfies PlayData,
      draggable: false,
      selectable: false,
    }));

    const inEdges: Edge[] = SIGNALS.map((s) => ({
      id: `e-in-${s.key}`,
      source: `s-${s.key}`,
      target: "engine",
      type: "smoothstep",
      animated: s.key === active,
      style: {
        stroke: "hsl(var(--primary))",
        strokeOpacity: s.key === active ? 0.9 : 0.18,
        strokeWidth: s.key === active ? 1.8 : 1,
        strokeDasharray: s.key === active ? "0" : "4 4",
      },
    }));

    const outEdges: Edge[] = PLAYS.map((p) => {
      const on = activePlays.has(p.key);
      return {
        id: `e-out-${p.key}`,
        source: "engine",
        target: `p-${p.key}`,
        type: "smoothstep",
        animated: on,
        style: {
          stroke: "hsl(var(--primary))",
          strokeOpacity: on ? 0.9 : 0.12,
          strokeWidth: on ? 1.8 : 1,
          strokeDasharray: on ? "0" : "4 4",
        },
      };
    });

    return {
      nodes: [...signalNodes, engineNode, ...playNodes],
      edges: [...inEdges, ...outEdges],
    };
  }, [active, handleSignalClick]);

  const activeSignal = SIGNALS.find((s) => s.key === active)!;

  return (
    <section id="systeem" className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 md:mb-12 max-w-3xl">
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Interactief · klik op een signaal
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Zie hoe een signaal
            <br />
            <span className="font-serif italic text-gradient">de juiste play wordt.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-5">
            Klik links op een signaal. De engine route je naar de plays die ertoe doen.
          </p>
        </div>

        <div className="rounded-2xl border border-primary/20 card-gradient overflow-hidden">
          {/* Active route summary */}
          <div className="flex flex-wrap items-center gap-3 border-b border-primary/15 px-5 py-3 bg-card/40">
            <span className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-muted-foreground">
              Geactiveerd
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-display font-semibold text-primary">
              <activeSignal.icon className="h-3.5 w-3.5" strokeWidth={2} />
              {activeSignal.label}
            </span>
            <span className="text-primary/60">→</span>
            {ROUTES[active].map((pk) => {
              const p = PLAYS.find((x) => x.key === pk)!;
              return (
                <span
                  key={pk}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card/60 px-3 py-1 text-xs font-display font-semibold text-foreground/85"
                >
                  <p.icon className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
                  {p.label}
                </span>
              );
            })}
          </div>

          <div className="h-[560px] md:h-[620px] systemmap-canvas">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.15 }}
              proOptions={{ hideAttribution: true }}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              panOnDrag={false}
              panOnScroll={false}
              zoomOnScroll={false}
              zoomOnPinch={false}
              zoomOnDoubleClick={false}
              preventScrolling={false}
              minZoom={0.4}
              maxZoom={1.2}
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={20}
                size={1.2}
                color="hsl(var(--primary) / 0.18)"
              />
            </ReactFlow>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Elke route is configureerbaar per ICP en stack. Dit is één voorbeeldset.
        </p>
      </div>

      <style>{`
        .systemmap-canvas .react-flow__renderer,
        .systemmap-canvas .react-flow__pane,
        .systemmap-canvas .react-flow {
          background: transparent !important;
        }
        .systemmap-canvas .react-flow__handle { display: none; }
      `}</style>
    </section>
  );
};

export default SystemMapSection;