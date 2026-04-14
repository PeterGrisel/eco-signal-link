import { LAYERS, TOTAL_LAYERS } from "../data/layers";
import { motion, AnimatePresence } from "framer-motion";

interface BlueprintPanelProps {
  inputs: Record<number, Record<string, any>>;
  currentLayer: number;
  score: number;
}

const BlueprintPanel = ({ inputs, currentLayer, score }: BlueprintPanelProps) => {
  const completionPercent = Math.round(
    (Object.keys(inputs).filter(k => Object.keys(inputs[Number(k)]).length > 0).length / TOTAL_LAYERS) * 100
  );

  return (
    <div className="w-full lg:w-[300px] shrink-0 lg:border-r border-border lg:h-full overflow-y-auto p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <h2 className="font-display text-lg text-foreground">Jouw Blueprint</h2>
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
        </span>
      </div>

      {/* Blueprint sections */}
      <div className="flex-1 space-y-3">
        <AnimatePresence>
          {LAYERS.map((layer) => {
            const layerInputs = inputs[layer.id] || {};
            const hasContent = Object.keys(layerInputs).length > 0;
            const isLocked = layer.id > currentLayer;

            if (isLocked) {
              return (
                <div key={layer.id} className="relative p-3 rounded-lg bg-card border border-border opacity-40">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">0{layer.id}</span>
                    <span className="text-xs text-muted-foreground">{layer.title}</span>
                    <svg className="w-3 h-3 text-muted-foreground ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              );
            }

            return (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="p-3.5 rounded-lg bg-card border border-border"
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary">0{layer.id}</span>
                  <span className="text-[13px] font-medium text-foreground leading-tight">{layer.title}</span>
                </div>
                {hasContent ? (
                  <div className="text-[11.5px] font-mono text-muted-foreground whitespace-pre-wrap leading-[1.7] tracking-wide">
                    {layer.blueprintTemplate(layerInputs)}
                  </div>
                ) : (
                  <p className="text-[11px] text-muted-foreground/60 italic font-body">Nog niet ingevuld...</p>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Score + progress */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-muted-foreground">Voortgang</span>
          <span className="text-xs font-mono text-primary">{completionPercent}%</span>
        </div>
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="mt-3 text-center">
          <span className="font-mono text-2xl font-medium text-primary">{score}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
    </div>
  );
};

export default BlueprintPanel;
