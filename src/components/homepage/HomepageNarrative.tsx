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

      {/* 6. Commercieel brein (radial) — eerste stap onder de 8 stappen */}
      <Chapter05Brein />

      {/* 7. Beste klanten worden blauwdruk */}
      <Chapter06Blauwdruk />

      {/* 8. Impressies → deal */}
      <Chapter08Funnel />

      {/* 9. Modules */}
      <Chapter09Modules />

      {/* 10. Levering */}
      <Chapter10Levering />

      {/* 11. 3 flipcards (verplaatst van hero) */}
      <div id="section-flipcards">
        <HomepageHook />
      </div>

      {/* 12. CTA finale — een gesprek, een machine */}
      <CtaFinale />
    </main>
  );
}