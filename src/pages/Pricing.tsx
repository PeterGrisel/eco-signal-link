import { useState } from "react";
import { motion } from "framer-motion";
import { trackCTA } from "@/lib/tracking";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Check, Database, Users, Briefcase, ArrowRight,
  Calculator, Minus, Plus as PlusIcon
} from "lucide-react";

const engagementOptions = [
  { hours: 0, label: "Geen", price6: 0, price12: 0 },
  { hours: 10, label: "10 uur", price6: 760, price12: 700 },
  { hours: 20, label: "20 uur", price6: 1440, price12: 1300 },
  { hours: 40, label: "40 uur", price6: 2720, price12: 2400 },
];

const Pricing = () => {
  const [engagement, setEngagement] = useState(0);
  const [datahub, setDatahub] = useState(false);
  const [recruitment, setRecruitment] = useState(false);
  const [salesMgmt, setSalesMgmt] = useState(false);
  const [period, setPeriod] = useState<6 | 12>(6);

  const baseFee = 1500;
  const datahubFee = datahub ? 500 : 0;
  const engFee = period === 6 ? engagementOptions[engagement].price6 : engagementOptions[engagement].price12;
  const monthlyTotal = baseFee + engFee + datahubFee;

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 glow-bg pointer-events-none" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                Pricing
              </p>
              <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-4">
                Stel uw pakket
                <br />
                <span className="text-gradient">samen.</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Configureer uw ideale setup en zie direct wat het kost.
              </p>
            </motion.div>

            {/* Configurator */}
            <div className="grid lg:grid-cols-[1fr_380px] gap-8 max-w-5xl mx-auto">
              {/* Left: Options */}
              <div className="space-y-6">
                {/* Step 1: Base */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="border border-primary/30 bg-primary/5 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">1</span>
                      <h3 className="font-display font-bold text-lg">Vaste Service Fee</h3>
                    </div>
                    <span className="font-display font-bold text-2xl">€1.500<span className="text-sm text-muted-foreground font-normal">/mnd</span></span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-10">
                    Beide stromen · 4-lagen systeem · Signaalgebaseerde targeting · Tot 5 gebruikers · €0 opstartkosten
                  </p>
                </motion.div>

                {/* Step 2: Engagement */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card-gradient border border-glow rounded-lg p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">2</span>
                    <h3 className="font-display font-bold text-lg">Engagement-uren</h3>
                    <span className="text-[10px] font-display font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">Optioneel</span>
                  </div>

                  {/* Period toggle */}
                  <div className="flex bg-secondary/80 rounded-lg p-1 mb-4 w-fit">
                    {([6, 12] as const).map(p => (
                      <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {p} maanden
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {engagementOptions.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setEngagement(i)}
                        className={`rounded-lg p-4 border text-center transition-all ${
                          engagement === i
                            ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <p className="font-display font-bold text-lg">{opt.label}</p>
                        {opt.hours > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            +€{period === 6 ? opt.price6 : opt.price12}/mnd
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Step 3: Datahub */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <button
                    onClick={() => setDatahub(!datahub)}
                    className={`w-full card-gradient border rounded-lg p-6 text-left transition-all ${
                      datahub ? "border-primary/40 ring-1 ring-primary/20" : "border-glow hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">3</span>
                        <Database className="w-5 h-5 text-primary" />
                        <h3 className="font-display font-bold text-lg">Datahub</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-display font-bold text-lg">+€500<span className="text-sm text-muted-foreground font-normal">/mnd</span></span>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          datahub ? "bg-primary border-primary" : "border-muted-foreground/40"
                        }`}>
                          {datahub && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 ml-10">
                      Commercieel geheugen · AI-context centrum · Query-based inzichten · Geen vendor lock-in
                    </p>
                  </button>
                </motion.div>

                {/* Step 4: Add-ons */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">4</span>
                    <h3 className="font-display font-bold text-lg">Add-ons</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setRecruitment(!recruitment)}
                      className={`card-gradient border rounded-lg p-5 text-left transition-all ${
                        recruitment ? "border-primary/40 ring-1 ring-primary/20" : "border-glow hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="font-display font-bold text-sm">Full Service Recruitment</span>
                        </div>
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                          recruitment ? "bg-primary border-primary" : "border-muted-foreground/40"
                        }`}>
                          {recruitment && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Succesfee: 15% bruto jaarsalaris</p>
                    </button>

                    <button
                      onClick={() => setSalesMgmt(!salesMgmt)}
                      className={`card-gradient border rounded-lg p-5 text-left transition-all ${
                        salesMgmt ? "border-primary/40 ring-1 ring-primary/20" : "border-glow hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-primary" />
                          <span className="font-display font-bold text-sm">Full Sales Management</span>
                        </div>
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                          salesMgmt ? "bg-primary border-primary" : "border-muted-foreground/40"
                        }`}>
                          {salesMgmt && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Prijs op aanvraag</p>
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Right: Summary */}
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:sticky lg:top-24 h-fit"
              >
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Calculator className="w-5 h-5 text-primary" />
                    <h3 className="font-display font-bold text-lg">Uw pakket</h3>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service fee</span>
                      <span className="text-foreground font-medium">€1.500</span>
                    </div>

                    {engagement > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{engagementOptions[engagement].label} engagement</span>
                        <span className="text-foreground font-medium">€{engFee.toLocaleString()}</span>
                      </div>
                    )}

                    {datahub && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Datahub</span>
                        <span className="text-foreground font-medium">€500</span>
                      </div>
                    )}

                    {recruitment && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Recruitment</span>
                        <span className="text-primary text-xs font-medium">15% succesfee</span>
                      </div>
                    )}

                    {salesMgmt && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Sales Management</span>
                        <span className="text-primary text-xs font-medium">Op aanvraag</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-muted-foreground">Totaal per maand</span>
                      <div className="text-right">
                        <span className="font-display font-bold text-3xl text-foreground">€{monthlyTotal.toLocaleString()}</span>
                        {(recruitment || salesMgmt) && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">+ add-on fees</p>
                        )}
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      Contract: {period} maanden · €0 opstartkosten
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Button variant="hero" size="lg" className="w-full" asChild>
                      <a href="https://app.usemotion.com/meet/Rebel-Force/meeting" target="_blank" rel="noopener noreferrer"
                        onClick={() => trackCTA("Pricing — Plan een Demo", "https://app.usemotion.com/meet/Rebel-Force/meeting")}>
                        Plan een Demo →
                      </a>
                    </Button>
                    <Button variant="heroOutline" size="sm" className="w-full" asChild>
                      <Link to="/contact" onClick={() => trackCTA("Pricing — Stel een vraag", "/contact")}>
                        Stel een vraag
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Pricing;
