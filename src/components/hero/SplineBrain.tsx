import { useEffect, useRef, useState } from "react";

/**
 * Lazy Spline particle-brain iframe — mounts when the hero is on screen.
 * Falls back to a soft radial glow before/while loading and on reduced-motion.
 * Square iframe edges are blended into the background with a radial vignette.
 */
export default function SplineBrain({ className = "" }: { className?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [mount, setMount] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMount(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={{ pointerEvents: "none" }} aria-hidden>
      {/* Glow fallback (also visible while iframe loads / reduced motion) */}
      <div
        className="absolute inset-0 w-full h-full transition-opacity duration-[1400ms] ease-out"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, hsl(23 80% 55% / 0.35) 0%, hsl(23 80% 45% / 0.12) 30%, transparent 65%)",
          opacity: loaded ? 0.25 : 1,
        }}
      />
      {mount && (
        <iframe
          src="https://my.spline.design/particleaibrain-WUFOLmm71YjH5Fiu45taNkF0/"
          title="AI brein"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full border-0 transition-opacity duration-[1600ms] ease-out"
          style={{ pointerEvents: "none", opacity: loaded ? 1 : 0 }}
          allow="autoplay"
        />
      )}
      {/* Vignette — blend square iframe edges into the dark background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, hsl(var(--background)) 85%)",
        }}
      />
    </div>
  );
}