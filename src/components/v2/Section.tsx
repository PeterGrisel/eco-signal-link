import { Container } from "./Container";

/**
 * Volle-breedte kleurbaan met de content in de 1200px-wrap.
 *
 * De site staat op een donkere grond, dus het ritme loopt van donker naar
 * lichter en één keer volledig omgekeerd:
 *  - `ground`  #121212, de standaardgrond
 *  - `surface` #1A1A1A, een verhoogd vlak voor afwisseling
 *  - `invert`  het merkzand #EEEAE4 met donkere inkt, voor de zwaarste sectie
 *
 * `fill` centreert de inhoud verticaal in vrijwel de hele viewport.
 */
type Tone = "ground" | "surface" | "invert";

const tones: Record<Tone, string> = {
  ground: "bg-brand-ground text-brand-ink",
  surface: "bg-brand-surface text-brand-ink",
  invert: "bg-brand-paper text-brand-ground",
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
