import Chapter01Scenario from "./chapters/Chapter01Scenario";
import Chapter03TwoWays from "./chapters/Chapter03TwoWays";
import Chapter04Methode from "./chapters/Chapter04Methode";
import Chapter05Brein from "./chapters/Chapter05Brein";
import Chapter06Blauwdruk from "./chapters/Chapter06Blauwdruk";
import Chapter07Schaal from "./chapters/Chapter04Schaal";
import Chapter08Funnel from "./chapters/Chapter08Funnel";
import Chapter09Modules from "./chapters/Chapter09Modules";
import Chapter10Levering from "./chapters/Chapter10Levering";
import CtaFinale from "./CtaFinale";

/**
 * Cinematic homepage narrative — 5 acts woven into one stage.
 */
export default function HomepageNarrative() {
  return (
    <main className="cinematic-home relative">
      {/* ACT I — HET PROBLEEM */}
      <Chapter01Scenario />

      {/* ACT II — DE OMSLAG: vroeger vs nu */}
      <Chapter03TwoWays />

      {/* ACT III — HET FUNDAMENT (het brein dat onthoudt) */}
      <Chapter05Brein />

      {/* ACT IV — DE METHODE (hoe wij werken) */}
      <Chapter04Methode />

      {/* ACT V — WAT U KRIJGT (blauwdruk, modules, schaal) */}
      <Chapter06Blauwdruk />
      <Chapter09Modules />
      <Chapter07Schaal />

      {/* ACT VI — DE OPERATIE (funnel + levering) */}
      <Chapter08Funnel />
      <Chapter10Levering />

      {/* FINALE */}
      <CtaFinale />
    </main>
  );
}