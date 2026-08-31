/**
 * Reusachtig outline-woord dat met de scroll meedrijft. Plaats het in een
 * sectie met `relative overflow-hidden`; houd de dekking laag zodat het
 * atmosfeer blijft en geen tekst wordt.
 */
export function GiantWord({
  children,
  color = "rgba(255,255,255,0.07)",
  className = "",
}: {
  children: string;
  color?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`v2-giant-word pointer-events-none absolute select-none whitespace-nowrap font-display font-black leading-none tracking-[-0.05em] text-transparent ${className}`}
      style={{ WebkitTextStroke: `1.5px ${color}` }}
    >
      {children}
    </span>
  );
}
