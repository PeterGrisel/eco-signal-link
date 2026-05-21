import { BgmIcon, type BgmIconProps } from "./BgmIcon";

/**
 * B2BGroeiMachine custom icon set.
 * Visual DNA: thin geometric lines (1.5px) + a single accent dot or arc in --accent.
 * Use `accent={false}` to render fully monochrome.
 */

type P = BgmIconProps;

/* ───────── Architectuur / proces ───────── */

export const SignalIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="5" cy="19" r="1.4" stroke="none" />}>
    <path d="M5 19 Q 12 19 12 12" />
    <path d="M5 19 Q 19 19 19 5" />
    <path d="M5 19 Q 16 19 16 8" />
  </BgmIcon>
);

export const BrainIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="12" cy="12" r="1.3" stroke="none" />}>
    <circle cx="12" cy="12" r="8" />
    <path d="M4 12h16" />
    <path d="M12 4 Q 8 8 8 12 Q 8 16 12 20" />
    <path d="M12 4 Q 16 8 16 12 Q 16 16 12 20" />
  </BgmIcon>
);

export const LayersIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="20" cy="6" r="1.3" stroke="none" />}>
    <path d="M4 7l8-3 8 3-8 3-8-3z" />
    <path d="M4 12l8 3 8-3" />
    <path d="M4 17l8 3 8-3" />
  </BgmIcon>
);

export const WorkflowIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="19" cy="19" r="1.3" stroke="none" />}>
    <rect x="3" y="3" width="6" height="6" rx="1" />
    <rect x="15" y="3" width="6" height="6" rx="1" />
    <rect x="9" y="15" width="6" height="6" rx="1" />
    <path d="M6 9v3a2 2 0 0 0 2 2h4" />
    <path d="M18 9v3a2 2 0 0 1-2 2h-4" />
  </BgmIcon>
);

export const TargetIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="12" cy="12" r="1.3" stroke="none" />}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5.5" />
    <circle cx="12" cy="12" r="2.5" />
  </BgmIcon>
);

export const RadarIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="17" cy="7" r="1.3" stroke="none" />}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.4" />
    <path d="M12 12 L 18 6" />
  </BgmIcon>
);

export const GitBranchIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="18" cy="6" r="1.3" stroke="none" />}>
    <circle cx="6" cy="6" r="2" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="6" r="2" />
    <path d="M6 8v8" />
    <path d="M6 12h6a4 4 0 0 0 4-4V8" />
  </BgmIcon>
);

export const ActivityIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="12" cy="12" r="1.3" stroke="none" />}>
    <path d="M3 12h4l2-6 4 12 2-6 2 3h4" />
  </BgmIcon>
);

export const GaugeIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="18" cy="9" r="1.3" stroke="none" />}>
    <path d="M4 18 A 8 8 0 0 1 20 18" />
    <path d="M12 18 L 18 9" />
    <circle cx="12" cy="18" r="1.4" />
  </BgmIcon>
);

export const MagnetIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="12" cy="20" r="1.3" stroke="none" />}>
    <path d="M5 4v7a7 7 0 0 0 14 0V4" />
    <path d="M5 4h4v4H5z" />
    <path d="M15 4h4v4h-4z" />
  </BgmIcon>
);

/* ───────── Resultaat / KPI ───────── */

export const TrendingUpIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="20" cy="6" r="1.4" stroke="none" />}>
    <path d="M3 17l6-6 4 4 7-7" />
    <path d="M14 8h6v6" />
  </BgmIcon>
);

export const BarChartIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="19" cy="6" r="1.3" stroke="none" />}>
    <path d="M4 20V4" />
    <path d="M4 20h16" />
    <rect x="7" y="13" width="3" height="5" />
    <rect x="12" y="9" width="3" height="9" />
    <rect x="17" y="6" width="3" height="12" />
  </BgmIcon>
);

export const TrophyIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="12" cy="10" r="1.3" stroke="none" />}>
    <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
    <path d="M7 6H4v2a3 3 0 0 0 3 3" />
    <path d="M17 6h3v2a3 3 0 0 1-3 3" />
    <path d="M10 20h4" />
    <path d="M12 14v6" />
  </BgmIcon>
);

