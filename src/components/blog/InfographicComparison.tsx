import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

interface ComparisonColumn {
  title: string;
  subtitle?: string;
  highlight?: boolean;
  items: Record<string, string>;
}

interface ComparisonProps {
  title: string;
  columns: ComparisonColumn[];
  stats?: { value: string; label: string }[];
}

const getStatusIcon = (value: string) => {
  const v = value.toLowerCase().trim();
  if (v === "✓" || v === "ja" || v === "yes" || v === "hoog" || v === "high") {
    return <Check className="w-4 h-4 text-emerald-400" />;
  }
  if (v === "✗" || v === "nee" || v === "no" || v === "laag" || v === "low") {
    return <X className="w-4 h-4 text-red-400" />;
  }
  return null;
};

const InfographicComparison = ({ title, columns, stats }: ComparisonProps) => {
  // Collect all unique row labels from all columns
  const allLabels = Array.from(
    new Set(columns.flatMap(col => Object.keys(col.items)))
  );

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

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium w-1/4" />
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`text-left py-3 px-4 font-display font-bold ${
                    col.highlight ? "text-primary bg-primary/5" : "text-foreground"
                  }`}
                >
                  {col.title}
                  {col.subtitle && (
                    <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                      {col.subtitle}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allLabels.map((label, i) => (
              <tr key={i} className="border-b border-border last:border-b-0 hover:bg-secondary/20 transition-colors">
                <td className="py-3 px-4 text-foreground font-medium">{label}</td>
                {columns.map((col, j) => {
                  const value = col.items[label] || "—";
                  const icon = getStatusIcon(value);
                  return (
                    <td
                      key={j}
                      className={`py-3 px-4 text-muted-foreground ${
                        col.highlight ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {icon}
                        {icon ? null : <span>{value}</span>}
                        {icon && <span>{value}</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
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

export default InfographicComparison;
