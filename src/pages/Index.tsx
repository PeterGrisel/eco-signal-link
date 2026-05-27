import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
      {/* Offer-led: meteen het aanbod en het bewijs */}
      <ServiceLinesSection />
      <LogoTicker />
      <CaseStudiesSection />
      <PricingSection />
      <FaqSection />

      {/* Teaser naar de volledige methode (verplaatst van de homepage) */}
      <section className="py-12 md:py-20 relative">
        <div className="container mx-auto px-4 md:px-6">
          <Link
            to="/hoe-het-werkt"
            className="group block rounded-2xl border border-primary/25 bg-primary/5 p-6 md:p-8 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <div>
                <p className="text-[10px] font-display font-semibold tracking-[0.22em] uppercase text-primary/80 mb-2">
                  De volledige methode
                </p>
                <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight">
                  Benieuwd hoe het systeem werkt?
                </h3>
                <p className="text-muted-foreground mt-2 max-w-xl leading-relaxed">
                  Het Commercieel Brein, acht stappen, modules en levering, stap
                  voor stap uitgelegd.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 font-medium text-primary group-hover:gap-3 transition-all">
                Hoe het werkt
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      <CtaSection />
      <Footer />
      <MobileDock />
      </div>
    </div>
    </PageLoader>
  );
};

export default Index;
