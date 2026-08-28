/** Accentband met doorlopende tekst, licht gedraaid. Pure CSS-loop. */
export function Marquee({
  items,
  angle = -1.2,
}: {
  items: string[];
  angle?: number;
}) {
  const group = (hidden: boolean) => (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-7">{item}</span>
          <span aria-hidden className="size-1.5 rounded-full bg-brand-ground/60" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="overflow-x-clip bg-brand-ground py-5" aria-label={items.join(" · ")}>
      <div
        className="bg-brand-accent py-3 text-brand-ground"
        style={{ transform: `rotate(${angle}deg) scale(1.02)` }}
      >
        <div className="v2-marquee-track flex w-max font-display text-lg font-bold uppercase tracking-tight">
          {group(false)}
          {group(true)}
        </div>
      </div>
    </div>
  );
}
