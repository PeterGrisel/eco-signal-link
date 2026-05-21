import { useEffect, useRef } from "react";

/**
 * Word-by-word reveal bridge between acts. Adapted from AI Fctry's WordRevealBridge.
 * Transparent background so the ambient stage shows through.
 */
export default function ActBridge({
  text,
  label,
  startDelay = 200,
  step = 90,
}: {
  /** Optional bridge text — words animate in with blur fade */
  text?: string;
  /** Legacy: small pill label. Used as fallback when text not provided. */
  label?: string;
  startDelay?: number;
  step?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const words = el.querySelectorAll<HTMLSpanElement>(".wr-word");
            words.forEach((w, i) => {
              const delay = startDelay + i * step;
              w.style.animation = `wr-word-appear 0.9s ease-out ${delay}ms forwards`;
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [startDelay, step]);

  if (!text) {
    return (
      <div className="relative h-24 md:h-32 flex items-center justify-center pointer-events-none">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
        {label && (
          <div className="relative bg-background/80 border border-foreground/10 rounded-full px-4 py-1.5">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {label}
            </span>
          </div>
        )}
      </div>
    );
  }

  const words = text.split(/\s+/);

  return (
    <div className="relative w-full min-h-[110vh] flex items-center justify-center py-32 md:py-48">
      <style>{`
        @keyframes wr-word-appear {
          0% { opacity: 0; transform: translateY(40px) scale(0.9); filter: blur(14px); }
          60% { opacity: 0.85; transform: translateY(8px) scale(0.98); filter: blur(3px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .wr-word {
          display: inline-block;
          opacity: 0;
          margin: 0 0.22em;
          transition: color 0.3s ease, transform 0.3s ease, text-shadow 0.3s ease;
          will-change: opacity, transform, filter;
        }
        .wr-word:hover {
          color: hsl(var(--primary));
          transform: translateY(-2px);
          text-shadow: 0 0 18px hsl(var(--primary) / 0.45);
        }
      `}</style>
      <div className="container mx-auto px-4 md:px-6">
        <p
          ref={ref}
          className="mx-auto max-w-5xl text-center font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight text-foreground leading-[1.05] [text-wrap:balance] [text-shadow:0_2px_24px_rgba(0,0,0,0.7),0_0_80px_rgba(232,148,90,0.18)]"
        >
          {words.map((w, i) => (
            <span key={`${w}-${i}`} className="wr-word">
              {w}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}