import Chapter01Scenario from "./chapters/Chapter01Scenario";
import Chapter02Context from "./chapters/Chapter02Context";
import Chapter03TwoWays from "./chapters/Chapter03TwoWays";
import Chapter04Schaal from "./chapters/Chapter04Schaal";
import Chapter05Aanpak from "./chapters/Chapter05Aanpak";
import ActBridge from "./ActBridge";
import CtaFinale from "./CtaFinale";

/**
 * Cinematic homepage narrative — 5 acts woven into one stage.
 * Acts 1–2 share the sticky ambient stage from Index.tsx (transparent bg),
 * acts 3–5 layer onto solid backgrounds with bridges between them.
 */
export default function HomepageNarrative() {
  return (
    <main className="relative">
      {/* ACT 1 — Spanning */}
      <Chapter01Scenario />

      <ActBridge text="Niet één campagne. Maar één systeem dat élke dag signalen oppikt." />

      {/* ACT 2 — Onthulling */}
      <Chapter02Context />

      <ActBridge text="Eerst context. Daarna pas activiteit. Daar zit het verschil." />

      {/* ACT 3 — Bewijs (twee manieren) */}
      <Chapter03TwoWays />

      <ActBridge text="Een systeem schaalt anders dan een campagne. Reken even mee." />

      {/* ACT 4 — Schaal */}
      <Chapter04Schaal />

      <ActBridge text="U hoeft het niet alleen te bouwen. Twee paden. Eén start." />

      {/* ACT 5 — Belofte */}
      <Chapter05Aanpak />

      {/* FINALE */}
      <CtaFinale />
    </main>
  );
}