export interface SeoFaq {
  q: string;
  a: string;
}

export interface SeoLandingPage {
  slug: string;
  keyword: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  problemTitle: string;
  problems: string[];
  solutionTitle: string;
  solutionLead: string;
  features: { title: string; description: string }[];
  proofTitle: string;
  proof: { metric: string; label: string }[];
  faqs: SeoFaq[];
  relatedSolutions: { slug: string; label: string }[];
}

export const seoLandingPages: SeoLandingPage[] = [
  {
    slug: "b2b-leadgeneratie",
    keyword: "B2B leadgeneratie",
    metaTitle: "B2B leadgeneratie zonder gokwerk — B2BGroeiMachine",
    metaDescription: "Bouw een voorspelbare stroom B2B leads. Slimme signalen, geautomatiseerde outreach en menselijke opvolging. Voor groeiende B2B-bedrijven.",
    h1: "B2B leadgeneratie die wél voorspelbaar werkt",
    intro: "Stop met losse acties en wachten op toeval. Wij bouwen een leadgeneratie systeem dat continu nieuwe kansen oplevert.",
    problemTitle: "Waarom leadgeneratie nu vaak vastloopt",
    problems: [
      "Outbound voelt als spam en levert weinig op",
      "Sales besteedt uren aan handmatig prospecten",
      "Geen zicht op welke kanalen écht resultaat geven",
      "Pieken en dalen in nieuwe gesprekken per maand",
    ],
    solutionTitle: "Van losse acties naar één leadmachine",
    solutionLead: "Wij combineren koopsignalen, AI-personalisatie en multichannel opvolging tot één systeem. U houdt de regie, wij doen het werk.",
    features: [
      { title: "Signaal-gedreven prospecting", description: "Alleen bedrijven met actuele koopsignalen komen in uw funnel." },
      { title: "AI-gepersonaliseerde outreach", description: "Elke boodschap past bij de prospect, het bedrijf en het moment." },
      { title: "Multichannel sequenties", description: "E-mail, LinkedIn en bellen werken samen in één flow." },
      { title: "Transparante rapportage", description: "Dagelijks inzicht in volumes, replies en kwalitatieve gesprekken." },
    ],
    proofTitle: "Wat klanten typisch zien na 90 dagen",
    proof: [
      { metric: "3x", label: "meer gekwalificeerde gesprekken" },
      { metric: "40%", label: "minder tijd kwijt aan prospecting" },
      { metric: "85%", label: "automatisering top- en mid-funnel" },
    ],
    faqs: [
      { q: "Wat is B2B leadgeneratie precies?", a: "B2B leadgeneratie is het structureel aantrekken van beslissers bij andere bedrijven. Doel is een continue stroom gekwalificeerde gesprekken voor sales." },
      { q: "Hoe snel zie ik resultaat?", a: "De eerste gesprekken plannen we doorgaans binnen 4 tot 6 weken na de start. Voorspelbaarheid groeit verder in de maanden daarna." },
      { q: "Werken jullie met onze eigen tools?", a: "Ja. Wij zijn tool-agnostisch en bouwen op uw bestaande stack. Heeft u nog niets, dan adviseren we een passende set." },
      { q: "Voor welke bedrijven werkt dit?", a: "Voor B2B-organisaties met een bewezen propositie en gemiddelde dealwaarde vanaf circa 5.000 euro per jaar." },
    ],
    relatedSolutions: [
      { slug: "voorspelbare-pipeline", label: "Voorspelbare pipeline" },
      { slug: "outbound-automatisering", label: "Outbound automatisering" },
      { slug: "gerichte-prospecting", label: "Gerichte prospecting" },
    ],
  },
  {
    slug: "leads-genereren-b2b",
    keyword: "leads genereren B2B",
    metaTitle: "Leads genereren in B2B: zo bouwt u een systeem — B2BGroeiMachine",
    metaDescription: "Leads genereren in B2B vraagt om structuur. Wij zetten een systeem op dat continu nieuwe gesprekken oplevert, zonder spam of toeval.",
    h1: "Leads genereren in B2B, zonder gokwerk",
    intro: "Wilt u structureel leads genereren in B2B? Dan heeft u een systeem nodig, geen losse acties. Wij bouwen dat systeem voor u.",
    problemTitle: "Waarom losse acties niet werken",
    problems: [
      "Eén campagne werkt, de volgende valt stil",
      "Sales en marketing trekken aan andere kanten",
      "Geen data over wat échte gesprekken oplevert",
      "Nieuwe leads stoppen zodra het team druk wordt",
    ],
    solutionTitle: "Eén systeem, drie kanalen, voorspelbaar resultaat",
    solutionLead: "We combineren signalen, content en menselijke opvolging in een herhaalbaar proces. Elke maand voorspelbaar nieuwe gesprekken.",
    features: [
      { title: "ICP scherp gedefinieerd", description: "We bepalen samen welke bedrijven en rollen het meeste opleveren." },
      { title: "Signalen als trigger", description: "Vacatures, funding, leiderschap of techstack als startsein voor outreach." },
      { title: "Sequenties op maat", description: "Per segment passende boodschap, kanaal en cadans." },
      { title: "Kwalificatie door mens", description: "Een SDR voert de eerste echte gesprekken, geen bots." },
    ],
    proofTitle: "Wat klanten zien in een normaal kwartaal",
    proof: [
      { metric: "30+", label: "gesprekken per maand" },
      { metric: "5x", label: "meer outreach volume" },
      { metric: "70%", label: "tijdsbesparing voor sales" },
    ],
    faqs: [
      { q: "Welke kanalen werken het best om leads te genereren?", a: "De combinatie van e-mail, LinkedIn en telefoon werkt het best. Eén kanaal alleen levert te weinig op." },
      { q: "Hoeveel leads kan ik per maand verwachten?", a: "Dat hangt af van uw ICP en doelmarkt. Een typische start ligt tussen 15 en 40 gekwalificeerde gesprekken per maand." },
      { q: "Wat doen we zelf en wat doen jullie?", a: "Wij doen de complete top- en mid-funnel. U voert alleen het eindgesprek en sluit de deal." },
      { q: "Is dit ook geschikt voor niche markten?", a: "Ja, juist daar werkt signaal-gedreven leadgeneratie goed. Kleiner publiek vraagt om scherpere selectie." },
    ],
    relatedSolutions: [
      { slug: "outbound-automatisering", label: "Outbound automatisering" },
      { slug: "schaalbaar-groeisysteem", label: "Schaalbaar groeisysteem" },
      { slug: "data-gedreven-sales", label: "Data-gedreven sales" },
    ],
  },
  {
    slug: "online-leadgeneratie",
    keyword: "online leadgeneratie",
    metaTitle: "Online leadgeneratie voor B2B — B2BGroeiMachine",
    metaDescription: "Online leadgeneratie die meer doet dan formulieren tellen. Wij koppelen signalen, outreach en data tot één voorspelbaar systeem.",
    h1: "Online leadgeneratie die deals oplevert, geen ruis",
    intro: "Veel online leadgeneratie levert lijsten op, geen klanten. Wij bouwen een aanpak die direct stuurt op gekwalificeerde gesprekken.",
    problemTitle: "Wat er nu vaak misgaat",
    problems: [
      "Veel formulier-leads, weinig échte interesse",
      "Marketing-leads belanden in een zwart gat bij sales",
      "Advertentiebudget zonder duidelijke ROI",
      "Geen koppeling tussen website-gedrag en outreach",
    ],
    solutionTitle: "Online activiteit als startsein voor sales",
    solutionLead: "We verbinden uw website, signalen en outreach in één flow. Zo wordt elk online signaal opgevolgd door een relevant gesprek.",
    features: [
      { title: "Bezoekers identificeren", description: "Welke bedrijven bekijken uw site, ook zonder formulier in te vullen." },
      { title: "Trigger-gebaseerde outreach", description: "Bezoek of download triggert direct een passend bericht." },
      { title: "Content op intent", description: "Andere boodschap voor onderzoekers dan voor kopers." },
      { title: "Volledige attributie", description: "Zicht op welk online kanaal welke deal oplevert." },
    ],
    proofTitle: "Wat u mag verwachten",
    proof: [
      { metric: "2-3x", label: "hogere conversie van website-bezoek" },
      { metric: "100%", label: "follow-up op intent signalen" },
      { metric: "0", label: "leads die in een zwart gat verdwijnen" },
    ],
    faqs: [
      { q: "Werkt online leadgeneratie zonder advertenties?", a: "Ja. Veel resultaat komt uit organisch verkeer, signalen en gerichte outreach. Ads zijn een versneller, geen voorwaarde." },
      { q: "Mag ik bezoekers identificeren onder de AVG?", a: "Wij identificeren bedrijven, geen personen. Dat is binnen de AVG toegestaan en gebruikelijk in B2B." },
      { q: "Hoe meten jullie succes?", a: "Wij sturen op gekwalificeerde gesprekken en pipeline, niet op kliks of vage MQL-scores." },
      { q: "Past dit bij een lange salescyclus?", a: "Juist dan werkt het goed. Online signalen vertellen wanneer een prospect actief is, ook na maanden stilte." },
    ],
    relatedSolutions: [
      { slug: "data-gedreven-sales", label: "Data-gedreven sales" },
      { slug: "voorspelbare-pipeline", label: "Voorspelbare pipeline" },
      { slug: "versnipperde-tools", label: "Tools verbinden" },
    ],
  },
  {
    slug: "zakelijke-leads",
    keyword: "zakelijke leads",
    metaTitle: "Zakelijke leads kopen of zelf bouwen? — B2BGroeiMachine",
    metaDescription: "Zakelijke leads van echte kwaliteit krijgt u niet uit een lijst, maar uit een systeem. Zo bouwt u structureel pipeline op.",
    h1: "Zakelijke leads die uw sales ook écht wil opvolgen",
    intro: "Gekochte lijsten leveren zelden goede gesprekken op. Wij bouwen een eigen motor die structureel relevante zakelijke leads aanlevert.",
    problemTitle: "Het probleem met gekochte lijsten",
    problems: [
      "Veel verouderde of foute contactgegevens",
      "Geen koopintentie, alleen een naam en mailadres",
      "Sales raakt gefrustreerd en stopt met opvolgen",
      "Reputatie van uw domein staat onder druk",
    ],
    solutionTitle: "Eigen leadmotor in plaats van een lijst",
    solutionLead: "We bouwen een systeem dat zakelijke leads continu aanvult op basis van uw ICP en actuele signalen. Altijd vers, altijd relevant.",
    features: [
      { title: "Bronnen koppelen", description: "Combinatie van publieke data, signalen en eigen kanalen." },
      { title: "Verrijking en verificatie", description: "Elk contact wordt automatisch verrijkt en gecontroleerd." },
      { title: "Compliance ingebouwd", description: "AVG-conforme aanpak, met juiste opt-outs en logging." },
      { title: "Live dashboard", description: "Realtime overzicht van nieuwe leads, status en eigenaar." },
    ],
    proofTitle: "Verschil ten opzichte van een lijst",
    proof: [
      { metric: "95%+", label: "correcte contactgegevens" },
      { metric: "10x", label: "hogere reply rates" },
      { metric: "0", label: "klachten over spam" },
    ],
    faqs: [
      { q: "Is het slim om zakelijke leads te kopen?", a: "Eénmalig misschien, voor verkenning. Structureel niet: de kwaliteit is laag en het schaadt uw afzendreputatie." },
      { q: "Hoe blijven leads actueel?", a: "Wij verversen contacten doorlopend op basis van signalen, vacatures en publieke updates." },
      { q: "Krijgen we de data ook in onze eigen tools?", a: "Ja. We koppelen direct met uw CRM, zoals HubSpot, Salesforce of Pipedrive." },
      { q: "Wat als een lead niet past?", a: "U geeft feedback in het dashboard. Het systeem leert mee en filtert vergelijkbare leads eruit." },
    ],
    relatedSolutions: [
      { slug: "gerichte-prospecting", label: "Gerichte prospecting" },
      { slug: "data-gedreven-sales", label: "Data-gedreven sales" },
      { slug: "weg-uit-excel", label: "Weg uit Excel" },
    ],
  },
];
