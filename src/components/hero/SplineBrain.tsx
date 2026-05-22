import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Lazy Spline particle-brain iframe — mounts when the hero is on screen.
 * Falls back to a soft radial glow before/while loading and on reduced-motion.
 */
export default function SplineBrain({ className = "" }: { className?: string }) {
  const [mount, setMount] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [reduced, setReduced] = useState(false);
  const isMobile = useIsMobile();
  const mobileFrameClass = isMobile ? "left-1/2 top-1/2 h-[34vh] w-[132vw]" : "inset-0 w-full h-full";
  const mobileFrameTransform = isMobile ? "translate(-50%, -50%) scale(0.56)" : "scale(1)";

  useEffect(() => {
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    setReduced(prefersReduced);
    setMount(!prefersReduced);
  }, []);

  return (
    <div className={className} style={{ pointerEvents: "none" }} aria-hidden>
      {/* Glow fallback (also visible while iframe loads / reduced motion) */}
      <div
        className={`absolute ${mobileFrameClass} transition-opacity duration-[1400ms] ease-out`}
        style={{
          background:
            "radial-gradient(circle at 50% 50%, hsl(23 80% 55% / 0.35) 0%, hsl(23 80% 45% / 0.12) 30%, transparent 65%)",
          opacity: loaded && !reduced ? 0.25 : 1,
          transform: mobileFrameTransform,
        }}
      />
      {mount && !reduced && (
        <iframe
          src="https://my.spline.design/particleaibrain-WUFOLmm71YjH5Fiu45taNkF0/"
          title="AI brein"
          loading="eager"
          onLoad={() => setLoaded(true)}
          className={`absolute ${mobileFrameClass} border-0 transition-opacity duration-[1600ms] ease-out`}
          style={{
            pointerEvents: "none",
            opacity: loaded ? 1 : 0,
            transform: mobileFrameTransform,
            transformOrigin: "center center",
          }}
          allow="autoplay"
        />
      )}
    </div>
  );
}