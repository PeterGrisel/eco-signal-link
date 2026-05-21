import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import PageLoader from "@/components/PageLoader";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import HomepageNarrative from "@/components/homepage/HomepageNarrative";
import HomepageHook from "@/components/homepage/HomepageHook";
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
      <Hero />
      <HomepageHook />
      <HomepageNarrative />
      <PricingSection />
      <FaqSection />
      <Footer />
      <MobileDock />
      <ActScrollProgress
        acts={[
          { id: "chapter-01", label: "Scenario" },
          { id: "chapter-02", label: "Context" },
          { id: "chapter-03", label: "Twee manieren" },
          { id: "chapter-04", label: "Methode" },
          { id: "chapter-05", label: "Brein" },
          { id: "chapter-06", label: "Blauwdruk" },
          { id: "chapter-07", label: "Schaal" },
          { id: "chapter-08", label: "Funnel" },
          { id: "chapter-09", label: "Modules" },
          { id: "chapter-10", label: "Levering" },
          { id: "chapter-11", label: "Bewegingen" },
          { id: "act-finale", label: "Start" },
        ]}
      />
      </div>
    </div>
    </PageLoader>
  );
};

export default Index;
