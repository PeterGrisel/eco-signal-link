import { Button } from "./Button";
import { Reveal } from "./Reveal";
import { Section } from "./Section";
import { SectionHeader } from "./SectionHeader";
import { GROEIPLAN_STAPPEN } from "@/data/breinAanpak";

/**
 * Het groeiplan als terugkerende call-to-action. Elk traject begint hier, dus
 * dit blok mag op elke pagina staan waar een bezoeker een volgende stap zoekt.
 */
export function GroeiplanCta({ tone = "deep" }: { tone?: "deep" | "mist" | "paper" }) {
  const deep = tone === "deep";
  return (
    <Section tone={tone} id="groeiplan">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
        <SectionHeader
          deep={deep}
          eyebrow="Het groeiplan"
          title="Begin bij het groeiplan."
          lead="Negen vakken. Drie fases. Het hele commerciële verhaal van uw bedrijf op één A4. Elk traject start hier."
        />
        <div className="lg:pb-11">
          <ol className="grid gap-[10px] sm:grid-cols-3">
            {GROEIPLAN_STAPPEN.map((s, i) => (
              <Reveal key={s.stap} index={i} className="h-full">
                <li
                  className={`flex h-full flex-col rounded-brand border px-4 py-4 ${
                    deep ? "border-white/[.14]" : "border-brand-line bg-brand-paper"
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] font-bold uppercase tracking-[0.18em] ${
                      deep ? "text-brand-accent" : "text-brand-accent-ink"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-1 font-display text-[15px] font-bold">{s.stap}</span>
                  <span className={`mt-1 text-[12.5px] leading-snug ${deep ? "text-[#A99F93]" : "text-brand-ink-2"}`}>
                    {s.uitleg}
                  </span>
                </li>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-6">
            <Button href="/groeiplan#invullen">Maak uw groeiplan</Button>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
