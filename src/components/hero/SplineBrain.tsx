import { useEffect, useRef, useState } from "react";

/**
 * Lazy Spline particle-brain iframe — mounts when the hero is on screen.
 * Falls back to a soft radial glow before/while loading and on reduced-motion.
 */
export default function SplineBrain({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
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
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, hsl(23 80% 55% / 0.35) 0%, hsl(23 80% 45% / 0.12) 30%, transparent 65%)",
          opacity: loaded && !reduced ? 0 : 1,
        }}
      />
      {mount && !reduced && (
        <iframe
          src="https://my.spline.design/particleaibrain-WUFOLmm71YjH5Fiu45taNkF0/"
          title="AI brein"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="absolute inset-0 w-full h-full border-0 transition-opacity duration-700"
          style={{ pointerEvents: "none", opacity: loaded ? 1 : 0 }}
          allow="autoplay"
        />
      )}
    </div>
  );
}