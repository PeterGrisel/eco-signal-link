// De B2BGroeiMachine social-standaard: één bron van waarheid voor de
// visual-templates, de beeldformaten en de kanaalregels van de post-generator.
//
// Gebruikt door:
// - `social-image`   — rendert deze templates als SVG en daarna als PNG
// - `social-generate` — voedt de kanaalregels en het veldschema aan het model
// - `/admin/social`   — haalt de catalogus op via `social-image?catalog=1`
//
// Alles hier is puur (geen Deno-, netwerk- of DB-afhankelijkheden) zodat het
// met `deno test supabase/functions/_shared/social.test.ts` te testen is.

// ─────────────────────────────────────────────────────────────────────────────
// Merk-tokens (spiegelt tailwind.config.ts → theme.extend.colors.brand)
// ─────────────────────────────────────────────────────────────────────────────

export const BRAND = {
  paper: "#FFFFFF",
  mist: "#F7F4EF",
  tint: "#FDF1E8",
  line: "#E5DFD5",
  ink: "#17140F",
  ink2: "#5A5148",
  ink3: "#8C8378",
  deep: "#17140F",
  deep2: "#231F19",
  accent: "#E8945A",
  accent2: "#F0A972",
  accentInk: "#A85410",
  site: "b2bgroeimachine.io",
  wordmarkA: "B2B",
  wordmarkB: "Groeimachine",
} as const;

/** Twee skins: donker valt op in de tijdlijn, licht sluit aan op de site. */
export type Skin = "dark" | "light";

export interface Palette {
  bg: string;
  bgTo: string;
  text: string;
  textSoft: string;
  textFaint: string;
  accent: string;
  accentSoft: string;
  rule: string;
  glowOpacity: number;
}

export function palette(skin: Skin): Palette {
  return skin === "light"
    ? {
        bg: BRAND.paper,
        bgTo: BRAND.tint,
        text: BRAND.ink,
        textSoft: BRAND.ink2,
        textFaint: BRAND.ink3,
        accent: BRAND.accentInk,
        accentSoft: BRAND.accent,
        rule: BRAND.line,
        glowOpacity: 0.20,
      }
    : {
        bg: BRAND.deep,
        bgTo: BRAND.deep2,
        text: BRAND.mist,
        textSoft: "#C9C0B4",
        textFaint: "#8C8378",
        accent: BRAND.accent,
        accentSoft: BRAND.accent2,
        rule: "#332C24",
        glowOpacity: 0.26,
      };
}

// ─────────────────────────────────────────────────────────────────────────────
// Beeldformaten
// ─────────────────────────────────────────────────────────────────────────────

export interface FormatSpec {
  slug: string;
  label: string;
  width: number;
  height: number;
  note: string;
}

export const FORMATS: Record<string, FormatSpec> = {
  portrait: {
    slug: "portrait",
    label: "Staand 4:5",
    width: 1080,
    height: 1350,
    note: "Standaard voor LinkedIn en Instagram feed; pakt de meeste hoogte in de tijdlijn.",
  },
  square: {
    slug: "square",
    label: "Vierkant 1:1",
    width: 1080,
    height: 1080,
    note: "Veilige keuze voor alle kanalen tegelijk, ook Facebook en X.",
  },
  landscape: {
    slug: "landscape",
    label: "Liggend 1.91:1",
    width: 1200,
    height: 630,
    note: "Link-preview en Open Graph; zelfde maat als de og-image.",
  },
  story: {
    slug: "story",
    label: "Story 9:16",
    width: 1080,
    height: 1920,
    note: "Instagram- en LinkedIn-stories.",
  },
};

export const DEFAULT_FORMAT = "portrait";

// ─────────────────────────────────────────────────────────────────────────────
// Visual-templates
// ─────────────────────────────────────────────────────────────────────────────

export interface TemplateSpec {
  slug: string;
  label: string;
  description: string;
  /** Velden die `social-generate` moet invullen, in volgorde van belang. */
  fields: string[];
  /** Wanneer het model dit template moet kiezen. */
  useWhen: string;
}

