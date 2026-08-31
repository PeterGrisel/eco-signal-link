/**
 * De hero-visual: het systeem in één beeld.
 *
 * Signalen uit losse bronnen komen samen in de engine, die er één account met
 * een reden en een aanbevolen actie uit laat vallen. Volledig in SVG getekend
 * zodat de verhoudingen kloppen op elk formaat; de leesbare beschrijving staat
 * eronder voor schermlezers.
 */

const BRONNEN = [
  { label: "FUNDING", x: 10 },
  { label: "VACATURE", x: 88 },
  { label: "WEBSITE", x: 166 },
  { label: "NIEUWS", x: 244 },
  { label: "TECHSTACK", x: 322 },
  { label: "CRM", x: 400 },
];

const BEWIJS = [
  "Nieuwe vestiging aangekondigd",
  "Drie operationele vacatures",
  "Prijzenpagina 3× bezocht",
];

const TILE_W = 70;
const TILE_H = 32;
const TILE_Y = 30;
const ENGINE = { x: 200, y: 232, w: 80, h: 62 };

export function SignaalDiagram() {
  const engineTop = { x: ENGINE.x + ENGINE.w / 2, y: ENGINE.y };

  return (
    <figure className="m-0">
      <svg
        viewBox="0 0 480 556"
        className="block h-auto w-full"
        role="img"
        aria-labelledby="signaaldiagram-titel"
      >
        <title id="signaaldiagram-titel">
          Signalen uit funding, vacatures, website, nieuws, techstack en CRM komen
          samen in de opportunity-engine. Die levert één account op, Van Dijk
          Logistics, met een score van 94, drie bewijsregels en de aanbevolen
          actie om vandaag te bellen.
        </title>

        <defs>
          <linearGradient id="sd-lijn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8945A" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#E8945A" stopOpacity="0.75" />
          </linearGradient>
          <filter id="sd-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Bronnen: label plus tegel */}
        {BRONNEN.map((bron) => (
          <g key={bron.label}>
            <text
              x={bron.x + TILE_W / 2}
              y={TILE_Y - 8}
              textAnchor="middle"
              className="fill-[#8C8378] font-mono text-[7px] font-bold tracking-[0.12em]"
            >
              {bron.label}
            </text>
            <rect
              x={bron.x}
              y={TILE_Y}
              width={TILE_W}
              height={TILE_H}
              rx="2"
              className="fill-[#231F19] stroke-white/[.14]"
              strokeWidth="1"
            />
            <rect
              x={bron.x + TILE_W / 2 - 7}
              y={TILE_Y + TILE_H / 2 - 7}
              width="14"
              height="14"
              rx="1.5"
              className="fill-[#E8945A]/70"
            />
          </g>
        ))}

        {/* De bundel: elke bron buigt naar de engine toe */}
        {BRONNEN.map((bron) => {
          const x1 = bron.x + TILE_W / 2;
          const y1 = TILE_Y + TILE_H;
          return (
            <path
              key={`lijn-${bron.label}`}
              d={`M ${x1} ${y1} C ${x1} ${y1 + 70}, ${engineTop.x} ${engineTop.y - 74}, ${engineTop.x} ${engineTop.y}`}
              fill="none"
              stroke="url(#sd-lijn)"
              strokeWidth="1"
            />
          );
        })}

        {/* De engine */}
        <g filter="url(#sd-glow)">
          <rect
            x={ENGINE.x}
            y={ENGINE.y}
            width={ENGINE.w}
            height={ENGINE.h}
            rx="2"
            className="fill-[#1D1913] stroke-[#E8945A]"
            strokeWidth="1.25"
          />
        </g>
        <g transform={`translate(${ENGINE.x + ENGINE.w / 2 - 11} ${ENGINE.y + 14})`}>
          {[
            [0, 0],
            [11, 0],
            [5.5, 9],
            [0, 18],
            [11, 18],
          ].map(([dx, dy]) => (
            <rect key={`${dx}-${dy}`} x={dx} y={dy} width="8" height="8" rx="1" className="fill-[#E8945A]" />
          ))}
        </g>
        <text
          x={ENGINE.x + ENGINE.w / 2}
          y={ENGINE.y + ENGINE.h - 8}
          textAnchor="middle"
          className="fill-[#E8945A] font-mono text-[6.5px] font-bold tracking-[0.14em]"
        >
          ENGINE
        </text>

        {/* Zijkaart: het menselijk oordeel blijft in de lus */}
        <rect x="304" y="236" width="164" height="60" rx="2" className="fill-[#1B1712] stroke-white/[.14]" strokeWidth="1" />
        <text x="314" y="252" className="fill-[#E8945A] font-mono text-[6.5px] font-bold tracking-[0.14em]">
          MENSELIJK OORDEEL
        </text>
        <text x="314" y="268" className="fill-[#CBC3B8] font-mono text-[7px]">
          Wij bewaken de regels en
        </text>
        <text x="314" y="280" className="fill-[#CBC3B8] font-mono text-[7px]">
          bepalen wat sales oppakt.
        </text>
        <path d="M 280 264 L 304 264" stroke="#E8945A" strokeWidth="1" strokeOpacity="0.55" fill="none" />

        {/* Naar de uitkomst */}
        <path
          d={`M ${engineTop.x} ${ENGINE.y + ENGINE.h} L ${engineTop.x} 336`}
          stroke="#E8945A"
          strokeWidth="1"
          strokeOpacity="0.6"
          fill="none"
        />
        <path d={`M ${engineTop.x - 4} 330 L ${engineTop.x} 337 L ${engineTop.x + 4} 330 Z`} className="fill-[#E8945A]" />

        {/* Het account dat eruit komt */}
        <g filter="url(#sd-glow)">
          <rect x="46" y="338" width="388" height="196" rx="2" className="fill-[#1B1712] stroke-[#E8945A]" strokeWidth="1.25" />
        </g>
        <line x1="46" y1="362" x2="434" y2="362" className="stroke-white/[.12]" strokeWidth="1" />
        <text x="240" y="355" textAnchor="middle" className="fill-[#CBC3B8] font-mono text-[7px] font-bold tracking-[0.16em]">
          PRIORITY ACCOUNT
        </text>

        <text x="62" y="386" className="fill-white font-mono text-[8.5px]">
          Van Dijk Logistics · 240 medewerkers
        </text>
        <text x="418" y="386" textAnchor="end" className="fill-[#E8945A] font-mono text-[13px] font-bold">
          94
        </text>

        {BEWIJS.map((regel, i) => {
          const y = 412 + i * 26;
          return (
            <g key={regel}>
              <rect x="62" y={y - 9} width="12" height="12" rx="1.5" className="fill-[#E8945A]/25" />
              <path
                d={`M ${65.5} ${y - 3.5} l 2.4 2.6 l 4.4 -5`}
                fill="none"
                stroke="#E8945A"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text x="84" y={y} className="fill-[#CBC3B8] font-mono text-[8px]">
                {regel}
              </text>
            </g>
          );
        })}

        <line x1="46" y1="496" x2="434" y2="496" className="stroke-white/[.12]" strokeWidth="1" />
        <text x="62" y="516" className="fill-[#8C8378] font-mono text-[7.5px] font-bold tracking-[0.14em]">
          VOLGENDE ACTIE
        </text>
        <rect x="330" y="503" width="88" height="20" rx="2" className="fill-[#E8945A]" />
        <text x="374" y="516" textAnchor="middle" className="fill-[#17140F] font-mono text-[7.5px] font-bold tracking-[0.12em]">
          BEL VANDAAG
        </text>
      </svg>
    </figure>
  );
}
