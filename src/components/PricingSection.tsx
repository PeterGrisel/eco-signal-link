import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Handshake, Infinity as InfinityIcon, Lightbulb, Users, Plug, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CtaLink from "@/components/CtaLink";

type Fase = {
  step: string;
  badge: string;
  title: string;
  price: string;
  priceSuffix?: string;
  priceStrike?: string;
  meta: string;
  description: string;
  features: string[];
  ctaIntent: "gratisScan" | "bespreekSituatie";
  ctaLocation: string;
  ctaLabel?: string;
  highlight?: boolean;
  footnote?: string;
};

type Lang = "nl" | "en";
type Currency = "EUR" | "USD";

const PRICES: Record<Currency, { monthly: number; locale: string; symbol: string }> = {
  EUR: { monthly: 2250, locale: "nl-NL", symbol: "€" },
  USD: { monthly: 2500, locale: "en-US", symbol: "$" },
};

const makeFmt = (currency: Currency) => {
  const { locale, symbol } = PRICES[currency];
  return (n: number) => `${symbol}${n.toLocaleString(locale)}`;
};

const T = {
  nl: {
    eyebrow: "Commercieel model",
    headLine1: "Lage drempel.",
    headLine2: "Schaalbare waarde.",
    headSub: "Eén systeem. Drie manieren om ermee te starten. Wij denken in lifetime, niet in losse projecten.",
    monthly: "Maandelijks",
    yearly12: "12 maanden",
    perMonth: "/ maand",
    yearlyMeta: "12 maanden · 20% korting",
    monthlyMeta: "Maandelijks opzegbaar",
    onRequest: "Op aanvraag",
    sprintMeta: "Build & transfer · projectbasis",
    sdrMeta: "Per uur · inhuren naar behoefte",
    growthBadge: "Groeisysteem",
    growthTitle: "Growth System",
    growthDesc: "Wij draaien uw groeisysteem. Signalen, routing en engagement.",
    growthFeatures: ["ICP en signaal-scoring", "Routing en dashboard", "Engagement en optimalisatie", "Dedicated campagnemanager"],
    growthFootnote: "Doel: lifetime partnership.",
    sprintBadge: "Build Sprint",
    sprintTitle: "Sprint · 6 maanden",
    sprintDesc: "Wij bouwen uw systeem in 6 maanden. Ideaal voor start-ups en scale-ups.",
    sprintFeatures: ["Volledige setup en training", "Overdracht aan uw team", "Running fee voor licenties erna", "Optioneel: doorlopend beheer"],
    sdrBadge: "SDR Service",
    sdrTitle: "GTM capaciteit per uur",
    sdrDesc: "Extra GTM-handen wanneer u ze nodig heeft. Geen vaste fee.",
    sdrFeatures: ["Sales development (SDR)", "Outbound en follow-up", "Op uur- of dagbasis", "Naadloos op uw systeem"],
    sdrCta: "Reserveer uw capaciteit",
    planA: "Plan A", planB: "Plan B", planC: "Plan C",
    ppEyebrow: "Voor gekwalificeerde klanten",
    ppTitleA: "Performance Partnership.",
    ppTitleB: "Lage techkosten. Gedeelde upside.",
    ppBody: "Voor wie al omzet draait, maar het systeem mist. Wij bouwen en draaien de groeimachine. U deelt mee in de upside die het systeem oplevert.",
    ppAdmit: "Toelating",
    ppAdmitList: ["Bewezen B2B-propositie met klanten", "Gezonde marges en dealwaarde", "Transparante CRM- en salesdata", "Heldere attributie-afspraken vooraf"],
    ppTechLabel: "Min. techkosten",
    ppTechValue: "€500 — 1.000",
    ppTechSuffix: "/ maand",
    ppShareLabel: "Revenue share",
    ppShareValue: "5 — 15%",
    ppShareSuffix: "van toegeschreven omzet",
    ppFine1: "Alleen op duidelijk afgebakende, door het systeem gegenereerde of beïnvloede omzet. Attributie wordt vooraf vastgelegd.",
    ppFine2a: "Wij investeren regelmatig in start-ups met een barter-constructie.",
    ppFine2link: "Bekijk de voorwaarden",
    ppFine2b: "en join onze hub.",
    servicesEyebrow: "UW B2B GROEIPARTNER VOOR",
    services: ["Advies", "Consultancy", "Tool integraties (AI)", "Service & Beheer"],
    footerLine: "Wilt u weten wat dit voor uw situatie betekent?",
  },
  en: {
    eyebrow: "Commercial model",
    headLine1: "Low threshold.",
    headLine2: "Scalable value.",
    headSub: "One system. Three ways to start. We think in lifetime, not in one-off projects.",
    monthly: "Monthly",
    yearly12: "12 months",
    perMonth: "/ month",
    yearlyMeta: "12 months · 20% off",
    monthlyMeta: "Cancel any time",
    onRequest: "On request",
    sprintMeta: "Build & transfer · project basis",
    sdrMeta: "Per hour · hire as needed",
    growthBadge: "Growth System",
    growthTitle: "Growth System",
    growthDesc: "We run your growth system. Signals, routing and engagement.",
    growthFeatures: ["ICP and signal scoring", "Routing and dashboard", "Engagement and optimization", "Dedicated campaign manager"],
    growthFootnote: "Goal: lifetime partnership.",
    sprintBadge: "Build Sprint",
    sprintTitle: "Sprint · 6 months",
    sprintDesc: "We build your system in 6 months. Ideal for start-ups and scale-ups.",
    sprintFeatures: ["Full setup and training", "Handover to your team", "Running fee for licenses after", "Optional: ongoing management"],
    sdrBadge: "SDR Service",
    sdrTitle: "GTM capacity per hour",
    sdrDesc: "Extra GTM hands when you need them. No fixed fee.",
    sdrFeatures: ["Sales development (SDR)", "Outbound and follow-up", "Hourly or daily basis", "Seamless on your system"],
    sdrCta: "Reserve your capacity",
    planA: "Plan A", planB: "Plan B", planC: "Plan C",
    ppEyebrow: "For qualified clients",
    ppTitleA: "Performance Partnership.",
    ppTitleB: "Low tech cost. Shared upside.",
    ppBody: "For brands already generating revenue, but missing the system. We build and run the growth machine. You share in the upside the system delivers.",
    ppAdmit: "Admission",
    ppAdmitList: ["Proven B2B proposition with customers", "Healthy margins and deal value", "Transparent CRM and sales data", "Clear attribution agreements upfront"],
    ppTechLabel: "Min. tech cost",
    ppTechValue: "$550 — 1,100",
    ppTechSuffix: "/ month",
    ppShareLabel: "Revenue share",
    ppShareValue: "5 — 15%",
    ppShareSuffix: "of attributed revenue",
    ppFine1: "Only on clearly scoped revenue generated or influenced by the system. Attribution is agreed upfront.",
    ppFine2a: "We regularly invest in start-ups with a barter structure.",
    ppFine2link: "See the terms",
    ppFine2b: "and join our hub.",
    servicesEyebrow: "YOUR B2B GROWTH PARTNER FOR",
    services: ["Advisory", "Consultancy", "Tool integrations (AI)", "Service & Support"],
    footerLine: "Want to know what this means for your situation?",
  },
} as const;

