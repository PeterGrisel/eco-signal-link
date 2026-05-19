import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import PageLoader from "@/components/PageLoader";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

import HookSection from "@/components/HookSection";
import NoLeadAgencySection from "@/components/NoLeadAgencySection";
import StreamsSection from "@/components/StreamsSection";
import SystemSection from "@/components/SystemSection";
import PipelineEquationTeaser from "@/components/PipelineEquationTeaser";
import FunnelSection from "@/components/FunnelSection";
import FunnelInfographic from "@/components/FunnelInfographic";
import ProcessSection from "@/components/ProcessSection";
import DatahubSection from "@/components/DatahubSection";
import PricingSection from "@/components/PricingSection";
import ResultsSection from "@/components/ResultsSection";
import DeliveryModelSection from "@/components/DeliveryModelSection";
import CtaSection from "@/components/CtaSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import StickyHeroCta from "@/components/StickyHeroCta";

const Index = () => {
  // Redirect auth errors (expired magic links) to /signaal/start
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('error=') && hash.includes('otp_expired')) {
      window.location.href = '/signaal/start' + hash;
    }
  }, []);

  return (
    <PageLoader>
    <div className="min-h-screen relative">
      {/* Homepage-wide ambient glow background */}
      <div
        aria-hidden
        className="fixed inset-0 glow-bg pointer-events-none z-0"
      />
      <div className="relative z-10">
      <BreadcrumbJsonLd items={[{ name: "Home", url: "https://b2bgroeimachine.io/" }]} />
      <Navbar />
      <Hero />

      <FunnelInfographic />
      <NoLeadAgencySection />
      <HookSection />
      <StreamsSection />
      <SystemSection />
      <PipelineEquationTeaser />
      <FunnelSection />
      <ProcessSection />
      <DatahubSection />
      <PricingSection />
      <DeliveryModelSection />
      <ResultsSection />
      <FaqSection />
      <CtaSection />
      <Footer />
      <StickyHeroCta />
      </div>
    </div>
    </PageLoader>
  );
};

export default Index;
