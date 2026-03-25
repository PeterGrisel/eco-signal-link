

## Logo/Partner Ticker - Plan

### What
Add an infinitely scrolling partner logo ticker below the hero section, matching the "Proud Partners OF:" style from rebelforce.nl.

### Implementation

**1. Create `src/components/LogoTicker.tsx`**
- "Proud Partners OF:" label above the ticker
- Horizontal infinite marquee using CSS animation (`@keyframes marquee` translating from 0 to -50%)
- Two duplicated sets of logos side-by-side for seamless looping
- Use the actual partner logos from rebelforce.nl (framerusercontent.com URLs)
- Logos rendered as grayscale with hover:grayscale-0 for polish
- Subtle top border separator, muted styling to not compete with hero

**2. Add marquee keyframes to `tailwind.config.ts`**
- Add `marquee` keyframe: `{ "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } }`
- Add `animate-marquee` animation class (~30s linear infinite)

**3. Update `src/pages/Index.tsx`**
- Import and place `<LogoTicker />` between `<Hero />` and `<StreamsSection />`

### Visual Result
A smooth, continuously scrolling row of partner logos beneath the hero, with a small "Proud Partners OF:" heading -- identical in feel to rebelforce.nl.

