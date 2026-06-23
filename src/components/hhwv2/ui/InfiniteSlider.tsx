import { ReactNode } from "react";

interface Props {
  items: ReactNode[];
  speed?: number;
  className?: string;
}

const InfiniteSlider = ({ items, speed = 35, className }: Props) => {
  const all = [...items, ...items];
  return (
    <div className={`group relative overflow-hidden ${className ?? ""}`}>
      <div
        className="flex w-max gap-3 animate-marquee group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speed}s` }}
      >
        {all.map((node, i) => (
          <div key={i} className="shrink-0">
            {node}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
};

export default InfiniteSlider;