import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import PageLoader from "@/components/PageLoader";
import AmbientBackdrop from "@/components/homepage/AmbientBackdrop";
import Chapter03TwoWays from "@/components/homepage/chapters/Chapter03TwoWays";
import Chapter04Methode from "@/components/homepage/chapters/Chapter04Methode";
import Chapter05Brein from "@/components/homepage/chapters/Chapter05Brein";
import Chapter06Blauwdruk from "@/components/homepage/chapters/Chapter06Blauwdruk";
import Chapter07Schaal from "@/components/homepage/chapters/Chapter04Schaal";
import Chapter08Funnel from "@/components/homepage/chapters/Chapter08Funnel";
import Chapter09Modules from "@/components/homepage/chapters/Chapter09Modules";
import Chapter10Levering from "@/components/homepage/chapters/Chapter10Levering";
import ScenarioSideScroller from "@/components/homepage/ScenarioSideScroller";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import CtaLink from "@/components/CtaLink";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";

const HoeHetWerkt = () => {
  usePageMeta({
    title:
      "Hoe het werkt — het B2B-groeisysteem stap voor stap | B2BGroeiMachine",
    description:
      "Van commerciële context tot geboekte gesprekken. Bekijk de volledige methode: het Commercieel Brein, acht stappen, modules en levering.",
    canonical: "https://www.b2bgroeimachine.io/hoe-het-werkt",
  });

  return (
    <PageLoader>
      <div className="min-h-screen relative">
        <AmbientBackdrop />
        <div className="relative z-10">
          <BreadcrumbJsonLd
            items={[
              { name: "Home", url: "https://www.b2bgroeimachine.io/" },
              {
                name: "Hoe het werkt",
                url: "https://www.b2bgroeimachine.io/hoe-het-werkt",
              },
            ]}
          />
          <Navbar />

          {/* Intro */}
          <section id="hhw-intro" className="relative pt-32 md:pt-40 pb-8 md:pb-12">
            <div className="container max-w-4xl mx-auto px-4 md:px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-primary font-display font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                  De methode
                </p>
                <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tighter leading-[1.04] mb-6 [text-shadow:0_2px_24px_hsl(var(--background))]">
                  Hoe het <span className="text-gradient">werkt.</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
                  Van commerciële context tot geboekte gesprekken. Eén
                  fundament, acht stappen, modules die op elkaar voortbouwen.
                  Hier ziet u het hele systeem.
                </p>
                <Button variant="hero" size="lg" asChild>
                  <CtaLink intent="gratisScan" location="Hoe het werkt — hero" />
                </Button>
              </motion.div>
            </div>
          </section>

          <main className="cinematic-home relative">
            <Chapter03TwoWays />
            <div id="section-smederij">
              <ScenarioSideScroller />
            </div>
            <Chapter07Schaal />
            <Chapter04Methode />
            <Chapter05Brein />
            <Chapter06Blauwdruk />
            <Chapter08Funnel />
            <Chapter09Modules />
            <Chapter10Levering />
          </main>
          <Footer />
          
        </div>
      </div>
    </PageLoader>
  );
};

export default HoeHetWerkt;
