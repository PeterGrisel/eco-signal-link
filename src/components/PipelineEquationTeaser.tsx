import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Magnet, Crosshair, MessageSquare, RefreshCw, TrendingUp } from "lucide-react";
import { trackCTA } from "@/lib/tracking";

const phases = [
  { icon: Magnet, label: "Attract", desc: "Wie u bereikt" },
  { icon: Crosshair, label: "Reach", desc: "Het juiste moment" },
  { icon: MessageSquare, label: "Resonate", desc: "Wat u zegt" },
  { icon: RefreshCw, label: "Execute", desc: "Hoe u het doet" },
  { icon: TrendingUp, label: "Convert", desc: "Van reactie naar klant" },
];

const PipelineEquationTeaser = () => {
  return (
    <section className="py-16 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 glow-bg pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
              Eigen framework
            </p>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight leading-tight mb-6">
              De Pipeline Equation™
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Uw pipeline hangt af van 10 factoren. De meeste bedrijven werken aan 1 of 2. Wij pakken alle 10 aan.
            </p>
            <p className="text-foreground font-display font-medium mb-8">
              Doe de gratis test en ontdek waar uw pipeline lekt.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="hero" size="lg" asChild>
                <Link
                  to="/pipeline-equation#calculator"
                  onClick={() => trackCTA("Homepage — Pipeline Score CTA", "/")}
                >
                  Bereken uw score →
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/pipeline-equation">
                  Bekijk het framework <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right: visual pipeline phases */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="space-y-3">
              {phases.map((phase, i) => (
                <motion.div
                  key={phase.label}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-center gap-4 card-gradient border border-glow rounded-lg p-4 md:p-5 hover:border-primary/30 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-primary/40 bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-display font-bold text-xs">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <phase.icon className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-foreground">{phase.label}</h3>
                    <p className="text-sm text-muted-foreground">{phase.desc}</p>
                  </div>
                  {i < phases.length - 1 && (
                    <span className="ml-auto text-muted-foreground/30 text-lg font-light hidden md:block">×</span>
                  )}
                  {i === phases.length - 1 && (
                    <span className="ml-auto text-primary text-lg font-light hidden md:block">=</span>
                  )}
                </motion.div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <span className="text-sm text-muted-foreground">
                Is één factor zwak? Dan lekt uw hele pipeline.
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PipelineEquationTeaser;
