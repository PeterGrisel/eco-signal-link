/**
 * Sectielabel: vier korte staafjes plus een mono-label in kapitalen, zoals in
 * vidai-fctry. Op wit gebruiken we het diepere oranje, omdat het merkoranje
 * daar te weinig contrast houdt voor tekst van tien pixels.
 */
export function Eyebrow({
  children,
  tone = "paper",
}: {
  children: React.ReactNode;
  tone?: "paper" | "deep";
}) {
  const tekst = tone === "deep" ? "text-brand-accent" : "text-brand-accent-ink";
  const staaf = tone === "deep" ? "bg-brand-accent" : "bg-brand-accent-ink";
  return (
    <div
      className={`mb-[18px] flex items-center gap-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] ${tekst}`}
    >
      <span aria-hidden className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className={`h-[9px] w-[3px] ${staaf}`} />
        ))}
      </span>
      {children}
    </div>
  );
}
