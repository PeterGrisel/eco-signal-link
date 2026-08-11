import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { usePageMeta } from "@/hooks/usePageMeta";
import ExactHero from "@/components/hhwv2/exact/ExactHero";
import ExactFlowChart from "@/components/hhwv2/exact/ExactFlowChart";
import ExactFlywheel from "@/components/hhwv2/exact/ExactFlywheel";
import ExactLogoWall from "@/components/hhwv2/exact/ExactLogoWall";
import ExactThreeWays from "@/components/hhwv2/exact/ExactThreeWays";
import ExactRevenueEngine from "@/components/hhwv2/exact/ExactRevenueEngine";
import ExactToolStack from "@/components/hhwv2/exact/ExactToolStack";
import ExactCaseStudies from "@/components/hhwv2/exact/ExactCaseStudies";
import ExactNinetyDays from "@/components/hhwv2/exact/ExactNinetyDays";
import ExactTestimonials from "@/components/hhwv2/exact/ExactTestimonials";
import ExactFinalCta from "@/components/hhwv2/exact/ExactFinalCta";
import AmbientBackdrop from "@/components/homepage/AmbientBackdrop";

const HoeHetWerktV2 = () => {
  usePageMeta({
    title: "Hoe het werkt | B2B Groeimachine",
    description:
      "Zo werkt de B2B Groeimachine: van signaal naar gesprek. Signalen, content en outreach in één systeem. Bekijk de aanpak stap voor stap.",
    canonical: "https://www.b2bgroeimachine.io/hoe-het-werkt",
  });

  return (
    <PageLoader>
      <div className="min-h-screen relative bg-background overflow-x-hidden">
        {/* Homepage ambient backdrop */}
        <AmbientBackdrop />
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "https://www.b2bgroeimachine.io/" },
            { name: "Hoe het werkt", url: "https://www.b2bgroeimachine.io/hoe-het-werkt" },
          ]}
        />
        <Navbar />
        <main className="relative z-10">
          <ExactHero />
          <ExactLogoWall />
          <section className="container mx-auto px-4 md:px-6 pb-16 md:pb-24 max-w-5xl relative z-10">
            <ExactFlowChart />
          </section>
          <ExactFlywheel />
          <ExactThreeWays />
          <ExactRevenueEngine />
          <ExactToolStack />
          <ExactCaseStudies />
          <ExactNinetyDays />
          {/* <ExactTestimonials /> */}
          <ExactFinalCta />
        </main>
        <div className="relative z-10">
          <Footer />
        </div>
      </div>
    </PageLoader>
  );
};

export default HoeHetWerktV2;