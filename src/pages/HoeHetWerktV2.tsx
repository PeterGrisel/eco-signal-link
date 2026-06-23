import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { usePageMeta } from "@/hooks/usePageMeta";
import ExactHero from "@/components/hhwv2/exact/ExactHero";
import ExactLogoWall from "@/components/hhwv2/exact/ExactLogoWall";
import ExactThreeWays from "@/components/hhwv2/exact/ExactThreeWays";
import ExactToolStack from "@/components/hhwv2/exact/ExactToolStack";
import ExactCaseStudies from "@/components/hhwv2/exact/ExactCaseStudies";
import ExactNinetyDays from "@/components/hhwv2/exact/ExactNinetyDays";
import ExactTestimonials from "@/components/hhwv2/exact/ExactTestimonials";
import ExactFinalCta from "@/components/hhwv2/exact/ExactFinalCta";

const HoeHetWerktV2 = () => {
  usePageMeta({
    title: "Tomorrow's Revenue Engine, vandaag gebouwd | B2BGroeiMachine",
    description:
      "Wij bouwen een B2B-groeimachine die signalen, content en outreach samenbrengt tot meetings, pipeline en schaalbare groei.",
    canonical: "https://www.b2bgroeimachine.io/hoe-het-werkt-v2",
  });

  return (
    <PageLoader>
      <div className="min-h-screen relative bg-background">
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "https://www.b2bgroeimachine.io/" },
            { name: "Hoe het werkt", url: "https://www.b2bgroeimachine.io/hoe-het-werkt-v2" },
          ]}
        />
        <Navbar />
        <main>
          <ExactHero />
          <ExactLogoWall />
          <ExactThreeWays />
          <ExactToolStack />
          <ExactCaseStudies />
          <ExactNinetyDays />
          <ExactTestimonials />
          <ExactFinalCta />
        </main>
        <Footer />
      </div>
    </PageLoader>
  );
};

export default HoeHetWerktV2;