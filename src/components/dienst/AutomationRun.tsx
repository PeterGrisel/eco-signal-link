import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Hero-beeld voor AI Automation: één run van het brein, stap voor stap.
 * Een aanvraag komt binnen en vijf agents handelen hem af. Rechtsboven telt
 * het handwerk mee dat niemand meer hoeft te doen. Voorbeelddata.
 */
const STAPPEN = [
  { tijd: "08:02:11", agent: "Intake", tekst: "Aanvraag via website: Bouwbedrijf Noordkade, 42 medewerkers", minuten: 0 },
  { tijd: "08:02:14", agent: "Verrijker", tekst: "KvK, LinkedIn en website gelezen. Beslisser: M. de Wit, directeur", minuten: 12 },
  { tijd: "08:02:19", agent: "Kwalificatie", tekst: "Past op ICP: bouw, 20 tot 100 fte, regio Noord. Score 82/100", minuten: 8 },
  { tijd: "08:02:21", agent: "Routing", tekst: "Toegewezen aan Sanne, deal aangemaakt in HubSpot", minuten: 6 },
  { tijd: "08:02:26", agent: "Opvolging", tekst: "Belafspraak voorgesteld, mail als concept klaargezet voor Sanne", minuten: 15 },
  { tijd: "08:02:27", agent: "Verslag", tekst: "Samenvatting en volgende stap in het CRM gezet", minuten: 6 },
];

export function AutomationRun() {
  const reduce = useReducedMotion();
  const [zichtbaar, setZichtbaar] = useState(reduce ? STAPPEN.length : 1);

  useEffect(() => {
    if (reduce) return;
    const klaar = zichtbaar >= STAPPEN.length;
    const t = window.setTimeout(() => setZichtbaar(klaar ? 1 : zichtbaar + 1), klaar ? 4200 : 1100);
    return () => window.clearTimeout(t);
  }, [zichtbaar, reduce]);

  const bespaard = STAPPEN.slice(0, zichtbaar).reduce((s, st) => s + st.minuten, 0);
  const klaar = zichtbaar >= STAPPEN.length;

  return (
    <div className="w-full overflow-hidden rounded-[6px] border border-white/[.12] bg-[#0F0D0A] font-mono text-[12px] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between gap-3 border-b border-white/[.08] px-4 py-3">
        <span className="flex items-center gap-2 text-[#A99F93]">
          <span className={`size-2 rounded-full ${klaar ? "bg-emerald-400" : "animate-pulse bg-brand-accent"}`} />
          run #4821 · lead-intake
        </span>
        <span className="text-[#A99F93]">
          handwerk bespaard <span className="tabular-nums text-white">{bespaard} min</span>
        </span>
      </div>
      <ol className="min-h-[300px] space-y-0 px-4 py-3">
        <AnimatePresence initial={false}>
          {STAPPEN.slice(0, zichtbaar).map((st, i) => (
            <motion.li
              key={st.tijd + i}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-[64px_92px_1fr] items-baseline gap-2 border-b border-dashed border-white/[.06] py-2.5 last:border-0 max-sm:grid-cols-[80px_1fr]"
            >
              <span className="tabular-nums text-[#6F665C]">{st.tijd}</span>
              <span className="text-brand-accent max-sm:hidden">{st.agent}</span>
              <span className="text-[#E9E3DA]">
                <span className="text-brand-accent sm:hidden">{st.agent} · </span>
                {st.tekst}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
      <div className="flex items-center justify-between border-t border-white/[.08] px-4 py-2.5 text-[11px] text-[#6F665C]">
        <span>{klaar ? "✓ afgerond in 16 seconden" : "bezig…"}</span>
        <span>voorbeeld</span>
      </div>
    </div>
  );
}
