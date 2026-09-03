/**
 * Het merk van B2B GroeiMachine als React-component.
 *
 * De vormen en verhoudingen staan in `@/lib/merk`; dat is de enige bron, zodat
 * dit logo en de losse bestanden in `public/merk/` gelijk blijven. Alles is
 * pad, dus het merk hangt nergens van een geïnstalleerd lettertype af.
 */
import {
  BLOK,
  BLOK_VOL,
  LETTER,
  LETTER_PLAATSING,
  TONEN,
  WOORD,
  lockupMaten,
  type Toon,
} from "@/lib/merk";

/**
 * Alleen het beeldmerk.
 *
 * `aflopend` laat het vlak tot buiten het kader lopen; gebruik dat zodra het
 * merk onder de veertig pixels komt, anders verdwijnt het in zijn eigen
 * witruimte.
 */
export function Merk({
  toon = "donker",
  aflopend = false,
  className,
}: {
  toon?: Toon;
  aflopend?: boolean;
  className?: string;
}) {
  const k = TONEN[toon];
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="B2B GroeiMachine">
      <path d={aflopend ? BLOK_VOL : BLOK} fill={k.vlak} />
      <g transform={LETTER_PLAATSING}>
        <path d={LETTER} fill={k.letter} fillRule="evenodd" />
      </g>
    </svg>
  );
}

/**
 * Het beeldmerk met de naam ernaast. De hoogte volgt uit de `className`; op
 * 22 pixels hoog zijn de kapitalen 16, wat in een navigatiebalk prettig leest.
 */
export function Logo({ toon = "donker", className }: { toon?: Toon; className?: string }) {
  const k = TONEN[toon];
  const m = lockupMaten();
  return (
    <svg
      viewBox={`0 0 ${m.breedte.toFixed(1)} 100`}
      className={className}
      role="img"
      aria-label="B2B GroeiMachine"
    >
      <path d={BLOK} fill={k.vlak} />
      <g transform={LETTER_PLAATSING}>
        <path d={LETTER} fill={k.letter} fillRule="evenodd" />
      </g>
      <g transform={`translate(${m.x.toFixed(2)},${m.y.toFixed(2)}) scale(${m.schaal.toFixed(4)})`}>
        <path d={WOORD.b2b} fill={k.woord} />
        <path d={WOORD.groei} fill={k.accent} />
        <path d={WOORD.machine} fill={k.woord} />
      </g>
    </svg>
  );
}
