import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Radar,
  Brain,
  Database,
  Target,
  Handshake,
  type LucideIcon,
} from "lucide-react";

interface StageDef {
  num: string;
  label: string;
  lead: string;
  title: string;
  desc: string;
  bullets: string[];
  highlight: string;
  quote: string;
  icon: LucideIcon;
}

const stages: StageDef[] = [
  {
    num: "01",
    label: "Stap 1 — Markt geeft signaal",
    lead: "DATA-LAAG",
    title: "Een prospect laat iets achter.",
    desc: "Een websitebezoek, een profielcheck, een download. Klein, indirect en vaak ongezien. Toch is het de eerste hint van koopgedrag.",
    bullets: [
      "Website- en pagina­bezoek",
      "LinkedIn- en profielactiviteit",
      "Content en e-mail interactie",
    ],
    highlight: "Eerste signaal",
    quote: "Wachten op een lancering werkt niet. De markt praat al.",
    icon: Radar,
  },
  {
    num: "02",
    label: "Stap 2 — Patroon herkennen",
    lead: "BREIN-LAAG",
    title: "Eén signaal zegt niets. Tien wel.",
    desc: "Het commercieel brein weegt signalen, combineert ze en herkent het patroon. Wat losse activiteit lijkt, blijkt intent.",
    bullets: [
      "Signalen wegen en combineren",
      "Drempel­waarden per ICP",
      "Patronen vertalen naar intent",
    ],
    highlight: "Patroon­herkenning",
    quote: "Engagement is geen losse actie. Het is een patroon.",
    icon: Brain,
  },
  {
    num: "03",
    label: "Stap 3 — Context verrijken",
    lead: "DATAHUB",
    title: "Wij plakken het profiel rond het signaal.",
    desc: "Bedrijfs­data, rolinformatie, technografie en historie komen samen. Zo wordt een signaal een compleet beeld.",
    bullets: [
      "Bedrijfs- en contact­verrijking",
      "Technografie en sector­context",
      "Historische interactie",
    ],
    highlight: "Verrijkt profiel",
    quote: "Niet alleen activiteit vastleggen. Eerst context.",
    icon: Database,
  },
  {
    num: "04",
    label: "Stap 4 — Volgende beste actie",
    lead: "ENGAGEMENT",
    title: "Geen rapport. Een actie.",
    desc: "Op basis van signaal, score en context kiest het systeem het juiste moment, kanaal en bericht.",
    bullets: [
      "Juiste kanaal en moment",
      "Persoonlijke boodschap",
      "Automatische nurture of alert",
    ],
    highlight: "Slimme trigger",
    quote: "Geen rapport. Een volgende beste actie.",
    icon: Target,
  },
  {
    num: "05",
    label: "Stap 5 — Sales engageert",
    lead: "MENS-LAAG",
    title: "De juiste persoon, met de juiste context.",
    desc: "Sales komt in beeld als het signaal sterk genoeg is. Geen koude lijst, maar een warm gesprek met volledige achtergrond.",
    bullets: [
      "Sales alert met context",
      "Direct opvolgen of meeting",
      "Feedback terug naar het brein",
    ],
    highlight: "Warm gesprek",
    quote: "Mens aan zet, met data als rugdekking.",
    icon: Handshake,
  },
];

