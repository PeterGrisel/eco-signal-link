import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CtaLink from "@/components/CtaLink";
import { CTA } from "@/content/copy";
import { Compass, ArrowRight, ArrowDown } from "lucide-react";
import { serviceLines } from "@/data/serviceLines";

const ease = [0.22, 1, 0.36, 1] as const;

const Hero = () => {
  return (
    <section className="relative pt-32 md:pt-40 pb-16 md:pb-20 overflow-hidden">
      {/* Bovenboog + glow, ingetogen (donker thema) */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-0 pointer-events-none h-[120%]"
      >
        <div
          className="absolute left-1/2 top-[-60%] h-[120%] w-[160%] -translate-x-1/2 rounded-[100%] border-t border-foreground/10"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 100%, hsl(var(--primary) / 0.16), transparent 70%)",
          }}
        />
      </div>

      <div className="container max-w-5xl mx-auto px-4 md:px-6 relative z-10 text-center">
        {/* Pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-card/70 backdrop-blur px-4 py-1.5 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.6)]">
            <span className="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Compass className="w-3 h-3 text-primary" strokeWidth={2} />
            </span>
            <span className="text-[10px] font-display font-semibold uppercase tracking-[0.22em] text-foreground/80">
              Voor ambitieuze B2B-bedrijven
            </span>
          </span>
        </motion.div>

        {/* Twee-toon headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.05 }}
          className="font-display text-[2.5rem] md:text-[4.25rem] lg:text-[5rem] leading-[1.02] tracking-tighter mb-6 [text-wrap:balance]"
        >
          <span className="font-bold text-foreground">Eén systeem</span>{" "}
          <span className="font-normal text-muted-foreground">voor</span>
          <br />
          <span className="font-bold text-gradient">voorspelbare groei.</span>
        </motion.h1>

        {/* Subkop */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.12 }}
          className="text-muted-foreground text-base md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Wij combineren AI-workflows met menselijke expertise. Van koopsignalen
          tot geboekte gesprekken, op uw eigen tools.
        </motion.p>

        {/* Eén CTA + ghost-link */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.18 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16 md:mb-24"
        >
          <Button variant="hero" size="lg" className="relative group" asChild>
            <CtaLink intent="gratisScan" location="Hero">
              <span className="absolute inset-0 rounded-md bg-primary/20 animate-pulse group-hover:animate-none" />
              {CTA.gratisScan.label}
            </CtaLink>
          </Button>
          <a
            href="#diensten"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Bekijk onze diensten
            <ArrowDown className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Onderbalk: dienst-pills + trust */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.28 }}
          className="flex flex-col lg:flex-row items-center justify-between gap-6 border-t border-border/40 pt-8"
        >
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {serviceLines.map((line) => (
              <Link
                key={line.slug}
                to={`/diensten/${line.slug}`}
                className="rounded-full border border-border/60 bg-card/50 px-3.5 py-1.5 text-xs font-medium text-foreground/80 hover:border-primary/40 hover:text-primary transition-colors"
              >
                {line.name}
              </Link>
            ))}
          </div>

          <a
            href="#diensten"
            className="group inline-flex items-center gap-2 text-left"
          >
            <span className="text-xs md:text-sm text-muted-foreground leading-snug max-w-[15rem]">
              Vertrouwd door snelgroeiende B2B-teams, van Yaskawa tot Leister
              Benelux
            </span>
            <span className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-colors">
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
