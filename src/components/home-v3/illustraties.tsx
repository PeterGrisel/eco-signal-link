import { motion, useReducedMotion } from "framer-motion";
import { PROCES_STAPPEN } from "@/data/digitaleMedewerker";

/**
 * Illustraties bij de homepage, getekend als schema's: dunne lijnen, stippellijnen
 * als verbindingen, oranje voor wat het brein doet. Ze volgen de deck
 * "Digitale salesmedewerker". Beweging alleen bij binnenkomst en nooit bij
 * reduced motion.
 */

const ORANJE = "#E8945A";
const ROESTIG = "#A85410";

/* ── Het sterrenbeeld: het brein als netwerk van kennis ─────────────────── */

const PUNTEN: [number, number, number][] = [
  [48, 20, 3], [60, 27, 2], [71, 23, 2.5], [79, 37, 2], [67, 46, 3.5], [55, 41, 2],
  [41, 35, 2.5], [33, 48, 3], [27, 61, 2], [39, 65, 2.5], [51, 69, 3.5], [63, 62, 2],
  [74, 71, 2.5], [59, 81, 2], [45, 83, 2.5], [30, 77, 2],
];
const LIJNEN: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [5, 6], [6, 7], [7, 8], [8, 9],
  [9, 10], [10, 11], [11, 4], [11, 12], [10, 13], [13, 14], [14, 15], [15, 9],
];

export function Sterrenbeeld({
  className = "",
  labels = false,
  tekenIn = false,
}: {
  className?: string;
  /** Proceslabels rond de cirkel, zoals op de openingsslide. */
  labels?: boolean;
  /** De lijnen eenmalig intekenen bij binnenkomst. */
  tekenIn?: boolean;
}) {
  const reduced = useReducedMotion();
  const animeer = tekenIn && !reduced;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden overflow="visible">
      <circle cx="53" cy="52" r="44" fill="none" stroke="currentColor" strokeOpacity="0.22" strokeDasharray="0.6 1.6" strokeWidth="0.35" />
      {LIJNEN.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={PUNTEN[a][0]}
          y1={PUNTEN[a][1]}
          x2={PUNTEN[b][0]}
          y2={PUNTEN[b][1]}
          stroke={ORANJE}
          strokeWidth="0.45"
          initial={animeer ? { pathLength: 0, opacity: 0 } : false}
          animate={animeer ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: 0.25 + i * 0.07, ease: "easeOut" }}
        />
      ))}
      {PUNTEN.map(([x, y, r], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={r * 0.55}
          fill={i % 3 === 0 ? ORANJE : "currentColor"}
          initial={animeer ? { scale: 0, opacity: 0 } : false}
          animate={animeer ? { scale: 1, opacity: 1 } : undefined}
          transition={{ duration: 0.35, delay: i * 0.05 }}
          style={{ transformOrigin: `${x}px ${y}px` }}
        />
      ))}
      {labels &&
        (
          [
            ["Prospecting", 30, 5, "end"],
            ["Opvolging", 92, 14, "start"],
            ["Nurturing", 6, 92, "end"],
            ["CRM", 95, 90, "start"],
          ] as const
        ).map(([t, x, y, a]) => (
          <text
            key={t}
            x={x}
            y={y}
            textAnchor={a}
            fontSize="3.1"
            letterSpacing="0.5"
            fontFamily="JetBrains Mono, monospace"
            fill={ORANJE}
          >
            {t.toUpperCase()}
          </text>
        ))}
    </svg>
  );
}

/* ── Het lekkende proces ─────────────────────────────────────────────────── */

function Druppel({ index }: { index: number }) {
  const reduced = useReducedMotion();
  return (
    <svg viewBox="0 0 20 46" className="h-11 w-5" aria-hidden>
      <path d="M10 2 C 16 12, 18 18, 18 22 A 8 8 0 0 1 2 22 C 2 18, 4 12, 10 2 Z" fill="#C0392B" />
      <motion.path
        d="M10 30 C 12.5 34, 13 36, 13 37.5 A 3 3 0 0 1 7 37.5 C 7 36, 7.5 34, 10 30 Z"
        fill="#C0392B"
        initial={reduced ? false : { y: -8, opacity: 0 }}
        whileInView={reduced ? undefined : { y: 4, opacity: [0, 1, 1, 0.6] }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.1, delay: 0.3 + index * 0.18, ease: "easeIn" }}
      />
    </svg>
  );
}

