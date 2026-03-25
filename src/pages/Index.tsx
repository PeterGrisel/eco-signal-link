import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LogoTicker from "@/components/LogoTicker";
import StreamsSection from "@/components/StreamsSection";
import SystemSection from "@/components/SystemSection";
import ProcessSection from "@/components/ProcessSection";
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
      <ProcessSection />
      <ResultsSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Index;
