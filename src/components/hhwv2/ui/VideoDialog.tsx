import { Play } from "lucide-react";
import { useState } from "react";

interface Props {
  poster?: string;
  onPlay?: () => void;
}

const VideoDialog = ({ poster, onPlay }: Props) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onPlay}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative w-full aspect-video rounded-2xl overflow-hidden border border-primary/30 card-gradient shadow-[0_0_80px_hsl(var(--primary)/0.18)] focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label="Bekijk introductievideo"
    >
      {poster ? (
        <img
          src={poster}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-card to-background" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="relative flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_60px_hsl(var(--primary)/0.6)] transition-transform group-hover:scale-110">
          <Play className="h-8 w-8 md:h-10 md:w-10 ml-1" fill="currentColor" strokeWidth={0} />
          <span
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              boxShadow: hovered
                ? "0 0 0 10px hsl(var(--primary) / 0.18), 0 0 0 22px hsl(var(--primary) / 0.08)"
                : "0 0 0 6px hsl(var(--primary) / 0.12), 0 0 0 14px hsl(var(--primary) / 0.05)",
              transition: "box-shadow 0.4s ease",
            }}
          />
        </span>
      </div>
      <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-xs text-foreground/80">
        <span className="font-display font-semibold tracking-[0.18em] uppercase">9:38</span>
        <span className="font-display font-semibold tracking-[0.18em] uppercase">Hoe wij het bouwen</span>
      </div>
    </button>
  );
};

export default VideoDialog;