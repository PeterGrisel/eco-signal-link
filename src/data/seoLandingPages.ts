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
        {
          href: "/koude-acquisitie",
          anchor: "koude acquisitie op koopsignalen",
          description: "Hoe u koude acquisitie vervangt door benadering op basis van actuele signalen.",
        },
        {
          href: "/acquisitie-uitbesteden",
          anchor: "acquisitie uitbesteden zonder lock-in",
          description: "Wanneer het slim is om acquisitie uit te besteden en hoe u regie houdt.",
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
    internalLinks: {
      title: "Verdiep u in de bouwstenen",
      lead: "Zakelijke leads worden pas waardevol binnen een groter systeem. Hieronder de onderdelen die direct met dit onderwerp samenhangen.",
      links: [
        {
          href: "/b2b-leadgeneratie",
          anchor: "B2B leadgeneratie op koopsignalen",
          description: "Het bredere systeem waarin zakelijke leads doorlopend worden aangevuld en gekwalificeerd.",
        },
        {
          href: "/koude-acquisitie",
          anchor: "koude acquisitie op warme signalen",
          description: "Hoe u zakelijke leads benadert zonder terug te vallen op koude lijsten en massa-mail.",
        },
        {
          href: "/acquisitie-uitbesteden",
          anchor: "acquisitie uitbesteden aan een specialist",
          description: "Laat het ophalen en opvolgen van zakelijke leads door een extern team doen, op uw eigen tools.",
        },
        {
          href: "/pipeline-equation",
          anchor: "voorspelmodel voor uw pipeline",
          description: "Reken terug hoeveel zakelijke leads u per maand nodig heeft voor uw omzetdoel.",
        },
      ],
    },
  },
  {
    slug: "koude-acquisitie",
    keyword: "koude acquisitie",
    metaTitle: "Koude acquisitie zonder koude lijsten | B2BGroeiMachine",
    metaDescription: "Vervang koude acquisitie door warme signalen. Wij benaderen alleen bedrijven met een actueel koopmoment. Voorspelbare pipeline, geen ruis.",
    h1: "Koude acquisitie, maar dan op warme signalen",
    intro: "Koude acquisitie werkt steeds slechter. Lage respons, hoge irritatie, weinig pipeline. Wij draaien het om: alleen bellen en mailen waar nu een reden voor is.",
    problemTitle: "Waarom klassieke koude acquisitie vastloopt",
    problems: [
      "Respons op koude e-mail zakt elk jaar verder",
      "Sales verliest motivatie na 50 nee's per week",
      "Geen onderscheid tussen kansrijk en kansloos contact",
      "Reputatie van uw domein staat onder druk bij massa-mail",
      "Geen data over wat wel of niet werkt",
    ],
    solutionTitle: "Van koude lijst naar warm signaal",
    solutionLead: "Wij bouwen een proces dat alleen bedrijven aanspreekt met een actueel koopmoment. Sales krijgt warmere gesprekken, u krijgt voorspelbare pipeline.",
    features: [
      { title: "Signaal-detectie", description: "Vacatures, financieringsrondes, tech-wissels en groeicijfers worden continu uitgelezen." },
      { title: "Gepersonaliseerde opening", description: "Elke boodschap verwijst naar het signaal. Geen sjabloon, geen massa-mail." },
      { title: "Multichannel sequentie", description: "E-mail, LinkedIn en bellen lopen samen in één afgestemde flow." },
      { title: "Domein-bescherming", description: "Warm-up, spread en deliverability worden bewaakt. Uw domein blijft schoon." },
      { title: "Dagelijkse rapportage", description: "U ziet welke signalen, sectoren en boodschappen het beste werken." },
      { title: "Tool-agnostische bouw", description: "Wij werken op uw stack. Geen vendor lock-in, alles overdraagbaar." },
    ],
    proofTitle: "Wat dit oplevert",
    proof: [
      { metric: "Hoger", label: "responspercentage door context" },
      { metric: "Minder", label: "verspilde tijd aan kansloze prospects" },
      { metric: "Schoner", label: "domein door bewaakte deliverability" },
    ],
    faqs: [
      { q: "Wat is koude acquisitie?", a: "Koude acquisitie is het benaderen van prospects zonder eerder contact. Doel is interesse wekken voor een vervolggesprek. Het gebeurt meestal via telefoon, e-mail of LinkedIn." },
      { q: "Werkt koude acquisitie nog in 2026?", a: "Pure koude acquisitie levert steeds minder op. Acquisitie op basis van koopsignalen werkt wel. Het verschil zit in relevantie en timing van het contactmoment." },
      { q: "Hoe pleegt u effectieve koude acquisitie?", a: "Start bij een scherpe ICP. Voeg actuele signalen toe, zoals vacatures of groeicijfers. Personaliseer per prospect en gebruik meerdere kanalen. Meet wekelijks per variant wat werkt." },
      { q: "Wat is het verschil met warme acquisitie?", a: "Warme acquisitie bouwt op bestaand contact, zoals een eerdere demo of webinarbezoeker. Koude acquisitie start zonder contact, maar wint sterk als u koopsignalen toevoegt." },
      { q: "Kunt u koude acquisitie uitbesteden?", a: "Ja. Wij nemen het hele proces over: data, outreach, opvolging en rapportage. U houdt de regie en krijgt alle data overdraagbaar in uw eigen tools." },
      { q: "Mag koude acquisitie onder de AVG?", a: "Ja, voor B2B met een legitiem belang. Wij volgen de gedragscode voor zakelijke direct marketing en respecteren altijd opt-outs." },
    ],
    relatedSolutions: [
      { slug: "gerichte-prospecting", label: "Gerichte prospecting" },
      { slug: "outbound-automatisering", label: "Outbound automatisering" },
      { slug: "voorspelbare-pipeline", label: "Voorspelbare pipeline" },
    ],
    internalLinks: {
      title: "Verdiep u in de bouwstenen",
      lead: "Koude acquisitie werkt het best als onderdeel van een groter systeem. Hieronder leest u de losse onderdelen.",
      links: [
        { href: "/acquisitie-uitbesteden", anchor: "acquisitie uitbesteden aan een specialist", description: "Hoe het werkt als u het hele proces bij ons neerlegt en wat u zelf blijft beslissen." },
        { href: "/b2b-leadgeneratie", anchor: "B2B leadgeneratie op koopsignalen", description: "Het bredere systeem waar koude acquisitie een kanaal binnen is." },
        { href: "/zakelijke-leads", anchor: "kwalitatieve zakelijke leads", description: "Waarom een eigen leadmotor beter werkt dan koude lijsten kopen." },
        { href: "/pipeline-equation", anchor: "voorspelmodel voor uw pipeline", description: "Reken vooraf uit hoeveel acquisitie u per maand nodig heeft." },
      ],
    },
  },
  {
    slug: "acquisitie-uitbesteden",
    keyword: "acquisitie uitbesteden",
    metaTitle: "Acquisitie uitbesteden zonder vendor lock-in | B2BGroeiMachine",
    metaDescription: "Acquisitie uitbesteden aan een team dat op uw eigen tools werkt. Voorspelbare pipeline, volle data-overdracht, geen lange contracten met boetes.",
    h1: "Acquisitie uitbesteden, zonder uw regie te verliezen",
    intro: "U wilt nieuwe klanten, maar geen volle salesafdeling opbouwen. Wij nemen het proces over en bouwen het zo dat u het altijd zelf kunt voortzetten.",
    problemTitle: "Waarom uitbesteden vaak tegenvalt",
    problems: [
      "Bureaus werken in eigen tools, u krijgt niets mee",
      "Lange contracten met boete bij vroegtijdige stop",
      "Geen inzicht in wat er dagelijks gebeurt",
      "Resultaat afhankelijk van één bureau-medewerker",
      "Aan het einde staat u met lege handen qua data",
    ],
    solutionTitle: "Done-for-you met volledige overdracht",
    solutionLead: "Wij draaien acquisitie als verlengstuk van uw team. Alles wat we bouwen, draait op uw eigen stack. U kunt op elk moment doorpakken zonder ons.",
    features: [
      { title: "Werken op uw eigen tools", description: "Wij bouwen in uw HubSpot, Pipedrive of Salesforce. Geen tweede systeem, geen losse data." },
      { title: "Vaste evaluatie elke 4 weken", description: "U ziet doorlopend wat werkt en kunt bijsturen op signalen, kanalen en boodschappen." },
      { title: "Geen lange contracten", description: "Wij werken per kwartaal of half jaar. Wilt u stoppen? Dan ronden we netjes af zonder boete." },
      { title: "Build & Transfer optie", description: "U kunt het hele systeem na 6 of 12 maanden overnemen en zelf doordraaien." },
      { title: "Transparante uurtarieven", description: "Vast engagement-tarief per maand, alle gemaakte uren zichtbaar in het dashboard." },
      { title: "Eén aanspreekpunt", description: "Vaste strategist plus operator. Geen wisselende junior accountmanagers." },
    ],
    proofTitle: "Wat u eraan heeft",
    proof: [
      { metric: "Geen", label: "vendor lock-in of dure exit-clausules" },
      { metric: "Volle", label: "data-overdracht op elk moment" },
      { metric: "Vast", label: "team voor stabiele uitvoering" },
    ],
    faqs: [
      { q: "Wat betekent acquisitie uitbesteden precies?", a: "U laat het hele acquisitieproces door een extern team draaien. Van ICP tot outreach en opvolging. Sales binnen uw bedrijf richt zich op gesprekken en deals." },
      { q: "Wat kost acquisitie uitbesteden?", a: "Bij ons werkt u met een vast engagement-tarief per maand. De prijs hangt af van volume, kanalen en gewenste opvolging. We rekenen geen succes-fees per lead." },
      { q: "Wanneer is uitbesteden slim?", a: "Als u snel wilt opschalen zonder een sales-afdeling op te bouwen. Of als uw team alles doet maar acquisitie blijft liggen. Of als u een proces wilt testen voor u zelf investeert." },
      { q: "Wat is het verschil met een leadgeneratiebureau?", a: "Een klassiek bureau levert lijsten of belafspraken. Wij bouwen een werkend systeem op uw eigen tools. Aan het einde van het traject heeft u alles in eigen huis." },
      { q: "Hoe houden wij regie als we uitbesteden?", a: "U krijgt dagelijks inzicht in volumes, replies en gesprekken. Elke vier weken evalueren we samen. U kunt op elk moment bijsturen op doelgroep, boodschap of kanaal." },
      { q: "Wat als we willen stoppen?", a: "Geen boete. We ronden lopende sequenties netjes af en dragen alle data, templates en processen over. Uw team kan direct verder." },
      { q: "Kunnen jullie ook telefonische acquisitie uitbesteden?", a: "Ja. We combineren bellen met e-mail en LinkedIn in één flow. Het bellen doen we vanuit Nederland, op basis van warme signalen." },
    ],
    relatedSolutions: [
      { slug: "outbound-automatisering", label: "Outbound automatisering" },
      { slug: "voorspelbare-pipeline", label: "Voorspelbare pipeline" },
      { slug: "schaalbaar-groeisysteem", label: "Schaalbaar groeisysteem" },
    ],
    internalLinks: {
      title: "Verdiep u in de bouwstenen",
      lead: "Acquisitie uitbesteden is meer dan bellen voor u. Hieronder de onderdelen die wij voor u inrichten.",
      links: [
        { href: "/koude-acquisitie", anchor: "koude acquisitie op koopsignalen", description: "Hoe we koude acquisitie vervangen door benadering op basis van actuele signalen." },
        { href: "/b2b-leadgeneratie", anchor: "B2B leadgeneratie als systeem", description: "Het bredere systeem waar uitbestede acquisitie een uitvoerend onderdeel binnen is." },
        { href: "/zakelijke-leads", anchor: "kwalitatieve zakelijke leads", description: "Hoe wij doorlopend zakelijke leads aanleveren in plaats van eenmalige lijsten." },
        { href: "/hoe-het-werkt", anchor: "werkwijze van ons leadgeneratie bureau", description: "Stap voor stap hoe wij een acquisitie-traject inrichten en overdragen." },
        { href: "/pipeline-equation", anchor: "voorspelmodel voor uw pipeline", description: "Bereken vooraf wat uitbestede acquisitie u in pipeline gaat opleveren." },
      ],
    },
  },
];
