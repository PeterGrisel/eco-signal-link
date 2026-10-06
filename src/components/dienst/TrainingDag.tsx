import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Hero-beeld voor Training: het dagprogramma per track. Kies een track en
 * zie hoe de dag op locatie verloopt en wat het team aan het eind heeft.
 */
const TRACKS = [
  {
    naam: "AI-geletterdheid",
    voor: "Iedereen die met AI werkt",
    dag: [
      ["09:00", "Wat AI wel en niet kan, met voorbeelden uit uw sector"],
      ["10:30", "Zelf doen: drie taken uit uw eigen week met AI"],
      ["12:30", "Lunch"],
      ["13:15", "Risico's: data, privacy en de AI-verordening"],
      ["15:00", "Afspraken maken: wat mag, wat niet, wie beslist"],
      ["16:30", "Afsluiting en certificaat"],
    ],
    resultaat: "Vastgelegde AI-afspraken en aantoonbare geletterdheid per deelnemer",
  },
  {
    naam: "AI-adoptie",
    voor: "Teams die AI vast willen inzetten",
    dag: [
      ["09:00", "Inventarisatie: waar zit het handwerk in uw proces"],
      ["10:30", "Bouwen: een eerste werkstroom op uw eigen tools"],
      ["12:30", "Lunch"],
      ["13:15", "Testen met echte gevallen uit uw CRM en mailbox"],
      ["15:00", "Werkwijze vastleggen en eigenaar per stroom"],
      ["16:30", "Plan voor de eerste dertig dagen"],
    ],
    resultaat: "Een werkende werkstroom en een eigenaar die hem onderhoudt",
  },
  {
    naam: "AI-pilots",
    voor: "Leidinggevenden",
    dag: [
      ["09:00", "Waar AI in uw organisatie het meeste oplevert"],
      ["10:30", "Kiezen: één proces, één meetbaar doel"],
      ["12:30", "Lunch"],
      ["13:15", "Pilot ontwerpen: team, data, risico's en budget"],
      ["15:00", "Sturen op resultaat: wat meet u na 30, 60 en 90 dagen"],
      ["16:30", "Besluit en startdatum"],
    ],
    resultaat: "Een pilotplan met doel, eigenaar, budget en meetmoment",
  },
];

export function TrainingDag() {
  const reduce = useReducedMotion();
  const [actief, setActief] = useState(0);
  const t = TRACKS[actief];

  return (
    <div className="w-full overflow-hidden rounded-[6px] border border-white/[.12] bg-[#0F0D0A] text-[13px] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
      <div role="tablist" aria-label="Trainingen" className="grid grid-cols-3 border-b border-white/[.08]">
        {TRACKS.map((tr, i) => (
          <button
            key={tr.naam}
            role="tab"
            aria-selected={i === actief}
            onClick={() => setActief(i)}
            className={`px-2 py-3 text-left transition-colors ${i === actief ? "bg-white/[.05]" : "hover:bg-white/[.03]"}`}
          >
            <span className={`block font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] ${i === actief ? "text-brand-accent" : "text-[#8C8378]"}`}>
              {tr.naam}
            </span>
            <span className="mt-0.5 block text-[11px] text-[#6F665C]">{tr.voor}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={actief}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="p-4"
        >
          <ol className="relative ml-[52px] border-l border-white/[.1]">
            {t.dag.map(([tijd, wat], i) => (
              <motion.li
                key={tijd}
                initial={reduce ? false : { opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="relative py-2 pl-4"
              >
                <span className="absolute -left-[52px] top-2 w-[42px] text-right font-mono text-[11px] tabular-nums text-[#8C8378]">
                  {tijd}
                </span>
                <span
                  className={`absolute -left-[4px] top-[13px] size-[7px] rounded-full ${wat === "Lunch" ? "bg-[#3A332B]" : "bg-brand-accent"}`}
                />
                <span className={wat === "Lunch" ? "text-[#6F665C]" : "text-[#E9E3DA]"}>{wat}</span>
              </motion.li>
            ))}
          </ol>
          <div className="mt-3 rounded-[4px] border border-emerald-400/25 bg-emerald-500/10 px-3 py-2.5 text-emerald-100">
            <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-300/80">Om 17:00 heeft uw team</span>
            {t.resultaat}
          </div>
          <p className="mt-3 flex flex-wrap justify-between gap-2 font-mono text-[10.5px] text-[#6F665C]">
            <span>op locatie · max. 12 deelnemers</span>
            <span>€ 2.450 per dag</span>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
