import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import Hero from "@/components/Hero";
import PageLoader from "@/components/PageLoader";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import Footer from "@/components/Footer";

import AmbientBackdrop from "@/components/homepage/AmbientBackdrop";
import PricingSection from "@/components/PricingSection";
import FaqSection from "@/components/FaqSection";
import CtaSection from "@/components/CtaSection";
import Gtm2026Section from "@/components/Gtm2026Section";
import HerkenbareSection from "@/components/HerkenbareSection";
import HowItWorksCarousel from "@/components/HowItWorksCarousel";
import AlwaysOnBentoSection from "@/components/AlwaysOnBentoSection";
import GroeistackSection from "@/components/GroeistackSection";

import Chapter11Bewegingen from "@/components/homepage/chapters/Chapter11Bewegingen";

const Index = () => {
  // Scroll to hash after entrance animation completes (300ms fade)
  useEffect(() => {
    if (!window.location.hash || window.location.hash === '#') return;
    const id = window.location.hash.slice(1);
    const timer = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  // Smooth scroll for all anchor links on this page
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const href = (target as HTMLAnchorElement).getAttribute('href');
      if (!href || href === '#') return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <PageLoader>
    <div className="min-h-screen relative">
      {/* Cinematic ambient backdrop — falling pattern + primary glows */}
      <AmbientBackdrop />
      <div className="relative z-10">
      <BreadcrumbJsonLd items={[{ name: "Home", url: "https://www.b2bgroeimachine.io/" }]} />
      <Navbar />
      <div id="section-hero">
        <Hero />
      </div>
      {/* Offer-led: aanbod, hoe het werkt, en het bewijs */}
      <HerkenbareSection />
      <Gtm2026Section />
      <HowItWorksCarousel />
      <AlwaysOnBentoSection />
      <GroeistackSection />
      <Chapter11Bewegingen />
      <PricingSection showPerformancePartnership={false} />
      <FaqSection />
      <CtaSection />
      <Footer />
      
      </div>
    </div>
    </PageLoader>
  );
};

export default Index;
