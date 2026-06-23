import { motion } from "framer-motion";
import { TrendingUp, Users, MousePointerClick, UserPlus, Layers, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CtaLink from "@/components/CtaLink";
import GridCanvas from "./GridCanvas";
import { BgmIcon } from "@/components/icons/BgmIcon";

const SIGNALS = [
  { label: "Funding", icon: TrendingUp },
  { label: "Hiring", icon: UserPlus },
  { label: "Websitebezoek", icon: MousePointerClick },
  { label: "Job changes", icon: Users },
  { label: "Tech-stack", icon: Layers },
  { label: "Intent", icon: Target },
];

const HeroFlow = () => {
  return (
    <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
      <GridCanvas />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-primary/40 text-primary text-xs font-display font-semibold tracking-[0.2em] uppercase mb-6">
              AI-native groeisysteem
            </span>
            <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-[1.02] mb-6">
              Groei voorspelbaar
              <br />
              zonder meer
              <br />
              <span className="text-gradient">mensen aan te nemen.</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
              Wij bouwen het groeisysteem achter je sales en marketing. Neem het in 90 dagen over, of laat ons het draaien.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="hero" size="lg" asChild>
                <CtaLink intent="gratisScan" location="Hoe het werkt v2 — hero" />
              </Button>
              <a href="#engine" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
                Bekijk hoe het werkt
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Right: signal flow diagram */}
          <div className="relative h-[480px] md:h-[560px]">
            <SignalFlowDiagram />
          </div>
        </div>
      </div>
    </section>
  );
};

const SignalFlowDiagram = () => {
  // Layout: 6 signal nodes across the top, lines converging to central engine
  return (
    <div className="relative w-full h-full">
      {/* SVG layer for connecting lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 560" preserveAspectRatio="none">
        {SIGNALS.map((_, i) => {
          const x = 50 + (i * 500) / 5;
          return (
            <motion.path
              key={i}
              d={`M ${x} 80 Q ${x} 280, 300 400`}
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              fill="none"
              strokeOpacity={0.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.4, delay: 0.3 + i * 0.1, ease: "easeInOut" }}
            />
          );
        })}
      </svg>

      {/* Signal nodes */}
      <div className="absolute top-0 left-0 right-0 grid grid-cols-3 md:grid-cols-6 gap-3">
        {SIGNALS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[9px] font-display font-semibold tracking-[0.18em] uppercase text-primary/80">
              {s.label}
            </span>
            <div className="w-12 h-12 rounded-xl bg-card border border-primary/40 flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.25)]">
              <s.icon className="w-5 h-5 text-primary" strokeWidth={1.8} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Central engine node */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="absolute left-1/2 top-[68%] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-44 h-44 rounded-2xl bg-card/80 backdrop-blur border border-primary/50 flex flex-col items-center justify-center gap-3 shadow-[0_0_80px_hsl(var(--primary)/0.45)]">
          <BgmIcon size={44} className="text-primary">
            <circle cx="12" cy="12" r="8" />
            <path d="M12 4v16M4 12h16" />
          </BgmIcon>
          <span className="text-[10px] font-display font-semibold tracking-[0.2em] uppercase text-primary">
            B2B Engine
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroFlow;