/**
 * Het prijsmodel van het commerciële brein.
 *
 * De redenering: elke functie neemt werk over. De uren die het team niet meer
 * hoeft te maken, maal wat een commerciële medewerker integraal kost, is de
 * waarde. De klant betaalt daar een derde van, all-in. Homepage en /pricing
 * rekenen allebei met deze lijst, zodat de bedragen nooit uiteenlopen.
 */

/** Integrale kosten van een commerciële medewerker per uur. */
export const UURKOSTEN = 60;
/** De klant betaalt waarde gedeeld door dit getal: rendement 3× op tijd alleen. */
export const ROI_DELER = 3;
/** De uren hieronder zijn geschat voor een commercieel team van deze omvang. */
export const BASISTEAM = 4;
/** Productieve uren per fte per maand, voor de omrekening naar fte. */
export const UREN_PER_FTE = 140;

export type BreinFunctie = {
  id: string;
  naam: string;
  /** Wat het team niet meer zelf doet. */
  wat: string;
  /** Bespaarde uren per maand voor een team van `BASISTEAM` mensen. */
  uren: number;
  /** Dienstpagina waar deze functie onder valt. */
  dienst: string;
};

export const FUNCTIES: BreinFunctie[] = [
  { id: "leads", naam: "Leads", wat: "Lijsten bouwen, bedrijven en beslissers zoeken, verrijken", uren: 30, dienst: "outreach-as-a-service" },
  { id: "outreach", naam: "Outreach", wat: "Berichten schrijven, versturen, opvolgen en reacties sorteren via mail en LinkedIn", uren: 60, dienst: "outreach-as-a-service" },
  { id: "taken", naam: "Taken", wat: "CRM bijwerken, opvolging, gespreksverslagen, offertes", uren: 40, dienst: "ai-automation" },
  { id: "reporting", naam: "Reporting", wat: "Exports verzamelen, rapportages maken, cijfers uitzoeken", uren: 16, dienst: "reporting" },
  { id: "content", naam: "Content planning", wat: "Posts, nieuwsbrieven en campagnes bedenken en inplannen", uren: 24, dienst: "ai-automation" },
  { id: "designer", naam: "Designer", wat: "Beeld en pagina's maken of laten maken", uren: 16, dienst: "ai-automation" },
  { id: "agents", naam: "Agents", wat: "Losse terugkerende taken die nu iemand handmatig doet", uren: 24, dienst: "ai-automation" },
  { id: "skilllab", naam: "Skilllab", wat: "Zelf uitzoeken, proberen en opnieuw beginnen met AI", uren: 10, dienst: "training" },
];

const rondAf = (n: number) => Math.round(n / 50) * 50;

/** Maandprijs van één functie: een derde van de waarde, afgerond op € 50. */
export const prijsVan = (f: BreinFunctie) => rondAf((f.uren * UURKOSTEN) / ROI_DELER);

export const functieOpId = (id: string) => FUNCTIES.find((f) => f.id === id)!;

export type BreinMenu = {
  naam: string;
  label: string;
  /** Functies in dit menu. */
  ids: string[];
  /** Korte inhoud voor op de kaart. */
  inhoud: string[];
  top?: boolean;
};

export const MENUS: BreinMenu[] = [
  {
    naam: "Brein Start",
    label: "Instap",
    ids: ["leads", "outreach"],
    inhoud: ["Leads: dagelijks passende bedrijven en beslissers", "Outreach via mail, 1 doelgroep"],
  },
  {
    naam: "Brein Groei",
    label: "Meest gekozen",
    ids: ["leads", "outreach", "taken", "reporting"],
    inhoud: [
      "Leads op basis van signalen",
      "Outreach via mail en LinkedIn, 2 doelgroepen",
      "Taken: AI-automatisering in sales en marketing",
      "Reporting: dashboards in Claude",
    ],
    top: true,
  },
  {
    naam: "Brein Scale",
    label: "Het hele brein",
    ids: FUNCTIES.map((f) => f.id),
    inhoud: [
      "Alles uit Groei, 3 tot 4 doelgroepen",
      "Content planning en Designer",
      "Agents en een eigen skilllab",
      "Tweewekelijkse sturing",
    ],
  },
];

/** Uren, waarde, prijs en rendement van een set functies. */
export function reken(ids: string[], uurkosten = UURKOSTEN, team = BASISTEAM) {
  const gekozen = ids.map(functieOpId);
  const uren = (gekozen.reduce((s, f) => s + f.uren, 0) * team) / BASISTEAM;
  const prijs = gekozen.reduce((s, f) => s + prijsVan(f), 0);
  const waarde = uren * uurkosten;
  return { uren, prijs, waarde, roi: prijs ? waarde / prijs : 0, fte: uren / UREN_PER_FTE };
}

export const LOSSE_POSTEN: { naam: string; uitleg: string; prijs: string }[] = [
  {
    naam: "Training in-company",
    uitleg: "AI-geletterdheid, AI-adoptie of AI-pilots voor leidinggevenden, op locatie, maximaal 12 deelnemers.",
    prijs: "€ 2.450 per dag",
  },
  {
    naam: "Training open inschrijving",
    uitleg: "Via Habeo+ (Avans+) of een ander opleidingscentrum.",
    prijs: "tarief opleider",
  },
  {
    naam: "CRM-inrichting",
    uitleg: "HubSpot of Pipedrive: pipelines, velden, rapportage.",
    prijs: "vanaf € 2.500 eenmalig",
  },
  {
    naam: "Extra uur",
    uitleg: "Nieuwe automatisering, campagne of analyse buiten het menu.",
    prijs: "€ 125",
  },
];

export const HUISREGELS: { kop: string; tekst: string }[] = [
  { kop: "Nul opstartkosten.", tekst: "90 dagen pilot, daarna maandelijks opzegbaar." },
  { kop: "Tools en beheer zitten erin.", tekst: "12 maanden vooruit betalen geeft 20% korting." },
  { kop: "Wat gebouwd is, blijft van u.", tekst: "Ook als u stopt." },
];

export const euro = (n: number) => `€ ${Math.round(n).toLocaleString("nl-NL")}`;
export const keer = (n: number) => `${n.toFixed(1).replace(".", ",")}×`;
