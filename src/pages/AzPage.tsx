import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";
import peterPhoto from "@/assets/peter-grisel.png";
import azHeroVideo from "@/assets/psv-hero.mp4";

const RED = "#E60012"; // AZ-rood
const INK = "#0B0F14";
const SERIF = "'DM Serif Display', Georgia, serif";
const MONO = "'JetBrains Mono', monospace";

// Brede ton-sur-ton baan als rustige verwijzing naar het AZ-shirt
const STRIPES = {
  backgroundImage: `repeating-linear-gradient(90deg, transparent 0 120px, ${RED}08 160px 280px, transparent 320px 400px)`,
};

const tickerItems = [
  "Brochure B2B",
  "Voor AZ Commercie",
  "Partners werven",
  "Partners laten groeien",
  "AZ Vrouwen",
  "Regio Noord-Holland",
];

const challenges = [
  {
    title: "Het netwerk is de grens",
    desc: "Een commercieel team bewerkt de bedrijven die het al kent. De rest van de markt is onzichtbaar, ook als die klaar is om partner te worden.",
  },
  {
    title: "Timing is toeval",
    desc: "Een bedrijf dat net uitbreidt, een nieuwe marketingdirecteur krijgt of een jubileum viert, is nu aanspreekbaar. Over drie maanden niet meer.",
  },
  {
    title: "Farming vreet tijd",
    desc: "Lijsten bouwen, mailen, opvolgen. Accountmanagers zijn bezig met zoeken in plaats van met het gesprek dat een partnership sluit.",
  },
];

const tracks = [
  {
    tag: "Outbound",
    title: "Nieuwe partners werven",
    desc: "Wij brengen Noord-Holland en de rest van Nederland in kaart, filteren op wie bij AZ past en activeren beslissers per golf. Uw team krijgt gesprekken, geen lijsten.",
  },
  {
    tag: "ABM",
    title: "Partners laten groeien",
    desc: "Bestaande partners en named accounts krijgen een eigen spoor. Signalen van groei gaan direct naar de accountmanager, voor upgrade naar hospitality of een groter pakket.",
  },
  {
    tag: "Track",
    title: "AZ Vrouwen op de kaart",
    desc: "Een apart commercieel verhaal voor bedrijven die willen investeren in vrouwenvoetbal. Dit is precies wat wij voor Excelsior live hebben staan.",
  },
  {
    tag: "Nurturing",
    title: "Zakelijk top-of-mind",
    desc: "Bedrijven die nu nog niet tekenen blijven warm: zakelijke evenementen, businessclub-momenten en content, tot het moment dat timing wel klopt.",
  },
];

const excelsiorMetrics = [
  { value: "5K+", label: "Bedrijven in kaart", sub: "TAM/SAM/SOM" },
  { value: "50%", label: "Open rate", sub: "op outbound" },
  { value: "25%", label: "Reply rate", sub: "op outbound" },
  { value: "5.000+", label: "Bedrijven in scope", sub: "regio Rotterdam" },
  { value: "Live", label: "Vrouwenvoetbal-track", sub: "actief" },
];

const excelsiorVsAz = [
  { label: "Markt", excelsior: "Regio Rotterdam", az: "Noord-Holland + landelijk" },
  { label: "Sporen", excelsior: "Sponsoring + vrouwenvoetbal", az: "Werving, groei, Vrouwen, hospitality" },
  { label: "Engine", excelsior: "Signalen → gesprekken", az: "Dezelfde engine, groter bereik" },
];

const modelSteps = [
  { title: "Markt", desc: "De hele zakelijke markt in beeld, niet alleen het bestaande netwerk." },
  { title: "Hypothese", desc: "Samen met commercie: wie past bij AZ en waarom nu?" },
  { title: "Data", desc: "Eén ankerlijst, verrijkt en ontdubbeld tegen bestaande partners." },
  { title: "Activatie", desc: "E-mail en LinkedIn die awareness bouwen. Geen koude belrondes." },
  { title: "Intentie", desc: "Signalen worden gemeten, gestapeld en vervallen met de tijd." },
  { title: "Sales", desc: "Hoge intentie gaat direct naar de juiste accountmanager." },
  { title: "Leren", desc: "Wat wel en niet tekent, scherpt de hypothese maand na maand aan." },
  { title: "Schalen", desc: "Dezelfde engine voor een nieuw pakket, seizoen of doelgroep." },
];

