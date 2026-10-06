import { Link } from "react-router-dom";
import { Reveal } from "@/components/v2/Reveal";
import { Section } from "@/components/v2/Section";
import { SectionHeader } from "@/components/v2/SectionHeader";
import { Film } from "./Film";

/**
 * De werkomgeving als hero van de homepage.
 *
 * De bezoeker ziet meteen hoe het eruitziet: het filmpje van de draaiende
 * engine, met een doorverwijzing naar de Groeistack. Staat bovenaan, dus de
 * titel is de H1 van de pagina.
 */
export function WerkomgevingSectie() {
  return (
    <Section id="werkomgeving" tone="deep" fill>
      <SectionHeader
        deep
        titleAs="h1"
        eyebrow="Zo ziet het eruit"
        title="Een Commercieel Brein dat zoekt, rapporteert, plant en uitvoert."
        lead="Eén werkomgeving voor uw bronnen, tools en proces. Het systeem vindt kansen, voert taken uit en houdt alles bij. Zo wordt elke kans een afspraak."
      />

      <Film />

      <Reveal className="mt-8 flex justify-end">
        <Link
          to="/groeistack"
          className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-brand-accent transition-colors duration-[180ms] hover:text-brand-accent-2"
        >
          Bekijk alle tools <span aria-hidden>→</span>
        </Link>
      </Reveal>
    </Section>
  );
}
