import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PipelineValueCalculator from "@/components/pipeline/PipelineValueCalculator";
import GroeistackLeadCapture from "@/components/GroeistackLeadCapture";

const PipelineValuePage = () => {
  return (
    <PageLoader>
      <div className="min-h-screen">
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "https://www.b2bgroeimachine.io/" },
            { name: "Tools", url: "https://www.b2bgroeimachine.io/tools" },
            { name: "Pipeline Value Calculator", url: "https://www.b2bgroeimachine.io/tools/pipeline-value" },
          ]}
        />
        <Navbar />

        <section className="pt-28 pb-8 md:pt-36 md:pb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--gradient-glow)] pointer-events-none" />
          <div className="container mx-auto px-4 text-center relative z-10 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block text-xs font-mono uppercase tracking-widest text-primary mb-4 border border-primary/30 rounded-full px-4 py-1.5">
                Markt → Pipeline
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Pipeline Value <span className="text-primary">Calculator</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Bereken uw pipelinewaarde per cyclus. Van adresseerbare markt tot meetings en dealwaarde.
              </p>
            </motion.div>
          </div>
        </section>

        <GroeistackLeadCapture
          title="Wilt u op de hoogte blijven van alle GTM-ontwikkelingen?"
          description="Ontvang een melding zodra wij nieuwe tools, rekenmodellen en calculators lanceren."
          source="calculators"
        />

        <section className="pb-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <PipelineValueCalculator />
          </div>
        </section>

        <Footer />
      </div>
    </PageLoader>
  );
};

export default PipelineValuePage;