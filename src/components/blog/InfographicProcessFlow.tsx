import { motion } from "framer-motion";
import { 
  Search, Lightbulb, Rocket, CheckCircle, Settings, Brain, 
  Target, Shield, TrendingUp, Zap, Database, Users, 
  BarChart3, ArrowRight, Globe, Mail, MessageSquare, Filter
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  search: Search, lightbulb: Lightbulb, rocket: Rocket, check: CheckCircle,
  settings: Settings, brain: Brain, target: Target, shield: Shield,
  trending: TrendingUp, zap: Zap, database: Database, users: Users,
  chart: BarChart3, globe: Globe, mail: Mail, message: MessageSquare, filter: Filter,
};

const phaseColors = [
  { bg: "bg-primary/10", border: "border-primary/30", accent: "text-primary", dot: "bg-primary" },
  { bg: "bg-blue-500/10", border: "border-blue-500/30", accent: "text-blue-400", dot: "bg-blue-400" },
  { bg: "bg-emerald-500/10", border: "border-emerald-500/30", accent: "text-emerald-400", dot: "bg-emerald-400" },
  { bg: "bg-purple-500/10", border: "border-purple-500/30", accent: "text-purple-400", dot: "bg-purple-400" },
  { bg: "bg-amber-500/10", border: "border-amber-500/30", accent: "text-amber-400", dot: "bg-amber-400" },
];

interface Phase {
  title: string;
  icon?: string;
  items: string[];
}

interface ProcessFlowProps {
  title: string;
  phases: Phase[];
  stats?: { value: string; label: string }[];
}

const InfographicProcessFlow = ({ title, phases, stats }: ProcessFlowProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="my-10 rounded-xl border border-border overflow-hidden bg-card"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-secondary/30">
        <h4 className="font-display font-bold text-foreground text-base md:text-lg">{title}</h4>
      </div>

      {/* Phases */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 md:gap-0">
        {phases.map((phase, i) => {
          const color = phaseColors[i % phaseColors.length];
          const Icon = iconMap[phase.icon || "zap"] || Zap;
          return (
            <div
              key={i}
              className={`relative p-5 border-b md:border-b-0 md:border-r last:border-r-0 last:border-b-0 border-border ${color.bg}`}
            >
              {/* Phase number + icon */}
              <div className="flex items-center gap-2.5 mb-3">
                <span className={`w-7 h-7 rounded-lg ${color.bg} border ${color.border} flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${color.accent}`} />
                </span>
                <span className={`font-display font-bold text-sm ${color.accent} uppercase tracking-wide`}>
                  {phase.title}
                </span>
              </div>

              {/* Items */}
              <ul className="space-y-2">
                {phase.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className={`w-1.5 h-1.5 rounded-full ${color.dot} mt-1.5 shrink-0`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Arrow connector (desktop) */}
              {i < phases.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-5 h-5 text-muted-foreground/40" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stats bar */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-border">
          {stats.map((stat, i) => (
            <div key={i} className="px-4 py-3 text-center border-r last:border-r-0 border-border">
              <p className="font-display font-bold text-lg text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default InfographicProcessFlow;
