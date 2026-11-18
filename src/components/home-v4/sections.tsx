import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/v2/Button";
import { Container } from "@/components/v2/Container";
import { Reveal } from "@/components/v2/Reveal";
import { KlantCases } from "@/components/cases/KlantCases";
import { Planning } from "@/components/home-v3/illustraties";
import { BOOKING_URL } from "@/content/copy";
import { MAANDPRIJS, VERGELIJKING } from "@/data/digitaleMedewerker";
import peterGrisel from "@/assets/peter-grisel.png";

/**
 * De homepage in zes delen: de AI-automatiseringsgolf, het tekort aan
 * engineers, en wij als het process automation team dat beschikbaar is.
 * Eén beweging op de pagina: in de hero klappen de handmatige stappen om
 * naar de agent.
 */

const euro = (n: number) => `€ ${n.toLocaleString("nl-NL")}`;

function Kop({ children, deep = false, className = "" }: { children: React.ReactNode; deep?: boolean; className?: string }) {
  return (
    <h2
      className={`max-w-[22ch] font-display text-[clamp(30px,4.6vw,56px)] font-extrabold leading-[1.02] tracking-[-0.035em] ${
        deep ? "text-white" : "text-brand-ink"
      } ${className}`}
    >
      {children}
    </h2>
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

function Omklapper() {
  const reduced = useReducedMotion();
  const totaal = STAPPEN.reduce((s, x) => s + x.uren, 0);
  return (
    <div className="rounded-brand border border-white/15 bg-brand-deep-2 p-5 sm:p-6">
      <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-white/10 pb-3">
        <p className="font-display text-[15px] font-bold text-white">Uw commerciële proces</p>
        <p className="text-[12px] text-[#8C8378]">team van vier, per maand</p>
      </div>
      <ol className="space-y-2">
        {STAPPEN.map((s, i) => (
          <li key={s.naam} className="relative grid grid-cols-[1fr_auto] items-center gap-3 overflow-hidden rounded-[10px] bg-white/[.04] px-4 py-3">
            <span className="relative z-[1] text-[14px] text-white">{s.naam}</span>
            <span className="relative z-[1] w-[118px] text-right">
              <motion.span
                className="block text-[13px] text-[#8C8378]"
                initial={reduced ? { opacity: 0 } : { opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: reduced ? 0 : 0.9 + i * 0.45, duration: 0.25 }}
              >
                {s.uren} uur handwerk
              </motion.span>
              <motion.span
                className="absolute inset-0 flex items-center justify-end font-display text-[14px] font-bold text-brand-deep"
                initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduced ? 0 : 1.05 + i * 0.45, duration: 0.25 }}
              >
                agent
              </motion.span>
            </span>
            <motion.span
              aria-hidden
              className="absolute inset-y-0 right-0 bg-brand-accent"
              initial={reduced ? { width: "132px" } : { width: 0 }}
              animate={{ width: "132px" }}
              transition={{ delay: reduced ? 0 : 0.95 + i * 0.45, duration: 0.35, ease: "easeOut" }}
            />
          </li>
        ))}
      </ol>
      <motion.p
        className="mt-4 text-[13px] text-[#D6CEC3]"
        initial={reduced ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : 1.2 + STAPPEN.length * 0.45 }}
      >
        <b className="font-semibold text-brand-accent">{totaal} uur per maand</b> gaat naar de digitale
        salesmedewerker. Uw mensen voeren de gesprekken.
      </motion.p>
    </div>
  );
}

export function V4Hero() {
  return (
    <header className="bg-brand-deep text-white">
      <Container className="grid items-center gap-12 py-16 lg:min-h-[calc(100svh-63px)] lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div>
          <p className="mb-6 text-[15px] text-brand-accent">Process automation voor B2B</p>
          <h1 className="mb-7 font-display text-[clamp(40px,6.4vw,84px)] font-black leading-[0.98] tracking-[-0.045em]">
            Iedereen wil AI-automatisering. Bijna niemand heeft de engineers.
          </h1>
          <p className="mb-9 max-w-[46ch] text-[18px] leading-relaxed text-[#D6CEC3]">
            Wij wel, en we hebben capaciteit. Wij brengen de softwarekennis en de automatiseringskracht, en
            bouwen een digitale salesmedewerker die uw commerciële proces draait.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href={BOOKING_URL}>Plan een ICP-sessie</Button>
            <Button variant="invert" href="#start">
              Bekijk hoe we starten
            </Button>
          </div>
        </div>
        <Omklapper />
      </Container>
    </header>
  );
}

