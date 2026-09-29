import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";
import peterPhoto from "@/assets/peter-grisel.png";
import crest from "@/assets/rkc-waalwijk-logo.png.asset.json";
import stadium from "@/assets/rkc-waalwijk-stadion.jpg.asset.json";

const stadiumFallback = "https://s.rkcwaalwijk.nl/fileadmin/user_upload/55508609764_dd61c414b7_k.jpg";

const opportunities = [
  { number: "01", title: "Nieuwe partners", copy: "Breng bedrijven in Waalwijk en de Langstraat in beeld. Benader de juiste beslissers op het juiste moment." },
  { number: "02", title: "Bestaande relaties", copy: "Herken groeisignalen bij bestaande partners. Maak hospitality en zichtbaarheid bespreekbaar wanneer het past." },
  { number: "03", title: "Businessclub", copy: "Houd nieuwe contacten warm. Zet interesse om in een gesprek met het commerciële team." },
];

const steps = [
  { label: "Markt", detail: "We brengen passende bedrijven rond Waalwijk in kaart." },
  { label: "Signaal", detail: "We volgen groei, nieuwe mensen en nieuwe plannen." },
  { label: "Activatie", detail: "We bereiken beslissers via e-mail en LinkedIn." },
  { label: "Gesprek", detail: "Het team van RKC neemt warme kansen over." },
];

const metrics = [
  { value: "5K+", label: "Bedrijven in kaart", sub: "TAM / SAM / SOM" },
  { value: "50%", label: "Open rate", sub: "op outbound" },
  { value: "25%", label: "Reply rate", sub: "op outbound" },
  { value: "Live", label: "Vrouwenvoetbal-track", sub: "actief" },
];

/** Telt numerieke scorebordwaarden op zodra ze in beeld schuiven (zelfde als PSV/AZ/Willem II). */
const CountUp = ({ value }: { value: string }) => {
  const match = value.match(/^([\d.]+)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const target = match ? parseInt(match[1].replace(/\./g, ""), 10) : 0;
  const hasMatch = !!match;
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!hasMatch || !inView) return;
    const duration = 1300;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hasMatch, inView, target]);

  if (!match) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {target >= 1000 ? n.toLocaleString("nl-NL") : n}
      {match[2]}
    </span>
  );
};

function RkcCurtain() {
  const [opening, setOpening] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFinished(true);
      return;
    }
    const start = window.setTimeout(() => setOpening(true), 600);
    const end = window.setTimeout(() => setFinished(true), 3300);
    return () => { window.clearTimeout(start); window.clearTimeout(end); };
  }, []);

  if (finished) return null;
  return (
    <div aria-hidden="true" className="rkc-curtain fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {(["left", "right"] as const).map(side => (
        <div
          key={side}
          className={`absolute inset-y-0 w-[51%] ${side === "left" ? "left-0" : "right-0"} rkc-curtain-panel`}
          style={{ transform: opening ? `translateX(${side === "left" ? "-103%" : "103%"})` : "translateX(0)" }}
        />
      ))}
    </div>
  );
}

