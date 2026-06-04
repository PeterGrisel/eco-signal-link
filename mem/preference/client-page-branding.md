---
name: Client Page Branding
description: Required overrides when generating new /voor/:slug client pages so all shared sections pick up the client's brand color
type: preference
---
Bij elke nieuwe `/voor/<slug>` clientpagina (zoals HegoPage, SealEcoPage) MOET het volgende gebeuren zodat alle gedeelde componenten meelopen in de brandkleur van de klant:

1. **PricingSection wrappen** in een `<div className="<slug>-brand">` met `--primary` CSS-variabele override (HSL waarden, zonder `hsl()`).
2. **In `src/index.css`** een `.<slug>-brand` blok toevoegen dat `.hego-brand` mirrort: override van `.text-gradient`, `.glow-bg`, `#pricing .rounded-2xl/.rounded-xl` (incl. hover), highlight card (`.border-primary/40.bg-primary/5|10`), en `#pricing .text-primary` legibility boost. Anders blijft "Schaalbare waarde." in oranje BGM-kleur staan.
3. **WaitlistHero** krijgt `accentColor={<brandPrimaryHex>}` mee. Zonder deze prop blijft de "werken al slimmer" headline en "Plan een meeting" knop in default blauw (#0079da) staan.
4. Brand palette als const bovenaan de page (`primary`, `primaryGlow`, `silver`, `surface`) — gebruik dezelfde naming als HegoPage zodat copy-paste werkt.

How to apply: kopieer SealEcoPage.tsx als template, vervang slug/kleuren, en voeg de bijbehorende `.<slug>-brand` CSS-regels toe aan `src/index.css`.
