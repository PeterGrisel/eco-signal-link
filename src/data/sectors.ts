import { Trophy, Package, Car, Wrench, Building2, Landmark, Factory, GraduationCap, type LucideIcon } from "lucide-react";

export interface FunnelDefaults {
  monthlyRevenue: number;
  expenseRate: number;
  marketingRate: number;
  avgDealSize: number;
  optInRate: number;
  optInToSqlRate: number;
  sqlToCallRate: number;
  salesConversionRate: number;
  ltv: number;
}

export interface Sector {
  slug: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  challenges: string[];
  solutions: string[];
  signals: string[];
  funnelDefaults: FunnelDefaults;
}

export const sectors: Sector[] = [
  {
    slug: "profvoetbal",
    icon: Trophy,
    title: "Profvoetbal",
    tagline: "Sponsorwerving op een nieuw niveau.",
    description:
      "Sponsorwerving, partnerschappen en seizoensgebonden campagnes voor clubs en organisaties. Bereik beslissers bij merken die investeren in sport.",
    metaTitle: "B2B Leadgeneratie voor Profvoetbal — B2B GroeiMachine",
    metaDescription:
      "Sponsorwerving en partnerschappen voor profvoetbalclubs. Bereik beslissers bij merken die investeren in sport met ons bewezen outbound systeem.",
    challenges: [
      "Sponsorbudgetten staan onder druk en concurrentie neemt toe",
      "Beperkt netwerk bij commerciële beslissers buiten de sportwereld",
      "Seizoensgebonden verkoopcycli vereisen perfecte timing",
    ],
    solutions: [
      "Geautomatiseerde identificatie van bedrijven met sponsoringbudget",
      "Multichannel outreach naar CMO's, Marketing Directors en CEO's",
      "Seizoensgebonden campagnekalender afgestemd op contractmomenten",
    ],
    signals: [
      "Nieuwe marketingdirecteur aangesteld",
      "Bedrijf opent nieuwe vestiging of markt",
      "Sponsorcontract bij concurrent loopt af",
      "Groei in marketingbudget (jaarverslag)",
      "Evenement- of sportgerelateerde vacatures geplaatst",
    ],
    funnelDefaults: { monthlyRevenue: 150000, expenseRate: 35, marketingRate: 8, avgDealSize: 25000, optInRate: 2, optInToSqlRate: 15, sqlToCallRate: 50, salesConversionRate: 25, ltv: 24 },
  },
  {
    slug: "groothandel",
    icon: Package,
    title: "Groothandel",
    tagline: "Nieuwe afnemers, structureel gevonden.",
    description:
      "Nieuwe afnemers en retailers identificeren op basis van inkooppatronen, assortimentsuitbreiding en marktbewegingen.",
    metaTitle: "B2B Leadgeneratie voor Groothandels — B2B GroeiMachine",
    metaDescription:
      "Vind nieuwe afnemers en retailers voor uw groothandel. Data-gedreven prospecting op basis van inkooppatronen en marktbewegingen.",
    challenges: [
      "Nieuwe afnemers vinden buiten het bestaande netwerk",
      "Concurrentie op prijs maakt differentiatie lastig",
      "Lange sales cycles met meerdere beslissers",
    ],
    solutions: [
      "Signaaldetectie bij retailers die hun assortiment uitbreiden",
      "Gerichte outreach naar inkoopmanagers en category managers",
      "Geautomatiseerde opvolging over meerdere touchpoints",
    ],
    signals: [
      "Retailer opent nieuwe winkel of webshop",
      "Assortimentswijziging of nieuwe productcategorie",
      "Inkoper wisselt van functie of bedrijf",
      "Concurrent verliest distributieovereenkomst",
      "Groei in omzet of personeelsbestand",
    ],
    funnelDefaults: { monthlyRevenue: 200000, expenseRate: 25, marketingRate: 4, avgDealSize: 8000, optInRate: 3, optInToSqlRate: 20, sqlToCallRate: 60, salesConversionRate: 30, ltv: 18 },
  },
    icon: Car,
    title: "Leasemaatschappijen",
    tagline: "Timing is alles bij fleet management.",
    description:
      "Bedrijven met groeiend wagenpark, contractverlengingen en fleet managers die actief vergelijken. Timing is alles.",
    metaTitle: "B2B Leadgeneratie voor Leasemaatschappijen — B2B GroeiMachine",
    metaDescription:
      "Bereik fleet managers en bedrijven op het moment dat ze hun leasecontracten vergelijken. Data-gedreven timing voor maximale conversie.",
    challenges: [
      "Fleet managers worden overspoeld met aanbiedingen",
      "Contractmomenten zijn lastig te voorspellen zonder data",
      "Hoge concurrentie van grote spelers met meer budget",
    ],
    solutions: [
      "Signaaldetectie bij groeiende bedrijven en contractverloopmomenten",
      "Persoonlijke multichannel outreach naar fleet managers en CFO's",
      "Automatische timing op basis van markt- en bedrijfssignalen",
    ],
    signals: [
      "Bedrijf groeit in FTE (wagenpark schaalt mee)",
      "Nieuwe vestiging geopend",
      "Fleet manager gewisseld van positie",
      "Leasecontract loopt af (KvK/branchedata)",
      "Vacatures voor buitendienstmedewerkers geplaatst",
    ],
    funnelDefaults: { monthlyRevenue: 250000, expenseRate: 30, marketingRate: 5, avgDealSize: 15000, optInRate: 2.5, optInToSqlRate: 18, sqlToCallRate: 55, salesConversionRate: 28, ltv: 36 },
  },
    icon: Wrench,
    title: "Engineering",
    tagline: "Technische beslissers, bereikbaar gemaakt.",
    description:
      "Technische beslissers en projectmanagers bij industriële bedrijven. Van bouwprojecten tot productie-innovatie.",
    metaTitle: "B2B Leadgeneratie voor Engineering Bedrijven — B2B GroeiMachine",
    metaDescription:
      "Bereik technische beslissers en projectmanagers in de engineering sector. Van bouwprojecten tot productie-innovatie, wij leveren de gesprekken.",
    challenges: [
      "Technische beslissers zijn moeilijk te bereiken via traditionele kanalen",
      "Lange en complexe sales cycles met meerdere stakeholders",
      "Projectgebaseerd werk maakt timing cruciaal",
    ],
    solutions: [
      "Identificatie van lopende en aankomende projecten via openbare data",
      "Gerichte outreach naar projectmanagers, engineers en directie",
      "Technisch onderbouwde messaging die aansluit bij de doelgroep",
    ],
    signals: [
      "Nieuwe bouwvergunning of aanbesteding gepubliceerd",
      "Investering in productie-automatisering aangekondigd",
      "Technisch directeur of projectmanager aangesteld",
      "Uitbreiding productiecapaciteit (persberichten)",
      "Certificering of kwaliteitskeurmerk behaald",
    ],
    funnelDefaults: { monthlyRevenue: 180000, expenseRate: 28, marketingRate: 4, avgDealSize: 20000, optInRate: 2, optInToSqlRate: 15, sqlToCallRate: 50, salesConversionRate: 25, ltv: 12 },
  },
    icon: Building2,
    title: "Zakelijke Dienstverlening",
    tagline: "Groei voor accountants, juristen en consultants.",
    description:
      "Accountants, juristen en consultants die groeien. Bereik partners en directies op het juiste moment met de juiste boodschap.",
    metaTitle: "B2B Leadgeneratie voor Zakelijke Dienstverlening — B2B GroeiMachine",
    metaDescription:
      "Groei uw accountancy, juridisch of consultancy kantoor met data-gedreven leadgeneratie. Bereik partners en directies op het juiste moment.",
    challenges: [
      "Groei is afhankelijk van persoonlijk netwerk en referrals",
      "Partners hebben geen tijd voor actieve business development",
      "Differentiatie is lastig in een drukke markt",
    ],
    solutions: [
      "Geautomatiseerde identificatie van groeiende bedrijven die dienstverlening nodig hebben",
      "Outreach namens partners met persoonlijke, professionele tone of voice",
      "Signaaldetectie bij bedrijfsgebeurtenissen zoals fusies, groei en verhuizingen",
    ],
    signals: [
      "Bedrijf kondigt fusie, overname of herstructurering aan",
      "Nieuwe directeur of CFO aangesteld",
      "Verhuizing of nieuwe vestiging",
      "Groei in personeelsbestand (HR-signaal)",
      "Wijziging in KvK-registratie of rechtsvorm",
    ],
    funnelDefaults: { monthlyRevenue: 120000, expenseRate: 35, marketingRate: 6, avgDealSize: 10000, optInRate: 3.5, optInToSqlRate: 22, sqlToCallRate: 65, salesConversionRate: 35, ltv: 24 },
  },
    icon: Landmark,
    title: "Financiële Sector",
    tagline: "Nieuwe klanten in een competitieve markt.",
    description:
      "Vermogensbeheerders, verzekeraars en fintechs die nieuwe klanten of distributiekanalen zoeken in een competitieve markt.",
    metaTitle: "B2B Leadgeneratie voor de Financiële Sector — B2B GroeiMachine",
    metaDescription:
      "Vermogensbeheerders, verzekeraars en fintechs: vind nieuwe klanten en distributiekanalen met ons data-gedreven outbound systeem.",
    challenges: [
      "Strenge compliance-eisen beperken outreach-mogelijkheden",
      "Hoge concurrentie en lage differentiatie",
      "Lange doorlooptijden van eerste contact tot klant",
    ],
    solutions: [
      "Compliant outreach binnen de richtlijnen van AFM en DNB",
      "Gerichte targeting op basis van bedrijfsgrootte, vermogen en groeisignalen",
      "Geautomatiseerde nurture flows voor lange sales cycles",
    ],
    signals: [
      "Bedrijf bereikt vermogensdrempel voor adviesplicht",
      "Nieuwe CFO of financieel directeur aangesteld",
      "Pensioenregeling loopt af of wordt herzien",
      "Overname of investeringsronde afgerond",
      "Groei in omzet boven sectorgemiddelde",
    ],
    funnelDefaults: { monthlyRevenue: 300000, expenseRate: 30, marketingRate: 5, avgDealSize: 30000, optInRate: 1.5, optInToSqlRate: 12, sqlToCallRate: 45, salesConversionRate: 20, ltv: 36 },
  },
    icon: Factory,
    title: "Maakindustrie",
    tagline: "Van productievloer naar nieuwe markten.",
    description:
      "Productiebedrijven die investeren in automatisering, nieuwe markten betreden of hun supply chain uitbreiden.",
    metaTitle: "B2B Leadgeneratie voor de Maakindustrie — B2B GroeiMachine",
    metaDescription:
      "Productiebedrijven die groeien: vind nieuwe afnemers, supply chain partners en marktkansen met geautomatiseerde B2B leadgeneratie.",
    challenges: [
      "Afhankelijkheid van een beperkt aantal grote klanten",
      "Nieuwe markten betreden zonder lokaal netwerk",
      "Technische producten vereisen specifieke messaging",
    ],
    solutions: [
      "Identificatie van nieuwe afnemers en distributeurs in doelmarkten",
      "Technisch onderbouwde outreach naar inkopers en operations managers",
      "Internationale expansie-support met meertalige campagnes",
    ],
    signals: [
      "Investering in nieuwe productielijn of machines",
      "Uitbreiding naar nieuw exportland",
      "Operations manager of inkoopmanager gewisseld",
      "ISO-certificering of kwaliteitsaudit gepland",
      "Vacatures voor productiemedewerkers (capaciteitsgroei)",
    ],
    funnelDefaults: { monthlyRevenue: 250000, expenseRate: 25, marketingRate: 3, avgDealSize: 12000, optInRate: 2, optInToSqlRate: 16, sqlToCallRate: 50, salesConversionRate: 25, ltv: 18 },
  },
    icon: GraduationCap,
    title: "Opleiding & Training",
    tagline: "B2B-klanten voor incompany programma's.",
    description:
      "Trainingsbureaus en EdTech-bedrijven die B2B-klanten werven voor incompany trainingen, certificeringen en programma's.",
    metaTitle: "B2B Leadgeneratie voor Opleiding & Training — B2B GroeiMachine",
    metaDescription:
      "Werf B2B-klanten voor incompany trainingen en opleidingsprogramma's. Data-gedreven outreach naar HR-directors en L&D managers.",
    challenges: [
      "HR-budgetten fluctueren sterk per seizoen en economisch klimaat",
      "L&D managers worden overspoeld met trainingsaanbod",
      "Lange besluitvormingsprocessen bij grotere organisaties",
    ],
    solutions: [
      "Signaaldetectie bij bedrijven die investeren in talent development",
      "Gerichte outreach naar HR Directors, L&D Managers en People Leads",
      "Seizoensgebonden campagnes afgestemd op budgetcycli",
    ],
    signals: [
      "Bedrijf plaatst L&D of HR-development vacature",
      "Nieuwe HR Director of People Lead aangesteld",
      "Groei in personeelsbestand (onboarding-behoefte)",
      "Branche-certificering vereist bijscholing",
      "Jaarlijks opleidingsbudget vrijgegeven (Q1/Q4 signaal)",
    ],
    funnelDefaults: { monthlyRevenue: 80000, expenseRate: 30, marketingRate: 7, avgDealSize: 5000, optInRate: 4, optInToSqlRate: 25, sqlToCallRate: 65, salesConversionRate: 35, ltv: 6 },
  },

export const getSectorBySlug = (slug: string): Sector | undefined =>
  sectors.find((s) => s.slug === slug);
