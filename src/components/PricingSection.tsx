import { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { motion } from "framer-motion";
import { Check, Minus, Handshake, Infinity as InfinityIcon, Phone, Clock, Target, Database, FileText, Rocket } from "lucide-react";
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
  forWho: string;
  gtmHours: string;
  description: string;
  features: string[];
  ctaIntent: "gratisScan" | "bespreekSituatie";
  ctaLocation: string;
  ctaLabel?: string;
  highlight?: boolean;
  footnote?: string;
};

type Lang = "nl" | "en";
type Currency = "EUR" | "USD" | "GBP";

// Base prices in EUR. Other currencies are derived from live FX rates passed in via context.
const BASE_PRICES_EUR = { start: 1500, growth: 2250, scale: 3500, partner: 5000 } as const;

const CURRENCY_META: Record<Currency, { locale: string; symbol: string }> = {
  EUR: { locale: "nl-NL", symbol: "€" },
  USD: { locale: "en-US", symbol: "$" },
  GBP: { locale: "en-GB", symbol: "£" },
};

/** Round to a "nice" price — nearest 50 below 5000, nearest 100 above. */
function nicePrice(n: number): number {
  if (n >= 5000) return Math.round(n / 100) * 100;
  return Math.round(n / 50) * 50;
}

const makeFmt = (currency: Currency, rate: number) => {
  const { locale, symbol } = CURRENCY_META[currency];
  return (eurAmount: number) => `${symbol}${nicePrice(eurAmount * rate).toLocaleString(locale)}`;
};

const makePrices = (currency: Currency, rate: number) => ({
  start: nicePrice(BASE_PRICES_EUR.start * rate),
  growth: nicePrice(BASE_PRICES_EUR.growth * rate),
  scale: nicePrice(BASE_PRICES_EUR.scale * rate),
  partner: nicePrice(BASE_PRICES_EUR.partner * rate),
  ...CURRENCY_META[currency],
});