const buildFases = (yearly: boolean, lang: Lang, currency: Currency): Fase[] => {
  const t = T[lang];
  const fmt = makeFmt(currency);
  const monthly = PRICES[currency].monthly;
  const yearlyPrice = Math.round(monthly * 0.8);
  return [
  {
    step: t.planA,
    badge: t.growthBadge,
    title: t.growthTitle,
    price: yearly ? fmt(yearlyPrice) : fmt(monthly),
    priceSuffix: t.perMonth,
    priceStrike: yearly ? fmt(monthly) : undefined,
    meta: yearly ? t.yearlyMeta : t.monthlyMeta,
    description: t.growthDesc,
    features: [...t.growthFeatures],
    ctaIntent: "gratisScan",
    ctaLocation: "Pricing Growth System",
    highlight: true,
    footnote: t.growthFootnote,
  },
  {
    step: t.planB,
    badge: t.sprintBadge,
    title: t.sprintTitle,
    price: t.onRequest,
    meta: t.sprintMeta,
    description: t.sprintDesc,
    features: [...t.sprintFeatures],
    ctaIntent: "bespreekSituatie",
    ctaLocation: "Pricing Sprint",
  },
  {
    step: t.planC,
    badge: t.sdrBadge,
    title: t.sdrTitle,
    price: t.onRequest,
    meta: t.sdrMeta,
    description: t.sdrDesc,
    features: [...t.sdrFeatures],
    ctaIntent: "bespreekSituatie",
    ctaLocation: "Pricing SDR",
    ctaLabel: t.sdrCta,
  },
];
};

