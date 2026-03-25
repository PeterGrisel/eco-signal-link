import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

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
    <div className="min-h-screen">
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
  );
};

export default Index;
