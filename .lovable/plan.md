# Plan: ColdIQ-stijl upgrade voor `/hoe-het-werkt-v2`

We nemen 4 lay-outpatronen van coldiq.com over, blijven 100% donker (bg `#0B0B0E`, accent `#E8945A`), en gebruiken 21st.dev als componentbron. Geen vendor-logo's van tools (brandregel).

## Wat erbij komt (volgorde op pagina)

```text
1. HeroFlow             ← REBUILD (editorial)
2. VideoCaptureSection  ← NIEUW
3. LogoWallCases        ← NIEUW (vervangt niets)
4. TwoPathsSection
5. ProblemSection
6. EngineFlow
7. ServiceStackSection  ← NIEUW (Agency / Tools / Education-achtig)
8. NinetyDayBuild
9. PlaysSection
10. ExecutionLayer
11. ComparisonTable
12. ProofSection
13. FaqSection
14. Finale CTA
```

## 1. HeroFlow — editorial herwerking

- **Pill bovenaan** (ColdIQ-style): `Voor B2B-bedrijven met PMF en ≥ €100K MRR` met kleine `›` chevron. Animated border-glow (21st.dev `animated-pill` / `announcement-badge`).
- **Headline**: serif accent in oranje + sans rest:
  - Lijn 1: `Het B2B-groeisysteem van` (Space Grotesk)
  - Lijn 2: *Morgen, vandaag gebouwd.* (serif italic, Fraunces 600, in oranje gradient)
- **Sub**: `Wij bouwen B2B-revenue-engines die voor je verkopen.` (B1, max 12 woorden).
- **Bestaande signal-flow SVG (GSAP)** blijft eronder, smaller en lager, als achtergrond-canvas met lagere opacity zodat de typografie de show steelt.
- **Geen serif body** — alleen voor de italic accent-regel. Sans blijft Inter/Space Grotesk.

## 2. VideoCaptureSection (NIEUW)

- 16:9 video-frame met poster (`/src/assets/hero-poster.jpg` hergebruiken) + custom play-button. **Geen echte video src** vereist; placeholder met click → opent bestaande `GlobalBookingModal`.
- Onder de player: split CTA-bar `[ je werk-email ]  [ Gratis groeiscan ]`. Email-veld submit → routeert naar `CtaLink intent="gratisScan"` met `?email=` prefill (gebruikt bestaande copy uit `src/content/copy.ts`).
- Donkere card met `border-glow` + zachte oranje halo (zoals huidige EngineFlow card).

## 3. LogoWallCases (NIEUW)

- Strikt **geen tool-logo's of partner-logo's** (brandregel). In plaats daarvan:
  - **Marquee bovenaan** met **sector-labels** in nette outline-pills (Industrie, SaaS, Bouw, Logistiek, Zakelijke dienstverlening, Tech, Maakindustrie). Auto-scroll, 21st.dev `infinite-slider`.
  - **2 inline case-cards** met case-study teaser uit `src/data/caseStudies.ts` (Hego, Stelz, SealEco, Shots, Klingele24). Card-style identiek aan ColdIQ tegels: groot beeld, eyebrow `Case study`, titel, 2-regel pitch, oranje pijl-CTA.

## 4. ServiceStackSection (NIEUW)

- 3-koloms bento met onze échte 3 pijlers (geen "Agency/Tools/Education" 1-op-1):
  - **Done-for-you** — wij draaien de engine (OpEx).
  - **Build & transfer** — wij bouwen, jullie nemen over (CapEx).
  - **Toolkit & playbooks** — frameworks, cheatsheets, Signaal (self-serve).
- 21st.dev `bento-grid` (asymmetric: 1 groot links, 2 kleiner rechts). Elk blok krijgt mini-icon, 1-zin pitch, en `Bekijk →` link naar bestaande pagina's (`/`, `/playbooks`, `/signaal`).

## Technische details

### Fonts
- `bun add @fontsource/fraunces` → in `src/main.tsx` `import '@fontsource/fraunces/400-italic.css'; import '@fontsource/fraunces/600-italic.css';`
- `tailwind.config.ts`: `fontFamily.serif: ['Fraunces', 'serif']` toevoegen (naast bestaande display/body).
- **Alleen** voor accent-italic-regel. Body/headings blijven Space Grotesk + Inter.

### 21st.dev componenten
- Repo `serafimcloud/21st` is een component-marketplace (https://21st.dev). We zoeken via web-fetch op 21st.dev:
  - `announcement-badge` / `animated-pill` → Hero pill
  - `hero-video-dialog` of `video-player` → VideoCaptureSection
  - `infinite-slider` / `logos-marquee` → LogoWallCases marquee
  - `bento-grid` → ServiceStackSection
- We **kopiëren JSX/CSS** vanuit 21st.dev (shadcn-style), passen ze in onze tokens (`hsl(var(--primary))`, `card-gradient`, `border-glow`) en plaatsen onder `src/components/hhwv2/ui/`. Geen npm-install nodig per component.

### Nieuwe bestanden
- `src/components/hhwv2/HeroFlow.tsx` (rewrite, behoudt huidige GSAP-timeline op SVG-laag)
- `src/components/hhwv2/VideoCaptureSection.tsx`
- `src/components/hhwv2/LogoWallCases.tsx`
- `src/components/hhwv2/ServiceStackSection.tsx`
- `src/components/hhwv2/ui/AnnouncementPill.tsx`
- `src/components/hhwv2/ui/InfiniteSlider.tsx`
- `src/components/hhwv2/ui/BentoGrid.tsx`
- `src/components/hhwv2/ui/VideoDialog.tsx`

### Bestaande bestanden aangepast
- `src/pages/HoeHetWerktV2.tsx` — nieuwe imports + volgorde.
- `tailwind.config.ts` — serif font toevoegen.
- `src/main.tsx` — Fraunces fontface import.

### Wat we NIET aanraken
- Brandregel: geen partner/tool-logo's (vervangen door sector-pills).
- Bestaande GSAP-flow (EngineFlow, NinetyDayBuild, ExecutionLayer, ConnectorFlow) blijft ongewijzigd.
- `/hoe-het-werkt` (V1) blijft live.
- Copy blijft B1 Nederlands, je/jouw, max 12 woorden, geen em-dashes.

### Animatie
- Pill: subtle border-glow loop (CSS keyframe, geen GSAP).
- Headline: split-words fade-in + serif-italic schrijft zich oranje in (Framer Motion `staggerChildren`).
- Marquee: pure CSS `@keyframes scroll` (geen GSAP).
- Bento cards: hover-lift + border glow-pulse on view.

## Buiten scope

- Geen echte video-asset uploaden (placeholder + poster).
- Geen wijziging aan navigation, footer of routes (`/hoe-het-werkt-v2` blijft).
- Geen 21st.dev npm-pakket of CLI install — we kopiëren componenten handmatig.