const PricingCard = ({ fase, index }: { fase: Fase; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.45, delay: index * 0.06 }}
    className={cn(
      "relative rounded-2xl p-6 md:p-7 flex flex-col h-full border transition-colors",
      fase.highlight
        ? "border-primary/40 bg-primary/5 shadow-[0_0_40px_-12px_hsl(var(--primary)/0.35)]"
        : "border-border bg-card hover:border-primary/30",
    )}
  >
    <div className="flex items-center justify-between mb-5">
      <span className="text-[10px] font-display font-semibold tracking-[0.2em] uppercase text-primary/80">
        {fase.step}
      </span>
      <span className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-muted-foreground">
        {fase.badge}
      </span>
    </div>

    <h3 className="font-display font-bold text-xl leading-tight mb-3">
      {fase.title}
    </h3>

    <div className="flex items-baseline gap-2 mb-1 flex-wrap">
      <span className="font-display font-bold text-4xl md:text-5xl tracking-tight">
        {fase.price}
      </span>
      {fase.priceSuffix && (
        <span className="text-muted-foreground text-sm">{fase.priceSuffix}</span>
      )}
      {fase.priceStrike && (
        <span className="text-muted-foreground/60 text-sm line-through">{fase.priceStrike}</span>
      )}
    </div>
    <p className="text-xs text-muted-foreground mb-5">{fase.meta}</p>

    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
      {fase.description}
    </p>

    <ul className="space-y-2.5 mb-6 flex-1">
      {fase.features.map((f) => (
        <li key={f} className="flex items-start gap-2.5 text-sm">
          <span
            className={cn(
              "mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0",
              fase.highlight ? "bg-primary text-primary-foreground" : "bg-primary/15 text-primary",
            )}
          >
            <Check className="w-2.5 h-2.5" strokeWidth={3} />
          </span>
          <span className="text-foreground/90">{f}</span>
        </li>
      ))}
    </ul>

    {fase.footnote && (
      <p className="flex items-center gap-1.5 text-[11px] text-primary/80 mb-3">
        <InfinityIcon className="w-3.5 h-3.5" />
        {fase.footnote}
      </p>
    )}

    <Button
      variant={fase.highlight ? "hero" : "outline"}
      size="sm"
      asChild
      className="w-full"
    >
      <CtaLink intent={fase.ctaIntent} location={fase.ctaLocation}>
        {fase.ctaLabel}
      </CtaLink>
    </Button>
  </motion.div>
);

const SERVICES: { icon: typeof Lightbulb; title: string; desc: string }[] = [
  {
    icon: Lightbulb,
    title: "Advies",
    desc: "\n",
  },
  {
    icon: Users,
    title: "Consultancy",
    desc: "\n",
  },
  {
    icon: Plug,
    title: "Tool integraties (AI)",
    desc: "\n",
  },
  {
    icon: LifeBuoy,
    title: "Service & Beheer",
    desc: "\n",
  },
];

const ServiceCards = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10 md:mb-14">
    {SERVICES.map((s, i) => {
      const Icon = s.icon;
      return (
        <motion.div
          key={s.title}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="rounded-xl border border-border bg-card hover:border-primary/40 transition-colors p-4 md:p-5"
        >
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4" />
            </span>
            <h4 className="font-display font-semibold text-sm tracking-wide">{s.title}</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
        </motion.div>
      );
    })}
  </div>
);

