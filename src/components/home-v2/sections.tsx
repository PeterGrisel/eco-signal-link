import { useEffect, useState } from "react";
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
import { faviconFor } from "@/data/groeistack";
import { sectors } from "@/data/sectors";
import { supabase } from "@/integrations/supabase/client";
import { trackCTA } from "@/lib/tracking";
import { FAQ_ITEMS } from "./faq";
import {
  MockChecklist,
  MockHandoff,
  MockPipeline,
  MockRadar,
  MockSequence,
} from "./mocks";

/**
 * De homepagesecties, in de volgorde waarin ze op de pagina staan.
 *
 * De opbouw volgt sectie voor sectie die van vidai-fctry: donkere hero, oranje
 * band, dan een lichte pagina met twee donkere accentbanden. De inhoud komt uit
 * de explainer "Commerciële opportunity-engine" en de technische toelichting
 * "GTM System of Intelligence". De zwaardere theorie staat op /de-engine.
 */

/* ── 01 · Waarom een engine, geen campagne ──────────────────────────────── */

export function WaaromEenEngine() {
  const paren: [string, string][] = [
    ["Leadlijst per campagne", "Doorlopend zicht op de hele markt"],
    ["Sales bedenkt zelf wie hij belt", "De engine levert het account met de reden"],
    ["Scoren op opens en clicks", "Scoren op fit, opportunity en timing"],
    ["Elke campagne begint opnieuw", "Elke uitkomst maakt het systeem scherper"],
  ];
  const pijlers = [
    {
      title: "Opportunities",
      body: "Niet wachten op bestaande vraag. Wij formuleren hypotheses over waar waarde kan ontstaan en testen die systematisch.",
    },
    {
      title: "Probability",
      body: "Signalen stapelen bewijs. Daarmee stijgt of daalt de kans dat een menselijke verkoopactie op dit moment waardevol is.",
    },
    {
      title: "Bestuurbaarheid",
      body: "U weet hoeveel opportunities u nodig heeft, hoeveel u er produceert en waar ze verloren gaan. Groei wordt een stuurbaar getal.",
    },
  ];
  return (
    <Section tone="mist">
      <SectionHeader
        eyebrow="Waarom een engine, geen campagne"
        title={
          <>
            U koopt geen leads meer.
            <br className="hidden sm:block" /> U bouwt een opportunity-flow.
          </>
        }
        lead="Een campagne is een lijst, een sequence en een wachttijd, elke keer opnieuw. Een engine draait dat om: de markt blijft in beeld, kansen ontstaan doorlopend, en uw verkoper stapt in op het moment dat het uitmaakt."
      />

      <Reveal>
        <div className="overflow-hidden rounded-brand border border-brand-line bg-brand-paper">
          <div className="grid grid-cols-2">
            <div className="border-r border-brand-line px-5 py-3.5 sm:px-7">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-ink-3">
                Losse campagne
              </span>
            </div>
            <div className="bg-brand-deep px-5 py-3.5 sm:px-7">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-accent">
                Opportunity-engine
              </span>
            </div>
          </div>
          {paren.map(([oud, nieuw]) => (
            <div key={nieuw} className="grid grid-cols-2 border-t border-brand-line">
              <div className="border-r border-brand-line px-5 py-4 text-[13px] text-brand-ink-3 sm:px-7 sm:text-[13.5px]">
                {oud}
              </div>
              <div className="flex items-start gap-2 px-5 py-4 text-[13px] text-brand-ink sm:px-7 sm:text-[13.5px]">
                <span aria-hidden className="mt-px font-bold text-brand-accent-ink">
                  →
                </span>
                <span>{nieuw}</span>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-12 grid gap-y-6 sm:grid-cols-3 sm:gap-x-10 sm:gap-y-0">
        {pijlers.map((p, i) => (
          <Reveal
            key={p.title}
            index={i}
            className={`border-t-[3px] pt-[22px] ${i === 0 ? "border-brand-accent" : "border-brand-line"}`}
          >
            <h3 className="mb-2 font-display text-[19px] font-bold tracking-[-0.015em]">
              {p.title}
            </h3>
            <p className="text-[13.5px] text-brand-ink-2">{p.body}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ── 02 · Wat wij voor u bouwen ─────────────────────────────────────────── */

export function WatWijBouwen() {
  const kaarten = [
    {
      label: "Fundament",
      title: "Uw commerciële datamodel",
      body: "Eén centrale laag met account en opportunity als kernobjecten. Uw CRM blijft het system of record; wij bouwen de laag die bepaalt wat data betekent.",
      highlight: true,
    },
    {
      label: "Output",
      title: "Accounts met een reden",
      body: "Geen kale lead en geen ondoorzichtige score. Uw verkoper krijgt wie, wat, waarom, waarom nu en welke actie wordt aanbevolen.",
    },
    {
      label: "Schaal",
      title: "Elke propositie, elk land",
      body: "De infrastructuur blijft staan, de hypothese verandert. Dezelfde engine gaat door naar cross-sell, een nieuwe markt of een partnerroute.",
    },
  ];
  return (
    <Section id="engine">
      <SectionHeader
        eyebrow="Wat wij voor u bouwen"
        title={
          <>
            Een digitale collega die de markt
            <br className="hidden sm:block" /> bewaakt terwijl u verkoopt.
          </>
        }
        lead="Wij leveren geen losse tooling en geen losse campagne. Wij ontwerpen uw commerciële proces, automatiseren de stappen, verbinden uw systemen en voegen intelligentie toe aan de beslismomenten."
      />
      <div className="grid items-stretch gap-[22px] md:grid-cols-3">
        {kaarten.map((k, i) => (
          <Reveal key={k.label} index={i} className="h-full [&>div]:h-full">
            <Card label={k.label} title={k.title} highlight={k.highlight}>
              {k.body}
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ── 03 · Wat ons anders maakt ──────────────────────────────────────────── */

export function WatOnsAndersMaakt() {
  const items = [
    {
      title: "De opportunity zit vóór de intentie",
      body: "Een bedrijf in uw doelgroep is nog geen kans. Wij zoeken eerst de reden dat er waarde kan ontstaan, en pas daarna het moment.",
    },
    {
      title: "Bewijs stapelt, en vervalt",
      body: "Een klik van gisteren telt zwaarder dan dezelfde klik van acht maanden geleden. Signalen ontstaan, stapelen, nemen in waarde af en vervallen.",
    },
    {
      title: "Wij automatiseren farming, geen gesprekken",
      body: "Het zoeken, observeren, activeren en prioriteren gaat automatisch. Het gesprek blijft mensenwerk, en dat is precies de bedoeling.",
    },
    {
      title: "Het systeem leert van uw sales",
      body: "Elke uitkomst gaat terug het systeem in. Welke signalen bleken ruis, welke hypothese leverde deals op, welke regels moeten anders.",
    },
  ];
  const trechter = [
    { n: "4.000", label: "bedrijven in de markt" },
    { n: "1.200", label: "met voldoende fit" },
    { n: "350", label: "opportunity-hypotheses" },
    { n: "70", label: "accounts met beweging" },
  ];
  return (
    <Section tone="mist">
      <SectionHeader
        eyebrow="Wat ons anders maakt"
        title={
          <>
            Wij zijn geen leadbureau.
            <br className="hidden sm:block" /> Wij bouwen commerciële
            infrastructuur.
          </>
        }
        lead="Het verschil zit niet in de tools, die kan iedereen kopen. Het zit in het proces eromheen: welke kansen u formuleert, welk bewijs u telt en wanneer u een mens inzet."
      />
      <div className="grid items-center gap-x-16 gap-y-12 lg:grid-cols-[1fr_.85fr]">
        <div className="border-t border-brand-line">
          {items.map((item, i) => (
            <Reveal key={item.title} index={i} className="border-b border-brand-line py-6">
              <h3 className="mb-[7px] font-display text-[17px] font-bold tracking-[-0.015em]">
                {item.title}
              </h3>
              <p className="text-[13.5px] text-brand-ink-2">{item.body}</p>
            </Reveal>
          ))}
        </div>

        {/* De trechter als bewijsvisual: van de hele markt naar wat beweegt. */}
        <Reveal index={2}>
          <div className="rounded-brand border border-brand-line bg-brand-paper p-7">
            <p className="mb-6 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-3">
              Van markt naar priority
            </p>
            <div className="space-y-5">
              {trechter.map((stap, i) => (
                <div key={stap.n}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-display text-[clamp(24px,2.6vw,34px)] font-black leading-none tracking-[-0.03em]">
                      {stap.n}
                    </span>
                    <span className="text-right text-[12.5px] text-brand-ink-2">
                      {stap.label}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden bg-brand-mist">
                    <span
                      aria-hidden
                      className={`block h-full ${i === trechter.length - 1 ? "bg-brand-accent" : "bg-brand-ink/25"}`}
                      style={{ width: `${[100, 45, 22, 9][i]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 border-t border-brand-line pt-5 text-[13px] text-brand-ink-2">
              Uw specialist hoeft niet iedere ochtend te bedenken wie hij kan
              bellen. Hij krijgt de accounts waar fit, opportunity en timing
              samenkomen.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ── 04 · De diensten als bento ────────────────────────────────────────── */

const DIENSTEN = [
  {
    rol: "Nieuwe markten",
    naam: "Outbound",
    body: "Markt in kaart, hypotheses per segment, multichannel activatie en opvolging. Voor groei buiten uw bestaande klantenbestand.",
    mock: <MockSequence />,
    slot: "lg:col-span-2",
  },
  {
    rol: "Named accounts",
    naam: "ABM",
    body: "Een afgebakende lijst, per account een eigen hypothese en een route naar de juiste beslisser.",
    mock: <MockPipeline />,
  },
  {
    rol: "Fundament",
    naam: "RevOps",
    body: "Datamodel, CRM-inrichting, routing en rapportage. Zonder dit blijft de rest handwerk.",
    mock: <MockChecklist />,
  },
  {
    rol: "Lange adem",
    naam: "Nurturing",
    body: "Accounts met fit maar zonder timing blijven in beeld tot het bewijs stapelt.",
    mock: <MockRadar />,
  },
  {
    rol: "Alles samen",
    naam: "GTM as a Service",
    body: "De vier diensten op één engine, van signaal tot hand-off met reason codes. Vanaf € 1.500 per maand.",
    mock: <MockHandoff />,
    slot: "lg:col-span-2",
    highlight: true,
  },
];

/**
 * De diensten als bento-raster, elk met een miniatuur dat laat zien wat de
 * dienst doet. Opbouw naar het model van daliagents.com: beeld boven, kopregel
 * met pijl, korte omschrijving, en een gordijn dat de sectie openschuift.
 */
export function Diensten() {
  return (
    <Section id="diensten" tone="mist" className="v2-gordijn">
      <SectionHeader
        eyebrow="Wat u koopt"
        title="Kies waar u begint."
        lead="Alle vier draaien op dezelfde engine, dus uitbreiden is een hypothese toevoegen en geen nieuw traject. Onderaan de volledige dienst, als u alles in één hand wilt."
      />
      <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
        {DIENSTEN.map((dienst, i) => (
          <Reveal key={dienst.naam} index={i} className={`h-full ${dienst.slot ?? ""}`}>
            <article
              className={`flex h-full flex-col overflow-hidden rounded-brand border bg-brand-paper ${
                dienst.highlight ? "border-brand-accent" : "border-brand-line"
              }`}
            >
              <span
                aria-hidden
                className={`h-[3px] w-full ${dienst.highlight ? "bg-brand-accent" : "bg-brand-ink"}`}
              />
              <div className="p-4">{dienst.mock}</div>
              <div className="flex grow flex-col px-6 pb-7 pt-1">
                <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
                  {dienst.rol}
                </p>
                <div className="mb-2 flex items-start justify-between gap-4">
                  <h3 className="font-display text-lg font-bold leading-snug tracking-[-0.015em]">
                    {dienst.naam}
                  </h3>
                  <span aria-hidden className="text-brand-ink-3">
                    ↗
                  </span>
                </div>
                <p className="text-[13.5px] text-brand-ink-2">{dienst.body}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-9 flex flex-wrap items-center gap-3">
        <Button href="#prijzen">Wat het kost</Button>
        <Button href="/groeistack" variant="outline">
          Bekijk de groeistack
        </Button>
      </Reveal>
    </Section>
  );
}

/* ── 02 · Logobalk ─────────────────────────────────────────────────────── */

interface KlantLogo {
  id: string;
  name: string;
  domain: string;
  logo_url: string | null;
  scale: number | null;
  padding: number | null;
  website: string | null;
}

function Logo({ klant }: { klant: KlantLogo }) {
  const [mislukt, setMislukt] = useState(false);
  const src = klant.logo_url || faviconFor(klant.website || klant.domain);
  if (mislukt || !src) {
    return (
      <span className="font-display text-[15px] font-bold text-[#8C8378]">{klant.name}</span>
    );
  }
  return (
    <img
      src={src}
      alt={klant.name}
      loading="lazy"
      onError={() => setMislukt(true)}
      className="h-8 w-auto max-w-[132px] object-contain opacity-70 transition duration-[180ms] hover:opacity-100"
      style={{ transform: `scale(${klant.scale ?? 1})`, padding: `${klant.padding ?? 0}px` }}
    />
  );
}

/**
 * Balk direct onder de hero: links het label in een eigen cel, rechts de
 * doorlopende rij logo's. De logo's komen uit dezelfde `client_logos`-tabel als
 * /klanten en de orbit-visual, inclusief de per klant ingestelde schaal en
 * padding. De admin blijft de enige plek waar je ze beheert.
 */
export function Logobalk() {
  const [klanten, setKlanten] = useState<KlantLogo[]>([]);

  useEffect(() => {
    let actief = true;
    supabase
      .from("client_logos")
      .select("id, name, domain, logo_url, scale, padding, website")
      .eq("is_visible", true)
      .order("sort_order")
      .then(({ data }) => {
        if (actief) setKlanten((data as KlantLogo[]) ?? []);
      });
    return () => {
      actief = false;
    };
  }, []);

  if (klanten.length === 0) return null;

  const rij = (verborgen: boolean) => (
    <div aria-hidden={verborgen || undefined} className="flex shrink-0 items-center gap-14 pr-14">
      {klanten.map((k) => (
        <Logo key={k.id + (verborgen ? "-b" : "")} klant={k} />
      ))}
    </div>
  );

  return (
    <section className="bg-brand-deep pb-16" aria-label="Klanten">
      <Container>
        <div className="grid overflow-hidden rounded-brand border border-white/[.14] md:grid-cols-[minmax(0,220px)_1fr]">
          <div className="flex items-center border-b border-white/[.14] px-6 py-5 md:border-b-0 md:border-r">
            <p className="font-mono text-[11px] font-bold uppercase leading-[1.6] tracking-[0.12em] text-white">
              Bouwden groei&shy;systemen voor
            </p>
          </div>
          <div className="overflow-x-clip py-5">
            <div className="v2-marquee-track flex w-max items-center [animation-duration:46s]">
              {rij(false)}
              {rij(true)}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Link
            to="/klanten"
            className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-accent transition-colors duration-[180ms] hover:text-brand-accent-2"
          >
            Bekijk de klanten →
          </Link>
        </div>
      </Container>
    </section>
  );
}

/* ── 03 · Het protocol ─────────────────────────────────────────────────── */

/**
 * De pilotvoorwaarden als protocol in plaats van als vier losse beloftes.
 *
 * Opbouw naar het model van daliagents.com: eerst wat er vooraf wordt
 * vastgelegd, dan de twee uitkomsten naast elkaar, dan de tabel met wat er
 * gemeten wordt. De exacte waarden per criterium spreken wij per klant af; die
 * staan hier bewust niet ingevuld.
 */
export function HetProtocol() {
  const stappen = [
    {
      stempel: "Vooraf vastgelegd",
      regels: [
        ["Doelmarkt en ICP", "vastgelegd"],
        ["Opportunity-hypotheses", "vastgelegd"],
        ["Definitie van live", "vastgelegd"],
      ],
      kop: "De afspraak",
      body: "Voor er één regel wordt gebouwd, staat op papier wat 'live' betekent in uw situatie.",
    },
    {
      stempel: "Dag 1 tot 30",
      regels: [
        ["Datamodel", "gebouwd"],
        ["Connectors", "aangesloten"],
        ["Eerste flow", "draait"],
      ],
      kop: "De bouw",
      body: "Wij bouwen op uw eigen data en CRM. U ziet elke week wat er staat en wat er nog mist.",
    },
    {
      stempel: "Dag 30",
      regels: [
        ["Engine draait", "u bevestigt"],
        ["Accounts in CRM", "u bevestigt"],
        ["Reason codes kloppen", "u beoordeelt"],
      ],
      kop: "De toets",
      body: "U legt de werkelijkheid naast de afspraak. Niet wij, u.",
    },
  ];
  const meting = [
    ["Engine live", "Datamodel, connectors en de eerste flow draaien", "Werkende omgeving op uw stack"],
    ["Accounts geleverd", "Priority accounts landen in uw CRM", "CRM-export met reason codes"],
    ["Doorlooptijd", "Binnen 30 kalenderdagen na kickoff", "Kickoffdatum en opleverdatum"],
    ["Niet gehaald", "U krijgt het betaalde bedrag terug", "Creditfactuur"],
  ];
  return (
    <Section id="pilot" tone="mist">
      <SectionHeader
        eyebrow="Zo werkt de pilot"
        title="Wij vragen u niet om vertrouwen. Wij leggen vast wanneer het geslaagd is."
        lead="Negentig dagen om het te bewijzen, maandelijks opzegbaar en geen opstartkosten. Wat 'live' betekent, schrijven wij op vóór we beginnen. Op dag dertig legt u de werkelijkheid daarnaast."
      />

      <ol className="grid gap-[22px] md:grid-cols-3">
        {stappen.map((stap, i) => (
          <Reveal key={stap.kop} index={i} className="h-full">
            <li className="flex h-full flex-col">
              <article className="rounded-brand border border-brand-line bg-brand-paper p-5">
                <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
                  {stap.stempel}
                </p>
                <ul className="space-y-2.5 font-mono text-[11.5px]">
                  {stap.regels.map(([wat, status]) => (
                    <li
                      key={wat}
                      className="flex items-baseline justify-between gap-4 border-b border-brand-line pb-2.5 last:border-b-0 last:pb-0"
                    >
                      <span className="text-brand-ink-2">{wat}</span>
                      <b className="shrink-0 font-bold text-brand-ink">{status}</b>
                    </li>
                  ))}
                </ul>
              </article>
              <div className="pt-5">
                <strong className="block font-display text-[17px] font-bold tracking-[-0.015em]">
                  {stap.kop}
                </strong>
                <p className="mt-1.5 text-[13.5px] text-brand-ink-2">{stap.body}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>

      {/* De twee uitkomsten naast elkaar: dit is waar de garantie concreet wordt. */}
      <Reveal className="mt-14">
        <h3 className="mb-6 font-display text-[clamp(20px,2.4vw,28px)] font-extrabold tracking-[-0.025em]">
          Staat de engine op dag dertig live?
        </h3>
        <div className="grid gap-[22px] md:grid-cols-2">
          <article className="overflow-hidden rounded-brand border border-brand-accent bg-brand-paper">
            <span aria-hidden className="block h-[3px] w-full bg-brand-accent" />
            <div className="p-6">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-3">
                Uitkomst
              </p>
              <p className="mt-2 font-display text-[26px] font-black tracking-[-0.03em]">Ja</p>
              <p className="mt-2 text-[13.5px] text-brand-ink-2">
                De pilot loopt door tot dag negentig. U betaalt per maand en kunt
                elke maand stoppen.
              </p>
              <p className="mt-5 flex items-baseline justify-between gap-4 border-t border-brand-line pt-4 font-mono text-[11.5px]">
                <span className="text-brand-ink-3">Uw risico</span>
                <b className="font-bold text-brand-ink">Eén maand</b>
              </p>
            </div>
          </article>
          <article className="overflow-hidden rounded-brand border border-brand-line bg-brand-paper">
            <span aria-hidden className="block h-[3px] w-full bg-brand-ink" />
            <div className="p-6">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-3">
                Uitkomst
              </p>
              <p className="mt-2 font-display text-[26px] font-black tracking-[-0.03em]">Nee</p>
              <p className="mt-2 text-[13.5px] text-brand-ink-2">
                U krijgt het betaalde bedrag terug. Wat er tot dan toe gebouwd is,
                blijft van u.
              </p>
              <p className="mt-5 flex items-baseline justify-between gap-4 border-t border-brand-line pt-4 font-mono text-[11.5px]">
                <span className="text-brand-ink-3">Uw risico</span>
                <b className="font-bold text-brand-ink">€ 0</b>
              </p>
            </div>
          </article>
        </div>
      </Reveal>

      <Reveal className="mt-14">
        <div className="rounded-brand border border-brand-line bg-brand-paper p-6 sm:p-8">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
              Wat wij meten
            </h3>
            <p className="text-[12.5px] text-brand-ink-3">
              De exacte waarden spreken wij met u af
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-[13px]">
              <thead>
                <tr>
                  {["Criterium", "Vastgelegde voorwaarde", "Bewijs"].map((kop) => (
                    <th
                      key={kop}
                      scope="col"
                      className="border-b border-brand-ink-3 pb-3 pr-6 text-left font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-ink-3"
                    >
                      {kop}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {meting.map(([criterium, voorwaarde, bewijs]) => (
                  <tr key={criterium}>
                    <th
                      scope="row"
                      className="border-b border-brand-line py-3.5 pr-6 text-left font-medium text-brand-ink"
                    >
                      {criterium}
                    </th>
                    <td className="border-b border-brand-line py-3.5 pr-6 text-brand-ink-2">
                      {voorwaarde}
                    </td>
                    <td className="border-b border-brand-line py-3.5 text-brand-ink-2">
                      <span className="font-mono text-[11.5px]">{bewijs}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-brand-line pt-8">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-3">
          De afspraak
        </span>
        <strong className="font-display text-[clamp(18px,2vw,24px)] font-extrabold tracking-[-0.025em]">
          In 30 dagen live. Anders geld terug.
        </strong>
      </Reveal>
    </Section>
  );
}

/* ── 04 · De alternatieven ─────────────────────────────────────────────── */

/**
 * Naast welke andere routes de bezoeker ons afweegt. Eerlijk over wat die
 * routes opleveren, want het alternatief noemen werkt beter dan doen alsof het
 * niet bestaat.
 */
export function Alternatieven() {
  const routes = [
    {
      naam: "Zelf bouwen met tools",
      body: "Apollo, een e-mailtool en een middag knutselen. Snel opgezet, en daarna niemand die de lijsten schoonhoudt, de signalen weegt of merkt dat de flow al drie weken stilstaat.",
    },
    {
      naam: "Een SDR aannemen",
      body: "Werving, inwerken en een vast salaris vanaf dag één. Na een half jaar weet u pas of het werkt, en vertrekt hij, dan begint u opnieuw. De kennis zat in zijn hoofd.",
    },
    {
      naam: "B2B Groeimachine",
      body: "De engine draait binnen dertig dagen op uw eigen data en CRM. Maandelijks opzegbaar, geen opstartkosten, en wat er gebouwd is blijft van u.",
      ons: true,
    },
  ];
  return (
    <Section>
      <SectionHeader
        eyebrow="De afweging"
        title="Drie manieren om aan nieuwe opportunities te komen."
        lead="Wij zijn niet de enige route, en soms niet de juiste. Dit is wat de andere twee u kosten."
      />
      <div className="grid gap-[22px] md:grid-cols-3">
        {routes.map((route, i) => (
          <Reveal key={route.naam} index={i} className="h-full">
            <article
              className={`flex h-full flex-col overflow-hidden rounded-brand border p-6 ${
                route.ons
                  ? "border-brand-accent bg-brand-tint"
                  : "border-brand-line bg-brand-paper"
              }`}
            >
              <h3 className="mb-2.5 font-display text-[19px] font-bold tracking-[-0.02em]">
                {route.naam}
              </h3>
              <p className="text-[13.5px] text-brand-ink-2">{route.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ── 06 · Hoe het werkt ─────────────────────────────────────────────────── */

export function HoeHetWerkt() {
  const stappen = [
    {
      n: "01",
      title: "Fit",
      body: "Kan dit bedrijf überhaupt een relevante klant zijn? Sector, omvang, techniek en rol in de keten. Fit alleen maakt nog geen kans.",
    },
    {
      n: "02",
      title: "Opportunity",
      body: "Welke reden kan er zijn dat hier waarde ontstaat? Een nieuwe vestiging, een vervangingsmoment, nieuwe regelgeving of een nieuwe toepassing.",
    },
    {
      n: "03",
      title: "Timing",
      body: "Wanneer is het moment? Vacatures, websitebezoek en engagement bepalen wie er nu aan de beurt is en wie in nurture blijft.",
    },
  ];
  return (
    <Section
      id="hoe-het-werkt"
      tone="deep"
      className="v2-curtain relative overflow-hidden lg:flex lg:min-h-[85svh] lg:flex-col lg:justify-center"
    >
      <GiantWord className="-right-10 top-2 text-[17vw]">PRIORITY</GiantWord>
      <SectionHeader
        deep
        eyebrow="Hoe het werkt"
        title="Drie lagen. Daarna weet sales waar hij moet zijn."
        lead="Wij brengen de hele markt in kaart en filteren met een hypothese. Fit bepaalt de bedienbare markt, opportunity bepaalt de golf, timing bepaalt wie er nu aan de beurt is."
      />
      <div className="grid gap-[26px] sm:grid-cols-3">
        {stappen.map((stap, i) => (
          <Reveal key={stap.n} index={i} className="border-t-[3px] border-white/[.16] pt-[26px]">
            <div className="mb-3 font-display text-[44px] font-black leading-none tracking-[-0.04em] text-brand-accent">
              {stap.n}
            </div>
            <h3 className="mb-2 font-display text-[19px] font-bold tracking-[-0.015em]">
              {stap.title}
            </h3>
            <p className="text-sm text-[#CBC3B8]">{stap.body}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12 grid gap-6 border-t border-white/[.16] pt-8 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">
            Qualified → target → priority
          </p>
          <p className="max-w-[56ch] text-sm text-[#CBC3B8]">
            Alleen fit betekent nurture. Fit plus een hypothese betekent actief
            bewerken. Komen fit, opportunity en timing samen, dan gaat het
            account met de reden erbij naar uw specialist.
          </p>
        </div>
        <div className="rounded-brand border border-white/[.16] p-5">
          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">
            Voorbeeld hand-off
          </p>
          <p className="text-[13.5px] text-white">
            Van Dijk Logistics. Fit hoog, opportunity expansion, bewijs: nieuwe
            locatie plus drie operationele vacatures. Bel de Operations Director
            binnen 24 uur.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

/* ── 07 · In vier weken live ────────────────────────────────────────────── */

export function Tijdlijn() {
  const weken = [
    { d: "Week 1", title: "Proces en hypotheses", body: "Uw commerciële proces gemodelleerd, de eerste hypotheses samen met sales vastgesteld." },
    { d: "Week 2", title: "Data en connectors", body: "Datamodel staat, bronnen en kanalen aangesloten, de markt in kaart." },
    { d: "Week 3", title: "Activatie live", body: "De eerste flows draaien, signalen komen binnen, de scoring wordt gekalibreerd." },
    { d: "Week 4", title: "Routing naar sales", body: "De eerste priority-accounts landen in uw CRM, met reason codes en een actie." },
    { d: "Daarna", title: "De wekelijkse review", body: "Uitkomsten uit sales gaan terug het systeem in. Elke week een stukje scherper." },
  ];
  return (
    <Section>
      <SectionHeader
        eyebrow="Van eerste gesprek tot eerste account"
        title="Binnen vier weken staat de engine."
        lead="Geen implementatietraject van een half jaar en nul opstartkosten. Na vier weken landen de eerste accounts met een reden in uw CRM."
      />
      <div className="grid gap-y-6 lg:grid-cols-5 lg:gap-y-0">
        {weken.map((kolom, i) => (
          <Reveal
            key={kolom.d}
            index={i}
            className={`border-t-[3px] py-[22px] lg:pr-[18px] ${i === 0 ? "border-brand-accent" : "border-brand-line"}`}
          >
            <div className="mb-[9px] font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-accent-ink">
              {kolom.d}
            </div>
            <h3 className="mb-1.5 font-display text-[15px] font-bold tracking-[-0.01em]">
              {kolom.title}
            </h3>
            <p className="text-[12.5px] text-brand-ink-2">{kolom.body}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ── 08 · Voor wie ──────────────────────────────────────────────────────── */

export function VoorWie() {
  return (
    <Section id="voor-wie" tone="mist">
      <SectionHeader
        eyebrow="Voor wie"
        title="Elke markt heeft eigen signalen."
        lead="Een vacature betekent iets anders in de maakindustrie dan bij een accountantskantoor. Per branche werken wij met andere hypotheses, andere databronnen en andere beslissers."
      />
      <div className="grid gap-px overflow-hidden rounded-brand border border-brand-line bg-brand-line sm:grid-cols-2 lg:grid-cols-3">
        {sectors.map((sector, i) => (
          <Reveal key={sector.slug} index={i} className="h-full bg-brand-paper">
            <Link
              to={`/sectoren/${sector.slug}`}
              className="group flex h-full flex-col p-5 transition-colors duration-[180ms] hover:bg-brand-mist"
            >
              <div className="mb-2 flex items-center gap-3">
                <sector.icon className="size-4 shrink-0 text-brand-accent-ink" aria-hidden />
                <h3 className="font-display text-[15px] font-bold tracking-[-0.01em]">
                  {sector.title}
                </h3>
              </div>
              <p className="text-[12.5px] text-brand-ink-2">{sector.tagline}</p>
              <span
                aria-hidden
                className="mt-auto pt-4 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-ink-3 transition-colors duration-[180ms] group-hover:text-brand-accent-ink"
              >
                Bekijk de aanpak →
              </span>
            </Link>
          </Reveal>
        ))}
        <Reveal index={sectors.length} className="h-full bg-brand-paper">
          <div className="flex h-full flex-col justify-center p-5">
            <h3 className="font-display text-[15px] font-bold tracking-[-0.01em]">
              Staat uw markt er niet bij?
            </h3>
            <p className="mt-2 text-[12.5px] text-brand-ink-2">
              De engine is niet aan een branche gebonden. Wij bouwen de hypothese
              op uw markt.
            </p>
            <button
              type="button"
              onClick={() => {
                trackCTA("voor_wie_gratis_scan", "voor-wie");
                openBookingModal();
              }}
              className="mt-auto pt-4 text-left font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-accent-ink transition-colors duration-[180ms] hover:text-brand-accent"
            >
              Boek een gratis scan →
            </button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ── 09 · Prijzen ───────────────────────────────────────────────────────── */

/**
 * De bedragen volgen `BASE_PRICES_EUR` in `PricingSection.tsx`; werk ze daar én
 * hier bij als ze wijzigen.
 */
export function Prijzen() {
  const pakketten = [
    {
      label: "Instap",
      title: "Start Engine",
      vanaf: "€ 1.500",
      eenheid: "per maand",
      body: "Uw outbound basis staat: één doelgroep, één campagneflow en de eerste lijsten.",
      bevat: ["1 doelgroep of ICP", "1 campagneflow", "E-mailactivatie", "4 uur GTM-service per maand"],
    },
    {
      label: "Meest gekozen",
      title: "Growth Engine",
      vanaf: "€ 2.250",
      eenheid: "per maand",
      body: "Structureel nieuwe kansen creëren, met signaal-gedreven lijsten en scoring.",
      bevat: ["2 doelgroepen", "Signaal-gedreven lijsten", "E-mail en LinkedIn", "8 uur GTM-service per maand"],
      highlight: true,
    },
    {
      label: "Managed groei",
      title: "Scale Engine",
      vanaf: "€ 3.500",
      eenheid: "per maand",
      body: "Meerdere doelgroepen en kanalen, volledig managed met regie op de loop.",
      bevat: ["3 tot 4 doelgroepen", "Dataverrijking en scoring", "CRM-sync en pipeline", "16 uur GTM-service per maand"],
    },
  ];
  return (
    <Section id="prijzen">
      <SectionHeader
        eyebrow="Onze prijzen"
        title="De prijzen staan gewoon op de site."
        lead="Nul opstartkosten en maandelijks opzegbaar. Wij draaien negentig dagen als pilot; staat de engine na dertig dagen niet live, dan krijgt u uw geld terug. Draait u al omzet maar mist u het systeem? Dan is er een performance partnership met lage techkosten en een gedeelde upside."
      />
      <div className="grid items-stretch gap-[22px] md:grid-cols-3">
        {pakketten.map((p, i) => (
          <Reveal key={p.title} index={i} className="h-full">
            <div
              className={`flex h-full flex-col overflow-hidden rounded-brand border bg-brand-paper ${
                p.highlight ? "border-brand-accent" : "border-brand-line"
              }`}
            >
              <span
                aria-hidden
                className={`h-[3px] w-full ${p.highlight ? "bg-brand-accent" : "bg-brand-ink"}`}
              />
              <div className="flex grow flex-col px-6 pb-7 pt-[23px]">
                <span className="mb-3 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
                  {p.label}
                </span>
                <h3 className="mb-2 font-display text-lg font-bold tracking-[-0.015em]">
                  {p.title}
                </h3>
                <p className="mb-5 text-[13.5px] text-brand-ink-2">{p.body}</p>
                <p className="font-display text-[clamp(28px,3vw,38px)] font-black leading-none tracking-[-0.03em]">
                  {p.vanaf}
                </p>
                <p className="mt-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-ink-3">
                  {p.eenheid}
                </p>
                <ul className="mt-5 space-y-2 border-t border-brand-line pt-5 text-[13px] text-brand-ink-2">
                  {p.bevat.map((punt) => (
                    <li key={punt} className="flex items-start gap-2.5">
                      <span aria-hidden className="mt-[7px] size-[5px] shrink-0 rounded-full bg-brand-accent" />
                      {punt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10 flex flex-wrap items-center gap-3">
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

/* ── 10 · Gebouwd met ───────────────────────────────────────────────────── */

export function GebouwdMet() {
  const tools = [
    { naam: "Apollo", body: "Bedrijven en contactpersonen vinden, plus de website visitors die uw markt verraden." },
    { naam: "Clay", body: "Data verrijken, transformeren en classificeren tot de context waar de engine op stuurt." },
    { naam: "HeyReach", body: "LinkedIn-outreach uitvoeren en de reacties terugkoppelen als signaal." },
    { naam: "HubSpot of Pipedrive", body: "Uw CRM blijft het system of record; wij lezen en schrijven met reason codes." },
  ];
  return (
    <Section tone="deep" className="v2-curtain">
      <SectionHeader
        deep
        eyebrow="Gebouwd met"
        title="Wij doen niet geheimzinnig over de stack."
        lead="Iedereen kan dezelfde software kopen. Het verschil zit in de orchestratie ertussen, en in de intelligence-laag die bepaalt wat er met een signaal gebeurt."
      />
      <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool, i) => (
          <Reveal
            key={tool.naam}
            index={i}
            className="rounded-brand border border-white/[.16] p-[22px]"
          >
            <h3 className="mb-2 font-display text-[17px] font-bold tracking-[-0.015em]">
              {tool.naam}
            </h3>
            <p className="text-[12.5px] text-[#CBC3B8]">{tool.body}</p>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-9">
        <Button href="/de-engine" variant="invert">
          De volledige architectuur
        </Button>
      </Reveal>
    </Section>
  );
}

/* ── 11 · Wie zit erachter ──────────────────────────────────────────────── */

export function WieZitErachter() {
  return (
    <Section tone="mist">
      <SectionHeader
        eyebrow="Wie zit erachter"
        title="Een label van Rebel Force."
        lead="B2B Groeimachine is het GTM-label van Rebel Force: een bureau dat commerciële processen naar software vertaalt. Geen marketingbureau dat er techniek bij doet, maar andersom."
      />
      <div className="grid gap-[22px] md:grid-cols-2">
        {[
          {
            label: "Commercie",
            naam: "Het model",
            body: "Acht stappen van markt tot learning, drie kwalificatieniveaus en een gesloten feedbackloop. Ontstaan uit trajecten bij industriële en technische B2B-organisaties, en bij elke klant opnieuw aangescherpt.",
            href: "/de-engine",
            linkLabel: "Lees de onderbouwing",
          },
          {
            label: "Techniek",
            naam: "De bouw",
            body: "Eigen datamodel, workflow-orchestratie en connectors op uw bestaande stack. Wij bouwen het, draaien het en dragen het over zodra u het zelf wilt beheren.",
            href: "/groeistack",
            linkLabel: "Bekijk de groeistack",
          },
        ].map((blok, i) => (
          <Reveal
            key={blok.naam}
            index={i}
            className="rounded-brand border border-brand-line bg-brand-paper px-7 py-[30px]"
          >
            <span className="mb-3 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
              {blok.label}
            </span>
            <h3 className="mb-2.5 font-display text-[22px] font-extrabold tracking-[-0.02em]">
              {blok.naam}
            </h3>
            <p className="text-sm text-brand-ink-2">{blok.body}</p>
            <Link
              to={blok.href}
              className="mt-5 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-accent-ink transition-colors duration-[180ms] hover:text-brand-accent"
            >
              {blok.linkLabel} <span aria-hidden>→</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ── 12 · Vragen ────────────────────────────────────────────────────────── */

export function Vragen() {
  return (
    <Section id="vragen">
      <SectionHeader eyebrow="Veelgestelde vragen" title="Wat klanten ons vooraf vragen." />
      <Faq items={FAQ_ITEMS} />
    </Section>
  );
}

/* ── 13 · Contact ───────────────────────────────────────────────────────── */

export function Contact() {
  return (
    <Section id="contact" tone="deep" fill className="v2-curtain relative overflow-hidden">
      <GiantWord className="-right-10 bottom-4 text-[16vw]">OPPORTUNITY</GiantWord>
      <div className="relative z-10 grid items-center gap-14 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <SectionHeader
            deep
            eyebrow="Kennismaken"
            title="Begin bij de vraag hoeveel opportunities u nodig heeft."
            lead="In twintig minuten rekenen wij uw omzetdoel terug naar het aantal opportunities dat uw organisatie per jaar moet produceren. Daarna weet u of het een capaciteitsvraag is of een systeemvraag."
          />
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => {
                trackCTA("contact_gratis_scan", "contact");
                openBookingModal();
              }}
            >
              Boek een gratis scan
            </Button>
            <Button href="/contact" variant="invert">
              Liever eerst mailen
            </Button>
          </div>
        </div>

        <Reveal className="rounded-brand border border-white/[.16] bg-brand-deep-2 p-7">
          <p className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent">
            Wat u meeneemt uit het gesprek
          </p>
          <ul className="space-y-3.5 text-[14.5px] text-[#CBC3B8]">
            {[
              "Uw commerciële TAK: hoeveel opportunities per jaar en per week.",
              "De opportunity-types die in uw markt het meest kansrijk zijn.",
              "Een eerste beeld van de signalen die in uw markt bewijs leveren.",
              "Wat er nodig is om dit op uw eigen data en CRM te laten draaien.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span aria-hidden className="mt-[7px] size-[5px] shrink-0 rounded-full bg-brand-accent" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-white/[.16] pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#A29584]">
            Reactie binnen één werkdag · geen verkooppitch
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