export const TEMPLATES: Record<string, TemplateSpec> = {
  statement: {
    slug: "statement",
    label: "Statement",
    description: "Eén scherpe uitspraak groot in beeld, met kicker en onderregel.",
    fields: ["kicker", "headline", "subline"],
    useWhen: "De post draait om één stelling, inzicht of ongemakkelijke waarheid.",
  },
  stat: {
    slug: "stat",
    label: "Cijfer",
    description: "Eén groot getal met label en bronvermelding.",
    fields: ["kicker", "stat", "stat_label", "subline", "source_label"],
    useWhen: "Er is één hard cijfer dat de hele post draagt.",
  },
  steps: {
    slug: "steps",
    label: "Stappen",
    description: "Genummerde lijst van drie tot vijf stappen onder een kop.",
    fields: ["kicker", "headline", "steps"],
    useWhen: "De post legt een aanpak, framework of volgorde uit.",
  },
  compare: {
    slug: "compare",
    label: "Zonder / Met",
    description: "Twee kolommen die de oude en de nieuwe situatie tegenover elkaar zetten.",
    fields: ["kicker", "headline", "left_label", "left_items", "right_label", "right_items"],
    useWhen: "De post zet een oude werkwijze tegenover een nieuwe.",
  },
  teaser: {
    slug: "teaser",
    label: "Bron-teaser",
    description: "Verwijzing naar een blog, playbook of give-away met drie opsommingen.",
    fields: ["kicker", "headline", "steps", "source_label"],
    useWhen: "De post stuurt door naar een artikel of resource op de site.",
  },
};

export const DEFAULT_TEMPLATE = "statement";

// ─────────────────────────────────────────────────────────────────────────────
// Kanalen
// ─────────────────────────────────────────────────────────────────────────────

export interface ChannelSpec {
  slug: string;
  label: string;
  /** Stem waarin de post geschreven wordt. */
  voice: "peter" | "brand";
  maxChars: number;
  hashtags: [number, number];
  defaultFormat: string;
  /** Instructie die letterlijk in de prompt belandt. */
  rules: string;
}

export const CHANNELS: Record<string, ChannelSpec> = {
  linkedin_personal: {
    slug: "linkedin_personal",
    label: "LinkedIn — Peter Grisel",
    voice: "peter",
    maxChars: 1300,
    hashtags: [0, 3],
    defaultFormat: "portrait",
    rules: [
      "Ik-vorm, Peter schrijft zelf. Direct, concreet, geen marketingtaal.",
      "Open met een haak van maximaal twee regels die op zichzelf staat; die regel is wat mensen zien voor 'meer weergeven'.",
      "Daarna witregels tussen korte alinea's van één tot drie zinnen.",
      "Eén observatie uitwerken, niet drie. Noem een concreet voorbeeld of getal.",
      "Sluit af met een vraag of een lage-drempel-uitnodiging, niet met een verkooppitch.",
      "Links horen in de eerste reactie, niet in de post: zet de URL in het veld cta_url.",
    ].join(" "),
  },
  linkedin_company: {
    slug: "linkedin_company",
    label: "LinkedIn — B2BGroeiMachine",
    voice: "brand",
    maxChars: 1300,
    hashtags: [2, 4],
    defaultFormat: "portrait",
    rules: [
      "Wij-vorm namens B2BGroeiMachine, u-vorm richting de lezer.",
      "Zakelijker dan de persoonlijke variant, maar even concreet: wat levert het de lezer op.",
      "Open met de belofte of het probleem, niet met het bedrijf.",
      "Maximaal vier korte alinea's, afsluiten met één duidelijke CTA.",
    ].join(" "),
  },
  instagram: {
    slug: "instagram",
    label: "Instagram",
    voice: "brand",
    maxChars: 900,
    hashtags: [5, 8],
    defaultFormat: "square",
    rules: [
      "Visual-first: de tekst ondersteunt het beeld en herhaalt het niet letterlijk.",
      "Korte zinnen, mag informeler. Geen klikbare links, dus verwijs naar de bio.",
    ].join(" "),
  },
  facebook: {
    slug: "facebook",
    label: "Facebook",
    voice: "brand",
    maxChars: 900,
    hashtags: [0, 2],
    defaultFormat: "square",
    rules: [
      "Toegankelijker en iets losser dan LinkedIn, maar zakelijk correct.",
      "Link mag in de post zelf staan.",
    ].join(" "),
  },
  x: {
    slug: "x",
    label: "X",
    voice: "peter",
    maxChars: 270,
    hashtags: [0, 2],
    defaultFormat: "square",
    rules: [
      "Maximaal 270 tekens, één gedachte, geen opsomming.",
      "Geen aanhef en geen afsluiting; de eerste zin is meteen het punt.",
    ].join(" "),
  },
};