const PerformancePartnership = () => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5 }}
    className="relative rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-6 md:p-10 overflow-hidden"
  >
    <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.25),transparent_60%)]" />

    <div className="relative grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-start">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Handshake className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-display font-semibold tracking-[0.22em] uppercase text-primary/90">
            Voor gekwalificeerde klanten
          </span>
        </div>
        <h3 className="font-display font-bold text-2xl md:text-4xl leading-tight tracking-tight mb-4">
          Performance Partnership.
          <br />
          <span className="text-muted-foreground font-normal text-xl md:text-2xl">
            Lage techkosten. Gedeelde upside.
          </span>
        </h3>
        <p className="text-muted-foreground text-base leading-relaxed max-w-xl mb-6">
          Voor wie al omzet draait, maar het systeem mist. Wij bouwen en draaien de
          groeimachine. U deelt mee in de upside die het systeem oplevert.
        </p>

        <p className="text-[11px] font-display font-semibold tracking-[0.18em] uppercase text-primary/80 mb-3">
          Toelating
        </p>
        <ul className="space-y-2 text-sm">
          {[
            "Bewezen B2B-propositie met klanten",
            "Gezonde marges en dealwaarde",
            "Transparante CRM- en salesdata",
            "Heldere attributie-afspraken vooraf",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-foreground/90">{t}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
        <div className="rounded-xl border border-border bg-background/40 backdrop-blur p-5">
          <p className="text-[10px] font-display font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-3">
            Min. techkosten
          </p>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="font-display font-bold text-3xl tracking-tight">€500 — 1.000</span>
          </div>
          <p className="text-xs text-muted-foreground">/ maand</p>
        </div>
        <div className="rounded-xl border border-primary/40 bg-primary/10 p-5">
          <p className="text-[10px] font-display font-semibold tracking-[0.2em] uppercase text-primary/90 mb-3">
            Revenue share
          </p>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="font-display font-bold text-3xl tracking-tight">5 — 15%</span>
          </div>
          <p className="text-xs text-muted-foreground">van toegeschreven omzet</p>
        </div>
        <div className="sm:col-span-2 rounded-xl border border-dashed border-primary/25 bg-background/30 p-5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Alleen op duidelijk afgebakende, door het systeem gegenereerde of
            beïnvloede omzet. Attributie wordt vooraf vastgelegd.
          </p>
        </div>
        <div className="sm:col-span-2 rounded-xl border border-dashed border-primary/25 bg-background/30 p-5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Wij investeren regelmatig in start-ups met een barter-constructie.{" "}
            <a
              href="https://rebelforce-hubs.com/rebel-force"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Bekijk de voorwaarden
            </a>{" "}
            en join onze hub.
          </p>
        </div>
        <div className="sm:col-span-2">
          <Button variant="hero" size="lg" asChild className="w-full group">
            <CtaLink intent="bespreekSituatie" location="Pricing Performance Partnership" />
          </Button>
        </div>
      </div>
    </div>
  </motion.div>
);

const BillingToggle = ({
  yearly,
  onChange,
}: {
  yearly: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
    <button
      type="button"
      onClick={() => onChange(false)}
      className={cn(
        "px-4 py-1.5 text-xs font-display font-semibold tracking-wide uppercase rounded-full transition-colors",
        !yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      Maandelijks
    </button>
    <button
      type="button"
      onClick={() => onChange(true)}
      className={cn(
        "px-4 py-1.5 text-xs font-display font-semibold tracking-wide uppercase rounded-full transition-colors flex items-center gap-2",
        yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      12 maanden
      <span
        className={cn(
          "text-[10px] px-1.5 py-0.5 rounded-full",
          yearly ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/15 text-primary",
        )}
      >
        −20%
      </span>
    </button>
  </div>
);

const PricingSection = () => {
  const [yearly, setYearly] = useState(false);
  const fases = buildFases(yearly);

  return (
    <section id="pricing" className="py-16 md:py-32 relative">
      <div className="absolute inset-0 glow-bg pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 text-center max-w-2xl mx-auto"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Commercieel model
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-tight">
            Lage drempel.
            <br />
            <span className="text-gradient">Schaalbare waarde.</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Eén systeem. Drie manieren om ermee te starten. Wij denken in lifetime, niet in losse projecten.
          </p>
          <div className="mt-8 flex justify-center">
            <BillingToggle yearly={yearly} onChange={setYearly} />
          </div>
        </motion.div>

        {/* Fase grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 items-stretch mb-10 md:mb-14">
          {fases.map((fase, i) => (
            <PricingCard key={fase.title} fase={fase} index={i} />
          ))}
        </div>

        {/* Performance Partnership */}
        <PerformancePartnership />

        {/* Aanvullende diensten */}
        <div className="mt-10 md:mt-14">
          <p className="text-center text-[11px] font-display font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-5">
            UW B2B GROEIPARTNER VOOR
          </p>
          <ServiceCards />
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mt-10 text-center"
        >
          <p className="text-muted-foreground text-sm">
            Wilt u weten wat dit voor uw situatie betekent?{" "}
            <CtaLink
              intent="bespreekSituatie"
              location="Pricing Footer"
              className="text-primary hover:underline font-medium inline-flex items-center gap-1"
            />
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
