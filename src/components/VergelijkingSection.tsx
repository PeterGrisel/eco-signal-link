import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { COPY } from "@/content/copy";

const VergelijkingSection = () => {
  const { eyebrow, heading, headingAccent, body, standaard, groeimachine } = COPY.vergelijking;
  return (
    <section className="py-20 md:py-28 border-b border-border/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-12 md:mb-14"
        >
          <p className="text-primary font-display font-semibold text-xs tracking-[0.25em] uppercase mb-5">
            {eyebrow}
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight leading-[1.05]">
            {heading} <span className="text-gradient">{headingAccent}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mt-5">
            {body}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-border/40 bg-card/30 p-6 md:p-8"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground/70 mb-2">
              {standaard.tag}
            </p>
            <h3 className="font-display font-semibold text-xl md:text-2xl tracking-tight mb-6 text-muted-foreground">
              {standaard.title}
            </h3>
            <ul className="space-y-3 mb-6">
              {standaard.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm md:text-base text-muted-foreground/90 leading-relaxed">
                  <X className="w-4 h-4 mt-1 shrink-0 text-muted-foreground/50" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs md:text-sm font-medium text-muted-foreground/80 pt-4 border-t border-border/30">
              {standaard.footer}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="rounded-2xl border border-primary/40 bg-card/60 backdrop-blur-sm p-6 md:p-8 md:shadow-[0_0_40px_-12px_hsl(var(--primary)/0.3)]"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2">
              {groeimachine.tag}
            </p>
            <h3 className="font-display font-semibold text-xl md:text-2xl tracking-tight mb-6 text-foreground">
              {groeimachine.title}
            </h3>
            <ul className="space-y-3 mb-6">
              {groeimachine.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm md:text-base text-foreground/90 leading-relaxed">
                  <Check className="w-4 h-4 mt-1 shrink-0 text-primary" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs md:text-sm font-semibold text-primary pt-4 border-t border-primary/20">
              {groeimachine.footer}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VergelijkingSection;