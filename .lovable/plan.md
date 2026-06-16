# Parallax Hero — GSAP + Lenis + 4 beeldlagen

Vervang de Spline-achtergrond in `src/components/Hero.tsx` door een 4-laags parallax die meteen "pakt" bij het eerste scroll-tikje. Tekstcontent (pill, headline, subkop, CTA's, trustbalk) blijft 1-op-1 staan en zweeft bovenop als content-laag.

## Wat er komt

```text
Z-index  Laag                              Beweging (yPercent bij eind scroll)
─────────────────────────────────────────────────────────────────────────────
   0    Layer 1: donkere sky + gradient glow      +70  (traag, ver weg)
   1    Layer 2: mistige horizon / wolken         +55
   2    Layer 3: abstracte berg/skyline silhouet  +40
   3    Layer 4: voorgrond grid / particles       +10  (snel, dichtbij)
  10    Content (huidige tekst + CTA's)            0   (stilstaand)
```

Effect: zodra de gebruiker scrollt schuiven de 4 lagen op verschillende snelheden weg → diepte- en cinematisch gevoel, exact het patroon uit het meegestuurde snippet.

## Implementatie

### 1. Dependencies
```bash
bun add gsap @studio-freight/lenis
```

### 2. Nieuwe assets (`src/assets/hero/`)
Vier 1920×1080 lagen, gegenereerd in brand-stijl (donker, #E8945A accenten, geen logo's/badges, geen tekst):
- `layer-1-sky.jpg` — donkere atmosfeer met warme oranje glow + sterren
- `layer-2-mist.jpg` — transparante mist/wolkenband (PNG met transparantie)
- `layer-3-skyline.png` — abstract silhouet (golvende horizon / data-architectuur), transparant
- `layer-4-grid.png` — voorgrond perspectief-grid + particles, transparant

### 3. `Hero.tsx` herstructureren
- Verwijder `lazy(() => import("@splinetool/react-spline"))` en het Spline-watermerk-blokje.
- Wrap met `ref={parallaxRef}` op de section, en plaats binnenin een absolute `[data-parallax-layers]` container die de 4 `<div data-parallax-layer="1..4">` lagen bevat (elk full-bleed `absolute inset-0`, eigen background-image, `will-change: transform`).
- `useEffect` met exact het snippet: `gsap.registerPlugin(ScrollTrigger)`, timeline scrubbed (scrub: 0), `start: "0% 0%"`, `end: "100% 0%"`, layers-array identiek, Lenis init + `ScrollTrigger.update` + `gsap.ticker`. Cleanup: kill ScrollTriggers, kill tweens, `lenis.destroy()`.
- Behoud `min-h-screen` (100vh) en alle huidige Framer Motion intro-animaties op de content.
- Behoud bestaande gradient als fallback achter Layer 1 (zo blijft de hero rijk zelfs als beelden nog laden).

### 4. Globale Lenis-overweging
Lenis wordt in `Hero.tsx` geïnitialiseerd; bij unmount netjes `destroy()`. Smooth scroll geldt zo alleen zolang de homepage gemount is — dat is acceptabel voor de SPA en voorkomt regressies op andere routes.

## Risico's / aandachtspunten
- `min-h-screen` + `scrub` op een korte trigger maakt dat het effect snel "op" is. Dat is bewust de gevraagde subtiele variant.
- iOS-Safari: Lenis is stabiel, maar `will-change: transform` op alle 4 lagen toevoegen voor soepele GPU-compositing.
- Spline blijft als dep voor andere pagina's — niet verwijderen uit `package.json`.
- Beelden lazy = nee (hero, above the fold); wel `fetchpriority="high"` en preload van layer 1.

## Bestanden
- `src/components/Hero.tsx` — herschrijven (parallax structuur + useEffect)
- `src/assets/hero/layer-1-sky.jpg` — nieuw (generated)
- `src/assets/hero/layer-2-mist.png` — nieuw (generated, transparant)
- `src/assets/hero/layer-3-skyline.png` — nieuw (generated, transparant)
- `src/assets/hero/layer-4-grid.png` — nieuw (generated, transparant)
- `package.json` / `bun.lock` — `gsap`, `@studio-freight/lenis` toegevoegd
