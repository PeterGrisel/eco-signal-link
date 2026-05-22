import Chapter03TwoWays from "./chapters/Chapter03TwoWays";
import Chapter04Methode from "./chapters/Chapter04Methode";
import Chapter05Brein from "./chapters/Chapter05Brein";
import Chapter06Blauwdruk from "./chapters/Chapter06Blauwdruk";
import Chapter07Schaal from "./chapters/Chapter04Schaal";
import Chapter08Funnel from "./chapters/Chapter08Funnel";
import Chapter09Modules from "./chapters/Chapter09Modules";
import Chapter10Levering from "./chapters/Chapter10Levering";
import ScenarioSideScroller from "./ScenarioSideScroller";
import HomepageHook from "./HomepageHook";
import CtaFinale from "./CtaFinale";
import ScrollReveal from "./ScrollReveal";

/**
 * Homepage narrative — vaste volgorde:
 * Hero (in Index) → Brein → Twee kanten → Smederij → Cijfers → 8 stappen →
 * Commercieel brein → Blauwdruk → Impressies → Modules → Levering →
 * 3 flipcards → CTA finale → Pricing (in Index).
 */
export default function HomepageNarrative() {
  return (
    <main className="cinematic-home relative">
      {/* 2. Twee kanten */}
      <Chapter03TwoWays />

      {/* 3. Smederij — side scroller met 5 cards */}
      <div id="section-smederij">
        <ScenarioSideScroller />
      </div>

      {/* 4. Cijfers */}
      <Chapter07Schaal />

      {/* 5. 8 stappen */}
      <Chapter04Methode />

      {/* 6-11. Reveal-stack: elk blok kantelt en schaalt in beeld */}
      <ScrollReveal><Chapter05Brein /></ScrollReveal>
      <ScrollReveal><Chapter06Blauwdruk /></ScrollReveal>
      <ScrollReveal><Chapter08Funnel /></ScrollReveal>
      <ScrollReveal><Chapter09Modules /></ScrollReveal>
      <ScrollReveal><Chapter10Levering /></ScrollReveal>
      <ScrollReveal>
        <div id="section-flipcards">
          <HomepageHook />
        </div>
      </ScrollReveal>

      {/* 12. CTA finale — een gesprek, een machine */}
      <CtaFinale />
    </main>
  );
}