const T = {
  nl: {
    eyebrow: "Commercieel model",
    headLine1: "Kies de B2B Engine",
    headLine2: "die past bij uw groeifase.",
    headSub: "Geen losse campagnes. Een commerciële machine die elke maand kansen signaleert, activeert en opvolgbaar maakt.",
    monthly: "Maandelijks",
    yearly12: "12 maanden",
    perMonth: "/ maand",
    yearlyMeta: "12 maanden · 20% korting",
    monthlyMeta: "Min. 3 maanden · daarna maandelijks opzegbaar",
    onRequest: "Op aanvraag",
    partnerMeta: "Vanaf · maatwerk",
    fromPrice: "Vanaf",
    mostChosen: "Meest gekozen",
    startBadge: "Instap",
    startTitle: "Start Engine",
    startFor: "Bedrijven die hun outbound basis willen neerzetten.",
    startHours: "4 uur GTM-service p/m",
    startDesc: "Systeem live, basislijsten en eerste campagnes.",
    startFeatures: ["1 doelgroep / ICP", "1 outbound campagneflow", "Basis prospectlijst", "E-mailactivatie", "Lichte LinkedIn-activatie", "Maandelijkse rapportage"],
    growthBadge: "Hoofdaanbod",
    growthTitle: "Growth Engine",
    growthFor: "Bedrijven die structureel nieuwe kansen willen creëren.",
    growthHours: "8 uur GTM-service p/m",
    growthDesc: "Actieve campagnes met continue optimalisatie.",
    growthFeatures: ["2 doelgroepen / ICP's", "2 campagneflows", "Signaal-gedreven leadlijsten", "E-mail en LinkedIn-activatie", "Engagement scoring", "Basis CRM-verwerking"],
    scaleBadge: "Managed groei",
    scaleTitle: "Scale Engine",
    scaleFor: "Bedrijven die meerdere doelgroepen en kanalen draaien.",
    scaleHours: "16 uur GTM-service p/m",
    scaleDesc: "Volledig managed GTM-machine met regie.",
    scaleFeatures: ["3-4 doelgroepen", "Meerdere campagneflows", "Dataverrijking en lead scoring", "E-mail, LinkedIn en signalen", "CRM-sync en pipeline", "Tweewekelijkse rapportage"],
    partnerBadge: "Enterprise",
    partnerTitle: "Partner Engine",
    partnerFor: "Grotere teams, partners of multi-label omgevingen.",
    partnerHours: "Maatwerk GTM-service",
    partnerDesc: "Multi-account, CRM-koppeling en custom reporting.",
    partnerFeatures: ["Multi-account omgeving", "Meerdere proposities", "Sales team enablement", "HubSpot of CRM-koppeling", "Custom reporting", "Dedicated GTM-architectuur"],
    bookCall: "Bespreek uw situatie",
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
    addOnsEyebrow: "BOOST-PAKKETTEN",
    addOnsTitle: "Bouw uw B2B Engine verder uit.",
    addOnsSub: "Breid uw basispakket uit met extra capaciteit, bereik, CRM-inrichting of content. Zo groeit de engine mee met uw commerciële ambitie, zonder direct een groter sales- of marketingteam op te bouwen.",
    callEyebrow: "LIEVER OOK TELEFONISCHE OPVOLGING?",
    callTitle: "Call Boost",
    callPrice: "apart te bespreken",
    callBody: "Voor persoonlijke opvolging, kwalificatie en afspraakactivatie via commerciële salespartners. Denk aan telefonische opvolging van warme leads en prospects die engagement tonen.",
    callCta: "Bespreek Call Boost →",
    footerLine: "Wilt u weten wat dit voor uw situatie betekent?",
    ctaScan: "Boek gratis scan →",
    ctaTalk: "Boek gratis scan →",
    ctaFooter: "Boek gratis scan →",
    compareTitle: "Vergelijk de pakketten",
    compareSub: "Wat zit er in elke Engine?",
  },
  en: {
    eyebrow: "Commercial model",
    headLine1: "Pick the B2B Engine",
    headLine2: "that fits your growth stage.",
    headSub: "No one-off campaigns. A commercial machine that signals, activates and follows up new opportunities every month.",
    monthly: "Monthly",
    yearly12: "12 months",
    perMonth: "/ month",
    yearlyMeta: "12 months · 20% off",
    monthlyMeta: "Min. 3 months · monthly cancellation after",
    onRequest: "On request",
    partnerMeta: "From · custom scope",
    fromPrice: "From",
    mostChosen: "Most chosen",
    startBadge: "Entry",
    startTitle: "Start Engine",
    startFor: "Companies setting up their outbound foundation.",
    startHours: "4 hours GTM service / month",
    startDesc: "System live, base lists and first campaigns.",
    startFeatures: ["1 target audience / ICP", "1 outbound campaign flow", "Base prospect list", "Email activation", "Light LinkedIn activation", "Monthly reporting"],
    growthBadge: "Core offer",
    growthTitle: "Growth Engine",
    growthFor: "Companies that want structurally new opportunities.",
    growthHours: "8 hours GTM service / month",
    growthDesc: "Active campaigns with continuous optimization.",
    growthFeatures: ["2 target audiences / ICPs", "2 campaign flows", "Signal-based lead lists", "Email and LinkedIn activation", "Engagement scoring", "Base CRM handling"],
    scaleBadge: "Managed growth",
    scaleTitle: "Scale Engine",
    scaleFor: "Companies running multiple audiences and channels.",
    scaleHours: "16 hours GTM service / month",
    scaleDesc: "Fully managed GTM machine with regie.",
    scaleFeatures: ["3-4 target audiences", "Multiple campaign flows", "Data enrichment and lead scoring", "Email, LinkedIn and signals", "CRM sync and pipeline", "Bi-weekly reporting"],
    partnerBadge: "Enterprise",
    partnerTitle: "Partner Engine",
    partnerFor: "Larger teams, partners or multi-label environments.",
    partnerHours: "Custom GTM service",
    partnerDesc: "Multi-account, CRM integration and custom reporting.",
    partnerFeatures: ["Multi-account environment", "Multiple propositions", "Sales team enablement", "HubSpot or CRM integration", "Custom reporting", "Dedicated GTM architecture"],
    bookCall: "Discuss your situation",
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
    addOnsEyebrow: "BOOST PACKAGES",
    addOnsTitle: "Extend your B2B Engine.",
    addOnsSub: "Expand your base package with extra capacity, reach, CRM setup or content. Your engine grows with your commercial ambition, without hiring a bigger team.",
    callEyebrow: "WANT PHONE FOLLOW-UP TOO?",
    callTitle: "Call Boost",
    callPrice: "discussed separately",
    callBody: "For personal follow-up, qualification and meeting activation via commercial sales partners. Think phone follow-up of warm leads and prospects showing engagement.",
    callCta: "Discuss Call Boost →",
    footerLine: "Want to know what this means for your situation?",
    ctaScan: "Book free scan →",
    ctaTalk: "Book a call →",
    ctaFooter: "Book a call →",
    compareTitle: "Compare the packages",
    compareSub: "What's included in each Engine?",
  },
} as const;

