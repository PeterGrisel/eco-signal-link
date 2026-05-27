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
} from "@/data/serviceLines";

const iconMap: Record<ServiceIcon, LucideIcon> = {
  outbound: Send,
  abm: Target,
  brein: Brain,
  content: Megaphone,
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

        {/* 4 dienstlijnen */}
        <div className="grid lg:grid-cols-2 gap-5 md:gap-6 mb-12 md:mb-16">
          {serviceLines.map((line, i) => {
            const Icon = iconMap[line.icon];
            return (
              <motion.div
                key={line.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className={cn(
                  "relative rounded-2xl border p-6 md:p-8 flex flex-col h-full transition-colors",
                  line.highlight
                    ? "border-primary/40 bg-primary/5 shadow-[0_0_40px_-12px_hsl(var(--primary)/0.35)]"
                    : "card-gradient border-glow hover:border-primary/30",
                )}
              >
                {/* Head */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-[10px] font-display font-semibold tracking-[0.2em] uppercase text-primary/80 mb-2">
                      {line.eyebrow}
                    </p>
                    <h3 className="font-display font-bold text-2xl leading-tight">
                      {line.name}
                    </h3>
                  </div>
                  <span className="shrink-0 w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" strokeWidth={1.6} />
                  </span>
                </div>

                <p className="text-foreground/80 leading-relaxed mb-6">
                  {line.tagline}
                </p>

                {/* Voor wie — ICP gate */}
                <div className="rounded-xl border border-primary/20 bg-background/40 p-4 mb-6">
                  <p className="text-[10px] font-display font-semibold tracking-[0.22em] uppercase text-primary/90 mb-3">
                    Voor wie
                  </p>
                  <ul className="space-y-2">
                    {line.criteria.map((c) => (
                      <li key={c} className="flex items-start gap-2.5 text-sm">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-foreground/90">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Inbegrepen */}
                <p className="text-[10px] font-display font-semibold tracking-[0.22em] uppercase text-muted-foreground mb-3">
                  Inbegrepen
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {line.includes.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Outcome */}
                <p className="text-sm font-medium text-foreground/90 border-l-2 border-primary/50 pl-3 mb-6">
                  {line.outcome}
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 mt-auto">
                  <Button
                    variant={line.highlight ? "hero" : "outline"}
                    size="sm"
                    asChild
                  >
                    <CtaLink
                      intent="gratisScan"
                      location={`Diensten — ${line.name}`}
                    />
                  </Button>
                  {line.href && (
                    <Link
                      to={line.href}
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                    >
                      Meer over deze lijn
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
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
