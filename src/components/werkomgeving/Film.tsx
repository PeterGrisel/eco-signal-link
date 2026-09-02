import { fase } from "@/hooks/useScrollProgress";
import {
  Balk,
  Beurt,
  Cursor,
  FilmKader,
  Logo,
  type Beeld,
  type Stap,
} from "./FilmKader";

/**
 * Film één: van vraag tot afspraak.
 *
 * Uitleggen wat een opportunity-engine doet kost drie alinea's; het één keer
 * zien duurt twintig seconden. Dit is die twintig seconden: u stelt een vraag,
 * de bronnen slaan aan, de signalen worden gewogen, de accounts landen in het
 * CRM met een reden, u vraagt door, en onderaan staat wat het opleverde.
 *
 * Het is een nagebouwde omgeving met voorbeelddata, geen opname van een klant —
 * daarom staat "voorbeeld" in de balk en onder het kader. De bedrijfsnamen zijn
 * verzonnen en de cijfers illustratief.
 */

const STAPPEN: Stap[] = [
  { titel: "De vraag", duur: 4600 },
  { titel: "De bronnen", duur: 5200 },
  { titel: "Het wegen", duur: 4400 },
  { titel: "De actie", duur: 4400 },
  { titel: "De vervolgvraag", duur: 5200 },
  { titel: "De opbrengst", duur: 4200 },
];

const VRAAG =
  "Welke bedrijven in de maakindustrie laten deze week een aanleiding zien om ons te spreken?";
const VERVOLG = "Waarom staat Van Dijk bovenaan?";

/** De bronnen die aanslaan, met wat ze terugbrengen. */
const BRONNEN = [
  { tool: "Apollo", call: "accounts_search", uit: "1.284 accounts in scope" },
  { tool: "Apollo", call: "website_visitors", uit: "37 bezoeken deze week" },
  { tool: "HeyReach", call: "profile_views", uit: "12 profielbezoeken" },
  { tool: "Clay", call: "enrich_companies", uit: "1.284 verrijkt" },
  { tool: "HubSpot", call: "deals_open", uit: "6 open deals" },
  { tool: "n8n", call: "signal_sync", uit: "9 nieuws- en vacaturesignalen" },
];

/** De unieke tools uit BRONNEN, voor de zijbalk. */
const TOOLS = [...new Set(BRONNEN.map((b) => b.tool))];

const ACCOUNTS = [
  {
    naam: "Van Dijk Machinebouw",
    score: 92,
    aanleiding: "Vacature productieleider + tweede bezoek prijzenpagina",
    actie: "Bellen deze week",
    eigenaar: "Sales — Mark",
  },
  {
    naam: "Nedstaal Componenten",
    score: 78,
    aanleiding: "Nieuwe vestiging aangekondigd, geen contact in 9 maanden",
    actie: "LinkedIn + mail",
    eigenaar: "Sales — Inge",
  },
  {
    naam: "Bergman Systems",
    score: 64,
    aanleiding: "Drie profielbezoeken, nog geen aanleiding",
    actie: "Warm houden",
    eigenaar: "Nurturing",
  },
];

const REDENEN = [
  "Fit op profiel — maakindustrie, 80-250 medewerkers, eigen productie",
  "Aanleiding — vacature productieleider, twee weken oud",
  "Timing — tweede bezoek aan de prijzenpagina binnen acht dagen",
  "Relatie — al negen maanden geen contact vanuit ons",
];

const OPBRENGST = [
  { getal: 34, label: "Opportunities deze week" },
  { getal: 18, label: "Naar sales gestuurd" },
  { getal: 15, label: "Geaccepteerd door sales" },
  { getal: 6, label: "Gesprekken ingepland" },
];

