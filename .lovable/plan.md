

## Verbeterplan: Maximale waardebeleving voor €97

Na analyse van de volledige journey (landing, start, 7 lagen, blueprint) zijn dit de verbeteringen die de gebruiker het gevoel geven dat ze veel meer krijgen dan ze betalen.

---

### 1. Betaling verplaatsen naar vóór de journey (niet bij blueprint)

**Probleem nu:** Gebruikers starten gratis, doorlopen de hele journey, en betalen pas bij de blueprint-export. Dit voelt als een upsell na gratis werk.

**Oplossing:** Stripe checkout op `/signaal/start` — betaal €97 → ontvang magic link → start journey. De blueprint is dan automatisch ontgrendeld.

- Checkout flow inbouwen in `SignaalStart.tsx` na email-invoer
- Journey pas toegankelijk na betaling (check `paid` status in `journeys` tabel)
- Blueprint blur/paywall verwijderen — alles is direct beschikbaar na betaling

---

### 2. Voortgangsindicator met "waarde-meter"

**Toevoeging:** Een visuele indicator bovenaan de journey die toont hoeveel van het blueprint al is ingevuld, gecombineerd met een schatting van de bespaarde tijd.

- "U heeft nu 4/7 lagen geconfigureerd"
- "Geschatte tijdbesparing met dit systeem: ~12 uur/week"
- Groeit mee naarmate de gebruiker vordert

---

### 3. Samenvatting per laag na voltooiing (recap card)

**Probleem nu:** Na het afronden van een laag krijgt de gebruiker alleen een toast. Geen moment om terug te kijken op wat ze hebben gebouwd.

**Oplossing:** Een "Laag afgerond" overzichtskaart met:
- Wat ze hebben geconfigureerd (korte samenvatting)
- Velox milestone van die laag
- Quiz score van die laag
- Motiverende tekst voor de volgende laag

---

### 4. Interactieve voorbeelden in de "Waarom" sectie

**Toevoeging:** Per laag een mini-simulatie of interactief voorbeeld dat het concept tastbaar maakt. Bijvoorbeeld:
- Laag 1 (Definitie): Een live calculator die toont hoeveel prospects overblijven als je filters toevoegt
- Laag 2 (Signaalgewichten): Een mini-scoring demo met slider die laat zien hoe gewichten de ranking beïnvloeden
- Eenvoudige UI-elementen, geen backend nodig

---

### 5. Blueprint PDF-export verbeteren

**Probleem nu:** "PDF download komt binnenkort" — dit is de kern van het product en moet er direct zijn.

**Oplossing:** Een gestileerde, downloadbare samenvatting genereren (HTML-to-PDF via de browser) met:
- Bedrijfsnaam en datum
- Alle 7 lagen met ingevulde configuratie
- Velox vergelijkingen per laag
- Aanbevolen tools overzicht
- 90-daagse review checklist

---

### 6. Persoonlijke context door het hele traject

**Toevoeging:** De bedrijfsnaam en industrie die in laag 1 worden ingevuld, doorvoeren in latere lagen:
- Velox Tips aanpassen: "Voor een bedrijf als [bedrijfsnaam] in [industrie]..."
- Agent berichten contextualiseren met de ingevulde data
- Blueprint header met bedrijfsnaam

---

### 7. Eind-scherm na laag 7: "Uw systeem is compleet"

**Probleem nu:** Na laag 7 verschijnt een kale "Journey voltooid" pagina met alleen score en link.

**Oplossing:** Een feestelijk eindscherm met:
- Confetti-animatie of visueel hoogtepunt
- Overzicht van alle 7 lagen met status
- Totale quiz score
- Direct link naar het volledige blueprint
- Optie om het blueprint te delen of te downloaden
- CTA naar B2B Groei Machine diensten ("Wilt u dat wij dit systeem voor u implementeren?")

---

### Technische aanpak

| Stap | Bestanden | Impact |
|------|-----------|--------|
| Betaling vóór journey | `SignaalStart.tsx`, `SignaalJourney.tsx`, DB migration | Hoog — kern businessmodel |
| Waarde-meter | `SignaalJourney.tsx` | Medium — perceived value |
| Recap cards | `JourneyLayer.tsx` | Medium — leerervaring |
| Interactieve voorbeelden | `layers.ts`, `JourneyLayer.tsx` | Hoog — "wow" factor |
| PDF export | `SignaalBlueprint.tsx` | Hoog — tastbaar resultaat |
| Persoonlijke context | `JourneyLayer.tsx`, `AgentPanel.tsx` | Medium — personalisatie |
| Eind-scherm | `SignaalJourney.tsx` | Medium — afsluiting |

De prioriteit is: **betaling vóór journey** (1), **PDF export** (5), **eind-scherm** (7), en dan de rest.

