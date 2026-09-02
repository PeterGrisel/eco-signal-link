import { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useBreedScherm } from "@/hooks/useBreedScherm";
import { fase, useScrollProgress } from "@/hooks/useScrollProgress";

/**
 * De twee bewegende delen van "wat ons anders maakt".
 *
 * `PrincipeScroller` draait de scrollrichting om: de sectie blijft staan, de
 * kaarten schuiven opzij, en zodra de laatste kaart er is loopt de pagina weer
 * gewoon verder naar beneden. Per scrollstap schuift er één kaart op — de baan
 * houdt even stil op elke kaart en beweegt daar snel tussenin, waardoor het
 * klikt in plaats van glijdt.
 *
 * `MarktTrechter` wisselt van markt, want de aantallen die uit die trechter
 * komen verschillen per branche — dat laten zien zegt meer dan één vast getal.
 *
 * Op een smal scherm en bij `prefers-reduced-motion` is scrollkaping een
 * vervelende truc; daar staan de kaarten in een gewone veegbare rij.
 */

/* ── Gedeeld ────────────────────────────────────────────────────────────── */

const rustig = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export type Principe = { title: string; body: string };

/** Kaarten die tegelijk in beeld passen, per breedte. */
const ZICHTBAAR = 3;

/* ── De principes: verticaal in, horizontaal door, verticaal uit ────────── */

export function PrincipeScroller({
  items,
  kop,
}: {
  items: Principe[];
  kop: React.ReactNode;
}) {
  const breed = useBreedScherm();
  const [minderBeweging] = useState(rustig);
  const { ref, progress } = useScrollProgress<HTMLDivElement>();

  if (!breed || minderBeweging) {
    return (
      <>
        {kop}
        <PrincipeRij items={items} />
      </>
    );
  }

  // Zoveel standen als er te schuiven valt: vijf kaarten, drie in beeld,
  // dus drie standen.
  const standen = Math.max(1, items.length - ZICHTBAAR + 1);

  // Even stilstaan op elke kaart, er snel tussenin: dat is wat "snappen"
  // voelt. De marges aan begin en eind geven de sticky sectie de tijd om
  // vast te klikken voordat er iets beweegt.
  const ruw = fase(progress, 0.08, 0.92) * (standen - 1);
  const basis = Math.floor(ruw);
  const rest = ruw - basis;
  const deel = fase(rest, 0.3, 0.78);
  const positie = Math.min(standen - 1, basis + deel * deel * (3 - 2 * deel));

  return (
    <div
      ref={ref}
      className="relative"
      style={{ height: `${100 + (standen - 1) * 85}svh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center pt-20">
        {kop}

        <div className="flex items-center justify-between gap-4 pb-5">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
            Vijf principes
          </p>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] tabular-nums text-brand-ink-3">
            {String(Math.round(positie) + 1).padStart(2, "0")} ·{" "}
            {String(standen).padStart(2, "0")}
          </p>
        </div>

        <div className="overflow-hidden">
          <ol
            className="flex gap-[22px]"
            style={{
              transform: `translate3d(calc(${(-positie * 100) / ZICHTBAAR}% - ${
                positie * 22 * (1 / ZICHTBAAR)
              }px), 0, 0)`,
              willChange: "transform",
            }}
          >
            {items.map((item, i) => {
              const d = i - positie;
              const zichtbaar = d > -0.6 && d < ZICHTBAAR - 0.4;
              return (
                <li
                  key={item.title}
                  className="shrink-0"
                  style={{ width: `calc((100% - ${(ZICHTBAAR - 1) * 22}px) / ${ZICHTBAAR})` }}
                >
                  <Kaart item={item} nummer={i} zichtbaar={zichtbaar} />
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-6 flex gap-1.5" aria-hidden>
          {Array.from({ length: standen }, (_, i) => (
            <span
              key={i}
              className={`h-[3px] flex-1 rounded-[2px] transition-colors duration-300 ${
                i === Math.round(positie) ? "bg-brand-accent" : "bg-brand-line"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** De kaart zelf. Eén vorm voor allebei de varianten. */
function Kaart({
  item,
  nummer,
  zichtbaar,
}: {
  item: Principe;
  nummer: number;
  zichtbaar: boolean;
}) {
  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-brand border bg-brand-paper transition-[opacity,transform,border-color] duration-500 ease-out ${
        zichtbaar
          ? "border-brand-line opacity-100"
          : "border-brand-line/60 opacity-40 sm:scale-[0.97]"
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
          {String(nummer + 1).padStart(2, "0")}
        </span>
        <h3 className="mb-2.5 font-display text-[17px] font-bold leading-snug tracking-[-0.015em]">
          {item.title}
        </h3>
        <p className="text-[13.5px] leading-relaxed text-brand-ink-2">{item.body}</p>
      </div>
    </article>
  );
}

/** Smal scherm: gewoon vegen, geen scrollkaping. */
function PrincipeRij({ items }: { items: Principe[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [inBeeld, setInBeeld] = useState<number[]>([0]);
  const [snaps, setSnaps] = useState({ aantal: 1, huidig: 0 });

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
    return () => {
      api.off("select", lees);
      api.off("reInit", lees);
      api.off("slidesInView", lees);
    };
  }, [api]);

  return (
    <Carousel setApi={setApi} opts={{ align: "start" }}>
      <p className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
        Vijf principes · veeg opzij
      </p>
      <CarouselContent className="-ml-[22px]">
        {items.map((item, i) => (
          <CarouselItem
            key={item.title}
            className="basis-[86%] pl-[22px] sm:basis-1/2"
          >
            <Kaart item={item} nummer={i} zichtbaar={inBeeld.includes(i)} />
          </CarouselItem>
        ))}
      </CarouselContent>
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

  // Eén tikker, en alleen terwijl het blok in beeld staat.
  useEffect(() => {
    const el = kader.current;
    if (!el || pauze || rustig()) return;
    let inBeeld = false;
    const io = new IntersectionObserver(
      (e) => { inBeeld = e[0]?.isIntersecting ?? false; },
      { threshold: 0.25 }
    );
    io.observe(el);
    const id = window.setInterval(() => {
      if (inBeeld && !document.hidden) setI((k) => (k + 1) % MARKTEN.length);
    }, WISSELTIJD);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [pauze]);

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
