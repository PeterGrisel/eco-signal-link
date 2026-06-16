import { motion } from "framer-motion";
import Chapter04Schaal from "@/components/homepage/chapters/Chapter04Schaal";

const CaseStudiesSection = () => {
  return (
    <section id="section-cases" className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 max-w-2xl"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Bewijs
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-tight">
            Cijfers,
            <br />
            <span className="text-gradient">geen beloftes.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-6">
            We werken met een rekenmodel, niet met loze claims. Zo ziet u vooraf
            wat het systeem voor uw markt kan betekenen.
          </p>
        </motion.div>

        {/* Interactief rekenmodel — direct inline */}
        <div className="mb-12 -mx-4 md:-mx-6">
          <Chapter04Schaal />
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
