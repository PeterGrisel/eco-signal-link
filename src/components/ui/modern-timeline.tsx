import { motion, useReducedMotion } from "framer-motion";
import { Check, CircleDot, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { fase, useScrollProgress } from "@/hooks/useScrollProgress";
import { useBreedScherm } from "@/hooks/useBreedScherm";

/**
 * De tijdlijn: een verticale rail die zich vult zodra hij in beeld komt, met
 * per stap een ronde marker en een kaart die van onderaf instapt.
 *
 * Twee dingen wijken bewust af van het origineel.
 *
 * De statuskleuren zijn niet groen en amber maar onze eigen inkt en accent.
 * Een palet van zwart, zand en oranje verdraagt geen derde en vierde kleur die
 * alleen "goed" en "let op" betekenen; volgorde en gewicht doen dat hier.
 *
 * De voortgangsbalk is eruit. Die vulde zichzelf op 100, 65 en 25 procent —
 * getallen die nergens vandaan komen. Op een sectie die belooft dat wij vooraf
 * vastleggen wanneer iets geslaagd is, staat een verzonnen meter verkeerd. In
 * plaats daarvan toont elke stap zijn eigen regels: wat er gebeurt en wie het
 * bevestigt.
 */

export type TimelineStatus = "completed" | "current" | "upcoming";

export interface TimelineItem {
  title: string;
  description: string;
  date?: string;
  /** Portret bij de stap. Zonder afbeelding verschijnt het statusteken. */
  image?: string;
  /** Alt-tekst bij `image`; laat weg voor een decoratief portret. */
  imageAlt?: string;
  status?: TimelineStatus;
  category?: string;
  /** Label in de chip rechtsboven. Zonder waarde blijft de chip weg. */
  badge?: string;
  /** Regels onder de tekst: wat er gebeurt en wie het bevestigt. */
  rows?: Array<[string, string]>;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const MARKERING: Record<TimelineStatus, { ring: string; vlak: string; teken: string }> = {
  completed: {
    ring: "border-brand-ink",
    vlak: "bg-brand-ink text-brand-paper",
    teken: "text-brand-ink",
  },
  current: {
    ring: "border-brand-accent",
    vlak: "bg-brand-accent text-brand-ink",
    teken: "text-brand-accent-ink",
  },
  upcoming: {
    ring: "border-brand-line",
    vlak: "bg-brand-mist text-brand-ink-3",
    teken: "text-brand-ink-3",
  },
};

const TEKENS: Record<TimelineStatus, typeof Check> = {
  completed: Check,
  current: CircleDot,
  upcoming: Circle,
};

/** De marker op de rail: een portret als dat er is, anders het statusteken. */
function Marker({
  status,
  image,
  imageAlt,
  className,
}: {
  status: TimelineStatus;
  image?: string;
  imageAlt?: string;
  className?: string;
}) {
  const stijl = MARKERING[status];
  const Teken = TEKENS[status];
  return (
    <span
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-full border-2 bg-brand-paper",
        stijl.ring,
        className,
      )}
    >
      {image ? (
        <img
          src={image}
          alt={imageAlt ?? ""}
          aria-hidden={imageAlt ? undefined : true}
          loading="lazy"
          /* Portretten zijn staand; zonder object-top snijdt de cirkel het hoofd eraf. */
          className="size-full object-cover object-top"
        />
      ) : (
        <span className={cn("flex size-full items-center justify-center", stijl.vlak)}>
          <Teken aria-hidden className="size-5 sm:size-6" strokeWidth={2} />
        </span>
      )}
    </span>
  );
}

