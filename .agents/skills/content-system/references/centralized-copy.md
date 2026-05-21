# Centralized Copy + CtaLink

## Regel
**Alle herhalende marketing copy (CTA labels, hrefs, propositie-zinnen) MUST leven in `src/content/copy.ts`.**

## Templates
- `assets/copy.template.ts` → `src/content/copy.ts`
- `assets/CtaLink.template.tsx` → `src/components/CtaLink.tsx`

## Hoe gebruiken

### Nieuwe CTA
```tsx
import { CtaLink } from "@/components/CtaLink";

<CtaLink intent="nulmeting" location="HeroSection" />
```
Component regelt: href, label, target/rel, tracking call.

### Nieuwe herhalende tekst
```ts
// In copy.ts
export const COPY = {
  heroSubtitle: "Voorspelbare B2B groei...",
  pricingNote: "Alle prijzen excl. BTW",
};

// In component
import { COPY } from "@/content/copy";
<p>{COPY.heroSubtitle}</p>
```

## Naming convention voor tracking
`${location} — ${label-zonder-pijl}`. CtaLink doet dit automatisch via `trackCTA()`.

## Per project aanpassen
Bewerk `copy.ts`:
- `BOOKING_URL` — Motion/Calendly/Cal.com link
- `CTA.*` — intents specifiek voor dit project
- `COPY.*` — propositie-zinnen in brand tone-of-voice

`CtaLink.tsx` werkt out-of-the-box; alleen `trackCTA` import path checken.

## Scope discipline
Niet alle copy hoeft centraal. Behoud per-project autonomie voor:
- Blog content (per artikel uniek)
- Admin UI (niet user-facing marketing)
- Sectorpagina's met eigen tone-of-voice
- Sub-producten met eigen brand

## Waarom
Voorkomt drift tussen "Plan de nulmeting", "Plan een gesprek", "Boek een demo" — drie varianten = inconsistente brand + slechte tracking.
