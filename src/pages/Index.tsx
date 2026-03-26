import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PageLoader from "@/components/PageLoader";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

import StreamsSection from "@/components/StreamsSection";
import SystemSection from "@/components/SystemSection";
import FunnelSection from "@/components/FunnelSection";
import ProcessSection from "@/components/ProcessSection";
import DatahubSection from "@/components/DatahubSection";
import PricingSection from "@/components/PricingSection";
import ResultsSection from "@/components/ResultsSection";
import CtaSection from "@/components/CtaSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <PageLoader>
    <div className="min-h-screen">
      <BreadcrumbJsonLd items={[{ name: "Home", url: "https://b2bgroeimachine.io/" }]} />
      <Navbar />
      <Hero />
      
      <StreamsSection />
      <SystemSection />
      <FunnelSection />
      <ProcessSection />
      <DatahubSection />
      <PricingSection />
      <ResultsSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
    </PageLoader>
  );
};

export default Index;
