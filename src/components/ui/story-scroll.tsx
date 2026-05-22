import React, { useRef, type ReactNode, type CSSProperties } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export interface FlowSectionProps {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  "aria-label"?: string;
}

/**
 * FlowSection — marker wrapper. Geconsumeerd door FlowArt; render zelf niets
 * speciaals zodat het ook standalone werkt (fallback bij reduced motion).
 */
export const FlowSection: React.FC<FlowSectionProps> = ({
  className,
  style,
  children,
  "aria-label": ariaLabel,
}) => (
  <section aria-label={ariaLabel} className={cx("relative w-full", className)} style={style}>
    {children}
  </section>
);

export interface FlowArtProps {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}

/**
 * Story-scroll: zelfde mechaniek als de side-scroller.
 * Eén tall wrapper van N×100vh, sticky viewport, elke sectie krijgt
 * precies één viewport-scroll om binnen te kantelen vanuit linksonder.
 */
function PinnedPanel({
  index,
  total,
  scrollYProgress,
  children,
}: {
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  children: ReactNode;
}) {
  // Eerste sectie staat altijd plat; volgende kantelt in tussen (i-1)/total en i/total.
  const start = Math.max(0, (index - 1) / total);
  const end = index / total;

  const rotate = useTransform(
    scrollYProgress,
    [start, end],
    [index === 0 ? 0 : 30, 0],
    { clamp: true }
  );
  const opacity = useTransform(
    scrollYProgress,
    [start, start + (end - start) * 0.15, end],
    [index === 0 ? 1 : 0.2, 1, 1],
    { clamp: true }
  );

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      style={{
        zIndex: index + 1,
        rotate,
        opacity,
        transformOrigin: "bottom left",
        willChange: "transform, opacity",
      }}
    >
      <div className="w-full h-full overflow-y-auto overflow-x-hidden flex items-center justify-center bg-background">
        <div className="w-full">{children}</div>
      </div>
    </motion.div>
  );
}

const FlowArt: React.FC<FlowArtProps> = ({
  children,
  className,
  "aria-label": ariaLabel = "Story scroll",
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Filter alleen direct FlowSection-children
  const panels = React.Children.toArray(children).filter(Boolean) as React.ReactElement[];
  const total = panels.length;

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  if (reduced || total === 0) {
    return (
      <div className={cx("relative w-full", className)} aria-label={ariaLabel}>
        {panels}
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      aria-label={ariaLabel}
      className={cx("relative w-full overflow-x-clip", className)}
      style={{ height: `${total * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {panels.map((panel, i) => (
          <PinnedPanel
            key={i}
            index={i}
            total={total}
            scrollYProgress={scrollYProgress}
          >
            {panel}
          </PinnedPanel>
        ))}
      </div>
    </div>
  );
};

export default FlowArt;