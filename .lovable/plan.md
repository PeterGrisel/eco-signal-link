# Plan: Homepage copy-update (Hero → Probleem → Pijnen → Proces)

Pure copy- en structuur-wijzigingen. Geen nieuwe businesslogica. Alle componenten blijven Framer Motion + bestaande design tokens gebruiken.

## 1. Hero — `src/components/Hero.tsx`

- **Pill**: `Voor ambitieuze B2B-bedrijven` → `Voor directies met commerciële groeidoelen`.
- **Headline**: drie regels, twee-toon:
  - Regel 1 (bold foreground): `Uw groeidoel is helder.`
  - Verbinder (light muted): `Nu nog`
  - Regel 2 (gradient bold): `de commerciële machine die het waarmaakt.`
- **Subkop** vervangen door:
  > Veel B2B-bedrijven willen groeien, maar het bestaande team komt niet toe aan structurele acquisitie, opvolging en marktontwikkeling. B2BGroeiMachine bouwt en draait de commerciële engine die nieuwe kansen signaleert, activeert en opvolgbaar maakt.
  > 
  > _NB: bevat zinnen >12 woorden — splits volgens B1-regel naar 3 korte zinnen._
- **Secundaire CTA**: anchor `#diensten` → `#proces`, label `Bekijk hoe we dit oplossen`.
- **Tertiaire link**: ongewijzigd.
- **heroMotions** array (6 chips) vervangen:
  1. Nieuwe klanten werven (UserPlus)
  2. Slapende relaties activeren (RotateCcw)
  3. Nieuwe markten openen (Globe)
  4. Partners vinden (Handshake)
  5. Lokale groei versnellen (MapPin)
  6. Salescapaciteit vergroten (Briefcase)
- **Trust-cluster**: tekst `Vertrouwd door snelgroeiende B2B-teams` → `Vertrouwd door ambitieuze B2B-teams`. Subtekst + logo's onveranderd.

## 2. Probleem + Vergelijking — `src/components/Gtm2026Section.tsx`

- **Eyebrow**: `Even stilstaan` → `De echte groeiblokkade`.
- **H2** (twee regels):
  - `Uw team wil wel groeien.`
  - gradient: `Maar het systeem ontbreekt.`
- **Body** (onder H2): nieuwe lange tekst (gesplitst in korte zinnen, B1):
  > De groeidoelstelling is duidelijk. Maar het bestaande team is ingericht op klanten bedienen. Niet op structureel nieuwe markt ontwikkelen. Accountmanagers zijn druk met lopende klanten. Marketing levert losse acties. CRM is vooral administratie. Leads en signalen worden te laat opgevolgd. Daardoor blijft groei afhankelijk van toeval en netwerk.
- **Intro boven tabel** vervangen door:
  > Meer software, een losse campagne of een extra hire lost dit meestal niet op. U heeft een commercieel systeem nodig dat strategie, data, campagnes en opvolging aan elkaar knoopt.
- **Tabel `rows`** volledig vervangen door 8 nieuwe features:
  1. Lost het gebrek aan commercieel ritme op — ✓ / ✗ / Soms / ✗ / ✗
  2. Combineert strategie, data en uitvoering — ✓ / ✗ / Soms / Soms / Alleen advies
  3. Signaleert nieuwe kansen proactief — ✓ / Soms / ✗ / ✗ / ✗
  4. Maakt opvolging concreet voor sales — ✓ / ✗ / ✓ / Soms / ✗
  5. Werkt op uw bestaande tools en CRM — ✓ / Soms / ✓ / ✗ / ✓
  6. Binnen 30 dagen operationeel — ✓ / "Setup varieert" / "Inwerktijd" / Soms / ✓
  7. Uit te breiden met telefonische opvolging — ✓ / ✗ / ✓ / Soms / ✗
  8. Geen vendor lock-in — ✓ / ✗ / "—" / ✗ / ✓

## 3. NIEUW — "Herkenbare pijnen" sectie

Nieuwe component `src/components/HerkenbareSection.tsx` (apart bestand, niet inproppen in Gtm2026 om die overzichtelijk te houden). Geregistreerd in `src/pages/Index.tsx` tussen `<Gtm2026Section />` en `<HowItWorksSection />`.

- Eyebrow: `Herkenbaar?`
- H2: `Dit is waar groei vaak vastloopt.`
- Body: `Niet omdat de markt er niet is. Maar omdat niemand structureel eigenaar is van het vinden, activeren en opvolgen van nieuwe kansen.`
- 6 pijnkaarten in grid (3×2 op desktop, 1-koloms mobiel), elk met titel + body conform copy. Iconen uit lucide (Users, Inbox, Crown, Split, MapPinned, Database). Stijl: zelfde `card-gradient border-glow rounded-2xl p-6` als HowItWorksSection voor visuele samenhang.

## 4. Hoe het werkt — `src/components/HowItWorksSection.tsx`

- **Eyebrow**: `Het systeem in 3 stappen` → `Zo lossen we het op`.
- **H2** (twee regels):
  - `Van groeidoel naar`
  - gradient: `commerciële uitvoering.`
- **Body** vervangen door:
  > Wij bouwen een B2B Engine die uw markt zichtbaar maakt, doelgroepen activeert en commerciële signalen omzet in concrete opvolging. Niet als losse campagne, maar als doorlopend groeisysteem.
- **STEPS array** subtitle + summary herschrijven (labels en featured-positie blijven):
  - 01 Awareness — subtitle: `We maken zichtbaar waar de commerciële kansen zitten.` / summary: `We vertalen uw groeidoel naar concrete doelgroepen, accounts, contactpersonen en signalen.` / resultaat ongewijzigd.
  - 02 Engagement — subtitle: `We activeren de markt met gerichte campagnes.` / summary: `We brengen uw doelgroep in beweging via e-mail, LinkedIn, content en nurture flows.`
  - 03 Activities — subtitle: `We zetten signalen om in concrete salesactie.` / summary: `We zorgen dat sales, accountmanagement of directie weet wie moet worden opgevolgd, waarom en met welke boodschap.`
- **Onderlink**: label naar `Bekijk de uitvoerende playbooks achter deze 3 stappen`.

## Out of scope

- Pricing, FAQ, CTA-sectie en overige hoofdstukken blijven ongewijzigd.
- Geen nieuwe routes/datalagen.

## Technisch

- Alleen presentatie. Geen state, geen API, geen i18n-toevoegingen (Hero heeft geen EN-variant in de bestaande file).
- Alle copy voldoet aan B1 ≤12 woorden per zin (lange brongoten worden gesplitst).
- Geen em-dashes; `u/uw`; sentence case in subtitles waar passend.
