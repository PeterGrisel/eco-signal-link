/**
 * Gedeelde JSON-LD bouwstenen.
 *
 * Doel: zoekmachines en AI-antwoordmachines (Google AI Overviews, Perplexity,
 * ChatGPT Search) laten begrijpen wat wij leveren, voor wie en in welke vorm.
 * De teksten volgen de propositie: managed growth infrastructure, geen tooling.
 */

export const SITE_URL = "https://www.b2bgroeimachine.io";

export const ORGANIZATION_ID = `${SITE_URL}/#organisatie`;

export const SERVICES = [
  {
    name: "Outbound",
    description:
      "Markt in kaart, hypotheses per segment, multichannel activatie en opvolging. Voor groei buiten uw bestaande klantenbestand.",
    serviceType: "Signal-based outbound prospecting",
  },
  {
    name: "ABM",
    description:
      "Een afgebakende lijst named accounts, per account een eigen hypothese en een route naar de juiste beslisser.",
    serviceType: "Account-based marketing",
  },
  {
    name: "Nurturing",
    description:
      "Accounts met fit maar zonder timing blijven in beeld tot het bewijs stapelt en de timing klopt.",
    serviceType: "Lead nurturing",
  },
  {
    name: "RevOps",
    description:
      "Datamodel, CRM-inrichting, routing en rapportage. Het fundament waar outbound, ABM en nurturing op rusten.",
    serviceType: "Revenue operations",
  },
  {
    name: "GTM as a Service",
    description:
      "De vier diensten op één engine, van signaal tot hand-off met reason codes. Vanaf € 1.500 per maand.",
    serviceType: "Go-to-market as a service",
    price: 1500,
  },
];

const AREA_SERVED = [
  { "@type": "Country", name: "NL" },
  { "@type": "Country", name: "BE" },
];

/** Organisatie + dienstencatalogus voor de homepage. */
export const buildServicesSchema = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": ORGANIZATION_ID,
      name: "B2BGroeiMachine",
      url: SITE_URL,
      description:
        "B2BGroeiMachine bouwt managed growth infrastructure voor B2B-organisaties: één commerciële engine die signalen omzet in gesprekken en sales-ready activiteiten, bovenop uw eigen stack en CRM.",
      slogan: "Van omzetdoel naar opportunity flow",
      areaServed: AREA_SERVED,
      telephone: "+31852502925",
      knowsAbout: [
        "Managed growth infrastructure",
        "Signal-based prospecting",
        "Intent data",
        "Account based marketing",
        "Revenue operations",
        "Multichannel outreach",
        "AI voor B2B sales",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Managed growth diensten",
        itemListElement: SERVICES.map((service, i) => ({
          "@type": "Offer",
          position: i + 1,
          ...(service.price
            ? {
                price: service.price,
                priceCurrency: "EUR",
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price: service.price,
                  priceCurrency: "EUR",
                  unitCode: "MON",
                  billingIncrement: 1,
                },
              }
            : {}),
          itemOffered: {
            "@type": "Service",
            name: service.name,
            description: service.description,
            serviceType: service.serviceType,
            areaServed: AREA_SERVED,
            provider: { "@id": ORGANIZATION_ID },
          },
        })),
      },
    },
  ],
});

export interface SchemaClient {
  name: string;
  website?: string | null;
  domain?: string | null;
  sector?: string | null;
  description?: string | null;
  logo_url?: string | null;
}

/** Klantenlijst als ItemList met Organization-items. */
export const buildClientsSchema = (clients: SchemaClient[], pageUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Klanten van B2BGroeiMachine",
  description:
    "B2B-organisaties waarvoor B2BGroeiMachine een commerciële groeimachine ontwerpt, bouwt en beheert.",
  url: pageUrl,
  numberOfItems: clients.length,
  itemListElement: clients.map((client, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Organization",
      name: client.name,
      ...(client.website || client.domain
        ? { url: client.website || `https://${client.domain}` }
        : {}),
      ...(client.logo_url ? { logo: client.logo_url } : {}),
      ...(client.description ? { description: client.description } : {}),
      ...(client.sector ? { knowsAbout: [client.sector] } : {}),
      subjectOf: {
        "@type": "Service",
        name: "Managed growth infrastructure",
        provider: { "@id": ORGANIZATION_ID },
      },
    },
  })),
});
