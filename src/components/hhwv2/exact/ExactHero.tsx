import { motion } from "framer-motion";
import { ArrowRight, Zap, BarChart3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import CtaLink from "@/components/CtaLink";
import ExactFlowChart from "./ExactFlowChart";

const PROOF = [
  { icon: Zap, title: "Sneller pipeline", sub: "meetings die tellen" },
  { icon: BarChart3, title: "Meetbaar & schaalbaar", sub: "duidelijke ROI" },
  { icon: Users, title: "Minder afhankelijk", sub: "van handwerk" },
];

const ExactHero = () => (
  <section className="relative pt-28 md:pt-36 pb-12 md:pb-16 overflow-hidden">
    <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-glow)" }} />
    <div className="container mx-auto px-4 md:px-6 relative">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* Left text */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
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
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-xl">
            Wij bouwen een B2B-groeimachine die signalen, content en outreach samenbrengt tot meetings, pipeline en schaalbare groei.
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-10">
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
          <div className="grid grid-cols-3 gap-4 max-w-lg">
            {PROOF.map((p) => (
              <div key={p.title} className="flex flex-col gap-1.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-md border border-primary/30 bg-primary/10">
                  <p.icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />
                </span>
                <p className="font-display font-semibold text-xs text-foreground leading-tight">{p.title}</p>
                <p className="text-[11px] text-muted-foreground leading-tight">{p.sub}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right flow chart */}
        <div className="relative">
          <ExactFlowChart />
        </div>
      </div>
    </div>
  </section>
);

export default ExactHero;