export const DEFAULT_CHANNELS = ["linkedin_personal"];

// ─────────────────────────────────────────────────────────────────────────────
// Bronnen op de site
// ─────────────────────────────────────────────────────────────────────────────

export interface SourceSpec {
  slug: string;
  label: string;
  table: string;
  titleColumn: string;
  bodyColumn: string;
  /** Pad op de site, `:slug` wordt vervangen. */
  path: string;
  /** Extra kolommen die mee moeten in de context. */
  extraColumns: string[];
  statusFilter?: { column: string; value: string };
}

export const SOURCES: Record<string, SourceSpec> = {
  blog: {
    slug: "blog",
    label: "Blog",
    table: "blog_posts",
    titleColumn: "title",
    bodyColumn: "content",
    path: "/blog/:slug",
    extraColumns: ["excerpt", "meta_description"],
    statusFilter: { column: "status", value: "published" },
  },
  playbook: {
    slug: "playbook",
    label: "Playbook",
    table: "playbooks",
    titleColumn: "title",
    bodyColumn: "content",
    path: "/playbooks/:slug",
    extraColumns: ["excerpt", "service_line", "audience"],
    statusFilter: { column: "status", value: "published" },
  },
  glossary: {
    slug: "glossary",
    label: "Woordenboek",
    table: "glossary_terms",
    titleColumn: "term",
    bodyColumn: "content",
    path: "/woordenboek/:slug",
    extraColumns: ["short_def", "category"],
    statusFilter: { column: "status", value: "published" },
  },
  giveaway: {
    slug: "giveaway",
    label: "Give-away",
    table: "content_bucket_items",
    titleColumn: "title",
    bodyColumn: "intro",
    path: "/give-aways/:slug",
    extraColumns: ["subtitle", "type_label", "category"],
    statusFilter: { column: "status", value: "published" },
  },
  custom: {
    slug: "custom",
    label: "Vrij onderwerp",
    table: "",
    titleColumn: "",
    bodyColumn: "",
    path: "",
    extraColumns: [],
  },
};

export const SITE_URL = "https://www.b2bgroeimachine.io";

/** Bouwt de deel-URL van een bron, inclusief UTM-tagging per kanaal. */
export function sourceUrl(sourceType: string, slug: string, channel?: string): string {
  const spec = SOURCES[sourceType];
  if (!spec || !spec.path || !slug) return SITE_URL;
  const url = new URL(SITE_URL + spec.path.replace(":slug", slug));
  url.searchParams.set("utm_source", channel === "x" ? "x" : (channel ?? "social").split("_")[0]);
  url.searchParams.set("utm_medium", "social");
  url.searchParams.set("utm_campaign", "post-generator");
  return url.toString();
}

// ─────────────────────────────────────────────────────────────────────────────
// Tekstmetriek: genoeg om SVG-tekst betrouwbaar te laten passen
// ─────────────────────────────────────────────────────────────────────────────

const NARROW = new Set("ijltfrI.,:;!|'\"()[]-· ".split(""));
const WIDE = new Set("mwMW@%—".split(""));

/** Breedte van één teken in em, ruw maar consequent aan de veilige kant. */
export function charWidth(ch: string, bold = false): number {
  const base = NARROW.has(ch)
    ? ch === " "
      ? 0.28
      : 0.32
    : WIDE.has(ch)
      ? 0.88
      : ch >= "A" && ch <= "Z"
        ? 0.68
        : ch >= "0" && ch <= "9"
          ? 0.58
          : 0.54;
  return bold ? base * 1.04 : base;
}

/** Geschatte breedte van een regel in pixels. */
export function textWidth(text: string, fontSize: number, bold = false): number {
  let em = 0;
  for (const ch of text) em += charWidth(ch, bold);
  return em * fontSize;
}

