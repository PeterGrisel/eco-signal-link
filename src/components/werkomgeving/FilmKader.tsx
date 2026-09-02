import { useEffect, useMemo, useRef, useState } from "react";
import peterGrisel from "@/assets/peter-grisel.png";
import { Reveal } from "@/components/v2/Reveal";
import { groeistackLogo } from "@/data/groeistackLogos";
import { fase } from "@/hooks/useScrollProgress";

/**
 * Het gedeelde kader waar de filmpjes in draaien.
 *
 * Een venster met een balk erboven, een kolom met bronnen ernaast, het gesprek
 * in het midden en hoofdstukken eronder. Het kader regelt de klok, het
 * stilstaan buiten beeld, het meeschuiven van het paneel en de bediening; wat
 * er in het gesprek verschijnt levert elk filmpje zelf aan.
 *
 * Bediening: hij speelt vanzelf zodra hij in beeld komt en stopt zodra hij dat
 * niet meer is. Klikken op een hoofdstuk springt daarheen en zet de film stil,
 * zodat er tijdens een gesprek op één stap kan worden blijven staan.
 */

export type Stap = { titel: string; duur: number };

/** Wat een filmpje krijgt om zijn beeld mee op te bouwen. */
export type Beeld = {
  /** Welk hoofdstuk nu speelt, vanaf nul. */
  stap: number;
  /** Hoe ver dat hoofdstuk is, van 0 tot 1. */
  t: number;
  /** De eerste `tot` van dit hoofdstuk gebruiken om een zin te laten typen. */
  getikt: (zin: string, tot: number) => string;
};

/* ── Bouwstenen die de filmpjes delen ───────────────────────────────────── */

export function Logo({ naam, klasse = "h-4 w-4" }: { naam: string; klasse?: string }) {
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
export function Beurt({
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
export function Balk({ pct }: { pct: number }) {
  return (
    <span className="block h-[3px] w-full overflow-hidden rounded-[2px] bg-brand-line">
      <span
        className="block h-full rounded-[2px] bg-brand-accent transition-[width] duration-500 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
      />
    </span>
  );
}

/** Een cursor die knippert zolang er getypt wordt. */
export function Cursor() {
  return <span className="text-brand-accent-ink">▌</span>;
}

/* ── Het kader ──────────────────────────────────────────────────────────── */

export function FilmKader({
  titel,
  stappen,
  railTitel,
  rail,
  children,
}: {
  titel: string;
  stappen: Stap[];
  railTitel: string;
  rail: (beeld: Beeld) => React.ReactNode;
  children: (beeld: Beeld) => React.ReactNode;
}) {
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

  const { totaal, start } = useMemo(() => {
    const start: number[] = [];
    const totaal = stappen.reduce((verstreken, s, i) => {
      start[i] = verstreken;
      return verstreken + s.duur;
    }, 0);
    return { totaal, start };
  }, [stappen]);

  // Wie geen beweging wil, krijgt het eindbeeld: alles staat er, niets loopt.
  const tijd = rustig ? totaal : klok;
  let stap = stappen.length - 1;
  while (stap > 0 && tijd < start[stap]) stap -= 1;
  const t = rustig ? 1 : Math.min(1, (tijd - start[stap]) / stappen[stap].duur);

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
      setKlok((k) => Math.min(totaal, k + dt));
    }, 40);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [rustig, speelt, totaal]);

  // Het gesprek groeit; het paneel houdt de laatste regel in beeld.
  useEffect(() => {
    const el = paneel.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: rustig ? "auto" : "smooth" });
  }, [stap, rustig]);

  const beeld: Beeld = {
    stap,
    t,
    getikt: (zin, tot) => zin.slice(0, Math.round(zin.length * fase(t, 0, tot))),
  };

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
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-2 w-2 rounded-full bg-brand-ink-3 opacity-40" />
              ))}
            </span>
            <span className="flex items-center gap-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-brand-ink-2">
              <Logo naam="Claude" klasse="h-3.5 w-3.5" />
              {titel}
            </span>
            <span className="ml-auto rounded-[2px] border border-brand-line px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-brand-ink-3">
              Voorbeeld
            </span>
          </div>

          <div className="grid lg:grid-cols-[172px_1fr]">
            <div className="border-b border-brand-line bg-brand-mist/60 px-4 py-3.5 lg:border-b-0 lg:border-r">
              <p className="mb-3 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-brand-ink-3">
                {railTitel}
              </p>
              {rail(beeld)}
            </div>

            <div
              ref={paneel}
              className="h-[24rem] space-y-6 overflow-hidden px-5 py-5 sm:h-[26rem] sm:px-7"
            >
              {children(beeld)}
            </div>
          </div>

          {/* Hoofdstukken */}
          <div className="border-t border-brand-line bg-brand-mist">
            <span aria-hidden className="block h-[2px] w-full bg-brand-line">
              <span
                className="block h-full bg-brand-accent"
                style={{ width: `${(tijd / totaal) * 100}%` }}
              />
            </span>
            <div className="flex flex-wrap items-center gap-x-1 gap-y-1 px-3 py-2.5">
              {stappen.map((s, i) => (
                <button
                  key={s.titel}
                  type="button"
                  onClick={() => {
                    setSpeelt(false);
                    setKlok(start[i]);
                  }}
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
                onClick={() => {
                  setKlok(0);
                  setSpeelt(true);
                }}
                className="ml-auto rounded-[2px] border border-brand-line px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-brand-ink-2 transition-colors hover:bg-brand-line/60 hover:text-brand-ink"
              >
                Opnieuw
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
