/**
 * Rendert de Open Graph-afbeeldingen naar `public/og/`.
 *
 * Elke social preview is exact 1200x630 (de 1.91:1 die LinkedIn, Facebook,
 * X, Slack en WhatsApp verwachten) en wordt als echte PNG weggeschreven.
 * De opmaak volgt het lichte v2-designsysteem: warm papier als grond, het
 * merkoranje in de accentregel en de onderband, Anton voor de kop en
 * Space Grotesk voor de rest.
 *
 * Draaien na het wijzigen van een kaart of het merklogo:
 *
 *     npm run og
 *
 * De fonts komen van Google Fonts en worden gecachet in
 * `node_modules/.cache/og-fonts/`, dus de eerste run heeft internet nodig.
 */
import { chromium } from "@playwright/test";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const WORTEL = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const UITVOER = resolve(WORTEL, "public/og");
const FONTCACHE = resolve(WORTEL, "node_modules/.cache/og-fonts");
const MERK = resolve(WORTEL, "public/merk/logo-lockup-op-wit.svg");

const BREEDTE = 1200;
const HOOGTE = 630;

/** Huisstijl, gelijk aan de `brand`-tokens in tailwind.config.ts. */
const KLEUR = {
  papier: "#F7F4EF",
  inkt: "#17140F",
  inkt2: "#5A5148",
  accent: "#E8945A",
  accentInkt: "#A85410",
};

/**
 * De kaarten die we renderen.
 *
 * `kop` wordt in tweeën gesplitst: het eerste deel staat in inkt, `kopAccent`
 * in het donkere oranje dat ook op wit genoeg contrast houdt.
 */
const KAARTEN = [
  {
    bestand: "default.png",
    label: "Commerciële opportunity-engine",
    kop: "Van omzetdoel naar",
    kopAccent: "opportunity flow",
    onder:
      "Wij ontwerpen en bouwen het systeem achter uw sales, marketing en RevOps.",
    badge: "90 dagen pilot",
  },
  {
    bestand: "shots.png",
    label: "Market Activation Playbook",
    kop: "Shots ×",
    kopAccent: "B2BGroeiMachine",
    onder:
      "Retailers, wholesalers, distributeurs en e-commerce partners activeren in de internationale B2B adult markt.",
    badge: "Playbook",
  },
];

const FONTS = [
  { naam: "Anton", gewicht: 400, bestand: "anton-400.ttf" },
  { naam: "Space Grotesk", gewicht: 500, bestand: "space-grotesk-500.ttf" },
  { naam: "Space Grotesk", gewicht: 700, bestand: "space-grotesk-700.ttf" },
];

/**
 * Haalt de drie fontbestanden op via de Google Fonts CSS-API en cachet ze.
 * De CSS geeft per @font-face de losse TTF-url; die volgorde is stabiel maar
 * we matchen expliciet op familie en gewicht zodat een wijziging opvalt.
 */
async function zorgVoorFonts() {
  mkdirSync(FONTCACHE, { recursive: true });
  const ontbreekt = FONTS.filter(
    (f) => !existsSync(resolve(FONTCACHE, f.bestand)),
  );
  if (ontbreekt.length === 0) return;

  const css = await (
    await fetch(
      "https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@500;700&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0" } },
    )
  ).text();

  const blokken = css.split("@font-face").slice(1);
  for (const font of ontbreekt) {
    const blok = blokken.find(
      (b) =>
        b.includes(`font-family: '${font.naam}'`) &&
        b.includes(`font-weight: ${font.gewicht}`),
    );
    const url = blok?.match(/url\((https:\/\/[^)]+\.ttf)\)/)?.[1];
    if (!url) {
      throw new Error(
        `Geen TTF gevonden voor ${font.naam} ${font.gewicht} in de Google Fonts CSS`,
      );
    }
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    writeFileSync(resolve(FONTCACHE, font.bestand), buf);
    console.log(`font opgehaald: ${font.bestand} (${buf.length} bytes)`);
  }
}

