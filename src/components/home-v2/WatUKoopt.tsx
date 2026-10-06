import { Link } from "react-router-dom";
import { Button } from "@/components/v2/Button";
import { Reveal } from "@/components/v2/Reveal";
import { Section } from "@/components/v2/Section";
import { SectionHeader } from "@/components/v2/SectionHeader";
import { MenuKaarten } from "@/components/prijzen/MenuKaarten";
import { BREIN_DIENSTEN } from "@/data/breinDiensten";

/**
 * Wat u koopt, in één oogopslag: de vier diensten als ingang en de drie
 * menu's met prijs. De volledige rekensom en de rekenhulp staan op /pricing.
 */
export function WatUKoopt() {
  return (
    <Section id="prijzen" tone="mist" className="v2-gordijn">
      <SectionHeader
        eyebrow="Wat u koopt"
        title="Eén brein. Eén prijs, alles erin."
        lead="U betaalt een derde van wat het brein uw team aan uren bespaart. Onze uren, de tools en het beheer zitten erin. 90 dagen pilot, daarna maandelijks opzegbaar."
      />

      <div className="mb-[18px] grid gap-[10px] sm:grid-cols-2 lg:grid-cols-4">
        {BREIN_DIENSTEN.map((dienst, i) => (
          <Reveal key={dienst.slug} index={i} className="h-full">
            <Link
              to={`/diensten/${dienst.slug}`}
              className="group flex h-full items-start justify-between gap-3 rounded-brand border border-brand-line bg-brand-paper px-5 py-4 transition-colors duration-200 hover:border-brand-accent"
            >
              <span>
                <span className="block font-display text-[15px] font-bold tracking-[-0.01em]">{dienst.naam}</span>
                <span className="mt-1 block text-[12.5px] leading-snug text-brand-ink-2">{dienst.note}</span>
              </span>
              <span aria-hidden className="text-brand-ink-3 transition-colors group-hover:text-brand-accent-ink">
                ↗
              </span>
            </Link>
          </Reveal>
        ))}
      </div>

      <MenuKaarten />

      <Reveal className="mt-10 flex flex-wrap items-center gap-3">
        <Button href="/pricing" variant="outline">
          Zo is de prijs opgebouwd
        </Button>
        <Button href="/pricing#rekenhulp" variant="outline">
          Reken het uit voor uw team
        </Button>
      </Reveal>
    </Section>
  );
}
