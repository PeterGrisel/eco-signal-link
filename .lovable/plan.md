## Doel

De prospect opent `/voor/[slug]` en voelt direct: "dit gaat over ons". Geen generieke ABM-pagina, maar onze eigen beelden, eigen woorden en eigen kleuren door de hele pagina verweven.

## Wat er nu mist

`abm-brand-extract` haalt alleen kleuren, lettertypes, logo en één screenshot op. Teksten en visuals van de site worden niet meegenomen, dus de pagina blijft generiek behalve het kleurthema.

## Wat we toevoegen

### 1. `abm-brand-extract` uitbreiden (server)

Eén Firecrawl call uitbreiden naar meerdere formats: `branding`, `screenshot`, `markdown`, `links`, `summary`, plus een tweede compacte call voor de OG image via metadata. Daaruit oogsten we:

- **Tagline / pitch** — eerste betekenisvolle alinea uit `markdown` (60–220 tekens, geen menu/cookie).
- **Bullets** — 3 tot 5 korte propositie-zinnen uit de eerste H2/H3-blokken.
- **Galerij** — tot 8 afbeeldingen uit `images` of `<img>` in markdown, gefilterd op formaat (geen iconen < 200px, geen tracking pixels) en absolute URL gemaakt.
- **OG image** — uit `metadata.ogImage` of `og:image` meta.
- **Sitenaam + claim** — uit `metadata.title` / `metadata.description`.
- **Sectornaam** — uit summary (alleen als simpel sleutelwoord matcht, anders leeg).

Alle gevonden beelden worden via bestaande `uploadFromUrl` naar `blog-images/abm/{slug}/` geüpload zodat hotlinks niet breken (CSP, rate limits, verlopen URLs).

Resultaat in `payload.personal`:
```text
{
  tagline, pitch, bullets[], gallery[], ogImage,
  siteName, siteClaim
}
```

### 2. `AbmPage.tsx` weven met `personal`

Geen losse "wat wij zien"-blok meer. In plaats daarvan worden de persoonlijke elementen subtiel verspreid:

- **Hero** — als `personal.pitch` aanwezig is, vervangt of versterkt die de generieke `intro`. Naast de hero-illustratie verschijnt een kleine "card" met `personal.bullets` als check-list (in plaats van de huidige generieke `highlights`).
- **Ribbon onder de header** — klantlogo blijft, maar krijgt `personal.siteClaim` als ondertitel ("Persoonlijke pagina voor Coolmark — Specialist in koeltechniek sinds 1975").
- **Manifest sectie** — onveranderd, maar onderaan een quote-strip met `personal.tagline` tussen aanhalingstekens in brand-primary kleur ("In uw eigen woorden:").
- **Observaties** — bestaande sectie krijgt links 3 cards met `clientObservations`, rechts een collage van 3–4 echte beelden uit `personal.gallery` in masonry-stijl (geen browser-mockup meer, gewoon de beelden zelf met brand-kleurige border).
- **Wie we helpen / rollen** — header verwijst naar `personal.siteName` of `row.company_name` afwisselend zodat het natuurlijker leest.
- **Eind-CTA banner** — als achtergrond `personal.ogImage` of de mooiste `personal.gallery[0]` in plaats van het AI-gegenereerde `ctaImage`, met donker overlay (`primary` op 70%) zodat tekst leesbaar blijft.

Alle nieuwe velden zijn defensief (alleen renderen als aanwezig) zodat oude pagina's blijven werken.

### 3. Workflow

Bij publish blijft de volgorde: `abm-brand-extract` (nu rijker) → `abm-generate-visuals` (illustraties als aanvulling, niet meer als hoofdvisual op de observatiesectie). Voor coolmark draaien we daarna opnieuw `abm-brand-extract` zodat de bestaande pagina ook de echte beelden krijgt.

## Bestanden

- `supabase/functions/abm-brand-extract/index.ts` — uitbreiden met content + image harvest, OG image, upload van gallery.
- `src/pages/AbmPage.tsx` — `personal` uitlezen, hero-bullets, ribbon-ondertitel, quote-strip in manifest, gallery in observatiesectie, eind-CTA achtergrond.

## Niet doen

- Geen extra database velden — alles in `payload.personal` JSON.
- Geen nieuwe edge function — we breiden de bestaande uit.
- "We hebben uw site uit elkaar gehaald"-framing blijft weg.
