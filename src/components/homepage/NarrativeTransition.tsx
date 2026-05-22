import { motion } from "framer-motion";

/**
 * Subtiele overgangsregel tussen hoofdstukken.
 * Begeleidt de bezoeker door pijn → droom → bewijs → methode → snelheid.
 */
export default function NarrativeTransition({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative py-16 md:py-24">
      <div className="container mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center font-serif italic text-lg md:text-xl leading-relaxed text-foreground/70"
        >
          {children}
        </motion.p>
        <div className="mx-auto mt-8 h-px w-16 bg-primary/40" />
      </div>
    </section>
  );
}