import { Container } from "./Container";

/**
 * Volle-breedte kleurbaan met de content in de 1200px-wrap.
 *
 * Drie tonen, net als vidai-fctry, maar in de kleuren van B2B Groeimachine:
 *  - `paper` wit, de standaardgrond
 *  - `mist`  warm getint vlak voor de afwisseling
 *  - `deep`  de donkere accentband, spaarzaam gebruiken
 *
 * `fill` centreert de inhoud verticaal in vrijwel de hele viewport.
 */
type Tone = "paper" | "mist" | "deep";

const tones: Record<Tone, string> = {
  paper: "bg-brand-paper text-brand-ink",
  mist: "bg-brand-mist text-brand-ink",
  deep: "bg-brand-deep text-white",
};

export function Section({
  tone = "paper",
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
          ? "flex min-h-[85svh] flex-col justify-center py-14 lg:min-h-[calc(100svh-63px)]"
          : "py-14 lg:py-[82px]"
      } ${className}`}
    >
      <Container>{children}</Container>
    </section>
  );
}
