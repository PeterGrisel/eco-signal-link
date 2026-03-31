import { useState } from "react";
import { motion } from "framer-motion";
import { trackCTA } from "@/lib/tracking";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Check, Database, Users, Briefcase, ArrowRight,
  Calculator, Rocket, Settings, CheckCircle, Info
} from "lucide-react";

const engagementPackages = [
  { hours: 0, label: "Geen", rate: { "6": 0, "12": 0 } },
  { hours: 10, label: "10 uur", planName: "Startpakket", rate: { "6": 100, "12": 90 } },
  { hours: 20, label: "20 uur", planName: "Meest gekozen", rate: { "6": 90, "12": 81 }, highlight: true },
  { hours: 40, label: "40 uur", planName: "Maximale output", rate: { "6": 80, "12": 72 } },
];

const Pricing = () => {
  const [engagement, setEngagement] = useState(0);
  const [datahub, setDatahub] = useState(false);
  const [recruitment, setRecruitment] = useState(false);
  const [salesMgmt, setSalesMgmt] = useState(false);
  const [period, setPeriod] = useState<"6" | "12">("6");

  const baseFee = 1500;
  const datahubFee = datahub ? 499 : 0;
  const selectedPkg = engagementPackages[engagement];
  const engRate = selectedPkg.rate[period];
  const engFee = selectedPkg.hours * engRate;
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
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="text-muted-foreground hover:text-primary transition-colors">
                            <Info className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs text-sm">
                          <p>Engagement-uren zijn consultancy-uren voor procesoptimalisaties, strategisch advies en waar nodig het overnemen van operationele taken.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="text-[10px] font-display font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">Optioneel</span>
                  </div>

                  {/* Period toggle */}
                  <div className="flex items-center gap-1 bg-secondary/80 border border-border rounded-full p-1 mb-5 w-fit">
                    <button
                      onClick={() => setPeriod("6")}
                      className={`px-4 py-1.5 rounded-full text-xs font-display font-semibold transition-all ${
                        period === "6" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      6 maanden
                    </button>
                    <button
                      onClick={() => setPeriod("12")}
                      className={`px-4 py-1.5 rounded-full text-xs font-display font-semibold transition-all flex items-center gap-1.5 ${
                        period === "12" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      12 maanden
                      <span className="text-[10px] font-bold text-primary">-10%</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {engagementPackages.map((pkg, i) => {
                      const rate = pkg.rate[period];
                      const total = pkg.hours * rate;
                      return (
                        <button
                          key={i}
                          onClick={() => setEngagement(i)}
                          className={`rounded-lg p-4 border text-center transition-all ${
                            engagement === i
                              ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                              : pkg.highlight
                                ? "border-primary/20 hover:border-primary/30"
                                : "border-border hover:border-primary/30"
                          }`}
                        >
                          {pkg.planName && (
                            <span className={`text-[9px] font-display font-bold tracking-[0.1em] uppercase ${
                              pkg.highlight ? "text-primary" : "text-muted-foreground"
                            }`}>{pkg.planName}</span>
                          )}
                          <p className="font-display font-bold text-lg">{pkg.label}</p>
                          {pkg.hours > 0 && (
                            <div className="mt-1.5">
                              <p className="text-xs text-muted-foreground">€{total}/mnd</p>
                              <p className="text-[10px] text-primary font-semibold mt-0.5">€{rate}/uur</p>
                            </div>
                          )}
                        </button>
                      );
                    })}
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
                        <span className="font-display font-bold text-lg">+€499<span className="text-sm text-muted-foreground font-normal">/mnd</span></span>
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
                        <span className="text-muted-foreground">{engagementPackages[engagement].label} engagement</span>
                        <span className="text-foreground font-medium">€{engFee.toLocaleString()}</span>
                      </div>
                    )}

                    {datahub && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Datahub</span>
                        <span className="text-foreground font-medium">€499</span>
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

        {/* Delivery Model: Opex vs Capex */}
        <section className="py-16 md:py-24 border-t border-border">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                Twee modellen
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight leading-tight mb-4">
                Opex of <span className="text-gradient">Capex.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
                De configurator hierboven geldt voor Done-for-you (Opex).
                Liever een eenmalig project? Build &amp; Transfer is maatwerk op aanvraag.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* Done-for-you */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="relative card-gradient border border-primary/30 rounded-xl p-8 flex flex-col"
              >
                <div className="absolute -top-3 right-6 bg-primary text-primary-foreground text-xs font-display font-semibold px-3 py-1 rounded-full tracking-wide uppercase">
                  Meest gekozen
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-xl mb-1">Done-for-you</h3>
                <p className="text-primary font-display text-sm font-semibold mb-3">Opex · Snel starten, volledig begeleid</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  Ideaal als je snel wilt beginnen, geen eigen toolstack wilt opzetten
                  en volledig begeleid wilt worden. Wij regelen alles.
                </p>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {["Geen eigen toolstack nodig", "Volledig begeleid van dag één", "Doorlopend beheer en verbetering", "Groeit mee zonder extra personeel"].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="hero" size="lg" className="w-full" asChild>
                  <a href="https://app.usemotion.com/meet/Rebel-Force/meeting" target="_blank" rel="noopener noreferrer"
                    onClick={() => trackCTA("Pricing Delivery — Done-for-you", "https://app.usemotion.com/meet/Rebel-Force/meeting")}>
                    Plan een Demo <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </Button>
              </motion.div>

              {/* Build & Transfer */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="card-gradient border border-glow rounded-xl p-8 flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5">
                  <Settings className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-display font-bold text-xl mb-1">Build &amp; Transfer</h3>
                <p className="text-primary font-display text-sm font-semibold mb-3">Capex · Jij wordt de beheerder</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  Voor wie zelf wilt beheren en alles in eigen hand wilt houden.
                  Wij bouwen het op jouw tools, trainen je team en dragen over.
                </p>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {["Gebouwd op je eigen tools", "Training en handleiding voor je team", "Eenmalige investering", "Prijs altijd op aanvraag"].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-muted-foreground/60 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link to="/contact" onClick={() => trackCTA("Pricing Delivery — Build & Transfer", "/contact")}>
                    Vraag een offerte aan →
                  </Link>
                </Button>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center text-muted-foreground text-sm mt-8 max-w-xl mx-auto"
            >
              Overdragen van Done-for-you naar eigen beheer is altijd mogelijk, in overleg.
            </motion.p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Pricing;
