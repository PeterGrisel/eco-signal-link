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
          <div className="relative bg-background/80 backdrop-blur-sm border border-foreground/10 rounded-full px-4 py-1.5">
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
    <div className="relative w-full py-16 md:py-24">
      <style>{`
        @keyframes wr-word-appear {
          0% { opacity: 0; transform: translateY(24px) scale(0.92); filter: blur(8px); }
          60% { opacity: 0.85; transform: translateY(6px) scale(0.98); filter: blur(2px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .wr-word {
          display: inline-block;
          opacity: 0;
          margin: 0 0.18em;
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
          className="mx-auto max-w-2xl text-center font-body text-base md:text-xl font-light italic tracking-normal text-foreground/75 leading-[1.7]"
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
import { motion } from "framer-motion";

/**
 * Visuele transitie tussen acts — geen harde section-break.
 * Gradient fade + dunne lijn die verbindt.
 */
export default function ActBridge({ label }: { label?: string }) {
  return (
    <div className="relative h-32 md:h-40 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
      {label && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-background/80 backdrop-blur-sm border border-foreground/10 rounded-full px-4 py-1.5"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
        </motion.div>
      )}
    </div>
  );
}