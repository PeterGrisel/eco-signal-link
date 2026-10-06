import { useMemo } from "react";
import { Link } from "react-router-dom";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import JsonLd from "@/components/JsonLd";
import PageLoader from "@/components/PageLoader";
import TalkCard from "@/components/TalkCard";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Container } from "@/components/v2/Container";
import { Footer } from "@/components/v2/Footer";
import { Nav } from "@/components/v2/Nav";
import { Reveal } from "@/components/v2/Reveal";
import { Section } from "@/components/v2/Section";
import { SectionHeader } from "@/components/v2/SectionHeader";
import { MenuKaarten } from "@/components/prijzen/MenuKaarten";
import { RoiRekenhulp } from "@/components/prijzen/RoiRekenhulp";
import {
  BASISTEAM,
  FUNCTIES,
  HUISREGELS,
  LOSSE_POSTEN,
  MENUS,
  ROI_DELER,
  UURKOSTEN,
  euro,
  prijsVan,
  reken,
} from "@/data/breinPrijzen";
import { vindBreinDienst } from "@/data/breinDiensten";

const URL = "https://www.b2bgroeimachine.io/pricing";

/**
 * De prijspagina: waarom het brein kost wat het kost.
 *
 * Eerst de redenering (bespaarde uren × uurkosten, daarvan een derde), dan
 * de prijs per functie, de menu's, de rekenhulp en wat er los bij kan. Alle
 * bedragen komen uit `src/data/breinPrijzen.ts`.
 */
