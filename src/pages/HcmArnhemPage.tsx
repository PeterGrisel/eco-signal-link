import { motion } from "framer-motion";
import {
  ArrowRight, Check, Mail, Phone, TrendingUp, Users, Eye, Target, Send,
  Filter, HandHeart, LineChart, Handshake, GraduationCap, Leaf, Star,
  HelpCircle, Building2, Cog, Shield,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";
import heroImage from "@/assets/hcm-arnhem-hero.jpg.asset.json";

const ORANGE = "#E8945A";
const ORANGE_SOFT = "#FBE4D3";
const INK = "#0B0F14";

// Small reusable pill icon on soft peach background
const IconPill = ({ children, size = "md" }: { children: React.ReactNode; size?: "sm" | "md" | "lg" }) => {
  const s = size === "lg" ? "h-14 w-14" : size === "sm" ? "h-9 w-9" : "h-11 w-11";
  return (
    <div
      className={`${s} rounded-full flex items-center justify-center shrink-0`}
      style={{ backgroundColor: ORANGE_SOFT, color: ORANGE }}
    >
      {children}
    </div>
  );
};

const HcmShield = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} aria-hidden>
    <path
      d="M50 4 L92 18 L92 62 C92 88 74 108 50 116 C26 108 8 88 8 62 L8 18 Z"
      fill={INK}
      stroke={ORANGE}
      strokeWidth="4"
    />
    <text
      x="50"
      y="55"
      textAnchor="middle"
      fontFamily="Space Grotesk, sans-serif"
      fontWeight="800"
      fontSize="20"
      fill="#ffffff"
      letterSpacing="1"
    >
      HCM
    </text>
    <text
      x="50"
      y="72"
      textAnchor="middle"
      fontFamily="Space Grotesk, sans-serif"
      fontWeight="700"
      fontSize="10"
      fill={ORANGE}
      letterSpacing="2"
    >
      ARNHEM
    </text>
    <path d="M32 88 L45 100 M68 88 L55 100" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const services = [
  { icon: Target, title: "Scherp doelprofiel", desc: "We bepalen uw ideale klant en kansrijke doelgroepen." },
  { icon: Users, title: "Leads & data", desc: "We vinden, verrijken en kwalificeren relevante bedrijven en contactpersonen." },
  { icon: Send, title: "Outreach & campagnes", desc: "Slimme e-mail, LinkedIn en multi-channel campagnes die opvallen." },
  { icon: Filter, title: "Kwalificatie & opvolging", desc: "AI en slimme workflows signaleren interesse en kwalificeren kansen." },
  { icon: HandHeart, title: "Warme overdracht", desc: "Geïnteresseerde leads worden overgedragen aan uw salesteam." },
  { icon: LineChart, title: "Maandelijkse optimalisatie", desc: "We optimaliseren continu campagnes, data en opvolging." },
];

const steps = [
  { icon: Building2, title: "U neemt een dienst af bij B2B Groeimachine." },
  { icon: Cog, title: "Wij bouwen en beheren uw AI-salesfunnel." },
  { icon: Users, title: "Uw sales krijgt warme kansen en meer grip op de pipeline." },
  { icon: Shield, title: "20% van uw maandelijkse investering gaat naar HCM Arnhem." },
  { icon: Eye, title: "Uw logo wordt zichtbaar op schermen en doeken bij HCM Arnhem." },
];

const winTiles = [
  {
    title: "UW BEDRIJF GROEIT",
    icon: TrendingUp,
    desc: "Meer leads, betere opvolging en warme kansen voor sales dankzij een beheerde AI-salesfunnel.",
  },
  {
    title: "HCM ARNHEM GROEIT",
    icon: Shield,
    desc: "20% van uw maandelijkse investering gaat structureel naar HCM Arnhem.",
  },
  {
    title: "UW ZICHTBAARHEID GROEIT",
    icon: Eye,
    desc: "Uw logo wordt zichtbaar als partner op schermen en doeken bij de tophockeyclub van Arnhem.",
  },
];

