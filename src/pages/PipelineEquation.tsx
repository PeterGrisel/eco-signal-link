import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PipelineScoreCalculator from "@/components/pipeline/PipelineScoreCalculator";
import { pipelineVariables, pipelinePhases } from "@/data/pipelineVariables";
import { Button } from "@/components/ui/button";
import { trackCTA } from "@/lib/tracking";
import { Wrench, Building2, Zap, Magnet, Crosshair, MessageSquare, RefreshCw, TrendingUp, Database, Radio, Clock, Gem, PenLine, UserCheck, Share2, IterationCw, Flag } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const phaseIconMap: Record<string, LucideIcon> = {
  Magnet, Crosshair, MessageSquare, RefreshCw, TrendingUp,
};

const varIconMap: Record<string, LucideIcon> = {
  Magnet, Database, Radio, Clock, Gem, PenLine, UserCheck, Share2, IterationCw, Flag,
};

const PipelineEquation = () => {
  return (
    <PageLoader>
      <div className="min-h-screen">
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "https://www.b2bgroeimachine.io/" },
            { name: "Pipeline Equation™", url: "https://www.b2bgroeimachine.io/pipeline-equation" },
          ]}
        />
        <Navbar />

        {/* Hero */}
        <section className="pt-28 pb-16 md:pt-36 md:pb-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--gradient-glow)] pointer-events-none" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block text-xs font-mono uppercase tracking-widest text-primary mb-4 border border-primary/30 rounded-full px-4 py-1.5">
                Eigen framework
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                De <span className="text-primary">Pipeline Equation™</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
                Uw pipeline hangt af van 10 factoren. De meeste bedrijven werken aan 1 of 2. Wij pakken alle 10 aan.
              </p>
              <p className="text-foreground font-display font-medium text-base md:text-lg max-w-xl mx-auto mb-8">
                Pipeline = Attract × Reach × Resonate × Execute × Convert
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <a href="#calculator">Bereken uw score →</a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a
                    href="https://meetings-eu1.hubspot.com/peter-grisel"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCTA("Pipeline Equation Hero — Demo", "/pipeline-equation")}
                  >
                    Plan een gesprek
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* What is a pipeline? — Dummy-level explainer */}
        <section className="py-16 md:py-20 border-t border-border">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
                Eerst even simpel uitgelegd
              </h2>

              <div className="grid md:grid-cols-2 gap-8 mb-10">
                {/* Wat is een pipeline */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-display font-semibold text-foreground text-lg mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Wat is een pipeline?
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Uw pipeline is de stroom van mensen die uw bedrijf ontdekken, interesse krijgen en uiteindelijk klant worden.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Denk aan een trechter. Bovenaan komen mensen binnen. Onderaan komen er klanten uit. Hoe beter de trechter werkt, hoe meer klanten u krijgt.
                  </p>
                </div>

                {/* Wat zijn factoren */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-display font-semibold text-foreground text-lg mb-3 flex items-center gap-2">
                    <Crosshair className="w-5 h-5 text-primary" />
                    Wat zijn factoren?
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Factoren zijn de dingen die bepalen of uw pipeline goed werkt. Er zijn er 10. Elke factor heeft invloed op het resultaat.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Is één factor zwak? Dan lekt de hele trechter. Net als een ketting: die is zo sterk als de zwakste schakel.
                  </p>
                </div>
              </div>

              {/* De formule visueel */}
              <div className="bg-card border border-primary/20 rounded-xl p-6 md:p-8 text-center">
                <p className="text-sm text-muted-foreground mb-4">De formule in het kort:</p>
                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-4">
                  <span className="font-display font-bold text-foreground text-lg md:text-xl">Resultaat</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="bg-primary/10 text-primary font-display font-semibold text-sm md:text-base px-3 py-1.5 rounded-lg">Factor 1</span>
                  <span className="text-muted-foreground">×</span>
                  <span className="bg-primary/10 text-primary font-display font-semibold text-sm md:text-base px-3 py-1.5 rounded-lg">Factor 2</span>
                  <span className="text-muted-foreground">×</span>
                  <span className="text-muted-foreground text-sm">…</span>
                  <span className="text-muted-foreground">×</span>
                  <span className="bg-primary/10 text-primary font-display font-semibold text-sm md:text-base px-3 py-1.5 rounded-lg">Factor 10</span>
                </div>
                <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                  Scoort u op 9 factoren een 8, maar op één factor een 2? Dan trekt die ene factor het hele resultaat omlaag. Daarom pakken wij alle 10 aan.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why this matters */}
        <section className="py-16 md:py-20 border-t border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-6">
                Waarom uw pipeline niet groeit
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <Wrench className="w-7 h-7 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-display font-semibold text-foreground mb-2">Tools</h3>
                  <p className="text-sm text-muted-foreground">
                    Raken alleen uw data en kanalen. 2 van de 10 factoren.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <Building2 className="w-7 h-7 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-display font-semibold text-foreground mb-2">Agencies</h3>
                  <p className="text-sm text-muted-foreground">
                    Doen alleen uitvoering. 2 van de 10 factoren.
                  </p>
                </div>
                <div className="bg-card border border-primary/40 rounded-xl p-6 text-center ring-1 ring-primary/20">
                  <Zap className="w-7 h-7 text-primary mx-auto mb-3" />
                  <h3 className="font-display font-semibold text-primary mb-2">B2BGroeiMachine</h3>
                  <p className="text-sm text-muted-foreground">
                    Pakt alle 10 factoren aan. Het hele systeem.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The 10 Variables — Journey */}
        <section className="py-16 md:py-28 border-t border-border bg-secondary/30 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="mb-20 max-w-3xl"
            >
              <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                De 10 factoren
              </p>
              <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
                Van eerste contact tot klant,
                <br />
                <span className="text-gradient">factor voor factor.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Elke factor telt. Is er één zwak? Dan lekt uw hele pipeline. Hieronder ziet u precies welke factoren ertoe doen.
              </p>
            </motion.div>

            <div className="space-y-16">
              {pipelinePhases.map((phase, pi) => {
                const vars = pipelineVariables.filter((v) => v.phase === phase.key);
                const PhaseIcon = phaseIconMap[phase.icon];
                return (
                  <div key={phase.key}>
                    {/* Phase header — timeline style */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: 0.05 }}
                      className="flex items-start gap-5 mb-6"
                    >
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-12 h-12 rounded-full border-2 border-primary/40 bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-display font-bold text-sm">{String(pi + 1).padStart(2, "0")}</span>
                        </div>
                        {pi < pipelinePhases.length - 1 && (
                          <div className="w-px h-8 bg-gradient-to-b from-primary/30 to-transparent mt-2 hidden md:block" />
                        )}
                      </div>

                      <div className="pt-2">
                        <div className="flex items-center gap-3 mb-2">
                          {PhaseIcon && <PhaseIcon className="w-5 h-5 text-primary" />}
                          <h3 className="font-display font-bold text-2xl text-foreground">{phase.label}</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{phase.subtitle}</p>
                      </div>
                    </motion.div>

                    {/* Variable cards */}
                    <div className="md:ml-[4.25rem]">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {vars.map((v, vi) => {
                          const VarIcon = varIconMap[v.icon];
                          return (
                            <motion.div
                              key={v.id}
                              initial={{ opacity: 0, y: 12 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, margin: "-30px" }}
                              transition={{ duration: 0.4, delay: vi * 0.08 }}
                              className="card-gradient border border-glow rounded-lg p-5 hover:border-primary/30 transition-colors"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                {VarIcon && <VarIcon className="w-4 h-4 text-primary" />}
                                <span className="text-xs font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">{v.code}</span>
                                <h4 className="font-display font-semibold text-foreground text-sm">{v.name}</h4>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{v.description}</p>
                              <ul className="space-y-1.5">
                                {v.details.map((d, i) => (
                                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />
                                    {d}
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>



        {/* Deliverables */}
        <section className="py-16 md:py-20 border-t border-border">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
                Dit krijgt u van ons
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { num: "01", title: "Pipeline Audit", desc: "Wij scoren elke factor op basis van uw data." },
                  { num: "02", title: "Systeem Ontwerp", desc: "Hoe alle factoren bij u samenwerken." },
                  { num: "03", title: "Actieplan", desc: "Welke factor u eerst moet verbeteren." },
                  { num: "04", title: "Maandelijkse Verbetering", desc: "Elke maand meten, bijsturen, groeien." },
                ].map((item) => (
                  <div key={item.num} className="bg-card border border-border rounded-xl p-6 text-left">
                    <span className="text-xs font-mono text-primary font-bold">{item.num}</span>
                    <h3 className="font-display font-semibold text-foreground mt-1 mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Calculator */}
        <div className="border-t border-border bg-secondary/20">
          <PipelineScoreCalculator />
        </div>

        {/* CTA */}
        <section className="py-16 md:py-20 border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Klaar om te groeien?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Wij vinden uw zwakste schakel en maken die sterk. Zo groeit uw pipeline stap voor stap.
            </p>
            <Button variant="hero" size="lg" asChild>
              <a
                href="https://meetings-eu1.hubspot.com/peter-grisel"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCTA("Pipeline Equation CTA — Demo", "/pipeline-equation")}
              >
                Plan een gesprek →
              </a>
            </Button>
          </div>
        </section>

        <Footer />
      </div>
    </PageLoader>
  );
};

export default PipelineEquation;
