import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, ArrowDown, TrendingUp, Target, BarChart3, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { FunnelDefaults } from "@/data/sectors";

const fmt = (n: number) => n >= 1000 ? `€${n.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `€${n.toFixed(2)}`;
const fmtN = (n: number) => Math.round(n).toLocaleString("nl-NL");
const fmtPct = (n: number) => `${n.toFixed(2)}%`;

const tooltips: Record<string, string> = {
  // Sliders
  "Maandomzet": "De totale bruto-omzet die u per maand wilt realiseren.",
  "Totale kosten": "Percentage van uw omzet dat opgaat aan alle bedrijfskosten (personeel, overhead, etc.).",
  "Marketingkosten": "Het deel van uw omzet dat u investeert in marketing en leadgeneratie.",
  "Gem. dealwaarde": "De gemiddelde waarde van één gesloten deal of transactie.",
  "Opt-in rate": "Percentage websitebezoekers dat converteert naar een lead (formulier invult, download, etc.).",
  "Opt-in → SQL": "Percentage leads (MQL's) dat gekwalificeerd wordt als Sales Qualified Lead.",
  "SQL → Call": "Percentage SQL's dat daadwerkelijk een discovery call inplant.",
  "Close rate": "Percentage gesprekken/offertes dat resulteert in een gesloten deal.",
  "Klant LTV (mnd)": "Gemiddelde duur dat een klant actief blijft (in maanden).",
  // Metrics
  "Totale Omzet": "Uw ingestelde maandelijkse bruto-omzet.",
  "Totale Kosten": "Alle operationele kosten als percentage van de omzet.",
  "Marketingkosten_row": "Het budget dat beschikbaar is voor marketing en acquisitie.",
  "Totale Winst": "Omzet minus totale kosten. Dit is uw netto resultaat per maand.",
  "Website Traffic": "Het aantal unieke bezoekers dat uw website nodig heeft om de funnel te vullen.",
  "Opt-ins / MQL's": "Marketing Qualified Leads — bezoekers die interesse tonen en contactgegevens achterlaten.",
  "Opt-in Rate": "Het conversiepercentage van bezoeker naar lead.",
  "Sales Qualified Leads (SQL)": "Leads die voldoen aan uw ICP-criteria en klaar zijn voor sales.",
  "Opt-in → SQL Conversie": "Hoe efficiënt uw kwalificatieproces leads filtert naar echte kansen.",
  "Discovery Calls": "Het aantal verkennende gesprekken dat nodig is om uw target te halen.",
  "Sales (inbound)": "Deals gesloten via inbound kanalen (website, content, referrals).",
  "Sales (outbound)": "Deals gesloten via outbound kanalen (cold outreach, LinkedIn, e-mail).",
  "Close Rate": "Het percentage gesprekken dat converteert naar een betaalde klant.",
  "Marketing Conversie": "Het totale conversiepercentage van websitebezoeker naar klant.",
  "Totaal Klanten": "Het aantal nieuwe klanten dat u per maand nodig heeft voor uw omzetdoel.",
  "Klant LTV": "Customer Lifetime Value — hoe lang een gemiddelde klant actief blijft.",
  "Gem. Transactiewaarde": "De gemiddelde omzet per deal of transactie.",
  "Customer Acquisition Cost": "Hoeveel het kost om één nieuwe klant te werven (marketingkosten / klanten).",
  "ATV/CAC Ratio": "Verhouding tussen dealwaarde en acquisitiekosten. Boven 3.0 is gezond, boven 5.0 is uitstekend.",
};

const InfoTip = ({ label }: { label: string }) => {
  const tip = tooltips[label];
  if (!tip) return null;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted hover:bg-primary/20 transition-colors shrink-0">
          <Info className="w-2.5 h-2.5 text-muted-foreground" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[260px] text-xs leading-relaxed">
        {tip}
      </TooltipContent>
    </Tooltip>
  );
};

const FunnelCalculatorSection = ({ defaults }: { defaults?: FunnelDefaults }) => {
  const d = defaults || { monthlyRevenue: 83333, expenseRate: 30, marketingRate: 5, avgDealSize: 7000, optInRate: 3, optInToSqlRate: 19.76, sqlToCallRate: 60, salesConversionRate: 30, ltv: 12 };

  const [monthlyRevenue, setMonthlyRevenue] = useState(d.monthlyRevenue);
  const [expenseRate, setExpenseRate] = useState(d.expenseRate);
  const [marketingRate, setMarketingRate] = useState(d.marketingRate);
  const [avgDealSize, setAvgDealSize] = useState(d.avgDealSize);
  const [optInRate, setOptInRate] = useState(d.optInRate);
  const [optInToSqlRate, setOptInToSqlRate] = useState(d.optInToSqlRate);
  const [sqlToCallRate, setSqlToCallRate] = useState(d.sqlToCallRate);
  const [salesConversionRate, setSalesConversionRate] = useState(d.salesConversionRate);
  const [ltv, setLtv] = useState(d.ltv);

  useEffect(() => {
    if (!defaults) return;
    setMonthlyRevenue(defaults.monthlyRevenue);
    setExpenseRate(defaults.expenseRate);
    setMarketingRate(defaults.marketingRate);
    setAvgDealSize(defaults.avgDealSize);
    setOptInRate(defaults.optInRate);
    setOptInToSqlRate(defaults.optInToSqlRate);
    setSqlToCallRate(defaults.sqlToCallRate);
    setSalesConversionRate(defaults.salesConversionRate);
    setLtv(defaults.ltv);
  }, [defaults]);

  const metrics = useMemo(() => {
    const totalRevenue = monthlyRevenue;
    const totalExpenses = totalRevenue * (expenseRate / 100);
    const marketingExpenses = totalRevenue * (marketingRate / 100);
    const totalProfit = totalRevenue - totalExpenses;

    const totalCustomers = Math.ceil(totalRevenue / avgDealSize);
    const inboundSales = Math.ceil(totalCustomers / 2);
    const outboundSales = totalCustomers - inboundSales;

    const calls = Math.ceil(totalCustomers / (salesConversionRate / 100));
    const sqls = Math.ceil(calls / (sqlToCallRate / 100));
    const optIns = Math.ceil(sqls / (optInToSqlRate / 100));
    const traffic = Math.ceil(optIns / (optInRate / 100));

    const marketingConversionRate = totalCustomers > 0 ? (totalCustomers / traffic) * 100 : 0;
    const cac = totalCustomers > 0 ? marketingExpenses / totalCustomers : 0;
    const cacRatio = cac > 0 ? avgDealSize / cac : 0;

    return {
      totalRevenue, totalExpenses, marketingExpenses, totalProfit,
      traffic, optIns, sqls, calls, totalCustomers, inboundSales, outboundSales,
      marketingConversionRate, cac, cacRatio, ltv,
    };
  }, [monthlyRevenue, expenseRate, marketingRate, avgDealSize, optInRate, optInToSqlRate, sqlToCallRate, salesConversionRate, ltv]);

  const sliders = [
    { label: "Maandomzet", value: monthlyRevenue, set: setMonthlyRevenue, min: 10000, max: 500000, step: 1000, format: (v: number) => fmt(v) },
    { label: "Totale kosten", value: expenseRate, set: setExpenseRate, min: 10, max: 70, step: 1, format: (v: number) => `${v}%` },
    { label: "Marketingkosten", value: marketingRate, set: setMarketingRate, min: 1, max: 20, step: 0.5, format: (v: number) => `${v}%` },
    { label: "Gem. dealwaarde", value: avgDealSize, set: setAvgDealSize, min: 500, max: 50000, step: 500, format: (v: number) => fmt(v) },
    { label: "Opt-in rate", value: optInRate, set: setOptInRate, min: 0.5, max: 15, step: 0.5, format: (v: number) => `${v}%` },
    { label: "Opt-in → SQL", value: optInToSqlRate, set: setOptInToSqlRate, min: 5, max: 50, step: 0.5, format: (v: number) => `${v}%` },
    { label: "SQL → Call", value: sqlToCallRate, set: setSqlToCallRate, min: 10, max: 80, step: 5, format: (v: number) => `${v}%` },
    { label: "Close rate", value: salesConversionRate, set: setSalesConversionRate, min: 5, max: 60, step: 1, format: (v: number) => `${v}%` },
    { label: "Klant LTV (mnd)", value: ltv, set: setLtv, min: 1, max: 36, step: 1, format: (v: number) => `${v} maanden` },
  ];

  const Row = ({ label, value, highlight, tooltipKey }: { label: string; value: string; highlight?: boolean; tooltipKey?: string }) => (
    <div className={`flex justify-between items-center py-2 px-4 ${highlight ? "bg-primary/10" : ""} border-b border-border/30`}>
      <span className={`text-sm flex items-center gap-1.5 ${highlight ? "font-display font-bold text-primary" : "text-foreground"}`}>
        {label}
        <InfoTip label={tooltipKey || label} />
      </span>
      <span className={`text-sm font-mono ${highlight ? "font-bold text-primary" : "text-foreground"}`}>{value}</span>
    </div>
  );

  return (
    <section className="py-24 border-t border-border">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12"
        >
          <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            Funnel Calculator
          </p>
          <h2 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl tracking-tight leading-tight mb-4">
            Van omzet naar funnel,
            <br />
            <span className="text-gradient">per maand berekend.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Stel uw maandomzet en ratio's in. Wij berekenen de volledige funnel, kosten, 
            CAC en meer — zodat u weet wat er nodig is. Klik op de <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted align-middle"><Info className="w-2.5 h-2.5 text-muted-foreground" /></span> icoontjes voor uitleg.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Sliders */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card-gradient border border-glow rounded-xl p-8 space-y-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <Calculator className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-lg">Uw parameters</h3>
            </div>

            {sliders.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm text-muted-foreground flex items-center gap-1.5">
                    {s.label}
                    <InfoTip label={s.label} />
                  </label>
                  <span className="font-display font-bold text-foreground text-sm">{s.format(s.value)}</span>
                </div>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={s.value}
                  onChange={(e) => s.set(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-secondary cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md
                    [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0"
                />
              </div>
            ))}
          </motion.div>

          {/* Results table */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card-gradient border border-glow rounded-xl overflow-hidden"
          >
            <div className="flex justify-between items-center px-4 py-3 border-b border-border bg-secondary/30">
              <span className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" /> Metrics
              </span>
              <span className="font-display font-bold text-sm text-muted-foreground">Per maand</span>
            </div>

            <div className="bg-primary/5 px-4 py-2 border-b border-border">
              <span className="font-display font-bold text-xs tracking-[0.15em] uppercase text-primary flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" /> Revenue
              </span>
            </div>
            <Row label="Totale Omzet" value={fmt(metrics.totalRevenue)} />
            <Row label={`Totale Kosten (${expenseRate}%)`} value={fmt(metrics.totalExpenses)} tooltipKey="Totale Kosten" />
            <Row label={`Marketingkosten (${marketingRate}%)`} value={fmt(metrics.marketingExpenses)} tooltipKey="Marketingkosten_row" />
            <Row label="Totale Winst" value={fmt(metrics.totalProfit)} highlight />

            <div className="bg-primary/5 px-4 py-2 border-b border-border mt-1">
              <span className="font-display font-bold text-xs tracking-[0.15em] uppercase text-primary flex items-center gap-2">
                <Target className="w-3.5 h-3.5" /> Top & Middle of Funnel
              </span>
            </div>
            <Row label="Website Traffic" value={fmtN(metrics.traffic)} />
            <Row label="Opt-ins / MQL's" value={fmtN(metrics.optIns)} />
            <Row label="Opt-in Rate" value={fmtPct(optInRate)} />
            <Row label="Sales Qualified Leads (SQL)" value={fmtN(metrics.sqls)} />
            <Row label="Opt-in → SQL Conversie" value={fmtPct(optInToSqlRate)} />
            <Row label="Discovery Calls" value={fmtN(metrics.calls)} />

            <div className="bg-primary/5 px-4 py-2 border-b border-border mt-1">
              <span className="font-display font-bold text-xs tracking-[0.15em] uppercase text-primary flex items-center gap-2">
                <ArrowDown className="w-3.5 h-3.5" /> Bottom of Funnel
              </span>
            </div>
            <Row label="Sales (inbound)" value={fmtN(metrics.inboundSales)} />
            <Row label="Sales (outbound)" value={fmtN(metrics.outboundSales)} />
            <Row label="Close Rate" value={fmtPct(salesConversionRate)} />
            <Row label="Marketing Conversie" value={fmtPct(metrics.marketingConversionRate)} />
            <Row label="Totaal Klanten" value={fmtN(metrics.totalCustomers)} highlight />

            <div className="bg-primary/5 px-4 py-2 border-b border-border mt-1">
              <span className="font-display font-bold text-xs tracking-[0.15em] uppercase text-primary">
                Unit Economics
              </span>
            </div>
            <Row label="Klant LTV" value={`${ltv} maanden`} />
            <Row label="Gem. Transactiewaarde" value={fmt(avgDealSize)} />
            <Row label="Customer Acquisition Cost" value={fmt(metrics.cac)} />
            <Row label="ATV/CAC Ratio" value={metrics.cacRatio.toFixed(1)} highlight />

            <div className="px-4 py-3 bg-secondary/20 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Pas de sliders links aan om uw specifieke situatie te simuleren.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-5">
            Benieuwd wat deze cijfers voor uw organisatie betekenen?
          </p>
          <a
            href="https://app.usemotion.com/meet/Rebel-Force/meeting"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-display font-bold text-base hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            Plan een Demo →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FunnelCalculatorSection;
