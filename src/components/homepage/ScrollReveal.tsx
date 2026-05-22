import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Scroll-reveal wrapper: kantelt licht naar voren en schaalt op
 * terwijl de sectie de viewport binnenkomt. Inspired by Aceternity
 * container-scroll, maar subtieler zodat we hem kunnen stapelen.
 */
export default function ScrollReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [0.55, 0.95, 1]);

  if (prefersReduced) {
    return <div ref={ref}>{children}</div>;
  }

  return (
    <div ref={ref} style={{ perspective: 1400 }}>
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          transformOrigin: "center top",
          willChange: "transform, opacity",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}