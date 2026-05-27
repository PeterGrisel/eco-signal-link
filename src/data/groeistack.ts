/**
 * De Groeistack: onze gecureerde directory van GTM/AI-tools.
 * Dit bestand is de fallback/seed. De live data komt uit de Supabase-tabel
 * `groeistack_tools` (beheerbaar in /admin/groeistack); deze lijst wordt
 * getoond zolang de tabel leeg of onbereikbaar is.
 *
 * Omschrijvingen zijn onze eigen, neutrale samenvattingen van publieke
 * producten; geen overgenomen content van derden.
 */

export type GroeistackCategoryKey =
  | "signalen"
  | "verrijking"
  | "outreach"
  | "crm"
  | "ai"
  | "dashboard";

export interface GroeistackCategory {
  key: GroeistackCategoryKey;
  label: string;
  icon: "radar" | "database" | "send" | "workflow" | "sparkles" | "barchart";
  blurb: string;
}

export const groeistackCategories: GroeistackCategory[] = [
  { key: "signalen", label: "Signalen & data", icon: "radar", blurb: "Koop- en intentiesignalen detecteren." },
  { key: "verrijking", label: "Verrijking", icon: "database", blurb: "Lijsten verrijken en verifiëren." },
  { key: "outreach", label: "Outreach", icon: "send", blurb: "Multichannel benaderen op schaal." },
  { key: "crm", label: "CRM & pijplijn", icon: "workflow", blurb: "Eén bron van waarheid voor sales." },
  { key: "ai", label: "AI & content", icon: "sparkles", blurb: "Personalisatie, content en video." },
  { key: "dashboard", label: "Dashboard & attributie", icon: "barchart", blurb: "Meten, leren en bijsturen." },
];

export interface GroeistackToolSeed {
  name: string;
  category: GroeistackCategoryKey;
  description: string;
  website: string;
}

export const groeistackSeed: GroeistackToolSeed[] = [
  // Signalen & data
  { name: "Common Room", category: "signalen", description: "Verzamelt koop- en intentiesignalen uit veel verschillende bronnen.", website: "https://www.commonroom.io" },
  { name: "Koala", category: "signalen", description: "Laat zien welke bedrijven uw site bezoeken en wat ze doen.", website: "https://www.getkoala.com" },
  { name: "Trigify", category: "signalen", description: "Detecteert koopsignalen uit LinkedIn-activiteit.", website: "https://trigify.io" },
  // Verrijking
  { name: "Clay", category: "verrijking", description: "Bouwt en verrijkt prospect-lijsten met tientallen databronnen.", website: "https://www.clay.com" },
  { name: "Apollo", category: "verrijking", description: "Database van bedrijven en contacten, inclusief verrijking.", website: "https://www.apollo.io" },
  { name: "Ocean.io", category: "verrijking", description: "Vindt lookalike-bedrijven op basis van uw beste klanten.", website: "https://www.ocean.io" },
  // Outreach
  { name: "HeyReach", category: "outreach", description: "Geautomatiseerde LinkedIn-outreach op schaal.", website: "https://www.heyreach.io" },
  { name: "Smartlead", category: "outreach", description: "Cold e-mail op schaal met deliverability-beheer.", website: "https://www.smartlead.ai" },
  { name: "Instantly", category: "outreach", description: "E-mailcampagnes met inbox-rotatie en warming.", website: "https://instantly.ai" },
  { name: "lemlist", category: "outreach", description: "Multichannel sequenties met sterke personalisatie.", website: "https://www.lemlist.com" },
  // CRM & pijplijn
  { name: "HubSpot", category: "crm", description: "CRM en pijplijn als één bron van waarheid.", website: "https://www.hubspot.com" },
  { name: "Pipedrive", category: "crm", description: "Overzichtelijk sales-CRM voor kleinere teams.", website: "https://www.pipedrive.com" },
  { name: "Salesforce", category: "crm", description: "Enterprise-CRM met uitgebreide aanpasbaarheid.", website: "https://www.salesforce.com" },
  // AI & content
  { name: "Claude", category: "ai", description: "AI-assistent voor research, personalisatie en content.", website: "https://www.anthropic.com" },
  { name: "ChatGPT", category: "ai", description: "AI voor copy, research en workflow-automatisering.", website: "https://openai.com/chatgpt" },
  { name: "HeyGen", category: "ai", description: "AI-video met avatars voor outreach en content.", website: "https://www.heygen.com" },
  // Dashboard & attributie
  { name: "Dreamdata", category: "dashboard", description: "B2B-omzetattributie over al uw kanalen.", website: "https://dreamdata.io" },
  { name: "Metabase", category: "dashboard", description: "Dashboards en analyses op uw eigen data.", website: "https://www.metabase.com" },
];

/** Favicon-URL als logo-fallback wanneer er geen logo_url is opgeslagen. */
export const faviconFor = (website: string): string => {
  try {
    const host = new URL(website).hostname;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
  } catch {
    return "";
  }
};
