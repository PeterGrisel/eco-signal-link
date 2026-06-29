import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Spotlight, Meteors } from "@/components/hhwv2/ui/magic";
import {
  ArrowRight,
  ArrowDown,
  Sparkles,
  Users,
  CheckCircle2,
  Banknote,
  Briefcase,
  MousePointerClick,
  Trophy,
  Megaphone,
  Layers,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { openBookingModal } from "@/components/booking/GlobalBookingModal";
import { supabase } from "@/integrations/supabase/client";
import heroPoster from "@/assets/hero-poster.jpg.asset.json";
import operator1 from "@/assets/team-member-1.jpg";
import operator2 from "@/assets/team-member-2.jpg";
import operator3 from "@/assets/team-member-3.jpg";
import operator4 from "@/assets/team-member-4.jpg";
import operator5 from "@/assets/team-member-5.jpg";

const HERO_VIDEO_SRC = "/media/hero-loop.mp4";

const operators = [operator1, operator2, operator3, operator4, operator5];

const SIGNALS = [
  { label: "Funding", icon: Banknote },
  { label: "Hiring", icon: Briefcase },
  { label: "Web visit", icon: MousePointerClick },
  { label: "Concurrent", icon: Trophy },
  { label: "Ads", icon: Megaphone },
  { label: "Tool stack", icon: Layers },
];

const ACCOUNT_SIGNALS = [
  { icon: Banknote, text: "Series B funding rond" },
  { icon: Briefcase, text: "Werft 6 sales reps" },
  { icon: MousePointerClick, text: "3x op pricing-pagina" },
];

/* A small, contained connector band. The SVG only fills its own narrow
   strip, so stretching is harmless and nothing can overlap the cards. */
const ConvergeConnector = () => (
  <div className="relative h-8 w-full" aria-hidden>
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 300 32"
      preserveAspectRatio="none"
      fill="none"
    >
      {[20, 80, 140, 160, 220, 280].map((x, i) => (
        <path
          key={i}
          d={`M ${x} 0 C ${x} 18, 150 14, 150 32`}
          stroke="hsl(var(--primary))"
          strokeOpacity="0.45"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}
    </svg>
  </div>
);

const DownConnector = () => (
  <div className="flex justify-center py-1" aria-hidden>
    <span
      className="block h-6 w-px"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, hsl(var(--primary) / 0.55) 50%, transparent 50%)",
        backgroundSize: "1px 5px",
      }}
    />
  </div>
);

gsap.registerPlugin(ScrollTrigger);

