import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CtaLink from "@/components/CtaLink";
import { CTA } from "@/content/copy";
import { Compass, ArrowRight, ArrowDown, UserPlus, MapPin, Globe, Handshake, Briefcase, RotateCcw } from "lucide-react";
import heroVideoMp4 from "@/assets/hero-background.mp4.asset.json";
import heroVideoWebm from "@/assets/hero-background.webm.asset.json";
import heroPoster from "@/assets/hero-poster.jpg.asset.json";
import { useEffect, useRef } from "react";

const heroMotions = [
  { icon: UserPlus, title: "Klanten werven" },
  { icon: RotateCcw, title: "Slapende relaties activeren" },
  { icon: Globe, title: "Nieuwe markten openen" },
  { icon: Handshake, title: "Partners vinden" },
  { icon: MapPin, title: "Lokale groei versnellen" },
  { icon: Briefcase, title: "Salescapaciteit vergroten" },
];

const ease = [0.22, 1, 0.36, 1] as const;

// Een paar herkenbare klanten voor de trust-cluster (logo-cirkels).
const trustClients = [
  { name: "Yaskawa", url: "https://www.yaskawa.nl/" },
  { name: "Leister Benelux", url: "https://www.leister.com/" },
  { name: "Excelsior Rotterdam", url: "https://excelsiorrotterdam.nl/" },
  { name: "Nexer", url: "https://nexer.nl/" },
  { name: "RTC Group", url: "https://www.rtc-group.nl/" },
];

const LogoCircle = ({ name, url }: { name: string; url: string }) => {
  const [err, setErr] = useState(false);
  let domain = "";
  try {
    domain = new URL(url).hostname;
  } catch {
    domain = "";
  }
  return (
    <span className="w-9 h-9 rounded-full border-2 border-background bg-white overflow-hidden flex items-center justify-center ring-1 ring-foreground/10 shrink-0">
      {err || !domain ? (
        <span className="text-[11px] font-display font-bold text-neutral-700">
          {name[0]}
        </span>
      ) : (
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
          alt={name}
          className="w-5 h-5 object-contain"
          loading="lazy"
          onError={() => setErr(true)}
        />
      )}
    </span>
  );
};

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  // Listen for runtime changes to the OS-level reduced-motion preference.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Best-effort autoplay kickstart for browsers that defer muted autoplay
  // (Safari iOS in low-power mode, some Android variants).
  useEffect(() => {
    if (reducedMotion) return;
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    if (v.readyState >= 2) tryPlay();
    else v.addEventListener("loadeddata", tryPlay, { once: true });
    const onVisible = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      v.removeEventListener("loadeddata", tryPlay);
    };
  }, [reducedMotion]);

  return (
    <section className="relative isolate min-h-screen flex flex-col overflow-hidden bg-background">
      {/* Loopende video-achtergrond */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-background">
        {reducedMotion ? (
          <img
            src={heroPoster.url}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            decoding="async"
            fetchPriority="high"
          />
        ) : (
        <video
          ref={videoRef}
          poster={heroPoster.url}
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          preload="metadata"
          {...({ "webkit-playsinline": "true", "x5-playsinline": "true" } as Record<string, string>)}
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 w-full h-full object-cover"
        >
          {/* WebM eerst voor Chromium/Firefox: kleiner & efficiënter */}
          <source src={heroVideoWebm.url} type="video/webm" />
          <source src={heroVideoMp4.url} type="video/mp4" />
        </video>
        )}
        {/* Leesbaarheids-overlay */}
        <div className="absolute inset-0 bg-background/40 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background/70 to-transparent pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 flex-1 flex flex-col pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
        {/* Hoofdcontent, verticaal gecentreerd */}
        <div className="flex-1 flex flex-col justify-center text-center pt-28 md:pt-32 pb-10">
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
                For B2B companies
              </span>
            </span>
          </motion.div>

          {/* Twee-toon headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.05 }}
            className="font-display text-[2.25rem] md:text-[3.75rem] lg:text-[4.75rem] xl:text-[5.75rem] leading-[0.98] tracking-tighter mb-6 [text-wrap:balance] [text-shadow:0_2px_24px_hsl(var(--background))]"
          >
            <span className="font-bold text-foreground">Systemen die uw omzet doen groeien</span>
          </motion.h1>

          {/* Subkop */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.12 }}
            className="text-muted-foreground text-lg md:text-2xl max-w-4xl mx-auto mb-10 leading-relaxed"
          >
            GTM-diensten die AI-workflows combineren met menselijke expertise
          </motion.p>

          {/* CTA's */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.18 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Button
              variant="hero"
              size="lg"
              className="group relative h-12 rounded-full px-7 text-base overflow-hidden"
              asChild
            >
              <CtaLink intent="gratisScan" location="Hero">
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">{CTA.gratisScan.label}</span>
              </CtaLink>
            </Button>
            <Button
              variant="heroOutline"
              size="lg"
              className="group h-12 rounded-full px-6 text-base"
              asChild
            >
            <a href="#proces">
                Bekijk hoe we dit oplossen
                <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              </a>
            </Button>
            <Link
              to="/klanten"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Bekijk wie al met ons werkt
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>

        {/* Onderbalk, vastgepind onderaan de viewport */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.28 }}
          className="flex flex-col lg:flex-row items-center justify-center gap-6 pb-8 md:pb-10"
        >
          <div className="flex flex-col items-center sm:items-start gap-3">
            <div className="flex -space-x-2">
              {trustClients.map((c) => (
                <LogoCircle key={c.name} name={c.name} url={c.url} />
              ))}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-foreground/90 leading-snug">
                Vertrouwd door ambitieuze B2B-teams
              </p>
              <p className="text-xs text-muted-foreground">
                Yaskawa, Leister, Excelsior Rotterdam e.a.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
