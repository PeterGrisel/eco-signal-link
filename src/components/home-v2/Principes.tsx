import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

/**
 * De vijf principes als karrousel.
 *
 * Ze stonden onder elkaar, wat vijf blokken tekst opleverde die niemand
 * helemaal las. Nu schuiven ze: één kaart op een telefoon, twee op een tablet,
 * drie op een breed scherm. Dat scheelt ruim de helft in hoogte en het nodigt
 * uit om verder te kijken.
 *
 * Het dimmen van kaarten die half buiten beeld hangen gaat op het `select`- en
 * `slidesInView`-signaal van embla, niet per beeld. Eén klasse die van CSS een
 * overgang krijgt is genoeg voor het effect en kost verder niets.
 */

export type Principe = { title: string; body: string };

export function PrincipeCarrousel({ items }: { items: Principe[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [inBeeld, setInBeeld] = useState<number[]>([0]);
  const [snaps, setSnaps] = useState({ aantal: 1, huidig: 0 });
  const [kan, setKan] = useState({ terug: false, verder: true });

  useEffect(() => {
    if (!api) return;
    const lees = () => {
      setInBeeld(api.slidesInView());
      setSnaps({
        aantal: api.scrollSnapList().length,
        huidig: api.selectedScrollSnap(),
      });
      setKan({ terug: api.canScrollPrev(), verder: api.canScrollNext() });
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

  const terug = useCallback(() => api?.scrollPrev(), [api]);
  const verder = useCallback(() => api?.scrollNext(), [api]);

  return (
    <Carousel
      setApi={setApi}
      opts={{ align: "start", containScroll: "trimSnaps" }}
      className="relative"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
          Vijf principes
        </p>
        <div className="flex gap-2">
          <Knop label="Vorige" aan={kan.terug} onClick={terug}>
            <ArrowLeft className="h-4 w-4" aria-hidden />
          </Knop>
          <Knop label="Volgende" aan={kan.verder} onClick={verder}>
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
                aria-hidden={!zichtbaar}
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
  );
}

function Knop({
  label,
  aan,
  onClick,
  children,
}: {
  label: string;
  aan: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!aan}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-[2px] border border-brand-line bg-brand-paper text-brand-ink transition-colors duration-[180ms] hover:border-brand-ink hover:bg-brand-ink hover:text-brand-paper disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  );
}
