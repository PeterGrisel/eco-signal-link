import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import CtaLink from "@/components/CtaLink";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";
import HeroFlow from "@/components/hhwv2/HeroFlow";
import VideoCaptureSection from "@/components/hhwv2/VideoCaptureSection";
import LogoWallCases from "@/components/hhwv2/LogoWallCases";
import TwoPathsSection from "@/components/hhwv2/TwoPathsSection";
import ProblemSection from "@/components/hhwv2/ProblemSection";
import EngineFlow from "@/components/hhwv2/EngineFlow";
import SystemMapSection from "@/components/hhwv2/SystemMapSection";
import ServiceStackSection from "@/components/hhwv2/ServiceStackSection";
import NinetyDayBuild from "@/components/hhwv2/NinetyDayBuild";
import PlaysSection from "@/components/hhwv2/PlaysSection";
import ExecutionLayer from "@/components/hhwv2/ExecutionLayer";
import ComparisonTable from "@/components/hhwv2/ComparisonTable";
import ProofSection from "@/components/hhwv2/ProofSection";
import FaqSection from "@/components/hhwv2/FaqSection";

const HoeHetWerktV2 = () => {
  usePageMeta({
    title: "Hoe het werkt — het B2B-groeisysteem | B2BGroeiMachine",
    description:
      "Signalen worden geroute acties. Bouw het fundament in 90 dagen of laat ons de uitvoering draaien. Gebouwd in jouw eigen stack.",
    canonical: "https://www.b2bgroeimachine.io/hoe-het-werkt-v2",
  });

  return (
    <PageLoader>
      <div className="min-h-screen relative bg-background">
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "https://www.b2bgroeimachine.io/" },
            { name: "Hoe het werkt", url: "https://www.b2bgroeimachine.io/hoe-het-werkt-v2" },
          ]}
        />
        <Navbar />
        <main>
          <HeroFlow />
          <VideoCaptureSection />
          <LogoWallCases />
          <TwoPathsSection />
          <ProblemSection />
          <EngineFlow />
          <SystemMapSection />
          <ServiceStackSection />
          <NinetyDayBuild />
          <PlaysSection />
          <ExecutionLayer />
          <ComparisonTable />
          <ProofSection />
          <FaqSection />

          {/* Final CTA */}
          <section className="py-20 md:py-32 relative">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
              <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
                Zie wat we in jouw
                <br />
                <span className="text-gradient">go-to-market zouden bouwen.</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Voor ambitieuze B2B-bedrijven met duidelijke product-market-fit.
              </p>
              <Button variant="hero" size="lg" asChild>
                <CtaLink intent="gratisScan" location="Hoe het werkt v2 — finale" />
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageLoader>
  );
};

export default HoeHetWerktV2;