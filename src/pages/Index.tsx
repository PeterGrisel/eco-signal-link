import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import PageLoader from "@/components/PageLoader";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import HomepageNarrative from "@/components/homepage/HomepageNarrative";
import Footer from "@/components/Footer";
import MobileDock from "@/components/MobileDock";
import ActScrollProgress from "@/components/homepage/ActScrollProgress";
import AmbientBackdrop from "@/components/homepage/AmbientBackdrop";
import PricingSection from "@/components/PricingSection";
import FaqSection from "@/components/FaqSection";

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
      {/* Cinematic ambient backdrop — flickering grid + primary glows */}
      <AmbientBackdrop />
      <div className="relative z-10">
      <BreadcrumbJsonLd items={[{ name: "Home", url: "https://b2bgroeimachine.io/" }]} />
      <Navbar />
      <div id="section-hero">
        <Hero />
      </div>
      <HomepageNarrative />
      <PricingSection />
      <FaqSection />
      <Footer />
      <MobileDock />
      <ActScrollProgress
        acts={[
          { id: "section-hero", label: "Schalen" },
          { id: "chapter-05", label: "Brein" },
          { id: "chapter-03", label: "Twee kanten" },
          { id: "section-smederij", label: "Smederij" },
          { id: "chapter-07", label: "Cijfers" },
          { id: "chapter-04", label: "8 stappen" },
          { id: "chapter-02", label: "Commercieel brein" },
          { id: "chapter-06", label: "Blauwdruk" },
          { id: "chapter-08", label: "Impressies → deal" },
          { id: "chapter-09", label: "Modules" },
          { id: "chapter-10", label: "Levering" },
          { id: "section-flipcards", label: "3 voordelen" },
          { id: "act-finale", label: "Een gesprek, een machine" },
          { id: "pricing", label: "Pricing" },
        ]}
      />
      </div>
    </div>
    </PageLoader>
  );
};

export default Index;
