import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Calculator, Euro, Users, MousePointerClick, Phone, FileText, Handshake } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DEFAULT_VALUES = {
  targetRevenue: 100000,
  avgDealSize: 7000,
  salesConversionRate: 30,
  callToProposalRate: 60,
  sqlToCallRate: 60,
  optInToSqlRate: 20,
  optInRate: 3,
};

const formatNumber = (n: number) =>
  n >= 1000 ? n.toLocaleString("nl-NL") : String(Math.round(n * 100) / 100);

const FunnelCalculator = () => {
  const [values, setValues] = useState(DEFAULT_VALUES);

  const funnel = useMemo(() => {
    const deals = Math.ceil(values.targetRevenue / values.avgDealSize);
    const proposals = Math.ceil(deals / (values.salesConversionRate / 100));
    const calls = Math.ceil(proposals / (values.callToProposalRate / 100));
    const sqls = Math.ceil(calls / (values.sqlToCallRate / 100));
    const optIns = Math.ceil(sqls / (values.optInToSqlRate / 100));
    const traffic = Math.ceil(optIns / (values.optInRate / 100));

    return [
      { label: "Website Traffic", value: traffic, icon: MousePointerClick, color: "bg-muted" },
      { label: "Opt-ins / MQL's", value: optIns, icon: Users, color: "bg-primary/20" },
      { label: "SQL's", value: sqls, icon: Users, color: "bg-primary/30" },
      { label: "Discovery Calls", value: calls, icon: Phone, color: "bg-primary/40" },
      { label: "Offertes", value: proposals, icon: FileText, color: "bg-primary/60" },
      { label: "Deals", value: deals, icon: Handshake, color: "bg-primary" },
    ];
  }, [values]);

  const update = (key: keyof typeof values, val: number) =>
    setValues((v) => ({ ...v, [key]: val }));

  const sliders: { key: keyof typeof values; label: string; min: number; max: number; step: number; suffix: string }[] = [
    { key: "targetRevenue", label: "Gewenste omzet", min: 10000, max: 1000000, step: 5000, suffix: "€" },
    { key: "avgDealSize", label: "Gemiddelde dealwaarde", min: 500, max: 100000, step: 500, suffix: "€" },
    { key: "optInRate", label: "Opt-in rate (traffic → MQL)", min: 0.5, max: 15, step: 0.5, suffix: "%" },
    { key: "optInToSqlRate", label: "MQL → SQL conversie", min: 5, max: 50, step: 1, suffix: "%" },
    { key: "sqlToCallRate", label: "SQL → Discovery Call", min: 10, max: 80, step: 5, suffix: "%" },
    { key: "callToProposalRate", label: "Call → Offerte", min: 10, max: 90, step: 5, suffix: "%" },
    { key: "salesConversionRate", label: "Offerte → Deal", min: 5, max: 80, step: 5, suffix: "%" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mb-16"
          >
            <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
              Funnel Calculator
            </p>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
              Reken terug van omzet
              <br />
              <span className="text-gradient">naar funnel.</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Vul uw gewenste omzet en conversieratio's in. Wij berekenen precies hoeveel 
              traffic, leads en gesprekken u nodig heeft.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Sliders */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card-gradient border border-glow rounded-xl p-8 space-y-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <Calculator className="w-5 h-5 text-primary" />
                <h2 className="font-display font-bold text-xl">Uw parameters</h2>
              </div>

              {sliders.map((s) => (
                <div key={s.key}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-muted-foreground">{s.label}</label>
                    <span className="font-display font-bold text-foreground text-sm">
                      {s.suffix === "€"
                        ? `€${formatNumber(values[s.key])}`
                        : `${values[s.key]}%`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={values[s.key]}
                    onChange={(e) => update(s.key, Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none bg-secondary cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md
                      [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0"
                  />
                </div>
              ))}
            </motion.div>

            {/* Funnel visualization */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-3 mb-6">
                <Euro className="w-5 h-5 text-primary" />
                <h2 className="font-display font-bold text-xl">Uw funnel</h2>
              </div>

              {funnel.map((step, i) => {
                const maxVal = funnel[0].value;
                const widthPct = Math.max(30, (step.value / maxVal) * 100);

                return (
                  <div key={step.label}>
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0.5 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 * i }}
                      style={{ width: `${widthPct}%` }}
                      className={`${step.color} rounded-lg px-5 py-4 mx-auto flex items-center justify-between gap-3 transition-all duration-300`}
                    >
                      <div className="flex items-center gap-3">
                        <step.icon className="w-4 h-4 text-foreground/70 shrink-0" />
                        <span className="text-sm font-medium text-foreground">{step.label}</span>
                      </div>
                      <span className="font-display font-bold text-foreground text-lg">
                        {formatNumber(step.value)}
                      </span>
                    </motion.div>
                    {i < funnel.length - 1 && (
                      <div className="flex justify-center py-1">
                        <ArrowDown className="w-4 h-4 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Revenue result */}
              <div className="mt-6 border-t border-border pt-6 flex items-center justify-between">
                <span className="text-muted-foreground">Doelomzet</span>
                <span className="font-display font-bold text-2xl text-primary">
                  €{formatNumber(values.targetRevenue)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Op basis van een gemiddelde dealwaarde van €{formatNumber(values.avgDealSize)}. 
                Pas de ratio's aan om uw specifieke situatie te simuleren.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FunnelCalculator;
