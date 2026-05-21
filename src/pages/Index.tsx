import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import PageLoader from "@/components/PageLoader";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import HomepageNarrative from "@/components/homepage/HomepageNarrative";
import Footer from "@/components/Footer";
import StickyHeroCta from "@/components/StickyHeroCta";
import ActScrollProgress from "@/components/homepage/ActScrollProgress";
import AmbientBackdrop from "@/components/homepage/AmbientBackdrop";

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
      <HomepageNarrative />
      <Footer />
      <StickyHeroCta />
      <ActScrollProgress
        acts={[
          { id: "chapter-01", label: "Scenario" },
          { id: "chapter-02", label: "Context" },
          { id: "chapter-03", label: "Twee manieren" },
          { id: "chapter-04", label: "Schaal" },
          { id: "chapter-05", label: "Aanpak" },
          { id: "act-finale", label: "Start" },
        ]}
      />
      </div>
    </div>
    </PageLoader>
  );
};

export default Index;
