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
          <span aria-hidden className="size-2 rounded-full bg-brand-ink/70" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="overflow-x-clip bg-brand-deep py-4" aria-label={items.join(" · ")}>
      <div
        className="bg-brand-accent py-3 text-brand-ink"
        style={{ transform: `rotate(${angle}deg) scale(1.02)` }}
      >
        <div className="v2-marquee-track flex w-max font-display text-[21px] font-black uppercase tracking-[-0.02em]">
          {group(false)}
          {group(true)}
        </div>
      </div>
    </div>
  );
}
