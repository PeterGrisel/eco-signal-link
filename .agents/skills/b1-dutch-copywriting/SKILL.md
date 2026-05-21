---
name: b1-dutch-copywriting
description: Use when writing or editing Dutch marketing/UI copy for B2BGroeiMachine (homepage, sectorpagina's, blogs, CTA's, e-mail). Triggert op "copy", "tekst", "schrijven", "headline", "CTA", "blog", "B1".
---

# B1 Dutch Copywriting — B2BGroeiMachine

Doel: bezoeker binnen 3-6 seconden vasthouden. Schrijf zoals een ervaren consultant praat: direct, concreet, zonder jargon.

## Harde regels

- Maximaal 12 woorden per zin. Splits langere zinnen.
- Spreek de lezer aan met **u** / **uw** (nooit "je"/"jij").
- Geen em-dashes (—). Gebruik komma's, dubbele punten of nieuwe zin.
- Getallenreeksen voluit: "3 tot 5", niet "3-5".
- Geen abstract zakelijk jargon ("synergie", "ecosystem", "leverage"). Concreet werkwoord wint.
- Sentence case in headers (alleen eerste woord en eigennamen met hoofdletter).

## Toon

Rustig, zelfverzekerd, feitelijk. Geen superlatieven of marketing-hype ("revolutionair", "ongekend"). Beloof nooit specifieke meetings of resultaten — beloof het proces.

## CTA's

Minimalistisch en werkwoord-gestuurd: "Bekijk pricing", "Plan kennismaking", "Lees casestudie". Niet "Ontdek nu de kracht van...".

CTA-copy staat centraal in `src/content/copy.ts`; gebruik `<CtaLink>`-component in plaats van losse tekst hardcoden.

## Blog-specifiek

- Backlinko inverted pyramid: conclusie/kernpunt eerst, daarna detail.
- Geen H1 in markdown (de template rendert die).
- Sentence case headers.

## Verboden domeinen in copy

Geen voorbeelden of cases uit non-profit of healthcare. Focus op commerciële B2B.

## Self-check voor je oplevert

1. Elke zin ≤ 12 woorden?
2. "u/uw" consistent?
3. Geen em-dashes?
4. Geen vendor-/tool-namen als belofte (agnostisch)?
5. Sentence case in koppen?