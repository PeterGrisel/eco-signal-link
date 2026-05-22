import { motion } from "framer-motion";
import { Building2, Users, Activity, Calendar, Wallet, TrendingUp } from "lucide-react";
import ChapterFrame from "../ChapterFrame";

const STEPS = [
  { icon: Building2, value: "2.000", unit: "bedrijven", label: "Markt", note: "ICP-fit en verrijkt", count: 2000 },
  { icon: Users, value: "4.000", unit: "contacten", label: "Beslissers", note: "Op meerdere kanalen", count: 4000 },
  { icon: Activity, value: "200", unit: "in beweging", label: "Engaged", note: "Engagement boven drempel", count: 200 },
  { icon: Calendar, value: "20", unit: "afspraken", label: "Meetings", note: "Met sales-bevoegd contact", count: 20 },
  { icon: Wallet, value: "€500k", unit: "pipeline", label: "Pipeline", note: "Op kwartaalbasis", count: 20 },
];

export default function Chapter07Schaal() {
  const maxCount = Math.max(...STEPS.map((s) => s.count));
  const widths = STEPS.map((s) => Math.max(22, (s.count / maxCount) * 100));
  const conversions = STEPS.slice(1).map((s, i) => (s.count / STEPS[i].count) * 100);

  return (
    <ChapterFrame
      id="chapter-07"
      number="07"
      eyebrow="Schaal in cijfers"
      title={<>Een voorbeeld: van markt naar <span className="text-primary">€500k pipeline.</span></>}
      intro="Stel u richt zich op 2.000 bedrijven binnen uw ICP. Zo loopt het door uw funnel. Stap voor stap, niet gegokt."
      tone="warm"
    >
      {/* KPI strip */}
      <div className="grid md:grid-cols-3 gap-3 md:gap-4 mb-10">
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

      {/* Funnel + Conversie */}
      <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 mb-10">
        <div className="lg:col-span-3 rounded-2xl border border-border/40 bg-card/40 p-6 md:p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <p className="font-mono text-[0.65rem] md:text-xs text-muted-foreground/70 tracking-widest uppercase">
              Funnel · één cyclus
            </p>
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary/80">ICP-gestuurd</span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            {STEPS.map((s, i) => {
              const w = widths[i];
              const isLast = i === STEPS.length - 1;
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
                      <s.icon className="w-4 h-4 text-primary shrink-0" strokeWidth={1.6} />
                      <span className="font-mono text-[10px] md:text-xs text-foreground/80 tracking-widest uppercase truncate">
                        {s.label}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5 shrink-0">
                      <span
                        className={`font-display font-bold tabular-nums leading-none ${
                          isLast ? "text-xl md:text-2xl text-gradient" : "text-lg md:text-xl text-foreground"
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

        <div className="lg:col-span-2 rounded-2xl border border-border/40 bg-card/40 p-6 md:p-8 backdrop-blur-sm">
          <p className="font-mono text-[0.65rem] md:text-xs text-muted-foreground/70 tracking-widest uppercase mb-5">
            Conversie per stap
          </p>
          <ul className="space-y-3">
            {STEPS.slice(0, -1).map((s, i) => {
              const next = STEPS[i + 1];
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
            <span className="font-display font-bold text-lg md:text-xl text-gradient tabular-nums">1,0%</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground italic max-w-2xl mx-auto text-center">
        Geen belofte. Een rekenmodel. Tijdens de scan vullen we het in met uw eigen markt, ICP en uitgangscijfers.
      </p>
    </ChapterFrame>
  );
}