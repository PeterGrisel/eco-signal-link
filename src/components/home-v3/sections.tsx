import { Button } from "@/components/v2/Button";
import { Eyebrow } from "@/components/v2/Eyebrow";
import { Reveal } from "@/components/v2/Reveal";
import { Section } from "@/components/v2/Section";
import { SectionHeader } from "@/components/v2/SectionHeader";
import { BOOKING_URL } from "@/content/copy";
import {
  BREIN,
  DOET,
  DOMEINEN,
  HANDWERK,
  FASEN,
  MAANDPRIJS,
  NIVEAUS,
  OOK_INBEGREPEN,
    PROCESSEN,
  RINGEN,
  VERGELIJKING,
  WIE_DOET_WAT,
  ZIET,
} from "@/data/digitaleMedewerker";
import {
  CollegaFiguur,
  Doorstroom,
  LekkendProces,
  Planning,
  SignaalRingen,
  Sterrenbeeld,
  Werkdag,
} from "./illustraties";
import { PROCES_ICOON } from "./procesIconen";

/**
 * De homepage volgens de deck "Digitale salesmedewerker": wat het is, hoe het
 * werkt, wie wij zijn, hoe we het gefaseerd bouwen en wat het kost.
 */

const euro = (n: number) => `€ ${n.toLocaleString("nl-NL")}`;

const Accent = ({ children }: { children: React.ReactNode }) => (
  <span className="text-brand-accent-ink">{children}</span>
);
const AccentDeep = ({ children }: { children: React.ReactNode }) => (
  <span className="text-brand-accent">{children}</span>
);

/** 1. Hero: uw digitale salesmedewerker. */
export function DmHero() {
  return (
    <Section tone="deep" fill>
      <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="v2-enter">
          <Eyebrow tone="deep">Commercial process automation</Eyebrow>
          <h1 className="mb-6 font-display text-[length:var(--v2-h1)] font-black leading-[1.02] tracking-[-0.035em]">
            Uw digitale salesmedewerker.
            <br />
            <AccentDeep>Met een AI-brein.</AccentDeep>
          </h1>
          <p className="mb-8 max-w-[48ch] text-[16.5px] leading-relaxed text-[#D6CEC3]">
            Wij zijn uw process automation team. Wij brengen de softwarekennis en de
            automatiseringskracht, en bouwen een digitale medewerker die uw commerciële proces
            draait: van markt tot vaste klant. Groeien in omzet, niet in loonkosten.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href={BOOKING_URL}>Plan een ICP-sessie</Button>
            <Button variant="invert" href="#investering">
              Wat het kost
            </Button>
          </div>
        </div>
        <Reveal className="hidden justify-center lg:flex">
          <Sterrenbeeld labels tekenIn className="w-full max-w-[440px] text-white" />
        </Reveal>
      </div>
    </Section>
  );
}

