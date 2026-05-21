# Blog Enrichment (Backlinko + E-E-A-T)

## Schrijfstijl
- **Backlinko/Brian Dean toon**: toegankelijk, menselijk, "inverted pyramid" (conclusie eerst, dan uitleg).
- **Sentence case** voor alle koppen (H2/H3/H4). Geen Title Case.
- **GEEN H1 in markdown** — titel wordt door CMS op paginaniveau gerenderd. H1 in body = dubbele H1 = SEO penalty.
- Korte alinea's (max 3 zinnen). Subkoppen elke 200-300 woorden.

## Verplichte E-E-A-T elementen per artikel
| Element | Minimum | Doel |
|---|---|---|
| Externe links naar autoritaire bronnen | 5 | Trust/authority |
| Interne links naar eigen diensten/blogs | 2 | Topic clustering |
| Expert quotes met bronvermelding | 2 | Expertise signal |
| Visuele verrijking | 1+ | Engagement |

## Visuele verrijking
- **Inline React Infographics** voor processen, vergelijkingen, statistieken (geen statische images).
- **AI-gegenereerde abstracte 3D illustraties** als hero/section breaks.
- Geen stock photos.

## Link styling
- `className="text-primary underline"`
- Externe links: `target="_blank" rel="noopener noreferrer"`
- Interne links: gewone `<Link>` of `<a href="/...">`

## Generator prompt checklist
Wanneer een AI artikel genereert, dwing dit af in de system prompt:
1. Geen `# H1` in output
2. Sentence case headers
3. Inverted pyramid: TL;DR/key takeaway als eerste paragraaf
4. Lijst van 5+ externe bronnen met URL
5. 2 quotes met `> "..." — Naam, Functie, Bedrijf`
6. Suggesties voor 2 interne links (slug + reden)
