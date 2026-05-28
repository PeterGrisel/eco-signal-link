import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CtaLink from "@/components/CtaLink";
import { CTA } from "@/content/copy";
import { Compass, ArrowRight, ArrowDown, UserPlus, MapPin, Globe, Handshake, Briefcase, RotateCcw } from "lucide-react";

const heroMotions = [
  { icon: UserPlus, title: "Klanten werven" },
  { icon: MapPin, title: "Lokaal uitbreiden" },
  { icon: Globe, title: "Nieuwe markten openen" },
  { icon: Handshake, title: "Partners vinden" },
  { icon: Briefcase, title: "Talent werven" },
  { icon: RotateCcw, title: "Relaties reactiveren" },
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
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10 flex-1 flex flex-col">
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
                Voor ambitieuze B2B-bedrijven
              </span>
            </span>
          </motion.div>

          {/* Twee-toon headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.05 }}
            className="font-display text-[2.75rem] md:text-[4.75rem] lg:text-[6rem] xl:text-[7rem] leading-[0.98] tracking-tighter mb-6 [text-wrap:balance] [text-shadow:0_2px_24px_hsl(var(--background))]"
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
            className="text-muted-foreground text-lg md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Wij combineren AI-workflows met menselijke expertise. Van
            koopsignalen tot geboekte gesprekken, op uw eigen tools.
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
            <a href="#diensten">
                Bekijk onze diensten
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
          className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-8 md:pb-10"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full max-w-5xl mx-auto">
            {heroMotions.map((m) => (
              <a
                key={m.title}
                href="#chapter-11"
                className="inline-flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 rounded-xl sm:rounded-full border border-border/60 bg-card/50 px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-foreground/80 hover:border-primary/40 hover:text-primary transition-colors shadow-sm text-center"
              >
                <m.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" strokeWidth={1.75} />
                <span className="leading-tight">{m.title}</span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {trustClients.map((c) => (
                <LogoCircle key={c.name} name={c.name} url={c.url} />
              ))}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground/90 leading-snug">
                Vertrouwd door snelgroeiende B2B-teams
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
