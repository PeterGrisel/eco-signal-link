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
    title: "Tomorrow's Revenue Engine, vandaag gebouwd | B2BGroeiMachine",
    description:
      "Wij bouwen een B2B-groeimachine die signalen, content en outreach samenbrengt tot meetings, pipeline en schaalbare groei.",
    canonical: "https://www.b2bgroeimachine.io/hoe-het-werkt-v2",
  });

  return (
    <PageLoader>
      <div className="min-h-screen relative bg-background overflow-x-hidden">
        {/* Homepage ambient backdrop */}
        <AmbientBackdrop />
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "https://www.b2bgroeimachine.io/" },
            { name: "Hoe het werkt", url: "https://www.b2bgroeimachine.io/hoe-het-werkt-v2" },
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
        <Footer />
      </div>
    </PageLoader>
  );
};

export default HoeHetWerktV2;