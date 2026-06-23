import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Run a GSAP timeline when the ref enters the viewport. Pauses off-screen.
 * Respects prefers-reduced-motion (skips the timeline; final state via build()).
 */
export function useFlowTimeline(
  ref: React.RefObject<HTMLElement>,
  build: (tl: gsap.core.Timeline, el: HTMLElement) => void,
  deps: unknown[] = []
) {
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      build(tl, el);
      tlRef.current = tl;
      if (reduced) {
        tl.progress(1).pause();
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) tl.play();
            else tl.pause();
          }
        },
        { threshold: 0.25 }
      );
      io.observe(el);
      return () => io.disconnect();
    }, el);

    return () => {
      ctx.revert();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Prepare an SVG path for "draw" animation (full dash, offset = length). */
export function primePath(path: SVGPathElement) {
  const len = path.getTotalLength();
  path.style.strokeDasharray = String(len);
  path.style.strokeDashoffset = String(len);
  return len;
}

/** Place a circle on a path at progress t (0..1). */
export function pointOnPath(path: SVGPathElement, t: number) {
  const len = path.getTotalLength();
  return path.getPointAtLength(Math.max(0, Math.min(1, t)) * len);
}