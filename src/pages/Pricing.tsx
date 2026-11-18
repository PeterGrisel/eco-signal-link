import { useMemo } from "react";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import JsonLd from "@/components/JsonLd";
import PageLoader from "@/components/PageLoader";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Footer } from "@/components/v2/Footer";
import { Nav } from "@/components/v2/Nav";
import { Section } from "@/components/v2/Section";
import { SectionHeader } from "@/components/v2/SectionHeader";
import { KlantCases } from "@/components/cases/KlantCases";
import { Vragen } from "@/components/home-v2/sections";
import {
  DmAfsluiter,
  DmFasering,
  DmInvestering,
  DmVergelijking,
  DmWieDoetWat,
} from "@/components/home-v3/sections";
import { MAANDPRIJS } from "@/data/digitaleMedewerker";

const URL = "https://www.b2bgroeimachine.io/pricing";

/**
 * De prijspagina: één vast bedrag per maand, alles inbegrepen.
 * Bedrag en opbouw komen uit `src/data/digitaleMedewerker.ts`.
 */
const Pricing = () => {
  usePageMeta({
    title: "Prijzen | B2B Groeimachine",
    description:
      "Uw digitale salesmedewerker voor € 3.000 per maand, alles inbegrepen: werk, licenties en advies. De basis staat in 90 dagen, daarna maandelijks opzegbaar.",
    canonical: URL,
  });

  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Offer",
      name: "Digitale salesmedewerker",
      price: MAANDPRIJS,
      priceCurrency: "EUR",
      description:
        "Eén vast bedrag per maand, alles inbegrepen: werk, licenties en advies. De basis staat in 90 dagen, daarna maandelijks opzegbaar.",
    }),
    [],
  );

  return (
    <PageLoader>
      <div className="min-h-screen bg-brand-paper">
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "https://www.b2bgroeimachine.io/" },
            { name: "Prijzen", url: URL },
          ]}
        />
        <JsonLd id="pricing-offers-jsonld" data={schema} />
        <Nav />
        <main>
          <Section tone="deep">
            <SectionHeader
              deep
              titleAs="h1"
              eyebrow="Prijzen"
              title="€ 3.000 per maand. Alles inbegrepen."
              lead="Het werk, de licenties en doorlopend advies, in één vast bedrag. De basis staat in 90 dagen. Daarna is het maandelijks opzegbaar en is alles overdraagbaar."
            />
          </Section>
          <DmInvestering />
          <DmFasering />
          <DmVergelijking />
          <DmWieDoetWat />
          <KlantCases title="Wat het brein bij klanten doet." />
          <Vragen />
          <DmAfsluiter />
        </main>
        <Footer />
      </div>
    </PageLoader>
  );
};

export default Pricing;