const RkcWaalwijkPage = () => {
  usePageMeta({
    title: "RKC Waalwijk × B2BGroeiMachine | Meer zakelijke kansen in de Langstraat",
    description: "Een voorstel voor RKC Waalwijk: partners vinden, relaties laten groeien en warme kansen doorgeven. Bekijk de aanpak, de Excelsior-case en de prijzen.",
    canonical: "https://www.b2bgroeimachine.io/voor/rkc-waalwijk",
    themeColor: "#0A2A66",
  });

  return (
    <div className="rkc-page min-h-screen bg-background text-foreground">
      <RkcCurtain />
      <Navbar />
      <main>
        <section className="rkc-hero relative isolate min-h-[min(780px,92svh)] flex flex-col justify-end overflow-hidden pt-32 pb-14 md:pb-20">
          <img src={stadium.url} onError={event => { event.currentTarget.src = stadiumFallback; }} alt="Mandemakers Stadion van RKC Waalwijk" className="absolute inset-0 -z-20 h-full w-full object-cover" loading="eager" />
          <div className="rkc-hero-shade absolute inset-0 -z-10" />
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center gap-6 mb-8 md:mb-12">
              <img src="/favicon.svg" alt="B2BGroeiMachine" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
              <span className="w-px h-12 bg-foreground/40" aria-hidden="true" />
              <img src={crest.url} alt="RKC Waalwijk" className="w-14 h-14 md:w-20 md:h-20 object-contain" loading="eager" />
            </div>
            <p className="rkc-kicker uppercase text-xs md:text-sm font-semibold mb-5">Voor RKC commercie · Waalwijk</p>
            <h1 className="font-display uppercase font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.96] max-w-5xl">
              RKC Waalwijk.<br /><span className="text-primary">Meer partners.</span><br />Meer bereik.
            </h1>
            <p className="mt-7 max-w-2xl text-base md:text-xl text-foreground/90 leading-relaxed">
              Wij bouwen een groeimachine voor zakelijke kansen in de Langstraat.
              RKC voert de gesprekken. Wij zorgen voor het juiste moment.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rkc-cta rounded-sm font-bold uppercase tracking-wide">
                <a href="#contact">Plan een gesprek <ArrowRight className="ml-2 size-4" /></a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-sm font-bold uppercase tracking-wide bg-background/20 backdrop-blur-sm">
                <a href="#pricing">Bekijk de prijzen</a>
              </Button>
            </div>
          </div>
        </section>
        <div className="rkc-tricolor h-2" aria-hidden="true" />

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <p className="rkc-kicker uppercase text-xs font-bold mb-4">01 / De kans</p>
            <h2 className="font-display uppercase font-bold text-3xl md:text-5xl max-w-4xl leading-tight mb-12">De volgende partner zit misschien al om de hoek.</h2>
            <div className="grid md:grid-cols-3 gap-0 border-t border-border">
              {opportunities.map(item => (
                <motion.article key={item.number} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="py-8 md:pr-10 md:pl-8 first:pl-0 border-b md:border-b-0 md:border-r last:border-r-0 border-border">
                  <span className="font-mono text-primary text-sm">{item.number}</span>
                  <h3 className="font-display uppercase font-bold text-xl md:text-2xl mt-5 mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.copy}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="rkc-deep py-16 md:py-24 text-foreground">
          <div className="container mx-auto px-4 md:px-6">
            <p className="rkc-kicker uppercase text-xs font-bold mb-4">02 / De aanpak</p>
            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20">
              <div>
                <h2 className="font-display uppercase font-bold text-3xl md:text-5xl leading-tight mb-6">Met lef. En met data.</h2>
                <p className="text-foreground/75 text-lg leading-relaxed">Geen losse lijst met namen. Een doorlopend systeem dat kansen vindt, activeert en aan het team overdraagt.</p>
              </div>
              <ol className="border-t border-foreground/20">
                {steps.map((step, index) => (
                  <li key={step.label} className="grid grid-cols-[3rem_1fr] sm:grid-cols-[3rem_8rem_1fr] gap-3 py-5 border-b border-foreground/20 items-start">
                    <span className="font-mono text-primary text-sm">0{index + 1}</span>
                    <strong className="font-display uppercase text-lg">{step.label}</strong>
                    <span className="col-start-2 sm:col-start-3 text-foreground/70 text-sm md:text-base">{step.detail}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="excelsior" className="relative overflow-hidden py-16 md:py-28 text-white scroll-mt-24" style={{ backgroundColor: "#0A2A66" }}>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-80" style={{ background: "radial-gradient(60% 100% at 50% 0%, rgba(255,210,0,0.20), transparent 75%)" }} />
          <div className="container mx-auto px-4 md:px-6">
            <p className="rkc-kicker uppercase text-xs font-bold mb-4">03 / Bewezen in het voetbal</p>
            <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-start">
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-16 w-16 md:h-20 md:w-20 bg-white rounded-full flex items-center justify-center p-2.5 shrink-0">
                    <img src="/logos/klanten/excelsior.svg" alt="Excelsior Rotterdam" className="max-h-full max-w-full object-contain" loading="lazy" />
                  </div>
                  <div>
                    <p className="uppercase text-[10px] md:text-xs tracking-[0.3em] text-white/60 font-mono">Sport & sponsoring</p>
                    <p className="font-display font-bold uppercase tracking-wide text-xl md:text-2xl">Excelsior Rotterdam</p>
                  </div>
                </div>
                <h2 className="font-display uppercase font-bold tracking-tight leading-[0.95] text-5xl md:text-7xl mb-8">
                  Van club<br /><span style={{ color: "#FFD200" }}>naar sponsor.</span>
                </h2>
                <p className="text-base md:text-lg leading-relaxed text-white/80 max-w-xl mb-6">
                  Voor Excelsior bouwden wij een sponsorsysteem. Wij mappen lokale bedrijven, activeren beslissers en zetten vrouwenvoetbal actief op de kaart. Elk signaal wordt een gesprek voor het commerciële team.
                </p>
                <p className="text-2xl md:text-3xl leading-snug max-w-xl" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                  Eén op de vier benaderde beslissers <span style={{ color: "#FFD200" }}>reageert.</span>
                </p>
                <p className="mt-8 text-[11px] text-white/50 leading-relaxed font-mono">De cijfers zijn de Excelsior-case. Geen belofte voor RKC Waalwijk.</p>
              </div>
              <div>
                <div className="border" style={{ borderColor: "rgba(255,255,255,0.14)" }}>
                  <div className="px-6 py-3 border-b flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.14)" }}>
                    <span className="uppercase text-[10px] tracking-[0.3em] text-white/60 font-mono">Scorebord Excelsior</span>
                    <span className="flex items-center gap-2 uppercase text-[10px] tracking-[0.3em] font-mono" style={{ color: "#FFD200" }}>
                      <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: "#FFD200" }} /> Live
                    </span>
                  </div>
                  {metrics.map(m => (
                    <div key={m.label} className="px-6 py-6 border-b last:border-b-0 flex items-baseline justify-between gap-4" style={{ borderColor: "rgba(255,255,255,0.14)" }}>
                      <span>
                        <span className="block font-display font-bold uppercase tracking-wide text-sm md:text-base">{m.label}</span>
                        <span className="block uppercase text-[10px] tracking-[0.2em] text-white/50 mt-1 font-mono">{m.sub}</span>
                      </span>
                      <span className="text-4xl md:text-5xl font-mono" style={{ color: "#FFD200" }}>
                        <CountUp value={m.value} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="rkc-pricing-brand border-t border-border">
          <PricingSection showPerformancePartnership={false} showAddOns={false} />
        </div>

        <section id="contact" className="rkc-contact scroll-mt-24 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-[1fr_auto] gap-12 items-end">
            <div>
              <p className="uppercase text-xs font-bold mb-4">04 / Aftrap</p>
              <h2 className="font-display uppercase font-bold text-4xl md:text-6xl leading-tight max-w-3xl">Laat zien waar RKC kan groeien.</h2>
              <p className="text-lg mt-5 max-w-xl">In één gesprek kiezen wij samen de eerste doelgroep en een passende aanpak.</p>
              <div className="flex items-center gap-4 mt-9 mb-6">
                <img src={peterPhoto} alt="Peter Grisel" className="w-14 h-14 rounded-full object-cover" loading="lazy" />
                <div><strong className="block">Peter Grisel</strong><span className="text-sm">B2BGroeiMachine · Rebel Force</span></div>
              </div>
              <Button asChild size="lg" variant="secondary" className="rounded-sm font-bold uppercase">
                <a href="mailto:peter.grisel@rebelforce.nl?subject=RKC%20Waalwijk%20x%20B2BGroeiMachine">Plan een gesprek <ArrowUpRight className="ml-2 size-4" /></a>
              </Button>
              <a href="mailto:peter.grisel@rebelforce.nl" className="flex items-center gap-2 mt-5 text-sm underline break-all"><Mail className="size-4 shrink-0" />peter.grisel@rebelforce.nl</a>
            </div>
            <img src={crest.url} alt="" aria-hidden="true" className="hidden lg:block h-44 w-44 object-contain" loading="lazy" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RkcWaalwijkPage;
