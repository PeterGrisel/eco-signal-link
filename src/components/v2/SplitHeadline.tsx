import { Fragment } from "react";

type Segment = { text: string; accent?: boolean };

/**
 * Kop die per letter inrolt. Puur CSS: elke letter krijgt een `--i`-index die
 * de animation-delay staffelt, dus de reveal eindigt ook zonder JS in
 * zichtbare staat. De visuele spans zijn aria-hidden; geef de leesbare tekst
 * mee via `aria-label` op de kop zelf.
 */
export function splitHeadlineText(lines: Segment[][]): string {
  return lines.map((line) => line.map((s) => s.text).join(" ")).join(" ");
}

export function SplitHeadline({
  lines,
  className,
  accentClass = "text-brand-accent-ink",
}: {
  lines: Segment[][];
  className?: string;
  /** Op wit het diepere oranje, op de donkere band het merkoranje. */
  accentClass?: string;
}) {
  let i = 0;
  return (
    <span aria-hidden className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.map((seg, si) => {
            const words = seg.text.split(" ");
            return (
              <Fragment key={si}>
                {words.map((word, wi) => (
                  <Fragment key={wi}>
                    <span
                      className={`v2-rise-word${seg.accent ? ` ${accentClass}` : ""}`}
                    >
                      {Array.from(word).map((ch, ci) => (
                        <span
                          key={ci}
                          className="v2-rise-letter"
                          style={{ "--i": i++ } as React.CSSProperties}
                        >
                          {ch}
                        </span>
                      ))}
                    </span>
                    {wi < words.length - 1 ? " " : null}
                  </Fragment>
                ))}
                {si < line.length - 1 ? " " : null}
              </Fragment>
            );
          })}
        </span>
      ))}
    </span>
  );
}