const buildFases = (yearly: boolean, lang: Lang, currency: Currency, rate: number): Fase[] => {
  const t = T[lang];
  const fmt = makeFmt(currency, rate);
  const p = BASE_PRICES_EUR;
  const yr = (eur: number) => eur * 0.8;
  const priceFor = (eur: number) => (yearly ? fmt(yr(eur)) : fmt(eur));
  const strikeFor = (eur: number) => (yearly ? fmt(eur) : undefined);
  return [
  {
    step: t.startBadge,
    badge: t.startBadge,
    title: t.startTitle,
    price: priceFor(p.start),
    priceSuffix: t.perMonth,
    priceStrike: strikeFor(p.start),
    meta: yearly ? t.yearlyMeta : t.monthlyMeta,
    forWho: t.startFor,
    gtmHours: t.startHours,
    description: t.startDesc,
    features: [...t.startFeatures],
    ctaIntent: "gratisScan",
    ctaLocation: "Pricing Start Engine",
    ctaLabel: t.ctaScan,
  },
  {
    step: t.mostChosen,
    badge: t.growthBadge,
    title: t.growthTitle,
    price: priceFor(p.growth),
    priceSuffix: t.perMonth,
    priceStrike: strikeFor(p.growth),
    meta: yearly ? t.yearlyMeta : t.monthlyMeta,
    forWho: t.growthFor,
    gtmHours: t.growthHours,
    description: t.growthDesc,
    features: [...t.growthFeatures],
    ctaIntent: "gratisScan",
    ctaLocation: "Pricing Growth Engine",
    ctaLabel: t.ctaScan,
    highlight: true,
  },
  {
    step: t.scaleBadge,
    badge: t.scaleBadge,
    title: t.scaleTitle,
    price: priceFor(p.scale),
    priceSuffix: t.perMonth,
    priceStrike: strikeFor(p.scale),
    meta: yearly ? t.yearlyMeta : t.monthlyMeta,
    forWho: t.scaleFor,
    gtmHours: t.scaleHours,
    description: t.scaleDesc,
    features: [...t.scaleFeatures],
    ctaIntent: "gratisScan",
    ctaLocation: "Pricing Scale Engine",
    ctaLabel: t.ctaScan,
  },
  {
    step: t.partnerBadge,
    badge: t.partnerBadge,
    title: t.partnerTitle,
    price: `${t.fromPrice} ${fmt(p.partner)}`,
    priceSuffix: t.perMonth,
    meta: t.partnerMeta,
    forWho: t.partnerFor,
    gtmHours: t.partnerHours,
    description: t.partnerDesc,
    features: [...t.partnerFeatures],
    ctaIntent: "bespreekSituatie",
    ctaLocation: "Pricing Partner Engine",
    ctaLabel: t.bookCall,
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
      "relative rounded-2xl p-5 md:p-6 flex flex-col h-full border transition-colors",
      fase.highlight
        ? "border-primary/40 bg-primary/5 shadow-[0_0_40px_-12px_hsl(var(--primary)/0.35)]"
        : "border-border bg-card hover:border-primary/30",
    )}
  >
    {fase.highlight && (
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-display font-semibold tracking-[0.18em] uppercase bg-primary text-primary-foreground px-3 py-1 rounded-full">
        {fase.step}
      </span>
    )}
    <div className="flex items-center justify-between mb-5">
      <span className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-primary/80">
        {fase.badge}
      </span>
      <span className="inline-flex items-center gap-1 text-[10px] font-display font-semibold tracking-wide uppercase text-muted-foreground">
        <Clock className="w-3 h-3" />
        {fase.gtmHours}
      </span>
    </div>

    <h3 className="font-display font-bold text-xl leading-tight mb-2">
      {fase.title}
    </h3>
    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{fase.forWho}</p>

    <div className="flex items-baseline gap-2 mb-1 flex-wrap">
      <span className="font-display font-bold text-3xl md:text-4xl tracking-tight">
        {fase.price}
      </span>
      {fase.priceSuffix && (
        <span className="text-muted-foreground text-sm">{fase.priceSuffix}</span>
      )}
      {fase.priceStrike && (
        <span className="text-muted-foreground/60 text-sm line-through">{fase.priceStrike}</span>
      )}
    </div>
    <p className="text-[11px] text-muted-foreground mb-5">{fase.meta}</p>

    <p className="text-sm text-foreground/80 leading-relaxed mb-5">
      {fase.description}
    </p>

    <ul className="space-y-2 mb-6 flex-1">
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

const COMPARE_ROWS_NL: { label: string; values: [string, string, string, string] }[] = [
  { label: "Doelgroepen", values: ["1", "2", "3-4", "Maatwerk"] },
  { label: "Campagneflows", values: ["1", "2", "3+", "Maatwerk"] },
  { label: "E-mailactivatie", values: ["Ja", "Ja", "Ja", "Multi-account"] },
  { label: "LinkedIn-activatie", values: ["Licht", "Ja", "Ja", "Multi-account"] },
  { label: "Dataverrijking", values: ["Basis", "Ja", "Ja + scoring", "Advanced"] },
  { label: "Engagement scoring", values: ["Basis", "Ja", "Ja", "Advanced"] },
  { label: "CRM-verwerking", values: ["Hand-off", "Basis sync", "Sync + pipeline", "Integraties"] },
  { label: "Rapportage", values: ["Maandelijks", "Maandelijks", "2-wekelijks", "Maatwerk"] },
  { label: "GTM-service", values: ["4 uur p/m", "8 uur p/m", "16 uur p/m", "Maatwerk"] },
  { label: "Minimale looptijd", values: ["3 maanden", "3 maanden", "3 maanden", "Maatwerk"] },
];

const COMPARE_ROWS_EN: { label: string; values: [string, string, string, string] }[] = [
  { label: "Target audiences", values: ["1", "2", "3-4", "Custom"] },
  { label: "Campaign flows", values: ["1", "2", "3+", "Custom"] },
  { label: "Email activation", values: ["Yes", "Yes", "Yes", "Multi-account"] },
  { label: "LinkedIn activation", values: ["Light", "Yes", "Yes", "Multi-account"] },
  { label: "Data enrichment", values: ["Base", "Yes", "Yes + scoring", "Advanced"] },
  { label: "Engagement scoring", values: ["Base", "Yes", "Yes", "Advanced"] },
  { label: "CRM handling", values: ["Hand-off", "Base sync", "Sync + pipeline", "Integrations"] },
  { label: "Reporting", values: ["Monthly", "Monthly", "Bi-weekly", "Custom"] },
  { label: "GTM service", values: ["4 hrs / m", "8 hrs / m", "16 hrs / m", "Custom"] },
  { label: "Min. term", values: ["3 months", "3 months", "3 months", "Custom"] },
];

const ComparisonTable = ({ lang }: { lang: Lang }) => {
  const tt = T[lang];
  const rows = lang === "nl" ? COMPARE_ROWS_NL : COMPARE_ROWS_EN;
  const headers = [tt.startTitle, tt.growthTitle, tt.scaleTitle, tt.partnerTitle];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="mt-12 md:mt-16 rounded-2xl border border-border bg-card/40 overflow-hidden"
    >
      <div className="p-6 md:p-8 border-b border-border">
        <h3 className="font-display font-bold text-xl md:text-2xl tracking-tight">{tt.compareTitle}</h3>
        <p className="text-sm text-muted-foreground mt-1">{tt.compareSub}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-background/40">
              <th className="text-left font-display font-semibold text-xs tracking-wide uppercase text-muted-foreground py-3 px-4 md:px-6">&nbsp;</th>
              {headers.map((h, i) => (
                <th key={h} className={cn(
                  "text-left font-display font-semibold text-xs tracking-wide uppercase py-3 px-3 md:px-4",
                  i === 1 ? "text-primary" : "text-foreground/80",
                )}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border/50 last:border-0">
                <td className="py-3 px-4 md:px-6 text-muted-foreground">{row.label}</td>
                {row.values.map((v, i) => (
                  <td key={i} className={cn(
                    "py-3 px-3 md:px-4",
                    i === 1 ? "text-primary font-medium bg-primary/5" : "text-foreground/90",
                  )}>
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const buildBoosts = (lang: Lang, fmt: (eur: number) => string) => {
  const pm = lang === "nl" ? " p/m" : " / mo";
  const from = lang === "nl" ? "vanaf " : "from ";
  if (lang === "nl") {
    return [
      {
        icon: Rocket,
        title: "GTM Boost",
        price: `${from}${fmt(575)}${pm}`,
        desc: "Extra commerciële capaciteit voor strategie, campagnes en optimalisatie.",
        items: ["5 extra GTM-service uren per maand", "Campagne-optimalisatie", "Propositie-aanscherping", "Nieuwe berichtvarianten", "Analyse van campagnes en conversie"],
        footer: `Losse uitbreiding: ${fmt(125)} per extra GTM-uur.`,
      },
      {
        icon: Target,
        title: "Reach Boost",
        price: `${from}${fmt(750)}${pm}`,
        desc: "Activeer extra doelgroepen, campagneflows en LinkedIn-accounts.",
        items: ["Extra doelgroep / ICP", "Extra campagneflow", "Extra LinkedIn-account", "Extra datalijst en verrijking", "Extra engagementlaag"],
        footer: `Staffel: ${fmt(500)} / ${fmt(750)} / ${fmt(950)} p/m.`,
      },
      {
        icon: Database,
        title: "CRM Boost",
        price: `HubSpot/Pipedrive ${from}${fmt(2500)}`,
        desc: "Richt uw commerciële opvolging goed in met pipelines, velden, stages en rapportage.",
        items: ["Pipeline-inrichting", "Deal stages en leadstatussen", "Velden en segmentatie", "Basisautomatisering", "Dashboard en rapportage"],
        footer: `Optioneel beheer: ${from}${fmt(500)}${pm}.`,
      },
      {
        icon: FileText,
        title: "Content Boost",
        price: `${from}${fmt(950)}${pm}`,
        desc: "Vergroot engagement met LinkedIn-content, mailcopy, nurture en klantcases.",
        items: ["LinkedIn-posts", "Campagnecopy en e-mailvarianten", "Klantcases", "Nurture-content", "Content op basis van signalen"],
        footer: `Staffel: Lite ${fmt(750)} / Boost ${fmt(950)} / Engine ${from}${fmt(1500)}${pm}.`,
      },
    ];
  }
  return [
    {
      icon: Rocket,
      title: "GTM Boost",
      price: `${from}${fmt(575)}${pm}`,
      desc: "Extra commercial capacity for strategy, campaigns and optimization.",
      items: ["5 extra GTM service hours per month", "Campaign optimization", "Proposition sharpening", "New message variants", "Campaign and conversion analysis"],
      footer: `Add-on: ${fmt(125)} per extra GTM hour.`,
    },
    {
      icon: Target,
      title: "Reach Boost",
      price: `${from}${fmt(750)}${pm}`,
      desc: "Activate extra audiences, campaign flows and LinkedIn seats.",
      items: ["Extra audience / ICP", "Extra campaign flow", "Extra LinkedIn seat", "Extra data list and enrichment", "Extra engagement layer"],
      footer: `Tiered: ${fmt(500)} / ${fmt(750)} / ${fmt(950)} / mo.`,
    },
    {
      icon: Database,
      title: "CRM Boost",
      price: `HubSpot/Pipedrive ${from}${fmt(2500)}`,
      desc: "Set up commercial follow-up properly with pipelines, fields, stages and reporting.",
      items: ["Pipeline setup", "Deal stages and lead statuses", "Fields and segmentation", "Base automation", "Dashboard and reporting"],
      footer: `Optional management: ${from}${fmt(500)}${pm}.`,
    },
    {
      icon: FileText,
      title: "Content Boost",
      price: `${from}${fmt(950)}${pm}`,
      desc: "Grow engagement with LinkedIn content, email copy, nurture and customer cases.",
      items: ["LinkedIn posts", "Campaign and email copy", "Customer cases", "Nurture content", "Signal-based content"],
      footer: `Tiered: Lite ${fmt(750)} / Boost ${fmt(950)} / Engine ${from}${fmt(1500)}${pm}.`,
    },
  ];
};

const BoostsGrid = ({ lang, currency, rate }: { lang: Lang; currency: Currency; rate: number }) => {
  const tt = T[lang];
  const fmt = makeFmt(currency, rate);
  const items = buildBoosts(lang, fmt);
  return (
    <div className="mt-12 md:mt-16">
      <div className="text-center mb-8 max-w-2xl mx-auto">
        <p className="text-[11px] font-display font-semibold tracking-[0.2em] uppercase text-primary/80 mb-3">
          {tt.addOnsEyebrow}
        </p>
        <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight">{tt.addOnsTitle}</h3>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{tt.addOnsSub}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors p-5 md:p-6 flex flex-col"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="font-display font-bold text-lg leading-tight">{item.title}</h4>
                  <p className="text-sm text-primary/90 font-medium mt-0.5">{item.price}</p>
                </div>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-4">{item.desc}</p>
              <ul className="space-y-2 mb-4 flex-1">
                {item.items.map((it) => (
                  <li key={it} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" strokeWidth={3} />
                    </span>
                    <span className="text-foreground/90">{it}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-muted-foreground border-t border-border/60 pt-3">{item.footer}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const CallBoostSection = ({ lang }: { lang: Lang }) => {
  const tt = T[lang];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45 }}
      className="mt-8 md:mt-10 rounded-2xl border border-dashed border-primary/30 bg-card/40 p-5 md:p-7 flex flex-col md:flex-row gap-5 md:items-center md:justify-between"
    >
      <div className="flex items-start gap-4 flex-1">
        <span className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
          <Phone className="w-5 h-5" />
        </span>
        <div>
          <p className="text-[10px] font-display font-semibold tracking-[0.2em] uppercase text-primary/80 mb-1">
            {tt.callEyebrow}
          </p>
          <h4 className="font-display font-bold text-lg md:text-xl">
            {tt.callTitle} <span className="text-muted-foreground font-normal text-sm">· {tt.callPrice}</span>
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed mt-1 max-w-2xl">{tt.callBody}</p>
        </div>
      </div>
      <Button variant="outline" size="sm" asChild className="md:shrink-0">
        <CtaLink intent="bespreekSituatie" location="Pricing Call Boost">
          {tt.callCta}
        </CtaLink>
      </Button>
    </motion.div>
  );
};

const PerformancePartnership = ({ lang, currency, rate }: { lang: Lang; currency: Currency; rate: number }) => {
  const tt = T[lang];
  const fmt = makeFmt(currency, rate);
  const ppTechValue = `${fmt(500)} — ${fmt(1000)}`;
  return (
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
            {tt.ppEyebrow}
          </span>
        </div>
        <h3 className="font-display font-bold text-2xl md:text-4xl leading-tight tracking-tight mb-4">
          {tt.ppTitleA}
          <br />
          <span className="text-muted-foreground font-normal text-xl md:text-2xl">
            {tt.ppTitleB}
          </span>
        </h3>
        <p className="text-muted-foreground text-base leading-relaxed max-w-xl mb-6">
          {tt.ppBody}
        </p>

        <p className="text-[11px] font-display font-semibold tracking-[0.18em] uppercase text-primary/80 mb-3">
          {tt.ppAdmit}
        </p>
        <ul className="space-y-2 text-sm">
          {tt.ppAdmitList.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-foreground/90">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
        <div className="rounded-xl border border-border bg-background/40 backdrop-blur p-5">
          <p className="text-[10px] font-display font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-3">
            {tt.ppTechLabel}
          </p>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="font-display font-bold text-3xl tracking-tight">{ppTechValue}</span>
          </div>
          <p className="text-xs text-muted-foreground">{tt.ppTechSuffix}</p>
        </div>
        <div className="rounded-xl border border-primary/40 bg-primary/10 p-5">
          <p className="text-[10px] font-display font-semibold tracking-[0.2em] uppercase text-primary/90 mb-3">
            {tt.ppShareLabel}
          </p>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="font-display font-bold text-3xl tracking-tight">{tt.ppShareValue}</span>
          </div>
          <p className="text-xs text-muted-foreground">{tt.ppShareSuffix}</p>
        </div>
        <div className="sm:col-span-2 rounded-xl border border-dashed border-primary/25 bg-background/30 p-5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {tt.ppFine1}
          </p>
        </div>
        <div className="sm:col-span-2 rounded-xl border border-dashed border-primary/25 bg-background/30 p-5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {tt.ppFine2a}{" "}
            <a
              href="https://rebelforce-hubs.com/rebel-force"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              {tt.ppFine2link}
            </a>{" "}
            {tt.ppFine2b}
          </p>
        </div>
        <div className="sm:col-span-2">
          <Button variant="hero" size="lg" asChild className="w-full group">
            <CtaLink intent="bespreekSituatie" location="Pricing Performance Partnership">
              {tt.ctaTalk}
            </CtaLink>
          </Button>
        </div>
      </div>
    </div>
  </motion.div>
  );
};

const BillingToggle = ({
  yearly,
  onChange,
  lang,
}: {
  yearly: boolean;
  onChange: (v: boolean) => void;
  lang: Lang;
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
      {T[lang].monthly}
    </button>
    <button
      type="button"
      onClick={() => onChange(true)}
      className={cn(
        "px-4 py-1.5 text-xs font-display font-semibold tracking-wide uppercase rounded-full transition-colors flex items-center gap-2",
        yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {T[lang].yearly12}
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

interface PricingSectionProps {
  language?: Lang;
  currency?: Currency;
}

const PricingSection = ({ language = "nl", currency }: PricingSectionProps = {}) => {
  const [yearly, setYearly] = useState(false);
  const { currency: ctxCurrency, rates } = useCurrency();
  const lang: Lang = language;
  const cur: Currency = currency ?? (ctxCurrency as Currency);
  const rate = rates[cur] ?? 1;
  const fases = buildFases(yearly, lang, cur, rate);
  const tt = T[lang];

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
          className="mb-12 md:mb-16 text-center max-w-3xl mx-auto"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            {tt.eyebrow}
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-tight">
            {tt.headLine1}
            <br />
            <span className="text-gradient">{tt.headLine2}</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            {tt.headSub}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <BillingToggle yearly={yearly} onChange={setYearly} lang={lang} />
            <CurrencySwitcher variant="inline" />
          </div>
        </motion.div>

        {/* Fase grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 items-stretch">
          {fases.map((fase, i) => (
            <PricingCard key={fase.title} fase={fase} index={i} />
          ))}
        </div>

        {/* Comparison table */}
        <ComparisonTable lang={lang} />

        {/* Boost packages */}
        <BoostsGrid lang={lang} currency={cur} rate={rate} />

        {/* Call Boost */}
        <CallBoostSection lang={lang} />

        {/* Performance Partnership */}
        <div className="mt-12 md:mt-16">
          <PerformancePartnership lang={lang} currency={cur} rate={rate} />
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
            {tt.footerLine}{" "}
            <CtaLink
              intent="bespreekSituatie"
              location="Pricing Footer"
              className="text-primary hover:underline font-medium inline-flex items-center gap-1"
            >
              {tt.ctaFooter}
            </CtaLink>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
