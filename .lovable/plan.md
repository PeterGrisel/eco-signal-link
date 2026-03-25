

# SEO Verbeteringen — Plan

## Wat er al goed staat
Basis meta tags, JSON-LD structured data, sitemap, robots.txt, canonical URLs, taalattribuut.

## Voorgestelde verbeteringen

### 1. Sectorpagina's toevoegen aan sitemap.xml
De 8 sectorpagina's staan niet in de sitemap. Google kan ze hierdoor missen.

### 2. FAQ JSON-LD structured data
Een FAQ-sectie toevoegen (bijv. op de homepage of per sectorpagina) met bijbehorende `FAQPage` JSON-LD markup. Dit kan rich snippets opleveren in Google zoekresultaten.

### 3. Interne links versterken
- Sectorpagina's linken vanuit de footer
- Een "Sectoren" overzichtspagina maken (bijv. `/sectoren`) die als hub dient

### 4. Afbeelding alt-teksten & lazy loading
Controleren of alle afbeeldingen `alt` attributen hebben (accessibility + SEO). Lazy loading toevoegen waar nodig.

### 5. Preconnect & performance hints
`<link rel="preconnect">` toevoegen voor externe bronnen (fonts, analytics) in `index.html` om laadtijd te verbeteren — Core Web Vitals tellen mee voor ranking.

### 6. Hreflang tag (toekomst)
Als er ooit een Belgisch-Franse of Engelse versie komt, hreflang tags toevoegen. Nu niet nodig, maar goed om te weten.

### 7. `noindex` op 404-pagina
Voorkomt dat een eventuele 404-pagina wordt geïndexeerd.

---

## Aanbevolen aanpak (wat nu impact heeft)
1. **Sectorpagina's in sitemap** — snel, direct effect
2. **FAQ sectie + JSON-LD** — rich snippets in Google
3. **Sectorenlinks in footer** — interne linkstructuur
4. **404 noindex meta tag** — clean index

## Technische details
- Sitemap: 8 sectorpagina's toevoegen aan `public/sitemap.xml`
- FAQ: nieuw component `FaqSection.tsx` met `application/ld+json` script
- Footer: sectorlinks grid toevoegen
- 404: `usePageMeta` aanroepen met robots noindex, of meta tag in NotFound.tsx

