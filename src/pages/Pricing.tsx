import { useMemo } from "react";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import JsonLd from "@/components/JsonLd";
import PageLoader from "@/components/PageLoader";
import TalkCard from "@/components/TalkCard";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Button } from "@/components/v2/Button";
import { Container } from "@/components/v2/Container";
import { Footer } from "@/components/v2/Footer";
import { Nav } from "@/components/v2/Nav";
import { Reveal } from "@/components/v2/Reveal";
import { Section } from "@/components/v2/Section";
import { SectionHeader } from "@/components/v2/SectionHeader";
import { MenuKaarten } from "@/components/prijzen/MenuKaarten";
import { HUISREGELS, LOSSE_POSTEN, MENUS, menuPrijs } from "@/data/breinPrijzen";
import { CONTEXT_VERGELIJKING, CYCLUS, PUSH_PULL } from "@/data/breinAanpak";

const URL = "https://www.b2bgroeimachine.io/pricing";

/**
 * De prijspagina: hoe we werken en waarom één vaste prijs klopt.
 *
 * Het groeiplan zet het doel (pull). Het brein standaardiseert, test en stuurt
 * bij. Eén vaste prijs, alles erin. Alle bedragen komen uit
 * `src/data/breinPrijzen.ts`.
 */
const Pricing = () => {
  usePageMeta({
    title: "Prijzen | B2B Groeimachine",
    description:
      "Eén vaste prijs, alles erin. We starten bij uw groeiplan. Het brein helpt uw commercie te standaardiseren, te testen en makkelijk bij te sturen.",
    canonical: URL,
  });

  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "OfferCatalog",
      name: "Abonnementen van het commerciële brein",
      itemListElement: MENUS.map((m) => ({
        "@type": "Offer",
        name: m.naam,
        price: menuPrijs(m),
        priceCurrency: "EUR",
        description: `${m.voorWie} ${m.opbouw ? `${m.opbouw} ` : ""}${m.kern} ${m.wat}`,
      })),
    }),
    [],
  );

  const training = LOSSE_POSTEN.filter((p) => p.naam.startsWith("Training"));

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
          {/* Hero: de belofte en de cyclus die elk proces doorloopt. */}
          <header className="bg-brand-deep text-white">
            <Container className="py-16 lg:py-24">
              <div className="v2-enter max-w-[46rem]">
                <p className="mb-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent">
                  [ Prijzen ]
                </p>
                <h1 className="mb-[22px] font-display text-[length:var(--v2-h1)] font-black leading-[1.02] tracking-[-0.035em]">
                  Eén vaste prijs. <span className="text-brand-accent">Alles erin.</span>
                </h1>
                <p className="max-w-[56ch] text-[16.5px] leading-relaxed text-[#D6CEC3]">
                  We beginnen bij uw groeiplan: waar wilt u naartoe? Het brein helpt uw commercie te
                  standaardiseren, te testen en makkelijk bij te sturen, richting dat doel.
                </p>
              </div>

              <ol className="mt-12 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                {CYCLUS.map((c, i) => (
                  <li
                    key={c.stap}
                    className={`min-w-0 rounded-brand border p-4 ${
                      i === CYCLUS.length - 1 ? "border-brand-accent bg-brand-accent/10" : "border-white/[.14]"
                    }`}
                  >
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-1 font-display text-lg font-bold">{c.stap}</p>
                    <p className="mt-1 text-[12.5px] text-[#A99F93]">{c.uitleg}</p>
                  </li>
                ))}
              </ol>
            </Container>
          </header>

          {/* De abonnementen. */}
          <Section tone="mist" id="abonnementen">
            <SectionHeader
              eyebrow="Abonnementen"
              title="Drie abonnementen."
              lead="Elk abonnement start bij het groeiplan. 90 dagen pilot, daarna maandelijks opzegbaar."
            />
            <MenuKaarten />
          </Section>

          {/* Push of pull. */}
          <Section tone="paper" id="pull">
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

          {/* Adoptie en huisregels. */}
          <Section tone="paper" id="huisregels">
            <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <SectionHeader
                  eyebrow="Adoptie"
                  title="Een brein werkt pas als uw team ermee werkt."
                />
                <div className="rounded-brand border border-brand-accent bg-brand-tint p-6">
                  <h3 className="mb-2 font-display text-lg font-bold tracking-[-0.015em]">
                    Adoptie zit altijd in Brein Groei
                  </h3>
                  <p className="text-[14px] text-brand-ink-2">
                    Een brein werkt pas als uw team ermee werkt. Daarom zit een trainingsdag AI-geletterdheid en
                    adoptie op locatie altijd in Brein Groei, t.w.v. € 2.450. Wilt u meer trainen, dan kan dat los:
                  </p>
                  <ul className="mt-3 space-y-1.5 text-[13.5px]">
                    {training.map((t) => (
                      <li key={t.naam} className="flex flex-wrap justify-between gap-x-4">
                        <span className="text-brand-ink-2">{t.naam}</span>
                        <span className="font-mono font-bold">{t.prijs}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <SectionHeader eyebrow="Huisregels" title="Geen kleine lettertjes." />
                <ul className="grid gap-3">
                  {HUISREGELS.map((r) => (
                    <li key={r.kop} className="rounded-brand bg-brand-mist p-4 text-[14px] text-brand-ink-2">
                      <b className="font-semibold text-brand-ink">{r.kop}</b> {r.tekst}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          {/* Afsluiter. */}
          <section className="bg-brand-deep py-14 text-white lg:py-[82px]">
            <Container className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-[36rem]">
                <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent">
                  [ Begin bij het doel ]
                </p>
                <h2 className="font-display text-[length:var(--v2-h2)] font-extrabold leading-[1.08] tracking-[-0.03em]">
                  Elk traject start met uw groeiplan.
                </h2>
                <div className="mt-6">
                  <Button href="/groeiplan" variant="invert">
                    Bekijk het groeiplan
                  </Button>
                </div>
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
