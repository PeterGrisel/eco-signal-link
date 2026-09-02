import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

/**
 * De twee bewegende delen van "wat ons anders maakt".
 *
 * `PrincipeCarrousel` is een side scroller: de kaarten schuiven uit zichzelf
 * door, blijven staan zolang de muis erop ligt en zijn met de hand te slepen.
 * `MarktTrechter` wisselt van markt, want de aantallen die uit die trechter
 * komen verschillen per branche — dat laten zien zegt meer dan één vast getal.
 *
 * Allebei stoppen ze zodra ze uit beeld zijn, en allebei staan ze stil bij
 * `prefers-reduced-motion`. Geen animatielus: één tikker per onderdeel, en het
 * bewegen zelf doet CSS.
 */

/* ── Gedeeld ────────────────────────────────────────────────────────────── */

const rustig = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Roept `stap` elke `ms` aan, maar alleen terwijl het element in beeld staat,
 * het tabblad voorop ligt en er niet gepauzeerd is.
 */
function useTikker(
  ref: React.RefObject<HTMLElement>,
  ms: number,
  aan: boolean,
  stap: () => void
) {
  const laatste = useRef(stap);
  laatste.current = stap;

  useEffect(() => {
    const el = ref.current;
    if (!el || !aan || rustig()) return;
    let inBeeld = false;
    const io = new IntersectionObserver(
      (e) => { inBeeld = e[0]?.isIntersecting ?? false; },
      { threshold: 0.25 }
    );
    io.observe(el);
    const id = window.setInterval(() => {
      if (inBeeld && !document.hidden) laatste.current();
    }, ms);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [ref, ms, aan]);
}

/* ── De principes als side scroller ─────────────────────────────────────── */

export type Principe = { title: string; body: string };

const DOORSCHUIFTIJD = 3800;

export function PrincipeCarrousel({ items }: { items: Principe[] }) {
  const kader = useRef<HTMLDivElement>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [inBeeld, setInBeeld] = useState<number[]>([0]);
  const [snaps, setSnaps] = useState({ aantal: 1, huidig: 0 });
  const [pauze, setPauze] = useState(false);

  useEffect(() => {
    if (!api) return;
    const lees = () => {
      setInBeeld(api.slidesInView());
      setSnaps({
        aantal: api.scrollSnapList().length,
        huidig: api.selectedScrollSnap(),
      });
    };
    lees();
    api.on("select", lees);
    api.on("reInit", lees);
    api.on("slidesInView", lees);
    // Wie zelf sleept, wil kijken en niet weggeschoven worden.
    const stop = () => setPauze(true);
    api.on("pointerDown", stop);
    return () => {
      api.off("select", lees);
      api.off("reInit", lees);
      api.off("slidesInView", lees);
      api.off("pointerDown", stop);
    };
  }, [api]);

  useTikker(kader, DOORSCHUIFTIJD, !pauze, () => api?.scrollNext());

  const terug = useCallback(() => {
    setPauze(true);
    api?.scrollPrev();
  }, [api]);
  const verder = useCallback(() => {
    setPauze(true);
    api?.scrollNext();
  }, [api]);

  return (
    <div
      ref={kader}
      onMouseEnter={() => setPauze(true)}
      onMouseLeave={() => setPauze(false)}
      onFocusCapture={() => setPauze(true)}
    >
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true, dragFree: true, skipSnaps: false }}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
            Vijf principes
          </p>
          <div className="flex gap-2">
            <Knop label="Vorige" onClick={terug}>
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </Knop>
            <Knop label="Volgende" onClick={verder}>
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Knop>
          </div>
        </div>

        <CarouselContent className="-ml-[22px]">
          {items.map((item, i) => {
            const zichtbaar = inBeeld.includes(i);
            return (
              <CarouselItem
                key={item.title}
                className="basis-[86%] pl-[22px] sm:basis-1/2 lg:basis-1/3"
              >
                <article
                  className={`flex h-full flex-col overflow-hidden rounded-brand border bg-brand-paper transition-[opacity,transform,border-color] duration-500 ease-out ${
                    zichtbaar
                      ? "border-brand-line opacity-100"
                      : "border-brand-line/60 opacity-45 sm:scale-[0.97]"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`block h-[3px] w-full transition-colors duration-500 ${
                      zichtbaar ? "bg-brand-accent" : "bg-brand-line"
                    }`}
                  />
                  <div className="flex grow flex-col px-6 pb-7 pt-[21px]">
                    <span className="mb-3 block font-mono text-[10px] font-bold tracking-[0.16em] text-brand-ink-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mb-2.5 font-display text-[17px] font-bold leading-snug tracking-[-0.015em]">
                      {item.title}
                    </h3>
                    <p className="text-[13.5px] leading-relaxed text-brand-ink-2">
                      {item.body}
                    </p>
                  </div>
                </article>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Streepjes in plaats van bolletjes: past bij de rest van de pagina. */}
        <div className="mt-6 flex gap-1.5" aria-hidden>
          {Array.from({ length: snaps.aantal }, (_, i) => (
            <span
              key={i}
              className={`h-[3px] flex-1 rounded-[2px] transition-colors duration-300 ${
                i === snaps.huidig ? "bg-brand-accent" : "bg-brand-line"
              }`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}

function Knop({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-[2px] border border-brand-line bg-brand-paper text-brand-ink transition-colors duration-[180ms] hover:border-brand-ink hover:bg-brand-ink hover:text-brand-paper"
    >
      {children}
    </button>
  );
}

/* ── De trechter, per markt ─────────────────────────────────────────────── */

/**
 * Voorbeeldverhoudingen per markt. De aantallen zijn illustratief; wat ze laten
 * zien is dat de trechter overal dezelfde vorm heeft en nergens dezelfde maat.
 */
const MARKTEN = [
  {
    markt: "Maakindustrie",
    rijen: [
      { n: 4000, label: "bedrijven in de markt" },
      { n: 1200, label: "met voldoende fit" },
      { n: 350, label: "opportunity-hypotheses" },
      { n: 70, label: "accounts met beweging" },
    ],
  },
  {
    markt: "Zakelijke dienstverlening",
    rijen: [
      { n: 12400, label: "bedrijven in de markt" },
      { n: 3100, label: "met voldoende fit" },
      { n: 720, label: "opportunity-hypotheses" },
      { n: 140, label: "accounts met beweging" },
    ],
  },
  {
    markt: "IT & software",
    rijen: [
      { n: 6800, label: "bedrijven in de markt" },
      { n: 2050, label: "met voldoende fit" },
      { n: 480, label: "opportunity-hypotheses" },
      { n: 95, label: "accounts met beweging" },
    ],
  },
  {
    markt: "Technische dienstverlening",
    rijen: [
      { n: 2600, label: "bedrijven in de markt" },
      { n: 890, label: "met voldoende fit" },
      { n: 260, label: "opportunity-hypotheses" },
      { n: 55, label: "accounts met beweging" },
    ],
  },
];

const WISSELTIJD = 4600;
const nl = new Intl.NumberFormat("nl-NL");

export function MarktTrechter() {
  const kader = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [pauze, setPauze] = useState(false);

  useTikker(kader, WISSELTIJD, !pauze, () =>
    setI((k) => (k + 1) % MARKTEN.length)
  );

  const huidig = MARKTEN[i];
  const top = huidig.rijen[0].n;

  return (
    <div
      ref={kader}
      onMouseEnter={() => setPauze(true)}
      onMouseLeave={() => setPauze(false)}
      className="rounded-brand border border-brand-line bg-brand-paper px-7 py-7"
    >
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-3">
          Van markt naar priority
        </p>
        <p className="max-w-[52ch] text-[13px] text-brand-ink-2">
          Uw specialist hoeft niet iedere ochtend te bedenken wie hij kan bellen.
          Hij krijgt de accounts waar fit, opportunity en timing samenkomen.
        </p>
      </div>

      {/* De markt is aan te klikken, zodat er tijdens een gesprek op één
          voorbeeld kan worden blijven staan. */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {MARKTEN.map((m, k) => (
          <button
            key={m.markt}
            type="button"
            onClick={() => {
              setPauze(true);
              setI(k);
            }}
            aria-current={k === i}
            className={`rounded-[2px] px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-colors duration-300 ${
              k === i
                ? "bg-brand-ink text-brand-paper"
                : "text-brand-ink-3 hover:bg-brand-mist hover:text-brand-ink"
            }`}
          >
            {m.markt}
          </button>
        ))}
      </div>

      <ol className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {huidig.rijen.map((rij, k) => (
          <li key={rij.label}>
            <span
              key={`${huidig.markt}-${rij.n}`}
              className="v2-enter block font-display text-[clamp(24px,2.4vw,32px)] font-black leading-none tracking-[-0.03em] tabular-nums"
            >
              {nl.format(rij.n)}
            </span>
            <span className="mt-2.5 block h-1.5 w-full overflow-hidden bg-brand-mist">
              <span
                aria-hidden
                className={`block h-full transition-[width] duration-700 ease-out ${
                  k === huidig.rijen.length - 1 ? "bg-brand-accent" : "bg-brand-ink/25"
                }`}
                style={{ width: `${Math.max(3, (rij.n / top) * 100)}%` }}
              />
            </span>
            <p className="mt-2 text-[12.5px] text-brand-ink-2">{rij.label}</p>
          </li>
        ))}
      </ol>

      <p className="mt-6 border-t border-brand-line pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-brand-ink-3">
        Voorbeeldverhoudingen · uw eigen aantallen rekenen wij vooraf uit
      </p>
    </div>
  );
}
