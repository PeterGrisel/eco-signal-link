import { useEffect } from "react";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageLoader from "@/components/PageLoader";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Button } from "@/components/v2/Button";
import { Container } from "@/components/v2/Container";
import { Eyebrow } from "@/components/v2/Eyebrow";
import { Footer } from "@/components/v2/Footer";
import { Nav } from "@/components/v2/Nav";
import { Reveal } from "@/components/v2/Reveal";
import { Section } from "@/components/v2/Section";
import { SectionHeader } from "@/components/v2/SectionHeader";
import { Film } from "@/components/werkomgeving/Film";
import { Toolflow } from "@/components/werkomgeving/Toolflow";

/**
 * De werkomgeving, uitgelegd.
 *
 * Wat een opportunity-engine dóét, laat zich slecht in alinea's vangen en goed
 * in twintig seconden kijken. Deze pagina zet die twintig seconden bovenaan en
 * schrijft er daarna uit wat er in elke stap gebeurt — voor de lezer die het
 * na wil lezen, en voor de zoekmachine die alleen tekst leest.
 *
 * Onderaan staat de toolflow met een doorverwijzing naar de groeistack.
 */

/** De zes stappen uit de film, uitgeschreven. */
const STAPPEN = [
  {
    kop: "U stelt de vraag",
    body: "Geen filter aanklikken en geen query schrijven. U vraagt in gewone taal welke bedrijven deze week een aanleiding laten zien, en de omgeving weet welke bronnen ze daarvoor moet aanspreken.",
  },
  {
    kop: "De bronnen slaan aan",
    body: "Uw accountlijst, de bezoekers van uw website, de reacties op LinkedIn, de open deals in uw CRM en de nieuws- en vacaturesignalen worden in één beweging opgehaald. Elke bron is een koppeling die wij inrichten en beheren.",
  },
  {
    kop: "De signalen worden gewogen",
    body: "Een los signaal zegt weinig. De omgeving telt fit, aanleiding, timing en relatie bij elkaar op en geeft elk account een score, met de reden erbij.",
  },
  {
    kop: "Het landt in uw CRM",
    body: "De accounts komen in het systeem waarin uw verkoper al werkt, met de aanleiding, een aanbevolen actie en een eigenaar. Geen apart schermpje dat niemand opent.",
  },
  {
    kop: "U vraagt door",
    body: "Waarom staat dit account bovenaan? De omgeving laat de signalen zien die samenvielen. Wie die redenering kan volgen, kan hem ook corrigeren.",
  },
  {
    kop: "U meet wat het opleverde",
    body: "Hoeveel opportunities er ontstonden, hoeveel er naar sales gingen, hoeveel sales er accepteerde en hoeveel gesprekken eruit kwamen. Elke uitkomst gaat terug het systeem in.",
  },
];

const Werkomgeving = () => {
  usePageMeta({
    title: "De werkomgeving | Uw sales-engine van binnen | B2B Groeimachine",
    description:
      "Kijk mee in de werkomgeving die wij voor u inrichten: u stelt een vraag in gewone taal, uw bronnen en CRM worden aangesproken, signalen worden gewogen en er komen accounts uit met een reden en een aanbevolen actie.",
    canonical: "https://www.b2bgroeimachine.io/werkomgeving",
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
            {
              name: "De werkomgeving",
              url: "https://www.b2bgroeimachine.io/werkomgeving",
            },
          ]}
        />
        <Nav />
        <main>
          <header className="relative overflow-hidden bg-brand-deep pt-20 text-white md:pt-28">
            <div aria-hidden className="v2-grid-bg pointer-events-none absolute inset-0" />
            <Container className="relative z-10">
              <Eyebrow tone="deep">Zo ziet het eruit</Eyebrow>
              <h1 className="max-w-[20ch] font-display text-[length:var(--v2-h1)] font-black leading-[1.04] tracking-[-0.035em]">
                U kijkt mee in de motorkap.
              </h1>
              <p className="mt-6 max-w-[62ch] text-[17px] leading-relaxed text-[#D6CEC3]">
                Wij richten voor u een werkomgeving in waarin uw bronnen, uw CRM
                en het redeneren bij elkaar komen. U stelt er een vraag in gewone
                taal; er komen accounts uit met een reden en een aanbevolen
                actie. Hieronder ziet u diezelfde omgeving, nagespeeld met
                voorbeelddata.
              </p>
            </Container>
          </header>

          <Section id="werkomgeving" tone="deep">
            <Film />
          </Section>

          <Section>
            <SectionHeader
              eyebrow="Wat u ziet gebeuren"
              title={
                <>
                  Zes stappen, van vraag
                  <br className="hidden sm:block" /> tot afspraak.
                </>
              }
              lead="Dezelfde zes stappen als in het filmpje, voor wie ze liever naleest. Ze draaien niet één keer maar doorlopend: elke week opnieuw, met wat de vorige week heeft geleerd."
            />
            <ol className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {STAPPEN.map((s, i) => (
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

          <Section tone="mist">
            <SectionHeader
              eyebrow="Waarmee het gebouwd is"
              title={
                <>
                  Zes schakels, van signaal
                  <br className="hidden sm:block" /> tot dashboard.
                </>
              }
              lead="Wij doen niet geheimzinnig over de stack. Iedereen kan dezelfde software kopen; het verschil zit in de orchestratie ertussen en in de laag die bepaalt wat er met een signaal gebeurt. Wij blijven vendor-neutraal en u houdt eigenaarschap over uw data en systemen."
            />
            <Toolflow />
          </Section>

          <Section tone="deep">
            <Reveal className="flex flex-col items-start gap-7 md:flex-row md:items-end md:justify-between">
              <div>
                <Eyebrow tone="deep">De volgende stap</Eyebrow>
                <h2 className="max-w-[22ch] font-display text-[length:var(--v2-h2)] font-extrabold leading-[1.08] tracking-[-0.03em]">
                  Benieuwd hoe dit er met uw data uitziet?
                </h2>
                <p className="mt-4 max-w-[56ch] text-[15.5px] text-[#CBC3B8]">
                  In een half uur lopen wij uw markt, uw bronnen en uw CRM langs
                  en laten wij zien welke signalen er bij u al liggen.
                </p>
              </div>
              <span className="shrink-0">
                <Button href="/contact" variant="invert">
                  Boek een gratis call
                </Button>
              </span>
            </Reveal>
          </Section>
        </main>
        <Footer />
      </div>
    </PageLoader>
  );
};

export default Werkomgeving;
