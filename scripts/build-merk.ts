/**
 * Schrijft de losse merkbestanden naar `public/merk/` en `public/favicon.svg`.
 *
 * Rekent met dezelfde module als de React-component, zodat de bestanden voor
 * extern gebruik niet uit de pas kunnen lopen met het logo in de site. Draaien
 * na elke wijziging in `src/lib/merk.ts`:
 *
 *     npm run merk
 *
 * De favicon.ico en de apple-touch-icon zijn bitmaps en worden hier niet
 * gemaakt; die staan los in `public/` en hoeven alleen bij een vormwijziging
 * opnieuw geëxporteerd te worden.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BLOK,
  BLOK_VOL,
  LETTER,
  LETTER_PLAATSING,
  TONEN,
  WOORD,
  WOORD_VAK,
  KAPITAALHOOGTE,
  TUSSENRUIMTE,
  lockupMaten,
} from "../src/lib/merk";

const WORTEL = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const UITVOER = resolve(WORTEL, "public/merk");

const KOP =
  "<!-- B2B GroeiMachine. Beeldmerk en woordmerk zijn vectorvormen, geen lettertype. " +
  "Gegenereerd met `npm run merk` uit src/lib/merk.ts. -->";

type Kleuren = { vlak: string; letter: string; woord: string; accent: string };

const beeldmerk = (k: Pick<Kleuren, "vlak" | "letter">, aflopend = false) =>
  `<path d="${aflopend ? BLOK_VOL : BLOK}" fill="${k.vlak}"/>` +
  `<g transform="${LETTER_PLAATSING}"><path fill="${k.letter}" fill-rule="evenodd" d="${LETTER}"/></g>`;

const woordmerk = (k: Pick<Kleuren, "woord" | "accent">, x: number, y: number, s: number) =>
  `<g transform="translate(${x.toFixed(2)},${y.toFixed(2)}) scale(${s.toFixed(4)})">` +
  `<path fill="${k.woord}" d="${WOORD.b2b}"/>` +
  `<path fill="${k.accent}" d="${WOORD.groei}"/>` +
  `<path fill="${k.woord}" d="${WOORD.machine}"/></g>`;

function schrijf(naam: string, viewBox: string, inhoud: string, hoogte: number) {
  const [, , vb, vh] = viewBox.split(" ").map(Number);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" ` +
    `width="${Math.round((hoogte * vb) / vh)}" height="${hoogte}" ` +
    `role="img" aria-label="B2B GroeiMachine">\n${KOP}\n  ${inhoud}\n</svg>\n`;
  writeFileSync(resolve(UITVOER, naam), svg);
  console.log(`geschreven: public/merk/${naam}`);
  return svg;
}

mkdirSync(UITVOER, { recursive: true });

// Beeldmerk los.
schrijf("logo-merk.svg", "0 0 100 100", beeldmerk(TONEN.donker), 512);
schrijf("logo-merk-op-wit.svg", "0 0 100 100", beeldmerk(TONEN.licht), 512);
// Eén kleur, voor stempel, borduur en druk waar geen tweede kleur in zit. Het
// vlak en de B zitten in één pad met evenodd, zodat de letter een gat is in
// plaats van een tweede kleur. Het vlak staat hier vooraf tegengesteld
// vervormd, zodat het na de skew van de groep weer op BLOK uitkomt.
const BLOK_VOOR_SKEW = "M18.85,8 L86.85,8 L86.24,92 L18.24,92 Z";
schrijf(
  "logo-merk-mono.svg",
  "0 0 100 100",
  `<g transform="${LETTER_PLAATSING}"><path fill="#17140F" fill-rule="evenodd" ` +
    `d="${BLOK_VOOR_SKEW} ${LETTER}"/></g>`,
  512,
);

// Favicon: het vlak loopt tot buiten het kader, anders valt het merk weg.
const favicon = schrijf("favicon.svg", "0 0 100 100", beeldmerk(TONEN.donker, true), 512);
writeFileSync(resolve(WORTEL, "public/favicon.svg"), favicon);
console.log("geschreven: public/favicon.svg");

// Lockups.
const m = lockupMaten();
const vbLock = `0 0 ${m.breedte.toFixed(1)} 100`;
schrijf("logo-lockup.svg", vbLock, beeldmerk(TONEN.donker) + woordmerk(TONEN.donker, m.x, m.y, m.schaal), 128);
schrijf("logo-lockup-op-wit.svg", vbLock, beeldmerk(TONEN.licht) + woordmerk(TONEN.licht, m.x, m.y, m.schaal), 128);

// Gestapeld: het woordmerk bepaalt de breedte, het blok staat er gecentreerd boven.
const BREED = 240;
const s2 = BREED / (WOORD_VAK.x1 - WOORD_VAK.x0);
const kapH = (WOORD_VAK.y1 - WOORD_VAK.y0) * s2;
const gat = 22;
const vbStapel = `0 0 ${BREED} ${(100 + gat + kapH).toFixed(1)}`;
for (const [naam, toon] of [["logo-gestapeld.svg", TONEN.donker], ["logo-gestapeld-op-wit.svg", TONEN.licht]] as const) {
  schrijf(
    naam,
    vbStapel,
    `<g transform="translate(${(BREED - 100) / 2},0)">${beeldmerk(toon)}</g>` +
      woordmerk(toon, -WOORD_VAK.x0 * s2, 100 + gat - WOORD_VAK.y0 * s2 - kapH, s2),
    200,
  );
}

console.log(`\nlockup: ${m.breedte.toFixed(1)} bij 100, kapitalen ${KAPITAALHOOGTE}, tussenruimte ${TUSSENRUIMTE}`);
