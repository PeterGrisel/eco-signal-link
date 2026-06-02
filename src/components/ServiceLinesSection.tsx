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
      whileHover={{ y: -4 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl p-5 md:p-6 transition-colors duration-300",
        feature
          ? "md:p-7 border border-primary/40 bg-primary/[0.07] hover:border-primary/60 shadow-[0_0_30px_-14px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_44px_-12px_hsl(var(--primary)/0.55)]"
          : "card-gradient border-glow hover:border-primary/40",
        line.bentoClassName,
      )}
    >
      {/* Hover glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.10),transparent_70%)]"
      />

      {/* Top: eyebrow + icon */}
      <div className="relative flex items-center justify-between gap-3 mb-4">
        <p className="text-[10px] font-display font-semibold tracking-[0.2em] uppercase text-primary/80">
          {line.eyebrow}
        </p>
        <span className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" strokeWidth={1.7} />
        </span>
      </div>

      {/* Altijd zichtbaar: naam + tagline + outcome */}
      <div className="relative">
        <h3
          className={cn(
            "font-display font-bold leading-tight",
            feature ? "text-2xl md:text-3xl" : "text-lg md:text-xl",
          )}
        >
          {line.name}
        </h3>
        <p
          className={cn(
            "text-muted-foreground leading-relaxed mt-2",
            feature ? "text-base max-w-md" : "text-sm",
          )}
        >
          {line.tagline}
        </p>
        <p className="text-xs text-foreground/70 mt-2.5">{line.outcome}</p>
      </div>

      {/* Reveal: op mobiel inline, op lg een absolute overlay die bij hover
          opkomt (geen gereserveerde ruimte -> compacte kaart). */}
      <div
        className={cn(
          "relative mt-4",
          "lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:p-5 lg:pt-12",
          "lg:bg-gradient-to-t lg:from-card lg:via-card/95 lg:to-transparent lg:backdrop-blur-[2px]",
          "lg:opacity-0 lg:translate-y-3 lg:pointer-events-none lg:transition-all lg:duration-300",
          "lg:group-hover:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:pointer-events-auto",
          "lg:group-focus-within:opacity-100 lg:group-focus-within:translate-y-0 lg:group-focus-within:pointer-events-auto",
          feature && "lg:p-7 lg:pt-14",
        )}
      >
        {feature && (
          <>
            <p className="text-[10px] font-display font-semibold tracking-[0.22em] uppercase text-primary/90 mb-2.5">
              Voor wie
            </p>
            <ul className="space-y-1.5 mb-4">
              {line.criteria.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm">
                  <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground/90">{c}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <Button variant={feature ? "hero" : "outline"} size="sm" asChild>
            <CtaLink intent="gratisScan" location={`Diensten — ${line.name}`} />
          </Button>
          <Link
            to={`/diensten/${line.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            Meer
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
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
            Bouw het één keer. Draai er vier lijnen op.
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-tight">
            Stop met elk kwartaal opnieuw beginnen.
            <br />
            <span className="text-gradient">Bouw de machine één keer.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-6">
            De meeste bedrijven herbouwen hun pijplijn elk kwartaal. Lijsten
            opnieuw kopen. Sequenties opnieuw schrijven. Sales opnieuw trainen.
            Wij leggen één fundament. U draait er vier groeilijnen op. Voor
            altijd. Twijfelt u welke lijn past? Dat bepalen we in de gratis scan.
          </p>
        </motion.div>

        {/* Bento-grid */}
        <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 mb-12 md:mb-16">
          {serviceLines.map((line, i) => (
            <ServiceBentoCard key={line.slug} line={line} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServiceLinesSection;
