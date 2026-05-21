import Chapter01Scenario from "./chapters/Chapter01Scenario";
import Chapter02Context from "./chapters/Chapter02Context";
import Chapter03TwoWays from "./chapters/Chapter03TwoWays";
import Chapter04Schaal from "./chapters/Chapter04Schaal";
import Chapter05Aanpak from "./chapters/Chapter05Aanpak";

export default function HomepageNarrative() {
  return (
    <main className="relative">
      <div
        aria-hidden
        className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-foreground/5 to-transparent pointer-events-none"
      />
      <Chapter01Scenario />
      <Chapter02Context />
      <Chapter03TwoWays />
      <Chapter04Schaal />
      <Chapter05Aanpak />
    </main>
  );
}