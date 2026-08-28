/**
 * Sectielabel uit het brandbook: streepje van 20px plus een uppercase label in
 * Space Grotesk met tracking 0.14em.
 *
 * Op papier gebruiken we het diepere oranje, omdat het merkoranje daar te licht
 * is om als kleine tekst leesbaar te blijven. Op de zwarte accentband kan het
 * merkoranje zelf wel.
 */
export function Eyebrow({
  children,
  tone = "paper",
}: {
  children: React.ReactNode;
  tone?: "paper" | "onDark";
}) {
  const color = tone === "onDark" ? "text-brand-accent" : "text-brand-accent-ink";
  const rule = tone === "onDark" ? "bg-brand-accent" : "bg-brand-accent";
  return (
    <div className="mb-5 flex items-center gap-3">
      <span aria-hidden className={`h-px w-5 ${rule}`} />
      <span
        className={`font-display text-xs font-semibold uppercase tracking-[0.14em] ${color}`}
      >
        {children}
      </span>
    </div>
  );
}
