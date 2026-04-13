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
    <div className="w-[280px] shrink-0 border-r border-[#1E1E22] h-full overflow-y-auto p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <h2 className="font-['DM_Serif_Display'] text-lg text-[#F0F0EE]">Jouw Blueprint</h2>
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8FF47] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E8FF47]" />
        </span>
      </div>

      {/* Blueprint sections */}
      <div className="flex-1 space-y-4">
        <AnimatePresence>
          {LAYERS.map((layer) => {
            const layerInputs = inputs[layer.id] || {};
            const hasContent = Object.keys(layerInputs).length > 0;
            const isLocked = layer.id > currentLayer;

            if (isLocked) {
              return (
                <div key={layer.id} className="relative p-3 rounded-lg bg-[#111113] border border-[#1E1E22] opacity-40">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#6B6B72]">0{layer.id}</span>
                    <span className="text-xs text-[#6B6B72]">{layer.title}</span>
                    <svg className="w-3 h-3 text-[#6B6B72] ml-auto" fill="currentColor" viewBox="0 0 20 20">
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
                className="p-3 rounded-lg bg-[#111113] border border-[#1E1E22]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-[#E8FF47]">0{layer.id}</span>
                  <span className="text-xs font-medium text-[#F0F0EE]">{layer.title}</span>
                </div>
                {hasContent ? (
                  <pre className="text-[10px] font-mono text-[#6B6B72] whitespace-pre-wrap leading-relaxed">
                    {layer.blueprintTemplate(layerInputs)}
                  </pre>
                ) : (
                  <p className="text-[10px] text-[#6B6B72] italic">Nog niet ingevuld...</p>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Score + progress */}
      <div className="mt-6 pt-4 border-t border-[#1E1E22]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-[#6B6B72]">Voortgang</span>
          <span className="text-xs font-mono text-[#E8FF47]">{completionPercent}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#1E1E22] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#E8FF47] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="mt-3 text-center">
          <span className="font-mono text-2xl font-medium text-[#E8FF47]">{score}</span>
          <span className="text-xs text-[#6B6B72]">/100</span>
        </div>
      </div>
    </div>
  );
};

export default BlueprintPanel;
