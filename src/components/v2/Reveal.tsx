import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Scroll-reveal: 14px omhoog plus fade zodra het element in beeld komt, met
 * 70ms stagger via `index` (herhaalt per vier).
 *
 * Alles wat bij het laden al in beeld staat blijft gewoon staan, dus geen
 * flits en geen lege secties voor crawlers: de animatie wordt pas aangezet
 * voor elementen die onder de vouw beginnen.
 */
export function Reveal({
  index = 0,
  className = "",
  children,
}: {
  index?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!reduced && el && el.getBoundingClientRect().top > window.innerHeight) {
      setAnimate(true);
    }
  }, [reduced]);

  if (!animate) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: (index % 4) * 0.07 }}
    >
      {children}
    </motion.div>
  );
}
