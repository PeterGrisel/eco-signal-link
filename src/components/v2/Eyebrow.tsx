/**
 * Sectielabel uit het brandbook: streepje van 20px plus een uppercase label in
 * Space Grotesk met tracking 0.14em.
 */
export function Eyebrow({
  children,
  tone = "accent",
}: {
  children: React.ReactNode;
  tone?: "accent" | "ground";
}) {
  const color = tone === "ground" ? "text-brand-ground" : "text-brand-accent";
  const rule = tone === "ground" ? "bg-brand-ground" : "bg-brand-accent";
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
