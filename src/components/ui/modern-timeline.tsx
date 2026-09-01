import { motion } from "framer-motion";
import { Check, CircleDot, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function Timeline({ items, className }: TimelineProps) {
  if (!items?.length) return null;

  return (
    <ol className={cn("relative", className)}>
      {/* De rail, en daaroverheen dezelfde lijn die zich vult. */}
      <span
        aria-hidden
        className="absolute bottom-6 left-6 top-2 w-px bg-brand-line sm:left-8"
      />
      <motion.span
        aria-hidden
        className="absolute bottom-6 left-6 top-2 w-px origin-top bg-brand-accent sm:left-8"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: "easeOut", delay: 0.15 }}
      />

      <div className="space-y-8 sm:space-y-10">
        {items.map((item, i) => {
          const status = item.status ?? "upcoming";
          const stijl = MARKERING[status];
          const Teken = TEKENS[status];

          return (
            <motion.li
              key={item.title}
              className="group relative flex items-start gap-5 sm:gap-7"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Marker op de rail. */}
              <span
                className={cn(
                  "relative z-[1] flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 bg-brand-paper sm:size-16",
                  stijl.ring,
                )}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.imageAlt ?? ""}
                    aria-hidden={item.imageAlt ? undefined : true}
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

              <article className="min-w-0 flex-1 rounded-brand border border-brand-line bg-brand-paper p-5 transition-colors duration-[220ms] group-hover:border-brand-ink-3 sm:p-6">
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
            </motion.li>
          );
        })}
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

export default Timeline;
