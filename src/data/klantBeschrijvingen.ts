/**
 * Beschrijvingen voor de klantkaarten op /klanten: wat het bedrijf doet, wat
 * het nodig had en welke functies van het brein dat oplossen. Bron: de
 * Notion-dossiers en HubSpot, afgestemd met Peter.
 *
 * Gaat voor op de beschrijving in de database, zodat elke kaart dezelfde
 * opbouw heeft. Klanten die hier niet staan, tonen hun database-beschrijving.
 */
export type BreinFunctieNaam =
  | "Leads"
  | "Outreach"
  | "Taken"
  | "Reporting"
  | "Content planning"
  | "Agents"
  | "Skilllab"
  | "Ads";

export type KlantBeschrijving = {
  /** Delen van de naam waarop we matchen (kleine letters, alleen letters en cijfers). */
  match: string[];
  omschrijving: string;
  behoefte: string;
  brein: BreinFunctieNaam[];
};

export const KLANT_BESCHRIJVINGEN: KlantBeschrijving[] = [
  { match: ["burg"], omschrijving: "Bemiddelt QHSE-professionals in petrochemie, food en maakindustrie.", behoefte: "Structureel nieuwe opdrachtgevers vinden.", brein: ["Leads", "Outreach"] },
  { match: ["censo"], omschrijving: "Energieadviseur voor het mkb.", behoefte: "Per doelgroep in gesprek komen, van mkb tot bakkerijen.", brein: ["Outreach"] },
  { match: ["storingservice"], omschrijving: "Storingsdienst voor aannemers en woningcorporaties.", behoefte: "Elke melding direct op de juiste plek.", brein: ["Agents"] },
  { match: ["mrmaas", "mistermaas"], omschrijving: "Helpt bedrijven hun wagenparkkosten te verlagen.", behoefte: "Facility- en HR-managers bereiken en vast opvolgen.", brein: ["Outreach", "Taken"] },
  { match: ["dux"], omschrijving: "Data-consultancy.", behoefte: "Een commerciële motor voor de groep en AI-kennis in het team.", brein: ["Leads", "Outreach", "Skilllab"] },
  { match: ["salunova"], omschrijving: "Adviesbureau voor zorg en pharma.", behoefte: "Een eerste pharma-product in de markt zetten.", brein: ["Leads", "Outreach"] },
  { match: ["growprofs"], omschrijving: "Detacheerder van consultants.", behoefte: "Scherpere proposities en één CRM met vaste opvolging.", brein: ["Taken", "Reporting"] },
  { match: ["leister"], omschrijving: "Leverancier van hete-lucht- en kunststoflasapparatuur.", behoefte: "Accountmanagers die vanuit signalen nieuwe klanten vinden.", brein: ["Leads", "Outreach", "Taken"] },
  { match: ["corevision"], omschrijving: "Ontwikkelhuis voor embedded systemen, FPGA en Edge AI.", behoefte: "Van founder-led sales naar een vaste stroom passende leads.", brein: ["Leads"] },
  { match: ["eurofast"], omschrijving: "Fabrikant van bevestigingssystemen voor platdak en bouw.", behoefte: "Nieuwe landen openen.", brein: ["Leads", "Outreach"] },
  { match: ["excelsior"], omschrijving: "Profvoetbalclub uit Rotterdam.", behoefte: "Bedrijven werven voor de Business Club.", brein: ["Leads", "Outreach"] },
  { match: ["infinit"], omschrijving: "IT-recruitmentbureau voor sales- en techprofielen.", behoefte: "Hiring managers en kandidaten tegelijk bereiken.", brein: ["Outreach"] },
  { match: ["mediagroep"], omschrijving: "Mediabureau voor websites, branding en audiovisueel.", behoefte: "Mkb in Noord-Holland bereiken voor Dé Sitebuilders.", brein: ["Outreach", "Taken"] },
  { match: ["rtc"], omschrijving: "Investeringsmaatschappij met vastrentende en goudgerelateerde producten.", behoefte: "Een vaste instroom van geïnteresseerden.", brein: ["Outreach"] },
  { match: ["socialpromotion"], omschrijving: "Recruitment-marketingbureau dat vacatures vult via social campagnes.", behoefte: "HR-managers en directeuren bereiken.", brein: ["Outreach"] },
  { match: ["thriveos"], omschrijving: "Meet en traint prestatievaardigheden, van topsport naar bedrijfsleven.", behoefte: "HR en organisaties bereiken voor hun talentontwikkeling.", brein: ["Leads", "Outreach"] },
  { match: ["drivewise"], omschrijving: "Merkonafhankelijke autolease en wagenparkbeheer voor het mkb.", behoefte: "Een vaste stroom sales-ready leads.", brein: ["Leads", "Outreach"] },
  { match: ["yaskawa"], omschrijving: "Fabrikant van industriële robots, aandrijvingen en besturingen.", behoefte: "Een scherp ICP en nieuwe klanten in de Benelux.", brein: ["Leads", "Outreach"] },
  { match: ["datahub"], omschrijving: "Helpt organisaties sneller betere beslissingen te nemen met data en AI.", behoefte: "Toepassingen die het platform in de praktijk laten werken.", brein: ["Agents"] },
  { match: ["gobytes"], omschrijving: "Verkoopt refurbished laptops, desktops, smartphones en tablets.", behoefte: "Zakelijke afnemers bereiken.", brein: ["Leads", "Outreach"] },
  { match: ["krak"], omschrijving: "Juridisch adviesbureau voor ondernemers.", behoefte: "Nieuwe zakelijke cliënten bereiken.", brein: ["Leads", "Outreach"] },
];

const normaal = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Zoekt de beschrijving bij een klantnaam uit de database. */
export function beschrijvingVoor(naam: string, domein?: string | null): KlantBeschrijving | undefined {
  const sleutels = [normaal(naam), normaal(domein ?? "")];
  return KLANT_BESCHRIJVINGEN.find((b) => b.match.some((m) => sleutels.some((s) => s.includes(m))));
}