const ExactHero = () => {
  const [email, setEmail] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const videoARef = useRef<HTMLVideoElement | null>(null);
  const videoBRef = useRef<HTMLVideoElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const a = videoARef.current;
    const b = videoBRef.current;
    if (!a || !b) return;

    const HANDOFF = 0.12;
    let active: HTMLVideoElement = a;
    let standby: HTMLVideoElement = b;
    let swapping = false;
    let frameId: number | null = null;

    const safePlay = (el: HTMLVideoElement) => {
      const p = el.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    const prep = (el: HTMLVideoElement) => {
      try {
        el.muted = true;
        el.currentTime = 0;
        el.pause();
      } catch {}
    };

    a.style.opacity = "1";
    b.style.opacity = "0";
    prep(b);
    safePlay(a);

    const swap = () => {
      if (swapping) return;
      const next = standby;
      const prev = active;
      swapping = true;
      next.currentTime = 0;
      safePlay(next);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          next.style.opacity = "1";
          prev.style.opacity = "0";
          setTimeout(() => {
            prep(prev);
            active = next;
            standby = prev;
            swapping = false;
          }, 40);
        });
      });
    };

    const tick = () => {
      if (!swapping && active.duration && isFinite(active.duration)) {
        if (active.currentTime >= active.duration - HANDOFF) swap();
      }
      frameId = requestAnimationFrame(tick);
    };

    const onEnded = (e: Event) => {
      if ((e.currentTarget as HTMLVideoElement) === active) swap();
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") safePlay(active);
    };

    a.addEventListener("ended", onEnded);
    b.addEventListener("ended", onEnded);
    document.addEventListener("visibilitychange", onVisible);
    frameId = requestAnimationFrame(tick);

    return () => {
      a.removeEventListener("ended", onEnded);
      b.removeEventListener("ended", onEnded);
      document.removeEventListener("visibilitychange", onVisible);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [reducedMotion]);

  useEffect(() => {
    const el = panelRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: -7,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
      });
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (trimmed && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      try {
        await supabase.functions.invoke("hhw-lead", {
          body: {
            email: trimmed,
            source: "hoe-het-werkt-hero",
            session_id:
              typeof window !== "undefined"
                ? sessionStorage.getItem("b2b_session_id")
                : null,
            page_url:
              typeof window !== "undefined" ? window.location.href : null,
          },
        });
      } catch (err) {
        console.error("hhw-lead invoke failed", err);
      }
    }
    openBookingModal();
  };

  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-28 overflow-hidden bg-transparent">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">

          {/* Left Column - Copy & Action */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col items-start text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-display font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="h-3 w-3 animate-pulse" />
              AI-native omzetsysteem
            </div>

            {/* Heading */}
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.08] mb-5">
              Laat omzet groeien zonder{" "}
              <span className="font-serif italic text-gradient-animate">extra personeel.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-xl">
              Wij bouwen één systeem dat signalen, content en outreach omzet in gesprekken.
            </p>

            {/* Email + CTA Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <input
                  type="email"
                  required
                  placeholder="Jouw werk e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg bg-card/60 border border-primary/10 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all text-sm font-display font-medium"
                />
              </div>
              <Button type="submit" variant="hero" size="lg" className="group relative h-12 overflow-hidden px-6 font-display font-semibold shrink-0">
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                Plan een demo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>

            {/* Alternative link */}
            <a
              href="#aanpak"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("aanpak")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 text-sm font-display font-semibold text-muted-foreground hover:text-foreground transition-colors mb-10"
            >
              Bekijk hoe het werkt
              <ArrowDown className="h-4 w-4 animate-bounce" />
            </a>

            {/* Highlights Bar */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 w-full pt-6 border-t border-primary/10">
              <div className="flex items-center gap-1.5 text-primary">
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                <span className="font-display font-bold text-xs md:text-sm text-foreground">AI-native</span>
              </div>
              <div className="flex items-center gap-1.5 text-primary">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span className="font-display font-bold text-xs md:text-sm text-foreground">In 90 dagen live</span>
              </div>
              <div className="flex items-center gap-1.5 text-primary">
                <Users className="h-3.5 w-3.5 shrink-0" />
                <span className="font-display font-bold text-xs md:text-sm text-foreground">Zonder headcount</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Robust vertical flow diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-7 relative w-full select-none"
          >
            <div
              ref={panelRef}
              className="relative mx-auto w-full max-w-xl rounded-2xl border border-primary/20 card-gradient p-4 sm:p-6 shadow-[0_0_80px_-20px_hsl(var(--primary)/0.35)] overflow-hidden"
            >
              {/* Grid background */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
              <Meteors number={10} />
              <Spotlight />

              <div className="relative flex flex-col">
                {/* Signals row */}
                <p className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-primary/80 mb-3 text-center">
                  Live koopsignalen
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-1.5">
                  {SIGNALS.map((s) => (
                    <div key={s.label} className="flex flex-col items-center gap-1.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
                        <s.icon className="h-4 w-4 text-primary" strokeWidth={1.8} />
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-display font-semibold uppercase tracking-wide text-muted-foreground text-center leading-tight">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>

                <ConvergeConnector />

                {/* Engine card */}
                <div className="relative mx-auto flex flex-col items-center gap-2 rounded-xl border border-primary/40 bg-card/70 backdrop-blur-sm px-6 py-4 shadow-[0_0_40px_rgba(232,148,90,0.2)] overflow-hidden">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/40 bg-primary/15">
                    <Zap className="h-5 w-5 text-primary" strokeWidth={1.8} />
                  </span>
                  <span className="text-[10px] font-display font-bold uppercase tracking-[0.22em] text-primary text-center">
                    B2BGM Engine™
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-display font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                    </span>
                    Live · scoort & routeert
                  </span>
                </div>

                <DownConnector />

                {/* Operators card */}
                <div className="rounded-xl border border-primary/25 bg-card/50 backdrop-blur-sm p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div>
                      <h4 className="font-display font-bold text-foreground text-sm">Onze operators</h4>
                      <p className="text-[9px] font-display font-bold uppercase tracking-[0.18em] text-primary">
                        Mens in de loop
                      </p>
                    </div>
                    <div className="flex items-center -space-x-2">
                      {operators.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt=""
                          loading="lazy"
                          className="h-7 w-7 rounded-full object-cover border-2 border-background ring-1 ring-primary/30"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Wij bouwen het systeem, zetten de logica en draaien de plays{" "}
                    <span className="text-primary font-medium">voor je.</span>
                  </p>
                </div>

                <DownConnector />

                {/* High-fit account card */}
                <div className="rounded-xl border border-primary/30 bg-card/50 backdrop-blur-sm p-4 shadow-[0_0_40px_rgba(232,148,90,0.1)]">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-display font-bold text-foreground text-sm mb-0.5">High-fit account</h4>
                      <p className="text-[9px] font-display font-bold uppercase tracking-[0.18em] text-muted-foreground">
                        Series B · 240 medewerkers
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-primary font-display font-black text-2xl leading-none">94</div>
                      <span className="text-[9px] font-display font-bold uppercase tracking-[0.18em] text-primary">
                        Fit-score
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    {ACCOUNT_SIGNALS.map((row) => (
                      <div
                        key={row.text}
                        className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-background/40 border border-primary/10"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-primary/25 bg-primary/10">
                            <row.icon className="h-3 w-3 text-primary" strokeWidth={1.8} />
                          </span>
                          <span className="text-[11px] text-foreground/90 font-display font-medium truncate">
                            {row.text}
                          </span>
                        </div>
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-primary/10">
                    <span className="text-[9px] font-display font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      Volgende actie
                    </span>
                    <button
                      onClick={openBookingModal}
                      className="px-3 py-1 rounded-md border border-primary/50 text-primary font-display font-semibold text-[10px] hover:bg-primary/10 transition-colors"
                    >
                      Bel vandaag
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ExactHero;