const levels = [
  { name: "Qualified", rule: "Past bij AZ", action: "Nurture, blijft warm" },
  { name: "Target", rule: "Past + reden nu", action: "In de campagnegolf" },
  { name: "Priority", rule: "Past + reden + timing", action: "Direct naar accountmanager" },
];

const signals = [
  "Nieuwe vestiging of uitbreiding in Noord-Holland",
  "Groeiende headcount in sales of marketing",
  "Nieuwe directeur of marketingmanager",
  "Overname, investering of jubileum",
  "Bezoek aan de partner- of hospitalitypagina",
  "Reactie op een campagne of evenement",
];

const faqs = [
  {
    q: "Vervangt dit ons commerciële team?",
    a: "Nee. Wij automatiseren het zoeken en opwarmen. Het gesprek en de deal blijven bij uw accountmanagers.",
  },
  {
    q: "Hoe voorkomen we dat bestaande partners benaderd worden?",
    a: "Uw partner- en klantenlijst gaat vooraf als blacklist of apart ABM-spoor in de engine. Niemand krijgt een wervingsmail die al partner is.",
  },
  {
    q: "Is dit AVG-proof?",
    a: "Wij werken alleen met zakelijke data, met afmeldmogelijkheid in elk bericht en afspraken over deliverability en domeinen.",
  },
  {
    q: "Hoe starten we?",
    a: "Met een pilot van 90 dagen op één spoor, bijvoorbeeld AZ Vrouwen of nieuwe partners in Noord-Holland. Daarna schalen we op wat werkt.",
  },
];

/** Zachte scroll-reveal voor sectieblokken. */
const Reveal = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-70px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

/** Telt numerieke scorebordwaarden op zodra ze in beeld schuiven. */
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

const SectionHeader = ({ index, title, light = false }: { index: string; title: string; light?: boolean }) => (
  <Reveal>
    <div
      className="flex items-baseline gap-4 border-t-2 pt-5 mb-10 md:mb-14"
      style={{ borderColor: light ? "#fff" : RED }}
    >
      <span className="text-sm md:text-base" style={{ fontFamily: MONO, color: light ? "#fff" : RED }}>
        {index}
      </span>
      <h2 className="font-display font-bold uppercase tracking-tight text-3xl md:text-5xl leading-none">{title}</h2>
    </div>
  </Reveal>
);

// Openingsgordijn in de stijl van het AZ-logo: solide rood bovenlinks,
// solide wit onderrechts, die langs een schuine naad openschuiven
const AzCurtain = () => {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }
    const t1 = window.setTimeout(() => setOpen(true), 900);
    const t2 = window.setTimeout(() => setDone(true), 4400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (done) return null;

  const panel = (side: "left" | "right") => (
    <div
      className={`absolute top-0 h-full w-[51%] overflow-hidden ${
        side === "left" ? "left-0" : "right-0"
      }`}
      style={{
        transform: open ? `translateX(${side === "left" ? "-102%" : "102%"})` : "translateX(0)",
        backgroundColor: side === "left" ? RED : "#ffffff",
        transition: "transform 2600ms cubic-bezier(0.65,0,0.25,1)",
        willChange: "transform",
      }}
    >
      {/* Zachte naadgloed, alsof het veld erachter oplicht */}
      <div
        className={`absolute inset-y-0 w-24 ${side === "left" ? "right-0" : "left-0"}`}
        style={{
          background:
            side === "left"
              ? "linear-gradient(to right, transparent, rgba(11,15,20,0.45))"
              : "linear-gradient(to left, transparent, rgba(11,15,20,0.25))",
        }}
      />
    </div>
  );

  return (
    <div aria-hidden className="fixed inset-0 z-[100] overflow-hidden pointer-events-none">
      {/* Overmaat + rotatie: de naad loopt schuin, zoals de rood-wit scheiding in het AZ-logo */}
      <div
        className="absolute"
        style={{
          inset: "-30%",
          transform: "rotate(18deg)",
        }}
      >
        {panel("left")}
        {panel("right")}
      </div>
    </div>
  );
};

