import { motion } from "framer-motion";

/**
 * Visuele transitie tussen acts — geen harde section-break.
 * Gradient fade + dunne lijn die verbindt.
 */
export default function ActBridge({ label }: { label?: string }) {
  return (
    <div className="relative h-32 md:h-40 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
      {label && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-background/80 backdrop-blur-sm border border-foreground/10 rounded-full px-4 py-1.5"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
        </motion.div>
      )}
    </div>
  );
}