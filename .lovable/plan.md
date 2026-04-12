

## Plan: 4 nieuwe cheatsheets als gratis weggevers

### Overzicht

Vier nieuwe cheatsheet-pagina's toevoegen, gericht op founders/CEO's die hun B2B sales willen opschalen. Elke pagina volgt exact dezelfde structuur als de bestaande Signal Prospecting cheatsheet (hero, 4-stappen flow, prompt-blokken met copy-functie, CTA, feedback).

### De 4 cheatsheets

| # | Titel | Niveau | Tools | Slug | Setup-tijd |
|---|-------|--------|-------|------|------------|
| 1 | **LinkedIn Outreach Formules** | Beginner | LinkedIn, ChatGPT | `/cheatsheet/linkedin-outreach` | 10 min |
| 2 | **HubSpot Pipeline Setup in 30 min** | Beginner | HubSpot | `/cheatsheet/hubspot-pipeline` | 30 min |
| 3 | **ICP Scherpslijpen met AI** | Gevorderd | Claude, Apollo, LinkedIn | `/cheatsheet/icp-ai` | 20 min |
| 4 | **Multi-channel Sequencing Playbook** | Expert | Instantly, Apollo, LinkedIn | `/cheatsheet/multichannel-sequencing` | 45 min |

### Inhoud per cheatsheet

**1. LinkedIn Outreach Formules** (Beginner)
- 4 stappen: Profiel optimaliseren → ICP targeten → Connectieverzoek sturen → Follow-up
- 5 bewezen berichtsjablonen (connectieverzoek, follow-up, engagement-reactie, InMail, voice note script)
- Copy-paste prompts voor ChatGPT om berichten te personaliseren

**2. HubSpot Pipeline Setup in 30 min** (Beginner)
- 4 stappen: Dealfases instellen → Properties aanmaken → Automatiseringen → Dashboard
- Concrete dealfase-namen en definities voor B2B
- Template-properties en workflow-triggers

**3. ICP Scherpslijpen met AI** (Gevorderd)
- 4 stappen: Huidige klanten analyseren → Claude prompt voor ICP → Apollo filters → LinkedIn validatie
- AI-prompts om patronen in je klantenbestand te vinden
- Apollo filter-configuratie voor lookalikes

**4. Multi-channel Sequencing Playbook** (Expert)
- 4 stappen: Sequentie ontwerpen → E-mail setup (Instantly) → LinkedIn touchpoints → Calling scripts
- Dag-voor-dag sequentie-schema (14 dagen)
- Templates per kanaal met timing

### Technische wijzigingen

1. **4 nieuwe pagina-bestanden** — Elk volgt het SignalCheatsheet.tsx patroon (hero, stappen, prompt-cards, feedback, CTA)
2. **`src/pages/Cheatsheets.tsx`** — Array uitbreiden met 4 nieuwe entries
3. **`src/App.tsx`** — 4 nieuwe routes toevoegen
4. **Tools-filter** wordt automatisch uitgebreid (ChatGPT, HubSpot, Instantly verschijnen als filterknoppen)

### Aanpak
- Alle content in het Nederlands, B1-taalniveau, korte zinnen
- Elke pagina bevat het `CheatsheetFeedback` component
- Affiliate-links waar relevant (Apollo, Instantly)