/** 2. De kern: groeien in omzet, niet in loonkosten. */
export function DmKern() {
  return (
    <Section>
      <SectionHeader
        eyebrow="De kern"
        title={
          <>
            Groeien in omzet. <Accent>Niet in loonkosten.</Accent>
          </>
        }
      />
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <Reveal className="rounded-brand border border-brand-line bg-brand-paper p-5">
          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-3">
            Groeiambitie vs. capaciteit
          </p>
          <svg viewBox="0 0 400 170" className="w-full" role="img" aria-label="Commercieel werk groeit sneller dan de capaciteit van het team. Daartussen lekt omzet.">
            <path d="M20 150 C 140 140, 260 90, 380 20 L 380 70 L 300 70 L 300 100 L 170 100 L 170 125 L 20 128 Z" fill="#E8945A" fillOpacity="0.16" />
            <path d="M20 150 C 140 140, 260 90, 380 20" fill="none" stroke="#E8945A" strokeWidth="2.5" />
            <path d="M20 128 L 170 125 L 170 100 L 300 100 L 300 70 L 380 70" fill="none" stroke="#17140F" strokeWidth="2.5" />
            <line x1="20" y1="10" x2="20" y2="160" stroke="#17140F" strokeWidth="1" />
            <line x1="20" y1="160" x2="390" y2="160" stroke="#17140F" strokeWidth="1" />
            <text x="250" y="62" fontSize="9" fontFamily="monospace" fill="#A85410" letterSpacing="1">HIER LEKT OMZET</text>
          </svg>
          <div className="mt-2 flex flex-wrap gap-5 font-mono text-[10px] uppercase tracking-[0.12em] text-brand-ink-3">
            <span><span className="text-brand-accent">—</span> Commercieel werk bij groei</span>
            <span><span className="text-brand-ink">—</span> Capaciteit team</span>
          </div>
        </Reveal>
        <Reveal index={1}>
          <h3 className="mb-2 font-display text-lg font-bold">De reflex: iemand aannemen.</h3>
          <p className="mb-6 text-[14.5px] text-brand-ink-2">
            Meer prospects, meer opvolging, meer contact met klanten. Dat kost uren. Dus komt er een
            vacature, als u al iemand vindt.
          </p>
          <h3 className="mb-2 font-display text-lg font-bold text-brand-accent-ink">De betere vraag:</h3>
          <p className="text-[14.5px] text-brand-ink-2">Welk commercieel werk hoeft helemaal geen mens te doen?</p>
          <p className="mt-6 font-serif text-[17px] italic text-brand-accent-ink">Meer handen lossen het niet op. Een brein wel.</p>
        </Reveal>
      </div>
    </Section>
  );
}

/** 3. Leadgeneratie is één stap, het lekt in alle stappen. */
export function DmProces() {
  return (
    <Section tone="mist">
      <SectionHeader
        eyebrow="Het commerciële proces"
        title={
          <>
            Leadgeneratie is één stap. <Accent>Het lekt in alle stappen.</Accent>
          </>
        }
        lead="Een leadgeneratiebureau stopt na de tweede stap: een lijst en één goed bericht. Maar het lekt juist daarna. Een warm signaal dat niemand ziet, een lead die niet opgevolgd wordt, een klant waar het stil blijft."
      />
      <Reveal>
        <LekkendProces />
      </Reveal>
      <p className="mt-10 font-serif text-[17px] italic text-brand-accent-ink">
        Wij automatiseren het proces. Niet alleen de eerste hap.
      </p>
    </Section>
  );
}

function Box({ label, title, children, accent = false }: { label: string; title: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <div className={`h-full rounded-brand border bg-brand-paper p-6 ${accent ? "border-brand-accent" : "border-brand-line"}`}>
      <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">{label}</p>
      <h3 className="mb-3 font-display text-lg font-bold">{title}</h3>
      {children}
    </div>
  );
}

const Lijst = ({ items }: { items: string[] }) => (
  <ul className="space-y-1.5 text-[14px] text-brand-ink-2">
    {items.map((t) => (
      <li key={t} className="flex gap-2">
        <span aria-hidden className="text-brand-accent">●</span>
        {t}
      </li>
    ))}
  </ul>
);

/** 4. Wat is het: een collega met een brein. */
export function DmWatIsHet() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Wat is het"
        title={
          <>
            Geen bureau. Geen chatbot. <Accent>Een collega met een brein.</Accent>
          </>
        }
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto_auto_1fr] lg:items-center">
        <Reveal>
          <Box label="Ziet · alle touchpoints" title="Alles rond uw bedrijf">
            <Lijst items={ZIET} />
          </Box>
        </Reveal>
        <Doorstroom />
        <Reveal index={1} className="flex flex-col items-center text-center">
          <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">Denkt · uw context</p>
          <CollegaFiguur className="h-48 w-40" />
          <p className="mt-2 max-w-[24ch] text-[12px] text-brand-ink-3">Klantprofielen, proposities, persona's, drempels en regels</p>
        </Reveal>
        <Doorstroom />
        <Reveal index={2}>
          <Box label="Doet · gereedschapskist" title="Het werk dat volgt" accent>
            <Lijst items={DOET} />
          </Box>
        </Reveal>
      </div>
    </Section>
  );
}

