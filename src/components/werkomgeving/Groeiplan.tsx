import { fase } from "@/hooks/useScrollProgress";
import { Beurt, Cursor, FilmKader, Logo, type Beeld, type Stap } from "./FilmKader";

/**
 * Film twee: van groeiplan naar signalen.
 *
 * Waar de eerste film laat zien wat er gebeurt zodra er signalen binnenkomen,
 * laat deze zien waar die signalen vandaan komen. Het begint bij het
 * 1-pagina groeiplan — negen vakken, drie fases — en eindigt bij content die
 * zelf weer signalen oplevert. Samen zijn het de twee helften van de motor.
 *
 * Ook hier: nagebouwd met voorbeelddata, geen opname van een klant.
 */

const STAPPEN: Stap[] = [
  { titel: "Het plan", duur: 6200 },
  { titel: "De buckets", duur: 4800 },
  { titel: "De boodschap", duur: 5000 },
  { titel: "De planning", duur: 4600 },
  { titel: "De signalen", duur: 5000 },
];

const VRAAG =
  "Dit is ons groeiplan. Vertaal het naar content die signalen oplevert.";

/**
 * De negen vakken van het 1-pagina groeiplan, met wat een klant erin zet.
 * De vakken en de fases zijn die van het echte formulier; de antwoorden zijn
 * een voorbeeld.
 */
const VAKKEN = [
  { fase: "Voor", n: "01", vak: "Mijn doelmarkt", antwoord: "Maakindustrie, 80-250 medewerkers, eigen productie in NL en NRW" },
  { fase: "Voor", n: "02", vak: "Mijn boodschap", antwoord: "Stilstand op de lijn kost meer dan de oplossing" },
  { fase: "Voor", n: "03", vak: "Mijn kanalen", antwoord: "LinkedIn eerst, dan mail, telefoon als het moment klopt" },
  { fase: "Tijdens", n: "04", vak: "Mijn vangmechanisme", antwoord: "Elke vorm van interesse landt als signaal in het CRM" },
  { fase: "Tijdens", n: "05", vak: "Mijn opwarmsysteem", antwoord: "Cases uit dezelfde branche, in het ritme van de koper" },
  { fase: "Tijdens", n: "06", vak: "Mijn conversiestrategie", antwoord: "Werkbezoek op locatie, offerte binnen vijf dagen" },
  { fase: "Na", n: "07", vak: "Mijn klantervaring", antwoord: "Vaste engineer, kwartaalreview met cijfers" },
  { fase: "Na", n: "08", vak: "Mijn klantwaarde", antwoord: "Onderhoudscontract en tweede lijn erbij" },
  { fase: "Na", n: "09", vak: "Mijn referralmotor", antwoord: "Na elke geslaagde oplevering om een introductie vragen" },
];

const FASES = ["Voor", "Tijdens", "Na"];

/** De vakken worden thema's waar content op gemaakt kan worden. */
const BUCKETS = [
  { naam: "Stilstand kost geld", uit: "Vak 02 · boodschap", stukken: 8 },
  { naam: "Zo werkt het bij uw buren", uit: "Vak 05 · opwarmsysteem", stukken: 6 },
  { naam: "De vraag achter de vraag", uit: "Vak 01 · doelmarkt", stukken: 5 },
  { naam: "Wat er ná de oplevering gebeurt", uit: "Vak 07 · klantervaring", stukken: 4 },
];

/** Eén boodschap, per kanaal anders opgeschreven. */
const BOODSCHAP = [
  {
    kanaal: "LinkedIn",
    tool: "HeyReach",
    tekst: "Een uur stilstand op de lijn kost meer dan het contract dat het had voorkomen. Drie cijfers uit de maakindustrie.",
  },
  {
    kanaal: "E-mail",
    tool: "Instantly",
    tekst: "U zoekt een productieleider. Bij {{bedrijf}} betekent dat meestal dat er een lijn bij komt — dan is dit het moment.",
  },
  {
    kanaal: "Telefoon",
    tool: "Apollo",
    tekst: "Aanleiding openen, niet pitchen: 'Ik zag de vacature. Hoe vangen jullie de piek nu op?'",
  },
];

