import { KlantCases } from "@/components/cases/KlantCases";
import { useEffect, useMemo } from "react";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import JsonLd from "@/components/JsonLd";
import PageLoader from "@/components/PageLoader";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Footer } from "@/components/v2/Footer";
import { Nav } from "@/components/v2/Nav";
import { Klantenraster, Vragen } from "@/components/home-v2/sections";
import {
  DmAfsluiter,
  DmBrein,
  DmFasering,
  DmHero,
  DmInvestering,
  DmKern,
  DmProces,
  DmProcessen,
  DmSignalen,
  DmVergelijking,
  DmWatIsHet,
  DmWieDoetWat,
  DmWieWijZijn,
} from "@/components/home-v3/sections";
import { FAQ_ITEMS } from "@/components/home-v2/faq";
import { buildServicesSchema } from "@/data/schemaOrg";

const TITLE = "B2B Groeimachine | Uw digitale salesmedewerker met een AI-brein";
const DESCRIPTION =
  "Wij zijn uw process automation team. Een digitale salesmedewerker met een AI-brein draait uw commerciële proces, van markt tot vaste klant. € 3.000 per maand, alles inbegrepen.";

/**
 * De homepage van b2bgroeimachine.io.
 *
 * Bouwstijl naar het model van vidai-fctry: secties als volle kleurbanen met
 * een vaste kop (label, H2, lead), gestaffelde scroll-reveals, een doorlopende
 * accentband en twee omgekeerde contrastsecties. Uitgevoerd in de huisstijl uit
 * het brandbook. De inhoud volgt de explainer "Commerciële opportunity-engine"
 * en de technische toelichting "GTM System of Intelligence".
 */
const Home = () => {
  usePageMeta({
    title: TITLE,
    description: DESCRIPTION,
    canonical: "https://www.b2bgroeimachine.io/",
  });

  const servicesSchema = useMemo(() => buildServicesSchema(), []);

  const faqSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    }),
    [],
  );

  // Anker uit de URL pas volgen nadat de routeovergang is uitgespeeld.
  useEffect(() => {
    if (!window.location.hash || window.location.hash === "#") return;
    const id = window.location.hash.slice(1);
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  // Ankerlinks binnen de pagina soepel laten scrollen, ook vanuit de navigatie.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      const id = href.slice(href.indexOf("#") + 1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <PageLoader>
      <div className="min-h-screen bg-brand-paper">
        <BreadcrumbJsonLd items={[{ name: "Home", url: "https://www.b2bgroeimachine.io/" }]} />
        <JsonLd id="home-services-jsonld" data={servicesSchema} />
        <JsonLd id="home-faq-jsonld" data={faqSchema} />
        <Nav />
        <main>
          <DmHero />
          <Klantenraster />
          <DmKern />
          <DmProces />
          <DmWatIsHet />
          <DmBrein />
          <DmProcessen />
          <DmSignalen />
          <DmWieDoetWat />
          <DmVergelijking />
          <KlantCases />
          <DmWieWijZijn />
          <DmFasering />
          <DmInvestering />
          <Vragen />
          <DmAfsluiter />
        </main>
        <Footer />
      </div>
    </PageLoader>
  );
};

export default Home;
