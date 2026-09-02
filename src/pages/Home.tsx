import { useEffect, useMemo } from "react";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import JsonLd from "@/components/JsonLd";
import PageLoader from "@/components/PageLoader";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Footer } from "@/components/v2/Footer";
import { Marquee } from "@/components/v2/Marquee";
import { Nav } from "@/components/v2/Nav";
import { Hero } from "@/components/home-v2/Hero";
import { WerkomgevingSectie } from "@/components/werkomgeving/Sectie";
import {
  Contact,
  Alternatieven,
  HetProtocol,
  Diensten,
  HoeHetWerkt,
  Klantenraster,
  Prijzen,
  Vragen,
  WaaromEenEngine,
  WatOnsAndersMaakt,
  WieZitErachter,
} from "@/components/home-v2/sections";
import { FAQ_ITEMS } from "@/components/home-v2/faq";

const TITLE = "B2B Groeimachine | Van omzetdoel naar opportunity flow";
const DESCRIPTION =
  "Wij bouwen een commerciële opportunity-engine: een digitale medewerker die nieuwe kansen creëert, bewijs stapelt en uw verkopers stuurt naar het account dat nu telt.";

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
        <JsonLd id="home-faq-jsonld" data={faqSchema} />
        <Nav />
        <main>
          <Hero />
          <WerkomgevingSectie />
          <Marquee
            items={[
              "Opportunity-engine",
              "Outbound",
              "ABM",
              "RevOps",
              "Nurturing",
              "GTM as a Service",
            ]}
          />
          <WaaromEenEngine />
          <WatWijBouwen />
          <WatOnsAndersMaakt />
          <Alternatieven />
          <Diensten />
          <Klantenraster />
          <HoeHetWerkt />
          <HetProtocol />
          <Prijzen />
          <WieZitErachter />
          <Vragen />
          <Contact />
        </main>
        <Footer />
      </div>
    </PageLoader>
  );
};

export default Home;
