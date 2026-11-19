import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/v2/Button";
import { Container } from "@/components/v2/Container";
import { KlantCases } from "@/components/cases/KlantCases";
import { Planning } from "@/components/home-v3/illustraties";
import { BOOKING_URL } from "@/content/copy";
import { MAANDPRIJS, VERGELIJKING, WIE_DOET_WAT } from "@/data/digitaleMedewerker";
import peterGrisel from "@/assets/peter-grisel.png";

/**
 * De homepage: de AI-automatiseringsgolf, het tekort aan engineers, en wij
 * als het process automation team dat beschikbaar is.
 * Eén beweging op de pagina: in de hero klapt het handwerk om naar de agent.
 * Alle feiten komen uit `src/data/digitaleMedewerker.ts`; niets toevoegen
 * zonder bevestiging van Peter.
 */

const euro = (n: number) => `€ ${n.toLocaleString("nl-NL")}`;

function Kop({ children, deep = false, className = "" }: { children: React.ReactNode; deep?: boolean; className?: string }) {
  return (
    <h2
      className={`max-w-[20ch] text-balance font-display text-[clamp(32px,4.6vw,58px)] font-extrabold leading-[1.02] tracking-[-0.035em] ${
        deep ? "text-white" : "text-brand-ink"
      } ${className}`}
    >
      {children}
    </h2>
  );
}

function Lead({ children, deep = false, className = "" }: { children: React.ReactNode; deep?: boolean; className?: string }) {
  return (
    <p className={`max-w-[58ch] text-[17px] leading-relaxed ${deep ? "text-[#D6CEC3]" : "text-brand-ink-2"} ${className}`}>
      {children}
    </p>
  );
}

/* ── 1. Hero ─────────────────────────────────────────────────────────────── */

/** Commercieel werk per maand bij een team van vier (interne schatting, zie breinPrijzen). */
const STAPPEN = [
  { naam: "Bedrijven en beslissers vinden", uren: 30 },
  { naam: "Benaderen en opvolgen", uren: 60 },
  { naam: "CRM bijwerken en taken", uren: 40 },
  { naam: "Content plannen", uren: 24 },
  { naam: "Rapporteren", uren: 16 },
];
const TOTAAL = STAPPEN.reduce((s, x) => s + x.uren, 0);
const START = 900;
const STAP = 520;

