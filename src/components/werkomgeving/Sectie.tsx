import { Link } from "react-router-dom";
import { Reveal } from "@/components/v2/Reveal";
import { Section } from "@/components/v2/Section";
import { SectionHeader } from "@/components/v2/SectionHeader";
import { Film } from "./Film";

/**
 * De werkomgeving op de homepage, direct onder de hero.
 *
 * De hero belooft een engine; hier ziet de bezoeker er meteen een draaien.
 * Kort gehouden: het filmpje en een doorverwijzing naar de Groeistack.
 */
export function WerkomgevingSectie() {
  return (
    <Section id="werkomgeving" tone="deep">
      <SectionHeader
        deep
        eyebrow="Zo ziet het eruit"
        title="Van vraag tot afspraak."
        lead="Wij ontwerpen en bouwen één werkomgeving voor uw bronnen, tools en proces. Het systeem werkt als uw commerciële brein. Het vindt kansen en voert taken uit. Zo worden kansen afspraken."
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
