import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import CtaLink from "@/components/CtaLink";

type Fase = {
  step: string;
  badge: string;
  title: string;
  price: string;
  priceSuffix?: string;
  meta: string;
  description: string;
  features: string[];
  ctaIntent: "nulmeting" | "bespreekSituatie";
  ctaLocation: string;
  highlight?: boolean;
};

const fases: Fase[] = [
  {
    step: "Stap 01",
    badge: "Kennismaking",
    title: "B2B Groeisysteem Scan",
    price: "Gratis",
    meta: "60 min · adviesgesprek",
    description: "Diagnose, groeilekken en eerste systeemadvies. Voor u verder kijkt.",
    features: [
      "Diagnose en quick wins",
      "Eerste blauwdruk",
      "Helder advies, geen verkoop",
    ],
    ctaIntent: "nulmeting",
    ctaLocation: "Pricing Fase 01",
  },
  {
    step: "Stap 02",
    badge: "Engagement",
    title: "System + Engagement Service",
    price: "€1.500",
    priceSuffix: "/ maand",
    meta: "3 maanden · geen lock-in",
    description: "Actieve engagement, optimalisatie en routing. Wij draaien de machine.",
    features: [
      "Engagement en optimalisatie",
      "Routing en reporting",
      "Dedicated campagnemanager",
    ],
    ctaIntent: "nulmeting",
    ctaLocation: "Pricing Fase 02",
    highlight: true,
  },
  {
    step: "Stap 03",
    badge: "Fundament",
    title: "Growth System Foundation",
    price: "€2.250",
    priceSuffix: "/ maand",
    meta: "Maandelijks opzegbaar",
    description: "Technische en commerciële setup van het systeem.",
    features: [
      "ICP en signaal-scoring",
      "Routing en dashboard",
      "Hergebruikbaar fundament",
    ],
    ctaIntent: "nulmeting",
    ctaLocation: "Pricing Fase 03",
  },
  {
    step: "Stap 04",
    badge: "Schalen",
    title: "Engagement Modules",
    price: "Per module",
    meta: "Naar behoefte",
    description: "Cold Calling, Content Management en Video (AI).",
    features: [
      "Cold Calling",
      "Content Management",
      "Video (AI)",
    ],
    ctaIntent: "bespreekSituatie",
    ctaLocation: "Pricing Fase 04",
  },
];

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
    {fase.highlight && (
      <Badge className="absolute -top-3 left-6 bg-primary text-primary-foreground hover:bg-primary border-transparent gap-1 px-2.5">
        <Sparkles className="w-3 h-3" />
        Aanbevolen
      </Badge>
    )}

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

    <div className="flex items-baseline gap-1 mb-1">
      <span className="font-display font-bold text-4xl md:text-5xl tracking-tight">
        {fase.price}
      </span>
      {fase.priceSuffix && (
        <span className="text-muted-foreground text-sm">{fase.priceSuffix}</span>
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

    <Button
      variant={fase.highlight ? "hero" : "outline"}
      size="sm"
      asChild
      className="w-full"
    >
      <CtaLink intent={fase.ctaIntent} location={fase.ctaLocation} />
    </Button>
  </motion.div>
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
        <div className="sm:col-span-2">
          <Button variant="hero" size="lg" asChild className="w-full group">
            <CtaLink intent="bespreekSituatie" location="Pricing Performance Partnership" />
          </Button>
        </div>
      </div>
    </div>
  </motion.div>
);

const PricingSection = () => {
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
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Lage drempel.
            <br />
            <span className="text-gradient">Schaalbare waarde.</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Begin met advies. Bouw het systeem. Voeg engagement toe. Schaal met modules.
          </p>
        </motion.div>

        {/* Fase grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 items-stretch mb-10 md:mb-14">
          {fases.map((fase, i) => (
            <PricingCard key={fase.title} fase={fase} index={i} />
          ))}
        </div>

        {/* Performance Partnership */}
        <PerformancePartnership />

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
            <ArrowRight className="inline w-3 h-3 ml-1 text-primary" />
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
