# Post-generator

Van een blog, playbook, woordenboek-term of give-away naar drie social-posts met
bijpassende visual, klaar om als concept in Planable te zetten.

Adminscherm: `/admin/social`.

## De standaard

Alles wat "de standaard" is, staat op één plek: `supabase/functions/_shared/social.ts`.
De renderer, de generator-prompt en het adminscherm lezen daar allemaal uit, dus een
wijziging daar werkt meteen overal door. Het adminscherm haalt de catalogus op via
`GET /functions/v1/social-image?catalog=1`.

### Beeldformaten

| Formaat | Maat | Waarvoor |
| --- | --- | --- |
| `portrait` | 1080 × 1350 | Standaard. LinkedIn- en Instagram-feed, pakt de meeste hoogte. |
| `square` | 1080 × 1080 | Veilig voor alle kanalen tegelijk, ook Facebook en X. |
| `landscape` | 1200 × 630 | Link-preview en Open Graph. |
| `story` | 1080 × 1920 | Stories. |

### Visual-templates

| Template | Wanneer | Velden |
| --- | --- | --- |
| `statement` | Eén stelling of ongemakkelijke waarheid | kicker, headline, subline |
| `stat` | Eén hard cijfer draagt de post | kicker, stat, stat_label, subline, source_label |
| `steps` | Een aanpak of framework in 3 tot 5 stappen | kicker, headline, steps |
| `compare` | Oude werkwijze tegenover nieuwe | kicker, headline, left_label, left_items, right_label, right_items |
| `teaser` | Doorverwijzing naar een artikel of resource | kicker, headline, steps, source_label |

Elk template bestaat in elk formaat, in twee skins: `dark` (valt op in de tijdlijn)
en `light` (sluit aan op de site). Vaste opbouw: kicker met accentstreep, kop in
Space Grotesk, body in Inter, en onderaan het woordmerk met de site-URL of de bron.

De tekst wordt gemeten en past zich aan: `fitFontSize` verkleint de kop tot die
binnen het toegestane aantal regels valt, en `stack` verdeelt de blokken over het
vlak. Daardoor loopt geen enkele combinatie van template en formaat over de
voetregel heen, ook niet bij lange koppen.

### Kanalen

| Kanaal | Stem | Max. tekens | Hashtags |
| --- | --- | --- | --- |
| `linkedin_personal` | Peter, ik-vorm | 1300 | 0 – 3 |
| `linkedin_company` | Merk, wij-vorm | 1300 | 2 – 4 |
| `instagram` | Merk, visual-first | 900 | 5 – 8 |
| `facebook` | Merk, toegankelijk | 900 | 0 – 2 |
| `x` | Peter, één gedachte | 270 | 0 – 2 |

Standaard staat alleen `linkedin_personal` aan; de rest is per generatie aan te
vinken. Op LinkedIn-persoonlijk en Instagram blijft de link uit de post: die komt
terug als "link voor de eerste reactie".

## Onderdelen

| Onderdeel | Wat het doet |
| --- | --- |
| `supabase/functions/_shared/social.ts` | De standaard: templates, formaten, kanalen, bronnen, tekstmetriek en de SVG-opbouw. |
| `supabase/functions/social-image` | Rendert een visual als PNG (of SVG met `&as=svg`) en serveert de catalogus. Publiek, zonder JWT. |
| `supabase/functions/social-generate` | Leest de bron uit de database, laat het model drie invalshoeken schrijven per kanaal en slaat alles als draft op. |
| `supabase/functions/social-planable-push` | Zet de posts als concept in Planable. |
| `src/pages/admin/AdminSocialPosts.tsx` | Het scherm: bron kiezen, genereren, bijschaven, pushen. |
| Migratie `20260903120000_social_post_generator.sql` | Tabellen `social_post_batches` en `social_posts`, admin-only via RLS. |

## Werkwijze

1. Kies in `/admin/social` een bron (blog, playbook, woordenboek, give-away) of typ
   een vrij onderwerp.
2. Vink de kanalen aan en het aantal invalshoeken (standaard drie).
3. Genereer. Het model kiest per invalshoek een template en vult de visual-velden.
4. Schaaf bij: tekst per kanaal, template en formaat van de visual, en de kicker of
   kop op het beeld. Wijzigingen worden direct opgeslagen en de visual ververst mee.
5. "Zet klaar in Planable". De posts blijven concept; publiceren blijft mensenwerk.

Werkt het pushen nog niet, dan is het scherm nog steeds bruikbaar: elke post heeft
een kopieerknop en de visual is als PNG te openen en op te slaan.

## Planable koppelen

Nodig als Supabase secrets:

| Secret | Waarde |
| --- | --- |
| `PLANABLE_API_TOKEN` | Het Planable-token (`pln_...`). Hoort server-side, nooit in de client of in een chat. |
| `PLANABLE_WORKSPACE_ID` | De workspace waarin de posts moeten landen. |
| `PLANABLE_PAGES` | JSON die kanaal aan page-id koppelt, bijvoorbeeld `{"linkedin_personal":"<page-id>"}`. |

Workspace en pages mogen ook in de database staan, onder
`seo_settings.config.planable` als `{ "workspace_id": "...", "pages": { ... } }`.
Dat is handiger om aan te passen zonder opnieuw te deployen. Env gaat voor.

De push haalt eerst `api.planable.io/api/v1/openapi.json` op en leest daar het pad
en de veldnamen van de "post aanmaken"-operatie uit. Daardoor blijft de koppeling
werken als Planable een veld anders noemt, en levert een afwijking een leesbare
melding op in plaats van een kale HTTP-fout. Lukt het ophalen van de spec niet, dan
worden de gangbare namen gebruikt (`workspaceId`, `pageId`, `content`, `mediaUrls`).

Om de payload te bekijken zonder iets te versturen: roep de functie aan met
`{ "batch_id": "...", "dry_run": true }`.

## Visuals buiten de generator om

`social-image` is ook los te gebruiken, bijvoorbeeld voor een eenmalige visual:

```
/functions/v1/social-image?template=stat&format=portrait&skin=dark
  &kicker=Uit%20de%20nulmeting&stat=3%C3%97
  &stat_label=meer%20opportunities%20uit%20dezelfde%20lijst
```

Lijstvelden (`steps`, `left_items`, `right_items`) zijn pipe-gescheiden:
`&steps=Eerst%20dit|Dan%20dat|Tot%20slot%20dit`.

## Testen

De pure logica draait zonder netwerk of database:

```
deno test supabase/functions/_shared/social.test.ts
deno test supabase/functions/social-planable-push/planable.test.ts
```
