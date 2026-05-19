## Doel

De site herpositioneren van "wij regelen afspraken" naar "wij bouwen uw commerciële operating system". Scherper onderscheid t.o.v. leadbureaus, Datahub als kern, sectorpagina's verdiepen, Over Ons en Contact verrijken.

## Wijzigingen per pagina

### 1. Hero (`src/components/Hero.tsx` + `src/content/copy.ts`)
- Nieuwe H1: **"Stop met losse leadgeneratie."** met roterend accent op tweede regel ("Bouw een systeem dat elke week slimmer wordt.")
- Nieuwe subtekst: "Wij bouwen en beheren uw B2B groeimachine op uw eigen tools. Van marktdata, koopsignalen en outreach tot opvolging, CRM-discipline en geboekte gesprekken."
- CTA's blijven: "Plan de nulmeting" + "Hoe het werkt"
- Roterende woorden vervangen door 3 systeem-pijlers (bv. "data.", "signalen.", "opvolging.") óf statisch laten — voorstel: statisch + scherper.

### 2. Nieuw blok direct onder Hero: "Geen leadbureau"
- Nieuwe component `src/components/NoLeadAgencySection.tsx`
- Korte, harde claim: "Geen leadbureau. Geen tijdelijk trucje. Wij bouwen het commerciële proces achter voorspelbare groei."
- 3 contrastregels: Leadbureau levert lijsten ↔ wij bouwen systeem; tijdelijke campagne ↔ structureel leervermogen; afhankelijk van mensen ↔ proces + data.
- Plaats: tussen `<Hero />` en `<HookSection />` in `src/pages/Index.tsx`.

### 3. HookSection (probleem-blok) — kleine sharpening
- Kop blijven, body aanscherpen naar: "Uw salesproces hangt te veel aan mensen, losse acties en toevallige timing."

### 4. SystemSection (de machine) — labels herzien
- Stappen expliciet maken: Data → Signalen → Outreach → Kwalificatie → Afspraak → CRM → Leren → Opschalen.
- Controleren of `SystemSection.tsx` en/of `FunnelSection.tsx` deze lijn al volgen; tekst bijwerken.

### 5. DatahubSection — herpositioneren als kern
- Eyebrow/heading: "Het brein achter uw groei" i.p.v. add-on framing.
- Body: "Iedere campagne levert data op. Iedere reactie maakt het systeem slimmer. Iedere afspraak verrijkt uw commerciële geheugen."
- Prijs verplaatsen naar onderkant blok of weghalen (al zichtbaar in PricingSection).

### 6. Sectorpagina template (`src/pages/SectorPage.tsx` + `src/data/sectors.ts`)
Per sector 5 nieuwe blokken toevoegen aan datamodel:
- `voorbeeldcampagne` — korte case-achtige beschrijving
- `dataGebruikt` — welke databronnen/signalen
- `beslissers` — functietitels
- `naVierWeken` — concrete output na 4 weken
- `geenGoedeFit` — wanneer dit níet werkt (eerlijkheid = trust)

Datamodel uitbreiden, template-secties renderen, alle bestaande sectoren invullen (profvoetbal, groothandel, lease, engineering, zakelijke dienstverlening, maakindustrie). Geen specifieke meeting/aantal-beloftes (memory: brand voice).

### 7. Over Ons (`src/pages/OverOns.tsx`)
Pagina uitbreiden met:
- Opening: Rebel Force-afkomst, waarom B2BGroeiMachine ontstond
- Methodiek: 4-staps proces (verwijzen naar bestaande methodologie-memory: 4-weeks evaluatiecyclus)
- Filosofie: agnostisch, op eigen tools, geen vendor lock-in
- Tooling-aanpak (zonder logo's, conform brand rule)
- Link naar `/ons-team`

### 8. Contact (`src/pages/Contact.tsx`)
Boven het contactformulier 3 intent-kaarten:
- "Ik wil meer klanten" → ankert naar nulmeting / use case
- "Ik wil commercieel talent vinden" → naar recruitment-pagina
- "Ik wil mijn salesproces automatiseren" → naar full sales management
Elke kaart geeft `intent` mee aan tracking + scrollt naar formulier of linkt door.

### 9. Centrale copy (`src/content/copy.ts`)
Nieuwe blokken `noLeadAgency`, `heroV2`, `datahubCore` toevoegen zodat alle teksten centraal blijven (memory: centralized copy).

## Volgorde homepage na wijziging

```
Hero
NoLeadAgencySection            ← nieuw
HookSection (probleem)
StreamsSection (Marketing/Sales routes — blijft)
SystemSection (de machine, labels aangescherpt)
PipelineEquationTeaser
FunnelSection
ProcessSection
DatahubSection (als kern, niet add-on)
PricingSection
DeliveryModelSection (Build & Transfer vs Done-for-you)
ResultsSection
FaqSection
CtaSection
```

## Wat ik NIET doe

- Geen wijziging aan ambient glow background, routing, auth, of edge functions.
- Geen partner-/tool-logo's (brand rule).
- Geen specifieke meeting-aantallen of resultaatbeloftes (brand voice memory).
- Geen em-dashes; B1 NL, korte zinnen, 'u/uw'.

## Aannames

- Roterende woorden in hero vervangen door statische H1 met 1 gradient-accent op "elke week slimmer wordt" — als u liever de rotatie behoudt, zeg het.
- Sectorpagina-uitbreiding gebeurt voor álle bestaande sectoren in één keer; copy is generiek-realistisch (geen verzonnen klantnamen).
