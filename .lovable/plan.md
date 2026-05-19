## Doel

Homepage korter en scanbaar maken. De bezoeker kiest zelf wat hij leest, in plaats van door 14 secties te scrollen. We starten met het blok **"Werkt in elke branche"** als interactief sectorkiezer-component.

## Stap 1 — Nieuw blok: "Werkt in elke branche"

Plaats direct onder de `FunnelInfographic` (vóór `NoLeadAgencySection`). Vervangt nog niets, is de eerste compacte module.

### Layout

```text
┌───────────────────────────────────────────────────────────┐
│  Werkt in elke B2B branche                                │
│  Kies uw sector — zie direct welke signalen we volgen     │
│                                                           │
│  [⚽ Profvoetbal] [📦 Groothandel] [🔧 Techniek] [🏭 …]   │  ← chips/pills
│   actief                                                  │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Tagline van sector                                 │  │
│  │                                                     │  │
│  │  Signalen die wij volgen   │  Wat u krijgt na 4 wk  │  │
│  │  • signaal 1               │  • resultaat 1         │  │
│  │  • signaal 2               │  • resultaat 2         │  │
│  │  • signaal 3               │  • resultaat 3         │  │
│  │                                                     │  │
│  │  [Bekijk volledige sectorpagina →]                  │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

### Gedrag

- 9 sectoren als horizontale, scrollbare chips (mobiel: swipe; desktop: wrap).
- Klik op chip = inhoud wisselt direct (geen pagina-navigatie), met korte fade.
- Standaard actief: eerste sector (Profvoetbal) of detecteer via URL-hash.
- CTA onderin linkt naar `/sectoren/{slug}` voor de volledige pagina.

### Data

Hergebruik `src/data/sectors.ts` — velden `title`, `tagline`, `signals` (max 4 tonen), `naVierWeken` (max 4 tonen), `slug`, `icon`.

### Nieuw bestand

- `src/components/SectorPicker.tsx` — zelfstandig component, Framer Motion fade, design-tokens (geen hardcoded kleuren).

### Integratie

`src/pages/Index.tsx`:
```tsx
<Hero />
<FunnelInfographic />
<SectorPicker />        // ← nieuw
<NoLeadAgencySection />
...
```

## Vervolgstappen (later, na akkoord op stap 1)

Pas wanneer dit blok staat, gaan we de rest comprimeren. Voorgestelde richting:

1. **HookSection + StreamsSection + SystemSection** → één blok met tabs ("Wat", "Hoe", "Voor wie").
2. **ProcessSection + DatahubSection + DeliveryModelSection** → accordions onder één kop "Hoe wij bouwen".
3. **PipelineEquationTeaser + FunnelSection** behouden als interactieve blokken (al compact).
4. **Pricing + Results + FAQ + CTA** blijven onderaan zichtbaar voor conversie.

Verwachte reductie: ~50% paginalengte zonder content te verliezen.

## Scope nu

Alleen stap 1: bouw `SectorPicker` en integreer in `Index.tsx`. Geen wijzigingen aan bestaande secties.
