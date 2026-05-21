import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "end 20%"],
  });
  const opacity = useTransform(scrollYProgress, [0.18, 0.42, 0.78], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0.18, 0.52], [80, 0]);
  const scale = useTransform(scrollYProgress, [0.18, 0.58], [0.9, 1]);
  const blur = useTransform(scrollYProgress, [0.18, 0.58], [18, 0]);

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
    <div ref={sectionRef} className="relative w-full min-h-[135vh] flex items-center justify-center py-40 md:py-56">
      <div className="container mx-auto px-4 md:px-6">
        <motion.p
          style={{ opacity, y, scale, filter: useTransform(blur, (v) => `blur(${v}px)`) }}
          className="mx-auto max-w-5xl text-center font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight text-foreground leading-[1.05] [text-wrap:balance] [text-shadow:0_2px_24px_rgba(0,0,0,0.7),0_0_80px_rgba(232,148,90,0.18)]"
        >
          {words.map((w, i) => (
            <motion.span
              key={`${w}-${i}`}
              className="inline-block mx-[0.18em] will-change-transform"
              style={{
                opacity: useTransform(scrollYProgress, [0.24 + i * 0.018, 0.38 + i * 0.018], [0, 1]),
                y: useTransform(scrollYProgress, [0.24 + i * 0.018, 0.44 + i * 0.018], [36, 0]),
              }}
            >
              {w}
            </motion.span>
          ))}
        </motion.p>
      </div>
    </div>
  );
}