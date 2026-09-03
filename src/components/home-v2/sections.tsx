import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/v2/Button";
import { Card } from "@/components/v2/Card";
import { Faq } from "@/components/v2/Faq";
import { GiantWord } from "@/components/v2/GiantWord";
import { Globe, GLOBE_SFEER_CONFIG } from "@/components/ui/globe";
import peterGrisel from "@/assets/peter-grisel.png";
import { TimelineStack, type TimelineItem } from "@/components/ui/modern-timeline";
import { MarktTrechter, PrincipeScroller } from "./Principes";
import { Reveal } from "@/components/v2/Reveal";
import { Section } from "@/components/v2/Section";
import SphereImageGrid from "@/components/ui/img-sphere";
import InfiniteSlider from "@/components/hhwv2/ui/InfiniteSlider";
import { useBolMaten } from "@/hooks/useBolMaten";
import { SectionHeader } from "@/components/v2/SectionHeader";
import { openBookingModal } from "@/components/booking/GlobalBookingModal";
import { faviconFor } from "@/data/groeistack";
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
  // De weg die een klant echt aflegt. Vijf losse momenten waarvan er geen
  // enkele op zichzelf de deal maakt — dat is precies het punt.
  const reis = [
    "Ziet u langskomen op LinkedIn",
    "Bezoekt later uw website",
    "Negeert een paar mails",
    "Hoort uw naam ergens anders",
    "Neemt op als het moment klopt",
  ];
  const paren: [string, string][] = [
    ["Mail moet zelf converteren", "Mail is één signaal"],
    ["LinkedIn moet leads opleveren", "LinkedIn bouwt herkenning op"],
    ["Een call moet direct een afspraak geven", "Een call komt als de timing beter is"],
    ["Resultaat per kanaal meten", "Alle signalen bij elkaar optellen"],
  ];
  const pijlers = [
    {
      title: "Zien waar kansen ontstaan",
      body: "Niet wachten tot iemand een formulier invult. Wij kijken waar bedrijven bewegen, veranderen of interesse laten zien.",
    },
    {
      title: "Weten wanneer u moet handelen",
      body: "Eén klik zegt weinig. Meerdere signalen samen vertellen wanneer een account interessanter wordt.",
    },
    {
      title: "Niet meer gokken wie u belt",
      body: "Uw verkoper krijgt het bedrijf, de aanleiding en de context. Zodat hij weet waarom hij nú contact opneemt.",
    },
  ];
  return (
    <Section tone="mist">
      <SectionHeader
        eyebrow="Waarom één kanaal niet genoeg is"
        title={
          <>
            Geen enkel kanaal won de deal.
            <br className="hidden sm:block" /> De combinatie deed dat.
          </>
        }
        lead="Een e-mail verkoopt niet. Een LinkedIn-post verkoopt niet. Een telefoontje verkoopt niet. En toch tekent uw klant uiteindelijk — niet door één van die drie, maar doordat ze elkaar opstapelden."
      />

      {/* De vijf momenten los naast elkaar: pas samen leveren ze de opdracht op. */}
      <Reveal>
        <p className="mb-6 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
          Wat uw klant werkelijk doet
        </p>
        {/* Vijf naast elkaar past pas op een breed scherm; daaronder drie en
            twee, zodat de stappen leesbaar blijven in plaats van te knijpen. */}
        <ol className="grid gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-5 lg:gap-y-0">
          {reis.map((stap, i) => (
            <li
              key={stap}
              className={`border-t-[3px] pt-[18px] ${
                i === reis.length - 1 ? "border-brand-accent" : "border-brand-line"
              }`}
            >
              <span className="mb-2 block font-mono text-[10px] font-bold tracking-[0.16em] text-brand-ink-3">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p
                className={`text-[13.5px] ${
                  i === reis.length - 1 ? "font-medium text-brand-ink" : "text-brand-ink-2"
                }`}
              >
                {stap}
              </p>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal className="mt-14 max-w-[46rem]">
        <h3 className="mb-3 font-display text-[clamp(20px,2.4vw,28px)] font-extrabold tracking-[-0.025em]">
          Daarom bouwen wij geen campagne
        </h3>
        <p className="text-[15px] leading-relaxed text-brand-ink-2">
          Een losse campagne begint elke keer bij nul en stelt steeds dezelfde
          vier vragen: wie gaan we benaderen, via welk kanaal, wanneer bellen we,
          en wie lijkt geïnteresseerd? Een opportunity-engine houdt het antwoord
          doorlopend bij.
        </p>
      </Reveal>

      <Reveal className="mt-8">
        <div className="overflow-hidden rounded-brand border border-brand-line bg-brand-paper">
          <div className="grid grid-cols-2">
            <div className="border-r border-brand-line px-5 py-3.5 sm:px-7">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-ink-3">
                Los kanaal
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

      {/* De zin waar de hele sectie op uitkomt. */}
      <Reveal className="mt-12 border-t border-brand-line pt-8">
        <p className="max-w-[42rem] font-display text-[clamp(19px,2.2vw,26px)] font-extrabold leading-[1.25] tracking-[-0.025em]">
          Stop met vragen welk kanaal de lead heeft gemaakt. Kijk welke
          combinatie van signalen de opportunity zichtbaar maakte.
        </p>
      </Reveal>
    </Section>
  );
}

/* ── 02 · Wat wij voor u bouwen ─────────────────────────────────────────── */

export function WatWijBouwen() {
  const kaarten = [
    {
      label: "Fundament",
      title: "Uw commerciële datamodel",
      body: "Eén centrale laag met account en opportunity als kernobjecten. Uw CRM blijft het system of record; wij ontwerpen en bouwen de laag die bepaalt wat data betekent.",
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
      body: "De infrastructuur blijft staan, de hypothese verandert. Dezelfde engine gaat door naar een nieuwe propositie, een nieuwe markt of een partnerroute.",
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
        lead="Wij leveren geen losse tooling en geen losse campagne. Wij beginnen bij uw commerciële werkelijkheid — uw klantprofielen, segmenten, proposities en wat vandaag al werkt — en bouwen daaromheen het proces, de koppelingen en de intelligentie op de beslismomenten."
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
      title: "Groei zit niet alleen in nieuwe klanten",
      body: "Ook in bestaande klanten, cross-sell, upsell, een nieuwe propositie, een nieuwe markt of een partnerroute. Welke opportunity-types voor u gelden, brengen wij vooraf samen in kaart.",
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
  return (
    <Section tone="mist">
      <PrincipeScroller
        items={items}
        kop={
          <SectionHeader
            eyebrow="Wat ons anders maakt"
            title={
              <>
                Wij zijn geen platform.
                <br className="hidden sm:block" /> Wij zijn engineers.
              </>
            }
            lead="Het verschil zit niet in de tools, die kan iedereen kopen. Het zit in het proces eromheen: welke kansen u formuleert, welk bewijs u telt en wanneer u een mens inzet."
          />
        }
      />

      {/* De trechter wisselt van markt: dezelfde vorm, andere maat. */}
      <Reveal className="mt-14">
        <MarktTrechter />
      </Reveal>
    </Section>
  );
}

/* ── 04 · De diensten als bento ────────────────────────────────────────── */

/**
 * De diensten in drie lagen: bovenin de drie manieren om de markt in te gaan,
 * daaronder het fundament waar ze alle drie op rusten, en onderaan alles bij
 * elkaar. `breed` legt een kaart over de volle breedte met het beeld ernaast
 * in plaats van erboven; dat leest als een band onder de drie erboven.
 */
const DIENSTEN = [
  {
    rol: "Nieuwe markten",
    naam: "Outbound",
    body: "Markt in kaart, hypotheses per segment, multichannel activatie en opvolging. Voor groei buiten uw bestaande klantenbestand.",
    mock: <MockSequence />,
  },
  {
    rol: "Named accounts",
    naam: "ABM",
    body: "Een afgebakende lijst, per account een eigen hypothese en een route naar de juiste beslisser.",
    mock: <MockPipeline />,
  },
  {
    rol: "Lange adem",
    naam: "Nurturing",
    body: "Accounts met fit maar zonder timing blijven in beeld tot het bewijs stapelt.",
    mock: <MockRadar />,
  },
  {
    rol: "Fundament",
    naam: "RevOps",
    body: "Datamodel, CRM-inrichting, routing en rapportage. Hier rusten de drie hierboven op; zonder dit blijft de rest handwerk.",
    mock: <MockChecklist />,
    breed: true,
  },
  {
    rol: "Alles samen",
    naam: "GTM as a Service",
    body: "De vier diensten op één engine, van signaal tot hand-off met reason codes. Vanaf € 1.500 per maand.",
    mock: <MockHandoff />,
    breed: true,
    highlight: true,
  },
];

/**
 * De diensten als bento-raster, elk met een miniatuur dat laat zien wat de
 * dienst doet. Opbouw naar het model van daliagents.com: beeld boven, kopregel
 * met pijl, korte omschrijving, en een gordijn dat de sectie openschuift.
 */
function DienstKop({ rol, naam, body }: { rol: string; naam: string; body: string }) {
  return (
    <>
      <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
        {rol}
      </p>
      <div className="mb-2 flex items-start justify-between gap-4">
        <h3 className="font-display text-lg font-bold leading-snug tracking-[-0.015em]">{naam}</h3>
        <span aria-hidden className="text-brand-ink-3">
          ↗
        </span>
      </div>
      <p className="max-w-[52ch] text-[13.5px] text-brand-ink-2">{body}</p>
    </>
  );
}

export function Diensten() {
  return (
    <Section id="diensten" tone="mist" className="v2-gordijn">
      <SectionHeader
        eyebrow="Wat u koopt"
        title="Ontwerpt en bouwt"
        lead="B2B Groeimachine ontwerpt en bouwt het systeem achter uw sales, marketing en RevOps. 90 dagen als pilot. Daarna maandelijks opzegbaar."
      />
      <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
        {DIENSTEN.map((dienst, i) => (
          <Reveal
            key={dienst.naam}
            index={i}
            className={`h-full ${dienst.breed ? "sm:col-span-2 lg:col-span-3" : ""}`}
          >
            <article
              className={`flex h-full flex-col overflow-hidden rounded-brand border bg-brand-paper ${
                dienst.highlight ? "border-brand-accent" : "border-brand-line"
              }`}
            >
              <span
                aria-hidden
                className={`h-[3px] w-full ${dienst.highlight ? "bg-brand-accent" : "bg-brand-ink"}`}
              />
              {dienst.breed ? (
                <div className="flex grow flex-col lg:flex-row lg:items-center">
                  <div className="shrink-0 p-4 lg:w-[42%]">{dienst.mock}</div>
                  <div className="flex grow flex-col px-6 pb-7 pt-1 lg:py-6 lg:pl-2 lg:pr-6">
                    <DienstKop {...dienst} />
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-4">{dienst.mock}</div>
                  <div className="flex grow flex-col px-6 pb-7 pt-1">
                    <DienstKop {...dienst} />
                  </div>
                </>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ── 02 · Klantenraster ────────────────────────────────────────────────── */

interface KlantLogo {
  id: string;
  name: string;
  domain: string;
  logo_url: string | null;
  scale: number | null;
  padding: number | null;
  website: string | null;
  sector: string | null;
}

function Logo({ klant, hoogte = 34 }: { klant: KlantLogo; hoogte?: number }) {
  const [mislukt, setMislukt] = useState(false);
  const src = klant.logo_url || faviconFor(klant.website || klant.domain);
  if (mislukt || !src) {
    return (
      <span className="text-center font-display text-[14px] font-bold leading-tight text-brand-ink-3">
        {klant.name}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={klant.name}
      loading="lazy"
      decoding="async"
      onError={() => setMislukt(true)}
      className="w-auto max-w-[120px] object-contain opacity-70 transition duration-[180ms] group-hover:opacity-100"
      style={{
        height: hoogte,
        transform: `scale(${klant.scale ?? 1})`,
        padding: `${klant.padding ?? 0}px`,
        imageRendering: "-webkit-optimize-contrast",
      }}
    />
  );
}

/**
 * Klantenraster met een voorbeeldkaart die de cursor volgt, naar het model van
 * daliagents.com. De logo's komen uit dezelfde `client_logos`-tabel als
 * /klanten, inclusief de per klant ingestelde schaal en padding; de admin
 * blijft de enige plek waar je ze beheert. De kaart is puur decoratief en
 * verschijnt alleen op een apparaat met een muis.
 */
export function Klantenraster() {
  const navigate = useNavigate();
  const [klanten, setKlanten] = useState<KlantLogo[]>([]);
  const bol = useBolMaten();

  useEffect(() => {
    let levend = true;
    supabase
      .from("client_logos")
      .select("id, name, domain, logo_url, scale, padding, website, sector")
      .eq("is_visible", true)
      .order("sort_order")
      .then(({ data }) => {
        if (levend) setKlanten((data as KlantLogo[]) ?? []);
      });
    return () => {
      levend = false;
    };
  }, []);

  if (klanten.length === 0) return null;

  return (
    <Section id="klanten">
      <SectionHeader
        eyebrow="Vertrouwd door"
        title="Draait bij B2B-organisaties die hun markt kennen."
        lead="Industriële toeleveranciers, technische dienstverleners en zakelijke dienstverleners in de Benelux. Bekijk per klant welke hypothese we hebben getest en wat eruit kwam."
      />

      {bol.mobiel ? (
        /* Op mobiel stottert de 3D-bol; toon dan de eenvoudige logo-slider. */
        <InfiniteSlider
          speed={38}
          items={[...klanten, ...klanten, ...klanten].map((k, i) => (
            <button
              key={`${k.id}-${i}`}
              type="button"
              onClick={() => navigate("/klanten")}
              className="flex h-20 w-32 items-center justify-center rounded-xl border border-black/10 bg-white/60 px-4"
            >
              <Logo klant={k} hoogte={40} />
            </button>
          ))}
        />
      ) : (
      <div className="flex justify-center">
        <SphereImageGrid
          className="mx-auto"
          images={klanten
            .map((k) => ({
              id: k.id,
              src: k.logo_url || faviconFor(k.website || k.domain) || "",
              alt: k.name,
              title: k.name,
              description: k.sector || undefined,
            }))
            .filter((i) => i.src)}
          key={bol.containerSize}
          containerSize={bol.containerSize}
          sphereRadius={bol.sphereRadius}
          baseImageScale={bol.baseImageScale}
          hoverScale={bol.hoverScale}
          dragSensitivity={bol.dragSensitivity}
          momentumDecay={0.96}
          autoRotate
          autoRotateSpeed={bol.autoRotateSpeed}
          showModal={false}
          onImageClick={() => navigate("/klanten")}
        />
      </div>
      )}


      <Reveal className="mt-10">
        <Button href="/klanten" variant="outline">
          Bekijk de klanten
        </Button>
      </Reveal>
    </Section>
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
  /**
   * De drie stappen als tijdlijn. Alleen bij de afspraak staat een portret,
   * omdat dat gesprek er echt één met Peter is. Voor de bouw en de toets
   * hebben wij geen foto van een echte collega; die stappen tonen zolang hun
   * statusteken. Zet er een `image` bij zodra de portretten er zijn.
   */
  const stappen: TimelineItem[] = [
    {
      category: "Vooraf vastgelegd",
      title: "De afspraak",
      description:
        "Voor er één regel wordt gebouwd, staat op papier wat 'live' betekent in uw situatie.",
      status: "completed",
      badge: "Vooraf",
      rows: [
        ["Doelmarkt en ICP", "vastgelegd"],
        ["Opportunity-hypotheses", "vastgelegd"],
        ["Definitie van live", "vastgelegd"],
      ],
    },
    {
      category: "Dag 1 tot 30",
      title: "De bouw",
      description:
        "Wij ontwerpen en bouwen op uw eigen data en CRM. U ziet elke week wat er staat en wat er nog mist.",
      status: "current",
      badge: "Tijdens",
      rows: [
        ["Datamodel", "gebouwd"],
        ["Connectors", "aangesloten"],
        ["Eerste flow", "draait"],
      ],
    },
    {
      category: "Dag 30",
      title: "De toets",
      description: "U legt de werkelijkheid naast de afspraak. Niet wij, u.",
      status: "upcoming",
      badge: "U beoordeelt",
      rows: [
        ["Engine draait", "u bevestigt"],
        ["Accounts in CRM", "u bevestigt"],
        ["Reason codes kloppen", "u beoordeelt"],
      ],
    },
    {
      category: "Daarna",
      title: "Twee uur per week bij u",
      description:
        "Wij zitten wekelijks bij u aan tafel met sales. Uitkomsten gaan terug het systeem in en elke week sturen we bij.",
      status: "upcoming",
      badge: "Doorlopend",
      rows: [
        ["Wekelijks overleg", "op locatie"],
        ["Uitkomsten terug", "het systeem in"],
        ["Na 90 dagen", "maandelijks opzegbaar"],
      ],
    },
  ];
  // De prijs is geen gok en geen weddenschap: het zijn onze uren, de tools die
  // eronder draaien en het sturen ervan. Daarom staat de opbouw er gewoon.
  const prijsopbouw = [
    {
      label: "Onderdeel",
      kop: "Onze uren",
      body: "Het bouwen, het wekelijks bijsturen en de twee uur die wij bij u aan tafel zitten. Het grootste deel van de prijs.",
    },
    {
      label: "Onderdeel",
      kop: "De tools",
      body: "Data, verrijking, verzending en CRM-koppelingen. Wij rekenen de onkosten door die wij zelf voor uw engine maken.",
    },
    {
      label: "Onderdeel",
      kop: "Done for you",
      body: "Wij sturen en ondersteunen. U hoeft geen tool te leren bedienen en geen operator aan te nemen om het draaiend te houden.",
      ons: true,
    },
  ];
  return (
    <Section id="pilot" tone="mist">
      <TimelineStack
        items={stappen}
        avatar={peterGrisel}
        avatarAlt="Peter Grisel"
        kop={
          <SectionHeader
            eyebrow="Zo werkt de pilot"
            title="Binnen 30 dagen live. 90 dagen testen, leren en optimaliseren. Daarna onbeperkt schaalbaar."
          />
        }
        className="max-w-[58rem]"
      />

      {/* Waar het geld heen gaat. Geen garantieconstructie, gewoon de opbouw. */}
      <Reveal className="mt-14">
        <h3 className="mb-6 font-display text-[clamp(20px,2.4vw,28px)] font-extrabold tracking-[-0.025em]">
          Waar de prijs uit bestaat
        </h3>
        <div className="grid gap-[22px] md:grid-cols-3">
          {prijsopbouw.map((p) => (
            <article
              key={p.kop}
              className={`overflow-hidden rounded-brand border bg-brand-paper ${
                p.ons ? "border-brand-accent" : "border-brand-line"
              }`}
            >
              <span
                aria-hidden
                className={`block h-[3px] w-full ${p.ons ? "bg-brand-accent" : "bg-brand-ink"}`}
              />
              <div className="p-6">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-3">
                  {p.label}
                </p>
                <p className="mt-2 font-display text-[22px] font-black tracking-[-0.03em]">
                  {p.kop}
                </p>
                <p className="mt-2 text-[13.5px] text-brand-ink-2">{p.body}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-5 text-[13.5px] text-brand-ink-2">
          Geen opstartkosten. 90 dagen samen bouwen, testen en verbeteren.
          Daarna maandelijks opzegbaar.
        </p>
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
      body: "De engine draait binnen dertig dagen op uw eigen data en CRM. Wij sturen en ondersteunen, na negentig dagen is het maandelijks opzegbaar, en wat er gebouwd is blijft van u.",
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
        title="Geen kleine lettertjes."
        lead="Nul opstartkosten. De prijs bestaat uit onze uren en de onkosten voor de tools die onder uw engine draaien; wij sturen en ondersteunen het geheel. Wij draaien negentig dagen als pilot, daarna is het maandelijks opzegbaar. Draait u al omzet maar mist u het systeem? Dan is er een performance partnership met lage techkosten en een gedeelde upside."
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

/* ── 11 · Wie zit erachter ──────────────────────────────────────────────── */

export function WieZitErachter() {
  // Waar de zoektocht naar een standaard concreet wordt. Drie beloftes die
  // elkaar opvolgen: hetzelfde model, snel opgezet, en elke week hetzelfde.
  const standaard = [
    {
      kop: "Eén model, elke klant",
      body: "Dezelfde acht stappen van markt tot learning. Niet omdat elke markt hetzelfde is, maar omdat de manier van bouwen dat wel moet zijn.",
    },
    {
      kop: "In dagen opgezet",
      body: "Na de kickoff staat de technische inrichting er in gemiddeld vijf werkdagen. Geen half jaar implementatie voordat er iets draait.",
    },
    {
      kop: "Elke week hetzelfde ritme",
      body: "Twee uur per week bij u aan tafel met sales. Wat daar wordt besloten, gaat terug het systeem in. Dezelfde mensen, elke week.",
    },
  ];
  return (
    <Section tone="mist">
      <SectionHeader
        eyebrow="Wie zit erachter"
        title="Er zitten proces engineers achter, geen marketing bureau."
        lead="B2B Groeimachine is het GTM-label van Rebel Force. Wat u koopt is geen abonnement op software, maar een klein team dat het bij u komt bouwen en daarna elke week meekijkt."
      />

      {/* Peter aan het woord. Zijn foto is de enige die wij hebben; komen er
          teamportretten bij, dan passen ze in dezelfde rij. */}
      <Reveal>
        <div className="overflow-hidden rounded-brand border border-brand-line bg-brand-paper">
          <span aria-hidden className="block h-[3px] w-full bg-brand-accent" />
          <div className="grid gap-8 px-7 py-[30px] md:grid-cols-[auto_1fr] md:gap-10 md:px-9 md:py-9">
            <div className="flex items-center gap-4 md:block">
              <img
                src={peterGrisel}
                alt="Peter Grisel"
                width={120}
                height={120}
                loading="lazy"
                className="h-[76px] w-[76px] rounded-brand object-cover md:h-[120px] md:w-[120px]"
              />
              <div className="md:mt-4">
                <p className="font-display text-[17px] font-bold tracking-[-0.015em]">
                  Peter Grisel
                </p>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-ink-3">
                  Oprichter · Rebel Force
                </p>
              </div>
            </div>
            <blockquote className="space-y-4 text-[15px] leading-relaxed text-brand-ink-2">
              <p>
                &ldquo;Ik heb te veel commerciële trajecten gezien die bij elke
                klant weer bij nul begonnen. Een andere tool, een andere lijst,
                een ander draaiboek — en een half jaar later wist niemand meer
                waarom iets had gewerkt. Dat is geen commercie, dat is
                knutselen.&rdquo;
              </p>
              <p>
                &ldquo;Ik ben op zoek gegaan naar een standaard. Iets dat in
                dagen staat in plaats van in maanden, dat bij de volgende klant
                hetzelfde werkt, en dat elke week een beetje scherper wordt
                omdat de uitkomsten er weer in gaan. Die standaard is deze
                engine geworden.&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-y-6 sm:grid-cols-3 sm:gap-x-10 sm:gap-y-0">
        {standaard.map((s, i) => (
          <Reveal
            key={s.kop}
            index={i}
            className={`border-t-[3px] pt-[22px] ${i === 0 ? "border-brand-accent" : "border-brand-line"}`}
          >
            <h3 className="mb-2 font-display text-[19px] font-bold tracking-[-0.015em]">
              {s.kop}
            </h3>
            <p className="text-[13.5px] text-brand-ink-2">{s.body}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-brand-line pt-8">
        <p className="max-w-[46ch] text-[14px] text-brand-ink-2">
          Achter de engine zit het model en de bouw. Allebei staan ze open ter
          inzage.
        </p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link
            to="/de-engine"
            className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-accent-ink transition-colors duration-[180ms] hover:text-brand-accent"
          >
            Lees de onderbouwing <span aria-hidden>→</span>
          </Link>
          <Link
            to="/werkomgeving"
            className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-accent-ink transition-colors duration-[180ms] hover:text-brand-accent"
          >
            Kijk mee in de werkomgeving <span aria-hidden>→</span>
          </Link>
        </div>
      </Reveal>
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
      {/* Sfeerlaag: een bol die linksonder half uit het kader komt, tegenover
          het woord rechts. Maat in vw zodat er op elk breed scherm evenveel
          van te zien is. Decoratief, dus niet sleepbaar en klikken gaan er
          doorheen naar de knoppen. */}
      <Globe
        interactief={false}
        config={GLOBE_SFEER_CONFIG}
        className="pointer-events-none absolute bottom-[-20vw] left-[-13vw] hidden size-[46vw] max-w-none opacity-40 mix-blend-screen lg:block"
      />
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
              Boek een gratis call
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
