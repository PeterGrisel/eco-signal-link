/**
 * Hoe het brein werkt, in de taal van de klant: een doel uit het groeiplan
 * trekt (pull), het brein standaardiseert, test en stuurt bij. Homepage en
 * /pricing lezen deze lijsten.
 */

export const CYCLUS: { stap: string; uitleg: string }[] = [
  { stap: "Doel", uitleg: "Het groeiplan legt vast waar u naartoe wilt." },
  { stap: "Standaardiseren", uitleg: "Elk onderdeel van het proces wordt vast en meetbaar." },
  { stap: "Testen", uitleg: "We veranderen één variabele tegelijk en meten het effect." },
  { stap: "Bijsturen", uitleg: "Wat u dichter bij het doel brengt, blijft." },
];

export const PUSH_PULL: { kop: string; push: string; pull: string }[] = [
  { kop: "Waar u op stuurt", push: "Meer activiteit, in de hoop dat er resultaat uitkomt", pull: "Een doel uit het groeiplan" },
  { kop: "Waar u naar kijkt", push: "Een resultaat dat u pas achteraf ziet", pull: "De variabelen die naar het doel trekken" },
  { kop: "Als het tegenvalt", push: "Nog meer van hetzelfde", pull: "Eén variabele bijstellen en opnieuw testen" },
  { kop: "Hoe het voelt", push: "Hopen", pull: "Sturen" },
];

/** Waarom losse AI-klussen niet optellen en een brein met context wel. */
export const CONTEXT_VERGELIJKING: { kop: string; los: string; brein: string }[] = [
  { kop: "Kent uw bedrijf", los: "Nee, elke opdracht begint bij nul", brein: "Ja, vanuit het groeiplan en alles wat al getest is" },
  { kop: "Leert van resultaat", los: "Nee, de klus is af en klaar", brein: "Ja, elke reactie en elk gesprek voedt de volgende stap" },
  { kop: "Wat u overhoudt", los: "Een lijst of tool die veroudert", brein: "Een systeem dat elke maand slimmer wordt" },
  { kop: "Telt op", los: "Nee", brein: "Ja" },
];
