import { motion, useScroll, useSpring } from "framer-motion";

/** Dunne accentbalk onderin de sticky navigatie. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 34 });
  return (
    <motion.span
      aria-hidden
      className="absolute bottom-[-1px] left-0 h-[2px] w-full origin-left bg-brand-accent"
      style={{ scaleX }}
    />
  );
}
