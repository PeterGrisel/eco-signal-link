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
  internalLinks?: {
    title: string;
    lead: string;
    links: { href: string; anchor: string; description: string }[];
  };
}

export const seoLandingPages: SeoLandingPage[] = [
  {
    slug: "b2b-leadgeneratie",
    keyword: "B2B leadgeneratie",
    metaTitle: "B2B leadgeneratie op koopsignalen | B2BGroeiMachine",
    metaDescription: "Geen koude lijsten meer. Wij bouwen B2B leadgeneratie op koopsignalen, AI-personalisatie en menselijke opvolging. Voorspelbare pipeline, transparante data.",
    h1: "B2B leadgeneratie op basis van koopsignalen",
    intro: "Stop met lijsten afwerken en hopen op respons. Wij benaderen alleen bedrijven die nu een reden hebben om met u te praten.",
    problemTitle: "Waarom klassieke leadgeneratie vastloopt",
    problems: [
      "Koude lijsten leveren lage respons en veel ruis op",
      "Sales verliest uren aan handmatig prospecten",
      "Geen zicht op welk signaal écht een gesprek oplevert",
      "Resultaten pieken en dalen per maand",
      "Tools werken los van elkaar, data zit verspreid",
    ],
    solutionTitle: "Eén systeem dat op signalen draait",
    solutionLead: "Wij combineren koopsignalen, AI-personalisatie en multichannel opvolging tot één werkend proces. U houdt de regie, wij doen het werk en delen alle data.",
    features: [
      { title: "Signaal-gedreven prospecting", description: "Alleen bedrijven met een actueel koopmoment komen uw funnel in. Denk aan vacatures, financieringsrondes of tech-wissels." },
      { title: "AI-personalisatie per prospect", description: "Elke boodschap past bij het bedrijf, de rol en het signaal. Geen massa-mail, geen sjablonen." },
      { title: "Multichannel sequenties", description: "E-mail, LinkedIn en bellen werken samen in één flow. De prospect ervaart één lijn, niet vier kanalen." },
      { title: "Voorspelmodel voor pipeline", description: "U weet vooraf welk volume aan gesprekken een maand oplevert. Geen verrassingen achteraf." },
      { title: "Tool-agnostische bouw", description: "Wij werken op uw eigen stack. Geen vendor lock-in, alles overdraagbaar bij einde traject." },
      { title: "Transparante rapportage", description: "Dagelijks inzicht in volumes, replies en kwalitatieve gesprekken. Eens per 4 weken evalueren we samen." },
    ],
    proofTitle: "Waar we samen naartoe werken",
    proof: [
      { metric: "Voorspelbaar", label: "aantal kwalitatieve gesprekken per maand" },
      { metric: "Minder ruis", label: "alleen prospects met actief signaal" },
      { metric: "Volle data", label: "elk gesprek terug te leiden naar bron" },
    ],
    faqs: [
      { q: "Wat is B2B leadgeneratie?", a: "B2B leadgeneratie is het structureel aantrekken van beslissers bij andere bedrijven. Doel is een continue stroom kwalitatieve gesprekken voor sales. Verschillende kanalen werken samen: outbound, inbound en partnerships." },
      { q: "Hoe kan ik effectief B2B leadgeneratie toepassen?", a: "Begin bij een scherpe ICP en koopsignalen. Bouw daarna een geautomatiseerd top- en midfunnel proces. Laat sales zich richten op gesprekken, niet op handmatig zoekwerk. Meet wekelijks per signaal welke variant het beste werkt." },
      { q: "Hoe werken voorspelmodellen voor B2B leadgeneratie?", a: "Een voorspelmodel rekent terug vanaf uw omzetdoel. Het bepaalt hoeveel gesprekken, demo's en proposities nodig zijn. Op basis van historische conversies weet u vooraf welk volume input nodig is voor de gewenste output." },
      { q: "Hoe werkt B2B leadgeneratie met bedrijfsinformatie?", a: "Wij combineren databronnen zoals KvK, vacaturedata, tech-stack en financieringsrondes. Op die data herkennen we koopsignalen. Alleen bedrijven die nu een reden hebben om te kopen komen in de outreach." },
      { q: "Wat is het verschil met een leadgeneratie bureau?", a: "Een klassiek bureau levert lijsten of gespreksaantallen. Wij bouwen een werkend systeem op uw eigen tools. U bent niet afhankelijk en kunt het traject zelf voortzetten." },
      { q: "Hoe snel zie ik resultaat?", a: "De eerste vier weken zijn voor inrichten en testen. Vanaf week 5 tot 8 ziet u de eerste kwalitatieve gesprekken. We evalueren elke vier weken en sturen bij op basis van data." },
      { q: "Werken jullie met onze eigen tools?", a: "Ja. Wij zijn tool-agnostisch en bouwen op uw bestaande stack. Heeft u nog niets, dan adviseren we een passende set zonder vendor lock-in." },
      { q: "Voor welke bedrijven werkt dit?", a: "Voor B2B-organisaties met een bewezen propositie en een dealwaarde die outbound investering rechtvaardigt. Niet geschikt voor non-profit of healthcare." },
    ],
    relatedSolutions: [
      { slug: "voorspelbare-pipeline", label: "Voorspelbare pipeline" },
      { slug: "outbound-automatisering", label: "Outbound automatisering" },
      { slug: "gerichte-prospecting", label: "Gerichte prospecting" },
    ],
    internalLinks: {
      title: "Verdiep u in de bouwstenen",
      lead: "B2B leadgeneratie bestaat uit meerdere lagen. Hieronder leest u meer over de onderdelen die direct bij dit onderwerp horen.",
      links: [
        {
          href: "/zakelijke-leads",
          anchor: "kwalitatieve zakelijke leads",
          description: "Wat maakt een zakelijke lead echt waardevol en hoe scheidt u ruis van kansen.",
        },
        {
          href: "/pipeline-equation",
          anchor: "voorspelmodellen voor uw pipeline",
          description: "Reken terug vanaf uw omzetdoel naar het aantal gesprekken dat u per maand nodig heeft.",
        },
        {
          href: "/hoe-het-werkt",
          anchor: "werkwijze van ons leadgeneratie bureau",
          description: "Hoe wij als bureau uw leadgeneratie inrichten zonder vendor lock-in en met volle data-overdracht.",
        },
        {
          href: "/online-leadgeneratie",
          anchor: "online leadgeneratie in B2B",
          description: "Welke online kanalen werken en hoe u ze samenbrengt in één meetbare flow.",
        },
        {
          href: "/leads-genereren-b2b",
          anchor: "stappenplan om leads te genereren",
          description: "Concreet stappenplan om structureel B2B leads te genereren in plaats van losse acties.",
        },
        {
          href: "/funnel-calculator",
          anchor: "reverse funnel calculator",
          description: "Bereken zelf hoeveel input u nodig heeft voor uw gewenste output aan klanten.",
        },
      ],
    },
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
    proofTitle: "Waar we samen naartoe werken",
    proof: [
      { metric: "Meer", label: "gesprekken per maand" },
      { metric: "Groter", label: "outreach volume zonder extra mensen" },
      { metric: "Minder", label: "tijd kwijt aan prospecting" },
    ],
    faqs: [
      { q: "Welke kanalen werken het best om leads te genereren?", a: "De combinatie van e-mail, LinkedIn en telefoon werkt het best. Eén kanaal alleen levert te weinig op." },
      { q: "Hoeveel leads kan ik per maand verwachten?", a: "Dat hangt sterk af van uw ICP, doelmarkt en propositie. We bepalen samen realistische doelen en sturen daar maandelijks op bij." },
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
    proofTitle: "Waar we samen naartoe werken",
    proof: [
      { metric: "Hogere", label: "conversie van website-bezoek" },
      { metric: "Snellere", label: "follow-up op intent signalen" },
      { metric: "Minder", label: "leads die in een zwart gat verdwijnen" },
    ],
    faqs: [
      { q: "Werkt online leadgeneratie zonder advertenties?", a: "Ja. Organisch verkeer, signalen en gerichte outreach vormen de basis. Ads kunnen een versneller zijn, maar zijn geen voorwaarde." },
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
    proofTitle: "Waar we samen naartoe werken",
    proof: [
      { metric: "Actuele", label: "en geverifieerde contactgegevens" },
      { metric: "Hogere", label: "reply rates dan gekochte lijsten" },
      { metric: "Schone", label: "afzendreputatie van uw domein" },
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