function StagePanel({
  stage,
  index,
  scrollYProgress,
  totalPanels,
}: {
  stage: StageDef;
  index: number;
  scrollYProgress: MotionValue<number>;
  totalPanels: number;
}) {
  const span = 1 / totalPanels;
  const stageStart = index * span;
  const stageEnd = stageStart + span * 0.9;
  const active = useTransform(
    scrollYProgress,
    [Math.max(0, stageStart - 0.04), stageStart, stageEnd, Math.min(1, stageEnd + 0.04)],
    [0, 1, 1, 0]
  );

  const textOpacity = useTransform(active, [0, 0.4, 1], [0.2, 0.7, 1]);
  const textX = useTransform(active, [0, 1], [-30, 0]);
  const Icon = stage.icon;

  return (
    <div className="relative shrink-0 w-screen h-screen overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, hsl(var(--background) / 0.92) 0%, hsl(var(--background) / 0.6) 40%, hsl(var(--background) / 0.2) 70%, hsl(var(--background) / 0.4) 100%)",
        }}
        aria-hidden
      />

      <div className="relative h-full container mx-auto px-6 md:px-10 flex items-center">
        <motion.div
          style={{ opacity: textOpacity, x: textX }}
          className="max-w-xl lg:max-w-2xl pointer-events-auto"
        >
          <div className="relative rounded-2xl border border-primary/20 bg-card/95 shadow-[0_1.5rem_3rem_-1rem_rgba(0,0,0,0.6)] p-8 md:p-10 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-display text-7xl md:text-8xl font-bold text-primary/40 tabular-nums leading-none">
                  {stage.num}
                </span>
                <div className="flex flex-col gap-1">
                  <span className="block w-12 h-px bg-primary" />
                  <p className="text-[11px] font-display font-bold tracking-[0.28em] uppercase text-primary/90">
                    {stage.label}
                  </p>
                  <span className="inline-flex w-fit mt-1 px-2 py-0.5 text-[9px] font-display font-bold tracking-[0.22em] uppercase rounded-sm bg-primary/15 text-primary border border-primary/30">
                    {stage.lead}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-3xl md:text-5xl font-bold leading-[1.0] tracking-tight text-foreground [text-wrap:balance]">
                  {stage.title}
                </h3>
              </div>

              <p className="text-sm md:text-base text-foreground/75 leading-relaxed mb-5 max-w-lg">
                {stage.desc}
              </p>

              <ul className="space-y-1.5 text-sm text-foreground/80 mb-5">
                {stage.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-primary mt-0.5">·</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <p className="text-xs text-foreground/70 italic border-t border-foreground/10 pt-3 mb-4">
                {stage.quote}
              </p>

              <span className="inline-flex px-3 py-1 text-[10px] font-display font-bold tracking-[0.2em] uppercase rounded-full bg-primary/15 text-primary border border-primary/30">
                {stage.highlight}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <span
        className="absolute bottom-12 right-6 md:right-12 font-display font-bold text-foreground/[0.04] leading-none select-none pointer-events-none"
        style={{ fontSize: "clamp(10rem, 22vw, 22rem)" }}
        aria-hidden
      >
        {stage.num}
      </span>
    </div>
  );
}

export default function ScenarioSideScroller() {
  const isMobile = useIsMobile();
  if (isMobile) return <MobileSideScroller />;
  return <DesktopSideScroller />;
}

