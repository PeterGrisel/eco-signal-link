import { TOTAL_LAYERS } from "../data/layers";

interface LayerProgressProps {
  currentLayer: number;
  completedLayers: number[];
  onLayerClick?: (layer: number) => void;
}

const LayerProgress = ({ currentLayer, completedLayers, onLayerClick }: LayerProgressProps) => {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: TOTAL_LAYERS }, (_, i) => {
        const layerNum = i + 1;
        const isCompleted = completedLayers.includes(layerNum);
        const isCurrent = layerNum === currentLayer;
        const isLocked = layerNum > currentLayer && !isCompleted;
        const isClickable = isCompleted || isCurrent;

        return (
          <button
            key={layerNum}
            disabled={!isClickable}
            onClick={() => isClickable && onLayerClick?.(layerNum)}
            className={`
              flex items-center justify-center w-10 h-10 rounded-full text-sm font-mono font-medium transition-all duration-300
              ${isCurrent ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(232,148,90,0.3)]' : ''}
              ${isCompleted ? 'bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30 cursor-pointer' : ''}
              ${isLocked ? 'bg-card text-muted-foreground border border-border cursor-not-allowed opacity-60' : ''}
            `}
          >
            {isCompleted ? '●' : ''} {String(layerNum).padStart(2, '0')}
          </button>
        );
      })}
    </div>
  );
};

export default LayerProgress;
