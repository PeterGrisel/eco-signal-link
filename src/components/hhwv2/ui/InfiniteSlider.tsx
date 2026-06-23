import { ReactNode } from "react";

interface Props {
  items: ReactNode[];
  speed?: number;
  className?: string;
}

const edgeFade =
  "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)";

const InfiniteSlider = ({ items, speed = 35, className }: Props) => {
  const all = [...items, ...items];
  return (
    <div
      className={`group relative overflow-hidden ${className ?? ""}`}
      style={{ maskImage: edgeFade, WebkitMaskImage: edgeFade }}
    >
      <div
        className="flex w-max items-center gap-4 md:gap-6 animate-marquee group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speed}s` }}
      >
        {all.map((node, i) => (
          <div key={i} className="shrink-0">
            {node}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteSlider;