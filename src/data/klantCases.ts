/**
 * Klantcases. Teksten en cijfers zijn dezelfde als op /hoe-het-werkt
 * (ExactCaseStudies); niets toevoegen zonder bevestiging van Peter.
 */
export type KlantCase = {
  company: string;
  logo: string;
  sector: string;
  title: string;
  body: string;
  metrics: { label: string; value: string; delta: string }[];
  /** Dienstpagina's waar deze case bij past. */
  diensten: string[];
};

export const KLANT_CASES: KlantCase[] = [
  {
    company: "Core-Vision",
    logo: "/logos/core-vision-logo.png",
    sector: "Embedded Tech",
    title: "Van founder-led sales naar 200+ leads",
    body: "Voor Core-Vision, een embedded-hardware bedrijf dat sales nog founder-led deed, bouwden we een ABM-systeem: 12 ICP-campagnes, een nurture-laag en automatische lead-routing naar het CRM.",
    metrics: [
      { label: "Engaged leads", value: "200+", delta: "ICP Focus" },
      { label: "ICP-campagnes", value: "12", delta: "Active" },
      { label: "Nurture accounts", value: "2.000", delta: "In CRM" },
    ],
    diensten: ["ai-automation"],
  },
  {
    company: "Eurofast",
    logo: "/logos/eurofast-logo.png",
    sector: "Industrie",
    title: "Van nul naar globale push",
    body: "Voor Eurofast, een industriële speler in bevestigingstechniek, zetten we de internationale groei op: de EU-markt in kaart (TAM/SAM), een partnerplan voor Azië en de eerste nieuwe markten geactiveerd met outbound.",
    metrics: [
      { label: "Markten in scope", value: "5", delta: "EU & Azië" },
      { label: "TAM/SAM EU", value: "Opgezet", delta: "Voltooid" },
      { label: "Engaged contacten", value: "264", delta: "Sales-ready" },
    ],
    diensten: ["outreach-as-a-service"],
  },
  {
    company: "Excelsior",
    logo: "/logos/excelsior-logo.png",
    sector: "Sport & Sponsoring",
    title: "Van club naar sponsor",
    body: "Voor Excelsior bouwden wij een sponsorsysteem. Wij mappen lokale bedrijven, activeren beslissers en zetten vrouwenvoetbal actief op de kaart. Elk signaal wordt een gesprek voor het commerciële team.",
    metrics: [
      { label: "Bedrijven in kaart", value: "5.000+", delta: "TAM/SAM/SOM" },
      { label: "Open rate", value: "50%", delta: "Op outbound" },
      { label: "Reply rate", value: "25%", delta: "Op outbound" },
    ],
    diensten: ["outreach-as-a-service"],
  },
  {
    company: "Leister",
    logo: "/logos/leister-logo.png",
    sector: "Technisch groothandel",
    title: "Van farmen naar hunting",
    body: "Voor Leister, een technisch groothandel, verschuiven wij het commerciële model. Account managers werken vanuit signalen in plaats van bestaande relaties. Hun netwerk breidt maandelijks uit met nieuwe beslissers en installateurs.",
    metrics: [
      { label: "Nieuwe accounts", value: "800+", delta: "Continu" },
      { label: "Qualifiers", value: "5", delta: "Per maand" },
      { label: "Netwerkgroei", value: "Continu", delta: "Maandelijks" },
    ],
    diensten: ["ai-automation"],
  },
];
