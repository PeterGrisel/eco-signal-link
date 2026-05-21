---
name: content-system
description: Complete content systeem voor B2B/SaaS websites — blog enrichment (Backlinko, E-E-A-T), SEO Avalanche keyword strategie via Google Search Console, Content Autopilot met external-link validation gate, en centralized copy/CTA architectuur (copy.ts + CtaLink). Activeer bij het opzetten van content/blog/SEO voor een nieuwe website, of bij werk aan blog generatie, keyword strategie, link validatie, of CTA componenten.
---

# Content System

Herbruikbaar content-systeem voor B2B websites. Vier pilaren — laad de reference die past bij wat u doet.

## Pilaren

| Onderdeel | Reference | Template |
|---|---|---|
| Blog stijl + enrichment (Backlinko, E-E-A-T) | `references/blog-enrichment.md` | — |
| Keyword strategie via GSC data | `references/seo-avalanche.md` | — |
| Auto-publish met link validation | `references/content-autopilot.md` | `assets/validate-external-links.template.ts` |
| Centralized copy + CTA component | `references/centralized-copy.md` | `assets/copy.template.ts`, `assets/CtaLink.template.tsx` |

## Wanneer activeren

- Nieuw website project waar blog/content centraal staat
- Bestaande site die SEO/content opzet
- Werk aan: blog generator, content autopilot, CTA refactor, keyword research flow

## Volgorde bij nieuwe site

1. **Centralized copy** eerst (`copy.ts` + `CtaLink`) — voorkomt copy drift vanaf dag 1
2. **Blog enrichment regels** vastleggen in CMS/generator prompts
3. **Link validation** edge function deployen voordat eerste blog live gaat
4. **SEO Avalanche** activeren zodra GSC connector verbonden is (minimaal 30 dagen data)

## Aanpassingen per project

Templates zijn gebouwd voor B2BGroeiMachine. Per nieuwe site aanpassen:
- `copy.ts`: BOOKING_URL, propositie-zinnen, brand toon
- `validate-external-links`: interne hosts in skip-lijst
- SEO Avalanche: GSC site URL en branded-term filter

## Schrijfstijl

Standaard NL B1 (zie `references/blog-enrichment.md` voor blog-specifieke regels). Voor andere talen/markten alleen de structuurregels overnemen, niet de B1-NL conventies.
