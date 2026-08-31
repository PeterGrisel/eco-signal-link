import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";

/** Het vaste kopje van elke sectie: label, H2 en een lead. `deep` op de donkere band. */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  deep = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  deep?: boolean;
}) {
  return (
    <Reveal>
      <Eyebrow tone={deep ? "deep" : "paper"}>{eyebrow}</Eyebrow>
      <h2 className="mb-4 font-display text-[length:var(--v2-h2)] font-extrabold leading-[1.08] tracking-[-0.03em]">
        {title}
      </h2>
      {lead && (
        <p
          className={`mb-11 max-w-[62ch] text-[15.5px] ${deep ? "text-[#CBC3B8]" : "text-brand-ink-2"}`}
        >
          {lead}
        </p>
      )}
    </Reveal>
  );
}
