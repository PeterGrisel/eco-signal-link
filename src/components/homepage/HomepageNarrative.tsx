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
        Dit overkomt bijna elk B2B-bedrijf. Het verschil zit in hoe u er morgen mee omgaat.
      </NarrativeTransition>

      {/* 2. DROOM — het contrast */}
      <Chapter03TwoWays />

      <NarrativeTransition>
        Dit is geen theorie. Zo ziet de uitkomst eruit in cijfers.
      </NarrativeTransition>

      {/* 3. BEWIJS VAN DE DROOM — meetbaar maken */}
      <Chapter07Schaal />

      <NarrativeTransition>
        Hoe komt u daar? Niet met meer outreach. Met een ander fundament.
      </NarrativeTransition>

      {/* 4. FUNDAMENT — het brein */}
      <Chapter05Brein />

      <NarrativeTransition>
        Het brein heeft een methode nodig. Acht stappen, één route.
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