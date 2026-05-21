import Chapter01Scenario from "./chapters/Chapter01Scenario";
import Chapter02Context from "./chapters/Chapter02Context";
import Chapter03TwoWays from "./chapters/Chapter03TwoWays";
import Chapter04Methode from "./chapters/Chapter04Methode";
import Chapter05Brein from "./chapters/Chapter05Brein";
import Chapter06Blauwdruk from "./chapters/Chapter06Blauwdruk";
import Chapter07Schaal from "./chapters/Chapter04Schaal";
import Chapter08Funnel from "./chapters/Chapter08Funnel";
import Chapter09Modules from "./chapters/Chapter09Modules";
import Chapter10Levering from "./chapters/Chapter10Levering";
import Chapter11Bewegingen from "./chapters/Chapter11Bewegingen";
import CtaFinale from "./CtaFinale";

/**
 * Cinematic homepage narrative — 5 acts woven into one stage.
 */
export default function HomepageNarrative() {
  return (
    <main className="cinematic-home relative">
      {/* ACT I — HET PROBLEEM */}
      <Chapter01Scenario />
      <Chapter02Context />

      {/* ACT II — DE METHODE */}
      <Chapter03TwoWays />
      <Chapter04Methode />

      {/* ACT III — HET FUNDAMENT */}
      <Chapter05Brein />
      <Chapter06Blauwdruk />
      <Chapter07Schaal />

      {/* ACT IV — DE OPERATIE */}
      <Chapter08Funnel />
      <Chapter09Modules />
      <Chapter10Levering />

      {/* ACT V — DE BELOFTE */}
      <Chapter11Bewegingen />

      {/* FINALE */}
      <CtaFinale />
    </main>
  );
}