/** 5. Het brein: uw commerciële kennis, één keer vastgelegd. */
export function DmBrein() {
  return (
    <Section tone="mist">
      <SectionHeader
        eyebrow="Het brein"
        title={
          <>
            Uw commerciële kennis. <Accent>Eén keer vastgelegd.</Accent>
          </>
        }
        lead="Het verschil zit niet in het AI-model, het zit in het brein. Hetzelfde model met uw context voert een ander gesprek: niet 'heeft u tijd?', maar een reden om nu te praten."
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_240px_1fr] lg:items-center">
        {[BREIN.slice(0, 3), null, BREIN.slice(3)].map((kolom, k) =>
          kolom === null ? (
            <Reveal key="kern" className="order-first flex justify-center lg:order-none">
              <div className="rounded-full border border-brand-accent/50 bg-brand-tint p-6">
                <Sterrenbeeld className="h-40 w-40 text-brand-ink" />
              </div>
            </Reveal>
          ) : (
            <div key={k} className="grid gap-3">
              {kolom.map((b, i) => (
                <Reveal key={b.naam} index={i} className="relative">
                  <div className="rounded-brand border border-brand-ink bg-brand-paper px-5 py-4">
                    <h3 className="font-display text-[16px] font-bold">{b.naam}</h3>
                    <p className="text-[13px] text-brand-ink-2">{b.wat}</p>
                  </div>
                  <span
                    aria-hidden
                    className={`absolute top-1/2 hidden w-8 border-t border-dashed border-brand-accent-ink lg:block ${
                      k === 0 ? "-right-8" : "-left-8"
                    }`}
                  />
                </Reveal>
              ))}
            </div>
          ),
        )}
      </div>
      <p className="mt-8 font-serif text-[17px] italic text-brand-accent-ink">Elke volgende propositie gebruikt hetzelfde brein.</p>
    </Section>
  );
}

