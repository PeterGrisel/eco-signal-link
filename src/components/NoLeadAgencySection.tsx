import { motion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { COPY } from "@/content/copy";

const NoLeadAgencySection = () => {
  const { eyebrow, heading, headingAccent, body, contrasts } = COPY.noLeadAgency;

  return (
    <section className="py-16 md:py-24 border-b border-border/30 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
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
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] mb-5">
            {heading}
            <br />
            <span className="text-gradient">{headingAccent}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
            {body}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/40 rounded-2xl overflow-hidden border border-border/40">
          {contrasts.map((c, i) => (
            <motion.div
              key={c.from}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="bg-card p-7 md:p-9 flex flex-col gap-5"
            >
              <span className="font-mono text-xs text-muted-foreground/70 tracking-widest">
                0{i + 1} / 03
              </span>
              <div className="flex items-start gap-3 text-muted-foreground/80 line-through decoration-muted-foreground/40">
                <X className="w-4 h-4 text-muted-foreground/60 mt-1 shrink-0" />
                <span className="text-sm leading-relaxed">{c.from}</span>
              </div>
              <div className="flex items-start gap-3 mt-auto pt-4 border-t border-border/50">
                <ArrowRight className="w-4 h-4 text-primary mt-1 shrink-0" />
                <span className="font-display font-semibold text-base md:text-lg text-foreground leading-snug">
                  {c.to}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NoLeadAgencySection;