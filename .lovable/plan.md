## Doel

Eén harde conversie: **nulmeting geboekt**. Elke sectie ondersteunt die actie of wordt geschrapt. Methode-HTML als visuele inspiratie voor één nieuwe sectie.

## Nieuwe sectievolgorde

```text
1.  Hero (aangescherpt)            ── headline + sub + dubbele CTA + sociaal bewijs strip
2.  Pijn → Oplossing (HookSection) ── 3 cards, herschreven op pijnpunten
3.  De Methode (NIEUW)             ── visuele 4-laagse uitleg, geïnspireerd op upload
4.  Bewijs (ResultsSection)        ── cijfers + 1 quote, eerder dan nu
5.  Process (7 stappen, ingekort)  ── "zo werkt het bij u"
6.  Pricing                        ── 6/12 mnd toggle blijft
7.  Mini-FAQ (3-4 bezwaren)        ── focus: tijd, geld, controle
8.  Final CTA (peter + agenda)     ── bestaand, sterker contrast
9.  Footer
```

**Geschrapt of verplaatst:**
- `FunnelInfographic`, `SectorPicker`, `LogoTicker`, `NoLeadAgencySection`, `SystemSection`, `PipelineEquationTeaser`, `FunnelSection`, `DatahubSection`, `DeliveryModelSection` → verplaatst naar sub-pagina's of geschrapt. Deze creëren afleiding en zwakken de hoofd-CTA af.
- Lange FAQ → ingekort tot 4 conversie-bezwaren; volledige FAQ blijft op /faq.

## Conversie-ingrepen per sectie

**Hero**
- Sub-kop uitbreiden met concreet beloofd resultaat (binnen X weken een werkend proces).
- Onder CTA's: micro-bewijsstrip (bv. "30 min · vrijblijvend · spreek direct Peter").
- Contactformulier rechts behouden (warme lane), CTA wint visueel.

**Pijn → Methode → Bewijs in 3 schermen**
Klassiek high-converting pattern: probleem erkennen, methode uitleggen, bewijs leveren — daarna pas prijs.

**Methode-sectie (nieuw)**
- 4 lagen verticaal: Infrastructure → Intelligence → Engagement → Qualification.
- Per laag: 1 icoon, 1 zin, 1 micro-output ("u krijgt: X").
- Sticky scroll of accordion. Eindigt met inline CTA "Plan de nulmeting".

**Mini-FAQ**
Vier vragen, allemaal conversie-bezwaren:
1. Hoe lang voor ik resultaat zie?
2. Wat als ik al een leadbureau heb?
3. Hoeveel tijd kost het mij intern?
4. Wat als het niet werkt?

**Sticky CTA (mobiel)** blijft, label wordt sterker.

## Copy-strategie

Alle nieuwe copy in `src/content/copy.ts` (centralized-copy regel). Bestaande propositie behouden, focus toevoegen op:
- Eén meetbaar resultaat per sectie
- "U" perspectief, max 12 woorden/zin
- Geen specifieke meeting-beloftes (brand-voice regel)

## Technische uitvoering

- Nieuwe component: `src/components/MethodeSection.tsx`
- Nieuwe component: `src/components/MiniFaq.tsx`
- `src/pages/Index.tsx`: rebuild sectievolgorde, oude imports weghalen (componenten zelf blijven bestaan voor sub-pagina's).
- `src/content/copy.ts`: blokken toevoegen voor `methode`, `miniFaq`, `heroProof`.
- `Hero.tsx`: sub-kop + proof-strip onder CTA's.
- `HookSection.tsx`: copy herschrijven naar pijn-frame.
- Geen wijzigingen aan routing, backend, of Signaal.

## Niet in scope

- Geen visuele redesign (kleuren/typografie/animatie-stijl blijven).
- Geen wijzigingen aan /signaal, /pricing detail, blog, admin.
- Geen A/B-test infra (kan later).

## Validatie

Na implementatie: visueel scrollen door homepage in preview, console check, link/CTA check (alle CTA's wijzen naar `BOOKING_URL` of `#hoe-het-werkt`).