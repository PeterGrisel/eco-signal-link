import { Button } from "@/components/v2/Button";
import { Reveal } from "@/components/v2/Reveal";
import { Section } from "@/components/v2/Section";
import { SectionHeader } from "@/components/v2/SectionHeader";
import { MenuKaarten } from "@/components/prijzen/MenuKaarten";
import { CYCLUS } from "@/data/breinAanpak";

/**
 * Hoe we werken en wat het kost, in één oogopslag: het groeiplan als doel,
 * de cyclus van het brein, en de drie abonnementen. De volledige
 * uitleg staat op /pricing.
 */
export function WatUKoopt() {
  return (
    <Section id="prijzen" tone="mist" className="v2-gordijn">
      <SectionHeader
        eyebrow="Hoe we werken"
        title="Uw doel trekt. Het brein stuurt."
        lead="We beginnen bij uw groeiplan: één helder doel. Het brein helpt uw commercie te standaardiseren, te testen en makkelijk bij te sturen. Eén vaste prijs, alles erin."
      />

      <ol className="mb-[18px] grid gap-[10px] sm:grid-cols-2 lg:grid-cols-4">
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

      <Reveal className="mb-[18px]">
        <p className="rounded-brand border border-brand-line bg-brand-paper px-5 py-4 text-[14px] text-brand-ink-2">
          <b className="font-semibold text-brand-ink">AI zonder context snapt niet wat u doet.</b> Eén keer een
          leadlijst laten maken of een scraper laten bouwen telt niet op: morgen begint het weer bij nul. Het brein
          onthoudt uw doel, uw markt en alles wat getest is, en wordt daardoor elke maand slimmer.
        </p>
      </Reveal>

      <MenuKaarten />

      <Reveal className="mt-10 flex flex-wrap items-center gap-3">
        <Button href="/pricing" variant="outline">
          Zo werkt de prijs
        </Button>
      </Reveal>
    </Section>
  );
}
