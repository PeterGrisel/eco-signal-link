## Richting

`/voor/coolmark` wordt een **compacte editorial flyer** in dezelfde stijl als `src/pages/Brandstory.tsx` (cover → uitdaging → fout → aanpak → systeem → vliegwiel → horizonten → voor wie → closing). Dezelfde typografie, ritme en sectie-randen, maar **ingedikt tot 5 secties** en doorspekt met persoonlijke data van de prospect.

Geen lange "wat wij doen"-lijsten. Wel het magazine-gevoel van de brandstory.

## Blueprint: van 8 brandstory-secties naar 5 flyer-secties


| Brandstory (~409 r)             | Flyer-versie /voor/{slug}                                          | Personalisatie-bron                                               |
| ------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| Cover                           | **1. Cover** — naam-eyebrow + grote claim + 1 CTA                  | `company_name`, `title`, `subtitle`, `ctaUrl`                     |
| Uitdaging + Fout                | **2. De uitdaging** — 1 kolom, max 3 alinea's                      | `personal.pitch` of `summary`, max 3 `personal.bullets`           |
| Aanpak                          | **3. Onze aanpak** — 3 stappen horizontaal                         | hardcoded 3 stappen uit brandstory                                |
| Systeem + Vliegwiel             | **4. Het systeem** — 4 lagen genummerd, geen iconenfeest           | hardcoded 4 lagen uit brandstory                                  |
| Horizonten + Voor wie + Closing | **5. Closing voor {company_name}** — 1 zin + CTA + contactgegevens | `company_name`, `ctaUrl`, `ctaLabel`, optionele `payload.contact` |


Doel: van ~868 regels naar **±300 regels**, scrolldiepte van 8 schermen → 3 schermen.

## Wat eruit gaat

Volledig schrappen uit `AbmPage.tsx`:

- Manifest-sectie ("U heeft geen leadprobleem")
- Karakter-masonry-gallery
- Value bar (oranje strip)
- Sectie 0 Client observations als losse sectie
- Sectie 1 Opportunity
- Sectie 2 Approach (6 stappen met iconen)
- Sectie 3+4 Target accounts + Producten
- Sectie 5 Signal-based activatie + tiers
- Sectie 6 Verwachte output
- Sectie 7 Sterktes van klant
- Final CTA-banner met ogImage-achtergrond

## Wat erin komt — per sectie

### 1. Cover (≈ Brandstory cover)

- Layout: `min-h-screen flex flex-col justify-between` met top-padding zoals brandstory
- Eyebrow boven (klein, primary): `VOOR {COMPANY_NAME.toUpperCase()}`
- Grote display-claim (font-display, 5xl–7xl): `title` uit payload
- Sub-zin (≤14 woorden, muted): `subtitle`
- Onderkant: 1 primaire CTA-knop (`ctaLabel` → `ctaUrl`) + kleine "Lees verder ↓"-anchor naar sectie 2
- Subtiele branding: kleur-tint uit `branding.primary` op CTA en eyebrow
- **Geen** klantlogo, **geen** hero-afbeelding

### 2. De uitdaging (≈ Uitdaging + Fout samen)

- Single column, editorial breedte (max-w-3xl)
- H2 in font-display, sentence case: `Wat we bij {company_name} zien.`
- Body: 1 alinea uit `personal.pitch` (of `summary` fallback), B1, ≤12 woorden per zin
- Onder: 3 korte bullets uit `personal.bullets` of `clientObservations` — pure observaties, geen aanbevelingen

### 3. Onze aanpak (≈ Brandstory aanpak, ongewijzigd)

- 3-koloms grid met genummerde kaarten: Proces opzetten · Data laten werken · Resultaat compoundt
- Tekst letterlijk overnemen uit `Brandstory.tsx` regels 169–183
- Niet gepersonaliseerd — dit is onze methode

### 4. Het systeem (≈ Brandstory systeem, ingedikt zonder vliegwiel)

- 4 lagen verticaal of 2×2 grid, met label + 1 zin omschrijving
- Tekst letterlijk uit `Brandstory.tsx` regels 215–230
- Vliegwiel-sectie weglaten (te veel)

### 5. Closing voor {company_name} (≈ Closing)

- Hele sectie min-h-[60vh], centraal
- H2: `Klaar voor het gesprek, {company_name}?`
- Eén zin onder: vaste afsluiter uit copy.ts (mag herhaling van CTA-belofte zijn, geen specifieke meeting-promise)
- 1 grote CTA-knop
- Onder de knop, fijn-grijs: contactnaam + telefoon uit `payload.contact` indien aanwezig — tweede conversiepad

## Personalisatie

Gebruiken: Wel logo voor herkenning! 

- `company_name` — eyebrow, koppen, closing-aanroep
- `title`, `subtitle` — cover
- `personal.pitch` / `summary` — sectie 2 body
- `personal.bullets` (max 3) of `clientObservations` (max 3) — sectie 2 bullets
- `branding.primary`, `branding.accent` — accenten op eyebrow, CTA, nummers
- `ctaUrl`, `ctaLabel` — cover + closing CTA's
- `payload.contact` — closing contact-regel

Niet meer gebruiken:

- `branding.logo` / klantlogo
- `personal.gallery` (geen klant-afbeeldingen meer in pagina)
- `personal.tagline` quote
- `siteScreenshot`, `ogImage` als visueel element
- `valueBar`, `signals`, `tiers`, `expectedOutput`, `clientExpertise`, `products`, `targetAccounts`, `opportunitySteps`, `approachSteps` uit payload

## Styling

- Behoud `brandStyle`/`surfaceColor`/`textColor` etc. op container voor brand-tint
- Sectie-padding identiek aan brandstory: `px-6 md:px-16 lg:px-[72px] py-20 md:py-24 border-b border-border`
- `motion.section` met `fadeIn` zoals brandstory
- Top-bar van B2BGroeiMachine zoals nu (zonder klantlogo-ribbon eronder)
- Geen orbs, geen beams, geen abm-dots, geen masonry — strakke editorial witruimte

## Technische uitvoering

Bestanden:

- `src/pages/AbmPage.tsx` — herschrijven naar 5-secties-versie (~300 regels)

Behouden:

- `useAbmPage` hook + Supabase-fetch logic
- Brand-CSS injectie via `<style>` block (alleen tokens die we nog gebruiken)
- `motion` fade-ins

Geen wijziging aan:

- Edge functions
- DB-schema
- `abm_pages` payload

## Kwaliteitsbar

- Eerste viewport toont cover volledig met CTA in beeld
- Maximaal 3 schermhoogtes totaal (1440×900)
- Geen klantlogo, nergens
- Geen icoonfeest: max 1 visueel element per sectie
- Alle zinnen ≤12 woorden, B1, 'u/uw'
- Editorial gevoel = veel witruimte, geen kaartjes-soep

## Buiten scope

- Geen wijziging aan brandstory zelf
- Geen aanpassing edge-functions of payload-structuur
- Bestaande `payload`-velden blijven gevuld door extractor — we tonen alleen minder