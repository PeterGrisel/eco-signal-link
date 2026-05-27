/**
 * Klantcases. Nog niet publiek; vul aan zodra resultaten gedeeld mogen worden.
 * Zet `published: true` om een case op de homepage te tonen. Zolang er geen
 * gepubliceerde cases zijn, toont de sectie nette placeholders.
 */

export interface CaseStudy {
  /** Klantnaam of geanonimiseerd label, bijv. "SaaS-bedrijf, 50 man" */
  client: string;
  sector: string;
  challenge: string;
  approach: string;
  results: { metric: string; label: string }[];
  published: boolean;
}

export const caseStudies: CaseStudy[] = [
  // Voorbeeldstructuur (op published: false zodat hij niet getoond wordt):
  // {
  //   client: "Voorbeeld B.V.",
  //   sector: "B2B SaaS",
  //   challenge: "Onvoorspelbare pipeline, alles op founder-led sales.",
  //   approach: "Commercieel Brein + Outbound Engine op eigen HubSpot.",
  //   results: [
  //     { metric: "€500k", label: "pipeline in kwartaal 1" },
  //     { metric: "20", label: "afspraken per maand" },
  //     { metric: "40%", label: "kortere salescyclus" },
  //   ],
  //   published: false,
  // },
];
