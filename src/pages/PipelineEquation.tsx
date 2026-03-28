import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PipelineScoreCalculator from "@/components/pipeline/PipelineScoreCalculator";
import { pipelineVariables, pipelinePhases } from "@/data/pipelineVariables";
import { Button } from "@/components/ui/button";
import { trackCTA } from "@/lib/tracking";

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
                Pipeline = f(10 variabelen). De meeste bedrijven optimaliseren 1 of 2.
                Wij optimaliseren het hele systeem.
              </p>
              <p className="text-foreground font-display font-medium text-base md:text-lg max-w-xl mx-auto mb-8">
                Pipeline (Y) = f(Attract × Reach × Resonate × Execute × Convert)
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <a href="#calculator">Bereken uw Pipeline Score™ →</a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a
                    href="https://app.usemotion.com/meet/Rebel-Force/meeting"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCTA("Pipeline Equation Hero — Demo", "/pipeline-equation")}
                  >
                    Plan een Demo
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
                Waarom de meeste pipelines falen
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <span className="text-3xl mb-3 block">🔧</span>
                  <h3 className="font-display font-semibold text-foreground mb-2">Tools</h3>
                  <p className="text-sm text-muted-foreground">
                    Beïnvloeden alleen X2 en X8. Data en kanalen, meer niet.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <span className="text-3xl mb-3 block">🏢</span>
                  <h3 className="font-display font-semibold text-foreground mb-2">Agencies</h3>
                  <p className="text-sm text-muted-foreground">
                    Beïnvloeden alleen X8 en X9. Kanaaluitvoering en touchpoints.
                  </p>
                </div>
                <div className="bg-card border border-primary/40 rounded-xl p-6 text-center ring-1 ring-primary/20">
                  <span className="text-3xl mb-3 block">⚡</span>
                  <h3 className="font-display font-semibold text-primary mb-2">B2BGroeiMachine</h3>
                  <p className="text-sm text-muted-foreground">
                    Beheert X1 tot en met X10. Het hele systeem, geoptimaliseerd.
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
                De 10 variabelen die uw pipeline bepalen
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Elke variabele beïnvloedt het eindresultaat. Eén zwakke schakel en de hele keten breekt.
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
                      <span className="text-2xl">{phase.icon}</span>
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
                Wat u concreet krijgt
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { num: "01", title: "Pipeline Variable Audit", desc: "Score per variabele, gebaseerd op data en analyse." },
                  { num: "02", title: "System Architecture", desc: "Hoe alle variabelen in uw situatie samenwerken." },
                  { num: "03", title: "Optimization Plan", desc: "Welke variabele eerst, voor maximale impact." },
                  { num: "04", title: "Continuous Improvement", desc: "Maandelijkse iteratie op basis van resultaten." },
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
              Klaar om uw pipeline te optimaliseren?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Wij identificeren en optimaliseren de 10 variabelen die uw pipeline bepalen.
            </p>
            <Button variant="hero" size="lg" asChild>
              <a
                href="https://app.usemotion.com/meet/Rebel-Force/meeting"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCTA("Pipeline Equation CTA — Demo", "/pipeline-equation")}
              >
                Plan een Demo →
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
