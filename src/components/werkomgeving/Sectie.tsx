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
        title={
          <>
            U kijkt mee in de motorkap.
            <br className="hidden sm:block" /> Van vraag tot afspraak.
          </>
        }
        lead="Wij richten voor u een werkomgeving in waarin uw bronnen, uw CRM en het redeneren bij elkaar komen. U stelt er een vraag in gewone taal; er komen accounts uit met een reden en een aanbevolen actie."
      />

      <Film />

      <Reveal className="mt-8">
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