/** 6. Zes processen, één digitale medewerker. */
export function DmProcessen() {
  return (
    <Section tone="deep">
      <SectionHeader
        deep
        eyebrow="Breder dan leadgeneratie"
        title={
          <>
            Zes processen. <AccentDeep>Eén digitale medewerker.</AccentDeep>
          </>
        }
        lead="Vijf dagen per week, het hele jaar. Van onbekend tot vaste klant."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROCESSEN.map((p, i) => (
          <Reveal key={p.nr} index={i}>
            <div className="h-full rounded-brand border border-white/15 bg-brand-deep-2 p-6">
              <div className="mb-3 flex items-start justify-between">
                <p className="font-display text-2xl font-black text-brand-accent">{p.nr}</p>
                {(() => {
                  const Icoon = PROCES_ICOON[p.nr];
                  return <Icoon aria-hidden className="h-7 w-7 text-white/80" strokeWidth={1.5} />;
                })()}
              </div>
              <h3 className="mb-2 font-display text-lg font-bold text-white">{p.naam}</h3>
              <p className="text-[13.5px] text-[#CBC3B8]">{p.wat}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-16">
        <h3 className="mb-8 font-display text-[22px] font-extrabold tracking-[-0.02em]">
          Een werkdag van <AccentDeep>uw digitale salesmedewerker.</AccentDeep>
        </h3>
        <Werkdag />
      </Reveal>
    </Section>
  );
}

/** 7. Signalen en routing: de juiste lead op het juiste moment. */
export function DmSignalen() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Van signaal naar actie"
        title={
          <>
            Niet meer leads. <Accent>De juiste lead, op het juiste moment.</Accent>
          </>
        }
        lead="Eén signaal is ruis. Gestapeld is het een reden om te bellen. We kijken in drie ringen, en een score wordt een routingregel: wie belt, wanneer en waarom."
      />
      <div className="mb-12 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-3">
        {RINGEN.map((r, i) => (
          <Reveal key={r.naam} index={i}>
            <div className="h-full rounded-brand border border-brand-ink bg-brand-paper p-5">
              <h3 className="mb-1 font-display text-[16px] font-bold">{r.naam}</h3>
              <p className="mb-3 text-[13.5px] text-brand-ink-2">{r.wat}</p>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-accent-ink">{r.gewicht}</p>
            </div>
          </Reveal>
        ))}
        </div>
        <Reveal index={1}>
          <SignaalRingen />
        </Reveal>
      </div>
      <div className="space-y-3">
        {NIVEAUS.map((n, i) => (
          <Reveal key={n.naam} index={i}>
            <div
              className={`grid gap-2 rounded-brand border px-5 py-4 sm:grid-cols-[180px_1fr_1fr] sm:items-center ${
                i === 0
                  ? "border-brand-ink bg-brand-paper"
                  : i === 1
                    ? "border-brand-accent bg-brand-tint sm:mx-6"
                    : "border-brand-accent-ink bg-brand-accent-ink text-white sm:mx-12"
              }`}
            >
              <div>
                <p className="font-display text-lg font-bold">{n.naam}</p>
                <p className={`font-mono text-[9.5px] uppercase tracking-[0.14em] ${i === 2 ? "text-white/70" : "text-brand-ink-3"}`}>{n.code}</p>
              </div>
              <p className={`text-[13.5px] ${i === 2 ? "text-white/90" : "text-brand-ink-2"}`}>{n.wat}</p>
              <p className="text-[13.5px] font-semibold">→ {n.actie}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/** 8. Wie doet wat: de agent bereidt voor, mensen voeren het gesprek. */
export function DmWieDoetWat() {
  return (
    <Section tone="mist">
      <SectionHeader
        eyebrow="Wie doet wat"
        title={
          <>
            De agent bereidt voor. <Accent>Mensen voeren het gesprek.</Accent>
          </>
        }
      />
      <Reveal className="mb-5">
        <div className="mb-2 flex justify-between font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
          <span className="text-brand-accent-ink">Digitale salesmedewerker</span>
          <span>Mens</span>
        </div>
        <div aria-hidden className="h-3 rounded-full bg-gradient-to-r from-brand-accent via-[#F3C29E] to-brand-ink" />
      </Reveal>
      <div className="grid gap-4 lg:grid-cols-3">
        {WIE_DOET_WAT.map((k, i) => (
          <Reveal key={k.label} index={i}>
            <div className="h-full rounded-brand border border-brand-line bg-brand-paper p-6">
              <span
                className={`mb-4 inline-block rounded px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${
                  i === 0 ? "bg-brand-accent text-white" : i === 1 ? "bg-brand-tint text-brand-accent-ink" : "bg-brand-ink text-white"
                }`}
              >
                {k.label}
              </span>
              <Lijst items={k.punten} />
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-8 font-serif text-[17px] italic text-brand-accent-ink">
        Een klein team kijkt elke week mee: wat was goed, wat was ruis, en waarom.
      </p>
    </Section>
  );
}

/** 9. De vergelijking: iemand aannemen, een bureau, of een digitale salesmedewerker. */
export function DmVergelijking() {
  return (
    <Section>
      <SectionHeader
        eyebrow="De vergelijking"
        title={
          <>
            Iemand aannemen, een bureau, <Accent>of een digitale salesmedewerker?</Accent>
          </>
        }
      />
      <Reveal className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-[13.5px]">
          <thead>
            <tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-ink-3">
              <th className="py-3 pr-4 font-bold" />
              <th className="py-3 pr-4 font-bold">Nieuwe medewerker</th>
              <th className="py-3 pr-4 font-bold">Leadgeneratiebureau</th>
              <th className="rounded-t-brand border-x border-t border-brand-accent bg-brand-tint px-4 py-3 font-bold text-brand-accent-ink">
                Digitale salesmedewerker
              </th>
            </tr>
          </thead>
          <tbody>
            {VERGELIJKING.map((r, i) => (
              <tr key={r.rij} className="border-t border-brand-line">
                <td className="py-3 pr-4 font-semibold">{r.rij}</td>
                <td className="py-3 pr-4 text-brand-ink-2">{r.medewerker}</td>
                <td className="py-3 pr-4 text-brand-ink-2">{r.bureau}</td>
                <td
                  className={`border-x border-brand-accent bg-brand-tint px-4 py-3 font-semibold text-brand-accent-ink ${
                    i === VERGELIJKING.length - 1 ? "rounded-b-brand border-b" : ""
                  }`}
                >
                  {r.digitaal}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
      <p className="mt-8 font-serif text-[17px] italic text-brand-accent-ink">Geen of-of: input van een bureau kan het brein in.</p>
    </Section>
  );
}

/** 10. Wie wij zijn: uw process automation team, niet beperkt tot sales. */
export function DmWieWijZijn() {
  return (
    <Section tone="mist" id="wie-wij-zijn">
      <SectionHeader
        eyebrow="Wie wij zijn"
        title={
          <>
            Wij zijn uw process automation team. <Accent>Niet beperkt tot sales.</Accent>
          </>
        }
        lead="Wij zijn engineers, geen leadgeneratiebureau. Sales is waar we meestal beginnen, omdat daar de pijn zit. Hetzelfde brein en dezelfde manier van werken zetten we daarna in voor de rest van uw organisatie."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DOMEINEN.map((d, i) => (
          <Reveal key={d.naam} index={i}>
            <div className={`h-full rounded-brand border bg-brand-paper p-5 ${d.start ? "border-brand-accent" : "border-brand-line"}`}>
              <div className="mb-1 flex items-center justify-between gap-3">
                <h3 className="font-display text-[16px] font-bold">{d.naam}</h3>
                {d.start && (
                  <span className="rounded bg-brand-accent px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white">Start hier</span>
                )}
              </div>
              <p className="mb-2 text-[13.5px] text-brand-ink-2">{d.wat}</p>
              <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-brand-ink-3">
                {d.start ? "Fase 1" : "Meekijken vanaf maand 3"}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/** 11. Gefaseerd: begin bij de pijn, en de eerste 90 dagen. */
export function DmFasering() {
  return (
    <Section id="werkwijze">
      <SectionHeader
        eyebrow="Gefaseerd"
        title={
          <>
            Begin bij de pijn. <Accent>Breid uit als het bewezen is.</Accent>
          </>
        }
      />
      <div className="mb-14 grid gap-4 lg:grid-cols-3">
        {FASEN.map((f, i) => (
          <Reveal key={f.fase} index={i}>
            <div className={`h-full rounded-brand border bg-brand-paper p-6 ${f.start ? "border-brand-accent-ink" : "border-brand-line"}`}>
              <span
                className={`mb-3 inline-block rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${
                  f.start ? "bg-brand-accent-ink text-white" : "bg-brand-tint text-brand-accent-ink"
                }`}
              >
                {f.fase}
              </span>
              <h3 className="mb-3 font-display text-lg font-bold">{f.naam}</h3>
              <Lijst items={f.punten} />
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <div className="rounded-brand bg-brand-deep p-6 text-white lg:p-8">
          <h3 className="mb-6 font-display text-[22px] font-extrabold tracking-[-0.02em]">
            Uw eerste 90 dagen. <AccentDeep>Week voor week.</AccentDeep>
          </h3>
          <Planning />
        </div>
      </Reveal>
      <p className="mt-8 font-serif text-[17px] italic text-brand-accent-ink">
        De basis staat in 90 dagen. Daarna maandelijks opzegbaar, alles overdraagbaar.
      </p>
    </Section>
  );
}

/** 12. De investering: één vast bedrag per maand. */
export function DmInvestering() {
  return (
    <Section tone="mist" id="investering">
      <SectionHeader
        eyebrow="Investering"
        title={
          <>
            Eén vast bedrag per maand. <Accent>Geautomatiseerd, niet met de hand.</Accent>
          </>
        }
        lead="Geen uren achteraf, geen losse tool-abonnementen. Onze agents doen het handwerk; dat voordeel zit in de prijs."
      />
      <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        <Reveal>
          <div className="h-full rounded-brand border border-brand-line bg-brand-paper p-6">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-brand-ink-3">
                  <th className="pb-2 text-left font-bold">Handwerk · basis 90 dagen</th>
                  <th className="pb-2 text-right font-bold">Uren</th>
                  <th className="pb-2 text-right font-bold">Waarde</th>
                </tr>
              </thead>
              <tbody>
                {HANDWERK.map((h) => (
                  <tr key={h.post} className="border-t border-brand-line">
                    <td className="py-2 pr-3">{h.post}</td>
                    <td className="py-2 text-right text-brand-ink-3">{h.uren ?? "–"}</td>
                    <td className="py-2 text-right font-semibold">{h.waarde}</td>
                  </tr>
                ))}
                <tr className="bg-brand-tint">
                  <td className="rounded-l-brand px-2 py-2.5 font-semibold">Waarde · 160 uur handwerk à € 125 + licenties</td>
                  <td />
                  <td className="rounded-r-brand px-2 py-2.5 text-right font-display text-[15px] font-black">± € 21.500</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-3 font-mono text-[9.5px] uppercase tracking-[0.1em] text-brand-ink-3">
              Excl. btw. Ter vergelijking: een nieuwe medewerker kost € 55k tot 70k loonkosten per jaar.
            </p>
          </div>
        </Reveal>
        <Reveal index={1}>
          <div className="h-full rounded-brand border-2 border-brand-accent bg-brand-paper p-7">
            <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">Uw investering</p>
            <p className="font-display text-[56px] font-black leading-none tracking-[-0.03em]">
              {euro(MAANDPRIJS)} <span className="text-[16px] font-semibold text-brand-ink-2">per maand</span>
            </p>
            <p className="mt-4 font-semibold">Alles inbegrepen: werk, licenties én advies.</p>
            <p className="mt-1 text-[13.5px] text-brand-ink-3">Excl. btw.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-brand border border-brand-line p-4">
                <p className="mb-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-brand-accent-ink">Basis · 90 dagen</p>
                <p className="text-[13.5px] text-brand-ink-2">U betaalt € 9.000, voor een waarde van ± € 21.500. Gebouwd, live en bewezen op vooraf vastgelegde KPI's.</p>
              </div>
              <div className="rounded-brand border border-brand-line p-4">
                <p className="mb-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-brand-accent-ink">Daarna · per maand</p>
                <p className="text-[13.5px] text-brand-ink-2">Beheer, licenties en meekijken naar andere processen. Maandelijks opzegbaar.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
      <div className="mt-5">
        <Reveal>
          <div className="rounded-brand border border-brand-line bg-brand-paper p-7">
            <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
              Ook inbegrepen · doorlopend advies via AI Fctry
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {OOK_INBEGREPEN.map((o) => (
                <div key={o.naam}>
                  <h3 className="mb-1 font-display text-[15px] font-bold">{o.naam}</h3>
                  <p className="text-[13px] text-brand-ink-2">{o.wat}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 font-serif text-[16px] italic text-brand-accent-ink">Eén aanspreekpunt, met specialisten erachter.</p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/** 13. Afsluiter: welke propositie geeft u als eerste uit handen? */
export function DmAfsluiter() {
  return (
    <Section tone="deep" fill>
      <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Eyebrow tone="deep">Volgende stap</Eyebrow>
          <h2 className="mb-6 font-display text-[length:var(--v2-h1)] font-black leading-[1.04] tracking-[-0.035em]">
            Welke propositie geeft u als eerste <AccentDeep>uit handen?</AccentDeep>
          </h2>
          <p className="mb-8 max-w-[46ch] text-[16.5px] leading-relaxed text-[#D6CEC3]">
            We beginnen met een ICP-sessie: wie past bij u, wat is de reden om nu te praten en welke
            signalen tellen. Daarna staat de basis in 90 dagen.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href={BOOKING_URL}>Plan een ICP-sessie</Button>
            <Button variant="invert" href="/groeiplan">
              Maak eerst uw groeiplan
            </Button>
          </div>
        </div>
        <Reveal className="hidden justify-center lg:flex">
          <Sterrenbeeld className="w-full max-w-[360px] text-white" />
        </Reveal>
      </div>
    </Section>
  );
}
