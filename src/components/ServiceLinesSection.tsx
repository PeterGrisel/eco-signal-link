import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Send,
  Target,
  Brain,
  Megaphone,
  Check,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CtaLink from "@/components/CtaLink";
import { cn } from "@/lib/utils";
import {
  serviceLines,
  supportingServices,
  type ServiceIcon,
  type ServiceLine,
} from "@/data/serviceLines";

const iconMap: Record<ServiceIcon, LucideIcon> = {
  outbound: Send,
  abm: Target,
  brein: Brain,
  content: Megaphone,
};

const ServiceBentoCard = ({ line, index }: { line: ServiceLine; index: number }) => {
  const Icon = iconMap[line.icon];
  const feature = !!line.highlight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl p-6 md:p-8 transition-colors",
        feature
          ? "border border-primary/40 bg-primary/5 shadow-[0_0_40px_-12px_hsl(var(--primary)/0.35)]"
          : "card-gradient border-glow hover:border-primary/30",
        line.bentoClassName,
      )}
    >
      {/* Hover glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.10),transparent_70%)]"
      />

      {/* Top: eyebrow + icon */}
      <div className="relative flex items-center justify-between mb-4">
        <p className="text-[10px] font-display font-semibold tracking-[0.2em] uppercase text-primary/80">
          {line.eyebrow}
        </p>
        <span className="shrink-0 w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" strokeWidth={1.6} />
        </span>
      </div>

      {/* Always visible: name + tagline + outcome */}
      <h3
        className={cn(
          "relative font-display font-bold leading-tight",
          feature ? "text-3xl md:text-4xl" : "text-2xl",
        )}
      >
        {line.name}
      </h3>
      <p className="relative text-foreground/80 leading-relaxed mt-3 max-w-md">
        {line.tagline}
      </p>
      <p className="relative text-sm font-medium text-foreground/90 border-l-2 border-primary/50 pl-3 mt-5">
        {line.outcome}
      </p>

      {/* Hybride: voor wie + CTA. Altijd zichtbaar op de feature-cel en op
          mobiel; op lg verschijnt het bij hover of focus. */}
      <div
        className={cn(
          "relative mt-6",
          !feature &&
            "transition-all duration-300 lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 lg:group-focus-within:opacity-100 lg:group-focus-within:translate-y-0",
        )}
      >
        <p className="text-[10px] font-display font-semibold tracking-[0.22em] uppercase text-primary/90 mb-3">
          Voor wie
        </p>
        <ul className="space-y-2 mb-5">
          {line.criteria.map((c) => (
            <li key={c} className="flex items-start gap-2.5 text-sm">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-foreground/90">{c}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant={feature ? "hero" : "outline"} size="sm" asChild>
            <CtaLink intent="gratisScan" location={`Diensten — ${line.name}`} />
          </Button>
          <Link
            to={`/diensten/${line.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            Meer over deze lijn
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Spacer zodat de feature-cel de volle hoogte vult */}
      {feature && <div className="flex-1" />}
    </motion.div>
  );
};

const ServiceLinesSection = () => {
  return (
    <section id="diensten" className="py-16 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 max-w-2xl"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Onze diensten
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Eén fundament.
            <br />
            <span className="text-gradient">Vier manieren om te groeien.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-6">
            Elke lijn heeft een duidelijk profiel. Herkent u zich? Dan weet u
            waar u staat. Twijfelt u? Dat bepalen we samen in de gratis scan.
          </p>
        </motion.div>

        {/* Bento-grid */}
        <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 lg:auto-rows-fr mb-12 md:mb-16">
          {serviceLines.map((line, i) => (
            <ServiceBentoCard key={line.slug} line={line} index={i} />
          ))}
        </div>

        {/* Aanvullende diensten */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-border/50 bg-card/40 p-6 md:p-8"
        >
          <p className="text-[10px] font-display font-semibold tracking-[0.22em] uppercase text-muted-foreground mb-5">
            Bouwt voort op het fundament
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {supportingServices.map((s) => (
              <Link
                key={s.href}
                to={s.href}
                className="group rounded-xl border border-border/50 bg-background/40 p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display font-bold text-foreground">
                    {s.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.description}
                </p>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceLinesSection;