/* ── 2. Het probleem ─────────────────────────────────────────────────────── */

const TEKORT = [
  { kop: "De tools zijn gekocht.", body: "Licenties lopen, maar niemand bouwt ze in het proces." },
  { kop: "Experimenten blijven experimenten.", body: "Een losse agent hier, een prompt daar. Morgen begint het weer bij nul." },
  { kop: "De vacature blijft open.", body: "Engineers die AI én sales snappen, zijn schaars. En duur." },
];

export function V4Tekort() {
  return (
    <section className="bg-brand-paper py-20 text-brand-ink lg:py-28">
      <Container>
        <Reveal>
          <Kop>AI-automatisering is overal. De engineers niet.</Kop>
        </Reveal>
        <div className="mt-12 grid gap-10 border-t border-brand-ink pt-10 md:grid-cols-3">
          {TEKORT.map((t) => (
            <div key={t.kop}>
              <p className="mb-2 font-display text-[22px] font-bold leading-tight tracking-[-0.02em]">{t.kop}</p>
              <p className="text-[15px] text-brand-ink-2">{t.body}</p>
            </div>
          ))}
        </div>
        <Reveal>
          <p className="mt-14 max-w-[30ch] font-display text-[clamp(24px,3vw,36px)] font-bold leading-tight tracking-[-0.025em] text-brand-accent-ink">
            Wij zijn die engineers. Uw process automation team, beschikbaar voor uw processen.
          </p>
        </Reveal>
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
        <Reveal>
          <Kop>Eén digitale salesmedewerker voor uw hele commerciële proces.</Kop>
          <p className="mt-6 max-w-[56ch] text-[17px] text-brand-ink-2">
            Een leadbureau stopt na de eerste stap. Het lekt juist daarna. Wij bouwen een medewerker met een brein
            vol uw context, die elke stap overneemt: van markt tot behoud.
          </p>
        </Reveal>
        <Reveal className="mt-12">
          <div className="overflow-hidden rounded-brand border border-brand-ink bg-brand-paper">
            <div className="hidden grid-cols-[150px_1fr_1.4fr] border-b border-brand-ink bg-brand-ink px-5 py-3 text-[12px] font-semibold text-white md:grid">
              <span>Stap</span>
              <span>Waar het nu lekt</span>
              <span className="text-brand-accent">Wat de agent doet</span>
            </div>
            {KETEN.map((k, i) => (
              <div
                key={k.stap}
                className="grid gap-1 border-b border-brand-line px-5 py-4 last:border-b-0 md:grid-cols-[150px_1fr_1.4fr] md:items-center md:gap-4"
              >
                <span className="font-display text-[18px] font-bold">
                  <span className="mr-2 text-[13px] font-medium text-brand-ink-3">{i + 1}</span>
                  {k.stap}
                </span>
                <span className="text-[14px] text-[#B03A2E] line-through decoration-[#B03A2E]/40">{k.lek}</span>
                <span className="flex items-center gap-3 text-[15px] font-medium">
                  <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-brand-accent" />
                  {k.agent}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
        <p className="mt-8 max-w-[60ch] text-[15px] text-brand-ink-2">
          Het brein bewaart uw klantprofielen, proposities, signalen en toon. Elke volgende propositie, en elk
          volgend proces, bouwt erop voort. Wat we bouwen blijft van u, op uw eigen data en CRM.
        </p>
      </Container>
    </section>
  );
}

/* ── 4. Hoe we starten ───────────────────────────────────────────────────── */

export function V4Start() {
  return (
    <section id="start" className="bg-brand-deep py-20 text-white lg:py-28">
      <Container>
        <Reveal>
          <Kop deep>In 90 dagen staat de basis. Week voor week.</Kop>
          <p className="mt-6 max-w-[56ch] text-[17px] text-[#D6CEC3]">
            We beginnen met een ICP-sessie en één propositie. In maand twee gaat de eerste golf live. In maand drie
            schalen we op en kijken we mee naar het volgende proces: marketing, klantcontact of finance, op hetzelfde
            brein.
          </p>
        </Reveal>
        <Reveal className="mt-12">
          <Planning />
        </Reveal>
      </Container>
    </section>
  );
}

/* ── 5. Wat het kost ─────────────────────────────────────────────────────── */

export function V4Prijs() {
  return (
    <section id="investering" className="bg-brand-paper py-20 text-brand-ink lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <Reveal>
            <Kop>Eén vast bedrag. Alles inbegrepen.</Kop>
            <p className="mt-8 font-display text-[clamp(56px,8vw,96px)] font-black leading-none tracking-[-0.05em]">
              {euro(MAANDPRIJS)}
            </p>
            <p className="mt-2 text-[16px] text-brand-ink-2">per maand, excl. btw</p>
            <ul className="mt-8 space-y-2 text-[15px]">
              <li>Het werk van onze engineers</li>
              <li>Alle licenties van de tools</li>
              <li>Doorlopend advies via AI Fctry</li>
              <li>Na 90 dagen maandelijks opzegbaar</li>
            </ul>
          </Reveal>
          <Reveal index={1} className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-[14px]">
              <thead>
                <tr>
                  <th className="pb-3" />
                  <th className="pb-3 font-semibold text-brand-ink-3">Iemand aannemen</th>
                  <th className="pb-3 font-semibold text-brand-ink-3">Een bureau</th>
                  <th className="rounded-t-brand bg-brand-accent px-3 pb-3 pt-3 font-semibold text-white">B2B Groeimachine</th>
                </tr>
              </thead>
              <tbody>
                {VERGELIJKING.map((r, i) => (
                  <tr key={r.rij} className="border-t border-brand-line">
                    <td className="py-3 pr-3 font-semibold">{r.rij}</td>
                    <td className="py-3 pr-3 text-brand-ink-2">{r.medewerker}</td>
                    <td className="py-3 pr-3 text-brand-ink-2">{r.bureau}</td>
                    <td
                      className={`bg-brand-tint px-3 py-3 font-semibold ${
                        i === VERGELIJKING.length - 1 ? "rounded-b-brand" : ""
                      }`}
                    >
                      {r.digitaal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ── 6. Bewijs en start ──────────────────────────────────────────────────── */

export function V4Bewijs() {
  return (
    <>
      <KlantCases title="Wat we bij klanten bouwden." />
      <section className="bg-brand-deep py-20 text-white lg:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <Kop deep>Welk proces geeft u als eerste uit handen?</Kop>
              <p className="mt-6 max-w-[48ch] text-[17px] text-[#D6CEC3]">
                In een ICP-sessie bepalen we wie bij u past, wat de reden is om nu te praten en welke signalen tellen.
                Daarna staat de basis in 90 dagen.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href={BOOKING_URL}>Plan een ICP-sessie</Button>
                <Button variant="invert" href="/groeiplan">
                  Maak eerst uw groeiplan
                </Button>
              </div>
            </div>
            <figure className="border-l-2 border-brand-accent pl-6">
              <blockquote className="text-[16px] leading-relaxed text-[#D6CEC3]">
                &ldquo;Ik heb te veel commerciële trajecten gezien die bij elke klant weer bij nul begonnen. Ik ben op
                zoek gegaan naar een standaard die in dagen staat, bij de volgende klant hetzelfde werkt en elke week
                scherper wordt.&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <img src={peterGrisel} alt="" className="h-11 w-11 rounded-full object-cover" />
                <span className="text-[14px]">
                  <b className="block font-semibold text-white">Peter Grisel</b>
                  <span className="text-[#8C8378]">Oprichter, Rebel Force</span>
                </span>
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>
    </>
  );
}
