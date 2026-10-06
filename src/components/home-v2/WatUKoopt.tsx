import { Button } from "@/components/v2/Button";
import { Reveal } from "@/components/v2/Reveal";
import { Section } from "@/components/v2/Section";
import { SectionHeader } from "@/components/v2/SectionHeader";
import { MenuKaarten } from "@/components/prijzen/MenuKaarten";
import { CYCLUS } from "@/data/breinAanpak";

/**
 * Hoe we werken en wat het kost, in één oogopslag: het groeiplan als doel,
 * de cyclus die elk proces doorloopt, en de drie abonnementen. De volledige
 * uitleg staat op /pricing.
 */
export function WatUKoopt() {
  return (
    <Section id="prijzen" tone="mist" className="v2-gordijn">
      <SectionHeader
        eyebrow="Hoe we werken"
        title="Uw doel trekt. Het brein stuurt."
        lead="We beginnen bij uw groeiplan: één helder doel. Daarna pakken we uw commercie proces voor proces aan. Een volgend proces start pas als het vorige zich terugverdient. Eén vaste prijs, en de waarde stapelt."
      />

      <ol className="mb-[18px] grid gap-[10px] sm:grid-cols-2 lg:grid-cols-5">
        {CYCLUS.map((c, i) => (
          <Reveal key={c.stap} index={i} className="h-full">
            <li
              className={`flex h-full flex-col rounded-brand border px-5 py-4 ${
                i === CYCLUS.length - 1 ? "border-brand-accent bg-brand-tint" : "border-brand-line bg-brand-paper"
              }`}
            >
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-1.5 font-display text-[15px] font-bold tracking-[-0.01em]">{c.stap}</span>
              <span className="mt-1 text-[12.5px] leading-snug text-brand-ink-2">{c.uitleg}</span>
            </li>
          </Reveal>
        ))}
      </ol>

      <MenuKaarten />

      <Reveal className="mt-10 flex flex-wrap items-center gap-3">
        <Button href="/pricing" variant="outline">
          Zo werkt de prijs
        </Button>
      </Reveal>
    </Section>
  );
}
