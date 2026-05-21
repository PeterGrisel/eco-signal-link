import { useEffect, useRef, useState } from "react";
import { TextEffect } from "@/components/ui/text-effect";

/**
 * Cinematic word-by-word reveal between acts. Triggers once when scrolled
 * into view (IntersectionObserver) — no scroll-linked transforms, so no jank.
 */
export default function ActBridge({
  text,
  label,
}: {
  text?: string;
  label?: string;
  startDelay?: number;
  step?: number;
}) {
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

  const ref = useRef<HTMLDivElement>(null);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTrigger(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full min-h-[100vh] flex items-center justify-center py-32 md:py-48"
    >
      <div className="container mx-auto px-4 md:px-6">
        <TextEffect
          per="word"
          as="p"
          preset="blur"
          trigger={trigger}
          delay={0.1}
          className="mx-auto max-w-5xl text-center font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight text-foreground leading-[1.05] [text-wrap:balance] [text-shadow:0_2px_24px_rgba(0,0,0,0.7),0_0_80px_rgba(232,148,90,0.18)]"
        >
          {text}
        </TextEffect>
      </div>
    </div>
  );
}