import type { FaqItem } from "@/components/v2/Faq";

/** De vragen op de homepage. Apart bestand zodat de FAQPage-schema ze kan hergebruiken. */
export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Vervangt dit ons CRM?",
    answer:
      "Nee. Uw CRM blijft het system of record: wie is de klant en wat is er gebeurd. Wij ontwerpen en bouwen de intelligence-laag daarboven, die bepaalt wat data betekent en welke actie nu waarde heeft. Wij schrijven terug naar het CRM, inclusief de reden.",
  },
  {
    question: "Wij hebben al Apollo en een e-mailtool. Wat voegt dit toe?",
    answer:
      "Die tools zijn vaardigheden, geen systeem. Zolang de intelligence alleen in Apollo, Clay of het CRM zit, is er geen centrale plek die weet wat een account betekent. Wij ontwerpen en bouwen die laag en sluiten uw bestaande tools erop aan.",
  },
  {
    question: "Hoe snel staat dit operationeel?",
    answer:
      "De basis staat in 90 dagen. Maand 1 is het fundament: ICP-sessie, CRM opschonen, klantprofiel en het brein vullen. In maand 2 gaat de eerste golf live. In maand 3 schalen we op en kijken we mee naar het volgende proces. Daarna is het maandelijks opzegbaar.",
  },
  {
    question: "Wat kost het?",
    answer:
      "Eén vast bedrag van € 3.000 per maand, excl. btw. Daarin zitten het werk, de licenties en doorlopend advies. Geen uren achteraf en geen losse tool-abonnementen.",
  },
  {
    question: "Neemt de AI het gesprek over?",
    answer:
      "Nee. Wij automatiseren het zoeken, observeren, activeren en prioriteren dat aan het gesprek voorafgaat. Uw verkoper stapt in zodra fit, opportunity en timing samenkomen. Dat is precies waar menselijke tijd het meeste oplevert.",
  },
  {
    question: "Wat als een hypothese niet werkt?",
    answer:
      "Dan ziet u dat binnen enkele weken in de cijfers. Niet elke hypothese werkt, en dat hoeft ook niet. Het doel is een systeem dat snel genoeg nieuwe hypotheses formuleert, test en leert welke schaalbaar zijn.",
  },
  {
    question: "Werkt dit ook buiten Nederland?",
    answer:
      "Ja. De infrastructuur blijft staan, alleen de hypothese en de databronnen veranderen. Dezelfde engine gaat door naar een nieuwe sector, een nieuwe propositie of een nieuw land.",
  },
];
