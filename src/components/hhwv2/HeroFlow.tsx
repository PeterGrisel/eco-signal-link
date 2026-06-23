import { useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import {
  TrendingUp,
  Users,
  MousePointerClick,
  UserPlus,
  Layers,
  Target,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CtaLink from "@/components/CtaLink";
import GridCanvas from "./GridCanvas";
import { BgmIcon } from "@/components/icons/BgmIcon";
import { useFlowTimeline, primePath, pointOnPath } from "@/hooks/useFlowTimeline";
import AnnouncementPill from "./ui/AnnouncementPill";

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
        {/* Editorial centered hero (ColdIQ-stijl) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center"
        >
          <AnnouncementPill className="mb-7">
            Voor B2B-bedrijven met PMF
          </AnnouncementPill>
          <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-[5.5rem] tracking-tighter leading-[1.02] mb-6">
            Het B2B-groeisysteem van
            <br />
            <span className="font-serif italic font-semibold text-gradient">morgen, vandaag gebouwd.</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
            Wij bouwen B2B-revenue-engines die voor je verkopen. In je eigen stack.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <Button variant="hero" size="lg" asChild>
              <CtaLink intent="gratisScan" location="Hoe het werkt v2 — hero" />
            </Button>
            <a href="#engine" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
              Bekijk hoe het werkt
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* Signal flow as supporting visual underneath */}
        <div className="relative h-[440px] md:h-[520px] mt-12 md:mt-16 max-w-4xl mx-auto opacity-90">
          <SignalFlowDiagram />
        </div>
      </div>
    </section>
  );
};

const W = 600;
const H = 600;
const ENGINE = { x: 300, y: 360, r: 70 };
const CARD = { x: 460, y: 540 };

