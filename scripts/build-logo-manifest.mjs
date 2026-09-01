/**
 * Bouwt `src/data/groeistackLogos.ts` uit de bestanden in
 * `public/logos/groeistack/`. Draaien na het toevoegen of vervangen van een
 * logo: `npm run logos:manifest`.
 */
import { readdirSync, writeFileSync } from "node:fs";
import { basename, extname } from "node:path";

const MAP = "public/logos/groeistack";
const DOEL = "src/data/groeistackLogos.ts";

const bestanden = readdirSync(MAP)
  .filter((f) => /\.(webp|png|svg|jpe?g)$/i.test(f))
  .sort();
const regels = bestanden
  .map((f) => `  "${basename(f, extname(f))}": "${f}"`)
  .join(",\n");

writeFileSync(
  DOEL,
  `/**
 * Merklogo's voor de Groeistack-directory.
 *
 * Gegenereerd uit de aangeleverde logoset en genormaliseerd naar 96px WebP in
 * \`public/logos/groeistack/\`. De sleutel is de toolnaam zonder leestekens,
 * hoofdletters en TLD-achtervoegsel, zodat "Ocean.io", "Cal.com" en
 * "Predict-Leads" allemaal netjes matchen.
 *
 * Niet met de hand bijwerken: voeg een bestand toe aan de map en draai
 * \`npm run logos:manifest\`.
 */

const BESTANDEN: Record<string, string> = {
${regels},
};

/** Zelfde normalisatie als bij het genereren van de sleutels. */
export function logoSleutel(naam: string): string {
  return naam
    .trim()
    .replace(/-[12]$/, "")
    .replace(/\\.(ai|io|com|app|club|dev|tt|so|co|nl)$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/** Pad naar het lokale merklogo, of null als we het niet hebben. */
export function groeistackLogo(naam: string): string | null {
  const bestand = BESTANDEN[logoSleutel(naam)];
  return bestand ? \`/logos/groeistack/\${bestand}\` : null;
}

export const groeistackLogoAantal = ${bestanden.length};
`,
);
console.log(`${bestanden.length} logos in ${DOEL}`);
