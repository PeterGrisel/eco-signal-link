/**
 * Hoe het brein werkt, in de taal van de klant: een doel uit het groeiplan
 * trekt (pull), het brein standaardiseert, test en stuurt bij, en een volgend
 * proces start pas als het vorige zich terugverdient. Homepage en /pricing
 * lezen deze lijsten.
 */

export const CYCLUS: { stap: string; uitleg: string }[] = [
  { stap: "Doel", uitleg: "Het groeiplan legt vast waar u naartoe wilt." },
  { stap: "Standaardiseren", uitleg: "Elk onderdeel van het proces wordt vast en meetbaar." },
  { stap: "Testen", uitleg: "We veranderen één variabele tegelijk en meten het effect." },
  { stap: "Bijsturen", uitleg: "Wat u dichter bij het doel brengt, blijft." },
  { stap: "Terugverdiend", uitleg: "Pas dan start het volgende proces." },
];

export const PUSH_PULL: { kop: string; push: string; pull: string }[] = [
  { kop: "Waar u op stuurt", push: "Meer activiteit, in de hoop dat er resultaat uitkomt", pull: "Een doel uit het groeiplan" },
  { kop: "Waar u naar kijkt", push: "Een resultaat dat u pas achteraf ziet", pull: "De variabelen die naar het doel trekken" },
  { kop: "Als het tegenvalt", push: "Nog meer van hetzelfde", pull: "Eén variabele bijstellen en opnieuw testen" },
  { kop: "Hoe het voelt", push: "Hopen", pull: "Sturen" },
];

/** De commerciële processen waaruit het groeiplan de route kiest. */
export const B2B_PROCESSEN: string[] = [
  "Marktkeuze en propositie",
  "Acquisitie van nieuwe klanten",
  "Opvolging en conversie",
  "Offertes",
  "Groei binnen bestaande accounts",
  "Behoud",
  "Partners en kanalen",
  "Nieuwe landen",
  "Content en merk",
  "Adoptie in het team",
];
