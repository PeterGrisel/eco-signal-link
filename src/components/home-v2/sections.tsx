import { Link } from "react-router-dom";
import { Button } from "@/components/v2/Button";
import { Card } from "@/components/v2/Card";
import { Container } from "@/components/v2/Container";
import { Faq } from "@/components/v2/Faq";
import { GiantWord } from "@/components/v2/GiantWord";
import { Reveal } from "@/components/v2/Reveal";
import { Section } from "@/components/v2/Section";
import { SectionHeader } from "@/components/v2/SectionHeader";
import { openBookingModal } from "@/components/booking/GlobalBookingModal";
import { sectors } from "@/data/sectors";
import { trackCTA } from "@/lib/tracking";
import { FAQ_ITEMS } from "./faq";

/**
 * De secties van de homepage, in de volgorde waarin ze op de pagina staan.
 *
 * De opbouw volgt de blauwdruk van augustus 2026: de eerste blokken
 * beantwoorden wat dit is, van wie en wat je koopt; de diepgang komt daarna.
 * De zwaarste theorie staat op /de-engine (`src/components/engine-v2`).
 */

/* ── 01 · Bewijsstrook ──────────────────────────────────────────────────── */

/**
 * Drie van de vier logo's zijn vierkante tegels met een eigen bijna-zwarte
 * ondergrond; Eurofast is een breed wit woordmerk op transparant. Vandaar een
 * eigen hoogte per logo, en de strook op de grondkleur zodat de tegels erin
 * wegvallen in plaats van als donkere blokjes op te vallen.
 */
const KLANTLOGOS = [
  { naam: "Leister", src: "/logos/leister-logo.png", klasse: "h-11" },
  { naam: "Core-Vision", src: "/logos/core-vision-logo.png", klasse: "h-11" },
  { naam: "Excelsior", src: "/logos/excelsior-logo.png", klasse: "h-11" },
  { naam: "Eurofast", src: "/logos/eurofast-logo.png", klasse: "h-5" },
] as const;

/**
 * Smalle band direct onder de hero: de bezoeker moet binnen één scroll zien dat
 * anderen hem voorgingen. Zodra de eerste case is vrijgegeven
 * (`src/data/caseStudies.ts`) hoort hier een resultaatcijfer bij.
 */
export function Klantbewijs() {
  return (
    <section className="border-y border-brand-line bg-brand-ground py-7">
      <Container className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
        <p className="shrink-0 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-ink-3">
          Draait bij onder andere
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {KLANTLOGOS.map((logo) => (
            <img
              key={logo.naam}
              src={logo.src}
              alt={logo.naam}
              loading="lazy"
              className={`${logo.klasse} w-auto max-w-[150px] object-contain opacity-75 transition-opacity duration-200 hover:opacity-100`}
            />
          ))}
        </div>
        <Link
          to="/klanten"
          className="shrink-0 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-accent transition-colors duration-200 hover:text-brand-accent-2"
        >
          Bekijk de klanten →
        </Link>
      </Container>
    </section>
  );
}

/* ── 02 · Wat u koopt ───────────────────────────────────────────────────── */

