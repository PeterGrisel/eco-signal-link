

## Plan: Fictief bedrijf als rode draad + visuele content blocks

### Concept
Introduceer een fictief bedrijf — **"Velox Solutions"** — een B2B SaaS scale-up die door de hele journey heen als case study fungeert. De student volgt Velox's reis door elke laag: hun ICP-fouten, hoe ze signalen verkeerd wogen, welke bronnen ze kozen, etc. Dit maakt de theorie concreet en herkenbaar.

Daarnaast worden visuele elementen (stat cards, mini-charts, before/after vergelijkingen) toegevoegd aan de "Waarom"-secties zodat het niet alleen tekst is.

### Wat verandert

**1. Nieuw datamodel voor waarom-content** (`src/signaal/data/layers.ts`)

Uitbreiding van de `waarom` interface:
```text
waarom: {
  headline: string;
  body: string;
  caseStudy?: {
    situation: string;    // "Velox targette 'tech companies'..."
    result: string;       // "Reply rate steeg van 2% naar 11%"
    lesson: string;       // One-liner takeaway
  };
  stats?: {
    before: { label: string; value: string };
    after: { label: string; value: string };
  };
  mistake?: { title: string; body: string };
  principle?: string;
}
```

Per laag wordt Velox-specifieke content geschreven:
- **Laag 1**: Velox definieert ICP te breed → verfijnt → resultaat
- **Laag 2**: Velox weegt alle signalen gelijk → ontdekt dat funding + job change 80% van deals voorspelt
- **Laag 3**: Velox gebruikt 7 bronnen tegelijk → verdrinking → terugschalen naar 3
- **Laag 4**: Velox's vage vragen vs. scherpe vragen — verschil in output
- **Laag 5**: Handmatig vs. geautomatiseerd — Velox mist 40% van signalen
- **Laag 6**: Te lage drempel → alert fatigue → bijstelling
- **Laag 7**: Generieke vs. gepersonaliseerde respons — conversie verschil

**2. Visuele componenten in JourneyLayer** (`src/signaal/components/JourneyLayer.tsx`)

Drie nieuwe visuele blokken in de "Waarom" sectie:

- **Case Study Card**: Donkere card met Velox logo/avatar, situatie-beschrijving, en een uitgelicht resultaat. Styling past bij het mission-control thema.
- **Stat Comparison**: Twee naast-elkaar geplaatste stat-cards (before/after) met grote cijfers en kleuraccenten (rood → groen).
- **Veelgemaakte Fout**: Warning-style card met oranje accent.
- **Kernprincipe**: Geel uitgelichte quote-block.

Geen externe libraries nodig — puur Tailwind + bestaande design tokens.

**3. Bestanden die wijzigen**

| File | Wijziging |
|---|---|
| `src/signaal/data/layers.ts` | Interface uitbreiden, alle 7 lagen voorzien van Velox case study + stats + mistake + principle |
| `src/signaal/components/JourneyLayer.tsx` | 4 nieuwe visuele blokken renderen in de waarom-sectie |

### Voorbeeld Laag 1 output

De student ziet na de theorie-tekst:

1. **Case Study card** met Velox avatar: *"Velox targette 'tech companies in Europa'. Na analyse van hun beste 20 deals verfijnden ze naar 'B2B SaaS, 50-200 FTE, met een nieuwe VP Sales, in de Benelux'."* → Resultaat: **"Reply rate: 2% → 11%"**

2. **Before/After stats**: Twee cards naast elkaar — "2% reply rate" (rood) vs. "11% reply rate" (groen)

3. **Veelgemaakte fout**: *"'Management' als functietitel matcht 12.000 mensen. 'VP Sales bij scale-ups met Series A' matcht 47 — en die zijn allemaal relevant."*

4. **Kernprincipe**: *"Hoe smaller je definitie, hoe sterker elk signaal dat erop volgt."*