/** De bronnen kleuren op zodra stap twee ze aanroept. */
function Bronnen({ stap, t }: Beeld) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2.5 lg:block lg:space-y-2.5">
      {TOOLS.map((tool, i) => {
        const aan = stap > 1 || (stap === 1 && t > (i + 0.5) / TOOLS.length);
        return (
          <li key={tool} className="flex items-center gap-2">
            <span
              aria-hidden
              className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${
                aan ? "bg-brand-accent" : "bg-brand-line"
              }`}
            />
            <Logo naam={tool} klasse="h-4 w-4" />
            <span
              className={`truncate text-[12px] transition-colors duration-300 ${
                aan ? "text-brand-ink" : "text-brand-ink-3"
              }`}
            >
              {tool}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function Film() {
  return (
    <FilmKader
      titel="Werkomgeving"
      stappen={STAPPEN}
      railTitel="Bronnen"
      rail={(beeld) => <Bronnen {...beeld} />}
    >
      {({ stap, t, getikt }) => (
        <>
          {/* 1 · De vraag */}
          <Beurt wie="u">
            <p className="text-[14px] leading-relaxed text-brand-ink">
              {stap === 0 ? getikt(VRAAG, 0.8) : VRAAG}
              {stap === 0 && t < 0.85 && <Cursor />}
            </p>
          </Beurt>

          {/* 2 · De bronnen */}
          {stap >= 1 && (
            <Beurt wie="engine">
              <p className="mb-3 text-[13.5px] text-brand-ink-2">
                Ik haal op wat er deze week bewoog.
              </p>
              <ul className="space-y-1.5">
                {BRONNEN.map((b, i) => {
                  const klaar = stap > 1 || t > (i + 1) / (BRONNEN.length + 0.5);
                  if (stap === 1 && t < i / (BRONNEN.length + 0.5)) return null;
                  return (
                    <li
                      key={b.tool + b.call}
                      className="flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-[2px] border border-brand-line bg-brand-mist/70 px-2.5 py-1.5"
                    >
                      <Logo naam={b.tool} klasse="h-3.5 w-3.5" />
                      <span className="font-mono text-[10.5px] text-brand-ink-2">
                        {b.tool.toLowerCase()}·{b.call}
                      </span>
                      <span
                        className={`ml-auto font-mono text-[10.5px] transition-opacity duration-300 ${
                          klaar ? "text-brand-ink opacity-100" : "opacity-0"
                        }`}
                      >
                        {b.uit}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Beurt>
          )}

          {/* 3 · Het wegen */}
          {stap >= 2 && (
            <Beurt wie="engine">
              <p className="mb-3 text-[13.5px] text-brand-ink-2">
                Ik weeg fit, aanleiding en timing per account.
              </p>
              <ul className="space-y-3">
                {ACCOUNTS.map((a, i) => {
                  const deel =
                    stap > 2 ? 1 : fase(t, 0.1 + i * 0.12, 0.6 + i * 0.12);
                  return (
                    <li key={a.naam}>
                      <p className="mb-1.5 flex items-baseline justify-between gap-3">
                        <span className="text-[13px] font-medium text-brand-ink">
                          {a.naam}
                        </span>
                        <span className="font-mono text-[11px] text-brand-ink-3">
                          {Math.round(a.score * deel)}
                        </span>
                      </p>
                      <Balk pct={a.score * deel} />
                    </li>
                  );
                })}
              </ul>
            </Beurt>
          )}

          {/* 4 · De actie */}
          {stap >= 3 && (
            <Beurt wie="engine">
              <p className="mb-3 text-[13.5px] text-brand-ink-2">
                Ze staan in uw CRM, met de aanleiding en een voorstel.
              </p>
              <ul className="space-y-2">
                {ACCOUNTS.map((a, i) => {
                  if (stap === 3 && t < i / (ACCOUNTS.length + 0.5)) return null;
                  return (
                    <li
                      key={a.naam}
                      className={`rounded-[2px] border bg-brand-paper px-3 py-2.5 ${
                        i === 0 ? "border-brand-accent" : "border-brand-line"
                      }`}
                    >
                      <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                        <span className="text-[13px] font-semibold text-brand-ink">
                          {a.naam}
                        </span>
                        <span className="rounded-[2px] bg-brand-mist px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-brand-accent-ink">
                          {a.actie}
                        </span>
                        <span className="ml-auto font-mono text-[10px] text-brand-ink-3">
                          {a.eigenaar}
                        </span>
                      </p>
                      <p className="mt-1 text-[12.5px] text-brand-ink-2">
                        {a.aanleiding}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </Beurt>
          )}

          {/* 5 · De vervolgvraag */}
          {stap >= 4 && (
            <>
              <Beurt wie="u">
                <p className="text-[14px] leading-relaxed text-brand-ink">
                  {stap === 4 ? getikt(VERVOLG, 0.3) : VERVOLG}
                  {stap === 4 && t < 0.32 && <Cursor />}
                </p>
              </Beurt>
              {(stap > 4 || t > 0.34) && (
                <Beurt wie="engine">
                  <p className="mb-3 text-[13.5px] text-brand-ink-2">
                    Vier signalen vielen samen. Los zegt geen van vier iets.
                  </p>
                  <ul className="space-y-1.5">
                    {REDENEN.map((r, i) => {
                      if (stap === 4 && t < 0.4 + i * 0.13) return null;
                      return (
                        <li key={r} className="flex gap-2 text-[12.5px] text-brand-ink-2">
                          <span aria-hidden className="text-brand-accent-ink">
                            →
                          </span>
                          <span>{r}</span>
                        </li>
                      );
                    })}
                  </ul>
                </Beurt>
              )}
            </>
          )}

          {/* 6 · De opbrengst */}
          {stap >= 5 && (
            <Beurt wie="engine">
              <p className="mb-3 text-[13.5px] text-brand-ink-2">
                En dit leverde de week op.
              </p>
              <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {OPBRENGST.map((o, i) => (
                  <li
                    key={o.label}
                    className="rounded-[2px] border border-brand-line bg-brand-mist/70 px-3 py-2.5"
                  >
                    <p className="font-display text-[22px] font-black leading-none tracking-[-0.03em] text-brand-ink">
                      {Math.round(o.getal * fase(t, 0.05 + i * 0.06, 0.55 + i * 0.06))}
                    </p>
                    <p className="mt-1.5 text-[11.5px] leading-snug text-brand-ink-2">
                      {o.label}
                    </p>
                  </li>
                ))}
              </ul>
            </Beurt>
          )}
        </>
      )}
    </FilmKader>
  );
}
