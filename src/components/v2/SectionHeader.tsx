import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";

/** Het vaste kopje van elke sectie: label, H2 en een lead. `deep` op de donkere band. */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  deep = false,
  titleAs: TitleTag = "h2",
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  deep?: boolean;
  /** "h1" voor de sectie die als hero bovenaan de pagina staat. */
  titleAs?: "h1" | "h2";
}) {
  return (
    <Reveal>
      <Eyebrow tone={deep ? "deep" : "paper"}>{eyebrow}</Eyebrow>
      <TitleTag className="mb-4 font-display text-[length:var(--v2-h2)] font-extrabold leading-[1.08] tracking-[-0.03em]">
        {title}
      </TitleTag>
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
