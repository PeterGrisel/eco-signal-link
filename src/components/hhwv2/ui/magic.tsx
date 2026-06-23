/**
 * Premium effect primitives (MagicUI / 21st.dev-stijl), aangepast aan onze
 * design tokens. Allemaal puur CSS/React, geen externe runtime nodig.
 */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView } from "framer-motion";

/* ---------------- BorderBeam ----------------
 * Een licht dat langs de rand van een afgeronde container reist.
 * Plaats binnen een `relative` element met afgeronde hoeken. */
export const BorderBeam = ({
  size = 200,
  duration = 10,
  delay = 0,
  className = "",
  colorFrom = "hsl(var(--primary))",
  colorTo = "hsl(45 95% 65%)",
}: {
  size?: number;
  duration?: number;
  delay?: number;
  className?: string;
  colorFrom?: string;
  colorTo?: string;
}) => (
  <div
    aria-hidden
    className={`pointer-events-none absolute inset-0 rounded-[inherit] [border:1px_solid_transparent] [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(#000,#000)] ${className}`}
  >
    <div
      className="absolute aspect-square animate-border-beam bg-gradient-to-l from-[var(--cf)] via-[var(--ct)] to-transparent"
      style={
        {
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          "--cf": colorFrom,
          "--ct": colorTo,
          "--duration": duration,
          animationDelay: `-${delay}s`,
        } as CSSProperties
      }
    />
  </div>
);

/* ---------------- Meteors ---------------- */
export const Meteors = ({ number = 16 }: { number?: number }) => {
  const [items, setItems] = useState<{ left: string; delay: string; dur: string }[]>([]);
  useEffect(() => {
    setItems(
      Array.from({ length: number }, () => ({
        left: `${Math.floor(Math.random() * 100)}%`,
        delay: `${(Math.random() * 5).toFixed(2)}s`,
        dur: `${(Math.random() * 4 + 3).toFixed(2)}s`,
      })),
    );
  }, [number]);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden>
      {items.map((m, i) => (
        <span
          key={i}
          className="absolute top-0 h-0.5 w-0.5 animate-meteor rounded-full bg-primary shadow-[0_0_6px_2px_hsl(var(--primary)/0.3)]"
          style={{ left: m.left, animationDelay: m.delay, animationDuration: m.dur }}
        >
          <span className="absolute top-1/2 -z-10 h-px w-[60px] -translate-y-1/2 bg-gradient-to-r from-primary to-transparent" />
        </span>
      ))}
    </div>
  );
};

/* ---------------- Spotlight (volgt de muis) ----------------
 * Plaats binnen een `relative overflow-hidden` element. */
export const Spotlight = ({
  size = 420,
  fill = "hsl(var(--primary) / 0.12)",
}: {
  size?: number;
  fill?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, opacity: 0 });
  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top, opacity: 1 });
    };
    const leave = () => setPos((p) => ({ ...p, opacity: 0 }));
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
      style={{
        opacity: pos.opacity,
        background: `radial-gradient(${size}px circle at ${pos.x}px ${pos.y}px, ${fill}, transparent 70%)`,
      }}
    />
  );
};

/* ---------------- DotPattern (gemaskeerde achtergrond) ---------------- */
export const DotPattern = ({
  className = "",
  mask = "radial-gradient(ellipse 75% 60% at 50% 0%, #000 35%, transparent 100%)",
  opacity = 0.15,
  gap = 24,
}: {
  className?: string;
  mask?: string;
  opacity?: number;
  gap?: number;
}) => (
  <div
    aria-hidden
    className={`pointer-events-none absolute inset-0 ${className}`}
    style={{
      backgroundImage: `radial-gradient(hsl(var(--primary) / ${opacity}) 1px, transparent 1px)`,
      backgroundSize: `${gap}px ${gap}px`,
      maskImage: mask,
      WebkitMaskImage: mask,
    }}
  />
);

/* ---------------- NumberTicker (telt op bij in-view) ---------------- */
export const NumberTicker = ({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1400,
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);
  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString("nl-NL", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};
