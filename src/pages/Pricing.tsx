import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PricingSection from "@/components/PricingSection";
import AmbientBackdrop from "@/components/homepage/AmbientBackdrop";
import { usePageMeta } from "@/hooks/usePageMeta";

const Pricing = () => {
  usePageMeta({
    title: "Pricing | B2BGroeiMachine",
    description:
      "Transparante prijzen voor de B2BGroeiMachine. Kies de fase die past bij jouw commerciële ambitie.",
    canonical: "https://www.b2bgroeimachine.io/pricing",
  });

  return (
    <PageLoader>
      <div className="min-h-screen relative">
        <AmbientBackdrop />
        <div className="relative z-10">
          <BreadcrumbJsonLd
            items={[
              { name: "Home", url: "https://www.b2bgroeimachine.io/" },
              { name: "Pricing", url: "https://www.b2bgroeimachine.io/pricing" },
            ]}
          />
          <Navbar />
          <main className="pt-24">
            <header className="mx-auto max-w-5xl px-5 pt-10 pb-2 text-center">
              <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight">
                Geen kleine lettertjes.
              </h1>
              <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Transparante prijzen. Kies de fase die past bij uw groei.
              </p>
            </header>
            <PricingSection showPerformancePartnership={false} />
          </main>
          <Footer />
        </div>
      </div>
    </PageLoader>
  );
};

export default Pricing;