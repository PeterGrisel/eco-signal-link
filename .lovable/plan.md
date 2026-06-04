## Probleem

De `personal` velden voor coolmark bevatten ruwe markdown: `**bold**` markers, kapotte link-fragmenten (`Startset](https://...)`), dubbele spaties en escapes (`\\`). De UI rendert die als platte tekst, dus de "Het karakter van Coolmark" sectie laat onleesbare brij zien (zie screenshot).

Twee oorzaken:
1. `harvestTextFromMarkdown` strip alleen complete markdown links `[text](url)`. Wanneer alleen het tweede deel `](url)` overblijft (bijv. door eerdere truncation in Firecrawl), blijft de URL staan.
2. `**`, `\\`, image-tags `![..]`, en multi-space artefacten worden niet verwijderd. Bullets en tagline komen daardoor letterlijk met `**` in de UI.

## Oplossing

Eén edge function aanpassen — geen UI of database schema wijzigingen.

### `supabase/functions/abm-brand-extract/index.ts`

Voeg een `cleanInline(text)` helper toe die per regel:
- `![alt](url)` image-tags verwijdert
- `[text](url)` vervangt door `text`
- losse `](url)` fragmenten verwijdert (regex `\]\(https?:\/\/[^)]+\)`)
- `**` en `__` markers strip (bold/italic)
- backslash-escapes (`\\`, `\_`, `\*`) opruimt
- meerdere spaties/tabs samenvoegt tot één spatie
- trimt en lege strings als ongeldig markeert

Pas `harvestTextFromMarkdown` aan zodat:
- elke regel eerst door `cleanInline` gaat vóór de skip/length checks
- pitch-kandidaten die nog `http`, `](`, of `]` bevatten worden overgeslagen
- bullets die na cleaning < 8 of > 90 chars zijn worden overgeslagen
- tagline ook door `cleanInline` gaat
- duplicates op lowercase basis worden gefilterd

Verlaag pitch-ondergrens niet; sla simpelweg eerste paragraaf over die nog markdown-residu bevat. Als geen geldige pitch gevonden wordt, val terug op `summary` (gebeurt al).

### Re-trigger

Na deploy de function opnieuw aanroepen voor `coolmark` met de bestaande `ABM_PUBLISH_KEY` curl flow (zoals eerder), zodat `payload.personal` opnieuw geschreven wordt met schone tekst.

## Niet doen

- Geen markdown-renderer in `AbmPage.tsx` toevoegen. De velden moeten platte zinnen zijn, niet markdown.
- Geen extra DB-velden of nieuwe edge function.
- Geen wijziging aan branding/gallery/upload logica — die werkt correct (gallery beelden zijn goed).

## Bestand

- `supabase/functions/abm-brand-extract/index.ts` — `cleanInline` helper + gebruik in `harvestTextFromMarkdown`.
