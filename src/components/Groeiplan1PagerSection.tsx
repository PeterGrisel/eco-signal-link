import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import CtaLink from "@/components/CtaLink";
import { COPY } from "@/content/copy";

const Groeiplan1PagerSection = () => {
  const g = COPY.groeiplan;
  return (
    <section id="groeiplan" className="py-16 md:py-32 relative">
      <div className="absolute inset-0 glow-bg pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 max-w-3xl"
        >
          <p className="text-primary font-display font-semibold text-xs md:text-sm tracking-[0.2em] uppercase mb-4">
            {g.eyebrow}
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
            {g.heading}{" "}
            <span className="text-gradient">{g.headingAccent}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4">
            {g.body}
          </p>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {g.bodyExtra}
          </p>
        </motion.div>

        {/* 9-cell grid met fase-labels */}
        <div className="grid lg:grid-cols-[140px_1fr] gap-6 md:gap-8 mb-16">
          {/* Desktop fase-kolom + cards rij voor rij */}
          {g.fases.map((fase, rowIdx) => (
            <div key={fase.label} className="contents">
              <div className="hidden lg:flex flex-col justify-center">
                <p className="font-display font-semibold text-xs tracking-[0.22em] uppercase text-primary">
                  {fase.label}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{fase.sub}</p>
              </div>
              <div className="lg:hidden mb-2 mt-2 first:mt-0">
                <p className="font-display font-semibold text-xs tracking-[0.22em] uppercase text-primary">
                  {fase.label} <span className="text-muted-foreground normal-case tracking-normal font-normal">· {fase.sub}</span>
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {g.cells.slice(rowIdx * 3, rowIdx * 3 + 3).map((c, i) => (
                  <motion.div
                    key={c.num}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="card-gradient border border-glow rounded-xl p-5 md:p-6"
                  >
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="font-display font-bold text-primary text-sm tracking-wider">
                        {c.num}
                      </span>
                      <h3 className="font-display font-bold text-base md:text-lg leading-snug">
                        {c.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-snug">
                      {c.q}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Flow: 3 stappen */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-12">
          {g.flow.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-gradient border border-glow rounded-xl p-6"
            >
              <div className="w-10 h-10 rounded-full border border-primary/40 bg-card flex items-center justify-center mb-4">
                <span className="font-display font-bold text-primary text-sm">{s.step}</span>
              </div>
              <h4 className="font-display font-bold text-base md:text-lg mb-2">{s.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="hero" size="lg" asChild>
            <CtaLink intent="gratisScan" location="Groeiplan 1-Pager">
              Plan uw 60-minuten Groeiplan-sessie →
            </CtaLink>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Groeiplan1PagerSection;