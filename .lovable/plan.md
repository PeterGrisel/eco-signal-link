## Pricing herstructurering: van 3 plannen naar 4 B2B Engine tiers

### Doel
`src/components/PricingSection.tsx` ombouwen van het huidige "Growth System / Sprint / SDR" model naar een tier-structuur met **Start / Growth / Scale / Partner Engine**, plus add-ons en een vergelijkingstabel.

### 1. Nieuwe tier-structuur (vervangt `buildFases`)

| Tier | Prijs p/m | GTM-uren | Positie |
|---|---|---|---|
| **Start Engine** | €1.500 | 4u | Instap / marktvalidatie |
| **Growth Engine** | €2.250 | 8u | Hoofdaanbod — **Meest gekozen** |
| **Scale Engine** | €3.500 | 16u | Managed groei |
| **Partner Engine** | vanaf €5.000 | maatwerk | Multi-account / enterprise |

- Minimale looptijd: **3 maanden**, daarna maandelijks opzegbaar
- USD-equivalenten in `PRICES` bijwerken (≈ €→$ koers behouden, +10%)
- 12-maanden toggle (−20%) blijft werken op alle 4 tiers behalve Partner (blijft "vanaf")

### 2. Card-grid layout
- Wijzig grid van `lg:grid-cols-3` naar `lg:grid-cols-4` (op md `grid-cols-2`)
- Growth Engine krijgt `highlight: true` + "Meest gekozen" badge bovenaan
- Partner Engine toont "vanaf €5.000" + CTA "Bespreek situatie" i.p.v. prijs
- Korte feature-lijst per kaart (5-6 punten, B1 Dutch)

### 3. Nieuwe vergelijkingstabel onder de kaarten
Nieuwe component `ComparisonTable` met rijen:
- Doelgroepen (1 / 2 / 3-4 / Maatwerk)
- Campagneflows (1 / 2 / 3+ / Maatwerk)
- E-mailactivatie, LinkedIn-activatie, Dataverrijking, Engagement scoring
- CRM-verwerking, Rapportagefrequentie, GTM-service uren
- Responsive: op mobiel als stacked accordeon of horizontal scroll

### 4. Add-ons sectie (nieuw blok onder vergelijkingstabel)
Vervangt huidige generieke `ServiceCards` met concrete add-ons:
- Telefonische opvolging — vanaf €500 p/m
- Extra GTM-uren — €125 p/u
- Extra doelgroep — €350 p/m
- Extra LinkedIn-account — €250 p/m
- HubSpot inrichting — vanaf €1.500 eenmalig
- Content engine — vanaf €750 p/m
- Performance model — maatwerk

Layout: 3-koloms grid met kleine kaartjes (titel + prijs + 1 regel uitleg).

### 5. Copy-aanpassingen (NL + EN)
- **Eyebrow**: "Commercieel model" → blijft
- **Headline**: "Lage drempel. Schaalbare waarde." → **"Kies de B2B Engine die past bij uw groeifase."**
- **Subhead**: "Geen losse campagnes. Een commerciële machine die elke maand kansen signaleert, activeert en opvolgbaar maakt."
- Sprint-tekst volledig weg uit `T.nl` en `T.en`
- Alle copy volgt B1 Dutch regels: max 12 woorden/zin, u/uw, geen em-dashes

### 6. Performance Partnership blok
- Blijft staan onder de tiers (ongewijzigd) — past goed bij Partner Engine narrative

### Technisch
- Alleen wijzigingen in `src/components/PricingSection.tsx`
- `Fase` type uitbreiden met optionele velden: `commitment?: string`, `gtmHours?: string`
- Nieuwe sub-component `ComparisonTable` binnen hetzelfde bestand
- Nieuwe sub-component `AddOnsGrid` vervangt `ServiceCards`
- Geen wijziging aan props-signatuur (`language`, `currency`) → werkt automatisch op alle `/voor/:slug` client pages
- Memory `mem://business/pricing-structure` wordt na implementatie geüpdatet naar de nieuwe 4-tier structuur

### Niet in scope (later)
- Aparte detail-pagina per Engine-tier
- Stripe checkout-koppeling per tier
- Toggle voor "per uur losse capaciteit" — komt in vervolgiteratie