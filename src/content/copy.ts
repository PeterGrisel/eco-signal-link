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
  gratisScan: {
    label: "Boek gratis scan →",
    labelShort: "Boek gratis scan",
    href: "#boek-gratis-scan",
    external: false,
  },
  /** Soft CTA: hoe het werkt anker */
  hoeHetWerkt: {
    label: "Hoe het werkt",
    href: "#hoe-het-werkt",
    external: false,
  },
  /** Tertiaire CTA: situatie bespreken (in body-tekst) */
  bespreekSituatie: {
    label: "Boek gratis scan →",
    href: "#boek-gratis-scan",
    external: false,
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
      "60 minuten",
      "Vrijblijvend",
      "Direct met Peter",
      "Werkende kaart binnen 5 dagen",
    ],
  },
  methode: {
    eyebrow: "De methode",
    heading: "Acht stappen.",
    headingAccent: "Eén werkend groeisysteem.",
    body: "Van commerciële context naar schaalbare actie. Eén setup vormt de basis. Elke volgende module bouwt erop voort.",
    layers: [
      { number: "01", title: "Context & ICP vastleggen", line: "Data, processen, markt en klantkennis bij elkaar brengen.", output: "U krijgt: één bron van waarheid voor uw markt." },
      { number: "02", title: "Commercieel Brein bouwen", line: "ICP, signalen, segmenten en regels in één laag.", output: "U krijgt: herbruikbare intelligentie voor elke beweging." },
      { number: "03", title: "Segmenteren & verrijken", line: "Doelgroepen dynamisch vinden, filteren en prioriteren.", output: "U krijgt: scherpe lijsten op fit, context, intent en timing." },
      { number: "04", title: "Schaal & volume definiëren", line: "Accounts, contacten, touchpoints, ratio's en capaciteit.", output: "U krijgt: een rekenmodel van markt naar pipeline." },
      { number: "05", title: "Funnel activeren", line: "Markt naar targets, engagement en opportunities.", output: "U krijgt: een lopende funnel met meetbare overgangen." },
      { number: "06", title: "Modules inzetten", line: "LinkedIn, email, telefoon, video, nurture en afspraken.", output: "U krijgt: kanalen die samenwerken in plaats van losse acties." },
      { number: "07", title: "Routeren naar sales", line: "SDR, AM, inside sales, founder-led, CRM en dashboard.", output: "U krijgt: de volgende beste actie, in uw eigen workflow." },
      { number: "08", title: "Monitoren & lerende loops", line: "Pipeline, rapportage, attributie en optimalisatie.", output: "U krijgt: een systeem dat iedere cyclus slimmer wordt." },
    ],
  },
  schaal: {
    eyebrow: "Schaal in cijfers",
    heading: "Van markt",
    headingAccent: "naar pijplijn.",
    body: "Een voorbeeld: zo loopt 2.000 bedrijven binnen uw ICP door de funnel. Niet gegokt; ontworpen.",
    steps: [
      { label: "Bedrijven in de funnel", value: "2.000", unit: "bedrijven", note: "ICP-fit en verrijkt" },
      { label: "Beslissers benaderd", value: "4.000", unit: "contacten", note: "Op meerdere kanalen" },
      { label: "Accounts in beweging", value: "200", unit: "in beweging", note: "Engagement boven drempel" },
      { label: "Gesprekken per maand", value: "20", unit: "afspraken", note: "Met sales-bevoegd contact" },
      { label: "Pipeline toegevoegd", value: "€500k", unit: "pipelinewaarde", note: "Op kwartaalbasis" },
    ],
    fineprint: "Geen belofte. Een rekenmodel. Tijdens de scan vullen we het in met uw eigen markt, ICP en uitgangscijfers.",
  },
  vergelijking: {
    eyebrow: "Twee manieren",
    heading: "Standaard methode",
    headingAccent: "of een lerend systeem.",
    body: "Eén is handmatig en lineair. De andere is verbonden, signaal-gedreven en schaalbaar.",
    standaard: {
      title: "Standaard methode",
      tag: "Handmatig · Lineair",
      points: [
        "Lijst bouwen uit een database.",
        "Handmatig verrijken, tijdrovend.",
        "Eén boodschap, lage relevantie.",
        "Sales pakt op als er tijd is.",
        "Een paar replies leveren afspraken.",
        "Opnieuw beginnen met nieuwe lijst.",
      ],
      footer: "Onvoorspelbaar. Hoge inspanning. Beperkte schaal.",
    },
    groeimachine: {
      title: "B2BGroeimachine",
      tag: "Systeem · Signaal-gedreven",
      points: [
        "Eén Commercieel Brein voor uw markt.",
        "Dynamische ICP en automatische verrijking.",
        "Signalen sturen het juiste moment.",
        "Kanalen werken samen, niet los.",
        "Sales krijgt de volgende beste actie.",
        "Iedere cyclus maakt het systeem slimmer.",
      ],
      footer: "Compound. Lerend. Schaalbaar.",
    },
  },
  miniFaq: {
    eyebrow: "Voor u boekt",
    heading: "De vier vragen die u nu stelt.",
    items: [
      {
        q: "Hoe lang voor ik resultaat zie?",
        a: "Eerste 30 dagen: scan en kaart. Dag 30 tot 60: eerste flows live. Dag 60 tot 90: meetbare beweging in uw pijplijn.",
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
        a: "Zes maanden opzegbaar. U houdt alle data, draaiboeken en flows. Geen lock-in op onze tools.",
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
    headingAccent: "gratis scan?",
    body:
      "60 minuten. Wij brengen uw proces in kaart en laten zien waar de winst zit. Geen verkoopgesprek.",
    speakWith: "Spreek direct met Peter",
    fineprint: "€0 · 60 minuten · Vrijblijvend",
  },
  process: {
    eyebrow: "Van scan tot resultaat",
  },
} as const;

export type CtaKey = keyof typeof CTA;