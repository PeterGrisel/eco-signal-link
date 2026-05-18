## Waarom dit nodig is

Phase 1 heeft alleen Hero, HookSection en FAQ aangepast. De rest van de homepage praat nog over "Plan een Demo", "Gebouwd voor resultaat" en een lineair 4-staps proces. Daardoor breekt het verhaal halverwege: bezoeker leest "begin met een nulmeting", maar krijgt verderop een ander frame en een andere CTA. Hieronder de aanpassingen om het narratief consistent te maken.

## Secties die mee moeten

### 1. SystemSection ("Zo werkt het" → "Gebouwd voor resultaat")
- Eyebrow blijft "Zo werkt het", H2 wordt: **"Eerst in kaart. Dan automatiseren."**
- Intro-alinea toevoegen onder H2: "Wij beginnen met een nulmeting van uw sales- en serviceproces. Daarna automatiseren we wat handmatig loopt en zetten we signalen om in afspraken."
- 4 layers (Infrastructuur / Intelligence / Betrokkenheid / Kwalificatie) behouden, maar laag 01 hernoemen naar **"Nulmeting & infrastructuur"** met copy die aansluit op de nulmeting-CTA.
- Principles-blok ("Het proces levert data") laten staan, copy ongewijzigd.

### 2. ProcessSection ("In 4 weken operationeel")
- Eyebrow: "Van nulmeting tot resultaat".
- H2: **"In 4 weken live."**
- Stap "Week 1 tot 2" hernoemen naar **"Week 0 — Nulmeting"** (huidige items aanvullen met "Sales- en serviceproces in kaart" en "Quick wins identificeren").
- Stappen 2 en 3 ongewijzigd.
- Het ingebouwde "Wij beheren / U doet het zelf" blok in deze sectie verwijderen (dubbel met DeliveryModelSection).

### 3. CtaSection (onderaan home)
- H2: **"Klaar voor uw nulmeting?"**
- Subkopie: "30 minuten. Wij brengen uw proces in kaart en laten zien waar de winst zit. Geen verkoopgesprek."
- CTA-tekst: **"Plan de nulmeting →"** (link blijft Motion-meeting), `trackCTA` label: `CTA Section — Plan de nulmeting`.
- Microcopy onder knop: "€0 · 30 minuten · Vrijblijvend".

### 4. PricingSection
- Bottom CTA ongewijzigd, maar twee "Plan een Demo" knoppen (desktop + mobile in stap 1) worden **"Plan de nulmeting →"** met bijbehorende `trackCTA`-labels.

### 5. StickyHeroCta + Navbar
- Verifiëren dat de sticky CTA en navbar-CTA dezelfde tekst "Plan de nulmeting" voeren. Aanpassen indien nodig (geen scope-uitbreiding, alleen label + tracking).

### 6. DeliveryModelSection, StreamsSection, DatahubSection, FunnelSection, PipelineEquationTeaser, ResultsSection
- Inhoudelijk geen wijziging. Deze secties beschrijven aanbod/sectoren/bewijs en blijven on-brand. Wel snelle check: nergens nog "Plan een Demo" als CTA-tekst (anders meenemen in dezelfde pass).

## Niet in scope
- Visuele redesign van secties
- Nieuwe componenten of routes
- Aanpassingen aan SectorPage of solution-pagina's
- Wijzigingen in tracking-infrastructuur (alleen labels)

## Technisch
Bestanden geraakt: `SystemSection.tsx`, `ProcessSection.tsx`, `CtaSection.tsx`, `PricingSection.tsx`, `StickyHeroCta.tsx`, `Navbar.tsx`. Alleen copy + `trackCTA` labels. Geen state/logic-wijzigingen.
