import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import Hero from "@/components/Hero";
import PageLoader from "@/components/PageLoader";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import Footer from "@/components/Footer";
import MobileDock from "@/components/MobileDock";
import AmbientBackdrop from "@/components/homepage/AmbientBackdrop";
import PricingSection from "@/components/PricingSection";
import FaqSection from "@/components/FaqSection";
import CtaSection from "@/components/CtaSection";
import ServiceLinesSection from "@/components/ServiceLinesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import LogoTicker from "@/components/LogoTicker";

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
      {/* Cinematic ambient backdrop — falling pattern + primary glows */}
      <AmbientBackdrop />
      <div className="relative z-10">
      <BreadcrumbJsonLd items={[{ name: "Home", url: "https://b2bgroeimachine.io/" }]} />
      <Navbar />
      <div id="section-hero">
        <Hero />
      </div>
      {/* Offer-led: aanbod, hoe het werkt, en het bewijs */}
      <ServiceLinesSection />
      <HowItWorksSection />
      <LogoTicker />
      <CaseStudiesSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
      <MobileDock />
      </div>
    </div>
    </PageLoader>
  );
};

export default Index;