const whyItWorks = [
  { icon: GraduationCap, title: "INVESTEREN IN JONG TALENT", desc: "Wij investeren in jonge commerciële talenten en geven hen de kans om ervaring op te doen bij topbedrijven." },
  { icon: Leaf, title: "LOKALE ECONOMIE STIMULEREN", desc: "Samen bouwen we aan een sterk ondernemersklimaat en een florerende regio Arnhem." },
  { icon: Star, title: "SPORT & BUSINESS VERSTERKEN ELKAAR", desc: "Door sport en ondernemerschap te verbinden creëren we impact die verder gaat dan het veld." },
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

      {/* HERO — infographic-style with photo backdrop and shield */}
      <section className="relative pt-24 md:pt-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-border">
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
                  "linear-gradient(90deg, hsl(var(--background) / 0.96) 0%, hsl(var(--background) / 0.85) 45%, hsl(var(--background) / 0.55) 75%, hsl(var(--background) / 0.35) 100%)",
              }}
            />

            <div className="relative grid md:grid-cols-[1.5fr_1fr] gap-8 p-8 md:p-14 min-h-[520px] md:min-h-[600px]">
              <div className="flex flex-col justify-center">
                <p className="font-display text-xs md:text-sm tracking-[0.3em] uppercase text-primary font-bold mb-6">
                  B2B Groeimachine × HCM Arnhem
                </p>
                <h1 className="font-display font-black uppercase tracking-tight text-4xl md:text-6xl lg:text-7xl leading-[0.95] mb-6">
                  Groei met AI.
                  <br />
                  Word zichtbaar.
                  <br />
                  <span style={{ color: ORANGE }}>Versterk HCM Arnhem.</span>
                </h1>
                <p className="text-base md:text-lg text-foreground/85 max-w-xl leading-relaxed">
                  Neem een B2B Sales AI-dienst af bij B2B Groeimachine. Komt uw bedrijf uit{" "}
                  <span className="font-semibold" style={{ color: ORANGE }}>regio Arnhem</span>? Dan sponsoren wij{" "}
                  <span className="font-semibold" style={{ color: ORANGE }}>20% van uw maandelijkse investering</span>{" "}
                  aan HCM Arnhem.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
                  >
                    Plan een kennismaking <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#zo-werkt-het"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 backdrop-blur px-6 py-3 text-sm font-semibold hover:bg-background/80 transition"
                  >
                    Zo werkt het
                  </a>
                </div>
              </div>

              {/* Shield badge card */}
              <div className="hidden md:flex items-start justify-end">
                <div className="flex items-start gap-4">
                  <HcmShield className="w-24 h-28 drop-shadow-lg" />
                  <div className="pt-2">
                    <p className="font-display font-bold uppercase text-sm tracking-wider leading-tight" style={{ color: ORANGE }}>
                      Samen bouwen
                      <br /> aan tophockey
                      <br /> en een sterke
                      <br /> regio
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WIN-WIN-WIN black band */}
      <section className="py-8 md:py-10">
        <div className="container mx-auto px-4 md:px-6">
          <div
            className="rounded-2xl grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x"
            style={{ backgroundColor: INK, borderColor: "hsl(var(--border))", borderWidth: 1 }}
          >
            {winTiles.map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-start gap-4 p-6 md:p-7"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="h-12 w-12 rounded-full border-2 flex items-center justify-center shrink-0"
                  style={{ borderColor: ORANGE, color: ORANGE }}
                >
                  <w.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display font-black uppercase tracking-wider text-sm mb-2 text-white">
                    {w.title}
                  </p>
                  <p className="text-sm leading-relaxed text-white/75">{w.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WAT DOET B2B GROEIMACHINE + ZO WERKT HET */}
      <section id="zo-werkt-het" className="py-14 md:py-20">
        <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12">
          {/* Left column: services list */}
          <div>
            <h2 className="font-display font-black uppercase tracking-wider text-2xl md:text-3xl mb-3">
              Wat doet B2B Groeimachine?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Wij bouwen en beheren digitale salesfunnels met AI. Volledig gericht op structurele groei.
            </p>
            <ul className="space-y-5">
              {services.map((s) => (
                <li key={s.title} className="flex items-start gap-4">
                  <IconPill>
                    <s.icon className="h-5 w-5" />
                  </IconPill>
                  <div>
                    <p className="font-display font-bold text-base mb-0.5">{s.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column: process, price row, 20% band */}
          <div>
            <h2 className="font-display font-black uppercase tracking-wider text-2xl md:text-3xl mb-8">
              Zo werkt het
            </h2>

            {/* Numbered process */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center relative">
                  <div className="relative">
                    <div
                      className="h-16 w-16 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: ORANGE_SOFT, color: INK }}
                    >
                      <step.icon className="h-7 w-7" />
                    </div>
                    <div
                      className="absolute -top-2 -left-2 h-7 w-7 rounded-full flex items-center justify-center font-display font-black text-xs text-white"
                      style={{ backgroundColor: ORANGE }}
                    >
                      {i + 1}
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        aria-hidden
                        className="hidden md:block absolute top-1/2 -right-3 w-6 border-t-2 border-dashed"
                        style={{ borderColor: ORANGE, transform: "translateY(-50%)" }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-2 mb-10">
              {steps.map((step, i) => (
                <p key={i} className="text-[11px] md:text-xs text-center text-muted-foreground leading-tight px-1">
                  {step.title}
                </p>
              ))}
            </div>

            {/* Price stat row */}
            <div
              className="rounded-2xl border-2 grid grid-cols-3 divide-x mb-6"
              style={{ borderColor: ORANGE, borderStyle: "solid" }}
            >
              {[
                { label: "VANAF", value: "€1.500,-", sub: "PER MAAND" },
                { label: "MINIMAAL", value: "90 DAGEN", sub: "STARTPERIODE" },
                { label: "DAARNA", value: "MAANDELIJKS", sub: "OPZEGBAAR" },
              ].map((s) => (
                <div key={s.label} className="p-5 text-center" style={{ borderColor: "hsl(var(--border))" }}>
                  <p className="text-[10px] md:text-xs tracking-[0.2em] text-muted-foreground font-display font-bold mb-2">
                    {s.label}
                  </p>
                  <p className="font-display font-black text-xl md:text-2xl leading-tight" style={{ color: ORANGE }}>
                    {s.value}
                  </p>
                  <p className="text-[10px] md:text-xs tracking-[0.15em] text-muted-foreground font-semibold mt-2">
                    {s.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* 20% = handshake */}
            <div
              className="rounded-2xl p-5 md:p-6 flex items-center gap-5"
              style={{ backgroundColor: INK }}
            >
              <div className="text-center shrink-0">
                <p className="font-display font-black text-3xl md:text-4xl" style={{ color: ORANGE }}>
                  20%
                </p>
                <p className="text-[10px] tracking-[0.2em] font-display font-bold text-white mt-1">
                  NAAR
                  <br /> HCM ARNHEM
                </p>
              </div>
              <div className="font-display font-black text-3xl text-white/40">=</div>
              <Handshake className="h-10 w-10 shrink-0" style={{ color: ORANGE }} />
              <p className="text-sm text-white/85 font-medium leading-relaxed">
                Uw investering in groei, zichtbaarheid en een sterke club.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WAAROM DIT WERKT */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1" style={{ backgroundColor: ORANGE }} />
            <h2 className="font-display font-black uppercase tracking-[0.25em] text-lg md:text-2xl px-2 text-center">
              Waarom dit werkt
            </h2>
            <div className="h-px flex-1" style={{ backgroundColor: ORANGE }} />
          </div>

          <div className="rounded-2xl border-2 p-6 md:p-10 grid md:grid-cols-3 gap-8" style={{ borderColor: ORANGE }}>
            {whyItWorks.map((w) => (
              <div key={w.title} className="flex items-start gap-4">
                <IconPill size="lg">
                  <w.icon className="h-7 w-7" />
                </IconPill>
                <div>
                  <p className="font-display font-black uppercase tracking-wider text-sm mb-2 leading-snug">
                    {w.title}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ + ZICHTBAAR + CONTACT — three-column bottom band */}
      <section id="contact" className="py-14 md:py-20">
        <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-3 gap-6">
          {/* FAQ */}
          <div className="rounded-2xl border border-border p-6 md:p-8">
            <p className="font-display font-black uppercase tracking-wider text-sm mb-6" style={{ color: ORANGE }}>
              Veelgestelde vragen
            </p>
            <ul className="space-y-5">
              {faqs.map((f) => (
                <li key={f.q} className="flex items-start gap-3">
                  <HelpCircle className="h-4 w-4 mt-1 shrink-0" style={{ color: ORANGE }} />
                  <div>
                    <p className="font-display font-bold text-sm mb-1">{f.q}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.a}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Zichtbaar als partner */}
          <div className="rounded-2xl border border-border p-6 md:p-8">
            <p className="font-display font-black uppercase tracking-wider text-sm mb-6" style={{ color: ORANGE }}>
              Zichtbaar als partner
            </p>
            <p className="text-sm text-muted-foreground mb-4">Voorbeelden van zichtbaarheid:</p>
            <ul className="space-y-2.5">
              {visibilityPoints.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: ORANGE }} />
                  <span>{p}</span>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-2 gap-3 mt-6">
              {[0, 1].map((k) => (
                <div
                  key={k}
                  className="aspect-video rounded-lg border border-dashed flex items-center justify-center text-center"
                  style={{ borderColor: ORANGE, backgroundColor: ORANGE_SOFT }}
                >
                  <p className="font-display font-black text-xs md:text-sm" style={{ color: INK }}>
                    UW LOGO
                    <br /> HIER?
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact orange card */}
          <div
            className="rounded-2xl p-6 md:p-8 flex flex-col"
            style={{ backgroundColor: ORANGE, color: "#ffffff" }}
          >
            <p className="font-display font-black uppercase tracking-wider text-lg md:text-xl leading-tight">
              Interesse of vragen?
              <br /> Neem contact op!
            </p>

            <div className="mt-6 space-y-3">
              <p className="font-display font-black uppercase text-sm tracking-wider">Roderick Roelofs</p>
              <a
                href="mailto:roderick.roelofs@rebelforce.nl"
                className="inline-flex items-center gap-2 text-sm hover:underline break-all"
              >
                <Mail className="h-4 w-4 shrink-0" />
                roderick.roelofs@rebelforce.nl
              </a>
              <a href="tel:+31620516731" className="inline-flex items-center gap-2 text-sm hover:underline">
                <Phone className="h-4 w-4 shrink-0" />
                06-20516731
              </a>
            </div>

            <div className="mt-auto pt-8">
              <a
                href="mailto:roderick.roelofs@rebelforce.nl?subject=HCM%20Arnhem%20x%20B2B%20Groeimachine"
                className="inline-flex items-center justify-center w-full gap-2 rounded-full bg-white px-5 py-3 text-sm font-display font-bold uppercase tracking-wider hover:opacity-90 transition"
                style={{ color: ORANGE }}
              >
                Plan een gesprek <ArrowRight className="h-4 w-4" />
              </a>
              <p className="mt-5 font-display font-black uppercase text-sm tracking-wider leading-tight">
                Meer leads. Meer groei.
                <br /> Meer impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hashtag footer strip */}
      <div
        className="py-4 text-center border-t"
        style={{ backgroundColor: INK, borderColor: "hsl(var(--border))" }}
      >
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs md:text-sm">
          <span className="text-white/60 tracking-wider">b2bgroeimachine.io</span>
          <span className="font-display font-black uppercase tracking-[0.2em]" style={{ color: ORANGE }}>
            Uw groei. HCM Arnhem. De regio.
          </span>
          <span className="text-white/60 tracking-wider">#GroeimetAI #SamenSterker #HCMArnhem</span>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HcmArnhemPage;

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute -top-40 -right-32 w-[640px] h-[640px] rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${HCM.primary} 0%, transparent 70%)` }}
        />
        <div
          className="absolute -bottom-40 -left-32 w-[520px] h-[520px] rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${HCM.glow} 0%, transparent 70%)` }}
        />

        <div className="container mx-auto px-4 md:px-6 pt-32 md:pt-40 pb-20 md:pb-28 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-primary font-display font-semibold mb-6"
            >
              HCM Arnhem × B2B Groeimachine
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-6"
            >
              Groei met AI.<br />
              <span style={{ color: HCM.primary }}>Versterk HCM Arnhem.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8"
            >
              Word partner van HCM Arnhem en bouw tegelijk aan een moderne B2B-salesmachine.
              Komt uw bedrijf uit regio Arnhem? Dan sponsoren wij 20% van uw maandelijkse
              investering rechtstreeks aan de club.
            </motion.p>

            <div className="flex flex-wrap gap-3 mb-10">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
              >
                Plan een kennismaking <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#hoe"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-muted/40 transition"
              >
                Zo werkt het
              </a>
            </div>

            {/* Deal card */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 backdrop-blur p-6 md:p-8 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-display font-semibold mb-3">
                Vanaf
              </p>
              <p className="font-display text-3xl md:text-4xl font-bold mb-4">
                € 1.500 <span className="text-base font-normal text-muted-foreground">per maand</span>
              </p>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-3">
                  <Heart className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <span>20% naar HCM Arnhem</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <span>Vanaf € 300 per maand naar de club</span>
                </li>
                <li className="flex items-start gap-3">
                  <Euro className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <span>Vanaf € 3.600 per jaar clubbijdrage per partner</span>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <span>Minimaal 90 dagen, daarna maandelijks opzegbaar</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* NIEUWE VORM VAN PARTNERSCHAP */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-display font-semibold mb-3">
            Een nieuwe vorm van lokaal partnerschap
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight mb-6">
            Traditionele sponsoring is vaak alleen een kostenpost.
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mb-10">
            Een logo op een bord, een bijdrage aan de club en daarna hopen dat het iets oplevert.
            Wij doen het anders. U neemt een concrete commerciële groeidienst af. Tegelijk dragen wij
            20% van uw maandelijkse investering af aan HCM Arnhem.
          </p>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: "Commerciële groei", desc: "Meer structuur, meer commerciële activiteit en meer relevante kansen voor sales." },
              { title: "Structurele steun", desc: "Een vast percentage van uw investering gaat rechtstreeks naar HCM Arnhem." },
              { title: "Lokale zichtbaarheid", desc: "Uw bedrijf wordt zichtbaar als betrokken partner in het netwerk van de club." },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card/50 p-6"
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-display font-bold text-xl mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WAT KRIJGT U */}
      <section className="py-20 md:py-28 border-b border-border bg-card/20">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="max-w-3xl mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-display font-semibold mb-3">
              Wat krijgt u concreet?
            </p>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight mb-4">
              Een beheerde B2B-salesfunnel met AI.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Als partner krijgt u toegang tot B2B Groeimachine én wordt uw bedrijf meegenomen in
              de partnerzichtbaarheid van HCM Arnhem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {whatYouGet.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-background p-6 hover:border-primary/40 transition"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Zichtbaarheid */}
          <div className="mt-14 rounded-2xl border border-primary/30 bg-primary/5 p-6 md:p-10">
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-xl bg-primary/15 border border-primary/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl md:text-2xl mb-2">
                  Zichtbaarheid als partner van HCM Arnhem
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Uw deelname maakt u automatisch onderdeel van het HCM-partnernetwerk. Uw bedrijf
                  krijgt zichtbaarheid via:
                </p>
                <ul className="grid md:grid-cols-2 gap-2 text-sm">
                  {[
                    "Logovermelding als deelnemende partner",
                    "Zichtbaarheid op schermen bij HCM Arnhem",
                    "Zichtbaarheid op doeken en partneruitingen",
                    "Impressies bij leden, ouders, bezoekers en ondernemers",
                    "Koppeling aan een sterk lokaal sportnetwerk",
                  ].map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ZO WERKT HET */}
      <section id="hoe" className="py-20 md:py-28 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="max-w-3xl mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-display font-semibold mb-3">
              Zo werkt het
            </p>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight mb-4">
              Vijf stappen. Eén werkende samenwerking.
            </h2>
          </div>

          <div className="space-y-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex gap-5 items-start rounded-2xl border border-border bg-card/40 p-5 md:p-6 hover:border-primary/40 transition"
              >
                <div
                  className="font-display font-bold text-2xl md:text-3xl shrink-0 w-14 text-right"
                  style={{ color: HCM.primary }}
                >
                  {s.n}
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg md:text-xl mb-1">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VOOR WIE */}
      <section className="py-20 md:py-28 border-b border-border bg-card/20">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="max-w-3xl mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-display font-semibold mb-3">
              Voor wie is dit interessant?
            </p>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight mb-4">
              B2B-bedrijven in regio Arnhem met commerciële ambitie.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Vooral bedrijven met een duidelijke doelgroep, salesproces en groeiwens halen veel
              waarde uit deze aanpak.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {sectors.map((s) => (
              <span
                key={s}
                className="inline-flex items-center rounded-full border border-border bg-background px-3.5 py-1.5 text-sm text-foreground/80"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* WIN-WIN-WIN */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="max-w-3xl mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-display font-semibold mb-3">
              Win-win-win
            </p>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight">
              Uw bedrijf groeit. De club groeit. De regio groeit.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {wins.map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl border border-border bg-card/40 p-6"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                  <w.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{w.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 border-b border-border bg-card/20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-display font-semibold mb-3">
            Veelgestelde vragen
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight mb-10">
            Alles wat u wilt weten.
          </h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-border bg-background p-5 md:p-6 open:border-primary/40 transition"
              >
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-display font-semibold text-lg">
                  <span>{f.q}</span>
                  <span className="text-primary transition group-open:rotate-45 text-2xl leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / CONTACT */}
      <section id="contact" className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div
            className="rounded-3xl border border-primary/40 p-8 md:p-14 relative overflow-hidden"
            style={{
              background: `radial-gradient(120% 120% at 0% 0%, ${HCM.primary}22 0%, transparent 60%), radial-gradient(120% 120% at 100% 100%, ${HCM.glow}18 0%, transparent 60%)`,
            }}
          >
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-display font-semibold mb-3">
                Groei slimmer. Word zichtbaar.
              </p>
              <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight mb-5">
                Versterk HCM Arnhem. Groei uw bedrijf.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Neem een dienst af bij B2B Groeimachine. Wij dragen 20% af aan HCM Arnhem, en uw
                merk krijgt extra zichtbaarheid bij de tophockeyclub van Arnhem.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="rounded-xl border border-border bg-background/70 p-5">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Contact</p>
                  <p className="font-display font-bold text-lg">Roderick Roelofs</p>
                  <a
                    href="mailto:roderick.roelofs@rebelforce.nl"
                    className="inline-flex items-center gap-2 mt-2 text-sm text-primary hover:underline"
                  >
                    <Mail className="h-4 w-4" /> roderick.roelofs@rebelforce.nl
                  </a>
                  <a
                    href="tel:+31620516731"
                    className="inline-flex items-center gap-2 mt-1 text-sm text-primary hover:underline"
                  >
                    <Phone className="h-4 w-4" /> 06-20516731
                  </a>
                </div>
                <div className="rounded-xl border border-border bg-background/70 p-5">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">De deal</p>
                  <p className="font-display font-bold text-lg">Vanaf € 1.500 per maand</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    20% naar HCM Arnhem. Minimaal 90 dagen, daarna maandelijks opzegbaar. Geen jaarcommitment.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:roderick.roelofs@rebelforce.nl?subject=HCM%20Arnhem%20x%20B2B%20Groeimachine"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
                >
                  Plan een kennismaking <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-muted/40 transition"
                >
                  Stel een vraag
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HcmArnhemPage;