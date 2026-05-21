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
import ActBridge from "./ActBridge";
import CtaFinale from "./CtaFinale";

/**
 * Cinematic homepage narrative — 5 acts woven into one stage.
 * Acts 1–2 share the sticky ambient stage from Index.tsx (transparent bg),
 * acts 3–5 layer onto solid backgrounds with bridges between them.
 */
export default function HomepageNarrative() {
  return (
    <main className="cinematic-home relative">
      {/* ACT I — HET PROBLEEM */}
      <Chapter01Scenario />
      <ActBridge text="Niet één campagne. Maar één systeem dat élke dag signalen oppikt." />
      <Chapter02Context />

      {/* ACT II — DE METHODE */}
      <ActBridge text="Twee manieren om B2B-groei te realiseren. Eén lineair. Eén lerend." />
      <Chapter03TwoWays />
      <ActBridge text="Van commerciële context naar acht concrete stappen." />
      <Chapter04Methode />

      {/* ACT III — HET FUNDAMENT */}
      <ActBridge text="Eerst het brein. Daarna pas de beweging." />
      <Chapter05Brein />
      <Chapter06Blauwdruk />
      <ActBridge text="Een systeem schaalt anders dan een campagne. Reken even mee." />
      <Chapter07Schaal />

      {/* ACT IV — DE OPERATIE */}
      <ActBridge text="Van impressies naar engagement, naar deals." />
      <Chapter08Funnel />
      <ActBridge text="Modules creëren engagement. Routing maakt er actie van." />
      <Chapter09Modules />
      <ActBridge text="Geleverd waar uw teams al werken." />
      <Chapter10Levering />

      {/* ACT V — DE BELOFTE */}
      <ActBridge text="Eenmaal verbonden, niet meer opnieuw beginnen." />
      <Chapter11Bewegingen />

      {/* FINALE */}
      <CtaFinale />
    </main>
  );
}