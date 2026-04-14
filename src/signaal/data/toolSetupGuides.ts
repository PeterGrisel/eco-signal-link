export interface SetupStep {
  action: string;
  detail?: string;
}

export interface ToolSetupGuide {
  name: string;
  url: string;
  category: 'data' | 'automation' | 'outreach';
  estimatedMinutes: number;
  steps: SetupStep[];
}

export const TOOL_SETUP_GUIDES: Record<string, ToolSetupGuide> = {
  'Apollo.io': {
    name: 'Apollo.io',
    url: 'https://www.apollo.io',
    category: 'data',
    estimatedMinutes: 30,
    steps: [
      { action: 'Maak een Apollo account aan', detail: 'Gebruik je zakelijke e-mail voor betere deliverability' },
      { action: 'Installeer de Chrome-extensie', detail: 'Hiermee verrijk je LinkedIn-profielen direct' },
      { action: 'Stel je Saved Search in op basis van je ICP', detail: 'Gebruik de filters: industrie, bedrijfsgrootte, functietitel, regio' },
      { action: 'Koppel je CRM via de ingebouwde integratie', detail: 'Apollo ondersteunt HubSpot, Salesforce en Pipedrive' },
      { action: 'Activeer dagelijkse alerts voor nieuwe matches', detail: 'Ga naar Saved Searches → Enable Alerts' },
      { action: 'Test je eerste export van 25 contacten' },
    ],
  },
  'Apollo Saved Searches': {
    name: 'Apollo Saved Searches',
    url: 'https://www.apollo.io',
    category: 'automation',
    estimatedMinutes: 15,
    steps: [
      { action: 'Ga naar People Search in Apollo' },
      { action: 'Pas je ICP-filters toe (industrie, grootte, functie, regio)' },
      { action: 'Klik op "Save Search" en geef een duidelijke naam' },
      { action: 'Schakel e-mail of Slack alerts in voor nieuwe resultaten' },
      { action: 'Stel de frequentie in op dagelijks of wekelijks' },
    ],
  },
  'Apollo Sequences': {
    name: 'Apollo Sequences',
    url: 'https://www.apollo.io',
    category: 'outreach',
    estimatedMinutes: 45,
    steps: [
      { action: 'Ga naar Engage → Sequences in Apollo' },
      { action: 'Maak een nieuwe sequence aan per scorezone', detail: 'Bijv. "Nurture", "Actief", "Prioriteit"' },
      { action: 'Voeg 4-6 stappen toe met afwisselend e-mail en taken' },
      { action: 'Schrijf je e-mailtemplates met trigger-specifieke variabelen', detail: 'Gebruik {{first_name}}, {{company}} en een custom veld voor de trigger' },
      { action: 'Stel wachttijden in tussen stappen (2-4 dagen)' },
      { action: 'Koppel je mailbox voor verzending', detail: 'Gebruik een apart domein, niet je hoofddomein' },
      { action: 'Test de sequence met een intern e-mailadres' },
    ],
  },
  'LinkedIn Sales Nav': {
    name: 'LinkedIn Sales Navigator',
    url: 'https://business.linkedin.com/sales-solutions',
    category: 'data',
    estimatedMinutes: 20,
    steps: [
      { action: 'Activeer Sales Navigator (Professional of Team plan)' },
      { action: 'Bouw een Lead List op basis van je ICP-filters' },
      { action: 'Stel Saved Searches in met je kritische vragen' },
      { action: 'Activeer Lead Alerts voor job changes en posts' },
      { action: 'Koppel aan je CRM via de CRM Sync feature', detail: 'Beschikbaar in het Team plan' },
    ],
  },
  'LinkedIn Alerts': {
    name: 'LinkedIn Alerts',
    url: 'https://www.linkedin.com',
    category: 'automation',
    estimatedMinutes: 10,
    steps: [
      { action: 'Ga naar je LinkedIn zoekresultaten' },
      { action: 'Filter op je target functietitels en regio' },
      { action: 'Klik op "Set alert" bij de zoekresultaten' },
      { action: 'Kies de frequentie: dagelijks of wekelijks' },
      { action: 'Check je LinkedIn notificaties regelmatig voor nieuwe matches' },
    ],
  },
  'Crunchbase': {
    name: 'Crunchbase',
    url: 'https://www.crunchbase.com',
    category: 'data',
    estimatedMinutes: 15,
    steps: [
      { action: 'Maak een Crunchbase Pro account aan' },
      { action: 'Bouw een Saved Search met funding-filters', detail: 'Filter op ronde type (Series A+), regio en industrie' },
      { action: 'Activeer alerts voor nieuwe funding rondes' },
      { action: 'Exporteer je eerste lijst en vergelijk met je ICP' },
    ],
  },
  'Clay': {
    name: 'Clay',
    url: 'https://www.clay.com',
    category: 'data',
    estimatedMinutes: 45,
    steps: [
      { action: 'Maak een Clay account aan en kies je plan' },
      { action: 'Maak een nieuwe Table aan voor je ICP-lijst' },
      { action: 'Voeg een bron toe (LinkedIn, Apollo, of CSV import)' },
      { action: 'Configureer Waterfall Enrichment voor contactdata', detail: 'Combineer meerdere bronnen voor maximale dekking' },
      { action: 'Stel filters in op basis van je signaalgewichten' },
      { action: 'Koppel een output naar je CRM of outreach-tool via integraties' },
    ],
  },
  'Clay Waterfalls': {
    name: 'Clay Waterfalls',
    url: 'https://www.clay.com',
    category: 'automation',
    estimatedMinutes: 30,
    steps: [
      { action: 'Open je Clay Table en ga naar een kolom' },
      { action: 'Klik op "Enrich" en kies Waterfall Enrichment' },
      { action: 'Selecteer meerdere databronnen in volgorde van voorkeur' },
      { action: 'Clay probeert elke bron tot er een match is gevonden' },
      { action: 'Configureer automatische refresh (dagelijks/wekelijks)' },
      { action: 'Koppel de output aan je CRM via Zapier of native integratie' },
    ],
  },
  'BuiltWith': {
    name: 'BuiltWith',
    url: 'https://builtwith.com',
    category: 'data',
    estimatedMinutes: 15,
    steps: [
      { action: 'Maak een BuiltWith account aan' },
      { action: 'Zoek op de technologieën die signalen zijn voor jouw ICP', detail: 'Bijv. bedrijven die Salesforce, SAP of een concurrent gebruiken' },
      { action: 'Exporteer de lijst en filter op je regio en bedrijfsgrootte' },
      { action: 'Stel Technology Alerts in voor changes', detail: 'Je krijgt een melding als een bedrijf van tech switcht' },
    ],
  },
  'Google Alerts': {
    name: 'Google Alerts',
    url: 'https://www.google.com/alerts',
    category: 'automation',
    estimatedMinutes: 10,
    steps: [
      { action: 'Ga naar google.com/alerts' },
      { action: 'Maak een alert per zoekterm uit je signaalmatrix', detail: 'Bijv. "VP Sales" + je target industrie' },
      { action: 'Kies frequentie: zodra beschikbaar of dagelijks digest' },
      { action: 'Lever af naar je e-mail of een RSS feed' },
      { action: 'Gebruik operatoren voor precisie', detail: 'Bijv. "VP Sales" AND ("SaaS" OR "logistiek") -vacature' },
    ],
  },
  'Bombora': {
    name: 'Bombora',
    url: 'https://bombora.com',
    category: 'data',
    estimatedMinutes: 30,
    steps: [
      { action: 'Neem contact op met Bombora voor een demo en pricing' },
      { action: 'Definieer je intent-categorieën die matchen met je aanbod' },
      { action: 'Configureer je Company Surge® dashboard' },
      { action: 'Stel drempels in voor "surging" accounts' },
      { action: 'Koppel de data aan je CRM of ABM-platform' },
    ],
  },
  'Zapier/Make': {
    name: 'Zapier / Make',
    url: 'https://zapier.com',
    category: 'automation',
    estimatedMinutes: 30,
    steps: [
      { action: 'Maak een Zapier of Make account aan' },
      { action: 'Maak een Zap/Scenario: trigger = nieuwe alert uit je databron' },
      { action: 'Voeg een filter toe op basis van je drempelwaarde' },
      { action: 'Koppel de actie aan je CRM (lead/deal aanmaken)' },
      { action: 'Voeg een Slack-notificatie toe voor prioriteitsleads' },
      { action: 'Test de flow met een voorbeeld-trigger' },
    ],
  },
  'PhantomBuster': {
    name: 'PhantomBuster',
    url: 'https://phantombuster.com',
    category: 'automation',
    estimatedMinutes: 25,
    steps: [
      { action: 'Maak een PhantomBuster account aan' },
      { action: 'Installeer de Chrome-extensie en koppel je LinkedIn sessie' },
      { action: 'Kies een Phantom (bijv. LinkedIn Search Export of Profile Scraper)' },
      { action: 'Configureer de input: je LinkedIn zoek-URL of lijst' },
      { action: 'Stel een schema in (bijv. elke ochtend om 8:00)' },
      { action: 'Exporteer resultaten naar Google Sheets of je CRM' },
    ],
  },
  'Instantly': {
    name: 'Instantly',
    url: 'https://instantly.ai',
    category: 'outreach',
    estimatedMinutes: 40,
    steps: [
      { action: 'Maak een Instantly account aan' },
      { action: 'Voeg je verzend-mailboxen toe', detail: 'Gebruik 2-3 mailboxen op een apart domein voor spreiding' },
      { action: 'Warm je mailboxen op via de ingebouwde warm-up tool', detail: 'Laat dit minimaal 2 weken draaien voor je begint' },
      { action: 'Maak een campaign per scorezone' },
      { action: 'Upload je leadlijst of koppel via API' },
      { action: 'Schrijf je e-mailstappen met personalisatie-variabelen' },
      { action: 'Stel dagelijkse limieten in (30-50 per mailbox)' },
      { action: 'Activeer de campaign en monitor reply rates' },
    ],
  },
  'Smartlead': {
    name: 'Smartlead',
    url: 'https://www.smartlead.ai',
    category: 'outreach',
    estimatedMinutes: 40,
    steps: [
      { action: 'Maak een Smartlead account aan' },
      { action: 'Voeg je e-mailaccounts toe en start warm-up' },
      { action: 'Maak een campaign aan met AI-personalisatie' },
      { action: 'Upload je leads met custom velden voor triggers' },
      { action: 'Configureer je follow-up stappen en wachttijden' },
      { action: 'Stel auto-rotation in over meerdere mailboxen' },
      { action: 'Monitor de unified inbox voor replies' },
    ],
  },
  'HubSpot Workflows': {
    name: 'HubSpot Workflows',
    url: 'https://www.hubspot.com/products/crm/workflow-automation',
    category: 'outreach',
    estimatedMinutes: 35,
    steps: [
      { action: 'Ga naar Automation → Workflows in HubSpot' },
      { action: 'Maak een workflow per scorezone', detail: 'Bijv. "Nurture Flow", "Actieve Lead Flow", "Prioriteit Flow"' },
      { action: 'Stel de enrollment trigger in op basis van lead score of property' },
      { action: 'Voeg e-mail acties toe met je zone-specifieke templates' },
      { action: 'Voeg vertakkingen toe voor reply/no-reply scenario\'s' },
      { action: 'Stel taak-creatie in voor het sales team bij prioriteitsleads' },
      { action: 'Activeer en monitor de workflow performance' },
    ],
  },
  'Lemlist': {
    name: 'Lemlist',
    url: 'https://www.lemlist.com',
    category: 'outreach',
    estimatedMinutes: 35,
    steps: [
      { action: 'Maak een Lemlist account aan' },
      { action: 'Koppel je e-mailaccount en start warming' },
      { action: 'Maak een campaign aan voor je prioriteitszone' },
      { action: 'Gebruik de video/image personalisatie features', detail: 'Ideaal voor high-value prospects in de prioriteitszone' },
      { action: 'Upload leads met custom variabelen (trigger, bedrijf, functie)' },
      { action: 'Configureer multichannel stappen (e-mail + LinkedIn)' },
      { action: 'Test en activeer de campaign' },
    ],
  },
};

export function getSelectedToolGuides(inputs: Record<number, Record<string, any>>): ToolSetupGuide[] {
  const allSelected = new Set<string>();
  
  // Collect all selected tools from layers 3, 5, 7
  [3, 5, 7].forEach(layerId => {
    const tools = inputs[layerId]?._selectedTools;
    if (Array.isArray(tools)) {
      tools.forEach((t: string) => allSelected.add(t));
    }
  });

  return Array.from(allSelected)
    .map(name => TOOL_SETUP_GUIDES[name])
    .filter(Boolean);
}
