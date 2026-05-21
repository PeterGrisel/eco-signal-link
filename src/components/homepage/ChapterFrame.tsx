import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ChapterFrameProps {
  number: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  closing?: ReactNode;
  children: ReactNode;
  id?: string;
  /** Legacy — ignored. All chapters now transparent on shared ambient stage. */
  tone?: "cool" | "neutral" | "warm";
  /** Force opaque section bg (rarely needed). */
  solid?: boolean;
}

function ScrollReveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 88%", "center 45%"] });
  const opacity = useTransform(scrollYProgress, [0.08 + delay, 0.48 + delay], [0.12, 1]);
  const y = useTransform(scrollYProgress, [0.08 + delay, 0.5 + delay], [42, 0]);
  const blur = useTransform(scrollYProgress, [0.08 + delay, 0.52 + delay], [10, 0]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <motion.div ref={ref} style={{ opacity, y, filter }} className={`relative ${className}`}>
      {children}
    </motion.div>
  );
}

/**
 * Cinematic chapter frame — glass-card header (max-w-3xl,),
 * centered, floats above a shared ambient background.
 */
export default function ChapterFrame({
  number,
  eyebrow,
  title,
  intro,
  closing,
  children,
  id,
  solid = false,
}: ChapterFrameProps) {
  return (
    <section
      id={id}
      className={`relative py-24 md:py-32 ${solid ? "bg-background/60" : ""}`}
    >
      <div className="container max-w-6xl mx-auto px-4 md:px-6 md:pl-24 lg:pl-28">
        {/* Glass-card header */}
        <ScrollReveal
          className="group glass-readability relative mx-auto max-w-3xl rounded-2xl bg-card/85 backdrop-blur-xl shadow-lg border border-foreground/10 px-6 py-8 md:px-10 md:py-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] text-center mb-14 md:mb-20 overflow-hidden"
        >
          {/* GlassCard accent line — top primary gradient */}
          <span
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent"
          />
          {/* Subtle hover glow */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.04] transition-colors duration-500"
          />
          <div className="relative">
          <div className="flex items-center justify-center mb-5">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary">
              {eyebrow.replace(/^Stap\s+\d+(\s*[—-]\s*\d+)?\s*·\s*/i, "")}
            </span>
          </div>

          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-medium leading-[1.05] mb-4 text-foreground [text-wrap:balance] [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]">
            {title}
          </h2>

          {intro && (
            <p className="text-base md:text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]">
              {intro}
            </p>
          )}
          </div>
        </ScrollReveal>

        {/* Body */}
        <ScrollReveal delay={0.06}>
          {children}
        </ScrollReveal>

      </div>

      {closing && (
        <div className="relative min-h-[125vh] flex items-center justify-center px-4 md:px-6 mt-20 md:mt-32">
          <ScrollReveal className="font-display font-bold text-center text-5xl md:text-7xl lg:text-8xl leading-[0.98] tracking-tight text-foreground max-w-6xl [text-wrap:balance] [text-shadow:0_2px_24px_rgba(0,0,0,0.75),0_0_90px_rgba(232,148,90,0.22)]">
            <p>{closing}</p>
          </ScrollReveal>
        </div>
      )}
    </section>
  );
}