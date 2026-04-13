

# Plan: Signaaldetectiesysteem — Fase 1 (Foundation)

We bouwen dit als sub-app binnen het bestaande project, met eigen routes onder `/signaal/`. We gebruiken Lovable native Stripe Payments en Lovable AI (geen Anthropic key nodig). Dit plan dekt stap 1-5 van de build order.

---

## Wat wordt gebouwd in deze eerste fase

1. **Database schema** — 5 nieuwe tabellen (profiles wordt hergebruikt als `signal_profiles`, journeys, journey_inputs, blueprints, agent_messages) met RLS policies
2. **Design tokens** — Nieuwe CSS variabelen voor het Signaal design system (dark theme, accent #E8FF47, DM Serif/DM Sans/JetBrains Mono fonts), gescheiden van bestaand design
3. **Auth flow** — `/signaal/start` met magic link login + naam/bedrijf onboarding
4. **Landing page** — `/signaal` met hero, 7-layer animatie, social proof, signal pyramid
5. **Journey shell** — `/signaal/journey` met 3-kolom layout (blueprint / engine / agent)
6. **Laag 01 compleet** — Definitie-laag met WAAROM/WAT/HOE secties, live blueprint update, agent integratie

---

## Technische details

### Routes (binnen bestaande App.tsx)
```
/signaal          → Landing page
/signaal/start    → Auth + onboarding
/signaal/journey  → Journey screen (protected)
/signaal/blueprint → Blueprint preview (later)
/signaal/admin    → Admin panel (later)
```

### Database tabellen (migration)
- `signal_profiles` — user profiles voor signaal app
- `journeys` — journey sessies per user
- `journey_inputs` — alle inputs per journey/laag
- `blueprints` — gegenereerd blueprint document
- `agent_messages` — agent conversatie historie

Alle tabellen krijgen RLS: users lezen/schrijven alleen eigen data.

### Design system
- Aparte CSS variabelen onder `.signaal-theme` class
- Geen conflicten met bestaande b2bgroeimachine design
- Google Fonts: DM Serif Display, DM Sans, JetBrains Mono

### AI Agent
- Lovable AI (Gemini Flash) via edge function `signal-agent`
- Systeem prompt in Nederlands zoals gespecificeerd
- Context-aware: stuurt journey inputs + huidige laag mee

### Componentstructuur
```
src/signaal/
├── pages/
│   ├── SignaalLanding.tsx
│   ├── SignaalStart.tsx
│   └── SignaalJourney.tsx
├── components/
│   ├── SignaalLayout.tsx
│   ├── JourneyLayer.tsx (herbruikbaar per laag)
│   ├── BlueprintPanel.tsx
│   ├── AgentPanel.tsx
│   ├── LayerProgress.tsx
│   └── layers/
│       └── Layer01Definitie.tsx
├── hooks/
│   ├── useJourney.ts
│   └── useAgent.ts
└── data/
    └── layers.ts (content per laag)
```

---

## Wat NIET in deze fase zit

- Lagen 02-07 (volgende iteratie)
- Blueprint screen + Stripe betaling
- Admin panel
- PDF generatie
- Mobile optimalisatie
- 90-daagse review prompt

---

## Volgorde van bouwen

1. Database migration uitvoeren
2. CSS design tokens + font imports toevoegen
3. SignaalLayout wrapper component
4. Landing page
5. Auth flow (magic link + onboarding)
6. Journey shell (3-kolom layout)
7. Laag 01 — Definitie (WAAROM/WAT/HOE)
8. Blueprint live assembly (linkerkolom)
9. Agent edge function + panel (rechterkolom)

