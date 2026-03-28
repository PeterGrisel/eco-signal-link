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
            { name: "Home", url: "https://b2bgroeimachine.io/" },
            { name: "Pipeline Equation™", url: "https://b2bgroeimachine.io/pipeline-equation" },
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
                    href="https://app.usemotion.com/meet/Rebel-Force/meeting"
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

        {/* The 10 Variables */}
        <section className="py-16 md:py-20 border-t border-border bg-secondary/30">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                Dit zijn de 10 factoren
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Elke factor telt. Is er één zwak? Dan lekt uw hele pipeline.
              </p>
            </motion.div>

            <div className="space-y-8">
              {pipelinePhases.map((phase, pi) => {
                const vars = pipelineVariables.filter((v) => v.phase === phase.key);
                return (
                  <motion.div
                    key={phase.key}
                    initial={{ opacity: 0, x: pi % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: pi * 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {(() => { const Icon = phaseIconMap[phase.icon]; return Icon ? <Icon className="w-6 h-6 text-primary" /> : null; })()}
                      <div>
                        <h3 className="font-display font-bold text-foreground text-lg">
                          {pi + 1}. {phase.label}
                        </h3>
                        <p className="text-sm text-muted-foreground">{phase.subtitle}</p>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {vars.map((v) => (
                        <div key={v.id} className="bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            {(() => { const Icon = varIconMap[v.icon]; return Icon ? <Icon className="w-4 h-4 text-primary" /> : null; })()}
                            <span className="text-xs font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">{v.code}</span>
                            <h4 className="font-display font-semibold text-foreground text-sm">{v.name}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{v.description}</p>
                          <ul className="space-y-1">
                            {v.details.map((d, i) => (
                              <li key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </motion.div>
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
                href="https://app.usemotion.com/meet/Rebel-Force/meeting"
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
