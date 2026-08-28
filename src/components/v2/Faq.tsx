export type FaqItem = { question: string; answer: string };

/** FAQ-lijst met native <details>, dus toegankelijk en bruikbaar zonder JS. */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="border-t border-brand-line">
      {items.map((item) => (
        <details key={item.question} className="group border-b border-brand-line py-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[17px] font-semibold tracking-tight text-brand-ink [&::-webkit-details-marker]:hidden">
            {item.question}
            <span
              aria-hidden
              className="shrink-0 text-xl text-brand-accent transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-brand-ink-2">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
