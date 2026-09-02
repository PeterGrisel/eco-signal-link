import { useEffect } from "react";
import { Link } from "react-router-dom";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageLoader from "@/components/PageLoader";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Container } from "@/components/v2/Container";
import { Eyebrow } from "@/components/v2/Eyebrow";
import { Footer } from "@/components/v2/Footer";
import { Nav } from "@/components/v2/Nav";
import { Reveal } from "@/components/v2/Reveal";
import { Section } from "@/components/v2/Section";
import { SectionHeader } from "@/components/v2/SectionHeader";
import { openBookingModal } from "@/components/booking/GlobalBookingModal";
import { sectors } from "@/data/sectors";
import { trackCTA } from "@/lib/tracking";

/**
 * Signalen per markt.
 *
 * Stond eerder als "Voor wie" op de homepage. Daar was het een raster met
 * branches; hier is er ruimte om uit te leggen wát een signaal is, welke
 * soorten er zijn en waarom dezelfde gebeurtenis per markt iets anders
 * betekent. De branchekaarten leiden door naar de sectorpagina's.
 *
 * De pagina staat bewust niet in de hoofdnavigatie — alleen in de footer en
 * via de branche-uitklap in het menu.
 */

/** De signaalsoorten waar de engine op let. */
const SOORTEN = [
  {
    kop: "Groei en verandering",
    body: "Een nieuwe vestiging, een overname, een investeringsronde of een reorganisatie. Er verandert iets in de organisatie, en dus ook in wat ze nodig hebben.",
  },
  {
    kop: "Vacatures",
    body: "Wie werft, bouwt iets op. Een vacature voor een productieleider betekent iets anders dan een vacature voor een controller — de functie verraadt de richting.",
  },
  {
    kop: "Gedrag op uw eigen kanalen",
    body: "Bezoeken aan uw website, profielbezoeken op LinkedIn, reacties op wat u plaatst. Los is het ruis; herhaald en van dezelfde organisatie is het een aanleiding.",
  },
  {
    kop: "Technologie en toeleveringsketen",
    body: "Welke systemen draaien er, wie zijn hun leveranciers en wie hun klanten. Daaruit volgt of u überhaupt past en waar u binnenkomt.",
  },
  {
    kop: "Relatie en geschiedenis",
    body: "Een oude offerte die nooit is opgevolgd, een contactpersoon die van baan wisselde, negen maanden stilte. Wat u al had telt mee.",
  },
  {
    kop: "Timing",
    body: "Hetzelfde signaal van vandaag weegt zwaarder dan dat van acht maanden geleden. Signalen ontstaan, stapelen, nemen in waarde af en vervallen.",
  },
];

