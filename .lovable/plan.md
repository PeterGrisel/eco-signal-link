
# Hoe het werkt — Frontal-stijl rebuild

Volledige nieuwe pagina op route `/hoe-het-werkt-v2` (zodat de huidige pagina blijft staan en je kunt vergelijken). 10 secties die de structuur van frontal.so volgen, gevuld met B2BGroeiMachine-content. **Geen partner-logo's of tool-badges** — vervangen door signaal-categorieën met onze eigen iconen (lucide-react + BgmIcon).

## Routing
- Nieuwe route `/hoe-het-werkt-v2` in `App.tsx`
- Nieuwe pagina `src/pages/HoeHetWerktV2.tsx`
- Eigen secties als losse componenten onder `src/components/hhwv2/`

## Secties

**01 — Hero met signaal-flow**  
Headline links: "Groei voorspelbaar zonder meer mensen." Subkop + e-mail capture + "Bekijk hoe het werkt" link. Rechts: 6 signaal-labels bovenaan ("Funding", "Hiring", "Websitebezoek", "Job changes", "Tech-stack", "Intent") met SVG-paths die samenkomen in een centrale "B2B Engine"-node (BgmIcon, oranje glow).

**02 — Twee paden**  
Twee kaarten naast elkaar: "Eerst het fundament" (90-dagen build) vs "Direct uitvoering" (Execution Layer). Elk met sub-labels en CTA.

**03 — Het probleem**  
3 stat-kaarten (vergelijkbare Nederlandse cijfers/bronnen: tijdverlies sales, slechte data, gefragmenteerde tools). Daaronder een "uit sync"-diagram: 4 afdelingen (Marketing, Sales, RevOps, CS) met rode "uit sync" labels ertussen — getekend met tekstlabels, geen logo's.

**04 — De B2B Engine**  
Het centrale flow-diagram: links 6 signaal-bronnen (categorieën, geen logo's), midden een Engine-blok met 5 stappen (Clean → Enrich → Score → Human-in-the-loop → Route), rechts een "Geroute reeks" met 6 acties (Accountlijst, Sequence, Belwachtrij, Ads-audience, CRM-taak, Owner notified). SVG-paths met motion-glow tussen kolommen.

**05 — De 90-dagen build**  
3 fases als horizontale kaarten met mini-mockup per fase:
- Fase 1 (Week 1-3): Data — accountscores
- Fase 2 (Week 3-7): Signaal — live signaal-feed
- Fase 3 (Week 7-12): Plays — signaal→play schema

**06 — Wat is een play?**  
Headline + 3 voorbeeld-plays als horizontale stappen-strips (Signaal → Enrich → Score → Personalize → Run). Onze 3 voorbeelden: "Funding-trigger outreach", "Pricing-pagina bezoek", "Champion job-change". Onderaan: category-pills met aantal plays.

**07 — De Execution Layer**  
3 service-blokken (GTM-engineering, Ads-engineering, Content-engineering) elk met 5-staps flow-strip. Heading: "Al een fundament? Start bij uitvoering."

**08 — Waarom B2BGroeiMachine (vergelijkingstabel)**  
Tabel met kolommen: B2BGroeiMachine vs SDR's inhuren vs AI-tool vs Ander bureau vs Zelf bouwen. 5 rijen (in jouw stack, fixt data/signalen/routing, draait GTM+ads+content, AI+menselijk oordeel, eigenaar van systeem).

**09 — Proof**  
Stats + case-grid. Hergebruikt bestaande `CaseStudiesSection` data of nieuwe lichtgewicht grid met onze klant-cijfers uit `src/data/caseStudies.ts`. **Geen** klantlogo-strip (memory regel).

**10 — FAQ**  
6 vragen in collapsible accordion (shadcn `Accordion`). Vragen vertaald naar onze propositie.

**Eind-CTA**  
Grote sectie "Zie wat wij in jouw go-to-market zouden bouwen" + CtaLink naar gratisScan.

## Visuele aanpak
- Donker grid-canvas: `bg-[radial-gradient(...)]` + subtle dot/line pattern (CSS, geen extra deps)
- Oranje glow: `box-shadow: 0 0 60px hsl(var(--primary)/.4)` op centrale nodes
- Flow-lijnen: inline SVG `<path>` met `stroke="hsl(var(--primary))"` + Framer Motion `pathLength` animation
- Animatie: `motion.div` met fade-in-up bij viewport entry (consistent met rest van site)
- Typography: bestaande Space Grotesk display + Inter body (geen wijziging)
- Alle iconen: `lucide-react` + `BgmIcon`

## Wat NIET in deze pagina
- Geen tool-logo's, partner-badges, of klantlogo-tickers
- Geen team-foto's (gebruik bestaande `/ons-team` link)
- Geen Stripe/pricing — link naar bestaande secties

## Bestanden
- `src/pages/HoeHetWerktV2.tsx` (nieuwe pagina)
- `src/components/hhwv2/HeroFlow.tsx`
- `src/components/hhwv2/TwoPathsSection.tsx`
- `src/components/hhwv2/ProblemSection.tsx`
- `src/components/hhwv2/EngineFlow.tsx` (kerncomponent — centrale flow)
- `src/components/hhwv2/NinetyDayBuild.tsx`
- `src/components/hhwv2/PlaysSection.tsx`
- `src/components/hhwv2/ExecutionLayer.tsx`
- `src/components/hhwv2/ComparisonTable.tsx`
- `src/components/hhwv2/ProofSection.tsx`
- `src/components/hhwv2/FaqSection.tsx` (of hergebruik bestaande)
- `src/components/hhwv2/GridCanvas.tsx` (achtergrond)
- `src/App.tsx` — route toevoegen

## Copy
Alle tekst conform memory: B1 Nederlands, max 12 woorden per zin, "je/jouw", geen em-dashes. Inhoud uit jouw bestaande proposities (Awareness/Engagement/Activities, signaal-gedreven, 4-weken cycli).
