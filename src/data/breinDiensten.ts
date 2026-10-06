import type { FaqItem } from "@/components/v2/Faq";

/**
 * De diensten rond het commerciële brein.
 *
 * Elke dienst is één functie van het brein die wij voor de klant installeren
 * en beheren. De pagina's onder `/diensten/:slug` lezen alles uit deze lijst,
 * net als het Diensten-menu in de navigatie.
 */
export type BreinDienst = {
  slug: string;
  /** Naam in menu, footer en kruisverwijzingen. */
  naam: string;
  /** Korte regel onder de naam in het menu. */
  note: string;
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    /** Kop in regels; `accent` kleurt een segment oranje. */
    kop: { text: string; accent?: boolean }[][];
    lead: string;
  };
  probleem: { titel: string; lead: string; punten: { naam: string; body: string }[] };
  overname: { titel: string; lead: string; taken: { naam: string; body: string }[] };
  stappen: { naam: string; body: string }[];
  oplevering: { titel: string; punten: string[] };
  faq: FaqItem[];
};

export const BREIN_DIENSTEN: BreinDienst[] = [
  {
    slug: "ai-automation",
    naam: "AI Automation",
    note: "Kostbare sales- en marketingprocessen automatiseren",
    meta: {
      title: "AI Automation voor sales en marketing | B2B Groeimachine",
      description:
        "Wij automatiseren de kostbare, repeterende processen in uw sales en marketing met AI-agents die op uw eigen tools en data draaien. Wij bouwen het, koppelen het en houden het draaiende.",
    },
    hero: {
      eyebrow: "Dienst · AI Automation",
      kop: [[{ text: "Het werk dat niemand" }], [{ text: "wil doen,", accent: true }, { text: "doet het brein." }]],
      lead: "Wij vinden de processen in uw sales en marketing die het meeste tijd en geld kosten, en automatiseren ze met AI-agents op uw eigen tools en data. Uw team doet weer het werk waar het voor is aangenomen.",
    },
    probleem: {
      titel: "Uw beste mensen zijn duur handwerk aan het doen.",
      lead: "In vrijwel elk commercieel team zit een paar dagen per week aan werk dat een systeem beter, sneller en goedkoper kan.",
      punten: [
        {
          naam: "Overtypen en bijwerken",
          body: "Gegevens van mail naar CRM, van CRM naar offerte, van offerte naar planning. Elke stap kost tijd en introduceert fouten.",
        },
        {
          naam: "Opvolging die blijft liggen",
          body: "Een lead die niet wordt teruggebeld, een offerte zonder reminder. Niet uit onwil, maar omdat niemand eraan dacht.",
        },
        {
          naam: "Losse tools, geen geheel",
          body: "Elke afdeling heeft haar eigen software. Niemand ziet het hele proces, dus niemand kan het versnellen.",
        },
      ],
    },
    overname: {
      titel: "Wat het brein van uw team overneemt.",
      lead: "Kleine AI-agents, elk met één taak. Samen vormen ze één systeem dat doordraait, ook als u er niet naar kijkt.",
      taken: [
        { naam: "Leadverwerking", body: "Nieuwe aanvragen worden verrijkt, gekwalificeerd en direct bij de juiste verkoper neergelegd." },
        { naam: "CRM-hygiëne", body: "Dubbele records, lege velden en verouderde contactpersonen worden automatisch opgeschoond." },
        { naam: "Opvolging en reminders", body: "Na elk gesprek staat de vervolgactie klaar. Na elke offerte loopt de opvolging vanzelf." },
        { naam: "Gespreksverslagen", body: "Meetings worden samengevat, actiepunten komen in het CRM en de follow-upmail staat als concept klaar." },
        { naam: "Offertes en voorstellen", body: "Op basis van het gesprek en uw prijslijst ligt een eerste versie klaar om te controleren." },
        { naam: "Interne overdracht", body: "Van marketing naar sales, van sales naar delivery. Niemand hoeft meer te vragen waar iets staat." },
      ],
    },
    stappen: [
      { naam: "Proces-scan", body: "Samen brengen we in kaart waar de uren en de lekken zitten, en wat elk proces u per maand kost." },
      { naam: "Prioriteren", body: "We kiezen de automatiseringen met de hoogste opbrengst per euro. Geen techniek om de techniek." },
      { naam: "Bouwen en koppelen", body: "Wij bouwen de agents op uw bestaande tools en data. U test mee voordat iets live gaat." },
      { naam: "Beheren en uitbreiden", body: "Wij houden het draaiende, meten wat het oplevert en voegen elke maand iets toe." },
    ],
    oplevering: {
      titel: "Wat u krijgt",
      punten: [
        "Een procesoverzicht met de besparing per automatisering",
        "Werkende AI-agents op uw eigen tools en CRM",
        "Monitoring: u ziet wat er draait en wat het oplevert",
        "Beheer, onderhoud en doorontwikkeling door ons team",
        "Alles wat gebouwd is blijft van u",
      ],
    },
    faq: [
      {
        question: "Moeten we nieuwe software aanschaffen?",
        answer: "Meestal niet. Wij bouwen op de tools die u al gebruikt, zoals uw CRM, mail en agenda. Waar iets ontbreekt adviseren we, maar de keuze blijft bij u.",
      },
      {
        question: "Hoe snel draait de eerste automatisering?",
        answer: "De eerste automatisering staat doorgaans binnen twee tot drie weken live. Daarna voegen we stap voor stap processen toe.",
      },
      {
        question: "Wat gebeurt er met onze data?",
        answer: "Uw data blijft in uw eigen systemen. Wij werken met AVG-conforme verwerking en leggen per automatisering vast welke data waar naartoe gaat.",
      },
    ],
  },
  {
    slug: "outreach-as-a-service",
    naam: "Outreach as a Service",
    note: "Mail- en LinkedIn-campagnes op basis van uw groeiplan",
    meta: {
      title: "Outreach as a Service: mail en LinkedIn | B2B Groeimachine",
      description:
        "Wij zetten uw e-mail- en LinkedIn-campagnes op en draaien ze voor u, op basis van uw groeiplan. De juiste accounts, het juiste bericht, op het juiste moment. Persoonlijk, nooit massaal.",
    },
    hero: {
      eyebrow: "Dienst · Outreach as a Service",
      kop: [[{ text: "Het juiste bericht," }], [{ text: "op het juiste moment.", accent: true }]],
      lead: "Op basis van uw groeiplan zetten wij campagnes op via e-mail en LinkedIn. Het brein kiest de accounts die nu passen, schrijft persoonlijk en houdt de opvolging bij. U voert de gesprekken.",
    },
    probleem: {
      titel: "Meer berichten sturen is geen strategie.",
      lead: "De meeste outreach faalt niet op de tool, maar op wie er benaderd wordt, met welk verhaal en wanneer.",
      punten: [
        {
          naam: "Lijsten zonder richting",
          body: "Een export uit een database, zonder keuze voor markt, rol of moment. Het resultaat: lage respons en een beschadigd domein.",
        },
        {
          naam: "Berichten zonder aanleiding",
          body: "Een generieke pitch die net zo goed naar duizend anderen had kunnen gaan. Beslissers zien het direct.",
        },
        {
          naam: "Niemand die het bijhoudt",
          body: "Campagnes worden gestart en vergeten. Reacties blijven liggen, inzichten komen nooit terug in het plan.",
        },
      ],
    },
    overname: {
      titel: "Wat het brein voor uw outreach doet.",
      lead: "Van groeiplan tot afspraak in de agenda. Wij richten het in, het brein voert uit, u voert de gesprekken.",
      taken: [
        { naam: "Doelgroep uit het groeiplan", body: "Markten, rollen en accounts komen rechtstreeks uit uw groeiplan, niet uit een willekeurige export." },
        { naam: "Signalen als aanleiding", body: "Een vacature, een investering, een nieuwe vestiging. Elk bericht heeft een reden waarom nu." },
        { naam: "Mail en LinkedIn samen", body: "Eén sequence over beide kanalen, zodat u op meerdere plekken herkenbaar bent zonder op te dringen." },
        { naam: "Persoonlijke teksten", body: "Geschreven in uw toon, per segment en per rol. Wij controleren voordat er iets de deur uit gaat." },
        { naam: "Domein en deliverability", body: "Aparte verzenddomeinen, opwarmen en monitoring, zodat uw berichten in de inbox landen." },
        { naam: "Reacties en opvolging", body: "Reacties worden gesorteerd en opgevolgd. Warme leads staan direct in uw CRM en agenda." },
      ],
    },
    stappen: [
      { naam: "Groeiplan", body: "We leggen vast welke markten, accounts en rollen u wilt bereiken, en met welk verhaal." },
      { naam: "Inrichten", body: "Domeinen, LinkedIn-profielen, lijsten en sequences worden opgezet en gekoppeld aan uw CRM." },
      { naam: "Lanceren en testen", body: "We starten klein, testen onderwerpen en invalshoeken en schalen wat werkt." },
      { naam: "Sturen op resultaat", body: "Elke maand rapporteren we respons, gesprekken en pipeline, en passen we het plan aan." },
    ],
    oplevering: {
      titel: "Wat u krijgt",
      punten: [
        "Een uitgewerkt groeiplan met doelgroepen en boodschap",
        "Lopende mail- en LinkedIn-campagnes, volledig ingericht",
        "Verzenddomeinen en deliverability in beheer",
        "Warme leads en afspraken direct in uw CRM",
        "Maandelijkse rapportage en bijsturing",
      ],
    },
    faq: [
      {
        question: "Versturen jullie namens ons?",
        answer: "Ja, vanaf aparte domeinen en profielen in uw naam, zodat uw hoofddomein beschermd blijft. U keurt de teksten goed voordat een campagne start.",
      },
      {
        question: "Hoeveel berichten gaan er per week uit?",
        answer: "Zo weinig als nodig. We sturen op relevante gesprekken, niet op volume. Het aantal hangt af van uw markt en het groeiplan.",
      },
      {
        question: "Wat als we nog geen groeiplan hebben?",
        answer: "Dan maken we dat eerst samen. Het groeiplan is het startpunt van elke campagne en wordt onderdeel van de pilot.",
      },
    ],
  },
  {
    slug: "reporting",
    naam: "Reporting",
    note: "Data gestructureerd voor AI, dashboards in Claude",
    meta: {
      title: "Reporting en AI-dashboards | B2B Groeimachine",
      description:
        "Wij structureren uw commerciële data zodat AI ermee kan werken, en bouwen samen met u dashboards in Claude. U ziet wat er gebeurt, wat het oplevert en waar u moet bijsturen.",
    },
    hero: {
      eyebrow: "Dienst · Reporting",
      kop: [[{ text: "Uw data," }], [{ text: "eindelijk logisch.", accent: true }]],
      lead: "Wij structureren uw commerciële data zodat AI ermee kan werken, en ontwikkelen samen met u dashboards in Claude. Geen maandelijkse Excel meer, maar antwoorden op het moment dat u ze nodig heeft.",
    },
    probleem: {
      titel: "Veel data, weinig antwoorden.",
      lead: "De cijfers zijn er wel. Ze staan alleen verspreid, worden anders benoemd en kloppen nergens helemaal.",
      punten: [
        {
          naam: "Elke tool zijn eigen waarheid",
          body: "Het CRM zegt iets anders dan de boekhouding, en marketing telt weer op een andere manier.",
        },
        {
          naam: "Rapporteren is handwerk",
          body: "Iemand verzamelt elke maand exports, plakt ze samen en maakt een presentatie die bij oplevering al verouderd is.",
        },
        {
          naam: "AI zonder fundament",
          body: "Wie AI op rommelige data loslaat, krijgt rommelige antwoorden. Eerst structuur, dan intelligentie.",
        },
      ],
    },
    overname: {
      titel: "Wat het brein met uw data doet.",
      lead: "Eén bron van waarheid voor sales en marketing, zo ingericht dat zowel mensen als AI er direct mee kunnen werken.",
      taken: [
        { naam: "Data verbinden", body: "CRM, marketingtools, website en boekhouding komen samen op één plek, automatisch bijgewerkt." },
        { naam: "Begrippen vastleggen", body: "Wat is een lead, een opportunity, een klant? Eén definitie, overal hetzelfde." },
        { naam: "Opschonen en verrijken", body: "Dubbelingen eruit, ontbrekende velden aangevuld, historie gecorrigeerd." },
        { naam: "Klaar voor AI", body: "Een structuur en beschrijving waarmee Claude uw data begrijpt en betrouwbaar kan bevragen." },
        { naam: "Dashboards in Claude", body: "Samen bouwen we de dashboards die u echt gebruikt: pipeline, conversie, campagnes en omzet." },
        { naam: "Vragen stellen in gewone taal", body: "Waarom daalde de conversie vorige maand? U vraagt het, het brein zoekt het uit." },
      ],
    },
    stappen: [
      { naam: "Inventariseren", body: "We brengen in kaart welke data u heeft, waar die staat en welke vragen u ermee wilt beantwoorden." },
      { naam: "Structureren", body: "We verbinden de bronnen, leggen de begrippen vast en schonen de data op." },
      { naam: "Dashboards bouwen", body: "In werksessies ontwikkelen we samen de dashboards in Claude, rond uw eigen KPI's." },
      { naam: "Borgen", body: "Wij bewaken de datakwaliteit en breiden de dashboards uit als uw vragen veranderen." },
    ],
    oplevering: {
      titel: "Wat u krijgt",
      punten: [
        "Eén verbonden datamodel voor sales en marketing",
        "Vastgelegde KPI-definities die iedereen gebruikt",
        "Dashboards in Claude die zichzelf bijwerken",
        "Uw data vragen stellen in gewone taal",
        "Bewaking van datakwaliteit en doorontwikkeling",
      ],
    },
    faq: [
      {
        question: "Waarom dashboards in Claude?",
        answer: "Omdat u er niet alleen naar kijkt, maar er ook vragen aan stelt. Claude leest de gestructureerde data, legt verbanden en licht toe wat er verandert.",
      },
      {
        question: "Welke bronnen kunnen jullie koppelen?",
        answer: "De gangbare CRM's, marketing- en advertentieplatformen, uw website-analytics en de meeste boekhoudpakketten. Maatwerkbronnen bekijken we per geval.",
      },
      {
        question: "Hebben we hiervoor een datateam nodig?",
        answer: "Nee. Wij richten het in en beheren het. Uw team gebruikt de dashboards en stelt de vragen.",
      },
    ],
  },
];

export function vindBreinDienst(slug: string | undefined) {
  return BREIN_DIENSTEN.find((d) => d.slug === slug);
}