export function LekkendProces() {
  const n = PROCES_STAPPEN.length;
  return (
    <div>
      {/* Breed: één leiding met lekken op elke verbinding. */}
      <div className="hidden lg:block">
        <div className="relative grid grid-cols-6 gap-6">
          <div aria-hidden className="absolute left-[8%] right-[8%] top-[34px] h-[10px] border-y border-brand-ink/70 bg-brand-mist" />
          {PROCES_STAPPEN.map((s, i) => {
            const laatste = i === n - 1;
            return (
              <div key={s.naam} className="relative">
                <div
                  className={`relative z-[1] rounded-brand border-2 px-3 py-3 text-center ${
                    laatste ? "border-brand-accent-ink bg-brand-accent-ink text-white" : "border-brand-ink bg-brand-paper"
                  }`}
                >
                  <p className={`font-mono text-[10px] ${laatste ? "text-white/70" : "text-brand-ink-3"}`}>0{i + 1}</p>
                  <p className="font-display text-[16px] font-bold leading-tight">{s.naam}</p>
                </div>
                {s.lek && (
                  <div className="absolute -right-[22px] top-[46px] z-[2] flex w-[20px] flex-col items-center">
                    <Druppel index={i} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-12 grid grid-cols-6 gap-6">
          {PROCES_STAPPEN.map((s) => (
            <p
              key={s.naam}
              className="translate-x-1/2 text-center font-mono text-[10.5px] font-bold uppercase leading-snug tracking-[0.08em] text-[#B03A2E]"
            >
              {s.lek}
            </p>
          ))}
        </div>
      </div>

      {/* Smal: dezelfde keten verticaal, het lek naast elke stap. */}
      <ol className="relative space-y-3 border-l-2 border-brand-ink/70 pl-5 lg:hidden">
        {PROCES_STAPPEN.map((s, i) => (
          <li key={s.naam} className="relative">
            <span aria-hidden className="absolute -left-[27px] top-3 h-3 w-3 rounded-full border-2 border-brand-ink bg-brand-paper" />
            <div className="flex items-center justify-between gap-3 rounded-brand border border-brand-ink bg-brand-paper px-4 py-3">
              <span className="font-display text-[15px] font-bold">{s.naam}</span>
              {s.lek && (
                <span className="text-right font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-[#B03A2E]">
                  ● {s.lek}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-6 font-mono text-[10.5px] uppercase tracking-[0.1em] text-brand-ink-3">
        Een leadgeneratiebureau stopt na stap 02. De digitale salesmedewerker draait 01 tot en met 06.
      </p>
    </div>
  );
}

/* ── De collega met een brein ────────────────────────────────────────────── */

export function CollegaFiguur({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 190" className={className} aria-hidden>
      {/* Hoofd: het brein. */}
      <circle cx="80" cy="62" r="46" fill="#FDF1E8" stroke="#17140F" strokeWidth="2" />
      <g transform="translate(44 26) scale(0.72)">
        {LIJNEN.map(([a, b], i) => (
          <line key={i} x1={PUNTEN[a][0]} y1={PUNTEN[a][1]} x2={PUNTEN[b][0]} y2={PUNTEN[b][1]} stroke={ROESTIG} strokeWidth="1" />
        ))}
        {PUNTEN.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r * 0.9} fill={i % 3 === 0 ? ORANJE : "#17140F"} />
        ))}
      </g>
      {/* Schouders. */}
      <path d="M22 188 C 22 140, 50 116, 80 116 C 110 116, 138 140, 138 188" fill="#FDF1E8" stroke="#17140F" strokeWidth="2" />
      <rect x="58" y="146" width="44" height="14" rx="2" fill={ORANJE} />
      <text x="80" y="156" textAnchor="middle" fontSize="7" fontFamily="JetBrains Mono, monospace" letterSpacing="1.2" fill="#fff">
        DIGITAAL
      </text>
    </svg>
  );
}

/** Pijl tussen de drie delen: horizontaal op breed scherm, verticaal op smal. */
export function Doorstroom() {
  return (
    <svg viewBox="0 0 60 16" className="mx-auto h-4 w-14 rotate-90 text-brand-ink lg:rotate-0" aria-hidden>
      <line x1="2" y1="8" x2="52" y2="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M50 3 L58 8 L50 13 Z" fill="currentColor" />
    </svg>
  );
}

/* ── De signaalkaart: drie ringen rond het brein ─────────────────────────── */

type Chip = { t: string; x: number; y: number; sterk?: boolean };

const CHIPS: Chip[] = [
  // Eerste partij, binnenste ring.
  { t: "CRM-historie", x: 50, y: 36.5 },
  { t: "E-mail clicks", x: 31, y: 50 },
  { t: "Replies", x: 69, y: 50, sterk: true },
  { t: "Websitebezoek", x: 50, y: 69, sterk: true },
  // Tweede partij, middelste ring.
  { t: "Sales Navigator-alerts", x: 27, y: 25 },
  { t: "LinkedIn-engagement", x: 74, y: 25 },
  { t: "Posts van uw team", x: 21, y: 72 },
  { t: "Profielbezoek", x: 80, y: 66 },
  // Derde partij, buitenste ring.
  { t: "Vacature", x: 79, y: 9, sterk: true },
  { t: "Firmografie", x: 2, y: 41 },
  { t: "Nieuwe beslisser", x: 99, y: 42, sterk: true },
  { t: "Groei en nieuws", x: 15, y: 89 },
  { t: "Look-alike van klant", x: 83, y: 87 },
];

export function SignaalRingen({ className = "" }: { className?: string }) {
  return (
    <div className={`relative mx-auto aspect-square w-full max-w-[520px] ${className}`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <circle cx="50" cy="50" r="48" fill="#FDF1E8" fillOpacity="0.55" stroke={ORANJE} strokeOpacity="0.45" strokeWidth="0.3" />
        <circle cx="50" cy="50" r="34" fill="#FDF1E8" fillOpacity="0.8" stroke={ORANJE} strokeOpacity="0.55" strokeWidth="0.3" />
        <circle cx="50" cy="50" r="21" fill="#FBE3D0" stroke={ORANJE} strokeOpacity="0.7" strokeWidth="0.3" />
        <circle cx="50" cy="50" r="9" fill="#fff" stroke={ROESTIG} strokeWidth="0.5" />
      </svg>
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-display text-[13px] font-bold leading-tight">
        Het
        <br />
        brein
      </span>
      {[
        ["Derde partij", 2.5],
        ["Tweede partij", 16.5],
        ["Eerste partij", 29.5],
      ].map(([t, top]) => (
        <span
          key={t as string}
          className="absolute left-1/2 -translate-x-1/2 rounded-full bg-brand-accent-ink px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-white"
          style={{ top: `${top}%` }}
        >
          {t}
        </span>
      ))}
      {CHIPS.map((c) => (
        <span
          key={c.t}
          className={`absolute -translate-y-1/2 whitespace-nowrap rounded-full border border-brand-line bg-white px-1.5 py-[2px] text-[9px] text-brand-ink shadow-[0_1px_0_rgba(23,20,15,0.06)] sm:px-2 sm:py-[3px] sm:text-[10.5px] ${
            c.x < 15 ? "translate-x-0" : c.x > 85 ? "-translate-x-full" : "-translate-x-1/2"
          }`}
          style={{ left: `${c.x}%`, top: `${c.y}%` }}
        >
          {c.sterk && <span aria-hidden className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-brand-accent align-middle" />}
          {c.t}
        </span>
      ))}
    </div>
  );
}

/* ── Een werkdag van de digitale salesmedewerker ─────────────────────────── */

const WERKDAG: { tijd: string; soort: string; wat: string }[] = [
  { tijd: "07:00", soort: "Prospecting", wat: "12 nieuwe look-alikes van klanten aan de dynamische lijst toegevoegd" },
  { tijd: "08:30", soort: "Signaal", wat: "Vacature gevonden die past bij uw dienst: het bedrijf wordt Target" },
  { tijd: "10:00", soort: "Activatie", wat: "Stap 3 van de waterval verstuurd: de businesscase" },
  { tijd: "11:45", soort: "Score", wat: "Een beslisser klikt en bezoekt uw site: Priority" },
  { tijd: "12:00", soort: "Overdracht", wat: "Doorgezet naar de beller, met context en reden" },
  { tijd: "16:00", soort: "Nurturing", wat: "Niet-geconverteerde leads krijgen de nieuwsbrief" },
];

export function Werkdag() {
  return (
    <div>
      {/* Breed: tijdlijn met kaartjes om en om boven en onder. */}
      <div className="relative hidden lg:block">
        <div className="grid grid-cols-6 gap-4">
          {WERKDAG.map((m, i) => (
            <div key={m.tijd} className={`flex flex-col ${i % 2 === 0 ? "" : "pt-[188px]"}`}>
              <div className="rounded-brand border border-white/20 bg-brand-deep-2 p-4">
                <div className="mb-1.5 flex items-baseline justify-between gap-2">
                  <span className="font-display text-[19px] font-black text-brand-accent">{m.tijd}</span>
                  <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-[#8C8378]">{m.soort}</span>
                </div>
                <p className="text-[12.5px] leading-snug text-[#D6CEC3]">{m.wat}</p>
              </div>
              <span aria-hidden className={`mx-auto w-px bg-white/25 ${i % 2 === 0 ? "h-10" : "order-first h-10"}`} />
            </div>
          ))}
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[164px] grid grid-cols-6 gap-4">
          <span className="absolute inset-x-0 top-[8px] h-px bg-white/30" />
          {WERKDAG.map((m, i) => (
            <span key={m.tijd} className="relative flex justify-center">
              <span className={`relative z-[1] h-4 w-4 rounded-full border-2 border-brand-deep ${i % 2 === 0 ? "bg-brand-accent" : "bg-brand-accent-ink"}`} />
            </span>
          ))}
        </div>
      </div>
      {/* Smal: verticale tijdlijn. */}
      <ol className="space-y-4 border-l border-white/25 pl-5 lg:hidden">
        {WERKDAG.map((m) => (
          <li key={m.tijd} className="relative">
            <span aria-hidden className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full bg-brand-accent" />
            <p className="font-display text-[18px] font-black text-brand-accent">
              {m.tijd} <span className="ml-2 font-mono text-[9px] font-normal uppercase tracking-[0.14em] text-[#8C8378]">{m.soort}</span>
            </p>
            <p className="text-[13.5px] text-[#D6CEC3]">{m.wat}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ── De eerste 90 dagen als planning ─────────────────────────────────────── */

type Balk = { nr: string; naam: string; detail: string; van: number; tot: number; doorlopend?: boolean; mijlpaal?: string };

/** Weken 1 tot en met 12; `tot` is inclusief. */
const PLANNING: Balk[] = [
  { nr: "01", naam: "Kick-off + domeinen", detail: "ICP-sessie, domeinen kopen", van: 1, tot: 1 },
  { nr: "02", naam: "CRM opschonen", detail: "dubbelen, velden, fases", van: 2, tot: 3 },
  { nr: "03", naam: "Klantprofiel", detail: "look-alikes van eigen klanten", van: 2, tot: 3 },
  { nr: "04", naam: "Marktkaart", detail: "Qualified en Target, in tiers", van: 3, tot: 4 },
  { nr: "05", naam: "Brein vullen", detail: "proposities, persona's, toon", van: 3, tot: 5 },
  { nr: "06", naam: "Waterval-content", detail: "6 contentvormen, getoetst", van: 4, tot: 6 },
  { nr: "07", naam: "Signalen", detail: "vacatures, websitebezoek, LinkedIn", van: 5, tot: 6 },
  { nr: "08", naam: "Eerste golf live", detail: "één segment, één invalshoek", van: 6, tot: 8, mijlpaal: "Live" },
  { nr: "09", naam: "Score en overdracht", detail: "warm signaal naar beller", van: 7, tot: 9 },
  { nr: "10", naam: "Tweede kanaal", detail: "LinkedIn en bellen erbij", van: 8, tot: 10 },
  { nr: "11", naam: "Weekreview + rapport", detail: "gesprekken, pipeline, oorzaak", van: 6, tot: 12, doorlopend: true },
  { nr: "12", naam: "Vastleggen + overdragen", detail: "elk proces als recept", van: 11, tot: 12, mijlpaal: "Basis staat" },
  { nr: "13", naam: "Meekijken: volgend proces", detail: "waar zit de volgende winst?", van: 9, tot: 12, doorlopend: true },
];

export function Planning() {
  const weken = Array.from({ length: 12 }, (_, i) => i + 1);
  const maanden = ["Maand 1 · fundament", "Maand 2 · engine", "Maand 3 · schalen"];
  const uren = ["± 70 uur", "± 55 uur", "± 35 uur"];
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[980px]">
        <div className="grid grid-cols-[330px_1fr] items-end">
          <span className="pb-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#8C8378]">Wat we bouwen</span>
          <div className="grid grid-cols-3">
            {maanden.map((m, i) => (
              <div key={m} className={`border-b border-white/15 px-2 pb-1 ${i > 0 ? "border-l border-white/15" : ""}`}>
                <p className="mb-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-brand-accent">{m}</p>
                <div className="grid grid-cols-4 font-mono text-[9px] text-[#8C8378]">
                  {weken.slice(i * 4, i * 4 + 4).map((w) => (
                    <span key={w}>W{w}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {PLANNING.map((b) => (
          <div key={b.nr} className="grid grid-cols-[330px_1fr] items-center border-b border-white/[.07] py-[5px]">
            <p className="truncate text-[12.5px] text-white">
              <span className="mr-2 font-mono text-[10px] text-[#8C8378]">{b.nr}</span>
              <b className="font-semibold">{b.naam}</b>{" "}
              <span className="text-[11px] text-[#8C8378]">{b.detail}</span>
            </p>
            <div className="relative grid h-[14px] grid-cols-12">
              {weken.map((w) => (
                <span key={w} className={w % 4 === 1 && w > 1 ? "border-l border-white/15" : ""} />
              ))}
              <span
                className={`absolute top-[2px] h-[10px] rounded-full ${
                  b.doorlopend ? "border border-dashed border-brand-accent" : "bg-brand-accent"
                }`}
                style={{ left: `${((b.van - 1) / 12) * 100}%`, width: `${((b.tot - b.van + 1) / 12) * 100}%` }}
              />
              {b.mijlpaal && (
                <span
                  className={`absolute top-[-1px] flex items-center gap-1 ${b.mijlpaal === "Live" ? "" : "flex-row-reverse"}`}
                  style={
                    b.mijlpaal === "Live"
                      ? { left: `calc(${((b.van - 1) / 12) * 100}% - 7px)` }
                      : { right: "-7px" }
                  }
                >
                  <span className="h-3 w-3 rotate-45 border-2 border-brand-deep bg-white" />
                  <span className="rounded bg-white/10 px-1 font-mono text-[8.5px] uppercase tracking-[0.1em] text-white">{b.mijlpaal}</span>
                </span>
              )}
            </div>
          </div>
        ))}
        <div className="grid grid-cols-[330px_1fr] items-center pt-3">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#8C8378]">Werk in uren handwerk (± 160)</span>
          <div className="grid grid-cols-3 text-center font-display text-[15px] font-bold text-white">
            {uren.map((u) => (
              <span key={u}>{u}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