function Omklapper() {
  const reduced = useReducedMotion();
  const [klaar, setKlaar] = useState(reduced ? STAPPEN.length : 0);

  useEffect(() => {
    if (reduced) {
      setKlaar(STAPPEN.length);
      return;
    }
    const timers = STAPPEN.map((_, i) => window.setTimeout(() => setKlaar(i + 1), START + i * STAP));
    return () => timers.forEach(window.clearTimeout);
  }, [reduced]);

  const rest = STAPPEN.slice(klaar).reduce((s, x) => s + x.uren, 0);

  return (
    <div className="rounded-brand border border-white/15 bg-brand-deep-2 p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)] sm:p-6">
      <div className="mb-4 flex items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="font-display text-[15px] font-bold text-white">Uw commerciële proces</p>
          <p className="text-[12px] text-[#A39A8E]">team van vier, uren per maand</p>
        </div>
        <p className="text-right" aria-live="polite">
          <span className="block font-display text-[30px] font-black leading-none tabular-nums text-white">{rest}</span>
          <span className="text-[12px] text-[#A39A8E]">uur handwerk over</span>
        </p>
      </div>
      <ol className="space-y-2">
        {STAPPEN.map((s, i) => {
          const om = i < klaar;
          return (
            <li
              key={s.naam}
              className="relative grid grid-cols-[1fr_auto] items-center gap-3 overflow-hidden rounded-[10px] bg-white/[.04] px-4 py-3"
            >
              <span className="relative z-[1] text-[14px] text-white">{s.naam}</span>
              <span className="relative z-[1] w-[112px] text-right text-[13px]">
                <span className={`transition-opacity duration-200 ${om ? "opacity-0" : "text-[#A39A8E]"}`}>
                  {s.uren} uur
                </span>
                <span
                  className={`absolute inset-0 flex items-center justify-end font-display text-[14px] font-bold text-brand-deep transition-opacity duration-200 ${
                    om ? "opacity-100 delay-150" : "opacity-0"
                  }`}
                >
                  agent
                </span>
              </span>
              <motion.span
                aria-hidden
                className="absolute inset-y-0 right-0 bg-brand-accent"
                initial={false}
                animate={{ width: om ? 128 : 0 }}
                transition={{ duration: reduced ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </li>
          );
        })}
        <li className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-[10px] border border-dashed border-white/25 px-4 py-3">
          <span className="text-[14px] font-semibold text-white">Gesprekken, voorstellen, de relatie</span>
          <span className="text-[13px] font-semibold text-brand-accent">uw mensen</span>
        </li>
      </ol>
    </div>
  );
}

export function V4Hero() {
  return (
    <header className="bg-brand-deep text-white">
      <Container className="grid items-center gap-12 py-16 lg:min-h-[calc(100svh-63px)] lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div>
          <h1 className="mb-7 text-balance font-display text-[clamp(40px,6.2vw,84px)] font-black leading-[0.98] tracking-[-0.04em]">
            Iedereen wil AI-automatisering. Bijna niemand heeft de engineers.
          </h1>
          <p className="mb-9 max-w-[46ch] text-[18px] leading-relaxed text-[#D6CEC3]">
            Wij wel, en we hebben capaciteit. Wij brengen de softwarekennis en de automatiseringskracht, en bouwen een
            digitale salesmedewerker die uw commerciële proces draait.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href={BOOKING_URL}>Plan een ICP-sessie</Button>
            <Button variant="invert" href="#start">
              Bekijk hoe we starten
            </Button>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-[14px] text-[#D6CEC3]">
            <li>
              <b className="font-semibold text-white">{euro(MAANDPRIJS)}</b> per maand, alles inbegrepen
            </li>
            <li>
              <b className="font-semibold text-white">90 dagen</b> tot de basis staat
            </li>
            <li>Daarna maandelijks opzegbaar</li>
          </ul>
        </div>
        <Omklapper />
      </Container>
    </header>
  );
}

/* ── 2. Het tekort ───────────────────────────────────────────────────────── */

const EISEN = ["CRM en datamodellen", "AI-agents en workflows", "Outbound en deliverability", "Snapt hoe sales werkt"];

function Vacature() {
  return (
    <div className="relative mx-auto w-full max-w-[420px] rotate-[-1.5deg] rounded-brand border border-brand-line bg-white p-7 shadow-[0_24px_50px_-28px_rgba(23,20,15,.45)]">
      <p className="text-[12px] text-brand-ink-3">Vacature · fulltime</p>
      <p className="mt-2 font-display text-[24px] font-extrabold leading-tight tracking-[-0.02em]">
        Sales automation engineer
      </p>
      <ul className="mt-5 space-y-2.5 text-[15px]">
        {EISEN.map((e) => (
          <li key={e} className="flex items-center gap-2.5">
            <Check aria-hidden className="h-4 w-4 shrink-0 text-brand-ink-3" strokeWidth={2.25} />
            {e}
          </li>
        ))}
      </ul>
      <p className="mt-6 border-t border-brand-line pt-4 text-[14px] text-brand-ink-2">€ 55k tot 70k loonkosten per jaar</p>
      <p
        aria-label="Status: nog steeds open"
        className="absolute -right-3 -top-4 rotate-[8deg] rounded-[6px] border-2 border-[#B03A2E] bg-white px-3 py-1 font-display text-[13px] font-extrabold uppercase tracking-[0.06em] text-[#B03A2E]"
      >
        Nog steeds open
      </p>
    </div>
  );
}

export function V4Tekort() {
  return (
    <section className="bg-brand-paper py-20 text-brand-ink lg:py-28">
      <Container className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Kop>AI-automatisering is overal. De engineers niet.</Kop>
          <Lead className="mt-6">
            De tools zijn gekocht en de eerste experimenten gedaan. Maar wie bouwt het in uw proces, en wie houdt het
            draaiend? Daarvoor zoekt u iemand die software, data, AI én sales snapt. Die mensen zijn schaars.
          </Lead>
          <p className="mt-10 max-w-[28ch] text-balance font-display text-[clamp(24px,2.8vw,34px)] font-bold leading-tight tracking-[-0.025em] text-brand-accent-ink">
            Wij zijn die engineers. Uw process automation team, beschikbaar voor uw processen.
          </p>
        </div>
        <Vacature />
      </Container>
    </section>
  );
}

/* ── 3. Wat we bouwen ────────────────────────────────────────────────────── */

const KETEN = [
  { stap: "Markt", lek: "Onzichtbaar", agent: "Dynamische lijsten op look-alikes van uw klanten" },
  { stap: "Awareness", lek: "Eén bericht, dan stilte", agent: "Waterval van zes contentvormen over 90 dagen" },
  { stap: "Signaal", lek: "Warm, niet gezien", agent: "Elk touchpoint gemeten, gestapeld en gescoord" },
  { stap: "Gesprek", lek: "Te laat gebeld", agent: "Warm naar uw beller, met context en reden" },
  { stap: "Klant", lek: "Vergeten in het CRM", agent: "CRM en rapportage altijd bij" },
  { stap: "Behoud", lek: "Geen contact meer", agent: "Nurture en reactivatie op het juiste moment" },
];

export function V4Bouwen() {
  return (
    <section className="bg-brand-mist py-20 text-brand-ink lg:py-28">
      <Container>
        <Kop>Eén digitale salesmedewerker voor uw hele commerciële proces.</Kop>
        <Lead className="mt-6">
          Een leadbureau stopt na de eerste stap. Het lekt juist daarna. Wij bouwen een medewerker met een brein vol uw
          context, die elke stap overneemt: van markt tot behoud.
        </Lead>
        <div className="mt-12 overflow-hidden rounded-brand border border-brand-ink bg-brand-paper">
          <div className="hidden grid-cols-[150px_1fr_1.4fr] bg-brand-ink px-5 py-3 text-[12px] font-semibold text-white md:grid">
            <span>Stap</span>
            <span>Waar het nu lekt</span>
            <span className="text-brand-accent">Wat de agent doet</span>
          </div>
          {KETEN.map((k) => (
            <div
              key={k.stap}
              className="grid gap-1 border-b border-brand-line px-5 py-4 last:border-b-0 md:grid-cols-[150px_1fr_1.4fr] md:items-center md:gap-4"
            >
              <span className="font-display text-[18px] font-bold">{k.stap}</span>
              <span className="text-[14px] text-[#9A3328] line-through decoration-[#9A3328]/40">{k.lek}</span>
              <span className="flex items-center gap-3 text-[15px] font-medium">
                <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-brand-accent" />
                {k.agent}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <h3 className="font-display text-[clamp(24px,2.6vw,32px)] font-extrabold tracking-[-0.025em]">
            De agent doet het werk. U houdt de regie.
          </h3>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {WIE_DOET_WAT.map((k, i) => {
              const mens = i === WIE_DOET_WAT.length - 1;
              return (
                <div key={k.label} className={`border-t-2 pt-5 ${mens ? "border-brand-accent" : "border-brand-ink"}`}>
                  <p className={`mb-3 font-display text-[18px] font-bold ${mens ? "text-brand-accent-ink" : ""}`}>{k.label}</p>
                  <ul className="space-y-1.5 text-[15px] text-brand-ink-2">
                    {k.punten.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <Lead className="mt-10 text-[15px]">
            Het brein bewaart uw klantprofielen, proposities, signalen en toon. Elk volgend proces bouwt erop voort. Wat
            we bouwen blijft van u, op uw eigen data en CRM.
          </Lead>
        </div>
      </Container>
    </section>
  );
}

/* ── 4. Hoe we starten ───────────────────────────────────────────────────── */

export function V4Start() {
  return (
    <section id="start" className="scroll-mt-16 bg-brand-deep py-20 text-white lg:py-28">
      <Container>
        <Kop deep>In 90 dagen staat de basis. Week voor week.</Kop>
        <Lead deep className="mt-6">
          We beginnen met een ICP-sessie en één propositie. In maand twee gaat de eerste golf live. In maand drie schalen
          we op en kijken we mee naar het volgende proces: marketing, klantcontact of finance, op hetzelfde brein.
        </Lead>
        <div className="mt-12">
          <Planning />
        </div>
      </Container>
    </section>
  );
}

/* ── 5. Wat het kost ─────────────────────────────────────────────────────── */

export function V4Prijs() {
  return (
    <section id="investering" className="scroll-mt-16 bg-brand-paper py-20 text-brand-ink lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <Kop>Eén vast bedrag. Alles inbegrepen.</Kop>
            <p className="mt-8 font-display text-[clamp(56px,8vw,96px)] font-black leading-none tracking-[-0.04em] tabular-nums">
              {euro(MAANDPRIJS)}
            </p>
            <p className="mt-2 text-[16px] text-brand-ink-2">per maand, excl. btw</p>
            <ul className="mt-8 space-y-2.5 text-[15px]">
              {[
                "Het werk van onze engineers",
                "Alle licenties van de tools",
                "Doorlopend advies via AI Fctry",
                "Na 90 dagen maandelijks opzegbaar",
              ].map((p) => (
                <li key={p} className="flex items-center gap-2.5">
                  <Check aria-hidden className="h-4 w-4 shrink-0 text-brand-accent-ink" strokeWidth={2.5} />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-9">
              <Button href={BOOKING_URL}>Plan een ICP-sessie</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left text-[14px]">
              <caption className="sr-only">Vergelijking: iemand aannemen, een bureau of B2B Groeimachine</caption>
              <thead>
                <tr>
                  <th className="pb-3" />
                  <th scope="col" className="rounded-t-brand bg-brand-ink px-3 pb-3 pt-3 font-semibold text-white">
                    B2B Groeimachine
                  </th>
                  <th scope="col" className="px-3 pb-3 font-semibold text-brand-ink-3">
                    Iemand aannemen
                  </th>
                  <th scope="col" className="px-3 pb-3 font-semibold text-brand-ink-3">
                    Een bureau
                  </th>
                </tr>
              </thead>
              <tbody>
                {VERGELIJKING.map((r, i) => (
                  <tr key={r.rij} className="border-t border-brand-line">
                    <th scope="row" className="py-3 pr-3 font-semibold">
                      {r.rij}
                    </th>
                    <td
                      className={`bg-brand-tint px-3 py-3 font-semibold ${i === VERGELIJKING.length - 1 ? "rounded-b-brand" : ""}`}
                    >
                      {r.digitaal}
                    </td>
                    <td className="px-3 py-3 text-brand-ink-2">{r.medewerker}</td>
                    <td className="px-3 py-3 text-brand-ink-2">{r.bureau}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ── 6. Bewijs ───────────────────────────────────────────────────────────── */

export function V4Bewijs() {
  return <KlantCases title="Wat we bij klanten bouwden." eyebrow={null} tone="mist" />;
}

/* ── 7. Vragen ───────────────────────────────────────────────────────────── */

const VRAGEN = [
  {
    v: "Neemt AI het werk van mijn verkopers over?",
    a: "Nee. De agent doet het handwerk: lijsten, opvolging, scoren en het CRM. Het gesprek, het voorstel en de relatie blijven bij uw mensen.",
  },
  {
    v: "Wat moet mijn team zelf doen?",
    a: "Meedenken in de ICP-sessie en goedkeuren. Een nieuwe propositie, content, drempels en klantprofielen gaan altijd eerst langs u.",
  },
  {
    v: "Van wie zijn de data en de workflows?",
    a: "Van u. We bouwen op uw eigen data en CRM, zonder vendor lock-in. Alles is gedocumenteerd en overdraagbaar.",
  },
  {
    v: "Wat als het na 90 dagen niet bevalt?",
    a: "Dan stopt u. Na de basis is het maandelijks opzegbaar.",
  },
  {
    v: "Is het alleen voor sales?",
    a: "We beginnen meestal bij leadgeneratie en opvolging. Daarna kan hetzelfde brein marketing, klantcontact of finance oppakken.",
  },
];

export function V4Vragen() {
  return (
    <section className="bg-brand-paper py-20 text-brand-ink lg:py-28">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Kop>Wat u waarschijnlijk wilt weten.</Kop>
        <dl className="divide-y divide-brand-line border-y border-brand-line">
          {VRAGEN.map((q) => (
            <div key={q.v} className="grid gap-2 py-6 md:grid-cols-[1fr_1.3fr] md:gap-8">
              <dt className="font-display text-[18px] font-bold leading-snug">{q.v}</dt>
              <dd className="text-[15px] leading-relaxed text-brand-ink-2">{q.a}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

/* ── 8. Afsluiter ────────────────────────────────────────────────────────── */

export function V4Afsluiter() {
  return (
    <section className="bg-brand-deep py-20 text-white lg:py-28">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <Kop deep>Welk proces geeft u als eerste uit handen?</Kop>
            <Lead deep className="mt-6 max-w-[48ch]">
              In een ICP-sessie bepalen we wie bij u past, wat de reden is om nu te praten en welke signalen tellen.
              Daarna staat de basis in 90 dagen.
            </Lead>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={BOOKING_URL}>Plan een ICP-sessie</Button>
              <Button variant="invert" href="/groeiplan">
                Maak eerst uw groeiplan
              </Button>
            </div>
          </div>
          <figure>
            <blockquote className="font-display text-[19px] font-medium leading-snug tracking-[-0.01em] text-white">
              &ldquo;Ik heb te veel commerciële trajecten gezien die bij elke klant weer bij nul begonnen. Ik ben op zoek
              gegaan naar een standaard die in dagen staat, bij de volgende klant hetzelfde werkt en elke week scherper
              wordt.&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <img src={peterGrisel} alt="" className="h-11 w-11 rounded-full object-cover" />
              <span className="text-[14px]">
                <b className="block font-semibold text-white">Peter Grisel</b>
                <span className="text-[#A39A8E]">Oprichter, Rebel Force</span>
              </span>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
