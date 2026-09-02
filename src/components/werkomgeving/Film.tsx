import { useEffect, useMemo, useRef, useState } from "react";
import peterGrisel from "@/assets/peter-grisel.png";
import { Reveal } from "@/components/v2/Reveal";
import { groeistackLogo } from "@/data/groeistackLogos";
import { fase } from "@/hooks/useScrollProgress";

/**
 * De werkomgeving, als filmpje.
 *
 * Uitleggen wat een opportunity-engine doet kost drie alinea's; het één keer
 * zien duurt twintig seconden. Dit is die twintig seconden: u stelt een vraag,
 * de bronnen slaan aan, de signalen worden gewogen, de accounts landen in het
 * CRM met een reden, u vraagt door, en onderaan staat wat het opleverde. Van
 * ontwerp tot uitvoering, in één beeld.
 *
 * Het is een nagebouwde omgeving met voorbeelddata, geen opname van een klant —
 * daarom staat "voorbeeld" in de balk en onder het kader. De bedrijfsnamen zijn
 * verzonnen en de cijfers illustratief.
 *
 * Bediening: hij speelt vanzelf zodra hij in beeld komt en stopt zodra hij dat
 * niet meer is. Klikken op een hoofdstuk springt daarheen en zet de film stil,
 * zodat er tijdens een gesprek op één stap kan worden blijven staan.
 */

/* ── De film ────────────────────────────────────────────────────────────── */

type Stap = { titel: string; duur: number };

const STAPPEN: Stap[] = [
  { titel: "De vraag", duur: 4600 },
  { titel: "De bronnen", duur: 5200 },
  { titel: "Het wegen", duur: 4400 },
  { titel: "De actie", duur: 4400 },
  { titel: "De vervolgvraag", duur: 5200 },
  { titel: "De opbrengst", duur: 4200 },
];

const TOTAAL = STAPPEN.reduce((a, s) => a + s.duur, 0);
/** Begintijd van elke stap, zodat een klik op een hoofdstuk erheen kan springen. */
const START: number[] = [];
STAPPEN.reduce((verstreken, s, i) => {
  START[i] = verstreken;
  return verstreken + s.duur;
}, 0);

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

/* ── Bouwstenen ─────────────────────────────────────────────────────────── */

function Logo({ naam, klasse = "h-4 w-4" }: { naam: string; klasse?: string }) {
  const bron = groeistackLogo(naam);
  if (!bron) return null;
  return (
    <img
      src={bron}
      alt=""
      aria-hidden
      loading="lazy"
      className={`${klasse} shrink-0 rounded-[2px] object-contain`}
    />
  );
}

