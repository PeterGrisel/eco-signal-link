import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";

/** Het vaste kopje van elke sectie: label, H2 en een lead van maximaal 62 tekens breed. */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  invert = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  invert?: boolean;
}) {
  return (
    <Reveal>
      <Eyebrow tone={invert ? "ground" : "accent"}>{eyebrow}</Eyebrow>
      <h2 className="mb-4 max-w-[20ch] font-display text-[length:var(--v2-h2)] font-bold leading-[1.14] tracking-tight">
        {title}
      </h2>
      {lead && (
        <p
          className={`mb-12 max-w-[62ch] text-[15.5px] leading-relaxed ${
            invert ? "text-brand-ground/70" : "text-brand-ink-2"
          }`}
        >
          {lead}
        </p>
      )}
    </Reveal>
  );
}
