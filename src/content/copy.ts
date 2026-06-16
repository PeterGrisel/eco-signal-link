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
  "https://meetings-eu1.hubspot.com/peter-grisel";

/** CTA-labels en hun bijbehorende doel-URL */
export const CTA = {
  /** Hoofd-CTA: gebruikt in hero, navbar, sticky, sections */
  gratisScan: {
    label: "Plan uw Groeiplan-sessie →",
    labelShort: "Plan Groeiplan-sessie",
    href: "#boek-gratis-scan",
    external: false,
  },
  /** Tertiaire CTA: situatie bespreken (in body-tekst) */
  bespreekSituatie: {
    label: "Plan uw Groeiplan-sessie →",
    href: "#boek-gratis-scan",
    external: false,
  },
  /** Enterprise: mag direct door naar de agenda, geen pre-check */
  enterpriseAgenda: {
    label: "Plan direct in agenda →",
    href: BOOKING_URL,
    external: true,
  },
} as const;

/** Vaste propositie- en sectie-teksten die meerdere keren voorkomen */
export const COPY = {
  proposition: {
    heroEyebrow: "Nieuwe positionering",
    heroTitle: "Ontvang uw 1-Pagina Groeiplan",
    heroBody:
      "In een sessie van 60 minuten brengen we uw commerciële groeimotor terug naar één helder A4: doelgroep, boodschap, kanalen, opvolging, conversie, klantwaarde en referral.",
    heroBodyExtra:
      "Geen lange strategie. Wel een praktisch groeiplan waarmee u direct ziet waar groei nu lekt en waar de meeste commerciële hefboom zit.",
    ctaSubtext:
      "Na afloop ontvangt u uw 1-Pagina Groeiplan: negen vakken, drie fases en één concreet commercieel verhaal voor uw bedrijf.",
    signalHeading:
      "Samen scherpen we uw commerciële groeimotor aan",
    signalSubtext:
      "Geen algemene demo. We kijken welke doelgroep, boodschap en kanalen het meest opleveren.",
  },
  heroProof: {
    items: [
      "60 minuten",
      "Vrijblijvend",
      "Direct met Peter",
      "1-Pagina Groeiplan na afloop",
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
        a: "Minimum 3 maanden, daarna maandelijks opzegbaar. U houdt alle data, draaiboeken en flows. Geen lock-in op onze tools.",
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
    headingAccent: "1-Pagina Groeiplan?",
    body:
      "60 minuten samen. U ontvangt een praktisch A4 met de belangrijkste commerciële keuzes en verbeterpunten.",
    speakWith: "Spreek direct met Peter",
    fineprint: "",
  },
  process: {
    eyebrow: "Van pre-check tot Groeiplan",
  },
  groeiplan: {
    eyebrow: "Het 1-Pagina Groeiplan",
    heading: "Negen vakken. Drie fases.",
    headingAccent: "Eén helder commercieel verhaal.",
    body:
      "In een sessie van 60 minuten brengen we in kaart wie uw ideale klant is, welke boodschap werkt, via welke kanalen u de markt bereikt en hoe interesse wordt omgezet naar gesprekken, deals en klantwaarde.",
    bodyExtra:
      "U ontvangt geen abstract adviesrapport, maar een concreet groeiplan dat laat zien waar uw commerciële motor sterker kan worden.",
    fases: [
      { label: "Voor", sub: "Prospect" },
      { label: "Tijdens", sub: "Lead" },
      { label: "Na", sub: "Klant" },
    ],
    cells: [
      { num: "01", title: "Mijn doelmarkt", q: "Wie is mijn ideale klant en wie nadrukkelijk niet?" },
      { num: "02", title: "Mijn boodschap", q: "Welk probleem los ik op, in de woorden van mijn klant?" },
      { num: "03", title: "Mijn kanalen", q: "Waar bereik ik mijn koper en in welke volgorde?" },
      { num: "04", title: "Mijn vangmechanisme", q: "Hoe vang ik elke vorm van interesse?" },
      { num: "05", title: "Mijn opwarmsysteem", q: "Hoe bouw ik vertrouwen op tot het koopmoment?" },
      { num: "06", title: "Mijn conversiestrategie", q: "Hoe wordt een warm gesprek een getekende deal?" },
      { num: "07", title: "Mijn klantervaring", q: "Hoe lever ik een ervaring die wordt doorverteld?" },
      { num: "08", title: "Mijn klantwaarde", q: "Hoe groeit de waarde per klant, maand op maand?" },
      { num: "09", title: "Mijn referralmotor", q: "Hoe organiseer ik aanbevelingen, in plaats van erop te hopen?" },
    ],
    flow: [
      { step: "1", title: "Korte pre-check", text: "Een paar vragen over uw bedrijf, doelgroep en commerciële uitdaging." },
      { step: "2", title: "60-minuten Groeiplan-sessie", text: "Samen scherpen we uw doelgroep, boodschap, kanalen, opvolging en conversie aan." },
      { step: "3", title: "1-Pagina Groeiplan", text: "U krijgt een praktisch A4 mee met de belangrijkste commerciële keuzes en verbeterpunten." },
    ],
  },
} as const;

export type CtaKey = keyof typeof CTA;