export function Diensten() {
  const diensten = [
    {
      label: "Outbound",
      title: "Nieuwe accounts openen",
      body: "Markt in kaart, hypotheses per segment, multichannel activatie en opvolging. Voor groei buiten uw bestaande klantenbestand.",
      highlight: true,
    },
    {
      label: "ABM",
      title: "Gericht op de accounts die tellen",
      body: "Een afgebakende lijst met accounts, per account een eigen opportunity-hypothese, content en route naar de juiste beslisser.",
    },
    {
      label: "RevOps",
      title: "Het proces onder de motorkap",
      body: "Datamodel, CRM-inrichting, routing, rapportage en de wekelijkse learning review. Zonder dit blijft de rest handwerk.",
    },
    {
      label: "Nurturing",
      title: "Waarde houden bij wie nog niet klaar is",
      body: "Accounts met fit maar zonder timing blijven in beeld. Zodra het bewijs stapelt, komen ze terug bovenaan de lijst.",
    },
  ];
  return (
    <Section id="diensten">
      <SectionHeader
        eyebrow="Wat u koopt"
        title="Vier diensten, één engine."
        lead="Dit is het aanbod. De infrastructuur blijft staan, de hypothese verandert: dezelfde engine gaat door naar een nieuwe propositie, cross-sell, een nieuw land of een nieuwe partnerroute."
      />
      <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {diensten.map((d, i) => (
          <Reveal key={d.label} index={i} className="h-full">
            <Card label={d.label} title={d.title} highlight={d.highlight}>
              {d.body}
            </Card>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-8 flex flex-wrap items-center gap-3">
        <Button href="/groeistack" variant="outline">
          Bekijk de volledige groeistack
        </Button>
        <Button href="#prijzen" variant="outline">
          Wat het kost
        </Button>
      </Reveal>
    </Section>
  );
}

/* ── 03 · Voor wie ──────────────────────────────────────────────────────── */

/** Branchekiezer. De sectorpagina's bestaan al; dit maakt ze eindelijk vindbaar. */
export function VoorWie() {
  return (
    <Section id="voor-wie" tone="surface">
      <SectionHeader
        eyebrow="Voor wie"
        title="Elke markt heeft eigen signalen."
        lead="Een vacature betekent iets anders in de maakindustrie dan bij een accountantskantoor. Per branche werken wij met andere opportunity-hypotheses, andere databronnen en andere beslissers."
      />
      <div className="grid gap-px overflow-hidden rounded-lg border border-brand-line bg-brand-line sm:grid-cols-2 lg:grid-cols-3">
        {sectors.map((sector, i) => (
          <Reveal key={sector.slug} index={i} className="h-full bg-brand-ground">
            <Link
              to={`/sectoren/${sector.slug}`}
              className="group flex h-full flex-col p-5 transition-colors duration-200 hover:bg-brand-surface"
            >
              <div className="mb-2 flex items-center gap-3">
                <sector.icon className="size-4 shrink-0 text-brand-accent" aria-hidden />
                <h3 className="font-display text-[15px] font-semibold tracking-tight">
                  {sector.title}
                </h3>
              </div>
              <p className="text-[13px] leading-relaxed text-brand-ink-2">{sector.tagline}</p>
              <span
                aria-hidden
                className="mt-auto pt-4 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-ink-3 transition-colors duration-200 group-hover:text-brand-accent"
              >
                Bekijk de aanpak →
              </span>
            </Link>
          </Reveal>
        ))}
        {/* Elf branches in een raster van drie laat één cel over; die vullen we
            met de uitnodiging voor markten die er nog niet bij staan. */}
        <Reveal index={sectors.length} className="h-full bg-brand-ground">
          <div className="flex h-full flex-col justify-center p-5">
            <h3 className="font-display text-[15px] font-semibold tracking-tight">
              Staat uw markt er niet bij?
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-brand-ink-2">
              De engine is niet aan een branche gebonden. Wij bouwen de hypothese
              op uw markt.
            </p>
            <button
              type="button"
              onClick={() => {
                trackCTA("voor_wie_gratis_scan", "voor-wie");
                openBookingModal();
              }}
              className="mt-auto pt-4 text-left font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-accent transition-colors duration-200 hover:text-brand-accent-2"
            >
              Boek een gratis scan →
            </button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ── 04 · De trechter ───────────────────────────────────────────────────── */

export function Trechter() {
  const stages = [
    { n: "4.000", label: "bedrijven in de markt" },
    { n: "1.200", label: "met voldoende fit" },
    { n: "350", label: "concrete opportunity-hypotheses" },
    { n: "70", label: "accounts met zichtbare beweging" },
  ];
  return (
    <Section
      tone="invert"
      className="v2-curtain relative overflow-hidden"
    >
      <GiantWord color="rgba(18,18,18,0.10)" className="-right-10 top-4 text-[17vw]">
        PRIORITY
      </GiantWord>
      <div className="relative z-10">
        <SectionHeader
          invert
          eyebrow="De trechter"
          title="Sales hoeft de markt niet meer zelf te zoeken."
          lead="De engine bewaakt de hele markt en laat uit duizenden accounts een beweging ontstaan. Wij automatiseren niet het gesprek, maar het zoeken, observeren, activeren en prioriteren dat eraan voorafgaat."
        />

        <div className="grid gap-y-8 sm:grid-cols-4 sm:gap-x-8 sm:gap-y-0">
          {stages.map((s, i) => (
            <Reveal
              key={s.n}
              index={i}
              className={`border-t-[3px] pt-5 ${
                i === stages.length - 1 ? "border-brand-accent" : "border-brand-ground/20"
              }`}
            >
              <div className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-none tracking-tight text-brand-ground">
                {s.n}
              </div>
              <p className="mt-2 text-sm text-brand-ground/70">{s.label}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 border-t border-brand-ground/15 pt-8">
          <p className="max-w-[46ch] font-display text-[clamp(1.3rem,2.4vw,1.9rem)] font-semibold leading-snug tracking-tight text-brand-ground">
            Farming geautomatiseerd. Sales gaat hunten.
          </p>
          <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-brand-ground/70">
            Uw specialist hoeft niet iedere ochtend te bedenken wie hij kan
            bellen. Hij krijgt de accounts waar fit, opportunity en timing
            samenkomen, met de reden erbij.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

/* ── 05 · Hoe het werkt ─────────────────────────────────────────────────── */

/**
 * De drie lagen en de sales routing stonden eerder als losse secties op de
 * pagina en bouwden hetzelfde idee twee keer op. Ze zijn samengevoegd: eerst
 * waar een opportunity uit bestaat, dan wat de verkoper ervan krijgt.
 */
export function HoeHetWerkt() {
  const lagen = [
    {
      label: "Laag 1",
      title: "Fit",
      body: "Kan dit bedrijf überhaupt een relevante klant zijn? Sector, omvang, techniek, locatie en rol in de keten. Fit alleen maakt nog geen kans.",
    },
    {
      label: "Laag 2",
      title: "Opportunity",
      body: "Welke reden kan er zijn dat hier commerciële waarde ontstaat? Een nieuwe vestiging, een vervangingsmoment, nieuwe regelgeving of een nieuwe toepassing.",
      highlight: true,
    },
    {
      label: "Laag 3",
      title: "Timing",
      body: "Is dit het juiste moment? Timing vertelt wanneer een opportunity interessant genoeg is om er verkoopcapaciteit op in te zetten.",
    },
  ];
  const niveaus = [
    ["Qualified", "Alleen fit. Hoort bij de bedienbare markt, gaat in nurture."],
    ["Target", "Fit plus een opportunity-hypothese. Het account wordt actief bewerkt."],
    ["Priority", "Fit, opportunity en timing komen samen. Nu naar de specialist."],
  ];
  return (
    <Section id="engine">
      <SectionHeader
        eyebrow="Hoe het werkt"
        title="Een opportunity is meer dan interesse."
        lead="Een bedrijf in uw doelgroep is nog geen opportunity. Een websitebezoek, een vacature of een geopende e-mail evenmin. Wij werken in drie lagen, en die drie bepalen samen wat uw verkoper krijgt."
      />

      <div className="grid items-stretch gap-6 md:grid-cols-3">
        {lagen.map((l, i) => (
          <Reveal key={l.title} index={i} className="h-full">
            <Card label={l.label} title={l.title} highlight={l.highlight}>
              {l.body}
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12">
        <p className="mb-6 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-accent">
          De drie kwalificatieniveaus
        </p>
        <div className="grid gap-y-6 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-0">
          {niveaus.map(([naam, body], i) => (
            <div
              key={naam}
              className={`border-t-[3px] pt-5 ${
                i === niveaus.length - 1 ? "border-brand-accent" : "border-brand-line"
              }`}
            >
              <h3 className="mb-2 font-display text-[19px] font-semibold tracking-tight">{naam}</h3>
              <p className="text-sm leading-relaxed text-brand-ink-2">{body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Voorbeeld van een priority hand-off: dit is wat de verkoper ziet. */}
      <Reveal className="mt-10 overflow-hidden rounded-lg border border-brand-line bg-brand-surface">
        <div className="border-b border-brand-line px-6 py-3.5">
          <span className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-accent">
            Voorbeeld van een priority hand-off
          </span>
        </div>
        <dl className="grid gap-x-10 gap-y-0 px-6 py-2 sm:grid-cols-2">
          {[
            ["Account", "Van Dijk Logistics"],
            ["Fit", "High"],
            ["Opportunity", "Expansion"],
            ["Evidence", "Nieuwe locatie, drie operationele vacatures, recente websiteactiviteit"],
            ["Timing", "High"],
            ["Aanbevolen actie", "Bel de Operations Director binnen 24 uur"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex flex-col gap-1 border-b border-brand-line py-4 last:border-b-0 sm:flex-row sm:gap-5 sm:[&:nth-last-child(2)]:border-b-0"
            >
              <dt className="w-40 shrink-0 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-ink-3">
                {k}
              </dt>
              <dd className="text-sm text-brand-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal className="mt-8">
        <Button href="/hoe-het-werkt" variant="outline">
          Het volledige model in acht stappen
        </Button>
      </Reveal>
    </Section>
  );
}
/* ── 06 · Bewijs stapelt, en vervalt ────────────────────────────────────── */

export function Bewijs() {
  const lagen = [
    {
      title: "Account signals",
      body: "Een vacature, een investering, een nieuwe vestiging, nieuwe technologie of zichtbare groei.",
    },
    {
      title: "Engagement",
      body: "Een open, een klik, een websitebezoek, een connectie op LinkedIn of interactie met content.",
    },
    {
      title: "Conversation",
      body: "Een reply, een terugbelverzoek, een gesprek of een afspraak in de agenda.",
    },
    {
      title: "Outcome",
      body: "De uitkomst uit het CRM: gewonnen, verloren, uitgesteld, met de reden erbij.",
    },
  ];
  return (
    <Section tone="surface">
      <SectionHeader
        eyebrow="Van opportunity naar probability"
        title="Bewijs stapelt, en vervalt."
        lead="Honderd willekeurige kansen die één deal opleveren zijn ruis. Na activatie meten wij accountsignalen, engagement en gesprekken. Elk signaal stapelt bewijs. Daarmee stijgt of daalt de kans dat een menselijke verkoopactie op dit moment waardevol is."
      />

      <div className="grid gap-12 lg:grid-cols-[1.05fr_.95fr]">
        <div className="border-t border-brand-line">
          {lagen.map((l, i) => (
            <Reveal key={l.title} index={i} className="border-b border-brand-line py-5">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-accent">
                  0{i + 1}
                </span>
                <h3 className="font-display text-[17px] font-semibold tracking-tight">
                  {l.title}
                </h3>
              </div>
              <p className="mt-1.5 pl-9 text-sm leading-relaxed text-brand-ink-2">
                {l.body}
              </p>
            </Reveal>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          {/* Ruis tegenover commercieel relevant: hetzelfde account, ander bewijs. */}
          <Reveal className="rounded-lg border border-brand-line bg-brand-ground p-6">
            <p className="mb-4 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-ink-3">
              Ruis
            </p>
            <p className="text-sm text-brand-ink-2">Eén geopende e-mail.</p>

            <p className="mb-4 mt-8 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-accent">
              Commercieel relevant → priority
            </p>
            <ul className="space-y-2 text-sm text-brand-ink-2">
              {[
                "Meerdere websitebezoeken",
                "Nieuwe vacature",
                "Expansion-opportunity",
                "Hoge fit",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Signal decay: recency weegt mee. */}
          <Reveal index={1} className="rounded-lg border border-brand-line bg-brand-ground p-6">
            <p className="mb-4 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-ink-3">
              Signal decay
            </p>
            <div
              aria-hidden
              className="h-16 w-full rounded-md bg-[linear-gradient(90deg,rgba(232,148,90,0.85),rgba(232,148,90,0.06))]"
            />
            <div className="mt-2 flex justify-between font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-ink-3">
              <span>Gisteren</span>
              <span>8 maanden</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-brand-ink-2">
              Een klik van gisteren kan belangrijk zijn. Dezelfde klik van acht
              maanden geleden veel minder. Signalen ontstaan, stapelen, nemen in
              waarde af en vervallen.
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* ── 07 · Onder de motorkap ─────────────────────────────────────────────── */

/**
 * Samenvatting van drie verdiepingssecties (architectuur, de digitale
 * medewerker en de capability-map) die nu voluit op /de-engine staan. Op de
 * homepage volstaat één blik op de machine plus een duidelijke doorverwijzing.
 */
export function OnderDeMotorkap() {
  const lagen = [
    ["Data", "Registers, Apollo, Clay, LinkedIn, websites, vacatures en uw eigen klantdata."],
    ["Context", "Normaliseren, koppelen, classificeren en ontdubbelen rond account en opportunity."],
    ["Intelligence", "Fit, hypotheses, evidence, timing en probability. Wat betekent dit?"],
    ["Orchestratie", "Events omzetten in acties: verrijken, activeren, taken maken, CRM muteren."],
    ["Activatie", "E-mail, LinkedIn, advertenties, content en belafspraken."],
    ["Mens", "Uw verkoper stapt in zodra de drempel wordt bereikt."],
  ];
  return (
    <Section id="architectuur">
      <SectionHeader
        eyebrow="Onder de motorkap"
        title="Zes lagen, één gesloten loop."
        lead="De kracht zit niet in één applicatie, maar in de orchestratie ertussen. Elke klik, vacature, reply of bedrijfswijziging is geen informatie maar een event dat de volgende processtap start. De uitkomst gaat terug het systeem in."
      />

      <div className="grid gap-px overflow-hidden rounded-lg border border-brand-line bg-brand-line sm:grid-cols-2 lg:grid-cols-3">
        {lagen.map(([naam, body], i) => (
          <Reveal key={naam} index={i} className="h-full bg-brand-surface p-5">
            <div className="mb-2 flex items-baseline gap-3">
              <span className="font-display text-[11px] font-semibold tracking-[0.14em] text-brand-accent">
                0{i + 1}
              </span>
              <h3 className="font-display text-[15px] font-semibold tracking-tight">{naam}</h3>
            </div>
            <p className="text-[13px] leading-relaxed text-brand-ink-2">{body}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8 grid gap-6 rounded-lg border border-brand-accent/30 bg-brand-accent/[0.07] px-6 py-6 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-brand-accent">
            Automation zegt: als X, doe Y
          </p>
          <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-brand-ink-2">
            Intelligence zegt iets anders: op basis van alles wat wij over dit
            account weten, wat is nu waarschijnlijk de beste commerciële actie?
            Bij 92% fit, een tweede locatie in aantocht en drie vacatures, maar
            geen reply, is het antwoord niet een vierde mail. Het is een
            salescall naar de Operations Director.
          </p>
        </div>
        <div className="flex flex-col items-start justify-center gap-3">
          <Button href="/de-engine" variant="outline">
            De volledige architectuur
          </Button>
          <p className="text-[13px] text-brand-ink-3">
            Inclusief de tien opportunity-types, de capability-map, de KPI-set en
            hoe wij autonomie begrenzen.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

/* ── 08 · Wat het kost ──────────────────────────────────────────────────── */

/**
 * Prijssignaal op de homepage. De bedragen volgen `BASE_PRICES_EUR` in
 * `PricingSection.tsx`; werk ze daar én hier bij als ze wijzigen.
 */
export function Prijzen() {
  const pakketten = [
    {
      badge: "Instap",
      naam: "Start Engine",
      prijs: "€ 1.500",
      voor: "Uw outbound basis neerzetten.",
      punten: ["1 doelgroep", "1 campagneflow", "4 uur GTM-service per maand"],
    },
    {
      badge: "Meest gekozen",
      naam: "Growth Engine",
      prijs: "€ 2.250",
      voor: "Structureel nieuwe kansen creëren.",
      punten: ["2 doelgroepen", "Signaal-gedreven lijsten", "8 uur GTM-service per maand"],
      highlight: true,
    },
    {
      badge: "Managed groei",
      naam: "Scale Engine",
      prijs: "€ 3.500",
      voor: "Meerdere doelgroepen en kanalen.",
      punten: ["3 tot 4 doelgroepen", "CRM-sync en scoring", "16 uur GTM-service per maand"],
    },
  ];
  return (
    <Section id="prijzen" tone="surface">
      <SectionHeader
        eyebrow="Wat het kost"
        title="De prijzen staan gewoon op de site."
        lead="Nul opstartkosten, minimaal drie maanden, daarna maandelijks opzegbaar. Draait u al omzet maar mist u het systeem? Dan is er een performance partnership met lage techkosten en een gedeelde upside."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {pakketten.map((p, i) => (
          <Reveal key={p.naam} index={i} className="h-full">
            <div
              className={`flex h-full flex-col rounded-lg border bg-brand-ground p-6 ${
                p.highlight ? "border-brand-accent/40" : "border-brand-line"
              }`}
            >
              <span
                className={`mb-3 font-display text-[11px] font-semibold uppercase tracking-[0.14em] ${
                  p.highlight ? "text-brand-accent" : "text-brand-ink-3"
                }`}
              >
                {p.badge}
              </span>
              <h3 className="font-display text-[19px] font-semibold tracking-tight">{p.naam}</h3>
              <p className="mt-1 text-sm text-brand-ink-3">{p.voor}</p>
              <p className="mt-5 font-display text-3xl font-bold tracking-tight text-brand-ink">
                {p.prijs}
                <span className="ml-1.5 text-sm font-medium text-brand-ink-3">/ maand</span>
              </p>
              <ul className="mt-5 space-y-2 border-t border-brand-line pt-5 text-[13.5px] text-brand-ink-2">
                {p.punten.map((punt) => (
                  <li key={punt} className="flex items-start gap-2.5">
                    <span
                      aria-hidden
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-accent"
                    />
                    {punt}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-8 flex flex-wrap items-center gap-3">
        <Button href="/pricing" variant="outline">
          Vergelijk alle pakketten
        </Button>
        <Button href="/tools/pipeline-value" variant="outline">
          Bereken uw pipelinewaarde
        </Button>
      </Reveal>
    </Section>
  );
}

/* ── 09 · In vier weken live ────────────────────────────────────────────── */

/** De negen leveringsstappen samengevat; de stappen zelf staan op /de-engine. */
export function Tijdlijn() {
  const weken = [
    {
      w: "Week 1",
      titel: "Proces en hypotheses",
      body: "Wij modelleren uw commerciële proces en stellen samen met sales de eerste opportunity-hypotheses vast.",
    },
    {
      w: "Week 2",
      titel: "Data en connectors",
      body: "Het datamodel staat, uw bronnen en kanalen worden aangesloten en de markt wordt in kaart gebracht.",
    },
    {
      w: "Week 3",
      titel: "Activatie live",
      body: "De eerste campagneflows draaien, de signalen komen binnen en de scoring wordt gekalibreerd.",
    },
    {
      w: "Week 4",
      titel: "Routing naar sales",
      body: "De eerste priority-accounts landen in uw CRM, met reason codes en een aanbevolen actie.",
    },
    {
      w: "Daarna",
      titel: "De wekelijkse review",
      body: "Uitkomsten uit sales gaan terug het systeem in. Elke week wordt de engine een stukje scherper.",
    },
  ];
  return (
    <Section>
      <SectionHeader
        eyebrow="De levering"
        title="In vier weken staat de engine."
        lead="Geen implementatietraject van een half jaar. Nul opstartkosten, en na vier weken landen de eerste accounts met een reden in uw CRM."
      />
      <div className="grid gap-y-6 lg:grid-cols-5 lg:gap-y-0">
        {weken.map((k, i) => (
          <Reveal
            key={k.w}
            index={i}
            className={`border-t-[3px] py-5 lg:pr-5 ${
              i === 0 ? "border-brand-accent" : "border-brand-line"
            }`}
          >
            <div className="mb-2 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-accent">
              {k.w}
            </div>
            <h3 className="mb-1.5 font-display text-[15px] font-semibold tracking-tight">
              {k.titel}
            </h3>
            <p className="text-[13px] leading-relaxed text-brand-ink-2">{k.body}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ── 10 · Wat het wel en niet is ────────────────────────────────────────── */

export function WelNiet() {
  const pairs: [string, string][] = [
    ["Niet alleen leadgeneratie", "Maar een opportunity-engine"],
    ["Niet alleen outbound software", "Maar een georkestreerd commercieel proces"],
    ["Geen CRM", "Maar intelligence bovenop uw system of record"],
    ["Geen losse AI-agent", "Maar een medewerker met context en guardrails"],
    ["Geen verzameling integraties", "Maar een capability-architectuur"],
    ["Geen eenmalige campagne", "Maar een permanent lerende loop"],
  ];
  return (
    <Section tone="surface">
      <SectionHeader
        eyebrow="Verwachtingen scherp"
        title="Wat wij wel en niet zijn."
        lead="Het CRM blijft uw system of record: wie is de klant en wat is er gebeurd. Wij bouwen de laag daarboven, die bepaalt wat het betekent en wat er nu moet gebeuren."
      />
      <Reveal>
        <div className="overflow-hidden rounded-lg border border-brand-line">
          <div className="grid grid-cols-2">
            <div className="border-r border-brand-line bg-brand-surface px-5 py-3.5 sm:px-7">
              <span className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-ink-3">
                Wat het niet is
              </span>
            </div>
            <div className="bg-brand-accent px-5 py-3.5 sm:px-7">
              <span className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-ground">
                Wat het wel is
              </span>
            </div>
          </div>
          {pairs.map(([niet, wel]) => (
            <div key={wel} className="grid grid-cols-2 border-t border-brand-line">
              <div className="border-r border-brand-line px-5 py-4 text-[13.5px] text-brand-ink-3 sm:px-7">
                {niet}
              </div>
              <div className="flex items-start gap-2 px-5 py-4 text-[13.5px] text-brand-ink sm:px-7">
                <span aria-hidden className="mt-px font-semibold text-brand-accent">
                  →
                </span>
                <span>{wel}</span>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

/* ── 11 · Vragen ────────────────────────────────────────────────────────── */

export function Vragen() {
  return (
    <Section id="vragen">
      <SectionHeader
        eyebrow="Veelgestelde vragen"
        title="Wat klanten ons vooraf vragen."
      />
      <Faq items={FAQ_ITEMS} />
    </Section>
  );
}

/* ── 12 · Contact ───────────────────────────────────────────────────────── */

export function Contact() {
  return (
    <Section id="contact" tone="invert" fill className="relative overflow-hidden">
      <GiantWord color="rgba(18,18,18,0.10)" className="-right-10 bottom-4 text-[16vw]">
        OPPORTUNITY
      </GiantWord>
      <div className="relative z-10 grid gap-12 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <SectionHeader
            invert
            eyebrow="Kennismaken"
            title="Begin bij de vraag hoeveel opportunities u nodig heeft."
            lead="In twintig minuten rekenen wij uw omzetdoel terug naar het aantal opportunities dat uw organisatie per jaar moet produceren. Daarna weet u of het een capaciteitsvraag is of een systeemvraag."
          />
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => {
                trackCTA("contact_plan_kennismaking", "contact");
                openBookingModal();
              }}
            >
              Plan een kennismaking
            </Button>
            <Button href="/pricing" variant="invert">
              Bekijk de prijzen
            </Button>
          </div>
        </div>

        <Reveal className="rounded-lg border border-brand-ground/20 bg-brand-ground/[0.04] p-7">
          <p className="mb-5 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-ground/60">
            Wat u meeneemt uit het gesprek
          </p>
          <ul className="space-y-3.5 text-[14.5px] text-brand-ground/80">
            {[
              "Uw commerciële TAK: hoeveel opportunities per jaar en per week.",
              "De opportunity-types die in uw markt het meest kansrijk zijn.",
              "Een eerste beeld van de signalen die in uw markt bewijs leveren.",
              "Wat er nodig is om dit op uw eigen data en CRM te laten draaien.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-accent"
                />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-brand-ground/15 pt-5 text-[13px] text-brand-ground/60">
            Liever eerst mailen? Dat kan via info@rebelforce.nl.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
