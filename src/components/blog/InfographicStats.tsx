import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Stat {
  value: string;
  label: string;
  description?: string;
  trend?: "up" | "down" | "neutral";
}

interface StatsProps {
  title: string;
  stats: Stat[];
}

const trendColors = {
  up: "text-emerald-400",
  down: "text-red-400",
  neutral: "text-muted-foreground",
};

const TrendIcon = ({ trend }: { trend?: "up" | "down" | "neutral" }) => {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-emerald-400" />;
  if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-400" />;
  return null;
};

const InfographicStats = ({ title, stats }: StatsProps) => {
  const cols = stats.length <= 2 ? "grid-cols-2" : stats.length === 3 ? "grid-cols-3" : "grid-cols-2 md:grid-cols-4";

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

      {/* Stats grid */}
      <div className={`grid ${cols}`}>
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-5 border-r border-b last:border-r-0 border-border text-center group hover:bg-secondary/20 transition-colors"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <p className="font-display font-bold text-2xl md:text-3xl text-primary">
                {stat.value}
              </p>
              <TrendIcon trend={stat.trend} />
            </div>
            <p className="font-display font-semibold text-sm text-foreground">{stat.label}</p>
            {stat.description && (
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default InfographicStats;
