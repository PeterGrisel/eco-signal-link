import { Container } from "./Container";

/**
 * Volle-breedte kleurbaan met de content in de 1200px-wrap.
 *
 * De site staat op warm papier, dus het ritme loopt van licht naar warm en
 * één keer volledig omgekeerd:
 *  - `ground`  #FBF8F4, het basispapier
 *  - `surface` #F4EBE0, een warm getint vlak dat het oranje ambient maakt
 *  - `invert`  #17140F met lichte inkt, de zwarte accentband
 *
 * `fill` centreert de inhoud verticaal in vrijwel de hele viewport.
 */
type Tone = "ground" | "surface" | "invert";

const tones: Record<Tone, string> = {
  ground: "bg-brand-ground text-brand-ink",
  surface: "bg-brand-surface text-brand-ink",
  invert: "bg-brand-deep text-brand-ground",
};

export function Section({
  tone = "ground",
  fill = false,
  id,
  className = "",
  children,
}: {
  tone?: Tone;
  fill?: boolean;
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`${tones[tone]} ${
        fill
          ? "flex min-h-[85svh] flex-col justify-center py-16"
          : "py-20 md:py-24"
      } ${className}`}
    >
      <Container>{children}</Container>
    </section>
  );
}
