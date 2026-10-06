import { useMemo } from "react";
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
import { HUISREGELS, LOSSE_POSTEN, MENUS, reken } from "@/data/breinPrijzen";
import { B2B_PROCESSEN, CYCLUS, PUSH_PULL } from "@/data/breinAanpak";

const URL = "https://www.b2bgroeimachine.io/pricing";

/**
 * De prijspagina: hoe we werken en waarom één vaste prijs klopt.
 *
 * Het groeiplan zet het doel (pull). Het brein standaardiseert, test en stuurt
 * bij, proces voor proces. Een volgend proces start pas als het vorige zich
 * terugverdient, dus de prijs blijft gelijk terwijl de waarde stapelt. Alle
 * bedragen komen uit `src/data/breinPrijzen.ts`.
 */
const Pricing = () => {
  usePageMeta({
    title: "Prijzen | B2B Groeimachine",
    description:
      "Eén vaste prijs, de waarde stapelt. We starten bij uw groeiplan en pakken uw commercie proces voor proces aan. Elk proces verdient zich terug voor het volgende start.",
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
        price: reken(m.ids).prijs,
        priceCurrency: "EUR",
        description: m.inhoud.join(". "),
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
                  Eén vaste prijs. <span className="text-brand-accent">De waarde stapelt.</span>
                </h1>
                <p className="max-w-[56ch] text-[16.5px] leading-relaxed text-[#D6CEC3]">
                  We beginnen bij uw groeiplan: waar wilt u naartoe? Daarna pakken we uw commercie proces voor
                  proces aan. Een volgend proces start pas als het vorige zich terugverdient. U betaalt elke maand
                  hetzelfde, terwijl wat het brein oplevert blijft groeien.
                </p>
              </div>

              <ol className="mt-12 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
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
              title="Hetzelfde brein, een ander tempo."
              lead="De abonnementen verschillen niet in losse producten, maar in hoeveel processen tegelijk lopen en hoe vaak we samen bijsturen. 90 dagen pilot, daarna maandelijks opzegbaar."
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

          {/* Proces voor proces, met de stapelende waarde. */}
          <Section tone="mist" id="proces-voor-proces">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
              <div>
                <SectionHeader
                  eyebrow="Proces voor proces"
                  title="Eerst terugverdienen, dan het volgende."
                  lead="Het groeiplan kiest de route. We beginnen bij het proces dat zich het snelst terugverdient. Pas als dat proces staat en zichtbaar oplevert, pakken we het volgende op. Zo financiert het brein zijn eigen groei."
                />
                <ul className="flex flex-wrap gap-2">
                  {B2B_PROCESSEN.map((p) => (
                    <li
                      key={p}
                      className="rounded-full border border-brand-line bg-brand-paper px-3.5 py-1.5 text-[13px] text-brand-ink-2"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <Reveal>
                <WaardeStapelt />
              </Reveal>
            </div>
          </Section>

          {/* Terugverdienrapport, adoptie en huisregels. */}
          <Section tone="paper" id="huisregels">
            <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <SectionHeader
                  eyebrow="Wat u elk kwartaal ziet"
                  title="Het terugverdienrapport."
                  lead="Per proces: het doel, wat we gestandaardiseerd en getest hebben, wat het oplevert en of het zich heeft terugverdiend. Dat rapport bepaalt het volgende proces, niet ons verkoopplan."
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

/**
 * Illustratie zonder getallen: de prijs is een vlakke lijn, de waarde stapelt
 * per terugverdiend proces. Kleuren via currentColor zodat het thema klopt.
 */
function WaardeStapelt() {
  // x-posities waar een nieuw proces start, en de waardehoogte erna (0-1).
  const stappen = [
    { x: 40, h: 0.32 },
    { x: 150, h: 0.52 },
    { x: 260, h: 0.7 },
    { x: 370, h: 0.86 },
  ];
  const W = 480;
  const H = 240;
  const base = 200;
  const top = 30;
  const y = (h: number) => base - h * (base - top);
  const prijsY = y(0.22);

  let pad = `M 40 ${base}`;
  stappen.forEach((s, i) => {
    const prev = i === 0 ? base : y(stappen[i - 1].h);
    pad += ` L ${s.x} ${prev} L ${s.x + 30} ${y(s.h)}`;
  });
  pad += ` L ${W - 20} ${y(stappen[stappen.length - 1].h)}`;
  const vlak = `${pad} L ${W - 20} ${base} Z`;

  return (
    <figure className="rounded-brand border border-brand-line bg-brand-paper p-5">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Vaste prijs tegenover stapelende waarde per terugverdiend proces">
        <line x1="40" y1={base} x2={W - 20} y2={base} className="stroke-brand-line" strokeWidth="1" />
        <path d={vlak} className="fill-brand-accent/15" />
        <path d={pad} fill="none" className="stroke-brand-accent" strokeWidth="2.5" strokeLinejoin="round" />
        <line x1="40" y1={prijsY} x2={W - 20} y2={prijsY} className="stroke-brand-ink" strokeWidth="1.5" strokeDasharray="5 5" />
        <text x={W - 20} y={prijsY - 8} textAnchor="end" className="fill-brand-ink font-mono" fontSize="11">
          vaste prijs
        </text>
        <text x={W - 20} y={y(0.86) - 10} textAnchor="end" className="fill-brand-accent-ink font-mono" fontSize="11">
          waarde
        </text>
        {stappen.map((s, i) => (
          <text key={i} x={s.x + 15} y={base + 18} textAnchor="middle" className="fill-brand-ink-3 font-mono" fontSize="10">
            proces {i + 1}
          </text>
        ))}
        <text x="40" y={base + 36} className="fill-brand-ink-3 font-mono" fontSize="10">
          tijd →
        </text>
      </svg>
      <figcaption className="mt-2 text-[12.5px] text-brand-ink-3">
        Illustratief. Per klant komen de doelen en terugverdienmomenten uit het groeiplan.
      </figcaption>
    </figure>
  );
}

export default Pricing;
