import { ChevronRight } from "lucide-react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

/** ColdIQ-stijl pill met subtle border-glow loop. */
const AnnouncementPill = ({ children, className }: Props) => (
  <span
    className={`group relative inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/5 px-4 py-1.5 text-[11px] font-display font-semibold tracking-[0.18em] uppercase text-primary/90 backdrop-blur ${className ?? ""}`}
  >
    <span className="ap-glow pointer-events-none absolute inset-0 rounded-full" aria-hidden />
    <span className="relative">{children}</span>
    <ChevronRight className="relative h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} />
    <style>{`
      .ap-glow {
        box-shadow: 0 0 0 0 hsl(var(--primary) / 0.0);
        animation: ap-pulse 2.8s ease-in-out infinite;
      }
      @keyframes ap-pulse {
        0%, 100% { box-shadow: 0 0 0 0 hsl(var(--primary) / 0.0), inset 0 0 0 1px hsl(var(--primary) / 0.0); }
        50% { box-shadow: 0 0 24px 0 hsl(var(--primary) / 0.35), inset 0 0 0 1px hsl(var(--primary) / 0.25); }
      }
    `}</style>
  </span>
);

export default AnnouncementPill;