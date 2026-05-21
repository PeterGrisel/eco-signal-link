# SEO Avalanche Strategie

Keyword-targeting principe: **Google vertrouwt keywords pas wanneer een site al relevant verkeer heeft.** Je begint dus klein.

## Het algoritme

1. Haal dagelijks GSC data op (laatste 30 dagen).
2. Filter branded queries weg (bevatten merknaam).
3. Bereken `avgDailyNonBrandedClicks`.
4. `avalancheThreshold = avgDailyNonBrandedClicks`.
5. **Nieuwe content mag alleen targeten op keywords met `monthlySearchVolume <= 30 * avalancheThreshold`.**

## Voorbeeld
- Gem. 3 niet-branded kliks/dag → threshold = 3 → max keyword volume = 90/maand.
- Site groeit naar 50 kliks/dag → max keyword volume = 1500/maand.
- Site groeit naar 500 kliks/dag → max = 15.000/maand (high-volume terms unlocked).

## Implementatie

```ts
// In content autopilot, voor keyword selection
const gsc = await fetchGSCData({ days: 30 });
const nonBranded = gsc.filter(q => !q.query.toLowerCase().includes(BRAND_NAME.toLowerCase()));
const avgDaily = nonBranded.reduce((s,q) => s + q.clicks, 0) / 30;
const maxVolume = Math.max(30, Math.round(avgDaily * 30)); // floor van 30 voor cold start

const candidates = await keywordResearch(topic);
const allowed = candidates.filter(k => k.volume <= maxVolume);
```

## Per project configureren
- `BRAND_NAME` — voor branded filter
- GSC `siteUrl` — domain property of URL-prefix
- Cold start floor (default 30) — minimum threshold voor sites zonder data

## Waarom
Targeten op high-volume keywords zonder authority = pagina's die nooit ranken. Avalanche dwingt incrementele autority opbouw.