function MobileSideScroller() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardWidth = el.scrollWidth / stages.length;
      const idx = Math.round(el.scrollLeft / cardWidth);
      setActive(Math.min(stages.length - 1, Math.max(0, idx)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="py-6">
      <div className="container mx-auto max-w-2xl text-center mb-6 px-4 flex flex-col items-center gap-3">
        <span className="inline-flex px-3 py-1 text-[10px] font-display font-bold tracking-[0.2em] uppercase rounded-full bg-primary/15 text-primary border border-primary/30">
          Het scenario — vijf stappen
        </span>
        <p className="text-[10px] font-display font-bold tracking-[0.28em] uppercase text-foreground/40">
          Swipe om te navigeren
        </p>
      </div>
      <div
        ref={scrollerRef}
        className="flex gap-5 overflow-x-auto snap-x snap-proximity pb-6 px-[7.5vw] [scroll-padding-left:7.5vw]"
        style={{
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
          overscrollBehaviorX: "contain",
        }}
      >
        {stages.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.num} className="snap-center shrink-0 w-[85vw] max-w-sm">
              <div className="relative w-full p-6 rounded-2xl border border-primary/20 bg-card/95 shadow-[0_1.5rem_3rem_-1rem_rgba(0,0,0,0.6)] overflow-hidden">
                <span
                  className="absolute -top-4 -right-2 font-display font-bold text-primary/[0.06] leading-none select-none pointer-events-none text-[8rem]"
                  aria-hidden
                >
                  {s.num}
                </span>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-display font-bold tracking-[0.28em] uppercase text-foreground/40 tabular-nums">
                      {String(i + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}
                    </span>
                    <span className="inline-flex px-2 py-0.5 text-[9px] font-display font-bold tracking-[0.22em] uppercase rounded-sm bg-primary/15 text-primary border border-primary/30">
                      {s.lead}
                    </span>
                  </div>
                  <p className="text-[11px] font-display font-bold tracking-[0.28em] uppercase text-primary/90 mb-3">
                    {s.label}
                  </p>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </div>
                    <h3 className="font-display text-2xl font-bold leading-[1.05] tracking-tight text-foreground [text-wrap:balance]">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-sm text-foreground/75 leading-relaxed mb-4">{s.desc}</p>
                  <ul className="space-y-1.5 text-sm text-foreground/80 mb-4">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="text-primary mt-0.5">·</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-foreground/70 italic border-t border-foreground/10 pt-3 mb-3">
                    {s.quote}
                  </p>
                  <span className="inline-flex px-3 py-1 text-[10px] font-display font-bold tracking-[0.2em] uppercase rounded-full bg-primary/15 text-primary border border-primary/30">
                    {s.highlight}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center gap-1.5 mt-2">
        {stages.map((s, i) => (
          <span
            key={s.num}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-5 bg-primary" : "w-1.5 bg-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function DesktopSideScroller() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const totalPanels = stages.length;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const xKeyframes: number[] = [];
  const xValues: string[] = [];
  for (let i = 0; i < totalPanels; i++) {
    const start = i / totalPanels;
    const hold = (i + 0.85) / totalPanels;
    xKeyframes.push(start, hold);
    xValues.push(`-${i * 100}vw`, `-${i * 100}vw`);
  }
  if (xKeyframes[xKeyframes.length - 1] < 1) {
    xKeyframes.push(1);
    xValues.push(`-${(totalPanels - 1) * 100}vw`);
  }

  const x = useTransform(scrollYProgress, xKeyframes, xValues);
  const progressFill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={ref}
      className="relative -mx-4 md:-mx-6"
      style={{ height: `${totalPanels * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Ambient backdrop */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(var(--primary) / 0.08) 0%, hsl(var(--background) / 0.6) 60%, hsl(var(--background) / 0.95) 100%)",
          }}
          aria-hidden
        />

        <div className="absolute top-0 left-0 right-0 z-20 pt-6 md:pt-10 pointer-events-none">
          <div className="container mx-auto px-6 md:px-10 flex items-center justify-between">
            <span className="inline-flex px-3 py-1 text-[10px] font-display font-bold tracking-[0.2em] uppercase rounded-full bg-primary/15 text-primary border border-primary/30">
              Het scenario — vijf stappen
            </span>
            <p className="hidden md:block text-[11px] font-display font-semibold tracking-[0.2em] uppercase text-foreground/40 tabular-nums">
              Van signaal naar gesprek
            </p>
          </div>
        </div>

        <motion.div
          style={{ x: reduced ? 0 : x }}
          className="flex h-full will-change-transform"
        >
          {stages.map((s, i) => (
            <StagePanel
              key={s.num}
              stage={s}
              index={i}
              scrollYProgress={scrollYProgress}
              totalPanels={totalPanels}
            />
          ))}
        </motion.div>

        <div className="absolute bottom-8 left-0 right-0 z-20 pointer-events-none">
          <div className="container mx-auto px-6 md:px-10">
            <div className="flex items-center gap-4">
              <span className="hidden md:inline text-[10px] font-display font-bold tracking-[0.28em] uppercase text-foreground/50 tabular-nums shrink-0">
                01 · {totalPanels.toString().padStart(2, "0")}
              </span>
              <div className="relative flex-1 h-px bg-foreground/15">
                <motion.div
                  style={{ width: progressFill }}
                  className="absolute left-0 top-0 h-full bg-primary"
                />
                {Array.from({ length: totalPanels }).map((_, i) => (
                  <span
                    key={i}
                    className="absolute top-1/2 w-1.5 h-1.5 rounded-full bg-foreground/40"
                    style={{
                      left: `${(i / (totalPanels - 1)) * 100}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                ))}
              </div>
              <span className="hidden md:inline text-[10px] font-display font-bold tracking-[0.28em] uppercase text-foreground/50 shrink-0">
                Scroll om door te lopen
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}