/** De kaart naast de marker. */
function Kaart({ item, className }: { item: TimelineItem; className?: string }) {
  const stijl = MARKERING[item.status ?? "upcoming"];
  return (
    <article
      className={cn(
        "rounded-brand border border-brand-line bg-brand-paper p-5 sm:p-6",
        className,
      )}
    >
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
            {item.category && <span>{item.category}</span>}
            {item.category && item.date && (
              <span aria-hidden className="size-1 rounded-full bg-brand-ink-3" />
            )}
            {item.date && <span>{item.date}</span>}
          </div>
          <h3 className="font-display text-[17px] font-bold leading-snug tracking-[-0.015em] sm:text-lg">
            {item.title}
          </h3>
        </div>

        {item.badge && (
          <span
            className={cn(
              "w-fit shrink-0 rounded-btn px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em]",
              stijl.vlak,
            )}
          >
            {item.badge}
          </span>
        )}
      </div>

      <p className="text-[13.5px] leading-relaxed text-brand-ink-2">{item.description}</p>

      {item.rows?.length ? (
        <ul className="mt-4 space-y-2.5 border-t border-brand-line pt-4 font-mono text-[11.5px]">
          {item.rows.map(([wat, uitkomst]) => (
            <li key={wat} className="flex items-baseline justify-between gap-4">
              <span className="text-brand-ink-2">{wat}</span>
              <b className="shrink-0 font-bold text-brand-ink">{uitkomst}</b>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

export function Timeline({ items, className }: TimelineProps) {
  if (!items?.length) return null;

  return (
    <ol className={cn("relative", className)}>
      {/* De rail, en daaroverheen dezelfde lijn die zich vult. */}
      <span aria-hidden className="absolute bottom-6 left-6 top-2 w-px bg-brand-line sm:left-8" />
      <motion.span
        aria-hidden
        className="absolute bottom-6 left-6 top-2 w-px origin-top bg-brand-accent sm:left-8"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: "easeOut", delay: 0.15 }}
      />

      <div className="space-y-8 sm:space-y-10">
        {items.map((item, i) => (
          <motion.li
            key={item.title}
            className="relative flex items-start gap-5 sm:gap-7"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Marker
              status={item.status ?? "upcoming"}
              image={item.image}
              imageAlt={item.imageAlt}
              className="relative z-[1] size-12 shrink-0 sm:size-16"
            />
            <Kaart item={item} className="min-w-0 flex-1" />
          </motion.li>
        ))}
      </div>

      {/* Sluitpunt onderaan de rail. */}
      <motion.span
        aria-hidden
        className="absolute -bottom-1 left-6 size-3 -translate-x-1/2 rounded-full bg-brand-accent sm:left-8"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: items.length * 0.08 + 0.3, type: "spring", stiffness: 400 }}
      />
    </ol>
  );
}

/* -------------------------------------------------------------------------- */

/** Afstand tussen twee markers op de rail, en de maat van een marker. */
const RAIL_STAP = 96;
const RAIL_MARKER = 56;

/**
 * Dezelfde tijdlijn, maar als stapel die zich met de scroll doorloopt.
 *
 * De kaarten liggen op elkaar in plaats van onder elkaar, dus de sectie is één
 * kaart hoog in plaats van drie. Een hoge track met een sticky kind erin
 * bepaalt hoe ver je bent: de volgende kaart schuift van onderen naar voren,
 * de vorige zakt terug in de stapel. Het portret springt intussen langs de
 * rail mee naar de stap waar je bent — met een veer, zodat je de sprong ziet.
 *
 * Onder `lg` en bij `prefers-reduced-motion` valt alles terug op de gewone
 * lijst: daar is geen ruimte voor een sticky verhaal, en wie minder beweging
 * vroeg heeft niets aan een stapel die alleen met scrollen leesbaar wordt.
 */
export function TimelineStack({
  items,
  avatar,
  avatarAlt,
  kop,
  className,
}: TimelineProps & {
  /** Portret dat langs de rail meespringt. Zonder portret springt het statusteken mee. */
  avatar?: string;
  avatarAlt?: string;
  /** Sectiekop. Die gaat mee de sticky in, anders staat hij los boven een gat. */
  kop?: React.ReactNode;
}) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const breed = useBreedScherm();
  const minderBeweging = useReducedMotion();

  if (!items?.length) return null;
  // Terugval op de lijst: daar rijdt niets mee, dus het portret gaat naar de
  // eerste stap — dat is het gesprek waar het thuishoort.
  if (!breed || minderBeweging) {
    const lijst = avatar
      ? items.map((item, i) => (i === 0 ? { ...item, image: avatar, imageAlt: avatarAlt } : item))
      : items;
    return (
      <>
        {kop}
        <Timeline items={lijst} className={className} />
      </>
    );
  }

  // Doorlopende positie tussen 0 en items.length - 1. De marges aan weerszijden
  // geven de eerste en laatste kaart even rust voor en na hun beurt.
  const positie = fase(progress, 0.08, 0.92) * (items.length - 1);
  const actief = Math.min(items.length - 1, Math.max(0, Math.round(positie)));
  const railHoogte = (items.length - 1) * RAIL_STAP + RAIL_MARKER;

  return (
    <div ref={ref} className={cn("relative h-[200svh]", className)}>
      {/* De kop staat mee in het sticky blok. Buiten dat blok zou hij bovenaan
          blijven staan terwijl de kaart een half scherm lager centreert, en
          daar zit dan een gat tussen tot de sticky aanslaat. */}
      <div className="sticky top-0 flex h-svh flex-col justify-center gap-9 pt-20">
        {kop}
        <div className="flex w-full items-center gap-8">
          {/* De rail met vaste haltes, en het portret dat ertussen springt. */}
          <div
            aria-hidden
            className="relative shrink-0"
            style={{ width: RAIL_MARKER, height: railHoogte }}
          >
            <span
              className="absolute left-1/2 w-px -translate-x-1/2 bg-brand-line"
              style={{ top: RAIL_MARKER / 2, bottom: RAIL_MARKER / 2 }}
            />
            <span
              className="absolute left-1/2 w-px -translate-x-1/2 bg-brand-accent"
              style={{
                top: RAIL_MARKER / 2,
                height: (railHoogte - RAIL_MARKER) * (positie / Math.max(1, items.length - 1)),
              }}
            />
            {items.map((item, i) => (
              <span
                key={item.title}
                className={cn(
                  "absolute left-1/2 size-3 -translate-x-1/2 rounded-full border-2 bg-brand-paper transition-colors duration-300",
                  i <= actief ? "border-brand-accent" : "border-brand-line",
                )}
                style={{ top: i * RAIL_STAP + RAIL_MARKER / 2 - 6 }}
              />
            ))}
            <motion.span
              className="absolute left-0 block"
              style={{ width: RAIL_MARKER, height: RAIL_MARKER }}
              animate={{ y: actief * RAIL_STAP }}
              transition={{ type: "spring", stiffness: 280, damping: 16 }}
            >
              {/* De ring blijft accent: dit teken zegt waar je bent, niet hoe
                  de stap ervoor staat. Dat laatste doen de vaste stippen. */}
              <Marker
                status="current"
                image={avatar}
                imageAlt={avatarAlt}
                className="size-full shadow-[0_6px_20px_rgba(23,20,15,0.18)]"
              />
            </motion.span>
          </div>

          {/* De stapel. Alle kaarten in dezelfde rastercel, dus de hoogte volgt
              de langste en er is geen absolute positionering nodig. */}
          <ol className="grid min-w-0 flex-1">
            {items.map((item, i) => {
              // Wat nog komt ligt iets lager en kleiner, zodat alleen de rand
              // eronderuit piept — niet de tekst, want dan lijkt het een fout.
              // Wat geweest is schuift omhoog het beeld uit.
              const d = i - positie;
              const komt = d > 0;
              const y = komt ? d * 14 : d * 30;
              const schaal = komt ? 1 - Math.min(d, 2) * 0.035 : 1;
              const dekking = komt
                ? Math.max(0, 0.5 - (d - 1) * 0.5)
                : Math.max(0, 1 + d * 1.4);
              return (
                <li
                  key={item.title}
                  className="col-start-1 row-start-1"
                  style={{
                    transform: `translateY(${y}px) scale(${schaal})`,
                    opacity: dekking,
                    zIndex: 30 - Math.round(Math.abs(d) * 10),
                    pointerEvents: Math.abs(d) < 0.5 ? undefined : "none",
                  }}
                >
                  <Kaart
                    item={item}
                    className="shadow-[0_10px_40px_-24px_rgba(23,20,15,0.45)]"
                  />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Timeline;
