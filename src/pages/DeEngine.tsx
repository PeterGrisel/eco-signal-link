import { useEffect } from "react";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageLoader from "@/components/PageLoader";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Button } from "@/components/v2/Button";
import { Container } from "@/components/v2/Container";
import { Eyebrow } from "@/components/v2/Eyebrow";
import { Footer } from "@/components/v2/Footer";
import { Nav } from "@/components/v2/Nav";
import {
  Architectuur,
  Autonomie,
  Capabilities,
  DigitaleMedewerker,
  Formule,
  Kpis,
  Levering,
  Taxonomie,
} from "@/components/engine-v2/sections";

/**
 * De verdiepingspagina achter de homepage.
 *
 * Hier staat de technische en commerciële onderbouwing die op de homepage te
 * zwaar was voor een eerste bezoek: de tien opportunity-types, de zes lagen,
 * de capability-map, de guardrails, de KPI-set en de negen leveringsstappen.
 * De homepage linkt hierheen vanuit "Onder de motorkap" en de levering.
 */
const DeEngine = () => {
  usePageMeta({
    title: "De engine | GTM System of Intelligence | B2B Groeimachine",
    description:
      "De volledige onderbouwing: tien opportunity-types, zes architectuurlagen, de capability-map, guardrails, KPI's en de negen stappen waarin wij een commerciële opportunity-engine installeren.",
    canonical: "https://www.b2bgroeimachine.io/de-engine",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageLoader>
      <div className="min-h-screen bg-brand-ground">
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "https://www.b2bgroeimachine.io/" },
            { name: "De engine", url: "https://www.b2bgroeimachine.io/de-engine" },
          ]}
        />
        <Nav />
        <main>
          <header className="relative overflow-hidden border-b border-brand-line bg-brand-ground py-20 text-brand-ink md:py-28">
            <div aria-hidden className="v2-grid-bg pointer-events-none absolute inset-0" />
            <Container className="relative z-10">
              <Eyebrow>Technische toelichting</Eyebrow>
              <h1 className="max-w-[20ch] font-display text-[length:var(--v2-h1)] font-bold leading-[1.04] tracking-tight">
                Wat wij installeren: een GTM System of Intelligence.
              </h1>
              <p className="mt-6 max-w-[62ch] text-[17px] leading-relaxed text-brand-ink-2">
                Wij leveren geen losse tooling en geen losse campagne. Wij
                ontwerpen een commercieel proces, automatiseren de stappen,
                verbinden de benodigde systemen en voegen intelligence toe aan de
                beslismomenten. Het resultaat draait bovenop uw bestaande stack en
                handelt processtappen zelfstandig af, tot menselijke sales nodig is.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/#prijzen">Wat het kost</Button>
                <Button href="/#diensten" variant="outline">
                  De vier diensten
                </Button>
              </div>
            </Container>
          </header>

          <Taxonomie />
          <Architectuur />
          <DigitaleMedewerker />
          <Capabilities />
          <Autonomie />
          <Kpis />
          <Levering />
          <Formule />
        </main>
        <Footer />
      </div>
    </PageLoader>
  );
};

export default DeEngine;
