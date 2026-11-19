import { useEffect, useMemo } from "react";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import JsonLd from "@/components/JsonLd";
import PageLoader from "@/components/PageLoader";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Footer } from "@/components/v2/Footer";
import { Nav } from "@/components/v2/Nav";
import { V4Afsluiter, V4Bewijs, V4Bouwen, V4Hero, V4Prijs, V4Start, V4Tekort, V4Vragen } from "@/components/home-v4/sections";
import { buildServicesSchema } from "@/data/schemaOrg";

const TITLE = "B2B Groeimachine | Process automation voor B2B: de engineers die u mist";
const DESCRIPTION =
  "Iedereen wil AI-automatisering, bijna niemand heeft de engineers. Wij wel: een digitale salesmedewerker voor uw hele commerciële proces. € 3.000 per maand, alles inbegrepen.";

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
        <Nav />
        <main>
          <V4Hero />
          <V4Tekort />
          <V4Bouwen />
          <V4Start />
          <V4Prijs />
          <V4Bewijs />
          <V4Vragen />
          <V4Afsluiter />
        </main>
        <Footer />
      </div>
    </PageLoader>
  );
};

export default Home;