export const SparklesIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="18" cy="6" r="1.3" stroke="none" />}>
    <path d="M10 4l1.5 4L15 9.5 11.5 11 10 15 8.5 11 5 9.5 8.5 8z" />
    <path d="M18 14v4" />
    <path d="M16 16h4" />
  </BgmIcon>
);

export const ZapIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="15" cy="13" r="1.3" stroke="none" />}>
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
  </BgmIcon>
);

export const RocketIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="15" cy="9" r="1.3" stroke="none" />}>
    <path d="M14 4c4 0 6 2 6 6 0 0-3 7-8 9-1-1-1-3 0-5l-3-3c-2 1-4 1-5 0 2-5 9-8 10-7z" />
    <path d="M9 15l-3 3" />
    <path d="M6 18l-2 2" />
    <path d="M8 13l-3-1" />
  </BgmIcon>
);

/* ───────── Mens / relatie ───────── */

export const UsersIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="17" cy="7" r="1.3" stroke="none" />}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20c0-3 3-5 6-5s6 2 6 5" />
    <circle cx="17" cy="9" r="2.2" />
    <path d="M17 13c2 0 4 1.5 4 4" />
  </BgmIcon>
);

export const HandshakeIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="12" cy="13" r="1.3" stroke="none" />}>
    <path d="M3 12l3-3 4 1 3 3-2 2-3-3-3 3-2-3z" />
    <path d="M21 12l-3-3-4 1-3 3 2 2 3-3 3 3 2-3z" />
    <path d="M10 14l2 2 2-2" />
  </BgmIcon>
);

export const UserCheckIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="20" cy="11" r="1.3" stroke="none" />}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M3 20c0-3.5 3-6 6-6s6 2.5 6 6" />
    <path d="M16 11l2 2 4-4" />
  </BgmIcon>
);

export const MessageSquareIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="17" cy="5" r="1.3" stroke="none" />}>
    <path d="M4 5h16v11h-9l-5 4v-4H4z" />
    <path d="M8 10h6" />
    <path d="M8 13h4" />
  </BgmIcon>
);

/* ───────── Operatie ───────── */

export const DatabaseIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="17" cy="6" r="1.3" stroke="none" />}>
    <ellipse cx="12" cy="5.5" rx="8" ry="2.5" />
    <path d="M4 5.5v6c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5v-6" />
    <path d="M4 11.5v6c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5v-6" />
  </BgmIcon>
);

export const WrenchIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="6" cy="18" r="1.3" stroke="none" />}>
    <path d="M14 3a5 5 0 0 1 6 6l-1 1-5-5 1-1z" />
    <path d="M14 9l-9 9 2 2 9-9" />
  </BgmIcon>
);

export const ShieldIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="12" cy="12" r="1.3" stroke="none" />}>
    <path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z" />
    <path d="M9 12l2 2 4-4" />
  </BgmIcon>
);

export const RepeatIcon = (p: P) => (
  <BgmIcon {...p} accentNode={<circle cx="20" cy="8" r="1.3" stroke="none" />}>
    <path d="M4 12V9a3 3 0 0 1 3-3h11" />
    <path d="M15 3l3 3-3 3" />
    <path d="M20 12v3a3 3 0 0 1-3 3H6" />
    <path d="M9 21l-3-3 3-3" />
  </BgmIcon>
);

/* ───────── Icon registry (handig voor preview / generic Icon) ───────── */

export const bgmIcons = {
  Signal: SignalIcon,
  Brain: BrainIcon,
  Layers: LayersIcon,
  Workflow: WorkflowIcon,
  Target: TargetIcon,
  Radar: RadarIcon,
  GitBranch: GitBranchIcon,
  Activity: ActivityIcon,
  Gauge: GaugeIcon,
  Magnet: MagnetIcon,
  TrendingUp: TrendingUpIcon,
  BarChart: BarChartIcon,
  Trophy: TrophyIcon,
  Sparkles: SparklesIcon,
  Zap: ZapIcon,
  Rocket: RocketIcon,
  Users: UsersIcon,
  Handshake: HandshakeIcon,
  UserCheck: UserCheckIcon,
  MessageSquare: MessageSquareIcon,
  Database: DatabaseIcon,
  Wrench: WrenchIcon,
  Shield: ShieldIcon,
  Repeat: RepeatIcon,
} as const;

export type BgmIconName = keyof typeof bgmIcons;
export { BgmIcon } from "./BgmIcon";
export type { BgmIconProps } from "./BgmIcon";