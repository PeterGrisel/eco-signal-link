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
import NarrativeTransition from "./NarrativeTransition";

/**
 * Cinematic homepage narrative — journey: pijn → droom → bewijs → methode → snelheid.
 * Tussen elk hoofdstuk staat een korte overgangsregel die de bezoeker meeneemt.
 */
export default function HomepageNarrative() {
  return (
    <main className="cinematic-home relative">
      {/* 1. PIJN — herkenning */}
      <Chapter01Scenario />

      <NarrativeTransition>
        Dit overkomt bijna elk B2B-bedrijf. Zo ziet de uitkomst eruit in cijfers.
      </NarrativeTransition>

      {/* 2. BEWIJS VAN DE DROOM — meetbaar maken */}
      <Chapter07Schaal />

      <NarrativeTransition>
        Hoe komt u daar? Niet met meer outreach. Met een ander fundament.
      </NarrativeTransition>

      {/* 3. FUNDAMENT — het brein */}
      <Chapter05Brein />

      <NarrativeTransition>
        De eerste stap van het brein: kiezen tussen de oude en de nieuwe manier.
      </NarrativeTransition>

      {/* 4. EERSTE STAP — het contrast */}
      <Chapter03TwoWays />

      <NarrativeTransition>
        Vanaf hier loopt de route. Acht stappen, één richting.
      </NarrativeTransition>

      {/* 5. METHODE — de route */}
      <Chapter04Methode />

      <NarrativeTransition>
        Stap één: uw beste klanten worden de blauwdruk.
      </NarrativeTransition>

      {/* 6. BLAUWDRUK + UITVOERING */}
      <Chapter06Blauwdruk />
      <Chapter08Funnel />
      <Chapter09Modules />

      <NarrativeTransition>
        Alles wat hierboven staat, levert u zonder nieuw systeem.
      </NarrativeTransition>

      {/* 7. SNELHEID — levering waar u al werkt */}
      <Chapter10Levering />

      {/* FINALE */}
      <CtaFinale />
    </main>
  );
}