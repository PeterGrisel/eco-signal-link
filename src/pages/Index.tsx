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
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <PageLoader>
    <div className="min-h-screen">
      <BreadcrumbJsonLd items={[{ name: "Home", url: "https://eco-signal-link.lovable.app/" }]} />
      <Navbar />
      <Hero />
      
      <StreamsSection />
      <SystemSection />
      <FunnelSection />
      <ProcessSection />
      <DatahubSection />
      <PricingSection />
      <ResultsSection />
      <CtaSection />
      <Footer />
    </div>
    </PageLoader>
  );
};

export default Index;