const Signalen = () => {
  usePageMeta({
    title: "Signalen per markt | Welke aanleiding telt in uw branche | B2B Groeimachine",
    description:
      "Een vacature betekent iets anders in de maakindustrie dan bij een accountantskantoor. Welke koopsignalen er zijn, hoe ze samen een aanleiding vormen, en wat dat per branche betekent.",
    canonical: "https://www.b2bgroeimachine.io/signalen",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageLoader>
      <div className="min-h-screen bg-brand-paper">
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "https://www.b2bgroeimachine.io/" },
            { name: "Signalen", url: "https://www.b2bgroeimachine.io/signalen" },
          ]}
        />
        <Nav />
        <main>
          <header className="relative overflow-hidden bg-brand-deep py-20 text-white md:py-28">
            <div aria-hidden className="v2-grid-bg pointer-events-none absolute inset-0" />
            <Container className="relative z-10">
              <Eyebrow tone="deep">Signalen</Eyebrow>
              <h1 className="max-w-[20ch] font-display text-[length:var(--v2-h1)] font-black leading-[1.04] tracking-[-0.035em]">
                Elke markt heeft eigen signalen.
              </h1>
              <p className="mt-6 max-w-[62ch] text-[17px] leading-relaxed text-[#D6CEC3]">
                Een vacature betekent iets anders in de maakindustrie dan bij een
                accountantskantoor. Per branche werken wij met andere hypotheses,
                andere databronnen en andere beslissers.
              </p>
            </Container>
          </header>

          <Section>
            <SectionHeader
              eyebrow="Waar wij op letten"
              title={
                <>
                  Zes soorten signalen.
                  <br className="hidden sm:block" /> Los zeggen ze niets.
                </>
              }
              lead="Een signaal is een gebeurtenis die iets zegt over de kans dat een gesprek nú waardevol is. Eén ervan is toeval. Twee of drie die samenvallen zijn een aanleiding, en dat is wat uw verkoper nodig heeft om te weten waarom hij belt."
            />
            <ol className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {SOORTEN.map((s, i) => (
                <Reveal
                  key={s.kop}
                  index={i}
                  className={`border-t-[3px] pt-[22px] ${
                    i === 0 ? "border-brand-accent" : "border-brand-line"
                  }`}
                >
                  <li>
                    <span className="mb-2 block font-mono text-[10px] font-bold tracking-[0.16em] text-brand-ink-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="mb-2 font-display text-[19px] font-bold tracking-[-0.015em]">
                      {s.kop}
                    </h2>
                    <p className="text-[13.5px] leading-relaxed text-brand-ink-2">
                      {s.body}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </Section>

          <Section id="branches" tone="mist">
            <SectionHeader
              eyebrow="Per branche"
              title="Wat een signaal in uw markt betekent."
              lead="Per branche liggen de hypotheses, de bronnen en de beslissers anders. Hieronder de markten waarin wij de engine hebben gebouwd, met per markt de aanpak."
            />
            <div className="grid gap-px overflow-hidden rounded-brand border border-brand-line bg-brand-line sm:grid-cols-2 lg:grid-cols-3">
              {sectors.map((sector, i) => (
                <Reveal key={sector.slug} index={i} className="h-full bg-brand-paper">
                  <Link
                    to={`/sectoren/${sector.slug}`}
                    className="group flex h-full flex-col p-5 transition-colors duration-[180ms] hover:bg-brand-mist"
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <sector.icon className="size-4 shrink-0 text-brand-accent-ink" aria-hidden />
                      <h3 className="font-display text-[15px] font-bold tracking-[-0.01em]">
                        {sector.title}
                      </h3>
                    </div>
                    <p className="text-[12.5px] text-brand-ink-2">{sector.tagline}</p>
                    <span
                      aria-hidden
                      className="mt-auto pt-4 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-ink-3 transition-colors duration-[180ms] group-hover:text-brand-accent-ink"
                    >
                      Bekijk de aanpak →
                    </span>
                  </Link>
                </Reveal>
              ))}
              <Reveal index={sectors.length} className="h-full bg-brand-paper">
                <div className="flex h-full flex-col justify-center p-5">
                  <h3 className="font-display text-[15px] font-bold tracking-[-0.01em]">
                    Staat uw markt er niet bij?
                  </h3>
                  <p className="mt-2 text-[12.5px] text-brand-ink-2">
                    De engine is niet aan een branche gebonden. Wij bouwen de
                    hypothese op uw markt.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      trackCTA("signalen_gratis_scan", "signalen");
                      openBookingModal();
                    }}
                    className="mt-auto pt-4 text-left font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-accent-ink transition-colors duration-[180ms] hover:text-brand-accent"
                  >
                    Boek een gratis call →
                  </button>
                </div>
              </Reveal>
            </div>

            <Reveal className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-brand-line pt-8">
              <p className="max-w-[48ch] text-[14px] text-brand-ink-2">
                Wilt u zien hoe die signalen bij elkaar worden opgeteld tot één
                account met een reden?
              </p>
              <Link
                to="/werkomgeving"
                className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-accent-ink transition-colors duration-[180ms] hover:text-brand-accent"
              >
                Kijk mee in de werkomgeving <span aria-hidden>→</span>
              </Link>
            </Reveal>
          </Section>
        </main>
        <Footer />
      </div>
    </PageLoader>
  );
};

export default Signalen;
