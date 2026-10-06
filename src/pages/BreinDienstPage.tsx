import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import JsonLd from "@/components/JsonLd";
import PageLoader from "@/components/PageLoader";
import TalkCard from "@/components/TalkCard";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Container } from "@/components/v2/Container";
import { Faq } from "@/components/v2/Faq";
import { Footer } from "@/components/v2/Footer";
import { Nav } from "@/components/v2/Nav";
import { Reveal } from "@/components/v2/Reveal";
import { Section } from "@/components/v2/Section";
import { SectionHeader } from "@/components/v2/SectionHeader";
import { SplitHeadline, splitHeadlineText } from "@/components/v2/SplitHeadline";
import { BREIN_DIENSTEN, vindBreinDienst } from "@/data/breinDiensten";

const BASIS = "https://www.b2bgroeimachine.io";

/**
 * Dienstpagina rond één functie van het commerciële brein.
 *
 * Zelfde bouwstijl als de homepage: volle kleurbanen, een vaste sectiekop en
 * gestaffelde reveals. De inhoud komt uit `src/data/breinDiensten.ts`, zodat
 * menu, footer en pagina's niet uit elkaar kunnen lopen.
 */
const BreinDienstPage = () => {
  const { slug } = useParams();
  const dienst = vindBreinDienst(slug);
  const url = `${BASIS}/diensten/${slug}`;

  usePageMeta({
    title: dienst?.meta.title ?? "Diensten | B2B Groeimachine",
    description: dienst?.meta.description ?? "",
    canonical: url,
  });

  const schema = useMemo(
    () =>
      dienst && [
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: dienst.naam,
          description: dienst.meta.description,
          url,
          provider: { "@type": "Organization", name: "B2B Groeimachine", url: BASIS },
          areaServed: "NL",
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: dienst.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        },
      ],
    [dienst, url],
  );

  if (!dienst) return <Navigate to="/#functies" replace />;

  const overige = BREIN_DIENSTEN.filter((d) => d.slug !== dienst.slug);

  return (
    <PageLoader>
      <div className="min-h-screen bg-brand-paper">
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: `${BASIS}/` },
            { name: dienst.naam, url },
          ]}
        />
        <JsonLd id="dienst-jsonld" data={schema || []} />
        <Nav />
        <main>
          {/* Hero: de functie van het brein, met direct de weg naar Peter. */}
          <header className="relative overflow-hidden bg-brand-deep text-white">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-40 top-1/2 h-[640px] w-[640px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,148,90,0.28),transparent_65%)]"
            />
            <Container className="relative flex min-h-[85svh] flex-col justify-center py-16 lg:min-h-[calc(100svh-63px)]">
              <div className="v2-enter max-w-[42rem]">
                <p className="mb-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent">
                  [ {dienst.hero.eyebrow} ]
                </p>
                <h1
                  aria-label={splitHeadlineText(dienst.hero.kop)}
                  className="mb-[22px] font-display text-[length:var(--v2-h1)] font-black leading-[1.02] tracking-[-0.035em]"
                >
                  <SplitHeadline lines={dienst.hero.kop} accentClass="text-brand-accent" />
                </h1>
                <p className="mb-7 max-w-[52ch] text-[16.5px] leading-relaxed text-[#D6CEC3]">
                  {dienst.hero.lead}
                </p>
                <TalkCard location={`Dienst ${dienst.naam} hero`} />
                <div className="mt-4 flex justify-start">
                  <a
                    href="/#functies"
                    className="font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-brand-accent transition-colors duration-[180ms] hover:text-white"
                  >
                    Alle functies van het brein →
                  </a>
                </div>
              </div>
            </Container>
          </header>

          {/* Het probleem dat deze functie oplost. */}
          <Section tone="paper">
            <SectionHeader eyebrow="Het probleem" title={dienst.probleem.titel} lead={dienst.probleem.lead} />
            <div className="grid gap-[18px] md:grid-cols-3">
              {dienst.probleem.punten.map((punt, i) => (
                <Reveal key={punt.naam} index={i} className="h-full">
                  <article className="flex h-full flex-col rounded-brand border border-brand-line bg-brand-paper p-6">
                    <span aria-hidden className="mb-5 h-[3px] w-8 bg-brand-ink" />
                    <h3 className="mb-2 font-display text-lg font-bold leading-snug tracking-[-0.015em]">
                      {punt.naam}
                    </h3>
                    <p className="text-[13.5px] text-brand-ink-2">{punt.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </Section>

          {/* Wat het brein overneemt. */}
          <Section tone="mist" className="v2-gordijn">
            <SectionHeader eyebrow="Wat het brein doet" title={dienst.overname.titel} lead={dienst.overname.lead} />
            <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
              {dienst.overname.taken.map((taak, i) => (
                <Reveal key={taak.naam} index={i} className="h-full">
                  <article className="flex h-full flex-col rounded-brand border border-brand-line bg-brand-paper p-6">
                    <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mb-2 font-display text-lg font-bold leading-snug tracking-[-0.015em]">
                      {taak.naam}
                    </h3>
                    <p className="text-[13.5px] text-brand-ink-2">{taak.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </Section>

          {/* Zo werkt het: vier stappen. */}
          <Section tone="paper">
            <SectionHeader
              eyebrow="Zo werkt het"
              title="U verzint het. Wij installeren en beheren het."
              lead="Vier stappen, binnen de pilot van negentig dagen. Daarna maandelijks opzegbaar."
            />
            <ol className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-4">
              {dienst.stappen.map((stap, i) => (
                <Reveal key={stap.naam} index={i} className="h-full">
                  <li className="flex h-full flex-col border-t-[3px] border-brand-accent pt-5">
                    <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
                      Stap {i + 1}
                    </p>
                    <h3 className="mb-2 font-display text-lg font-bold leading-snug tracking-[-0.015em]">
                      {stap.naam}
                    </h3>
                    <p className="text-[13.5px] text-brand-ink-2">{stap.body}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </Section>

          {/* Wat u krijgt, op de donkere band. */}
          <Section tone="deep">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
              <SectionHeader
                deep
                eyebrow="Oplevering"
                title={dienst.oplevering.titel}
                lead="Concreet, meetbaar en van u. Wat wij bouwen draait op uw eigen tools en data."
              />
              <ul className="border-t border-white/[.12]">
                {dienst.oplevering.punten.map((punt, i) => (
                  <Reveal key={punt} index={i}>
                    <li className="flex items-baseline gap-4 border-b border-white/[.12] py-5">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-[17px] font-bold tracking-[-0.015em]">{punt}</span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </Section>

          {/* De andere functies van het brein. */}
          <Section tone="mist">
            <SectionHeader
              eyebrow="Meer van het brein"
              title="Eén brein, meerdere functies."
              lead="Elke dienst is een functie van hetzelfde systeem. Ze werken los, maar versterken elkaar."
            />
            <div className="grid gap-[18px] md:grid-cols-3">
              {overige.map((d, i) => (
                <Reveal key={d.slug} index={i} className="h-full">
                  <Link
                    to={`/diensten/${d.slug}`}
                    className="group flex h-full flex-col rounded-brand border border-brand-line bg-brand-paper p-6 transition-colors duration-200 hover:border-brand-accent"
                  >
                    <h3 className="mb-2 font-display text-lg font-bold tracking-[-0.015em]">{d.naam}</h3>
                    <p className="mb-5 grow text-[13.5px] text-brand-ink-2">{d.note}</p>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
                      Bekijk →
                    </span>
                  </Link>
                </Reveal>
              ))}
              <Reveal index={overige.length} className="h-full">
                <Link
                  to="/de-engine"
                  className="group flex h-full flex-col rounded-brand border border-brand-line bg-brand-paper p-6 transition-colors duration-200 hover:border-brand-accent"
                >
                  <h3 className="mb-2 font-display text-lg font-bold tracking-[-0.015em]">De engine</h3>
                  <p className="mb-5 grow text-[13.5px] text-brand-ink-2">De volledige architectuur achter het brein</p>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
                    Bekijk →
                  </span>
                </Link>
              </Reveal>
            </div>
          </Section>

          {/* Vragen. */}
          <Section tone="paper">
            <SectionHeader eyebrow="Vragen" title={`Vragen over ${dienst.naam}.`} />
            <Faq items={dienst.faq} />
          </Section>

          {/* Afsluiter: één gesprek. */}
          <section className="bg-brand-deep py-14 text-white lg:py-[82px]">
            <Container className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-[36rem]">
                <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent">
                  [ Uw brief, ons brein ]
                </p>
                <h2 className="font-display text-[length:var(--v2-h2)] font-extrabold leading-[1.08] tracking-[-0.03em]">
                  Vertel ons wat u nodig heeft. Wij bouwen het.
                </h2>
              </div>
              <TalkCard location={`Dienst ${dienst.naam} afsluiter`} />
            </Container>
          </section>
        </main>
        <Footer />
      </div>
    </PageLoader>
  );
};

export default BreinDienstPage;
