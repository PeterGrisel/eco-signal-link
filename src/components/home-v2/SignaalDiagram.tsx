import { fase } from "@/hooks/useScrollProgress";

/**
 * De hero-visual: het systeem in één beeld.
 *
 * Signalen uit losse bronnen komen samen in de engine, die er één account met
 * een reden en een aanbevolen actie uit laat vallen. Volledig in SVG getekend
 * zodat de verhoudingen kloppen op elk formaat; de leesbare beschrijving staat
 * in de <title> voor schermlezers.
 *
 * `progress` (0 tot 1) laat het diagram zichzelf opbouwen tijdens het scrollen:
 * eerst de bronnen, dan tekenen de lijnen zich naar de engine, dan landt het
 * account. Zonder de prop staat alles meteen compleet, dus de sectie blijft
 * bruikbaar buiten de scroll-hero.
 *
 * De gloed rond de engine en het account is óók scroll-gestuurd. Die zit in een
 * apart, vooraf vervaagd laagje waarvan alleen de dekking meebeweegt: een SVG
 * filter opnieuw laten rekenen bij elke scrollstap is duur, alleen opacity
 * animeren niet.
 */

interface Bron {
  /** Het signaaltype, boven de tegel. */
  label: string;
  /** Naam van de tool, voor schermlezers en de <title>. */
  tool: string;
  /** Pad naar het merklogo onder /public. */
  logo: string;
  x: number;
}

const BRONNEN: Bron[] = [
  { label: "FUNDING", tool: "PredictLeads", logo: "/logos/groeistack/predictleads.webp", x: 12 },
  { label: "VACATURES", tool: "TheirStack", logo: "/logos/groeistack/theirstack.webp", x: 105 },
  { label: "WEBSITE", tool: "RB2B", logo: "/logos/groeistack/rb2b.webp", x: 198 },
  { label: "TECHSTACK", tool: "BuiltWith", logo: "/logos/groeistack/builtwith.webp", x: 291 },
  { label: "CRM", tool: "HubSpot", logo: "/logos/groeistack/hubspot.webp", x: 384 },
];

const BEWIJS = [
  "Nieuwe vestiging aangekondigd",
  "Drie operationele vacatures",
  "Prijzenpagina 3× bezocht",
];

const TILE_W = 84;
const TILE_H = 52;
const TILE_Y = 26;
/**
 * De merklogo's zijn app-iconen met sterk uiteenlopende achtergronden: sommige
 * transparant, sommige een vol gekleurd vlak, sommige wit. Eén licht chipje per
 * icoon trekt dat gelijk, zodat de rij rustig blijft en de tegel zelf donker
 * kan meelopen met de rest van het diagram.
 */
const CHIP = 26;
const LOGO = 20;
const ENGINE = { x: 200, y: 232, w: 80, h: 62 };

