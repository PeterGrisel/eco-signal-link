

## Verbeterplan: Cheatsheet Pagina

### Wat we aanpakken

**1. Mobiele responsiveness**
- Hero: responsive padding (`px-4 md:px-12`, `pt-28 md:pt-32`)
- 4-stappen flow: verticaal stapelen op mobiel, horizontaal op desktop
- Cards grid: al `grid-cols-1 md:grid-cols-2`, maar inner padding aanpassen

**2. Copy-knop op prompts**
- Elke PromptBlock krijgt een "Kopieer" knop rechtsboven
- Gebruikt `navigator.clipboard.writeText()` met een korte "Gekopieerd!" feedback via toast of inline state

**3. Google Fonts verplaatsen**
- Font `<link>` verplaatsen naar `index.html` `<head>` (of verwijderen als de fonts al elders geladen worden)
- Verwijder de `<link>` uit de JSX

**4. Apollo affiliate link klikbaar maken**
- `get.apollo.io/Your-b2b-link` als echte `<a href>` met `target="_blank"`

**5. Breadcrumb / teruglink**
- Subtiele "← Alle cheatsheets" link boven de hero of in de hero zelf

**6. Styling opschonen (licht)**
- Waar mogelijk inline styles vervangen door Tailwind classes
- Behoud het donkere thema maar gebruik CSS variabelen waar het kan

### Bestanden die wijzigen
- `src/pages/SignalCheatsheet.tsx` — hoofdpagina (responsiveness, copy-knop, breadcrumb, font-link weg, affiliate link)
- `index.html` — font link toevoegen (indien nog niet aanwezig)

### Wat we NIET doen
- Volledig redesignen — het visuele ontwerp blijft intact
- Inline styles volledig omzetten naar Tailwind — dat is een grotere refactor voor later

