import { ArrowRight, ArrowUpRight, Mail, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";
import heroImage from "@/assets/hcm-arnhem-hero-real.webp.asset.json";
import roderickPhoto from "@/assets/roderick-roelofs.png.asset.json";
import hcmLogo from "@/assets/hcm-arnhem-logo.png.asset.json";

const ORANGE = "#EA5D1E"; // Real HCM Arnhem orange
const INK = "#0B0F14";
const SERIF = "'DM Serif Display', Georgia, serif";
const MONO = "'JetBrains Mono', monospace";

// Subtle diagonal pitch-line texture used on section backdrops
const PITCH_LINES = {
  backgroundImage: `repeating-linear-gradient(-55deg, ${ORANGE}0f 0 1px, transparent 1px 22px)`,
};

const tickerItems = [
  "Groei met AI",
  "Word zichtbaar",
  "Versterk HCM Arnhem",
  "20% naar de club",
  "Regio Arnhem",
];

const services = [
  { title: "Scherp doelprofiel", desc: "We bepalen uw ideale klant en kansrijke doelgroepen." },
  { title: "Leads & data", desc: "We vinden, verrijken en kwalificeren relevante bedrijven en contactpersonen." },
  { title: "Outreach & campagnes", desc: "Slimme e-mail, LinkedIn en multi-channel campagnes die opvallen." },
  { title: "Kwalificatie & opvolging", desc: "AI en slimme workflows signaleren interesse en kwalificeren kansen." },
  { title: "Warme overdracht", desc: "Geïnteresseerde leads worden overgedragen aan uw salesteam." },
  { title: "Maandelijkse optimalisatie", desc: "We optimaliseren continu campagnes, data en opvolging." },
];

const steps = [
  { title: "Dienst afnemen", desc: "U neemt een B2B Sales AI-dienst af bij B2B Groeimachine." },
  { title: "Wij bouwen", desc: "Wij bouwen en beheren uw AI-salesfunnel." },
  { title: "Sales scoort", desc: "Uw sales krijgt warme kansen en meer grip op de pipeline." },
  { title: "Club groeit", desc: "20% van uw maandelijkse investering gaat naar HCM Arnhem." },
  { title: "U wordt gezien", desc: "Uw logo wordt zichtbaar op schermen en doeken bij HCM Arnhem." },
];

const winTiles = [
  { title: "Uw bedrijf groeit", desc: "Meer leads, betere opvolging en warme kansen voor sales dankzij een beheerde AI-salesfunnel." },
  { title: "HCM Arnhem groeit", desc: "20% van uw maandelijkse investering gaat structureel naar HCM Arnhem." },
  { title: "Uw zichtbaarheid groeit", desc: "Uw logo wordt zichtbaar als partner op schermen en doeken bij de tophockeyclub van Arnhem." },
];

const whyItWorks = [
  { title: "Investeren in jong talent", desc: "Wij investeren in jonge commerciële talenten en geven hen de kans om ervaring op te doen bij topbedrijven." },
  { title: "Lokale economie stimuleren", desc: "Samen bouwen we aan een sterk ondernemersklimaat en een florerende regio Arnhem." },
  { title: "Sport & business versterken elkaar", desc: "Door sport en ondernemerschap te verbinden creëren we impact die verder gaat dan het veld." },
];

const faqs = [
  { q: "Is dit sponsoring of een dienst?", a: "U neemt een dienst af bij B2B Groeimachine. Wij leveren resultaat. 20% gaat naar HCM Arnhem." },
  { q: "Wat krijgt HCM Arnhem?", a: "20% van uw maandelijkse investering als structurele sponsorbijdrage." },
  { q: "Krijg ik zichtbaarheid?", a: "Ja. Uw logo wordt zichtbaar op schermen en doeken bij HCM Arnhem en in het netwerk." },
  { q: "Moet ik een jaarcontract afsluiten?", a: "Nee. Minimaal 90 dagen, daarna maandelijks opzegbaar." },
];

const visibilityPoints = [
  "Logovermelding als partner",
  "Zichtbaarheid op schermen in het clubhuis",
  "Doekzichtbaarheid langs het veld",
  "Exposure richting leden, ouders, bezoekers en ondernemers",
  "Onderdeel van het HCM partnernetwerk",
];

const SectionHeader = ({ index, title }: { index: string; title: string }) => (
  <div className="flex items-baseline gap-4 border-t-2 pt-5 mb-10 md:mb-14" style={{ borderColor: ORANGE }}>
    <span className="text-sm md:text-base" style={{ fontFamily: MONO, color: ORANGE }}>
      {index}
    </span>
    <h2 className="font-display font-bold uppercase tracking-tight text-3xl md:text-5xl leading-none">
      {title}
    </h2>
  </div>
);

const HcmArnhemPage = () => {
  usePageMeta({
    title: "HCM Arnhem × B2B Groeimachine — Groei met AI, versterk de club",
    description: "Neem een B2B Sales AI-dienst af bij B2B Groeimachine. Komt uw bedrijf uit regio Arnhem? Dan sponsoren wij 20% van uw maandelijkse investering aan HCM Arnhem.",
    canonical: "https://www.b2bgroeimachine.io/hcm-arnhem",
    themeColor: ORANGE,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO — full-bleed photo, poster typography hanging over the edge */}
      <section className="relative pt-20 md:pt-24">
        <div className="relative h-[46vh] min-h-[320px] md:h-[62vh] overflow-hidden">
          <img
            src={heroImage.url}
            alt="Hockeyveld HCM Arnhem"
            width={1920}
            height={1080}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, hsl(var(--background) / 0.55) 0%, hsl(var(--background) / 0.15) 40%, hsl(var(--background)) 100%)",
            }}
          />

          {/* Matchday-style meta line */}
          <div className="absolute top-6 inset-x-0">
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
              <p className="uppercase text-[11px] md:text-xs tracking-[0.25em] text-white/90" style={{ fontFamily: MONO }}>
                Partnerprogramma — regio Arnhem
              </p>
              <p className="hidden sm:block uppercase text-[11px] md:text-xs tracking-[0.25em] text-white/90" style={{ fontFamily: MONO }}>
                B2B Groeimachine × HCM Arnhem
              </p>
            </div>
          </div>

          <img
            src={hcmLogo.url}
            alt="HCM Arnhem — sinds 1975"
            width={200}
            height={200}
            className="absolute right-4 md:right-10 bottom-4 md:bottom-8 w-20 h-20 md:w-32 md:h-32 object-contain"
            style={{ filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.45))" }}
          />
        </div>

        <div className="container mx-auto px-4 md:px-6 -mt-24 md:-mt-40 relative">
          <h1 className="font-display font-bold uppercase tracking-tight leading-[0.92] text-[13vw] sm:text-6xl md:text-7xl lg:text-8xl">
            Groei met AI.
            <br />
            Word zichtbaar.
            <br />
            <span style={{ color: ORANGE }}>Versterk HCM Arnhem.</span>
          </h1>

          <div className="mt-8 md:mt-10 grid md:grid-cols-[1fr_auto] gap-8 items-end">
            <p className="text-base md:text-xl max-w-2xl leading-relaxed text-foreground/85">
              Neem een B2B Sales AI-dienst af bij B2B Groeimachine. Komt uw bedrijf uit{" "}
              <em style={{ fontFamily: SERIF, color: ORANGE }}>regio Arnhem</em>? Dan sponsoren wij{" "}
              <em style={{ fontFamily: SERIF, color: ORANGE }}>20% van uw maandelijkse investering</em>{" "}
              aan HCM Arnhem.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-display font-bold uppercase tracking-wider text-white transition hover:translate-x-0.5"
                style={{ backgroundColor: ORANGE }}
              >
                Plan een kennismaking <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#zo-werkt-het"
                className="inline-flex items-center gap-2 border px-6 py-3.5 text-sm font-display font-bold uppercase tracking-wider transition hover:border-current"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                Zo werkt het
              </a>
            </div>
          </div>
        </div>

        {/* Ticker strip */}
        <div className="mt-12 md:mt-16 border-y overflow-hidden py-3" style={{ borderColor: "hsl(var(--border))" }}>
          <div className="flex w-max animate-marquee">
            {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
              <span
                key={i}
                className="flex items-center whitespace-nowrap uppercase text-xs md:text-sm tracking-[0.3em] px-6"
                style={{ fontFamily: MONO, color: i % 2 === 0 ? ORANGE : "hsl(var(--muted-foreground))" }}
              >
                {item}
                <span className="ml-12 text-[8px]" style={{ color: ORANGE }}>◆</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 01 — DE AFSPRAAK: giant 20% + three wins as ruled columns */}
      <section className="py-16 md:py-24" style={PITCH_LINES}>
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader index="01" title="De afspraak" />

          <div className="grid lg:grid-cols-[auto_1fr] gap-8 lg:gap-16 items-center mb-14 md:mb-20">
            <p
              className="font-display font-bold leading-none text-[28vw] lg:text-[13rem] select-none"
              style={{ WebkitTextStroke: `3px ${ORANGE}`, color: "transparent" }}
              aria-hidden
            >
              20%
            </p>
            <p className="text-2xl md:text-4xl leading-snug max-w-xl" style={{ fontFamily: SERIF }}>
              Van elke euro die u maandelijks investeert, gaat twintig procent{" "}
              <span style={{ color: ORANGE }}>rechtstreeks naar HCM Arnhem</span>. Uw groei is de sponsoring.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-x-10 gap-y-8">
            {winTiles.map((w, i) => (
              <div key={w.title} className="border-t pt-5" style={{ borderColor: "hsl(var(--border))" }}>
                <p className="uppercase text-xs tracking-[0.25em] mb-3" style={{ fontFamily: MONO, color: ORANGE }}>
                  Winst {String(i + 1).padStart(2, "0")}
                </p>
                <p className="font-display font-bold uppercase tracking-wide text-lg mb-2">{w.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 02 — WAT DOET B2B GROEIMACHINE: editorial numbered index */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader index="02" title="Wat doet B2B Groeimachine?" />

          <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground lg:sticky lg:top-28 self-start">
              Wij bouwen en beheren digitale salesfunnels met AI.{" "}
              <em style={{ fontFamily: SERIF, color: "hsl(var(--foreground))" }}>
                Volledig gericht op structurele groei.
              </em>
            </p>

            <ol>
              {services.map((s, i) => (
                <li
                  key={s.title}
                  className="group grid grid-cols-[3rem_1fr] md:grid-cols-[4rem_16rem_1fr] gap-x-4 md:gap-x-8 items-baseline border-b py-5 md:py-6 transition-colors hover:bg-white/[0.02]"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <span className="text-sm md:text-base" style={{ fontFamily: MONO, color: ORANGE }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-display font-bold uppercase tracking-wide text-base md:text-lg">
                    {s.title}
                  </p>
                  <p className="col-start-2 md:col-start-3 text-sm text-muted-foreground leading-relaxed mt-1 md:mt-0">
                    {s.desc}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 03 — ZO WERKT HET: vertical play-by-play timeline + scoreboard */}
      <section id="zo-werkt-het" className="py-16 md:py-24" style={PITCH_LINES}>
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader index="03" title="Zo werkt het" />

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Timeline */}
            <div className="relative pl-10 md:pl-14">
              <div className="absolute left-3 md:left-4 top-2 bottom-2 w-px" style={{ backgroundColor: ORANGE }} />
              {steps.map((step, i) => (
                <div key={step.title} className="relative pb-10 last:pb-0">
                  <span
                    className="absolute -left-10 md:-left-14 top-0 h-7 w-7 md:h-9 md:w-9 flex items-center justify-center text-xs md:text-sm text-white"
                    style={{ backgroundColor: i === steps.length - 1 ? ORANGE : INK, fontFamily: MONO, border: `1px solid ${ORANGE}` }}
                  >
                    {i + 1}
                  </span>
                  <p className="font-display font-bold uppercase tracking-wide text-lg md:text-xl mb-1">
                    {step.title}
                  </p>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Scoreboard */}
            <div className="self-start lg:sticky lg:top-28">
              <div className="border" style={{ backgroundColor: INK, borderColor: "rgba(255,255,255,0.12)" }}>
                <div className="px-6 py-3 border-b flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
                  <span className="uppercase text-[10px] tracking-[0.3em] text-white/60" style={{ fontFamily: MONO }}>
                    De voorwaarden
                  </span>
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ORANGE }} />
                </div>
                {[
                  { label: "Vanaf", value: "€ 1.500", sub: "per maand" },
                  { label: "Minimaal", value: "90 dagen", sub: "startperiode" },
                  { label: "Daarna", value: "Maandelijks", sub: "opzegbaar" },
                  { label: "Naar HCM Arnhem", value: "20%", sub: "van uw investering" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="px-6 py-5 border-b last:border-b-0 flex items-baseline justify-between gap-4"
                    style={{ borderColor: "rgba(255,255,255,0.12)" }}
                  >
                    <span className="uppercase text-[10px] md:text-xs tracking-[0.25em] text-white/60" style={{ fontFamily: MONO }}>
                      {row.label}
                    </span>
                    <span className="text-right">
                      <span className="block text-xl md:text-2xl" style={{ fontFamily: MONO, color: ORANGE }}>
                        {row.value}
                      </span>
                      <span className="block uppercase text-[10px] tracking-[0.2em] text-white/50 mt-0.5" style={{ fontFamily: MONO }}>
                        {row.sub}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-lg md:text-xl leading-snug" style={{ fontFamily: SERIF }}>
                Uw investering in groei, zichtbaarheid <span style={{ color: ORANGE }}>en een sterke club.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — WAAROM DIT WERKT: ghost numerals */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader index="04" title="Waarom dit werkt" />

          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {whyItWorks.map((w, i) => (
              <div key={w.title} className="relative pt-14 md:pt-20">
                <span
                  className="absolute top-0 left-0 font-display font-bold leading-none text-7xl md:text-8xl select-none"
                  style={{ WebkitTextStroke: `1.5px ${ORANGE}66`, color: "transparent" }}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-display font-bold uppercase tracking-wide text-lg mb-3 relative">{w.title}</p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed relative">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 — VRAGEN & ZICHTBAARHEID: two ruled columns */}
      <section className="py-16 md:py-24" style={PITCH_LINES}>
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader index="05" title="Goed om te weten" />

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* FAQ */}
            <div>
              <p className="uppercase text-xs tracking-[0.3em] mb-6" style={{ fontFamily: MONO, color: ORANGE }}>
                Veelgestelde vragen
              </p>
              <ul>
                {faqs.map((f) => (
                  <li key={f.q} className="border-b py-5 first:pt-0" style={{ borderColor: "hsl(var(--border))" }}>
                    <p className="font-display font-bold text-base md:text-lg mb-1.5">{f.q}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Zichtbaar als partner */}
            <div>
              <p className="uppercase text-xs tracking-[0.3em] mb-6" style={{ fontFamily: MONO, color: ORANGE }}>
                Zichtbaar als partner
              </p>
              <ul className="mb-8">
                {visibilityPoints.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-4 border-b py-3.5 first:pt-0 text-sm md:text-base"
                    style={{ borderColor: "hsl(var(--border))" }}
                  >
                    <span className="h-2 w-2 shrink-0" style={{ backgroundColor: ORANGE }} />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-2 gap-4">
                {[0, 1].map((k) => (
                  <div
                    key={k}
                    className="aspect-video border border-dashed flex items-center justify-center text-center"
                    style={{ borderColor: ORANGE }}
                  >
                    <p className="uppercase text-xs md:text-sm tracking-[0.2em]" style={{ fontFamily: MONO, color: ORANGE }}>
                      Uw logo
                      <br /> hier?
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — CONTACT: full-width orange band */}
      <section id="contact" className="py-16 md:py-24" style={{ backgroundColor: ORANGE }}>
        <div className="container mx-auto px-4 md:px-6 text-white">
          <div className="flex items-baseline gap-4 border-t-2 border-white pt-5 mb-10 md:mb-14">
            <span className="text-sm md:text-base" style={{ fontFamily: MONO }}>06</span>
            <h2 className="font-display font-bold uppercase tracking-tight text-3xl md:text-5xl leading-none">
              Interesse of vragen?
            </h2>
          </div>

          <div className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-20 items-end">
            <div>
              <p className="text-2xl md:text-4xl leading-snug max-w-2xl mb-10" style={{ fontFamily: SERIF }}>
                Eén gesprek en u weet of dit voor uw bedrijf werkt — en wat het HCM Arnhem oplevert.
              </p>

              <div className="flex items-center gap-5 mb-8">
                <img
                  src={roderickPhoto.url}
                  alt="Roderick Roelofs"
                  className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover ring-2 ring-white/70 shrink-0"
                />
                <div>
                  <p className="font-display font-bold uppercase tracking-wider text-base md:text-lg">Roderick Roelofs</p>
                  <div className="mt-2 flex flex-col gap-1.5 text-sm" style={{ fontFamily: MONO }}>
                    <a href="mailto:roderick.roelofs@rebelforce.nl" className="inline-flex items-center gap-2 hover:underline break-all">
                      <Mail className="h-4 w-4 shrink-0" /> roderick.roelofs@rebelforce.nl
                    </a>
                    <a href="tel:+31620516731" className="inline-flex items-center gap-2 hover:underline">
                      <Phone className="h-4 w-4 shrink-0" /> 06-20516731
                    </a>
                  </div>
                </div>
              </div>

              <a
                href="mailto:roderick.roelofs@rebelforce.nl?subject=HCM%20Arnhem%20x%20B2B%20Groeimachine"
                className="inline-flex items-center gap-3 bg-white px-8 py-4 text-sm md:text-base font-display font-bold uppercase tracking-wider transition hover:gap-5"
                style={{ color: ORANGE }}
              >
                Plan een gesprek <ArrowUpRight className="h-5 w-5" />
              </a>
            </div>

            <p className="font-display font-bold uppercase tracking-tight leading-[0.95] text-3xl md:text-5xl text-right hidden lg:block">
              Meer leads.
              <br /> Meer groei.
              <br /> Meer impact.
            </p>
          </div>
        </div>
      </section>

      {/* Hashtag footer strip */}
      <div className="py-4 border-b" style={{ backgroundColor: INK, borderColor: "rgba(255,255,255,0.1)" }}>
        <div
          className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-2 text-[11px] md:text-xs tracking-[0.15em]"
          style={{ fontFamily: MONO }}
        >
          <span className="text-white/60">b2bgroeimachine.io</span>
          <span className="uppercase" style={{ color: ORANGE }}>Uw groei. HCM Arnhem. De regio.</span>
          <span className="text-white/60">#GroeimetAI #SamenSterker #HCMArnhem</span>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HcmArnhemPage;
