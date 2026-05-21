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

      <ActBridge label="Onthulling" />

      {/* ACT 2 — Onthulling */}
      <Chapter02Context />

      <ActBridge label="Bewijs" />

      {/* ACT 3 — Bewijs (twee manieren) */}
      <Chapter03TwoWays />

      <ActBridge label="Schaal" />

      {/* ACT 4 — Schaal */}
      <Chapter04Schaal />

      <ActBridge label="Belofte" />

      {/* ACT 5 — Belofte */}
      <Chapter05Aanpak />

      {/* FINALE */}
      <CtaFinale />
    </main>
  );
}