import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

interface Layer {
  title: string;
  subtitle?: string;
  items: { label: string; value: string }[];
  color?: string;
}

interface LayersProps {
  title: string;
  layers: Layer[];
}

const layerColors = [
  { bg: "bg-primary/10", border: "border-primary/30", text: "text-primary", bar: "bg-primary" },
  { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", bar: "bg-blue-400" },
  { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", bar: "bg-emerald-400" },
  { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", bar: "bg-amber-400" },
  { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", bar: "bg-purple-400" },
];

const InfographicLayers = ({ title, layers }: LayersProps) => {
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

      <div className="p-5 space-y-3">
        {layers.map((layer, i) => {
          const c = layerColors[i % layerColors.length];
          return (
            <div key={i}>
              <div className={`rounded-lg ${c.bg} border ${c.border} p-4`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-1 h-6 rounded-full ${c.bar}`} />
                  <div>
                    <h5 className={`font-display font-bold text-sm ${c.text} uppercase tracking-wide`}>
                      {layer.title}
                    </h5>
                    {layer.subtitle && (
                      <p className="text-xs text-muted-foreground">{layer.subtitle}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {layer.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-2 text-sm">
                      <span className="text-foreground font-medium min-w-0">{item.label}:</span>
                      <span className="text-muted-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              {i < layers.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="w-4 h-4 text-muted-foreground/40" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default InfographicLayers;
