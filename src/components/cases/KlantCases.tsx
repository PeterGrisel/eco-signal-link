import { useState } from "react";
import { Reveal } from "@/components/v2/Reveal";
import { Section } from "@/components/v2/Section";
import { SectionHeader } from "@/components/v2/SectionHeader";
import { KLANT_CASES, type KlantCase } from "@/data/klantCases";

/**
 * Klantcases als bewijs bij het aanbod. Zonder `dienst` alle cases, met
 * `dienst` alleen de cases die bij die dienstpagina passen.
 */
export function KlantCases({
  dienst,
  tone = "paper",
  title = "Wat het brein bij klanten doet.",
}: {
  dienst?: string;
  tone?: "paper" | "mist";
  title?: string;
}) {
  const cases = dienst ? KLANT_CASES.filter((c) => c.diensten.includes(dienst)) : KLANT_CASES;
  if (cases.length === 0) return null;

  return (
    <Section tone={tone} id="cases">
      <SectionHeader eyebrow="Klantcases" title={title} />
      <div className="mt-8 grid gap-[18px] lg:grid-cols-2">
        {cases.map((c, i) => (
          <Reveal key={c.company} index={i} className="h-full">
            <CaseKaart c={c} tone={tone} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function CaseKaart({ c, tone }: { c: KlantCase; tone: "paper" | "mist" }) {
  const kaart = tone === "mist" ? "bg-brand-paper" : "bg-brand-mist";
  // Laadt een extern logo niet, dan tonen we de naam in plaats van een kapot plaatje.
  const [logoFout, setLogoFout] = useState(false);
  return (
    <article className={`flex h-full flex-col rounded-brand border border-brand-line p-6 md:p-7 ${kaart}`}>
      <div className="mb-5 flex items-center justify-between gap-4">
        {c.woordmerk && logoFout ? (
          <span className="font-display text-[17px] font-bold tracking-[-0.01em]">{c.company}</span>
        ) : c.woordmerk ? (
          <img
            src={c.logo}
            alt={c.company}
            loading="lazy"
            onError={() => setLogoFout(true)}
            className="h-6 w-auto max-w-[150px] object-contain"
          />
        ) : (
          <span className="flex items-center gap-3">
            <img src={c.logo} alt="" loading="lazy" className="size-10 object-contain" />
            <span className="font-display text-[17px] font-bold tracking-[-0.01em]">{c.company}</span>
          </span>
        )}
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
          {c.sector}
        </span>
      </div>
      <h3 className="mb-2 font-display text-xl font-bold leading-tight tracking-[-0.015em] md:text-2xl">{c.title}</h3>
      <p className="mb-6 text-[14px] leading-relaxed text-brand-ink-2">{c.body}</p>
      <dl className="mt-auto grid grid-cols-3 gap-2">
        {c.metrics.map((m) => (
          <div key={m.label} className="min-w-0 rounded-brand border border-brand-line bg-white/60 px-2.5 py-3 sm:px-3">
            <dt className="text-[11px] leading-tight text-brand-ink-3">{m.label}</dt>
            <dd className="mt-1 font-display text-[16px] font-black leading-none tracking-[-0.02em] sm:text-xl">{m.value}</dd>
            <dd className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-brand-accent-ink">{m.delta}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
