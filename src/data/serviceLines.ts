/**
 * Vier geproductiseerde dienstlijnen op één fundament (het Commercieel Brein).
 * Elke lijn heeft een expliciet "voor wie"-profiel én een eigen detailpagina
 * op /diensten/:slug. Wijzig hier -> consistent op homepage en detailpagina.
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
  highlight?: boolean;

  // ---- Detailpagina (/diensten/:slug) ----
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroTitleGradient: string;
  heroDescription: string;
  problemTitle: string;
  problemDescription: string;
  problems: string[];
  process: { step: string; title: string; description: string }[];
  results: { metric: string; label: string }[];
  /** Verwante solution-pagina voor interne link */
  relatedSolution?: string;
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
    highlight: true,
    metaTitle:
      "Outbound Engine — geautomatiseerde B2B-outreach | B2BGroeiMachine",
    metaDescription:
      "Multichannel outreach via e-mail, LinkedIn en telefoon, gestuurd door koopsignalen. Een voorspelbare stroom gekwalificeerde afspraken.",
    heroTitle: "Outbound die",
    heroTitleGradient: "blijft draaien.",
    heroDescription:
      "Stop met losse campagnes. Wij bouwen een outbound-machine die elke dag prospects vindt, benadert en opvolgt. U voert alleen nog de gesprekken.",
    problemTitle: "Handmatige outbound schaalt niet.",
    problemDescription:
      "Losse acties leveren losse resultaten. Zodra het druk wordt, stopt de flow.",
    problems: [
      "Outreach gebeurt met pieken en dalen",
      "Opvolging verwatert na het eerste bericht",
      "Berichten zijn te generiek voor een reply",
      "Geen zicht op wat werkt per kanaal",
    ],
    process: [
      {
        step: "01",
        title: "Signalen & lijsten",
        description:
          "We vinden bedrijven die nu koopsignalen afgeven en verrijken ze.",
      },
      {
        step: "02",
        title: "Sequenties bouwen",
        description:
          "E-mail, LinkedIn en telefoon in één gecoördineerde flow.",
      },
      {
        step: "03",
        title: "Personaliseren met AI",
        description: "Elk bericht afgestemd op bedrijf, rol en signaal.",
      },
      {
        step: "04",
        title: "Routeren & leren",
        description:
          "Replies naar uw sales; elke cyclus stelt het systeem bij.",
      },
    ],
    results: [
      { metric: "5x", label: "meer outreachvolume" },
      { metric: "35%", label: "hogere reply rates" },
      { metric: "70%", label: "minder handwerk voor sales" },
    ],
    relatedSolution: "outbound-automatisering",
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
    metaTitle:
      "ABM & Key Accounts — account-based B2B-groei | B2BGroeiMachine",
    metaDescription:
      "Een korte lijst hoogwaardige accounts, diep bewerkt. Multithreading op de beslissers die uw kwartaal maken.",
    heroTitle: "Een korte lijst.",
    heroTitleGradient: "Maximale impact.",
    heroDescription:
      "Bij hoge dealwaarde telt elk account. Wij bewerken uw belangrijkste prospects met research, personalisatie en timing op meerdere beslissers tegelijk.",
    problemTitle: "Bij grote deals werkt volume niet.",
    problemDescription:
      "Massa-outreach mist de nuance die enterprise-deals vragen. U heeft precisie nodig, geen ruis.",
    problems: [
      "Eén contactpersoon, terwijl de DMU groot is",
      "Generieke pitch op een complexe behoefte",
      "Geen zicht op het juiste moment om te bewegen",
      "Belangrijke accounts vallen tussen wal en schip",
    ],
    process: [
      {
        step: "01",
        title: "Account- & ICP-selectie",
        description: "We bakenen de accounts af die het waard zijn.",
      },
      {
        step: "02",
        title: "Diepe research",
        description:
          "Stakeholders, context, triggers en ingangen in kaart.",
      },
      {
        step: "03",
        title: "Multithreading",
        description:
          "Meerdere beslissers tegelijk, persoonlijk en getimed.",
      },
      {
        step: "04",
        title: "Founder-led contact",
        description: "Senioriteit waar het telt, met signaal-timing.",
      },
    ],
    results: [
      { metric: "4x", label: "hogere reply rates" },
      { metric: "60%", label: "minder volume nodig" },
      { metric: "50%", label: "meer afspraken bij key accounts" },
    ],
    relatedSolution: "gerichte-prospecting",
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
    metaTitle:
      "Commercieel Brein — RevOps, data en CRM-discipline | B2BGroeiMachine",
    metaDescription:
      "ICP, signaal-scoring, CRM-inrichting en routing op uw eigen tools. Eén bron van waarheid die elke campagne slimmer maakt.",
    heroTitle: "Het fundament",
    heroTitleGradient: "onder uw groei.",
    heroDescription:
      "Voor wie al een salesteam heeft maar voorspelbaarheid mist. Wij leggen de intelligentie, data en discipline neer waarop elke beweging voortbouwt.",
    problemTitle: "Zonder fundament blijft groei toeval.",
    problemDescription:
      "Versnipperde tools en losse data maken sturen onmogelijk. Het brein ontbreekt.",
    problems: [
      "Data zit verspreid over losse tools",
      "Niemand heeft een compleet pipelinebeeld",
      "Sales prioriteert op gevoel, niet op signaal",
      "Rapportages kosten uren en zijn snel achterhaald",
    ],
    process: [
      {
        step: "01",
        title: "Context & ICP vastleggen",
        description: "Markt, data en klantkennis in één laag.",
      },
      {
        step: "02",
        title: "Signaal-scoring",
        description: "Regels die fit, intent en timing wegen.",
      },
      {
        step: "03",
        title: "CRM-discipline",
        description:
          "Pipeline-stages, verrijking en één bron van waarheid.",
      },
      {
        step: "04",
        title: "Dashboard & loops",
        description: "Attributie en sturing die elke maand bijstelt.",
      },
    ],
    results: [
      { metric: "45%", label: "hogere conversie lead naar deal" },
      { metric: "100%", label: "datasynchronisatie tussen tools" },
      { metric: "1", label: "dashboard voor het hele proces" },
    ],
    relatedSolution: "data-gedreven-sales",
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
    metaTitle:
      "Content & Autoriteit — founder-led LinkedIn-content | B2BGroeiMachine",
    metaDescription:
      "Founder-led content en video die vraag opbouwt vóór de outreach. Een publiek dat u kent voordat u belt.",
    heroTitle: "Bekend zijn",
    heroTitleGradient: "voordat u belt.",
    heroDescription:
      "Koud benaderen werkt beter als uw naam al opvalt. Wij bouwen autoriteit op LinkedIn met content en video, zodat outreach op warme grond landt.",
    problemTitle: "Koud is koud zolang niemand u kent.",
    problemDescription:
      "Zonder zichtbaarheid begint elk gesprek bij nul. Content verandert dat.",
    problems: [
      "Uw expertise blijft onzichtbaar voor de markt",
      "Outreach landt bij mensen die u niet kennen",
      "Geen inbound naast de outbound",
      "Founder-kennis wordt niet benut als asset",
    ],
    process: [
      {
        step: "01",
        title: "Contentstrategie",
        description: "Thema's en hoeken die uw ICP raken.",
      },
      {
        step: "02",
        title: "Founder-profiel",
        description: "Positionering en ritme op LinkedIn.",
      },
      {
        step: "03",
        title: "Productie",
        description: "Posts en video (AI), met weinig tijd van u.",
      },
      {
        step: "04",
        title: "Nurture",
        description: "Warme reacties worden opgevolgd richting gesprek.",
      },
    ],
    results: [
      { metric: "Warm", label: "in plaats van koud contact" },
      { metric: "Inbound", label: "naast uw outbound" },
      { metric: "Autoriteit", label: "die deuren opent" },
    ],
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
