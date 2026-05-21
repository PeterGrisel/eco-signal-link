import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import PageLoader from "@/components/PageLoader";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

import HookSection from "@/components/HookSection";
import MethodeSection from "@/components/MethodeSection";
import VergelijkingSection from "@/components/VergelijkingSection";
import SchaalCijfersSection from "@/components/SchaalCijfersSection";
import MiniFaq from "@/components/MiniFaq";
import ProcessSection from "@/components/ProcessSection";
import PricingSection from "@/components/PricingSection";
import ResultsSection from "@/components/ResultsSection";
import CtaSection from "@/components/CtaSection";
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
      <HookSection />
      <VergelijkingSection />
      <MethodeSection />
      <SchaalCijfersSection />
      <ResultsSection />
      <ProcessSection />
      <PricingSection />
      <MiniFaq />
      <CtaSection />
      <Footer />
      <StickyHeroCta />
      </div>
    </div>
    </PageLoader>
  );
};

export default Index;
