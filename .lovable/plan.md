# Plan: Home, landingspagina's en content engine verbeteren

## Analyse van uw v2-document

De v2-copy zet een sterkere propositie neer dan de huidige homepage:

- **Huidige hero**: roterend woord "uw [salesproces / pipeline / groei / resultaat]" — abstract, geen concrete pijn.
- **v2 hero**: *"Minder handmatig werk. Minder reactief reageren. Meer resultaat."* + nulmeting-CTA — concreet, B1, koppelt aan een eerste stap.
- **Belofte**: v1 = "leadgeneratiebureau". v2 = "wij vinden handmatig en reactief werk en automatiseren het". Past beter bij uw werkelijke service-mix (sales + service + operatie) en bij de cases (Leister, Zondervantechniek).
- **Bewijs**: v2 brengt twee cross-sector cases. v1 leunt op generieke claims.
- **SEO-anker**: *b2b leadgeneratie* (1.300/mnd, KDI 23) — realistisch om page 1 te halen, mits we ook "wat is" + "hoe" varianten dekken. Concurrent-analyse (Marketing Guys, IMU) bevestigt dat patroon.
- **Risico**: pricing op aanvraag verlaagt conversie van prijs-gevoelige bezoekers. Mitigatie: "vanaf"-indicatie behouden op /pricing.

## Fase 1 — Homepage refactor (week 1)

Bouw de v2-structuur in op `src/pages/Index.tsx`, hergebruik wat al werkt:


| v2 sectie                 | Bestaand component              | Actie                                                        |
| ------------------------- | ------------------------------- | ------------------------------------------------------------ |
| Meta + Hero               | `Hero.tsx`                      | Nieuwe H1, sub, CTA "Plan de nulmeting"                      |
| Sectie 1 — Patroon        | `HookSection.tsx`               | 3 cards met v2-tekst (handmatig / reactief / gemist signaal) |
| Sectie 2 — Hoe wij werken | `ProcessSection.tsx`            | 4 stappen: nulmeting → kaart → automatiseren → uitvoeren     |
| Sectie 3 — Voor wie       | `SystemSection.tsx`             | Herkenbare bullets + sector-chips                            |
| Sectie 4 — Bewijs         | `ResultsSection.tsx`            | Cases Leister + Zondervantechniek                            |
| Sectie 5 — 90 dagen       | nieuwe `TimelineSection`        | Fase-tabel uit v2                                            |
| Sectie 6 — Investering    | `PricingSection.tsx`            | "Vast tarief, 3 mnd opzegbaar"-blok                          |
| Sectie 7 — Onderscheid    | nieuwe `DifferentiatorsSection` | 4 punten                                                     |
| FAQ                       | `FaqSection.tsx`                | 6 nieuwe vragen + FAQPage JSON-LD                            |
| Close                     | `CtaSection.tsx`                | "Plan de nulmeting · binnen 5 werkdagen"                     |


Metadata: title naar *"B2B Leadgeneratie & Procesautomatisering — B2BGroeiMachine"* (60 chars). Description uit v2.

## Fase 2 — Drie sector-landingspagina's (week 2)

Reuse de `SectorPage.tsx`-template, voeg toe aan `src/data/sectors.ts`:

1. `/sectoren/maakindustrie` — anker *"b2b leadgeneratie maakindustrie"*. 
2. `/sectoren/bouw-en-renovatie` — anker *"procesautomatisering bouw"*. 
3. `/sectoren/technische-dienstverlening` — anker *"verkoopproces optimaliseren technische dienstverlening"*. 

Per pagina: hero met sector-pijn, 4-staps proces, één case, FAQ (3 vragen), CTA nulmeting. Helmet met unieke title/description/canonical.

## Fase 3 — Content engine (week 3–6)

### Pijler-artikelen (cornerstone, 1.500+ woorden)


| URL                             | Target keyword       | NL volume |
| ------------------------------- | -------------------- | --------- |
| /blog/wat-is-b2b-leadgeneratie  | b2b leadgeneratie    | 1.300     |
| /blog/wat-is-leadgeneratie      | leadgeneratie        | 1.900     |
| /blog/zakelijke-leads-genereren | zakelijke leads      | 480       |
| /blog/sales-automatisering-b2b  | sales automatisering | long-tail |


### Cluster-artikelen (500–900 woorden, linken naar pijler)

- "5 processen in elk B2B-bedrijf die vandaag nog handmatig lopen"
- "Waarom uw reparatiedata een verkoopkans is die u mist"
- "Wat is signaalgebaseerde prospecting"
- "Hoe bouw je een B2B sales pipeline in 90 dagen"
- "Intent data uitleg: wanneer is een lead koopklaar"
- "CRM als sturingsinstrument vs CRM als archief"

### Engine-mechaniek

- Autopilot draait al (`autopilot-run` edge function); priority anchor keywords aanvullen in `seoSettings`.
- `RelatedSolutions` voor bidirectionele linking pijler ↔ cluster ↔ sector.
- Maandelijks: top-pages check via Semrush + GSC, herschrijf onderpresterende cluster-stukken (Backlinko-refresh).

## Fase 4 — Conversie en meting (doorlopend)

- Tracking-event `cta_nulmeting_click` toevoegen.
- A/B test op /pricing: "op aanvraag" vs "vanaf €X / maand".
- 4-wekelijkse evaluatie (sluit aan op bestaande methodology-cyclus).

## Wat ik na akkoord ga bouwen (Fase 1 + 2)

1. Hero, Process, FAQ refactor met v2-copy.
2. Nieuwe `TimelineSection` en `DifferentiatorsSection`.
3. FAQPage JSON-LD op de homepage.
4. Sector-data uitbreiden met maakindustrie, bouw, technische dienstverlening.
5. Eerste pijlerblog "wat is b2b leadgeneratie" als cornerstone.

## Niet in scope (apart akkoord)

- Per-route Helmet uitrol op álle pagina's (komt uit eerdere SEO-finding).
- Volledig open prijs-model op /pricing.
- Nieuwe cases voordat resultaten beschikbaar zijn.