const SignalFlowDiagram = () => {
  const ref = useRef<HTMLDivElement>(null);

  useFlowTimeline(ref, (tl, root) => {
    const fans = Array.from(root.querySelectorAll<SVGPathElement>(".hf-fan"));
    const route = root.querySelector<SVGPathElement>(".hf-route");
    const glow = root.querySelector<SVGCircleElement>(".hf-glow");
    const pulse = root.querySelector<SVGCircleElement>(".hf-pulse");
    const checks = Array.from(root.querySelectorAll<HTMLElement>(".hf-check"));
    const sigs = Array.from(root.querySelectorAll<HTMLElement>(".hf-sig"));
    const engine = root.querySelector<HTMLElement>(".hf-engine");
    const card = root.querySelector<HTMLElement>(".hf-card");
    const counter = root.querySelector<HTMLElement>(".hf-counter");

    fans.forEach(primePath);
    if (route) primePath(route);

    gsap.set(sigs, { opacity: 0, y: -10 });
    gsap.set(engine, { opacity: 0, scale: 0.9 });
    gsap.set(glow, { opacity: 0, scale: 0.5, transformOrigin: "center" });
    gsap.set(card, { opacity: 0, y: 12 });
    gsap.set(checks, { opacity: 0, scale: 0.6 });
    gsap.set(pulse, { opacity: 0 });

    const counterObj = { v: 0 };

    tl.to(sigs, { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power3.out" }, 0.1)
      .to(engine, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.4)" }, 0.6)
      .to(
        fans,
        { strokeDashoffset: 0, duration: 0.7, stagger: 0.06, ease: "power2.inOut" },
        0.9
      )
      // Glow steps (the stacked-pulse signature)
      .to(glow, { opacity: 0.3, scale: 0.7, duration: 0.25, ease: "power2.out" }, 1.4)
      .to(glow, { opacity: 0.5, scale: 0.85, duration: 0.25, ease: "power2.out" }, ">")
      .to(glow, { opacity: 0.75, scale: 1, duration: 0.25, ease: "power2.out" }, ">")
      .to(glow, { opacity: 1, scale: 1.2, duration: 0.3, ease: "power2.out" }, ">")
      .to(glow, { opacity: 0.85, scale: 1, duration: 0.45, ease: "power2.inOut" }, ">")
      // Route line draws to the card
      .to(route, { strokeDashoffset: 0, duration: 0.55, ease: "power2.inOut" }, "-=0.4")
      // Card appears
      .to(card, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.3")
      // Pulse travels along the route
      .add(() => {
        if (!route || !pulse) return;
        gsap.set(pulse, { opacity: 1 });
      }, ">-0.1")
      .to(
        { t: 0 },
        {
          t: 1,
          duration: 0.6,
          ease: "power2.inOut",
          onUpdate: function () {
            if (!route || !pulse) return;
            const p = pointOnPath(route, this.targets()[0].t);
            pulse.setAttribute("cx", String(p.x));
            pulse.setAttribute("cy", String(p.y));
          },
        },
        ">"
      )
      .to(pulse, { opacity: 0, duration: 0.2 }, ">-0.05")
      // Fit-score counter
      .to(
        counterObj,
        {
          v: 87,
          duration: 0.8,
          ease: "power1.out",
          onUpdate: () => {
            if (counter) counter.textContent = String(Math.round(counterObj.v));
          },
        },
        "-=0.5"
      )
      // Checkmarks pop
      .to(checks, { opacity: 1, scale: 1, duration: 0.35, stagger: 0.12, ease: "back.out(2)" }, "-=0.3");
  });

  return (
    <div ref={ref} className="relative w-full h-full">
      {/* SVG layer */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="hf-glow-grad" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.85" />
            <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Fan lines from each signal node to engine */}
        {SIGNALS.map((_, i) => {
          const x = 50 + (i * 500) / 5;
          const midY = (60 + ENGINE.y) / 2;
          return (
            <path
              key={i}
              className="hf-fan"
              d={`M ${x} 60 C ${x} ${midY}, ${ENGINE.x} ${midY}, ${ENGINE.x} ${ENGINE.y}`}
              stroke="hsl(var(--primary))"
              strokeWidth="1.4"
              strokeOpacity="0.7"
              fill="none"
              strokeLinecap="round"
            />
          );
        })}

        {/* Engine glow */}
        <circle
          className="hf-glow"
          cx={ENGINE.x}
          cy={ENGINE.y}
          r="110"
          fill="url(#hf-glow-grad)"
        />

        {/* Route line to account card */}
        <path
          className="hf-route"
          d={`M ${ENGINE.x + 30} ${ENGINE.y + 20} C ${ENGINE.x + 80} ${ENGINE.y + 70}, ${CARD.x - 60} ${CARD.y - 30}, ${CARD.x} ${CARD.y}`}
          stroke="hsl(var(--primary))"
          strokeWidth="1.6"
          strokeOpacity="0.85"
          fill="none"
          strokeLinecap="round"
        />

        {/* Traveling pulse on route */}
        <circle className="hf-pulse" r="4" fill="hsl(var(--primary))" filter="url(#hf-pulse-glow)" />
        <filter id="hf-pulse-glow">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </svg>

      {/* Signal nodes */}
      <div className="absolute top-0 left-0 right-0 grid grid-cols-3 md:grid-cols-6 gap-2 px-1">
        {SIGNALS.map((s) => (
          <div key={s.label} className="hf-sig flex flex-col items-center gap-2">
            <span className="text-[9px] font-display font-semibold tracking-[0.18em] uppercase text-primary/80 text-center">
              {s.label}
            </span>
            <div className="w-12 h-12 rounded-xl bg-card border border-primary/40 flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.25)]">
              <s.icon className="w-5 h-5 text-primary" strokeWidth={1.8} />
            </div>
          </div>
        ))}
      </div>

      {/* Engine node */}
      <div
        className="hf-engine absolute"
        style={{
          left: `${(ENGINE.x / W) * 100}%`,
          top: `${(ENGINE.y / H) * 100}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="w-36 h-36 md:w-40 md:h-40 rounded-2xl bg-card/80 backdrop-blur border border-primary/50 flex flex-col items-center justify-center gap-3 shadow-[0_0_80px_hsl(var(--primary)/0.45)]">
          <BgmIcon size={40} className="text-primary">
            <circle cx="12" cy="12" r="8" />
            <path d="M12 4v16M4 12h16" />
          </BgmIcon>
          <span className="text-[10px] font-display font-semibold tracking-[0.2em] uppercase text-primary">
            B2B Engine
          </span>
        </div>
      </div>

      {/* Account card */}
      <div
        className="hf-card absolute w-[220px]"
        style={{
          left: `${(CARD.x / W) * 100}%`,
          top: `${(CARD.y / H) * 100}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="rounded-xl border border-primary/40 bg-card/90 backdrop-blur p-3.5 shadow-[0_0_40px_hsl(var(--primary)/0.35)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-display font-semibold tracking-[0.18em] uppercase text-primary/80">
              Match
            </span>
            <span className="text-[9px] font-display font-semibold tracking-[0.18em] uppercase text-primary/60">
              live
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="hf-counter font-display font-bold text-3xl text-gradient">0</span>
            <span className="text-xs text-muted-foreground">fit-score</span>
          </div>
          <ul className="space-y-1.5">
            {["Past op ICP", "Funding < 90 dgn", "Champion in-market"].map((t) => (
              <li key={t} className="flex items-center gap-2 text-xs">
                <span className="hf-check w-4 h-4 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-primary" strokeWidth={3} />
                </span>
                <span className="text-foreground/85">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HeroFlow;