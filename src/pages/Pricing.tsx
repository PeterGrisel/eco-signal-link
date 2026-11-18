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
import { CONTEXT_VERGELIJKING, PUSH_PULL } from "@/data/breinAanpak";
import { Reveal } from "@/components/v2/Reveal";

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

          {/* Push of pull. */}
          <Section tone="mist" id="pull">
            <SectionHeader
              eyebrow="Sturen op een doel"
              title="Niet harder duwen. Gericht trekken."
              lead="Meer leads, meer berichten, meer belletjes: dat is duwen op een resultaat dat u pas achteraf ziet. Het brein werkt andersom. Het doel uit uw groeiplan trekt, en wij sturen op de variabelen die u daar brengen."
            />
            <Reveal>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-brand-ink-3">
                      <th className="border-b border-brand-line px-3 py-2.5 text-left" />
                      <th className="border-b border-brand-line px-3 py-2.5 text-left">Duwen</th>
                      <th className="border-b border-brand-line px-3 py-2.5 text-left text-brand-accent-ink">Trekken</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PUSH_PULL.map((r) => (
                      <tr key={r.kop} className="align-top">
                        <td className="border-b border-brand-line px-3 py-3 font-semibold">{r.kop}</td>
                        <td className="border-b border-brand-line px-3 py-3 text-brand-ink-3">{r.push}</td>
                        <td className="border-b border-brand-line px-3 py-3 font-medium">{r.pull}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </Section>

          {/* Waarom context het verschil maakt. */}
          <Section tone="deep" id="context">
            <SectionHeader
              deep
              eyebrow="Waarom een brein"
              title="AI zonder context snapt niet wat u doet."
              lead="Eén keer een leadlijst laten maken of een scraper laten bouwen voelt als vooruitgang. Maar zonder context kent de AI uw markt, uw klanten en uw verhaal niet, en morgen begint alles weer bij nul. Losse klussen tellen niet op. Een brein onthoudt, leert en bouwt verder."
            />
            <Reveal>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#8C8378]">
                      <th className="border-b border-white/[.12] px-3 py-2.5 text-left" />
                      <th className="border-b border-white/[.12] px-3 py-2.5 text-left">Losse AI-klus</th>
                      <th className="border-b border-white/[.12] px-3 py-2.5 text-left text-brand-accent">Brein met context</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CONTEXT_VERGELIJKING.map((r) => (
                      <tr key={r.kop} className="align-top">
                        <td className="border-b border-white/[.12] px-3 py-3 font-semibold">{r.kop}</td>
                        <td className="border-b border-white/[.12] px-3 py-3 text-[#8C8378]">{r.los}</td>
                        <td className="border-b border-white/[.12] px-3 py-3">{r.brein}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </Section>
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