/** De week in het contentplan. */
const PLANNING = [
  { dag: "Ma", kanaal: "LinkedIn", stuk: "Post · stilstand kost geld" },
  { dag: "Di", kanaal: "E-mail", stuk: "Flow · vacaturesignaal" },
  { dag: "Wo", kanaal: "LinkedIn", stuk: "Case · Van Dijk" },
  { dag: "Do", kanaal: "Telefoon", stuk: "Belblok · warme accounts" },
  { dag: "Vr", kanaal: "Nieuwsbrief", stuk: "Wat we deze week zagen" },
];

/** Wat de content weer oplevert. Dit is waar film één begint. */
const SIGNALEN = [
  { bron: "LinkedIn", uit: "23 profielbezoeken op de post van maandag" },
  { bron: "Website", uit: "9 bedrijven bekeken de case-pagina" },
  { bron: "E-mail", uit: "4 antwoorden, 2 met een concrete vraag" },
  { bron: "Telefoon", uit: "3 gesprekken, 1 werkbezoek gepland" },
];

/** De fases van het groeiplan lichten op naarmate ze ingevuld raken. */
function Fases({ stap, t }: Beeld) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2.5 lg:block lg:space-y-2.5">
      {FASES.map((f, i) => {
        const aan = stap > 0 || t > (i + 0.6) / FASES.length;
        const vakken = VAKKEN.filter((v) => v.fase === f);
        return (
          <li key={f}>
            <span className="flex items-center gap-2">
              <span
                aria-hidden
                className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${
                  aan ? "bg-brand-accent" : "bg-brand-line"
                }`}
              />
              <span
                className={`text-[12px] transition-colors duration-300 ${
                  aan ? "text-brand-ink" : "text-brand-ink-3"
                }`}
              >
                {f}
              </span>
            </span>
            <span className="ml-3.5 hidden font-mono text-[10px] text-brand-ink-3 lg:block">
              {vakken[0].n}–{vakken[2].n}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function Groeiplan() {
  return (
    <FilmKader
      titel="Groeiplan"
      stappen={STAPPEN}
      railTitel="Het plan"
      rail={(beeld) => <Fases {...beeld} />}
    >
      {({ stap, t, getikt }) => (
        <>
          {/* 1 · Het plan vult zich in */}
          <Beurt wie="u">
            <p className="text-[14px] leading-relaxed text-brand-ink">
              {stap === 0 ? getikt(VRAAG, 0.28) : VRAAG}
              {stap === 0 && t < 0.3 && <Cursor />}
            </p>
          </Beurt>

          {stap >= 0 && (stap > 0 || t > 0.3) && (
            <Beurt wie="engine">
              <p className="mb-3 text-[13.5px] text-brand-ink-2">
                Negen vakken, drie fases. Zo staat het commerciële verhaal op
                één A4.
              </p>
              <ol className="grid gap-1.5 sm:grid-cols-3">
                {VAKKEN.map((v, i) => {
                  const vol = stap > 0 || t > 0.34 + i * 0.07;
                  return (
                    <li
                      key={v.n}
                      className={`rounded-[2px] border px-2.5 py-2 transition-colors duration-500 ${
                        vol
                          ? "border-brand-accent/60 bg-brand-mist/70"
                          : "border-dashed border-brand-line bg-brand-paper"
                      }`}
                    >
                      <p className="flex items-baseline gap-1.5">
                        <span className="font-mono text-[9.5px] font-bold text-brand-accent-ink">
                          {v.n}
                        </span>
                        <span className="text-[11.5px] font-semibold text-brand-ink">
                          {v.vak}
                        </span>
                      </p>
                      <p
                        className={`mt-1 text-[11px] leading-snug transition-opacity duration-500 ${
                          vol ? "text-brand-ink-2 opacity-100" : "opacity-0"
                        }`}
                      >
                        {v.antwoord}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </Beurt>
          )}

          {/* 2 · De content buckets */}
          {stap >= 1 && (
            <Beurt wie="engine">
              <p className="mb-3 text-[13.5px] text-brand-ink-2">
                Uit de antwoorden komen de thema's waar u iets over te zeggen
                heeft. Geen contentkalender uit het niets.
              </p>
              <ul className="space-y-1.5">
                {BUCKETS.map((b, i) => {
                  if (stap === 1 && t < i / (BUCKETS.length + 0.5)) return null;
                  return (
                    <li
                      key={b.naam}
                      className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 rounded-[2px] border border-brand-line bg-brand-mist/70 px-2.5 py-1.5"
                    >
                      <span className="text-[12.5px] font-medium text-brand-ink">
                        {b.naam}
                      </span>
                      <span className="font-mono text-[10px] text-brand-ink-3">
                        ← {b.uit}
                      </span>
                      <span className="ml-auto font-mono text-[10.5px] text-brand-ink">
                        {b.stukken} stuks
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Beurt>
          )}

          {/* 3 · De messaging per kanaal */}
          {stap >= 2 && (
            <Beurt wie="engine">
              <p className="mb-3 text-[13.5px] text-brand-ink-2">
                Eén boodschap, per kanaal anders opgeschreven. Dezelfde belofte,
                andere toon.
              </p>
              <ul className="space-y-2">
                {BOODSCHAP.map((m, i) => {
                  if (stap === 2 && t < i / (BOODSCHAP.length + 0.5)) return null;
                  return (
                    <li
                      key={m.kanaal}
                      className="rounded-[2px] border border-brand-line bg-brand-paper px-3 py-2.5"
                    >
                      <p className="mb-1 flex items-center gap-2">
                        <Logo naam={m.tool} klasse="h-3.5 w-3.5" />
                        <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.12em] text-brand-accent-ink">
                          {m.kanaal}
                        </span>
                      </p>
                      <p className="text-[12.5px] leading-relaxed text-brand-ink-2">
                        {m.tekst}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </Beurt>
          )}

          {/* 4 · De week wordt ingepland */}
          {stap >= 3 && (
            <Beurt wie="engine">
              <p className="mb-3 text-[13.5px] text-brand-ink-2">
                En dan staat de week klaar. U hoeft alleen nog te kijken.
              </p>
              <ul className="space-y-1">
                {PLANNING.map((d, i) => {
                  if (stap === 3 && t < i / (PLANNING.length + 0.5)) return null;
                  return (
                    <li
                      key={d.dag}
                      className="flex items-center gap-3 rounded-[2px] border border-brand-line bg-brand-mist/70 px-2.5 py-1.5"
                    >
                      <span className="w-6 shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-brand-accent-ink">
                        {d.dag}
                      </span>
                      <span className="text-[12.5px] text-brand-ink">{d.stuk}</span>
                      <span className="ml-auto font-mono text-[10px] text-brand-ink-3">
                        {d.kanaal}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Beurt>
          )}

          {/* 5 · En dat levert weer signalen op */}
          {stap >= 4 && (
            <Beurt wie="engine">
              <p className="mb-3 text-[13.5px] text-brand-ink-2">
                Een week later reageert de markt. Dit zijn de signalen waar de
                engine mee verder gaat.
              </p>
              <ul className="space-y-1.5">
                {SIGNALEN.map((s, i) => {
                  if (stap === 4 && t < 0.1 + i * 0.14) return null;
                  return (
                    <li
                      key={s.bron}
                      className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 rounded-[2px] border border-brand-accent/50 bg-brand-mist/70 px-2.5 py-1.5"
                    >
                      <span aria-hidden className="text-brand-accent-ink">
                        →
                      </span>
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-brand-ink-3">
                        {s.bron}
                      </span>
                      <span className="text-[12.5px] text-brand-ink">{s.uit}</span>
                    </li>
                  );
                })}
              </ul>
              {(stap > 4 || t > 0.7) && (
                <p
                  className="v2-enter mt-4 border-t border-brand-line pt-3.5 text-[13px] font-medium text-brand-ink"
                  style={{ opacity: fase(t, 0.7, 0.9) }}
                >
                  Hier begint het eerste filmpje: deze signalen worden gewogen
                  tot accounts met een reden.
                </p>
              )}
            </Beurt>
          )}
        </>
      )}
    </FilmKader>
  );
}