export function SignaalDiagram({ progress = 1 }: { progress?: number }) {
  const engineTop = { x: ENGINE.x + ENGINE.w / 2, y: ENGINE.y };

  // Vier fasen die elkaar licht overlappen, zodat de opbouw vloeiend leest.
  const pBronnen = fase(progress, 0, 0.3);
  const pLijnen = fase(progress, 0.22, 0.58);
  const pEngine = fase(progress, 0.45, 0.68);
  const pAccount = fase(progress, 0.62, 1);

  return (
    <figure className="m-0">
      {/* Hoogte leidt, zodat het diagram altijd in de sticky viewport past. */}
      <svg
        viewBox="0 0 480 556"
        className="mx-auto block h-[min(64svh,520px)] w-auto max-w-full"
        role="img"
        aria-labelledby="signaaldiagram-titel"
      >
        <title id="signaaldiagram-titel">
          Signalen uit funding (PredictLeads), vacatures (TheirStack), website
          (RB2B), techstack (BuiltWith) en CRM (HubSpot) komen samen in de
          opportunity-engine, die met Claude redeneert. Die levert één account
          op, Van Dijk Logistics, met een score van 94, drie bewijsregels en de
          aanbevolen actie om vandaag te bellen.
        </title>

        <defs>
          <linearGradient id="sd-lijn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8945A" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#E8945A" stopOpacity="0.75" />
          </linearGradient>
          <radialGradient id="sd-bloom">
            <stop offset="0%" stopColor="#E8945A" stopOpacity="0.5" />
            <stop offset="55%" stopColor="#E8945A" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#E8945A" stopOpacity="0" />
          </radialGradient>
          <filter id="sd-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        {/* Zachte bloom achter de engine, groeit mee met het scrollen. */}
        <ellipse
          cx={engineTop.x}
          cy={ENGINE.y + ENGINE.h / 2}
          rx={110 + pEngine * 60}
          ry={80 + pEngine * 44}
          fill="url(#sd-bloom)"
          opacity={pEngine * 0.75}
        />

        {/* Bronnen: signaaltype, pictogram en de tool die het aanlevert. */}
        {BRONNEN.map((bron, i) => {
          const zichtbaar = fase(pBronnen, i * 0.11, i * 0.11 + 0.5);
          return (
            <g
              key={bron.label}
              style={{
                opacity: zichtbaar,
                transform: `translateY(${(1 - zichtbaar) * -10}px)`,
              }}
            >
              <text
                x={bron.x + TILE_W / 2}
                y={TILE_Y - 8}
                textAnchor="middle"
                className="fill-[#8C8378] font-mono text-[6.5px] font-bold tracking-[0.12em]"
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
                x={bron.x + (TILE_W - CHIP) / 2}
                y={TILE_Y + 6}
                width={CHIP}
                height={CHIP}
                rx="3"
                className="fill-brand-mist"
              />
              <image
                href={bron.logo}
                x={bron.x + (TILE_W - LOGO) / 2}
                y={TILE_Y + 6 + (CHIP - LOGO) / 2}
                width={LOGO}
                height={LOGO}
                preserveAspectRatio="xMidYMid meet"
              />
              <text
                x={bron.x + TILE_W / 2}
                y={TILE_Y + TILE_H - 7}
                textAnchor="middle"
                className="fill-[#CBC3B8] font-mono text-[6.5px]"
              >
                {bron.tool}
              </text>
            </g>
          );
        })}

        {/* De bundel: elke bron buigt naar de engine toe */}
        {BRONNEN.map((bron, i) => {
          const x1 = bron.x + TILE_W / 2;
          const y1 = TILE_Y + TILE_H;
          return (
            <path
              key={`lijn-${bron.label}`}
              d={`M ${x1} ${y1} C ${x1} ${y1 + 70}, ${engineTop.x} ${engineTop.y - 74}, ${engineTop.x} ${engineTop.y}`}
              fill="none"
              stroke="url(#sd-lijn)"
              strokeWidth="1"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - fase(pLijnen, i * 0.08, i * 0.08 + 0.62)}
            />
          );
        })}

        {/* De engine */}
        <g style={{ opacity: pEngine }}>
          {/* Vooraf vervaagde kopie: alleen de dekking beweegt mee. */}
          <rect
            x={ENGINE.x}
            y={ENGINE.y}
            width={ENGINE.w}
            height={ENGINE.h}
            rx="2"
            fill="none"
            stroke="#E8945A"
            strokeWidth="2.5"
            filter="url(#sd-glow)"
            opacity={0.25 + pEngine * 0.75}
          />
          <rect
            x={ENGINE.x}
            y={ENGINE.y}
            width={ENGINE.w}
            height={ENGINE.h}
            rx="2"
            className="fill-[#1D1913] stroke-[#E8945A]"
            strokeWidth="1.25"
          />
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
        </g>

        {/* De redeneerlaag, als tegenhanger van het menselijk oordeel rechts */}
        <g style={{ opacity: fase(progress, 0.5, 0.7) }}>
          <text x="184" y="243" textAnchor="end" className="fill-[#8C8378] font-mono text-[6.5px] font-bold tracking-[0.14em]">
            REDENEERT MET
          </text>
          <rect x="88" y="250" width="96" height="26" rx="2" className="fill-brand-mist" />
          <image
            href="/logos/groeistack/claude.webp"
            x="97"
            y="255"
            width="16"
            height="16"
            preserveAspectRatio="xMidYMid meet"
          />
          <text x="119" y="266" className="fill-brand-ink font-mono text-[8px] font-bold">
            Claude
          </text>
          <path d="M 184 263 L 200 263" stroke="#E8945A" strokeWidth="1" strokeOpacity="0.55" fill="none" />
        </g>

        {/* Zijkaart: het menselijk oordeel blijft in de lus */}
        <g style={{ opacity: fase(progress, 0.55, 0.75) }}>
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
        </g>

        {/* Naar de uitkomst */}
        <g style={{ opacity: pAccount, transform: `translateY(${(1 - pAccount) * 16}px)` }}>
          <path
            d={`M ${engineTop.x} ${ENGINE.y + ENGINE.h} L ${engineTop.x} 336`}
            stroke="#E8945A"
            strokeWidth="1"
            strokeOpacity="0.6"
            fill="none"
          />
          <path d={`M ${engineTop.x - 4} 330 L ${engineTop.x} 337 L ${engineTop.x + 4} 330 Z`} className="fill-[#E8945A]" />

          {/* Het account dat eruit komt */}
          <rect
            x="46"
            y="338"
            width="388"
            height="196"
            rx="2"
            fill="none"
            stroke="#E8945A"
            strokeWidth="2.5"
            filter="url(#sd-glow)"
            opacity={0.2 + pAccount * 0.8}
          />
          <rect x="46" y="338" width="388" height="196" rx="2" className="fill-[#1B1712] stroke-[#E8945A]" strokeWidth="1.25" />
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
        </g>
      </svg>
    </figure>
  );
}
