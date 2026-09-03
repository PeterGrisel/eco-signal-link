// Unit tests voor de social-standaard (templates, tekstmetriek, SVG-opbouw).
// Draaien met: deno test supabase/functions/_shared/social.test.ts
import {
  buildSvg,
  catalog,
  CHANNELS,
  escapeXml,
  fieldsFromParams,
  fitFontSize,
  FORMATS,
  sourceUrl,
  TEMPLATES,
  textWidth,
  wrapText,
} from "./social.ts";

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`Assertion failed: ${msg}`);
}

function assertEquals(actual: unknown, expected: unknown, msg = "") {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) throw new Error(`Expected ${e}, got ${a}. ${msg}`);
}

// ============ tekstmetriek ============

Deno.test("wrapText: breekt af op woordgrens binnen de maximale breedte", () => {
  const lines = wrapText("Een lange regel tekst die moet afbreken", 200, 40);
  assert(lines.length > 1, "moet meerdere regels opleveren");
  for (const line of lines) {
    assert(textWidth(line, 40) <= 200 + 1, `regel te breed: "${line}"`);
  }
  assertEquals(lines.join(" "), "Een lange regel tekst die moet afbreken", "geen woorden verloren");
});

Deno.test("wrapText: splitst een woord dat zelf breder is dan het kader", () => {
  const lines = wrapText("Verantwoordelijkheidsgevoel", 120, 40);
  assert(lines.length > 1, "lang woord moet gesplitst worden");
  assertEquals(lines.join(""), "Verantwoordelijkheidsgevoel", "letters blijven behouden");
});

Deno.test("wrapText: lege invoer geeft geen regels", () => {
  assertEquals(wrapText("", 500, 40), []);
  assertEquals(wrapText("   ", 500, 40), []);
});

Deno.test("fitFontSize: verkleint tot de tekst binnen het aantal regels past", () => {
  const long = "Uw verkopers bellen de accounts die toevallig bovenaan de lijst staan";
  const fitted = fitFontSize(long, { maxWidth: 900, maxLines: 3, max: 104, min: 40 });
  assert(fitted.lines.length <= 3, "mag niet meer dan 3 regels zijn");
  assert(fitted.fontSize <= 104 && fitted.fontSize >= 40, "grootte binnen de grenzen");

  const short = fitFontSize("Kort", { maxWidth: 900, maxLines: 3, max: 104, min: 40 });
  assertEquals(short.fontSize, 104, "korte tekst houdt de maximale grootte");
});

Deno.test("fitFontSize: kapt af op maxLines als zelfs het minimum niet past", () => {
  const fitted = fitFontSize("woord ".repeat(200), { maxWidth: 300, maxLines: 2, max: 60, min: 40 });
  assertEquals(fitted.lines.length, 2, "meer regels dan toegestaan is niet mogelijk");
  assertEquals(fitted.fontSize, 40, "valt terug op het minimum");
});

// ============ escaping ============

Deno.test("escapeXml: maakt tekst veilig voor SVG", () => {
  assertEquals(escapeXml(`5 & 6 <"x">`), "5 &amp; 6 &lt;&quot;x&quot;&gt;");
});

Deno.test("buildSvg: escapet gebruikersinvoer in plaats van markup door te laten", () => {
  const svg = buildSvg({
    template: "statement",
    format: "portrait",
    skin: "dark",
    fields: { headline: `<script>alert("x")</script>` },
  });
  assert(!svg.includes("<script>"), "ruwe markup mag niet in de SVG staan");
  assert(svg.includes("&lt;script&gt;"), "moet ge-escapet zijn");
});

// ============ SVG ============

Deno.test("buildSvg: elk template rendert in elk formaat met de juiste afmetingen", () => {
  for (const template of Object.keys(TEMPLATES)) {
    for (const format of Object.keys(FORMATS)) {
      const svg = buildSvg({
        template,
        format,
        skin: "dark",
        fields: {
          kicker: "Signaalgedreven groei",
          headline: "Uw pipeline lekt bij de overdracht naar sales",
          subline: "Drie signalen die u vandaag al kunt meten.",
          stat: "3×",
          stat_label: "meer opportunities uit dezelfde lijst",
          source_label: "b2bgroeimachine.io/blog",
          steps: ["Signalen verzamelen", "Accounts scoren", "Routeren naar sales"],
          left_label: "Zonder",
          left_items: ["Lijstjes uit een export", "Bellen op onderbuik"],
          right_label: "Met",
          right_items: ["Accounts op intent", "Volgende beste actie"],
        },
      });
      const f = FORMATS[format];
      assert(svg.startsWith("<?xml"), `${template}/${format}: geen XML-declaratie`);
      assert(svg.includes(`width="${f.width}" height="${f.height}"`), `${template}/${format}: verkeerde afmeting`);
      assert(svg.trim().endsWith("</svg>"), `${template}/${format}: niet afgesloten`);
      assert(svg.includes("B2B"), `${template}/${format}: woordmerk ontbreekt`);
    }
  }
});

Deno.test("buildSvg: onbekend template en formaat vallen terug op de standaard", () => {
  const svg = buildSvg({ template: "bestaat-niet", format: "bestaat-niet", skin: "dark", fields: { headline: "Test" } });
  assert(svg.includes(`width="1080" height="1350"`), "moet terugvallen op staand 4:5");
});

