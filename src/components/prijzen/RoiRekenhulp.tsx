import { useMemo, useState } from "react";
import { FUNCTIES, MENUS, UURKOSTEN, BASISTEAM, euro, keer, prijsVan, reken } from "@/data/breinPrijzen";

/**
 * Rekenhulp: kies functies, uurkosten en teamgrootte en zie wat het brein
 * bespaart tegenover wat het kost.
 */
export function RoiRekenhulp() {
  const [gekozen, setGekozen] = useState<string[]>(MENUS[1].ids);
  const [uurkosten, setUurkosten] = useState(UURKOSTEN);
  const [team, setTeam] = useState(BASISTEAM);

  const r = useMemo(() => reken(gekozen, uurkosten, team), [gekozen, uurkosten, team]);
  const menu = MENUS.find(
    (m) => m.ids.length === gekozen.length && m.ids.every((id) => gekozen.includes(id)),
  );

  const wissel = (id: string) =>
    setGekozen((huidig) => (huidig.includes(id) ? huidig.filter((x) => x !== id) : [...huidig, id]));

  return (
    <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
      <div className="grid content-start gap-3.5">
        <div className="grid gap-2 sm:grid-cols-2">
          {FUNCTIES.map((f) => {
            const aan = gekozen.includes(f.id);
            return (
              <label
                key={f.id}
                className={`flex cursor-pointer items-start gap-2.5 rounded-brand border px-3 py-2.5 text-sm transition-colors ${
                  aan ? "border-brand-accent bg-brand-tint" : "border-brand-line bg-brand-paper"
                }`}
              >
                <input
                  id={`roi-${f.id}`}
                  type="checkbox"
                  checked={aan}
                  onChange={() => wissel(f.id)}
                  className="mt-1 accent-[#A85410]"
                />
                <span>
                  {f.naam}
                  <span className="block font-mono text-[11px] text-brand-ink-3">
                    {euro(prijsVan(f))} p/m · {f.uren} uur
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        <Schuif
          id="roi-uurkosten"
          label="Uurkosten medewerker"
          waarde={euro(uurkosten)}
          min={40}
          max={100}
          stap={5}
          value={uurkosten}
          onChange={setUurkosten}
        />
        <Schuif
          id="roi-team"
          label="Commerciële medewerkers"
          waarde={String(team)}
          min={1}
          max={12}
          stap={1}
          value={team}
          onChange={setTeam}
        />
      </div>

      <div aria-live="polite" className="grid content-start gap-3 rounded-brand border border-brand-ink bg-brand-paper p-5">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
          Rendement op tijd
        </span>
        <p className="font-display text-5xl font-black leading-none tracking-[-0.03em] text-emerald-700">
          {r.prijs ? keer(r.roi) : "–"}
        </p>
        <dl className="grid gap-1 text-[13.5px]">
          {[
            ["Bespaarde uren", `${Math.round(r.uren)} uur p/m`],
            ["Waarde van die uren", euro(r.waarde)],
            ["Uw prijs, all-in", euro(r.prijs)],
            ["Netto per maand", euro(r.waarde - r.prijs)],
            ["Vrijgekomen tijd", `${r.fte.toFixed(1).replace(".", ",")} fte`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 border-b border-dotted border-brand-line py-1">
              <dt className="text-brand-ink-2">{k}</dt>
              <dd className="font-mono font-bold tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="text-[13px] font-semibold text-brand-accent-ink">
          {!r.prijs
            ? "Kies minstens één functie."
            : menu
              ? `Dit is precies ${menu.naam}.`
              : "Eigen samenstelling, dezelfde rekenregel."}
        </p>
      </div>
    </div>
  );
}

function Schuif({
  id,
  label,
  waarde,
  min,
  max,
  stap,
  value,
  onChange,
}: {
  id: string;
  label: string;
  waarde: string;
  min: number;
  max: number;
  stap: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="grid gap-1.5 rounded-brand border border-brand-line bg-brand-paper px-3.5 py-3">
      <label htmlFor={id} className="flex justify-between gap-3 text-sm">
        <span>{label}</span>
        <span className="font-mono font-bold tabular-nums">{waarde}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={stap}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#A85410]"
      />
    </div>
  );
}
