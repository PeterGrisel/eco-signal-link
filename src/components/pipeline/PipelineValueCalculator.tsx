import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Activity, Calendar, Wallet, TrendingUp, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useCurrency } from "@/contexts/CurrencyContext";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";

const DEFAULTS = {
  markt: 2000,
  beslissersPerAccount: 2,
  engagementPct: 5,
  meetingPct: 10,
  dealwaarde: 25000,
};

const fmtPct = (n: number) => (n < 10 ? n.toFixed(1) : n.toFixed(0)) + "%";

export default function PipelineValueCalculator() {
  const { symbol, locale } = useCurrency();
  const fmtNum = (n: number) => new Intl.NumberFormat(locale).format(Math.round(n));
  const fmtEur = (n: number) => {
    if (n >= 1_000_000) return `${symbol}${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
    if (n >= 1000) return `${symbol}${Math.round(n / 1000)}k`;
    return `${symbol}${Math.round(n)}`;
  };
  const [markt, setMarkt] = useState(DEFAULTS.markt);
  const [bpa, setBpa] = useState(DEFAULTS.beslissersPerAccount);
  const [engPct, setEngPct] = useState(DEFAULTS.engagementPct);
  const [mtgPct, setMtgPct] = useState(DEFAULTS.meetingPct);
  const [deal, setDeal] = useState(DEFAULTS.dealwaarde);

  const calc = useMemo(() => {
    const beslissers = markt * bpa;
    const engaged = beslissers * (engPct / 100);
    const meetings = engaged * (mtgPct / 100);
    const pipeline = meetings * deal;
    const overallPct = markt > 0 ? (meetings / markt) * 100 : 0;
    return { beslissers, engaged, meetings, pipeline, overallPct };
  }, [markt, bpa, engPct, mtgPct, deal]);

  const reset = () => {
    setMarkt(DEFAULTS.markt);
    setBpa(DEFAULTS.beslissersPerAccount);
    setEngPct(DEFAULTS.engagementPct);
    setMtgPct(DEFAULTS.meetingPct);
    setDeal(DEFAULTS.dealwaarde);
  };

  const STEPS = [
    { icon: Building2, label: "Markt", value: fmtNum(markt), unit: "bedrijven", count: markt },
    { icon: Users, label: "Beslissers", value: fmtNum(calc.beslissers), unit: "contacten", count: calc.beslissers },
    { icon: Activity, label: "Engaged", value: fmtNum(calc.engaged), unit: "in beweging", count: calc.engaged },
    { icon: Calendar, label: "Meetings", value: fmtNum(calc.meetings), unit: "afspraken", count: calc.meetings },
    { icon: Wallet, label: "Pipeline", value: fmtEur(calc.pipeline), unit: "waarde", count: calc.meetings },
  ];

  const maxCount = Math.max(...STEPS.map((s) => s.count), 1);
  const fills = STEPS.map((s) => Math.max(4, (s.count / maxCount) * 100));

  return (
    <div>
      <div className="mb-5 flex items-center justify-end gap-2">
        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-display">Valuta</span>
        <CurrencySwitcher variant="inline" />
      </div>
      <div className="grid md:grid-cols-3 gap-3 md:gap-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="md:col-span-2 rounded-2xl border border-primary/30 bg-primary/5 px-6 py-5 shadow-[0_0_40px_-16px_hsl(var(--primary)/0.5)] flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <p className="font-mono text-[0.65rem] md:text-xs text-primary/80 tracking-widest uppercase mb-1.5">
              Markt → Pipeline · per cyclus
            </p>
            <p className="font-display font-bold text-3xl md:text-4xl text-gradient leading-none tabular-nums">
              {fmtEur(calc.pipeline)} pipelinewaarde
            </p>
            <p className="text-xs md:text-sm text-muted-foreground mt-2">
              Uit {fmtNum(markt)} doelaccounts. Herhaalbaar elke cyclus.
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-background/60 px-3 py-1.5 shrink-0">
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
          <p className="font-display font-bold text-3xl md:text-4xl text-foreground leading-none tabular-nums">
            {fmtPct(calc.overallPct).replace(".", ",")}
          </p>
          <p className="text-xs md:text-sm text-muted-foreground mt-2">
            {fmtNum(calc.meetings)} gekwalificeerde afspraken op {fmtNum(markt)} accounts.
          </p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 mb-10">
        <div className="lg:col-span-3 rounded-2xl border border-border/40 bg-card/40 p-6 md:p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <p className="font-mono text-[0.65rem] md:text-xs text-muted-foreground/70 tracking-widest uppercase">
              Funnel · één cyclus
            </p>
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary/80">Live berekend</span>
          </div>

          <div className="flex flex-col gap-2">
            {STEPS.map((s, i) => {
              const fill = fills[i];
              const isLast = i === STEPS.length - 1;
              return (
                <div
                  key={s.label}
                  className={`relative overflow-hidden rounded-md border w-full ${
                    isLast
                      ? "border-primary/50 shadow-[0_0_30px_-8px_hsl(var(--primary)/0.6)] bg-primary/5"
                      : "border-border/30 bg-background/40"
                  }`}
                >
                  <motion.div
                    aria-hidden
                    initial={false}
                    animate={{ width: `${fill}%` }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-y-0 left-0"
                    style={{
                      background: isLast
                        ? "linear-gradient(90deg, hsl(var(--primary) / 0.55), hsl(var(--primary) / 0.25))"
                        : "linear-gradient(90deg, hsl(var(--primary) / 0.35), hsl(var(--primary) / 0.12))",
                    }}
                  />
                  <div className="relative flex items-center justify-between gap-3 px-3 sm:px-4 py-3 md:py-3.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <s.icon className="w-4 h-4 text-primary shrink-0" strokeWidth={1.6} />
                      <span className="font-mono text-[10px] md:text-xs text-foreground/85 tracking-widest uppercase truncate">
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
                      <span className="text-[10px] md:text-xs text-muted-foreground">{s.unit}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-border/40 bg-card/40 p-6 md:p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-5">
            <p className="font-mono text-[0.65rem] md:text-xs text-muted-foreground/70 tracking-widest uppercase">
              Speel met uw cijfers
            </p>
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> reset
            </button>
          </div>

          <div className="space-y-5">
            <SliderRow label="Adresseerbare markt" value={`${fmtNum(markt)} bedrijven`} min={200} max={10000} step={100} v={markt} onChange={setMarkt} />
            <SliderRow label="Beslissers per account" value={`${bpa}`} min={1} max={5} step={1} v={bpa} onChange={setBpa} />
            <SliderRow label="% beslissers in beweging" value={`${engPct}%`} min={1} max={20} step={1} v={engPct} onChange={setEngPct} />
            <SliderRow label="% engaged → meeting" value={`${mtgPct}%`} min={2} max={40} step={1} v={mtgPct} onChange={setMtgPct} />
            <SliderRow label="Gem. dealwaarde" value={fmtEur(deal)} min={2500} max={150000} step={2500} v={deal} onChange={setDeal} />
          </div>

          <div className="mt-6 pt-5 border-t border-primary/20 grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="font-mono text-[10px] text-muted-foreground/70 tracking-widest uppercase mb-1">Meetings</p>
              <p className="font-display font-bold text-lg md:text-xl text-foreground tabular-nums">{fmtNum(calc.meetings)}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-primary/80 tracking-widest uppercase mb-1">Pipeline</p>
              <p className="font-display font-bold text-lg md:text-xl text-gradient tabular-nums">{fmtEur(calc.pipeline)}</p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground italic max-w-2xl mx-auto text-center">
        Geen belofte. Een rekenmodel. Schuif met de cijfers om te zien hoeveel beslissers u moet bereiken voor uw eigen pipeline.
      </p>
    </div>
  );
}

function SliderRow({
  label, value, v, min, max, step, onChange,
}: { label: string; value: string; v: number; min: number; max: number; step: number; onChange: (n: number) => void }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <span className="text-xs md:text-sm text-muted-foreground">{label}</span>
        <span className="font-mono text-xs md:text-sm text-primary tabular-nums">{value}</span>
      </div>
      <Slider value={[v]} min={min} max={max} step={step} onValueChange={(arr) => onChange(arr[0])} />
    </div>
  );
}