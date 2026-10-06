import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

/**
 * Hero-beeld voor Reporting: een vraag in gewone taal, een antwoord met
 * grafiek. Drie voorbeeldvragen met voorbeelddata.
 */
const VRAGEN = [
  {
    vraag: "Waarom daalde de conversie in september?",
    antwoord:
      "Niet door minder leads. Wel door langzamere opvolging: de mediane reactietijd steeg van 4 naar 19 uur, vooral in de week van de beurs.",
    type: "line" as const,
    eenheid: "uur",
    data: [
      { x: "jun", v: 5 },
      { x: "jul", v: 4 },
      { x: "aug", v: 6 },
      { x: "sep", v: 19 },
      { x: "okt", v: 7 },
    ],
  },
  {
    vraag: "Welke campagne leverde de meeste pipeline op?",
    antwoord:
      "De campagne voor installateurs in Brabant: € 184.000 pipeline uit 31 gesprekken. Dat is bijna twee keer de nummer twee.",
    type: "bar" as const,
    eenheid: "k€",
    data: [
      { x: "Install.", v: 184 },
      { x: "Logistiek", v: 96 },
      { x: "Bouw", v: 71 },
      { x: "Zorg", v: 38 },
    ],
  },
  {
    vraag: "Hoeveel deals lopen het risico te verlopen?",
    antwoord:
      "Elf deals hebben al drie weken geen activiteit, samen € 212.000. Zes daarvan staan bij één accountmanager.",
    type: "bar" as const,
    eenheid: "deals",
    data: [
      { x: "< 1 wk", v: 24 },
      { x: "1-2 wk", v: 15 },
      { x: "2-3 wk", v: 9 },
      { x: "> 3 wk", v: 11 },
    ],
  },
];

const ORANJE = "#E8945A";
const AS = "#6F665C";

export function ReportingVraag() {
  const reduce = useReducedMotion();
  const [actief, setActief] = useState(0);
  const v = VRAGEN[actief];

  return (
    <div className="w-full overflow-hidden rounded-[6px] border border-white/[.12] bg-[#0F0D0A] text-[13px] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
      <div className="flex flex-wrap gap-1.5 border-b border-white/[.08] p-3">
        {VRAGEN.map((q, i) => (
          <button
            key={q.vraag}
            onClick={() => setActief(i)}
            aria-pressed={i === actief}
            className={`rounded-full border px-3 py-1.5 text-left text-[12px] transition-colors ${
              i === actief
                ? "border-brand-accent bg-brand-accent/15 text-white"
                : "border-white/[.12] text-[#A99F93] hover:border-white/30 hover:text-white"
            }`}
          >
            {q.vraag}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={actief}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid gap-3 p-4"
        >
          <p className="font-mono text-[11px] text-[#8C8378]">› {v.vraag}</p>
          <p className="leading-relaxed text-[#E9E3DA]">{v.antwoord}</p>
          <div className="h-[170px] rounded-[4px] border border-white/[.06] p-2">
            <ResponsiveContainer width="100%" height="100%">
              {v.type === "line" ? (
                <LineChart data={v.data} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="x" tick={{ fill: AS, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: AS, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ stroke: "rgba(255,255,255,0.15)" }}
                    contentStyle={{ background: "#17140F", border: "1px solid #3A332B", fontSize: 12 }}
                    formatter={(val: number) => [`${val} ${v.eenheid}`, ""]}
                  />
                  <Line type="monotone" dataKey="v" stroke={ORANJE} strokeWidth={2.5} dot={{ r: 3, fill: ORANJE }} isAnimationActive={!reduce} />
                </LineChart>
              ) : (
                <BarChart data={v.data} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="x" tick={{ fill: AS, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: AS, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                    contentStyle={{ background: "#17140F", border: "1px solid #3A332B", fontSize: 12 }}
                    formatter={(val: number) => [`${val} ${v.eenheid}`, ""]}
                  />
                  <Bar dataKey="v" fill={ORANJE} radius={[3, 3, 0, 0]} isAnimationActive={!reduce} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          <p className="flex justify-between font-mono text-[10.5px] text-[#6F665C]">
            <span>bron: CRM + campagnedata, live</span>
            <span>voorbeeld</span>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
