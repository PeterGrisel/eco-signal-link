## Doel

Eén centrale bron voor alle terugkerende teksten (CTA's, taglines, propositie-zinnen) zodat formuleringen overal identiek blijven en updates op één plek gebeuren.

## Aanpak

### 1. Nieuwe centrale module: `src/content/copy.ts`

Gestructureerd object met alle herbruikbare strings, gegroepeerd per categorie:

```ts
export const COPY = {
  cta: {
    primary: { label: "Plan de nulmeting →", href: "https://app.usemotion.com/meet/Rebel-Force/meeting" },
    secondary: { label: "Bekijk hoe het werkt", href: "#hoe-het-werkt" },
    pricing: { label: "Bekijk pakketten", href: "/pricing" },
    contact: { label: "Neem contact op", href: "/contact" },
  },
  proposition: {
    tagline: "Eerst in kaart. Dan automatiseren.",
    signalFocus: "Samen bepalen we welke signalen en reacties terechtkomen",
    signalSubtext: "Geen algemene demo. We kijken welke signalen bij uw ICP passen en hoe we die samen kwalificeren.",
  },
  process: {
    eyebrow: "Van nulmeting tot resultaat",
    heading: "In 4 weken live.",
  },
  system: {
    eyebrow: "Zo werkt het",
    intro: "Wij beginnen met een nulmeting...",
  },
  // etc.
} as const;
```

### 2. CTA-tracking helper

Wrapper component/helper `<CtaButton intent="primary" location="...">` die automatisch:
- Label + href uit `COPY.cta` haalt
- `trackCTA()` aanroept met consistente naamgeving
- Variant en size accepteert

### 3. Migratie

Vervang hardcoded strings in deze componenten door `COPY.*`:
- `Hero.tsx`, `StickyHeroCta.tsx`
- `ProcessSection.tsx`, `SystemSection.tsx`, `HookSection.tsx`
- `CtaSection.tsx`, `PricingSection.tsx`
- `Navbar.tsx`, `Footer.tsx`
- `FaqSection.tsx`, `ResultsSection.tsx`, `DeliveryModelSection.tsx`
- `FloatingTrainingCta.tsx`

### 4. Scope buiten deze migratie

- Blog-content en sectorpagina's blijven hun eigen tekst houden (te specifiek)
- Signaal-module (`src/signaal/*`) heeft eigen tone-of-voice (apart product)
- Admin-pagina's (interne tooling)

## Technisch

- `as const` voor type-safety en autocomplete
- Eén export per categorie zodat tree-shaking werkt
- Geen runtime-overhead: pure string constants
- Memory-rule wordt toegevoegd: "Alle marketing-copy via `src/content/copy.ts`"

## Resultaat

Tekstwijziging → één plek aanpassen → consistent op hele site. Voorkomt drift tussen "Plan een gesprek", "Plan de nulmeting", "Boek een demo" etc.