const AzPage = () => {
  const azVideoRef = useRef<HTMLVideoElement>(null);

  usePageMeta({
    title: "AZ × B2B Groeimachine — Zo vullen we de business club met signalen",
    description:
      "Hoe B2B Groeimachine het commerciële team van AZ helpt nieuwe partners te werven, bestaande partners te laten groeien en AZ Vrouwen commercieel op de kaart te zetten. Met de Excelsior-case.",
    canonical: "https://www.b2bgroeimachine.io/voor/az",
    themeColor: RED,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AzCurtain />
      {/* Brede, zachte banen als rustige verwijzing naar het openingsgordijn */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent 0 160px, ${RED}05 200px 360px, transparent 400px 560px)`,
        }}
      />
      <Navbar />

      {/* HERO — rood-wit, poster-typografie */}
      <section className="relative pt-20 md:pt-24 overflow-hidden">
        {/* Voetbalvideo als achtergrond, met donkere overlay voor leesbaarheid */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <video
            ref={azVideoRef}
            className="absolute inset-0 h-full w-full object-cover opacity-40"
            src={azHeroVideo}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${INK}cc 0%, ${INK}80 40%, ${INK}e6 100%)`,
            }}
          />
        </div>
        <div className="relative py-16 md:py-24" style={STRIPES}>
          {/* Floodlight-gloed en een lichtstreep die over het veld trekt */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="psv-flood absolute -top-48 left-1/2 h-[34rem] w-[64rem] -translate-x-1/2 rounded-full blur-3xl"
              style={{ background: `radial-gradient(closest-side, ${RED}2e, transparent 72%)` }}
            />
            <div className="psv-sweep absolute top-0 h-full w-32 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-start gap-6 mb-10 md:mb-14">
              <div className="flex items-center gap-4" aria-label="B2B Groeimachine en AZ">
                <img
                  src="/favicon.svg"
                  alt="B2B Groeimachine"
                  width={56}
                  height={56}
                  loading="eager"
                  decoding="async"
                  className="h-12 w-12 md:h-14 md:w-14 object-contain"
                />
                <span className="h-8 w-px bg-foreground/25" aria-hidden />
                <img
                  src="/logos/az-logo.png"
                  alt="AZ"
                  width={56}
                  height={56}
                  loading="eager"
                  decoding="async"
                  className="h-12 w-12 md:h-14 md:w-14 object-contain drop-shadow-[0_2px_10px_rgba(230,0,18,0.35)]"
                />
              </div>
              <p className="uppercase text-[11px] md:text-xs tracking-[0.25em]" style={{ fontFamily: MONO, color: RED }}>
                Brochure B2B · voor AZ Commercie
              </p>
            </div>

            <h1
              aria-label="Heel Noord-Holland. Eén signaal van het AFAS Stadion."
              className="font-display font-bold uppercase tracking-tight leading-[0.92] text-[11vw] sm:text-6xl md:text-7xl lg:text-8xl"
            >
              {[
                { text: "Heel Noord-Holland.", red: false },
                { text: "Eén signaal van", red: false },
                { text: "het AFAS Stadion.", red: true },
              ].map((line, i) => (
                <motion.span
                  key={line.text}
                  aria-hidden
                  className="block"
                  style={line.red ? { color: RED } : undefined}
                  initial={{ opacity: 0, y: 48 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.14, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  {line.text}
                </motion.span>
              ))}
            </h1>

            <div className="mt-8 md:mt-10 grid md:grid-cols-[1fr_auto] gap-8 items-end">
              <p className="text-base md:text-xl max-w-2xl leading-relaxed text-foreground/85">
                Wij bouwen voor AZ een commerciële engine die de hele zakelijke markt in kaart brengt, beslissers activeert
                en elk koopsignaal omzet in een{" "}
                <em style={{ fontFamily: SERIF, color: RED }}>gesprek voor uw accountmanagers</em>. Bewezen in het
                voetbal:{" "}
                <em style={{ fontFamily: SERIF, color: RED }}>bij Excelsior</em>.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="relative inline-flex items-center gap-2 overflow-hidden px-6 py-3.5 text-sm font-display font-bold uppercase tracking-wider text-white transition hover:translate-x-0.5"
                  style={{ backgroundColor: RED }}
                >
                  <span
                    aria-hidden
                    className="psv-sweep pointer-events-none absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                  />
                  <span className="relative">Plan een gesprek</span>
                  <ArrowRight className="relative h-4 w-4" />
                </a>
                <a
                  href="#excelsior"
                  className="inline-flex items-center gap-2 border px-6 py-3.5 text-sm font-display font-bold uppercase tracking-wider transition hover:border-current"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  Bekijk de Excelsior-case
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="border-y overflow-hidden py-3" style={{ borderColor: "hsl(var(--border))" }}>
          <div className="flex w-max animate-marquee">
            {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
              <span
                key={i}
                className="flex items-center whitespace-nowrap uppercase text-xs md:text-sm tracking-[0.3em] px-6"
                style={{ fontFamily: MONO, color: i % 2 === 0 ? RED : "hsl(var(--muted-foreground))" }}
              >
                {item}
                <span className="ml-12 text-[8px]" style={{ color: RED }}>◆</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 01 — DE UITDAGING */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader index="01" title="De uitdaging" />

          <p className="text-2xl md:text-4xl leading-snug max-w-3xl mb-14 md:mb-20" style={{ fontFamily: SERIF }}>
            Een topclub trekt vanzelf partners aan. Maar de bedrijven die{" "}
            <span style={{ color: RED }}>u nog niet kent</span>, komen niet vanzelf binnen.
          </p>

          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {challenges.map((c, i) => (
              <motion.div
                key={c.title}
                className="psv-card relative pt-14 md:pt-20"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: "easeOut" }}
              >
                <span
                  className="psv-num absolute top-0 left-0 font-display font-bold leading-none text-7xl md:text-8xl select-none"
                  style={{ WebkitTextStroke: `1.5px ${RED}66` }}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-display font-bold uppercase tracking-wide text-lg mb-3 relative">{c.title}</p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed relative">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 02 — ZO HELPEN WIJ AZ */}
      <section className="py-16 md:py-24" style={STRIPES}>
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader index="02" title="Zo helpen wij AZ" />

          <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground lg:sticky lg:top-28 self-start">
              Vier sporen, één engine. Wij automatiseren het zoeken en opwarmen,{" "}
              <em style={{ fontFamily: SERIF, color: "hsl(var(--foreground))" }}>
                zodat uw team zich volledig op het sluiten van partnerships richt.
              </em>
            </p>

            <ol>
              {tracks.map((t, i) => (
                <motion.li
                  key={t.title}
                  className="grid grid-cols-[3rem_1fr] md:grid-cols-[4rem_16rem_1fr] gap-x-4 md:gap-x-8 items-baseline border-b py-6 md:py-7"
                  style={{ borderColor: "hsl(var(--border))" }}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
                >
                  <span className="text-sm md:text-base" style={{ fontFamily: MONO, color: RED }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="uppercase text-[10px] tracking-[0.25em] mb-1" style={{ fontFamily: MONO, color: RED }}>
                      {t.tag}
                    </p>
                    <p className="font-display font-bold uppercase tracking-wide text-base md:text-lg">{t.title}</p>
                  </div>
                  <p className="col-start-2 md:col-start-3 text-sm text-muted-foreground leading-relaxed mt-2 md:mt-0">
                    {t.desc}
                  </p>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 03 — EXCELSIOR-CASE: donker, groot, trots */}
      <section
        id="excelsior"
        className="relative overflow-hidden py-16 md:py-28 text-white scroll-mt-24"
        style={{ backgroundColor: INK }}
      >
        {/* Floodlights boven het donkere veld */}
        <div
          aria-hidden
          className="psv-flood pointer-events-none absolute inset-x-0 top-0 h-80"
          style={{ background: `radial-gradient(60% 100% at 50% 0%, ${RED}30, transparent 75%)` }}
        />
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader index="03" title="Bewezen bij Excelsior" light />

          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-start">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-16 w-16 md:h-20 md:w-20 bg-white rounded-full flex items-center justify-center p-2.5 shrink-0">
                  <img src="/logos/klanten/excelsior.svg" alt="Excelsior Rotterdam" className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <p className="uppercase text-[10px] md:text-xs tracking-[0.3em] text-white/60" style={{ fontFamily: MONO }}>
                    Sport & sponsoring
                  </p>
                  <p className="font-display font-bold uppercase tracking-wide text-xl md:text-2xl">Excelsior Rotterdam</p>
                </div>
              </div>

              <p className="font-display font-bold uppercase tracking-tight leading-[0.95] text-5xl md:text-7xl mb-8">
                Van club
                <br />
                <span style={{ color: RED }}>naar sponsor.</span>
              </p>

              <p className="text-base md:text-lg leading-relaxed text-white/80 max-w-xl mb-6">
                Voor Excelsior bouwden wij een sponsorsysteem. Wij mappen lokale bedrijven, activeren beslissers en zetten
                vrouwenvoetbal actief op de kaart. Elk signaal wordt een gesprek voor het commerciële team.
              </p>
              <p className="text-2xl md:text-3xl leading-snug max-w-xl" style={{ fontFamily: SERIF }}>
                Eén op de vier benaderde beslissers <span style={{ color: RED }}>reageert.</span>
              </p>
            </div>

            <div>
              {/* Scorebord */}
              <div className="border" style={{ borderColor: "rgba(255,255,255,0.14)" }}>
                <div className="px-6 py-3 border-b flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.14)" }}>
                  <span className="uppercase text-[10px] tracking-[0.3em] text-white/60" style={{ fontFamily: MONO }}>
                    Scorebord Excelsior
                  </span>
                  <span className="flex items-center gap-2 uppercase text-[10px] tracking-[0.3em]" style={{ fontFamily: MONO, color: RED }}>
                    <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: RED }} /> Live
                  </span>
                </div>
                {excelsiorMetrics.map((m) => (
                  <div
                    key={m.label}
                    className="px-6 py-6 border-b last:border-b-0 flex items-baseline justify-between gap-4"
                    style={{ borderColor: "rgba(255,255,255,0.14)" }}
                  >
                    <span>
                      <span className="block font-display font-bold uppercase tracking-wide text-sm md:text-base">{m.label}</span>
                      <span className="block uppercase text-[10px] tracking-[0.2em] text-white/50 mt-1" style={{ fontFamily: MONO }}>
                        {m.sub}
                      </span>
                    </span>
                    <span className="text-4xl md:text-5xl" style={{ fontFamily: MONO, color: RED }}>
                      <CountUp value={m.value} />
                    </span>
                  </div>
                ))}
              </div>

              {/* Excelsior → AZ */}
              <div className="mt-8">
                <p className="uppercase text-[10px] md:text-xs tracking-[0.3em] mb-4 text-white/60" style={{ fontFamily: MONO }}>
                  Van Excelsior naar AZ
                </p>
                <div className="grid grid-cols-[5.5rem_1fr_1fr] gap-x-4 text-sm">
                  <span />
                  <span className="uppercase text-[10px] tracking-[0.2em] text-white/50 pb-2" style={{ fontFamily: MONO }}>Excelsior</span>
                  <span className="uppercase text-[10px] tracking-[0.2em] pb-2" style={{ fontFamily: MONO, color: RED }}>AZ</span>
                  {excelsiorVsAz.map((r) => (
                    <div key={r.label} className="contents">
                      <span className="uppercase text-[10px] tracking-[0.2em] text-white/50 border-t py-3" style={{ fontFamily: MONO, borderColor: "rgba(255,255,255,0.14)" }}>
                        {r.label}
                      </span>
                      <span className="border-t py-3 text-white/70" style={{ borderColor: "rgba(255,255,255,0.14)" }}>{r.excelsior}</span>
                      <span className="border-t py-3 font-semibold" style={{ borderColor: "rgba(255,255,255,0.14)" }}>{r.az}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-6 text-[11px] text-white/40 leading-relaxed" style={{ fontFamily: MONO }}>
                Cijfers zijn casewaarden van Excelsior en gelden als benchmark, niet als garantie voor AZ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — DE ENGINE */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader index="04" title="De engine" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px mb-16 md:mb-20" style={{ backgroundColor: "hsl(var(--border))" }}>
            {modelSteps.map((s, i) => (
              <motion.div
                key={s.title}
                className="bg-background p-6 md:p-7"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
              >
                <p className="text-sm mb-4" style={{ fontFamily: MONO, color: RED }}>
                  {String(i + 1).padStart(2, "0")}
                  {i === modelSteps.length - 1 ? " ↺" : " →"}
                </p>
                <p className="font-display font-bold uppercase tracking-wide text-lg mb-2">{s.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Drie niveaus */}
            <div>
              <p className="uppercase text-xs tracking-[0.3em] mb-6" style={{ fontFamily: MONO, color: RED }}>
                Drie niveaus, één routingregel
              </p>
              <div className="border" style={{ borderColor: "hsl(var(--border))" }}>
                {levels.map((l, i) => (
                  <div
                    key={l.name}
                    className="grid grid-cols-[1fr_auto] gap-4 px-5 py-5 border-b last:border-b-0 items-center"
                    style={{
                      borderColor: "hsl(var(--border))",
                      backgroundColor: i === levels.length - 1 ? RED : undefined,
                      color: i === levels.length - 1 ? "#fff" : undefined,
                    }}
                  >
                    <div>
                      <p className="font-display font-bold uppercase tracking-wide text-lg">{l.name}</p>
                      <p className={`text-sm ${i === levels.length - 1 ? "text-white/85" : "text-muted-foreground"}`}>{l.rule}</p>
                    </div>
                    <p className="text-xs md:text-sm uppercase tracking-[0.15em] text-right" style={{ fontFamily: MONO }}>
                      {l.action}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Signalen */}
            <div>
              <p className="uppercase text-xs tracking-[0.3em] mb-6" style={{ fontFamily: MONO, color: RED }}>
                Voorbeelden van signalen
              </p>
              <ul>
                {signals.map((s) => (
                  <li
                    key={s}
                    className="flex items-center gap-4 border-b py-3.5 first:pt-0 text-sm md:text-base"
                    style={{ borderColor: "hsl(var(--border))" }}
                  >
                    <span className="h-2 w-2 shrink-0" style={{ backgroundColor: RED }} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-lg md:text-xl leading-snug" style={{ fontFamily: SERIF }}>
                Signalen vervallen. Daarom gaat hoge intentie <span style={{ color: RED }}>direct</span> naar de
                accountmanager.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — GOED OM TE WETEN */}
      <section className="py-16 md:py-24" style={STRIPES}>
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader index="05" title="Goed om te weten" />

          <div className="grid md:grid-cols-2 gap-x-16">
            {faqs.map((f) => (
              <div key={f.q} className="border-b py-6" style={{ borderColor: "hsl(var(--border))" }}>
                <p className="font-display font-bold text-base md:text-lg mb-1.5">{f.q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — CONTACT */}
      <section
        id="contact"
        className="relative overflow-hidden py-16 md:py-24 scroll-mt-24"
        style={{ backgroundColor: RED }}
      >
        {/* Stadiongloed boven de afsluiter */}
        <div
          aria-hidden
          className="psv-flood pointer-events-none absolute inset-x-0 top-0 h-72"
          style={{ background: "radial-gradient(60% 100% at 50% 0%, rgba(255,255,255,0.22), transparent 75%)" }}
        />
        <div className="container mx-auto px-4 md:px-6 text-white">
          <SectionHeader index="06" title="Aftrap?" light />

          <div className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-20 items-end">
            <div>
              <p className="text-2xl md:text-4xl leading-snug max-w-2xl mb-10" style={{ fontFamily: SERIF }}>
                In één gesprek laten wij zien hoe de Excelsior-engine eruitziet op de schaal van AZ, en met welk spoor we
                starten.
              </p>

              <div className="flex items-center gap-5 mb-8">
                <img
                  src={peterPhoto}
                  alt="Peter Grisel"
                  className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover ring-2 ring-white/70 shrink-0"
                />
                <div>
                  <p className="font-display font-bold uppercase tracking-wider text-base md:text-lg">Peter Grisel</p>
                  <p className="text-sm text-white/80">Oprichter, B2B Groeimachine</p>
                  <a
                    href="mailto:peter.grisel@rebelforce.nl"
                    className="mt-2 inline-flex items-center gap-2 text-sm hover:underline break-all"
                    style={{ fontFamily: MONO }}
                  >
                    <Mail className="h-4 w-4 shrink-0" /> peter.grisel@rebelforce.nl
                  </a>
                </div>
              </div>

              <a
                href="mailto:peter.grisel@rebelforce.nl?subject=AZ%20x%20B2B%20Groeimachine"
                className="inline-flex items-center gap-3 bg-white px-8 py-4 text-sm md:text-base font-display font-bold uppercase tracking-wider transition hover:gap-5"
                style={{ color: RED }}
              >
                Plan een gesprek <ArrowUpRight className="h-5 w-5" />
              </a>
            </div>

            <motion.p
              className="font-display font-bold uppercase tracking-tight leading-[0.95] text-3xl md:text-5xl text-right hidden lg:block"
              initial={{ opacity: 0, x: 44 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              Meer partners.
              <br /> Betere timing.
              <br /> Minder zoeken.
            </motion.p>
          </div>
        </div>
      </section>

      <div className="py-4 border-b" style={{ backgroundColor: INK, borderColor: "rgba(255,255,255,0.1)" }}>
        <div
          className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-2 text-[11px] md:text-xs tracking-[0.15em]"
          style={{ fontFamily: MONO }}
        >
          <span className="text-white/60">b2bgroeimachine.io</span>
          <span className="uppercase" style={{ color: RED }}>Van Excelsior naar Alkmaar</span>
          <span className="text-white/60">#GroeimetAI #NoordHolland</span>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AzPage;