const Pricing = () => {
  usePageMeta({
    title: "Prijzen | B2B Groeimachine",
    description:
      "U betaalt een derde van wat het commerciële brein uw team aan uren bespaart. All-in: onze uren, de tools en het beheer. Bekijk de menu's en reken het uit voor uw team.",
    canonical: URL,
  });

  const totaal = reken(FUNCTIES.map((f) => f.id));

  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "OfferCatalog",
      name: "Menu's van het commerciële brein",
      itemListElement: MENUS.map((m) => ({
        "@type": "Offer",
        name: m.naam,
        price: reken(m.ids).prijs,
        priceCurrency: "EUR",
        description: m.inhoud.join(". "),
      })),
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
          {/* Hero: de redenering in één zin, met de formule eronder. */}
          <header className="bg-brand-deep text-white">
            <Container className="py-16 lg:py-24">
              <div className="v2-enter max-w-[46rem]">
                <p className="mb-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent">
                  [ Prijzen ]
                </p>
                <h1 className="mb-[22px] font-display text-[length:var(--v2-h1)] font-black leading-[1.02] tracking-[-0.035em]">
                  U betaalt een derde van wat het brein{" "}
                  <span className="text-brand-accent">bespaart.</span>
                </h1>
                <p className="max-w-[56ch] text-[16.5px] leading-relaxed text-[#D6CEC3]">
                  Elke functie van het brein neemt werk over. Wij tellen de uren die uw team niet meer hoeft te
                  maken, rekenen ze om naar wat die uren u kosten, en vragen daar een derde van. Onze uren, de tools
                  en het beheer zitten erin.
                </p>
              </div>

              <div className="mt-12 flex flex-wrap items-stretch gap-2.5">
                {[
                  ["Bespaarde uren", "per functie", "Werk dat uw team niet meer doet"],
                  ["×", "", ""],
                  ["Uurkosten", euro(UURKOSTEN), "Integraal, per medewerker"],
                  ["=", "", ""],
                  ["Waarde", "per maand", "Tijd die vrijkomt voor verkopen"],
                  [`÷ ${ROI_DELER}`, "", ""],
                  ["Uw prijs", `ROI ${ROI_DELER}×`, "Op tijd alleen, omzet komt erbij"],
                ].map(([kop, waarde, uitleg], i) =>
                  waarde ? (
                    <div
                      key={i}
                      className={`min-w-0 flex-[1_1_150px] rounded-brand border p-4 ${
                        i === 6 ? "border-brand-accent bg-brand-accent/10" : "border-white/[.14]"
                      }`}
                    >
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">{kop}</p>
                      <p className="mt-1 font-mono text-xl font-bold">{waarde}</p>
                      <p className="mt-1 text-[12.5px] text-[#A99F93]">{uitleg}</p>
                    </div>
                  ) : (
                    <span key={i} aria-hidden className="hidden self-center font-mono text-xl text-[#8C8378] md:block">
                      {kop}
                    </span>
                  ),
                )}
              </div>
            </Container>
          </header>

          {/* De menu's. */}
          <Section tone="mist" id="menus">
            <SectionHeader
              eyebrow="De menu's"
              title="Drie menu's, alles erin."
              lead="Elk menu is een set functies van het brein. 90 dagen pilot, daarna maandelijks opzegbaar."
            />
            <MenuKaarten />
          </Section>

          {/* Prijs per functie. */}
          <Section tone="paper" id="functies">
            <SectionHeader
              eyebrow="Per functie"
              title="Wat elke functie bespaart en kost."
              lead={`Voorzichtige schatting voor een commercieel team van 3 tot 5 mensen, bij ${euro(UURKOSTEN)} per uur. In de intake meten we het per klant na.`}
            />
            <Reveal>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                  <thead>
                    <tr className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-brand-ink-3">
                      <th className="border-b border-brand-line px-3 py-2.5 text-left">Functie</th>
                      <th className="border-b border-brand-line px-3 py-2.5 text-left">Wat uw team niet meer doet</th>
                      <th className="border-b border-brand-line px-3 py-2.5 text-right">Uur p/m</th>
                      <th className="border-b border-brand-line px-3 py-2.5 text-right">Waarde</th>
                      <th className="border-b border-brand-line px-3 py-2.5 text-right">Prijs p/m</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FUNCTIES.map((f) => (
                      <tr key={f.id} className="align-top">
                        <td className="border-b border-brand-line px-3 py-2.5 font-semibold">
                          <Link to={`/diensten/${f.dienst}`} className="hover:text-brand-accent-ink">
                            {f.naam}
                          </Link>
                          <span className="block text-[12px] font-normal text-brand-ink-3">
                            {vindBreinDienst(f.dienst)?.naam}
                          </span>
                        </td>
                        <td className="border-b border-brand-line px-3 py-2.5 text-brand-ink-2">{f.wat}</td>
                        <td className="border-b border-brand-line px-3 py-2.5 text-right font-mono tabular-nums">{f.uren}</td>
                        <td className="border-b border-brand-line px-3 py-2.5 text-right font-mono tabular-nums">
                          {euro(f.uren * UURKOSTEN)}
                        </td>
                        <td className="border-b border-brand-line px-3 py-2.5 text-right font-mono font-bold tabular-nums">
                          {euro(prijsVan(f))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold">
                      <td className="border-t-2 border-brand-ink px-3 py-2.5" colSpan={2}>
                        Het hele brein
                      </td>
                      <td className="border-t-2 border-brand-ink px-3 py-2.5 text-right font-mono tabular-nums">
                        {totaal.uren}
                      </td>
                      <td className="border-t-2 border-brand-ink px-3 py-2.5 text-right font-mono tabular-nums">
                        {euro(totaal.waarde)}
                      </td>
                      <td className="border-t-2 border-brand-ink px-3 py-2.5 text-right font-mono tabular-nums">
                        {euro(totaal.prijs)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Reveal>
          </Section>

          {/* Rekenhulp. */}
          <Section tone="mist" id="rekenhulp">
            <SectionHeader
              eyebrow="Rekenhulp"
              title="Reken het uit voor uw team."
              lead={`Kies de functies, uw uurkosten en het aantal commerciële medewerkers. De uren schalen mee vanaf een team van ${BASISTEAM}.`}
            />
            <Reveal>
              <RoiRekenhulp />
            </Reveal>
          </Section>

          {/* Losse posten en huisregels. */}
          <Section tone="paper" id="los">
            <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <SectionHeader eyebrow="Los erbij" title="Training en losse posten." />
                <ul className="border-t border-brand-line">
                  {LOSSE_POSTEN.map((p) => (
                    <li
                      key={p.naam}
                      className="flex flex-col gap-1 border-b border-brand-line py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                    >
                      <span>
                        <span className="block font-display font-bold tracking-[-0.01em]">{p.naam}</span>
                        <span className="block text-[13px] text-brand-ink-2">{p.uitleg}</span>
                      </span>
                      <span className="shrink-0 font-mono text-sm font-bold">{p.prijs}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <SectionHeader eyebrow="Huisregels" title="Geen kleine lettertjes." />
                <ul className="grid gap-3">
                  {HUISREGELS.map((r) => (
                    <li key={r.kop} className="rounded-brand bg-brand-mist p-4 text-[14px] text-brand-ink-2">
                      <b className="font-semibold text-brand-ink">{r.kop}</b> {r.tekst}
                    </li>
                  ))}
                  <li className="rounded-brand bg-brand-mist p-4 text-[14px] text-brand-ink-2">
                    <b className="font-semibold text-brand-ink">Al omzet, maar geen systeem?</b> Vraag naar het{" "}
                    <Link to="/performance-partnership" className="underline underline-offset-2">
                      performance partnership
                    </Link>
                    : lage techkosten en een gedeelde upside.
                  </li>
                </ul>
              </div>
            </div>
          </Section>

          {/* Onderbouwing. */}
          <Section tone="mist" id="onderbouwing">
            <SectionHeader
              eyebrow="Onderbouwing"
              title="Waar de getallen vandaan komen."
            />
            <div className="grid gap-[18px] md:grid-cols-3">
              {[
                {
                  kop: `Uurkosten ${euro(UURKOSTEN)}`,
                  tekst:
                    "Bruto € 4.000 per maand, plus vakantiegeld en ongeveer 37% werkgeverslasten, is circa € 71.000 per jaar. Over 1.400 productieve uren is dat € 50, plus werkplek en licenties.",
                },
                {
                  kop: "Waar de uren zitten",
                  tekst:
                    "Verkopers besteden maar 28 tot 40% van hun tijd aan verkopen. Handmatige data-invoer kost velen tot twee uur per dag. Onze schattingen gaan uit van een fractie daarvan.",
                },
                {
                  kop: "De markt",
                  tekst:
                    "Leadgeneratie-bureaus vragen € 1.500 tot 5.000 per maand, vaak met € 1.000 tot 3.000 opstartkosten. Wij vallen daarbinnen, zonder opstartkosten en met meer functies.",
                },
              ].map((b, i) => (
                <Reveal key={b.kop} index={i} className="h-full">
                  <article className="flex h-full flex-col rounded-brand border border-brand-line bg-brand-paper p-6">
                    <h3 className="mb-2 font-display text-lg font-bold tracking-[-0.015em]">{b.kop}</h3>
                    <p className="text-[13.5px] text-brand-ink-2">{b.tekst}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </Section>

          {/* Afsluiter. */}
          <section className="bg-brand-deep py-14 text-white lg:py-[82px]">
            <Container className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-[36rem]">
                <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent">
                  [ Uw uren, ons brein ]
                </p>
                <h2 className="font-display text-[length:var(--v2-h2)] font-extrabold leading-[1.08] tracking-[-0.03em]">
                  Wij rekenen het samen met u na.
                </h2>
              </div>
              <TalkCard location="Pricing afsluiter" />
            </Container>
          </section>
        </main>
        <Footer />
      </div>
    </PageLoader>
  );
};

export default Pricing;
