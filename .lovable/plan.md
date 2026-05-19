## Doel

De geüploade infographic "B2B Groeimachine — van signalen naar schaalbare groei" volledig in code nabouwen als responsive React-component. Geen afbeelding embedden: alles SVG + Tailwind, themed via design tokens, zodat het past in de bestaande dark theme met #E8945A accent.

## Nieuwe component: `src/components/FunnelInfographic.tsx`

Layout in 3 horizontale lagen (top → bottom):

### 1. Header
- H2 "B2B GROEIMACHINE" (display, bold, "B2B" in primary accent)
- Subkop "VAN SIGNALEN NAAR SCHAALBARE GROEI" (tracking-wide, smaller)
- Body: "Een schaalbaar B2B commercieel systeem dat elke week slimmer wordt."

### 2. TOF / MOF / BOF rail
- Drie hexagon-badges (SVG polygon) met labels TOF / MOF / BOF
- Verbonden met dashed lijnen
- Kleuren: paars / teal / oranje (matchend met de funnel-lagen eronder)

### 3. Funnel grid — 3 kolommen op desktop, gestapeld op mobiel

**Kolom links — "SIGNALEN & DATA · B2B FOCUS"** (5 kaarten):
- Bedrijfsdata · Koopsignalen · Gedrag & Interactie · Externe bronnen · CRM & Historische data
- Elk: icoon (lucide: Building2, TrendingUp, User, Globe, Database), titel, korte body
- Connector-lijnen (SVG, absolute positioned) lopen naar de funnel-laag rechts ernaast

**Kolom midden — De funnel zelf** (4 trapezium-vormen, SVG):
- AWARENESS (paars) — Zichtbaarheid & Bereik — Eye icon
- ENGAGEMENT (teal) — Interactie & Interesse — MessageSquare icon
- CONVERSIE (geel/amber) — Kwalificatie & Intentie — Target icon
- SALES (oranje) — Gesprekken & Deals — Handshake icon
- Elke laag: SVG polygon met gradient stroke + glow, label binnenin
- Onderaan stroomt het samen naar het brein (System of Intelligence)

**Kolom rechts boven — "TOOLS & CONNECTIES VASTGELEGD IN DE FUNNEL"** (4 groepen):
- Awareness: LinkedIn Ads, Google Ads, Content & SEO
- Engagement: LinkedIn Outreach, E-mail Sequences, Retargeting
- Conversie: Landingspagina's, Forms & CTA's, Lead Scoring
- Sales: CRM, Sales Engagement, Meeting Scheduler
- **Belangrijk (brand rule):** GEEN tool-/partner-logo's. Vervang LinkedIn/Google/HubSpot logos door neutrale lucide-iconen (Megaphone, Search, FileText, Send, Mail, Target, Layout, ClipboardList, ListChecks, Database, Headphones, CalendarCheck)
- Connector-lijnen van funnel-laag naar deze groep

**Kolom rechts uiterst — "METEN WAT TELT · SIGNAL BASED"** (8 KPI's, gepaard per funnel-laag):
- Awareness: Bereik (Impressies), Klikratio (CTR)
- Engagement: Reacties (% Engagement), Antwoordratio (% Reply)
- Conversie: Leads (Conversieratio), Kwaliteit (SQL %)
- Sales: Gesprekken (Aantal), Deals (Win Rate / €)
- Elk: icoon + metric naam + sub-label

### 4. System of Intelligence blok
- Centrale cirkel met brein-icoon (lucide Brain), gradient glow
- Rechts daarvan: "SYSTEM OF INTELLIGENCE" + body "Optioneel — Het zenuwcentrum van uw B2B groeimachine. Verbindt, verrijkt, analyseert en leert van elke interactie."

### 5. Onderbalk — 5 voordelen
Card-rij (grid-cols-2 md:grid-cols-5):
- Centrale intelligentie · Real-time signalen · Leer & Optimaliseer · Voorspelbare groei · Volledige controle
- Elk: icoon + titel + 1 zin

### 6. Footer claim
"100% B2B FOCUS" (primary, tracking-wide)
"Geen leads. Geen lijsten. Geen tijdelijke trucs."
"Wij bouwen het **commerciële systeem** achter voorspelbare B2B groei." (accent op middendeel)

## Technische aanpak

- **Funnel-vormen:** één `<svg>` met 4 trapezium `<polygon>` lagen, elk eigen gradient (defs/linearGradient) en stroke-glow via filter. Breedte loopt af: 100% → 85% → 70% → 55%.
- **Connector-lijnen:** absolute-positioned SVG overlay over de grid; gebruik `stroke-dasharray` met subtiele animatie (framer-motion `pathLength`) op view-enter.
- **Responsive:** 
  - Desktop (lg+): 3-kolom grid zoals upload
  - Tablet (md): funnel midden, data-kaarten boven, tools/KPI's onder
  - Mobile: alles gestapeld, connectors verborgen, funnel-lagen als full-width kaarten
- **Theming:** alle kleuren via tokens (`--primary`, `--accent`, semantic funnel-kleuren toevoegen aan `index.css` als `--funnel-awareness`, `--funnel-engagement`, `--funnel-conversion`, `--funnel-sales` in HSL).
- **Animaties:** framer-motion stagger op funnel-lagen (top → bottom fade-in), data-kaarten slide-in from left, tools slide-in from right, brein scale-in als laatste.
- **Geen logos:** alle "platforms" als lucide-iconen + tekstlabels (brand rule).
- **Copy:** toevoegen aan `src/content/copy.ts` onder `funnelInfographic` blok zodat alles centraal blijft.

## Plaatsing op homepage

In `src/pages/Index.tsx` vervangt deze component de huidige `<FunnelSection />` (of komt direct daarboven), omdat hij dezelfde rol vervult maar visueel veel sterker is. Voorstel: **vervangen**.

Volgorde: Hero → NoLeadAgencySection → HookSection → StreamsSection → SystemSection → PipelineEquationTeaser → **FunnelInfographic** → ProcessSection → DatahubSection → PricingSection → ...

(Oude `FunnelSection.tsx` met stap-mockups verhuist naar een sub-pagina `/hoe-het-werkt` of blijft beschikbaar voor sectorpagina's — niet verwijderen.)

## Wat ik NIET doe

- Geen partner-/tool-logo's (brand rule)
- Geen afbeelding van upload embedden — alles native React/SVG
- Geen wijziging aan routing, auth, data of edge functions
- Geen em-dashes; B1 NL

## Aannames

- "System of Intelligence" mag de NL-naam "Systeem van intelligentie" krijgen óf Engels blijven zoals in de upload. **Voorstel: NL** ("Intelligentielaag") tenzij u het Engels wilt houden.
- Funnel-laag kleuren afstemmen op huidige theme: paars/teal/amber/primary-oranje voor de 4 lagen.
- Component-bestand wordt groot (~500 regels). Als u liever per kolom een sub-component, splits ik in: `FunnelShape.tsx`, `FunnelDataColumn.tsx`, `FunnelToolsColumn.tsx`, `FunnelKpiColumn.tsx`, `IntelligenceCore.tsx`.
