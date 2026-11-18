/**
 * Het verhaal van de digitale salesmedewerker, voor homepage en /pricing.
 *
 * Bron: de deck "Digitale salesmedewerker" (nov 2026), algemeen gemaakt.
 * Klantspecifieke namen, voorbeelden en benchmarks staan er bewust niet in.
 * Bedragen en teksten zijn afgestemd met Peter; niets toevoegen zonder bevestiging.
 */

/** De investering: één vast bedrag per maand, alles inbegrepen. */
export const MAANDPRIJS = 3000;
/** De basis duurt drie maanden. */
export const BASIS_MAANDEN = 3;

/** Het commerciële proces van markt tot behoud, met waar het lekt. */
export const PROCES_STAPPEN: { naam: string; lek: string }[] = [
  { naam: "Markt", lek: "Markt onzichtbaar" },
  { naam: "Awareness", lek: "Eén bericht, dan stilte" },
  { naam: "Signaal", lek: "Warm, maar niet gezien" },
  { naam: "Gesprek", lek: "Niet geconverteerd, vergeten" },
  { naam: "Klant", lek: "Geen contact meer" },
  { naam: "Behoud", lek: "" },
];

/** Ziet, denkt, doet: de drie delen van de digitale medewerker. */
export const ZIET = ["Websitebezoek", "LinkedIn-activiteit", "E-mail: opens, clicks, replies", "Vacatures en bedrijfsnieuws", "CRM"];
export const DOET = [
  "Lijsten bouwen en verrijken",
  "Content in een waterval",
  "Signalen scoren",
  "Overdragen aan de mens",
  "Nurturen en CRM bijwerken",
];

/** Wat er in het brein zit. */
export const BREIN: { naam: string; wat: string }[] = [
  { naam: "Klantprofielen", wat: "Fit: sector, omvang, regio, look-alikes van uw klanten." },
  { naam: "Proposities", wat: "Per dienst de invalshoek: waarom nu, welke pijn." },
  { naam: "Persona's", wat: "Wie beslist en wie beïnvloedt." },
  { naam: "Signalen en drempels", wat: "Wat telt, hoe zwaar, wanneer het vervalt." },
  { naam: "Regels en overdracht", wat: "Wanneer bellen, wie belt, wat naar nurture gaat." },
  { naam: "Toon en content", wat: "Hoe u schrijft en klinkt." },
];

/** De zes processen die de digitale medewerker aanstuurt. */
export const PROCESSEN: { nr: string; naam: string; wat: string }[] = [
  { nr: "01", naam: "Prospecting", wat: "Dynamische lijsten: look-alikes, vacatures, persona's." },
  { nr: "02", naam: "Activatie", wat: "Vijf tot zes contentvormen in een waterval, over 90 dagen." },
  { nr: "03", naam: "Signalen en score", wat: "Elk touchpoint gemeten, gestapeld en gewogen." },
  { nr: "04", naam: "Overdracht", wat: "Een warm signaal naar de beller of adviseur, met context." },
  { nr: "05", naam: "Nurturing en reactivatie", wat: "Nieuwsbrief, klanten en gemiste leads warm houden." },
  { nr: "06", naam: "CRM en rapportage", wat: "Alles vastgelegd. Ook offertes en orders, als u wilt." },
];

/** De drie ringen van signalen. */
export const RINGEN: { naam: string; wat: string; gewicht: string }[] = [
  { naam: "Eerste partij: eigen kanalen", wat: "Wat ze met u doen: website, mail, replies, CRM.", gewicht: "Gewicht: hoog" },
  { naam: "Tweede partij: platforms", wat: "Wat ze op LinkedIn met u en uw mensen doen.", gewicht: "Gewicht: midden" },
  { naam: "Derde partij: externe data", wat: "Wat er bij hen verandert: vacature, nieuwe rol, groei.", gewicht: "Geeft de reden om nu te praten" },
];

/** Van signaal naar actie. */
export const NIVEAUS: { naam: string; code: string; wat: string; actie: string }[] = [
  { naam: "Qualified", code: "Fit", wat: "Past bij uw klantprofiel.", actie: "Nurture: blijft warm via content." },
  { naam: "Target", code: "Fit + opportunity", wat: "Plus een reden om nu te praten, zoals een vacature.", actie: "Waterval loopt, LinkedIn-opvolging." },
  { naam: "Priority", code: "Fit + opportunity + timing", wat: "Plus een actueel signaal: klik, websitebezoek, reply.", actie: "Een mens belt, standaard binnen 24 uur." },
];

/** Wie doet wat. */
export const WIE_DOET_WAT: { label: string; punten: string[] }[] = [
  {
    label: "Zelfstandig",
    punten: ["Lijsten bouwen en verrijken", "Waterval versturen", "Signalen scoren", "Nurture en nieuwsbrief", "CRM bijwerken"],
  },
  {
    label: "Ter goedkeuring",
    punten: [
      "Nieuwe propositie of boodschap",
      "Content (copywriters toetsen)",
      "Drempels en opvolgnorm",
      "Klantprofielen",
    ],
  },
  {
    label: "Altijd de mens",
    punten: ["Het gesprek en de afspraak", "Beller of adviseur", "Voorstel en onderhandeling", "De relatie"],
  },
];

