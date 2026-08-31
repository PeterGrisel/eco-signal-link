/**
 * De bewegende miniatuurschermen in de dienstenkaarten.
 *
 * Elke mock laat in een paar seconden zien wat die dienst dóét, zonder een
 * screenshot te hoeven zijn. Alles is opgebouwd uit tekst en vormen, dus het
 * schaalt mee en blijft scherp. De animaties staan in `index.css` en stoppen
 * bij `prefers-reduced-motion`; ze zijn decoratief, dus `aria-hidden`.
 */

const vlak =
  "relative flex h-[132px] w-full flex-col justify-center overflow-hidden rounded-brand border border-brand-line bg-brand-mist px-4 py-3";

/** Outbound: een sequence die zichzelf schrijft, met de bronnen eronder. */
export function MockSequence() {
  return (
    <div aria-hidden className={vlak}>
      <div className="rounded-brand border border-brand-line bg-brand-paper px-3 py-2">
        <p className="font-mono text-[9.5px] leading-[1.5] text-brand-ink-2">
          <span className="v2-typen">Nieuwe vestiging gezien in Venlo,</span>
          <span className="v2-cursor text-brand-accent-ink">▌</span>
        </p>
      </div>
      <div className="mt-2.5 flex gap-1.5">
        {["Apollo", "Clay", "CRM"].map((bron, i) => (
          <span
            key={bron}
            className="v2-chip rounded-[2px] border px-2 py-1 font-mono text-[8.5px] font-bold uppercase tracking-[0.1em]"
            style={{ animationDelay: `${i * 0.5}s` }}
          >
            {bron}
          </span>
        ))}
      </div>
    </div>
  );
}

/** ABM: één account reist van qualified naar priority. */
export function MockPipeline() {
  const banen = ["Qualified", "Target", "Priority"];
  return (
    <div aria-hidden className={vlak}>
      <div className="grid grid-cols-3 gap-2">
        {banen.map((baan) => (
          <div key={baan}>
            <p className="mb-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-brand-ink-3">
              {baan}
            </p>
            <div className="h-[54px] rounded-[2px] border border-dashed border-brand-line" />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-4 bottom-[18px]">
        <div className="w-[calc((100%-1rem)/3)]">
          <div className="v2-ticket rounded-[2px] border border-brand-accent bg-brand-paper px-2 py-1.5 shadow-[0_4px_14px_rgba(23,20,15,0.10)]">
            <p className="font-mono text-[8.5px] font-bold text-brand-ink">Van Dijk</p>
            <p className="font-mono text-[7.5px] text-brand-ink-3">fit 94</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** RevOps: het fundament dat stap voor stap wordt afgevinkt. */
export function MockChecklist() {
  const regels = ["Datamodel", "Routing", "Rapportage"];
  return (
    <div aria-hidden className={vlak}>
      <ul className="space-y-2">
        {regels.map((regel, i) => (
          <li key={regel} className="flex items-center gap-2.5">
            <span
              className="v2-vinkvak flex size-[15px] shrink-0 items-center justify-center rounded-[2px] border"
              style={{ animationDelay: `${i * 0.6}s` }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  className="v2-vink"
                  style={{ animationDelay: `${i * 0.6}s` }}
                  d="M2 5.2l2 2 4-4.2"
                  stroke="#FFFFFF"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="font-mono text-[9.5px] text-brand-ink-2">{regel}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Nurturing: de marktdekking die zich vult, met de niveaus ernaast. */
export function MockRadar() {
  const bogen = [
    { r: 30, deel: 0.86, kleur: "#E8945A" },
    { r: 23, deel: 0.42, kleur: "#D97B3A" },
    { r: 16, deel: 0.18, kleur: "#A85410" },
  ];
  return (
    <div aria-hidden className={`${vlak} items-center`}>
      <div className="flex items-center gap-5">
        <svg viewBox="0 0 80 80" className="size-[92px] shrink-0">
          {bogen.map((boog, i) => {
            const lengte = 2 * Math.PI * boog.r;
            return (
              <g key={boog.r}>
                <circle
                  cx="40"
                  cy="40"
                  r={boog.r}
                  fill="none"
                  stroke="#E5DFD5"
                  strokeWidth="4"
                />
                <circle
                  className="v2-boog"
                  cx="40"
                  cy="40"
                  r={boog.r}
                  fill="none"
                  stroke={boog.kleur}
                  strokeWidth="4"
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                  strokeDasharray={lengte}
                  style={
                    {
                      "--v2-boog-lengte": lengte,
                      "--v2-boog-rest": lengte * (1 - boog.deel),
                      animationDelay: `${i * 0.25}s`,
                    } as React.CSSProperties
                  }
                />
              </g>
            );
          })}
        </svg>
        <ul className="space-y-1.5">
          {[
            ["1.200", "qualified"],
            ["350", "target"],
            ["70", "priority"],
          ].map(([getal, label]) => (
            <li key={label} className="flex items-baseline gap-2">
              <b className="font-display text-[13px] font-bold tracking-tight text-brand-ink">
                {getal}
              </b>
              <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-brand-ink-3">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Alles samen: signaal, toets, sales, met de schakels die zich vullen. */
export function MockHandoff() {
  const stappen = [
    ["01", "Signaal"],
    ["02", "Toets"],
    ["03", "Sales"],
  ];
  return (
    <div aria-hidden className={vlak}>
      <div className="flex items-center">
        {stappen.map(([nr, naam], i) => (
          <div key={naam} className="flex min-w-0 flex-1 items-center">
            <div
              className="v2-stap-aan min-w-0 rounded-brand border bg-brand-paper px-2.5 py-2"
              style={{ animationDelay: `${i * 0.7}s` }}
            >
              <p className="font-mono text-[8px] font-bold tracking-[0.12em] text-brand-accent-ink">
                {nr}
              </p>
              <p className="truncate font-mono text-[9.5px] text-brand-ink">{naam}</p>
            </div>
            {i < stappen.length - 1 && (
              <span className="mx-1.5 h-px flex-1 bg-brand-line">
                <span
                  className="v2-schakel block h-px w-full bg-brand-accent"
                  style={{ animationDelay: `${i * 0.7 + 0.3}s` }}
                />
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[8.5px] uppercase tracking-[0.12em] text-brand-ink-3">
        Met reason codes naar uw CRM
      </p>
    </div>
  );
}
