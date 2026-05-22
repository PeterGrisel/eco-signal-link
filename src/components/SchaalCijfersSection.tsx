import { motion } from "framer-motion";
import { TrendingUp, Building2, Users, Activity, Calendar, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import CtaLink from "@/components/CtaLink";
import { COPY } from "@/content/copy";

// Numeric base for the funnel visual (pipeline is shown as €, but width is driven by the count).
const FUNNEL_COUNTS = [2000, 4000, 200, 20, 20];
const STAGE_ICONS = [Building2, Users, Activity, Calendar, Wallet];

const SchaalCijfersSection = () => {
  const { eyebrow, heading, headingAccent, body, steps, fineprint } = COPY.schaal;

  const maxCount = Math.max(...FUNNEL_COUNTS);
  const widths = FUNNEL_COUNTS.map((c) => Math.max(20, (c / maxCount) * 100));
  const conversions = FUNNEL_COUNTS.slice(1).map((c, i) => (c / FUNNEL_COUNTS[i]) * 100);

  return (
    <section className="py-20 md:py-32 border-b border-border/30 relative">
      <div className="absolute inset-0 glow-bg opacity-30 pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-12 md:mb-16"
        >
          <p className="text-primary font-display font-semibold text-xs tracking-[0.25em] uppercase mb-5">
            {eyebrow}
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
            {heading} <span className="text-gradient">{headingAccent}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mt-5 max-w-2xl">
            {body}
          </p>
        </motion.div>

        {/* KPI strip */}
        <div className="grid md:grid-cols-3 gap-3 md:gap-4 mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="md:col-span-2 rounded-2xl border border-primary/30 bg-primary/5 px-6 py-5 shadow-[0_0_40px_-16px_hsl(var(--primary)/0.5)] flex items-center justify-between gap-4"
          >
            <div>
              <p className="font-mono text-[0.65rem] md:text-xs text-primary/80 tracking-widest uppercase mb-1.5">
                Markt → Pipeline · per cyclus
              </p>
              <p className="font-display font-bold text-3xl md:text-4xl text-gradient leading-none">
                €500k pipelinewaarde
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-2">
                Uit 2.000 doelaccounts. Herhaalbaar elke cyclus.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-primary/30 bg-background/60 px-3 py-1.5 shrink-0">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">Verbetert iedere ronde</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="rounded-2xl border border-border/40 bg-card/40 px-6 py-5 backdrop-blur-sm"
          >
            <p className="font-mono text-[0.65rem] md:text-xs text-muted-foreground/70 tracking-widest uppercase mb-1.5">
              Markt → Meeting
            </p>
            <p className="font-display font-bold text-3xl md:text-4xl text-foreground leading-none">
              1,0%
            </p>
            <p className="text-xs md:text-sm text-muted-foreground mt-2">
              20 gekwalificeerde afspraken op 2.000 accounts.
            </p>
          </motion.div>
        </div>

        {/* Funnel + Stage list */}
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 mb-10">
          {/* Funnel visual */}
          <div className="lg:col-span-3 rounded-2xl border border-border/40 bg-card/40 p-6 md:p-8 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <p className="font-mono text-[0.65rem] md:text-xs text-muted-foreground/70 tracking-widest uppercase">
                Funnel · één cyclus
              </p>
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary/80">
                ICP-gestuurd
              </span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              {steps.map((s, i) => {
                const Icon = STAGE_ICONS[i];
                const w = widths[i];
                const isLast = i === steps.length - 1;
                const tintA = Math.max(0.1, 0.32 - i * 0.05);
                const tintB = Math.max(0.05, 0.14 - i * 0.025);
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, scaleX: 0.6 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    style={{ width: `${w}%` }}
                    className="w-full"
                  >
                    <div
                      className={`relative rounded-md px-4 py-3 md:py-3.5 flex items-center justify-between gap-3 ${
                        isLast
                          ? "border border-primary/50 shadow-[0_0_30px_-8px_hsl(var(--primary)/0.6)]"
                          : "border border-primary/15"
                      }`}
                      style={{
                        background: isLast
                          ? "linear-gradient(90deg, hsl(var(--primary) / 0.4), hsl(var(--primary) / 0.2))"
                          : `linear-gradient(90deg, hsl(var(--primary) / ${tintA}), hsl(var(--primary) / ${tintB}))`,
                      }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className="w-4 h-4 text-primary shrink-0" strokeWidth={1.6} />
                        <span className="font-mono text-[10px] md:text-xs text-foreground/80 tracking-widest uppercase truncate">
                          {s.label}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1.5 shrink-0">
                        <span
                          className={`font-display font-bold tabular-nums leading-none ${
                            isLast
                              ? "text-xl md:text-2xl text-gradient"
                              : "text-lg md:text-xl text-foreground"
                          }`}
                        >
                          {s.value}
                        </span>
                        <span className="hidden sm:inline text-[10px] md:text-xs text-muted-foreground">
                          {s.unit}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Stage conversion rates */}
          <div className="lg:col-span-2 rounded-2xl border border-border/40 bg-card/40 p-6 md:p-8 backdrop-blur-sm">
            <p className="font-mono text-[0.65rem] md:text-xs text-muted-foreground/70 tracking-widest uppercase mb-5">
              Conversie per stap
            </p>
            <ul className="space-y-3">
              {steps.slice(0, -1).map((s, i) => {
                const next = steps[i + 1];
                const pct = conversions[i];
                return (
                  <motion.li
                    key={s.label}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                    className="flex items-center justify-between gap-3 pb-3 border-b border-border/30 last:border-0 last:pb-0"
                  >
                    <span className="text-xs md:text-sm truncate">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="text-muted-foreground/50 mx-1.5">→</span>
                      <span className="text-foreground">{next.label}</span>
                    </span>
                    <span className="font-display font-bold text-sm md:text-base text-primary tabular-nums">
                      {pct < 10 ? pct.toFixed(1) : pct.toFixed(0)}%
                    </span>
                  </motion.li>
                );
              })}
            </ul>

            <div className="mt-5 pt-4 border-t border-primary/20 flex items-center justify-between">
              <span className="text-xs md:text-sm text-foreground/80">Overall</span>
              <span className="font-display font-bold text-lg md:text-xl text-gradient tabular-nums">
                1,0%
              </span>
            </div>
          </div>
        </div>

        {/* Notes per stage */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-10">
          {steps.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="rounded-xl border border-border/30 bg-card/30 p-4"
            >
              <p className="font-mono text-[10px] text-primary/70 tracking-widest uppercase mb-1">
                0{i + 1} · {s.label}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.note}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-xs md:text-sm text-muted-foreground max-w-2xl">{fineprint}</p>

        <div className="mt-10 flex">
          <Button variant="hero" size="lg" asChild>
            <CtaLink intent="gratisScan" location="Schaal Cijfers Section" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SchaalCijfersSection;