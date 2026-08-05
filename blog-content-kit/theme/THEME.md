# THEME.md — adopt the host site's design (agent runbook)

**Goal:** make the kit's blog + admin look like they were always part of *this*
site, without hardcoding anything — so every site gets a unique skin from one
file. You are an AI agent; follow this to produce the site's `theme/theme.css`.

The kit is already **token-only**: every component styles itself with shadcn
semantic tokens (`bg-card`, `text-primary`, `border-border`, `font-display`, …).
Re-skinning = setting the right token *values*. Nothing else to touch.

---

## Decision: where does the design come from?

Work top-down; stop at the first that applies.

### Case A — Host repo already has a shadcn/Tailwind token layer  (most Lovable sites)
Look for `:root { --background: …; --primary: … }` in the host's `src/index.css`
(or `globals.css`) and a `colors: { primary: "hsl(var(--primary))" … }` block in
`tailwind.config.ts`.

→ **Do almost nothing.** The kit inherits the host theme automatically. Just:
1. **Don't** copy `theme/theme.css` (it would collide). Delete it from the install.
2. Merge only the `fontFamily` (display/body → `var(--font-*)`) and `maxWidth.prose`
   entries from `theme/tailwind.theme.ts` into the host config **if** the host
   doesn't already map `font-display`/`font-body`. If the host hardcodes those
   fonts, either add `--font-display`/`--font-body` vars to the host `:root` or
   change the kit's `font-display`/`font-body` usages to the host's font utility.
3. Skip to **Verify**.

### Case B — Host repo has NO token layer
Adopt `theme/theme.css` as the site's token layer:
1. Import it once (e.g. top of `src/index.css`: `@import "./theme/theme.css";`)
   or paste its `:root` / `.dark` blocks in.
2. Merge `theme/tailwind.theme.ts` (`kitTheme`) into `tailwind.config.ts`
   `theme.extend`.
3. Fill the token VALUES from the site's brand — continue to "Extract values".

### Case C — Building a brand-new site from a reference (URL / brand only)
Same as B, but derive the values from the reference site — "Extract values".

---

## Extract values from the existing website

Gather these six things, in priority order, from whatever source you have
(host CSS/Tailwind, a live URL, a brand/style guide, or the logo):

1. **Brand / primary color** → `--primary` (+ a readable `--primary-foreground`).
2. **Neutrals**: page background + main text → `--background`, `--foreground`;
   card surface → `--card`; subtle panel → `--muted` / `--secondary`; hairlines
   → `--border` / `--input`.
3. **Accent** (if distinct from primary) → `--accent`.
4. **Corner radius** (buttons/cards) → `--radius` (e.g. `0` sharp, `0.5rem`,
   `1rem` rounded).
5. **Fonts**: heading font → `--font-display`; body font → `--font-body`. Add the
   `@font-face`/Google Fonts `<link>` to `index.html`.
6. **Dark mode**: if the site has one, fill `.dark`; else keep the kit's dark
   defaults or drop `.dark` if the site is light-only.

How to source them:
- **From a repo**: read `index.css`/`globals.css` `:root`, `tailwind.config`
  `colors`/`fontFamily`/`borderRadius`, and `index.html` font links. Copy values.
- **From a live URL**: inspect `:root` custom properties and computed
  `background-color`/`color`/`font-family`/`border-radius` of the header, a
  button, and a card. Pull the logo's dominant color for `--primary`.
- **Convert to HSL channels**: tokens are `"H S% L%"` (no `hsl()` wrapper). Convert
  any hex/rgb you find. Always check text-on-surface contrast ≥ 4.5:1; nudge
  lightness if it fails.

Write the results into `theme/theme.css` (`:root` and, if used, `.dark`).

---

## Keep each site unique (modular knobs)

The design is unique *by construction* — it's derived from that site's own brand.
Beyond colors, vary these so two sites never feel templated:

- **Radius**: sharp vs pill changes the whole personality (`--radius`).
- **Type pairing**: `--font-display` vs `--font-body` (e.g. a serif display over a
  sans body reads editorial; geometric sans reads product).
- **Density**: `--prose-max-width` (tighter = more editorial), and the host's
  Tailwind `container` padding.
- **Surface depth**: how far `--card` / `--surface-2` sit from `--background`
  (flat vs layered).

Do NOT reintroduce hardcoded hex in components to achieve a look — express it
through tokens so it stays swappable.

---

## Note: give-away "print assets" are deliberately fixed

`src/components/buckets/giveaway/GiveawayRenderer.tsx` and `GiveawayAssetPage.tsx`
render printable A4 lead-magnets with an intentional standalone print aesthetic
(they are meant to look like a document, not the site chrome). They still carry
their own hex palette on purpose. If you want them on-brand too, map their palette
constants to the tokens above — but that's optional and separate from the site UI.

---

## Verify

1. Build passes (`npm run build`).
2. `/blog` and a `/blog/:slug` article render in the site's colors, fonts, and
   radius — compare side-by-side with an existing page of the site.
3. Toggle dark mode (if the site has it) — tokens flip, nothing hardcoded stays.
4. Contrast check on primary buttons and body text (≥ 4.5:1).
5. `grep -rinE "\[#[0-9a-fA-F]{6}\]|-amber-[0-9]{3}|Space Grotesk" src/` returns
   nothing outside the give-away print assets.

Report which case (A/B/C) applied, the six token groups you set, the source you
pulled them from, and anything you had to ask the user (e.g. missing brand color
or font files).
