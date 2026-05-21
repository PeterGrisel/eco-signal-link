---
name: tracking-injection-safety
description: Use when adding, editing, or debugging third-party tracking/marketing scripts (Apollo, GA4, LinkedIn Insight, Meta Pixel, HubSpot, etc.) in this project. Triggert op "tracking", "pixel", "Apollo", "analytics script", "pre-hide", "GTM", "page hidden".
---

# Tracking Injection Safety

Externe scripts mogen de UI nooit blokkeren. Eerdere Apollo Form Enrichment incidents verborgen de hele pagina via `#apollo-form-prehide-css`. De injector heeft daarom verplichte guardrails.

## Regels

1. **Alleen op productie injecteren.** Preview-omgevingen en admin-routes krijgen geen tracking. Gating op hostname/env, niet op build-flag alleen.
2. **Database-toggle per script.** Elk script heeft een `is_active` flag. Standaard `false` voor risicovolle scripts (Apollo Form Enrichment is bewust uit).
3. **Safety Guard draait altijd.** Na injectie en op interval: verwijder bekende pre-hide elementen en herstel zichtbaarheid.

   ```ts
   document.getElementById('apollo-form-prehide-css')?.remove();
   document.documentElement.style.visibility = 'visible';
   document.body.style.visibility = 'visible';
   document.documentElement.style.opacity = '1';
   ```

4. **HTML5-constraint.** `<noscript><img/></noscript>` pixel-fallbacks horen in `<body>`, nooit in `<head>` (alleen metadata-tags zijn daar geldig).
5. **Geen blocking `<script>` zonder `async`/`defer`.**

## Bij debug van "pagina is wit / onzichtbaar"

1. Inspect DOM op `*-prehide-css` style-elementen.
2. Check `html`/`body` inline `visibility`/`opacity`.
3. Check of een tracking-script per ongeluk op preview draait.
4. Zet `is_active=false` voor de verdachte source in de DB voordat je verder graaft.

## Apollo specifiek

Apollo Form Enrichment is **expliciet uitgeschakeld** en moet uit blijven tot er een bewezen non-blocking integratiepath is. Niet stilletjes heractiveren.