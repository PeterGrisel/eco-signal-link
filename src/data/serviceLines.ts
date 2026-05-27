/**
 * Vier geproductiseerde dienstlijnen op één fundament (het Commercieel Brein).
 * Elke lijn heeft een expliciet "voor wie"-profiel zodat de bezoeker direct
 * herkent of het bij hem past. Wijzig hier -> consistent op de homepage.
 *
 * Copy-regels: B1 Nederlands, u/uw, geen em-dashes.
 */

export type ServiceIcon = "outbound" | "abm" | "brein" | "content";

export interface ServiceLine {
  slug: string;
  name: string;
  eyebrow: string;
  tagline: string;
  /** ICP-gate: het "voor wie"-profiel */
  criteria: string[];
  /** Wat er in de lijn zit */
  includes: string[];
  /** Resultaat in één zin */
  outcome: string;
  icon: ServiceIcon;
  /** Optionele verdiepende pagina; ontbreekt -> alleen scan-CTA */
  href?: string;
  highlight?: boolean;
}

export const serviceLines: ServiceLine[] = [
  {
    slug: "outbound-engine",
    name: "Outbound Engine",
    eyebrow: "Volume & snelheid",
    tagline:
      "Geautomatiseerde outreach via e-mail, LinkedIn en telefoon, gestuurd door koopsignalen.",
    criteria: [
      "Brede markt: meer dan 2.000 bedrijven in uw ICP",
      "Herhaalbare propositie met dealwaarde vanaf €5k",
      "U wilt structureel volume, geen losse campagnes",
    ],
    includes: [
      "Signaal-gedreven prospecting en verrijking",
      "Multichannel sequenties met AI-personalisatie",
      "Automatische opvolging tot het gesprek",
      "Replies gerouteerd naar uw sales",
    ],
    outcome: "Een voorspelbare stroom gekwalificeerde afspraken.",
    icon: "outbound",
    href: "/solutions/outbound-automatisering",
    highlight: true,
  },
  {
    slug: "abm-key-accounts",
    name: "ABM & Key Accounts",
    eyebrow: "Precisie & dealwaarde",
    tagline:
      "Account-based bewerking van een korte lijst hoogwaardige accounts.",
    criteria: [
      "Smalle markt: minder dan 2.000 doelaccounts",
      "Hoge dealwaarde, vanaf €50k per klant",
      "Complexe DMU met meerdere beslissers",
    ],
    includes: [
      "Scherpe ICP- en accountselectie",
      "Diepe account- en stakeholderresearch",
      "Gepersonaliseerde multithreading",
      "Founder-led en signaal-getimed contact",
    ],
    outcome: "Toegang tot de accounts die uw kwartaal maken.",
    icon: "abm",
    href: "/solutions/gerichte-prospecting",
  },
  {
    slug: "commercieel-brein",
    name: "Commercieel Brein",
    eyebrow: "Fundament & data",
    tagline:
      "ICP, signaal-scoring, CRM-discipline en routing. Gebouwd op uw eigen tools.",
    criteria: [
      "U heeft een salesteam, maar mist voorspelbaarheid",
      "Eigen CRM, zoals HubSpot of vergelijkbaar",
      "Data zit versnipperd over losse tools",
    ],
    includes: [
      "ICP en signaal-scoring als één laag",
      "CRM-inrichting en pipeline-discipline",
      "Verrijking en één bron van waarheid",
      "Dashboard, attributie en lerende loops",
    ],
    outcome: "Eén brein dat elke campagne slimmer maakt.",
    icon: "brein",
    href: "/solutions/data-gedreven-sales",
  },
  {
    slug: "content-autoriteit",
    name: "Content & Autoriteit",
    eyebrow: "Vraag creëren",
    tagline:
      "Founder-led LinkedIn-content en video die vraag opbouwt vóór de outreach.",
    criteria: [
      "Uw ICP is actief op LinkedIn",
      "De founder of experts willen zichtbaar zijn",
      "U wilt inbound naast outbound opbouwen",
    ],
    includes: [
      "Contentstrategie rond uw ICP",
      "LinkedIn-distributie en founder-profiel",
      "Video (AI) en visuele assets",
      "Nurture die warme leads opvolgt",
    ],
    outcome: "Een publiek dat u kent voordat u belt.",
    icon: "content",
  },
];

export interface SupportingService {
  label: string;
  description: string;
  href: string;
}

/** Aanvullende diensten die op het fundament voortbouwen. */
export const supportingServices: SupportingService[] = [
  {
    label: "Commercieel talent",
    description: "Recruitment als systeem: sourcen, screenen en plaatsen.",
    href: "/full-service-recruitment",
  },
  {
    label: "Full sales management",
    description: "Wij draaien uw complete commerciële operatie.",
    href: "/full-sales-management",
  },
  {
    label: "Trainingen",
    description: "Uw team leert het systeem zelf te bedienen.",
    href: "/trainingen",
  },
];