/** Een regel in het gesprek: wie het zegt, en wat. */
function Beurt({
  wie,
  children,
}: {
  wie: "u" | "engine";
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 shrink-0">
        {wie === "u" ? (
          <img
            src={peterGrisel}
            alt=""
            aria-hidden
            className="h-6 w-6 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-line bg-brand-mist">
            <Logo naam="Claude" klasse="h-3.5 w-3.5" />
          </span>
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="mb-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.16em] text-brand-ink-3">
          {wie === "u" ? "U" : "De engine"}
        </p>
        {children}
      </div>
    </div>
  );
}

/** Een staafje dat naar een percentage toe loopt. */
function Balk({ pct }: { pct: number }) {
  return (
    <span className="block h-[3px] w-full overflow-hidden rounded-[2px] bg-brand-line">
      <span
        className="block h-full rounded-[2px] bg-brand-accent transition-[width] duration-500 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
      />
    </span>
  );
}

/* ── De sectie ──────────────────────────────────────────────────────────── */

export function Film() {
  const kader = useRef<HTMLDivElement>(null);
  const paneel = useRef<HTMLDivElement>(null);
  const [klok, setKlok] = useState(0);
  const [speelt, setSpeelt] = useState(true);
  const [rustig] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  // Wie geen beweging wil, krijgt het eindbeeld: alles staat er, niets loopt.
  const tijd = rustig ? TOTAAL : klok;
  const stap = useMemo(() => {
    let i = STAPPEN.length - 1;
    while (i > 0 && tijd < START[i]) i -= 1;
    return i;
  }, [tijd]);
  const t = rustig ? 1 : Math.min(1, (tijd - START[stap]) / STAPPEN[stap].duur);

  // Vijfentwintig tikken per seconde is genoeg voor tekst die zich typt, en
  // scheelt een hertekening per beeld. Buiten beeld loopt hij niet.
  useEffect(() => {
    if (rustig || !speelt) return;
    const el = kader.current;
    if (!el) return;
    let inBeeld = true;
    const io = new IntersectionObserver(
      (e) => { inBeeld = e[0]?.isIntersecting ?? true; },
      { threshold: 0.15 }
    );
    io.observe(el);
    // Echte tijd optellen in plaats van tikken tellen: een browser knijpt
    // timers af in een tabblad op de achtergrond, en dan hoort de film daarna
    // gewoon verder te zijn in plaats van achter te lopen.
    let vorig = performance.now();
    const id = window.setInterval(() => {
      const nu = performance.now();
      const dt = Math.min(1000, nu - vorig);
      vorig = nu;
      if (!inBeeld || document.hidden) return;
      setKlok((k) => Math.min(TOTAAL, k + dt));
    }, 40);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [rustig, speelt]);

  // Het gesprek groeit; het paneel houdt de laatste regel in beeld.
  useEffect(() => {
    const el = paneel.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: rustig ? "auto" : "smooth" });
  }, [stap, rustig]);

  const naarStap = (i: number) => {
    setSpeelt(false);
    setKlok(START[i]);
  };
  const opnieuw = () => {
    setKlok(0);
    setSpeelt(true);
  };

  const getikt = (zin: string, tot: number) =>
    zin.slice(0, Math.round(zin.length * fase(t, 0, tot)));

  // De waarnemer hangt om Reveal heen, niet erin: Reveal wisselt zijn eigen
  // wrapper van div naar motion.div zodra hij animeert, en maakt daarmee alles
  // eronder opnieuw aan. Een ref binnenin wees daarna naar een losgekoppeld
  // element, en dan bleef de film "buiten beeld" en begon hij nooit.
  return (
    <div ref={kader}>
      <Reveal>
        <div className="overflow-hidden rounded-brand border border-white/15 bg-brand-paper text-brand-ink shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
          {/* Vensterbalk */}
          <div className="flex items-center gap-3 border-b border-brand-line bg-brand-mist px-4 py-2.5">
            <span aria-hidden className="flex gap-1.5">
              {["bg-brand-ink-3", "bg-brand-ink-3", "bg-brand-ink-3"].map((c, i) => (
                <span key={i} className={`h-2 w-2 rounded-full ${c} opacity-40`} />
              ))}
            </span>
            <span className="flex items-center gap-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-brand-ink-2">
              <Logo naam="Claude" klasse="h-3.5 w-3.5" />
              Werkomgeving
            </span>
            <span className="ml-auto rounded-[2px] border border-brand-line px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-brand-ink-3">
              Voorbeeld
            </span>
          </div>

          <div className="grid lg:grid-cols-[172px_1fr]">
            {/* Bronnen. Ze kleuren op zodra stap 2 ze aanroept. */}
            <div className="border-b border-brand-line bg-brand-mist/60 px-4 py-3.5 lg:border-b-0 lg:border-r">
              <p className="mb-3 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-brand-ink-3">
                Bronnen
              </p>
              <ul className="flex flex-wrap gap-x-4 gap-y-2.5 lg:block lg:space-y-2.5">
                {TOOLS.map((tool, i) => {
                  const aan =
                    stap > 1 || (stap === 1 && t > (i + 0.5) / TOOLS.length);
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
            </div>

            {/* Het gesprek */}
            <div
              ref={paneel}
              className="h-[24rem] space-y-6 overflow-hidden px-5 py-5 sm:h-[26rem] sm:px-7"
            >
              {/* 1 · De vraag */}
              <Beurt wie="u">
                <p className="text-[14px] leading-relaxed text-brand-ink">
                  {stap === 0 ? getikt(VRAAG, 0.8) : VRAAG}
                  {stap === 0 && t < 0.85 && (
                    <span className="text-brand-accent-ink">▌</span>
                  )}
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
                      const klaar =
                        stap > 1 || t > (i + 1) / (BRONNEN.length + 0.5);
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
                    {ACCOUNTS.map((a, i) => (
                      <li key={a.naam}>
                        <p className="mb-1.5 flex items-baseline justify-between gap-3">
                          <span className="text-[13px] font-medium text-brand-ink">
                            {a.naam}
                          </span>
                          <span className="font-mono text-[11px] text-brand-ink-3">
                            {Math.round(
                              a.score *
                                (stap > 2 ? 1 : fase(t, 0.1 + i * 0.12, 0.6 + i * 0.12))
                            )}
                          </span>
                        </p>
                        <Balk
                          pct={
                            a.score *
                            (stap > 2 ? 1 : fase(t, 0.1 + i * 0.12, 0.6 + i * 0.12))
                          }
                        />
                      </li>
                    ))}
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
                      {stap === 4 && t < 0.32 && (
                        <span className="text-brand-accent-ink">▌</span>
                      )}
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
                            <li
                              key={r}
                              className="flex gap-2 text-[12.5px] text-brand-ink-2"
                            >
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
            </div>
          </div>

          {/* Hoofdstukken */}
          <div className="border-t border-brand-line bg-brand-mist">
            <span aria-hidden className="block h-[2px] w-full bg-brand-line">
              <span
                className="block h-full bg-brand-accent"
                style={{ width: `${(tijd / TOTAAL) * 100}%` }}
              />
            </span>
            <div className="flex flex-wrap items-center gap-x-1 gap-y-1 px-3 py-2.5">
              {STAPPEN.map((s, i) => (
                <button
                  key={s.titel}
                  type="button"
                  onClick={() => naarStap(i)}
                  aria-current={i === stap}
                  className={`rounded-[2px] px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${
                    i === stap
                      ? "bg-brand-ink text-brand-paper"
                      : "text-brand-ink-3 hover:bg-brand-line/60 hover:text-brand-ink"
                  }`}
                >
                  <span className="tabular-nums opacity-60">
                    {String(i + 1).padStart(2, "0")}
                  </span>{" "}
                  {s.titel}
                </button>
              ))}
              <button
                type="button"
                onClick={opnieuw}
                className="ml-auto rounded-[2px] border border-brand-line px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-brand-ink-2 transition-colors hover:bg-brand-line/60 hover:text-brand-ink"
              >
                Opnieuw
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-[12.5px] text-white/50">
          Nagebouwde omgeving met verzonnen bedrijfsnamen en illustratieve
          cijfers. De bronnen en het proces zijn wel die van een echte
          inrichting.
        </p>
      </Reveal>
    </div>
  );
}