/** Breekt tekst af op woordgrens binnen `maxWidth`; lange woorden worden gesplitst. */
export function wrapText(text: string, maxWidth: number, fontSize: number, bold = false): string[] {
  const words = String(text ?? "").split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (textWidth(candidate, fontSize, bold) <= maxWidth || !current) {
      if (textWidth(candidate, fontSize, bold) > maxWidth && !current) {
        // Eén woord dat zelf te breed is: hard afbreken.
        let chunk = "";
        for (const ch of word) {
          if (textWidth(chunk + ch, fontSize, bold) > maxWidth && chunk) {
            lines.push(chunk);
            chunk = ch;
          } else {
            chunk += ch;
          }
        }
        current = chunk;
        continue;
      }
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Zoekt de grootste lettergrootte waarbij de tekst binnen het kader past. */
export function fitFontSize(
  text: string,
  opts: { maxWidth: number; maxLines: number; max: number; min: number; bold?: boolean; step?: number },
): { fontSize: number; lines: string[] } {
  const step = opts.step ?? 4;
  for (let size = opts.max; size >= opts.min; size -= step) {
    const lines = wrapText(text, opts.maxWidth, size, opts.bold);
    if (lines.length <= opts.maxLines) return { fontSize: size, lines };
  }
  const lines = wrapText(text, opts.maxWidth, opts.min, opts.bold).slice(0, opts.maxLines);
  return { fontSize: opts.min, lines };
}

export function escapeXml(s: string): string {
  return String(s ?? "").replace(
    /[<>&'"]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG-opbouw
// ─────────────────────────────────────────────────────────────────────────────

export interface VisualFields {
  kicker?: string;
  headline?: string;
  subline?: string;
  stat?: string;
  stat_label?: string;
  source_label?: string;
  steps?: string[];
  left_label?: string;
  left_items?: string[];
  right_label?: string;
  right_items?: string[];
}

export interface RenderOptions {
  template: string;
  format: string;
  skin: Skin;
  fields: VisualFields;
}

const DISPLAY = "Space Grotesk, Inter, sans-serif";
const BODY = "Inter, sans-serif";

interface Layout {
  w: number;
  h: number;
  pad: number;
  contentW: number;
  /** Bovenkant van het tekstvlak. */
  top: number;
  /** Onderkant van het tekstvlak, net boven de scheidingslijn van de voet. */
  bottom: number;
  /** Y van de scheidingslijn boven de voetregel. */
  ruleY: number;
  /** Basislijn van de voetregel. */
  footerY: number;
  /** Typografische schaal; volgt de krapste as, zodat liggend niet overloopt. */
  scale: number;
}

function layout(format: string): Layout {
  const f = FORMATS[format] ?? FORMATS[DEFAULT_FORMAT];
  const scale = Math.min(f.width / 1080, f.height / 1350);
  const pad = Math.round(Math.min(f.width, f.height) * 0.075);
  const footerFs = Math.round(26 * Math.max(scale, 0.62));
  const footerY = f.height - pad;
  const ruleY = footerY - Math.round(footerFs * 1.9);
  return {
    w: f.width,
    h: f.height,
    pad,
    contentW: f.width - pad * 2,
    top: pad,
    bottom: ruleY - Math.round(44 * scale),
    ruleY,
    footerY,
    scale,
  };
}

// ── Blokken ──────────────────────────────────────────────────────────────────
// Elk template stelt een lijst blokken samen met een bekende hoogte. Daarna
// verdeelt `stack` ze over het beschikbare vlak, zodat er geen gat onderaan
// valt en liggend beeld niet over de voetregel heen loopt.

interface Block {
  height: number;
  /** `y` is de bovenkant van het blok. */
  render(y: number): string;
  /** Witruimte onder dit blok. */
  gapAfter: number;
}

/** Verhouding van lettergrootte tot basislijn; genoeg voor kapitalen. */
const ASCENT = 0.8;

function textBlock(
  lines: string[],
  x: number,
  opts: {
    fontSize: number;
    lineHeight: number;
    fill: string;
    family?: string;
    weight?: number;
    letterSpacing?: number;
    gapAfter?: number;
  },
): Block {
  const height = lines.length ? (lines.length - 1) * opts.lineHeight + opts.fontSize : 0;
  return {
    height,
    gapAfter: lines.length ? (opts.gapAfter ?? 0) : 0,
    render: (y) => {
      if (!lines.length) return "";
      const spans = lines
        .map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : opts.lineHeight}">${escapeXml(line)}</tspan>`)
        .join("");
      const ls = opts.letterSpacing ? ` letter-spacing="${opts.letterSpacing}"` : "";
      return `<text x="${x}" y="${Math.round(y + opts.fontSize * ASCENT)}" font-family="${opts.family ?? DISPLAY}" font-size="${opts.fontSize}" font-weight="${opts.weight ?? 700}" fill="${opts.fill}"${ls}>${spans}</text>`;
    },
  };
}

/**
 * Verdeelt de blokken over het vlak tussen `l.top` en `l.bottom`. Past alles
 * ruim, dan wordt het blok verticaal gecentreerd; past het krap, dan begint het
 * bovenaan en worden de tussenruimtes evenredig ingekort.
 */
function stack(blocks: Block[], l: Layout): string {
  const used = blocks.filter((b) => b.height > 0);
  if (!used.length) return "";
  const content = used.reduce((sum, b) => sum + b.height, 0);
  const gaps = used.slice(0, -1).reduce((sum, b) => sum + b.gapAfter, 0);
  const available = l.bottom - l.top;

  // Eerst de witruimte inkorten; dat kost het minst aan leesbaarheid.
  let gapFactor = 1;
  if (content + gaps > available) {
    gapFactor = gaps > 0 ? Math.max(0.35, (available - content) / gaps) : 1;
  }
  const total = content + gaps * gapFactor;
  let y = l.top + Math.max(0, (available - total) / 2);

  let svg = "";
  used.forEach((b, i) => {
    svg += b.render(Math.round(y));
    y += b.height + (i < used.length - 1 ? b.gapAfter * gapFactor : 0);
  });

  // Blijft het te veel (veel lange stappen in een laag formaat), dan krimpt het
  // hele blok uniform mee. Liever iets kleinere letters dan tekst over de voet.
  if (total > available) {
    const k = available / total;
    return `<g transform="translate(${(l.pad * (1 - k)).toFixed(2)} ${(l.top * (1 - k)).toFixed(2)}) scale(${k.toFixed(4)})">${svg}</g>`;
  }
  return svg;
}

// ── Vaste onderdelen ─────────────────────────────────────────────────────────

function background(l: Layout, p: Palette): string {
  return `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.25" y2="1">
      <stop offset="0%" stop-color="${p.bg}"/>
      <stop offset="100%" stop-color="${p.bgTo}"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0.06" cy="0.02" r="0.5">
      <stop offset="0%" stop-color="${BRAND.accent}" stop-opacity="${p.glowOpacity}"/>
      <stop offset="45%" stop-color="${BRAND.accent}" stop-opacity="${(p.glowOpacity * 0.18).toFixed(3)}"/>
      <stop offset="100%" stop-color="${BRAND.accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0.98" cy="1.02" r="0.42">
      <stop offset="0%" stop-color="${BRAND.accent2}" stop-opacity="${(p.glowOpacity * 0.45).toFixed(3)}"/>
      <stop offset="100%" stop-color="${BRAND.accent2}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${l.w}" height="${l.h}" fill="url(#bg)"/>
  <rect width="${l.w}" height="${l.h}" fill="url(#glowA)"/>
  <rect width="${l.w}" height="${l.h}" fill="url(#glowB)"/>`;
}

function kickerBlock(text: string, l: Layout, p: Palette): Block {
  const label = String(text ?? "").trim().toUpperCase();
  if (!label) return { height: 0, gapAfter: 0, render: () => "" };
  const fs = Math.round(Math.max(18, 24 * l.scale));
  const barW = Math.round(52 * l.scale);
  const x = l.pad + barW + Math.round(20 * l.scale);
  const lines = wrapText(label, l.contentW - (barW + Math.round(20 * l.scale)), fs).slice(0, 2);
  const inner = textBlock(lines, x, {
    fontSize: fs,
    lineHeight: Math.round(fs * 1.4),
    fill: p.accent,
    family: BODY,
    weight: 600,
    letterSpacing: Number((2.4 * l.scale).toFixed(1)),
  });
  return {
    height: inner.height,
    gapAfter: Math.round(fs * 1.9),
    render: (y) =>
      `<rect x="${l.pad}" y="${Math.round(y + fs * 0.38)}" width="${barW}" height="${Math.max(3, Math.round(4 * l.scale))}" fill="${p.accent}"/>` +
      inner.render(y),
  };
}

function footer(l: Layout, p: Palette, right?: string): string {
  const fs = Math.round(26 * Math.max(l.scale, 0.62));
  const rightText = (right ?? "").trim() || BRAND.site;
  const rightWidth = textWidth(rightText, fs, false);
  return `
  <rect x="${l.pad}" y="${l.ruleY}" width="${l.contentW}" height="${Math.max(1, Math.round(1.5 * l.scale))}" fill="${p.rule}"/>
  <text x="${l.pad}" y="${l.footerY}" font-family="${DISPLAY}" font-size="${fs}" font-weight="700" fill="${p.text}">${BRAND.wordmarkA}<tspan fill="${p.accent}">${BRAND.wordmarkB}</tspan></text>
  <text x="${l.w - l.pad - rightWidth}" y="${l.footerY}" font-family="${BODY}" font-size="${fs}" font-weight="400" fill="${p.textFaint}">${escapeXml(rightText)}</text>`;
}

/** Onderregel in de body, in de zachte tekstkleur. */
function sublineBlock(text: string | undefined, l: Layout, p: Palette, maxLines: number): Block {
  if (!text) return { height: 0, gapAfter: 0, render: () => "" };
  const fs = Math.round(Math.max(20, 33 * l.scale));
  const lines = wrapText(text, l.contentW, fs).slice(0, maxLines);
  return textBlock(lines, l.pad, {
    fontSize: fs,
    lineHeight: Math.round(fs * 1.45),
    fill: p.textSoft,
    family: BODY,
    weight: 400,
    gapAfter: Math.round(fs * 1.4),
  });
}

// ── Templates ────────────────────────────────────────────────────────────────

function renderStatement(l: Layout, p: Palette, f: VisualFields): string {
  const maxLines = l.h / l.w > 1.1 ? 6 : l.h / l.w > 0.9 ? 5 : 4;
  const head = fitFontSize(f.headline ?? "", {
    maxWidth: l.contentW,
    maxLines,
    max: Math.round(104 * l.scale),
    min: Math.round(42 * l.scale),
    bold: true,
  });
  return stack(
    [
      kickerBlock(f.kicker ?? "", l, p),
      textBlock(head.lines, l.pad, {
        fontSize: head.fontSize,
        lineHeight: Math.round(head.fontSize * 1.16),
        fill: p.text,
        gapAfter: Math.round(head.fontSize * 0.8),
      }),
      sublineBlock(f.subline, l, p, 4),
    ],
    l,
  );
}

function renderStat(l: Layout, p: Palette, f: VisualFields): string {
  const stat = fitFontSize(f.stat ?? "", {
    maxWidth: l.contentW,
    maxLines: 1,
    max: Math.round(280 * l.scale),
    min: Math.round(84 * l.scale),
    bold: true,
    step: 8,
  });
  const label = fitFontSize(f.stat_label ?? "", {
    maxWidth: l.contentW,
    maxLines: 3,
    max: Math.round(56 * l.scale),
    min: Math.round(32 * l.scale),
    bold: true,
  });
  return stack(
    [
      kickerBlock(f.kicker ?? "", l, p),
      textBlock(stat.lines, l.pad, {
        fontSize: stat.fontSize,
        lineHeight: stat.fontSize,
        fill: p.accent,
        gapAfter: Math.round(label.fontSize * 0.7),
      }),
      textBlock(label.lines, l.pad, {
        fontSize: label.fontSize,
        lineHeight: Math.round(label.fontSize * 1.2),
        fill: p.text,
        gapAfter: Math.round(label.fontSize * 0.9),
      }),
      sublineBlock(f.subline, l, p, 3),
    ],
    l,
  );
}

function renderSteps(l: Layout, p: Palette, f: VisualFields): string {
  const head = fitFontSize(f.headline ?? "", {
    maxWidth: l.contentW,
    maxLines: 3,
    max: Math.round(72 * l.scale),
    min: Math.round(38 * l.scale),
    bold: true,
  });
  const steps = (f.steps ?? []).filter(Boolean).slice(0, 5);
  const stepFs = Math.round(Math.max(22, (steps.length > 4 ? 34 : 38) * l.scale));
  const badge = Math.round(stepFs * 1.45);
  const indent = badge + Math.round(stepFs * 0.75);

  const blocks: Block[] = [
    kickerBlock(f.kicker ?? "", l, p),
    textBlock(head.lines, l.pad, {
      fontSize: head.fontSize,
      lineHeight: Math.round(head.fontSize * 1.16),
      fill: p.text,
      gapAfter: Math.round(head.fontSize * 0.95),
    }),
  ];

  steps.forEach((step, i) => {
    const lines = wrapText(step, l.contentW - indent, stepFs).slice(0, 3);
    const inner = textBlock(lines, l.pad + indent, {
      fontSize: stepFs,
      lineHeight: Math.round(stepFs * 1.28),
      fill: p.text,
      family: BODY,
      weight: 500,
    });
    blocks.push({
      height: Math.max(inner.height, badge),
      gapAfter: Math.round(stepFs * 0.95),
      render: (y) =>
        `<rect x="${l.pad}" y="${y}" width="${badge}" height="${badge}" rx="${Math.round(badge * 0.28)}" fill="${p.accent}" fill-opacity="0.16"/>` +
        `<text x="${l.pad + badge / 2}" y="${Math.round(y + badge * 0.68)}" text-anchor="middle" font-family="${DISPLAY}" font-size="${Math.round(stepFs * 0.82)}" font-weight="700" fill="${p.accent}">${i + 1}</text>` +
        inner.render(y + Math.max(0, (badge - inner.height) / 2)),
    });
  });

  return stack(blocks, l);
}

function renderCompare(l: Layout, p: Palette, f: VisualFields): string {
  const head = fitFontSize(f.headline ?? "", {
    maxWidth: l.contentW,
    maxLines: 2,
    max: Math.round(66 * l.scale),
    min: Math.round(36 * l.scale),
    bold: true,
  });

  const gap = Math.round(36 * l.scale);
  const colW = Math.round((l.contentW - gap) / 2);
  const labelFs = Math.round(Math.max(16, 26 * l.scale));
  const itemFs = Math.round(Math.max(19, 30 * l.scale));
  const inset = Math.round(30 * l.scale);

  const columns = [
    { x: l.pad, label: f.left_label ?? "Zonder", items: (f.left_items ?? []).filter(Boolean).slice(0, 4), accent: false },
    { x: l.pad + colW + gap, label: f.right_label ?? "Met", items: (f.right_items ?? []).filter(Boolean).slice(0, 4), accent: true },
  ];

  // Kolomhoogte volgt de langste kolom, zodat beide even hoog blijven.
  const columnBodies = columns.map((col) => {
    let y = 0;
    const parts: Array<{ lines: string[]; y: number }> = [];
    for (const item of col.items) {
      const lines = wrapText(item, colW - inset * 2 - Math.round(itemFs * 1.1), itemFs).slice(0, 3);
      parts.push({ lines, y });
      y += (lines.length - 1) * Math.round(itemFs * 1.3) + Math.round(itemFs * 1.95);
    }
    return { parts, height: y };
  });
  const bodyH = Math.max(...columnBodies.map((c) => c.height), itemFs);
  const headerH = Math.round(labelFs * 2.6);
  const colH = headerH + bodyH + Math.round(itemFs * 0.4);

  const columnsBlock: Block = {
    height: colH,
    gapAfter: 0,
    render: (top) =>
      columns
        .map((col, ci) => {
          const stroke = col.accent ? p.accent : p.rule;
          let svg = `
  <rect x="${col.x}" y="${top}" width="${colW}" height="${colH}" rx="${Math.round(26 * l.scale)}" fill="${col.accent ? p.accent : p.text}" fill-opacity="${col.accent ? 0.1 : 0.05}" stroke="${stroke}" stroke-width="${Math.max(1, Math.round(2 * l.scale))}"/>
  <text x="${col.x + inset}" y="${Math.round(top + headerH * 0.62)}" font-family="${BODY}" font-size="${labelFs}" font-weight="600" fill="${col.accent ? p.accent : p.textFaint}" letter-spacing="${(2 * l.scale).toFixed(1)}">${escapeXml(col.label.toUpperCase())}</text>`;
          for (const part of columnBodies[ci].parts) {
            const y = top + headerH + part.y;
            svg += `<circle cx="${col.x + inset + Math.round(itemFs * 0.22)}" cy="${Math.round(y + itemFs * 0.5)}" r="${Math.max(3, Math.round(6 * l.scale))}" fill="${col.accent ? p.accent : p.textFaint}"/>`;
            svg += textBlock(part.lines, col.x + inset + Math.round(itemFs * 1.1), {
              fontSize: itemFs,
              lineHeight: Math.round(itemFs * 1.3),
              fill: col.accent ? p.text : p.textSoft,
              family: BODY,
              weight: 400,
            }).render(y);
          }
          return svg;
        })
        .join(""),
  };

  return stack(
    [
      kickerBlock(f.kicker ?? "", l, p),
      textBlock(head.lines, l.pad, {
        fontSize: head.fontSize,
        lineHeight: Math.round(head.fontSize * 1.16),
        fill: p.text,
        gapAfter: Math.round(head.fontSize * 0.85),
      }),
      columnsBlock,
    ],
    l,
  );
}

function renderTeaser(l: Layout, p: Palette, f: VisualFields): string {
  const head = fitFontSize(f.headline ?? "", {
    maxWidth: l.contentW,
    maxLines: 4,
    max: Math.round(84 * l.scale),
    min: Math.round(38 * l.scale),
    bold: true,
  });
  const itemFs = Math.round(Math.max(21, 33 * l.scale));
  const dashW = Math.round(20 * l.scale);
  const indent = Math.round(48 * l.scale);

  const blocks: Block[] = [
    kickerBlock(f.kicker || "Nieuw op de site", l, p),
    textBlock(head.lines, l.pad, {
      fontSize: head.fontSize,
      lineHeight: Math.round(head.fontSize * 1.15),
      fill: p.text,
      gapAfter: Math.round(head.fontSize * 0.95),
    }),
  ];

  for (const item of (f.steps ?? []).filter(Boolean).slice(0, 4)) {
    const lines = wrapText(item, l.contentW - indent, itemFs).slice(0, 2);
    const inner = textBlock(lines, l.pad + indent, {
      fontSize: itemFs,
      lineHeight: Math.round(itemFs * 1.32),
      fill: p.textSoft,
      family: BODY,
      weight: 400,
    });
    blocks.push({
      height: inner.height,
      gapAfter: Math.round(itemFs * 0.8),
      render: (y) =>
        `<rect x="${l.pad}" y="${Math.round(y + itemFs * 0.44)}" width="${dashW}" height="${Math.max(3, Math.round(5 * l.scale))}" fill="${p.accent}"/>` +
        inner.render(y),
    });
  }

  return stack(blocks, l);
}

/** Rendert de gekozen template als SVG-string. */
export function buildSvg(opts: RenderOptions): string {
  const format = FORMATS[opts.format] ? opts.format : DEFAULT_FORMAT;
  const template = TEMPLATES[opts.template] ? opts.template : DEFAULT_TEMPLATE;
  const l = layout(format);
  const p = palette(opts.skin === "light" ? "light" : "dark");

  const body =
    template === "stat"
      ? renderStat(l, p, opts.fields)
      : template === "steps"
        ? renderSteps(l, p, opts.fields)
        : template === "compare"
          ? renderCompare(l, p, opts.fields)
          : template === "teaser"
            ? renderTeaser(l, p, opts.fields)
            : renderStatement(l, p, opts.fields);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${l.w}" height="${l.h}" viewBox="0 0 ${l.w} ${l.h}">${background(l, p)}${body}${footer(l, p, opts.fields.source_label)}
</svg>`;
}


/** De catalogus die het admin-scherm ophaalt; houdt de UI en de renderer gelijk. */
export function catalog() {
  return {
    formats: Object.values(FORMATS),
    templates: Object.values(TEMPLATES),
    channels: Object.values(CHANNELS),
    sources: Object.values(SOURCES).map(({ slug, label }) => ({ slug, label })),
    skins: ["dark", "light"],
    defaults: { format: DEFAULT_FORMAT, template: DEFAULT_TEMPLATE, channels: DEFAULT_CHANNELS, skin: "dark" },
  };
}

/** Leest de visual-velden uit een querystring, voor `social-image?...`. */
export function fieldsFromParams(params: URLSearchParams): VisualFields {
  const list = (key: string) =>
    (params.get(key) ?? "")
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);
  return {
    kicker: params.get("kicker") ?? undefined,
    headline: params.get("headline") ?? undefined,
    subline: params.get("subline") ?? undefined,
    stat: params.get("stat") ?? undefined,
    stat_label: params.get("stat_label") ?? undefined,
    source_label: params.get("source_label") ?? undefined,
    steps: list("steps"),
    left_label: params.get("left_label") ?? undefined,
    left_items: list("left_items"),
    right_label: params.get("right_label") ?? undefined,
    right_items: list("right_items"),
  };
}
