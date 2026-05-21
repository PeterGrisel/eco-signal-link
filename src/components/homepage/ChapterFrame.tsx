import { ReactNode } from "react";
import { motion } from "framer-motion";

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
      data-dock-hide
      className={`relative py-24 md:py-32 ${solid ? "bg-background/60" : ""}`}
    >
      <div className="container max-w-6xl mx-auto px-4 md:px-6">
        {/* Glass-card header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="group relative mx-auto max-w-3xl rounded-2xl bg-background/55 border border-foreground/10 px-6 py-8 md:px-10 md:py-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] text-center mb-14 md:mb-20 overflow-hidden"
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
        </motion.div>

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          {children}
        </motion.div>

        {closing && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 md:mt-20 text-center"
          >
            <p className="font-display text-2xl md:text-3xl text-foreground/90 leading-snug max-w-3xl mx-auto [text-wrap:balance] [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]">
              {closing}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}