/** De eerlijke vergelijking. */
export const VERGELIJKING: { rij: string; medewerker: string; bureau: string; digitaal: string }[] = [
  { rij: "Wat u krijgt", medewerker: "Uren van één persoon", bureau: "Leads, tot de eerste hap", digitaal: "Het hele proces, markt tot behoud" },
  { rij: "Na de eerste reactie", medewerker: "Afhankelijk van drukte", bureau: "Stopt", digitaal: "Kwalificeert, volgt op, nurturet" },
  { rij: "Touchpoints", medewerker: "Wat iemand bijhoudt", bureau: "Eén goed bericht", digitaal: "Alle touchpoints gemeten" },
  { rij: "Timing", medewerker: "Gevoel", bureau: "Niet gemeten", digitaal: "Signaal + drempel = actie" },
  { rij: "Kennis", medewerker: "Vertrekt mee", bureau: "Blijft bij het bureau", digitaal: "Op uw eigen data en CRM" },
  { rij: "Opschalen", medewerker: "Nieuwe vacature", bureau: "Nieuwe opdracht", digitaal: "Nieuwe propositie, zelfde brein" },
  { rij: "Kosten", medewerker: "€ 55k tot 70k loonkosten per jaar", bureau: "Per campagne", digitaal: "€ 3.000 per maand, alles inbegrepen" },
];

/** Breder dan sales: wat er na de basis kan volgen. */
export const DOMEINEN: { naam: string; wat: string; start?: boolean }[] = [
  { naam: "Sales", wat: "Prospecting, opvolging, overdracht.", start: true },
  { naam: "Marketing", wat: "Content, nieuwsbrief, campagnes." },
  { naam: "Klantcontact", wat: "Vragen, status, terugbelverzoeken." },
  { naam: "Finance en administratie", wat: "Facturatie, herinneringen, rapportage." },
  { naam: "Operations", wat: "Orders, planning, voorraad." },
  { naam: "HR", wat: "Werving, onboarding, verlof." },
];

/** Gefaseerd: begin bij de pijn, breid uit als het bewezen is. */
export const FASEN: { fase: string; naam: string; punten: string[]; start?: boolean }[] = [
  {
    fase: "Fase 1",
    naam: "Leadgeneratie en opvolging",
    start: true,
    punten: ["Eén propositie, één klantprofiel", "ICP-sessie met uw team", "Waterval, score en overdracht", "Basis in 90 dagen, KPI's vooraf"],
  },
  {
    fase: "Fase 2",
    naam: "Nurturing en reactivatie",
    punten: ["Nieuwsbrief voor klanten", "Niet-geconverteerde leads", "Oude belacties opnieuw warm", "Meer proposities en profielen"],
  },
  {
    fase: "Fase 3",
    naam: "Volledige procesautomatisering",
    punten: ["Meekijken vanaf maand 3, of eerder", "CRM als één waarheid", "Ook offertes, orders of facturatie", "Zelf draaien met eigen team"],
  },
];

/** De eerste 90 dagen, per maand. */
export const NEGENTIG_DAGEN: { maand: string; titel: string; punten: string[] }[] = [
  {
    maand: "Maand 1",
    titel: "Fundament",
    punten: ["Kick-off en ICP-sessie, domeinen kopen en opwarmen", "CRM opschonen", "Klantprofiel op basis van uw eigen klanten", "Marktkaart in tiers", "Brein vullen: proposities, persona's, toon"],
  },
  {
    maand: "Maand 2",
    titel: "Engine",
    punten: ["Waterval-content: zes contentvormen, getoetst", "Signalen: vacatures, websitebezoek, LinkedIn", "Eerste golf live: één segment, één invalshoek", "Score en overdracht: warm signaal naar de beller"],
  },
  {
    maand: "Maand 3",
    titel: "Schalen",
    punten: ["Tweede kanaal: LinkedIn en bellen erbij", "Wekelijkse review en rapport", "Vastleggen en overdragen: elk proces als recept", "Meekijken: waar zit de volgende winst?"],
  },
];

/** Ook inbegrepen in het maandbedrag. */
export const OOK_INBEGREPEN: { naam: string; wat: string }[] = [
  { naam: "Software-aanschaf", wat: "Welke tool, welke licentie, wat u niet nodig heeft. Zonder vendor lock-in." },
  { naam: "AI en agentic", wat: "Wat een agent wél en niet kan, en waar u begint." },
  { naam: "Compliance", wat: "AVG, e-mailregels en AI-wetgeving, vóórdat het een probleem is." },
  { naam: "Data", wat: "Eigenaarschap, kwaliteit en één bron. Uw data blijft van u." },
];
