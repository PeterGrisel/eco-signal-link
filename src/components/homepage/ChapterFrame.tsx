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
  tone?: "cool" | "neutral" | "warm";
}

const toneGradient: Record<NonNullable<ChapterFrameProps["tone"]>, string> = {
  cool: "from-transparent via-primary/[0.025] to-transparent",
  neutral: "from-transparent via-foreground/[0.02] to-transparent",
  warm: "from-transparent via-primary/[0.05] to-transparent",
};

export default function ChapterFrame({
  number,
  eyebrow,
  title,
  intro,
  closing,
  children,
  id,
  tone = "neutral",
}: ChapterFrameProps) {
  return (
    <section
      id={id}
      className={`relative py-24 md:py-32 bg-gradient-to-b ${toneGradient[tone]}`}
    >
      <div className="container max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-baseline gap-6 mb-6">
            <span className="font-display text-5xl md:text-6xl font-light text-primary/40 tabular-nums leading-none">
              {number}
            </span>
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {eyebrow}
            </span>
          </div>

          <h2 className="font-display text-4xl md:text-6xl font-medium leading-[1.05] mb-6 text-foreground max-w-4xl">
            {title}
          </h2>

          {intro && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-16">
              {intro}
            </p>
          )}
        </motion.div>

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
            className="mt-20 pt-10 border-t border-foreground/10"
          >
            <p className="font-display text-2xl md:text-3xl text-foreground/90 leading-snug max-w-3xl">
              {closing}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}