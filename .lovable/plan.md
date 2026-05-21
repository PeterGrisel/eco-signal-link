## Doel
Een eigen icon-systeem dat herkenbaar B2BGroeiMachine voelt: dunne lijnen, geometrisch, met een subtiel signaal/orbit-DNA (kleine punt, gebogen lijn, of stroke-end accent in #E8945A). De set vervangt Lucide op de plekken die merk-bepalend zijn, en laat Lucide intact voor utility-iconen (chevrons, x, loader, etc.) waar custom geen waarde toevoegt.

## Aanpak (gefaseerd)

### Fase 1 — Icon library opzetten (deze beurt)
Nieuwe map `src/components/icons/` met:
- `BgmIcon.tsx` — basis-wrapper (size, strokeWidth, className, accent prop voor oranje accent-detail)
- `index.ts` — barrel export
- ~24 custom SVG-iconen voor de meest brand-bepalende plekken:
  - **Architectuur/proces**: Signal, Brain, Layers, Workflow, Target, Radar, GitBranch, Activity, Gauge, Magnet
  - **Resultaat/KPI**: TrendingUp, BarChart3, Trophy, Sparkles, Zap, Rocket
  - **Mens/relatie**: Users, Handshake, UserCheck, MessageSquare
  - **Operatie**: Database, Wrench, Shield, Repeat

Elk icoon: 24×24 viewBox, `stroke="currentColor"`, `strokeWidth={1.5}`, `fill="none"`, ronde lijneindes. Eén klein accent-detail (punt, korte lijn, of cirkel) dat optioneel in `--brand` (oranje #E8945A) kleurt via een `<circle className="text-brand">` met `fill="currentColor"` binnen een aparte group — zo blijft het icoon monochroom waar gewenst, of krijgt het oranje accent waar het mag schitteren.

### Fase 2 — Showcase + gefaseerde vervanging (volgende beurten, op jouw signaal)
- Eerst een interne demo-route `/icons-preview` zodat je de set kunt beoordelen voor we gaan vervangen
- Daarna stapsgewijs swap in: Hero hook-cards → Architectuur sectie → Pricing → Service add-ons → Datahub → Brandstory
- Utility-iconen (ArrowRight, Check, X, ChevronDown, Loader2, Copy, ExternalLink) blijven Lucide — geen merkwaarde, wel risico op inconsistentie als we ze namaken

## Waarom niet alles in één keer
134 bestanden gebruiken Lucide met 80+ unieke iconen. Alles in één klap vervangen = breekrisico, en utility-iconen tekenen voegt niks toe aan het merk. Beter: custom waar het telt, Lucide waar het neutraal mag zijn.

## Te bevestigen
1. Akkoord met deze scope (24 brand-iconen nu, utility blijft Lucide)?
2. Accent-strategie: subtiel oranje detail per icoon (mijn voorstel), of puur monochroom dunne lijn?