const alsDataUrl = (pad, mime) =>
  `data:${mime};base64,${readFileSync(pad).toString("base64")}`;

/** De kaart als losse pagina. Het merk komt als SVG binnen, dus scherp op elk formaat. */
function pagina(kaart, fontCss, merk) {
  return `<!doctype html>
<html lang="nl"><head><meta charset="utf-8"><style>
${fontCss}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${BREEDTE}px;height:${HOOGTE}px;overflow:hidden}
.kaart{position:relative;width:${BREEDTE}px;height:${HOOGTE}px;overflow:hidden;
  display:flex;flex-direction:column;justify-content:space-between;
  padding:56px 72px 60px;background:${KLEUR.papier}}
.gloed{position:absolute;right:-180px;top:-200px;width:680px;height:680px;border-radius:50%;
  background:radial-gradient(circle,rgba(232,148,90,.26) 0%,rgba(232,148,90,0) 68%)}
.band{position:absolute;left:0;right:0;bottom:0;height:14px;background:${KLEUR.accent}}
.boven,.midden,.onder{position:relative;z-index:2}
.merk{height:46px;width:auto;display:block}
.label{font-family:'Space Grotesk';font-weight:700;font-size:15px;letter-spacing:.22em;
  text-transform:uppercase;color:${KLEUR.accentInkt};margin-bottom:20px}
h1{font-family:Anton;font-size:80px;line-height:1;color:${KLEUR.inkt};max-width:17ch}
h1 span{color:${KLEUR.accentInkt}}
.tekst{font-family:'Space Grotesk';font-weight:500;font-size:22px;line-height:1.42;
  color:${KLEUR.inkt2};margin-top:22px;max-width:52ch}
.onder{display:flex;align-items:flex-end;justify-content:space-between;padding-bottom:10px}
.streep{width:96px;height:5px;background:${KLEUR.accent};margin-bottom:16px}
.url{font-family:'Space Grotesk';font-weight:700;font-size:20px;color:${KLEUR.inkt}}
.badge{font-family:'Space Grotesk';font-weight:700;font-size:15px;letter-spacing:.14em;
  text-transform:uppercase;color:${KLEUR.papier};background:${KLEUR.inkt};
  padding:11px 20px;border-radius:999px}
</style></head><body>
<div class="kaart">
  <div class="gloed"></div><div class="band"></div>
  <div class="boven"><img class="merk" src="${merk}" alt=""></div>
  <div class="midden">
    <div class="label">${kaart.label}</div>
    <h1>${kaart.kop} <span>${kaart.kopAccent}</span></h1>
    <p class="tekst">${kaart.onder}</p>
  </div>
  <div class="onder">
    <div><div class="streep"></div><div class="url">b2bgroeimachine.io</div></div>
    <div class="badge">${kaart.badge}</div>
  </div>
</div>
</body></html>`;
}

async function main() {
  await zorgVoorFonts();

  const fontCss = FONTS.map(
    (f) =>
      `@font-face{font-family:'${f.naam}';font-weight:${f.gewicht};font-style:normal;` +
      `src:url(${alsDataUrl(resolve(FONTCACHE, f.bestand), "font/ttf")}) format('truetype')}`,
  ).join("\n");
  const merkUrl = alsDataUrl(MERK, "image/svg+xml");

  mkdirSync(UITVOER, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: BREEDTE, height: HOOGTE },
    deviceScaleFactor: 1,
  });

  for (const kaart of KAARTEN) {
    await page.setContent(pagina(kaart, fontCss, merkUrl), {
      waitUntil: "load",
    });
    await page.evaluate(() => document.fonts.ready);
    const doel = resolve(UITVOER, kaart.bestand);
    await page.screenshot({ path: doel, type: "png" });
    console.log(`geschreven: public/og/${kaart.bestand} (${BREEDTE}x${HOOGTE})`);
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