Deno.test("buildSvg: de lichte skin gebruikt de papieren achtergrond", () => {
  const light = buildSvg({ template: "statement", format: "square", skin: "light", fields: { headline: "Test" } });
  assert(light.includes("#FFFFFF"), "lichte skin mist het papierwit");
});

// ============ catalogus en bron-URL's ============

Deno.test("catalog: levert de standaardwaarden die het admin-scherm verwacht", () => {
  const c = catalog();
  assertEquals(c.defaults.format, "portrait");
  assertEquals(c.defaults.template, "statement");
  assertEquals(c.defaults.channels, ["linkedin_personal"]);
  assert(c.templates.length === Object.keys(TEMPLATES).length, "alle templates in de catalogus");
  assert(c.channels.length === Object.keys(CHANNELS).length, "alle kanalen in de catalogus");
});

Deno.test("sourceUrl: bouwt een deel-URL met UTM-tagging per kanaal", () => {
  const url = sourceUrl("blog", "pipeline-lek", "linkedin_personal");
  assert(url.startsWith("https://www.b2bgroeimachine.io/blog/pipeline-lek?"), `onverwachte URL: ${url}`);
  assert(url.includes("utm_source=linkedin"), "utm_source ontbreekt");
  assert(url.includes("utm_medium=social"), "utm_medium ontbreekt");
});

Deno.test("sourceUrl: valt terug op de homepage zonder bruikbare bron", () => {
  assertEquals(sourceUrl("custom", "", "x"), "https://www.b2bgroeimachine.io");
});

Deno.test("fieldsFromParams: leest lijsten als pipe-gescheiden waarden", () => {
  const params = new URLSearchParams("headline=Test&steps=Een|Twee|Drie&left_items=A|B");
  const fields = fieldsFromParams(params);
  assertEquals(fields.headline, "Test");
  assertEquals(fields.steps, ["Een", "Twee", "Drie"]);
  assertEquals(fields.left_items, ["A", "B"]);
  assertEquals(fields.right_items, []);
});

/** Onderste getekende y-coördinaat, inclusief een eventuele terugschaling. */
function lowestDrawnY(svg: string): number {
  // De veiligheidsschaling schrijft translate(tx ty) scale(k); y wordt dan y*k + ty.
  const transform = svg.match(/<g transform="translate\([-\d.]+ ([-\d.]+)\) scale\(([\d.]+)\)">/);
  const ty = transform ? Number(transform[1]) : 0;
  const k = transform ? Number(transform[2]) : 1;
  const inGroup = (y: number) => y * k + ty;
  let lowest = 0;

  for (const m of svg.matchAll(/<text[^>]*\sy="([\d.]+)"[^>]*>([\s\S]*?)<\/text>/g)) {
    let y = Number(m[1]);
    for (const d of m[2].matchAll(/dy="([\d.]+)"/g)) y += Number(d[1]);
    lowest = Math.max(lowest, inGroup(y));
  }
  for (const m of svg.matchAll(/<rect[^>]*\sy="([-\d.]+)"[^>]*\sheight="([\d.]+)"/g)) {
    lowest = Math.max(lowest, inGroup(Number(m[1]) + Number(m[2])));
  }
  for (const m of svg.matchAll(/<circle[^>]*\scy="([\d.]+)"[^>]*\sr="([\d.]+)"/g)) {
    lowest = Math.max(lowest, inGroup(Number(m[1]) + Number(m[2])));
  }
  return lowest;
}

Deno.test("buildSvg: ook zeer dichte inhoud blijft binnen het beeld", () => {
  const many = (n: number, word: string) =>
    Array.from({ length: n }, (_, i) => `${word} ${i + 1} met een tamelijk uitvoerige omschrijving erbij`);
  const dense = {
    kicker: "Een tamelijk lange kicker die afbreekt",
    headline: "Een kop die over meerdere regels loopt en veel ruimte vraagt in het beeld van de post",
    subline: "Een onderregel die uit meerdere volle zinnen bestaat. Zodat er echt geen ruimte over is. En dan nog wat.",
    stat: "128.000",
    stat_label: "een label dat ook over meerdere regels loopt en dus veel hoogte kost",
    steps: many(5, "Stap"),
    left_label: "Zonder",
    left_items: many(4, "Punt"),
    right_label: "Met",
    right_items: many(4, "Punt"),
    source_label: "b2bgroeimachine.io/blog/een-tamelijk-lange-slug",
  };

  for (const template of Object.keys(TEMPLATES)) {
    for (const format of Object.keys(FORMATS)) {
      const f = FORMATS[format];
      const svg = buildSvg({ template, format, skin: "dark", fields: dense });
      // De voetregel staat op hoogte - padding; niets mag daaronder terechtkomen.
      const floorY = f.height - Math.round(Math.min(f.width, f.height) * 0.075) + 1;
      const lowest = lowestDrawnY(svg);
      assert(lowest <= floorY, `${template}/${format}: tekent tot ${lowest}, voet ligt op ${floorY}`);
    }
  }
});
