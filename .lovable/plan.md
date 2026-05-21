## Doel

Weg met de losse widgets. De homepage wordt één doorlopend verhaal — zoals de presentatie en de vier infographics. Eén canvas, vijf hoofdstukken, één ritme, één eindpunt: nulmeting boeken.

## Wat eruit gaat

Verwijderen van de huidige Index pagina:
- `HookSection` (3 losse cards)
- `VergelijkingSection` (2-koloms blok)
- `MethodeSection` (4x2 grid)
- `SchaalCijfersSection` (5 cijfers + arrows)
- `ProcessSection`
- `PricingSection`
- `MiniFaq`
- `CtaSection`

De componenten blijven bestaan (worden elders gebruikt), maar de homepage stopt ermee.

## De nieuwe opbouw

Eén `<main>` met vijf hoofdstukken die in elkaar overvloeien — gedeelde achtergrond, doorlopende kolom, hoofdstuknummers, geen harde section-breaks.

```text
HERO
  ↓
HOOFDSTUK 01 — Het herkenbare scenario
  "U wacht op een lancering. De markt geeft al signalen af."
  Links: hoe het vaak voelt (4 iconen: lancering → wachten → aanvragen → sales)
  Rechts: wat er echt gebeurt (signaal-wolk → commercieel brein → routering)
  Sluit af: "Engagement is geen losse actie. Het is een patroon."
  ↓
HOOFDSTUK 02 — Van kennis in hoofden naar meetbare context
  Drie fases naast elkaar: Hoe het nu gaat → Wat we vastleggen → Wat dat mogelijk maakt
  Centraal: het Commercieel Brein als hub
  Sluit af: "Niet alleen activiteit vastleggen. Eerst context."
  ↓
HOOFDSTUK 03 — Twee manieren om B2B groei te sturen
  Volledig scherm split: Standaard methode (grijs, lineair, 7 stappen)
  vs B2BGroeimachine (donker, 8 stappen rond het brein, learning loop)
  Onderaan: key differences als doorlopende rij
  Sluit af: "One setup. One method. Infinite growth motions."
  ↓
HOOFDSTUK 04 — De schaal die dit oplevert
  Cijfer-trap: 2000 bedrijven → 4000 contacten → 200 in beweging → 20 meetings → €500k pipeline
  Geen losse cards meer — één doorlopende horizontale flow met verbindingen
  ↓
HOOFDSTUK 05 — Hoe wij dit voor u bouwen
  Done-for-you of Build & Transfer, één blok, twee paden
  Direct gevolgd door één enkele CTA: nulmeting boeken
```

## Visuele aanpak

- **Eén canvas**: gedeelde donkere achtergrond met subtiele gradient die per hoofdstuk meeshift (kouder → warmer richting de CTA)
- **Hoofdstuknummers** links in beeld (sticky), zoals een editorial magazine — `01`, `02`, `03`...
- **Verbindingslijnen** tussen hoofdstukken: dunne verticale lijn die doorloopt, met een knooppunt bij elk hoofdstuk
- **Geen sectie-padding stapeling**: hoofdstukken overlappen visueel via gradient-overgangen, niet via harde achtergrondwissels
- **Typografie als ritme**: hoofdstuk-eyebrow (klein, tracking-wide) → grote display headline (Space Grotesk) → body kolom max 65ch → afsluitende quote in groter formaat
- **Iconografie consistent**: zelfde lijn-stijl iconen door alle hoofdstukken (lucide-react), met `#E8945A` accent op het juiste moment
- **Beweging**: subtiele scroll-reveal per hoofdstuk (fade + 8px omhoog), niet per cardje

## Bouwopzet

- Nieuwe component `src/components/homepage/HomepageNarrative.tsx` — bevat het hele verhaal als één samenhangend geheel
- Sub-componenten per hoofdstuk in `src/components/homepage/chapters/` (Chapter01Scenario, Chapter02Context, Chapter03TwoWays, Chapter04Schaal, Chapter05Aanpak)
- Eén shared `ChapterFrame` voor hoofdstuknummer, eyebrow, headline en sluitquote — garandeert ritme
- Eén shared `ConnectorLine` voor de verticale lijn tussen hoofdstukken
- Alle copy uit `src/content/copy.ts` (volgens centralized-copy regel)
- `Index.tsx` wordt: `Navbar → Hero → HomepageNarrative → Footer → StickyHeroCta`

## Wat blijft uit Hero

Hero blijft staan zoals nu. Daaronder begint het verhaal direct met hoofdstuk 01 — geen aparte "hook cards" meer.

## Wat ik nog van u nodig heb

Niets. Ik bouw dit in één keer door. Wilt u eerst visueel kiezen tussen 2-3 ontwerprichtingen voor het hoofdstuk-ritme (editorial magazine, presentation deck of zachte glasmorf), zeg het — dan render ik die eerst.
