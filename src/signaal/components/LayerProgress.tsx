import { TOTAL_LAYERS } from "../data/layers";

interface LayerProgressProps {
  currentLayer: number;
  completedLayers: number[];
}

const LayerProgress = ({ currentLayer, completedLayers }: LayerProgressProps) => {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: TOTAL_LAYERS }, (_, i) => {
        const layerNum = i + 1;
        const isCompleted = completedLayers.includes(layerNum);
        const isCurrent = layerNum === currentLayer;
        const isLocked = layerNum > currentLayer && !isCompleted;

        return (
          <div
            key={layerNum}
            className={`
              flex items-center justify-center w-10 h-10 rounded-full text-sm font-mono font-medium transition-all duration-300
              ${isCurrent ? 'bg-[#E8FF47] text-[#0A0A0B] shadow-[0_0_20px_rgba(232,255,71,0.3)]' : ''}
              ${isCompleted ? 'bg-[#E8FF47]/20 text-[#E8FF47] border border-[#E8FF47]/40' : ''}
              ${isLocked ? 'bg-[#111113] text-[#6B6B72] border border-[#1E1E22]' : ''}
            `}
          >
            {isCompleted ? '●' : ''} {String(layerNum).padStart(2, '0')}
          </div>
        );
      })}
    </div>
  );
};

export default LayerProgress;
