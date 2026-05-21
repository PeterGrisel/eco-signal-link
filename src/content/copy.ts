/**
 * Centrale bron voor alle marketing-copy en CTA-variabelen.
 * Wijzig hier → consistent op de hele site.
 *
 * Regels:
 * - Geen em-dashes (gebruik —‐vrij; gebruik puntkomma of nieuwe zin)
 * - B1 Nederlands, max 12 woorden per zin, 'u/uw'
 * - CTA-labels: minimalistisch, geen specifieke meeting-belofte
 */

export const BOOKING_URL =
  "https://app.usemotion.com/meet/Rebel-Force/meeting";

/** CTA-labels en hun bijbehorende doel-URL */
export const CTA = {
  /** Hoofd-CTA: gebruikt in hero, navbar, sticky, sections */
  nulmeting: {
    label: "Plan de nulmeting →",
    labelShort: "Plan de nulmeting",
    href: BOOKING_URL,
    external: true,
  },
  /** Soft CTA: hoe het werkt anker */
  hoeHetWerkt: {
    label: "Hoe het werkt",
    href: "#hoe-het-werkt",
    external: false,
  },
  /** Tertiaire CTA: situatie bespreken (in body-tekst) */
  bespreekSituatie: {
    label: "Bespreek uw situatie →",
    href: BOOKING_URL,
    external: true,
  },
} as const;

/** Vaste propositie- en sectie-teksten die meerdere keren voorkomen */
export const COPY = {
  proposition: {
    heroBody:
      "Wij bouwen en beheren uw B2B groeimachine op uw eigen tools. Van marktdata en koopsignalen tot outreach, opvolging, CRM-discipline en geboekte gesprekken.",
    signalHeading:
      "Samen bepalen we welke signalen en reacties terechtkomen",
    signalSubtext:
      "Geen algemene demo. We kijken welke signalen bij uw ICP passen en hoe we die samen kwalificeren.",
  },
  heroProof: {
    items: [
      "30 minuten",
      "Vrijblijvend",
      "Direct met Peter",
      "Werkende kaart binnen 5 dagen",
    ],
  },
  methode: {
    eyebrow: "De methode",
    heading: "Vier lagen.",
    headingAccent: "Eén werkend systeem.",
    body: "Wij bouwen uw groeimachine in vier lagen. Elke laag levert iets op dat u kunt zien en sturen.",
    layers: [
      {
        number: "01",
        title: "Infrastructuur",
        line: "Uw tools en data worden één werkend geheel.",
        output: "U krijgt: stabiele CRM, schone data, gekoppelde kanalen.",
      },
      {
        number: "02",
        title: "Intelligence",
        line: "Wij vangen signalen op die uw markt afgeeft.",
        output: "U krijgt: dagelijkse lijst van bedrijven met koopintentie.",
      },
      {
        number: "03",
        title: "Engagement",
        line: "Outreach en opvolging draaien geautomatiseerd.",
        output: "U krijgt: gestructureerde gesprekken op het juiste moment.",
      },
      {
        number: "04",
        title: "Kwalificatie",
        line: "Alleen passende gesprekken belanden in uw agenda.",
        output: "U krijgt: voorspelbare flow van gekwalificeerde meetings.",
      },
    ],
  },
  miniFaq: {
    eyebrow: "Voor u boekt",
    heading: "De vier vragen die u nu stelt.",
    items: [
      {
        q: "Hoe lang voor ik resultaat zie?",
        a: "Eerste 30 dagen: nulmeting en kaart. Dag 30 tot 60: eerste flows live. Dag 60 tot 90: meetbare beweging in uw pijplijn.",
      },
      {
        q: "Wat als ik al een leadbureau heb?",
        a: "Dat blijft draaien. Wij bouwen het proces eronder. Lijsten worden lijsten in een systeem dat leert.",
      },
      {
        q: "Hoeveel tijd kost het mij intern?",
        a: "Eerste maand: 2 tot 3 uur per week. Daarna 1 uur per week voor sturing. Wij doen de uitvoering.",
      },
      {
        q: "Wat als het niet werkt?",
        a: "Drie maanden opzegbaar. U houdt alle data, draaiboeken en flows. Geen lock-in op onze tools.",
      },
    ],
  },
  noLeadAgency: {
    eyebrow: "Geen leadbureau",
    heading: "Geen lijsten. Geen trucje.",
    headingAccent: "Een systeem dat blijft staan.",
    body: "Een leadbureau levert lijsten. Wij bouwen het commerciële proces achter voorspelbare groei. Op uw eigen tools, in uw eigen CRM, met uw eigen data.",
    contrasts: [
      { from: "Losse lijsten en campagnes", to: "Eén systeem dat elke week leert" },
      { from: "Afhankelijk van personen", to: "Proces, data en discipline" },
      { from: "Tijdelijk pieken in pijplijn", to: "Structureel marktinzicht" },
    ],
  },
  datahubCore: {
    eyebrow: "Het brein achter uw groei",
    heading: "Iedere campagne levert data op.",
    headingAccent: "Iedere actie maakt het systeem slimmer.",
    body: "Datahub is geen dashboard. Het is uw commerciële geheugen. Elke reactie, elke afspraak en elk signaal verrijkt het systeem dat uw markt benadert.",
  },
  ctaSection: {
    headingLine1: "Klaar voor uw",
    headingAccent: "nulmeting?",
    body:
      "30 minuten. Wij brengen uw proces in kaart en laten zien waar de winst zit. Geen verkoopgesprek.",
    speakWith: "Spreek direct met Peter",
    fineprint: "€0 · 30 minuten · Vrijblijvend",
  },
  process: {
    eyebrow: "Van nulmeting tot resultaat",
  },
} as const;

export type CtaKey = keyof typeof CTA;