import { motion } from "framer-motion";
import { ArrowRight, Zap, BarChart3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import CtaLink from "@/components/CtaLink";

const PROOF = [
  { icon: Zap, title: "Sneller pipeline", sub: "meetings die tellen" },
  { icon: BarChart3, title: "Meetbaar & schaalbaar", sub: "duidelijke ROI" },
  { icon: Users, title: "Minder afhankelijk", sub: "van handwerk" },
];

const ExactHero = () => (
  <section className="relative pt-28 md:pt-36 pb-12 overflow-hidden">
    <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-glow)" }} />
    <div className="container mx-auto px-4 md:px-6 relative text-center flex flex-col items-center">
      {/* Left text - now centered */}
      <motion.div 
        initial={{ opacity: 0, y: 14 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="max-w-4xl flex flex-col items-center"
      >
        <p className="text-primary font-display font-semibold text-xs tracking-[0.22em] uppercase mb-6">
          Voor B2B-bedrijven klaar om te groeien zonder groter te worden
        </p>
        <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-[1.02] mb-6">
          Tomorrow's
          <br />
          Revenue Engine.
          <br />
          <span className="font-serif italic font-semibold text-gradient">Built Today.</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
          Wij bouwen een B2B-groeimachine die signalen, content en outreach samenbrengt tot meetings, pipeline en schaalbare groei.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <Button variant="hero" size="lg" asChild>
            <CtaLink intent="gratisScan" location="Hoe het werkt v2 — hero" />
          </Button>
          <a
            href="#aanpak"
            className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-card/50 px-5 py-3 text-sm font-display font-semibold text-foreground hover:border-primary/60 transition-colors"
          >
            Bekijk de aanpak
            <ArrowRight className="h-4 w-4 text-primary" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-3xl w-full border-t border-primary/10 pt-8">
          {PROOF.map((p) => (
            <div key={p.title} className="flex flex-col items-center text-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-primary/30 bg-primary/10">
                <p.icon className="h-4 w-4 text-primary" strokeWidth={1.8} />
              </span>
              <div>
                <p className="font-display font-semibold text-sm text-foreground leading-tight">{p.title}</p>
                <p className="text-xs text-muted-foreground leading-tight mt-1">{p.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default ExactHero;