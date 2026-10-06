/**
 * Het prijsmodel van het commerciële brein.
 *
 * Naar buiten: één vaste prijs per abonnement, all-in (zie /pricing). De
 * rekensom hieronder is de interne onderbouwing van de bedragen.
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
  { id: "taken", naam: "Taken", wat: "CRM bijwerken, opvolging, gespreksverslagen", uren: 40, dienst: "ai-automation" },
  { id: "reporting", naam: "Reporting", wat: "Exports verzamelen, rapportages maken, cijfers uitzoeken", uren: 16, dienst: "reporting" },
  { id: "content", naam: "Content planning", wat: "Posts, nieuwsbrieven en campagnes bedenken en inplannen", uren: 24, dienst: "ai-automation" },
  // Uren gelijk aan de vervallen functie Designer, zodat de prijs van Brein Scale niet verandert.
  { id: "ads", naam: "Ads", wat: "Volledige 360-analyse van ads: de hele funnel in kaart, push en pull", uren: 16, dienst: "reporting" },
  { id: "agents", naam: "Agents", wat: "Losse terugkerende taken die nu iemand handmatig doet", uren: 24, dienst: "ai-automation" },
  { id: "skilllab", naam: "Skilllab", wat: "Zelf uitzoeken, proberen en opnieuw beginnen met AI", uren: 10, dienst: "training" },
];

const rondAf = (n: number) => Math.round(n / 50) * 50;

/** Maandprijs van één functie: een derde van de waarde, afgerond op € 50. */
export const prijsVan = (f: BreinFunctie) => rondAf((f.uren * UURKOSTEN) / ROI_DELER);

export const functieOpId = (id: string) => FUNCTIES.find((f) => f.id === id)!;

export type BreinMenu = {
  naam: string;
  /** Functies waarop de prijs is gebaseerd (interne rekensom). */
  ids: string[];
  /** Vaste maandprijs, als die afwijkt van de rekensom. */
  prijs?: number;
  /** Voor wie dit abonnement is. */
  voorWie: string;
  /** "Alles van Start, plus", leeg bij het eerste abonnement. */
  opbouw?: string;
  /** Welk deel van het proces het brein overneemt. */
  kern: string;
  /** Wat dat concreet is. */
  wat: string;
  /** Wat er verder in zit. */
  extra?: string;
  top?: boolean;
};

/**
 * De drie abonnementen. Elk abonnement start bij het groeiplan.
 * Teksten zijn afgestemd met Peter; niets toevoegen zonder bevestiging.
 */
export const MENUS: BreinMenu[] = [
  {
    naam: "Brein Start",
    ids: ["leads", "outreach"],
    prijs: 2250,
    voorWie: "U wilt structureel nieuwe klanten vinden en benaderen.",
    kern: "Vinden en benaderen.",
    wat: "Doelgroep zoeken, lijsten verrijken, berichten via mail en LinkedIn, opvolgen en reacties sorteren.",
  },
  {
    naam: "Brein Groei",
    ids: ["leads", "outreach", "taken", "reporting"],
    voorWie: "Er komen gesprekken, maar opvolging en overzicht lopen achter.",
    opbouw: "Alles van Start, plus",
    kern: "opvolgen en overzicht.",
    wat: "CRM bijgewerkt, gespreksverslagen en rapportages.",
    extra: "Inclusief een trainingsdag AI-geletterdheid en adoptie, t.w.v. € 2.450.",
    top: true,
  },
  {
    naam: "Brein Scale",
    ids: FUNCTIES.map((f) => f.id),
    voorWie: "U wilt het hele commerciële proces op één brein.",
    opbouw: "Alles van Groei, plus",
    kern: "zichtbaarheid en eigen AI-vaardigheid.",
    wat: "Content gepland, terugkerende taken geautomatiseerd, en uw team leert zelf met AI werken.",
    extra: "Inclusief een volledige 360-analyse van uw ads. Zo heeft u uw hele funnel van a tot z in kaart, push en pull, en kunt u erop sturen.",
  },
];

/** De voorwaarden die bij elk abonnement horen, in één regel onder de kaarten. */
export const BIJ_ELK_ABONNEMENT = [
  "Start met het groeiplan",
  "90 dagen pilot, daarna maandelijks opzegbaar",
  "Tools en beheer erin",
  "Wat gebouwd is, blijft van u",
  "12 maanden vooruit: 20% korting",
];

/** De maandprijs die op de site staat: de vaste prijs, anders de rekensom. */
export const menuPrijs = (m: BreinMenu) => m.prijs ?? reken(m.ids).prijs;

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
