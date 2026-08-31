import { Link } from "react-router-dom";

/** Kaart met accentbalk bovenaan; `highlight` maakt die balk oranje. */
export function Card({
  label,
  title,
  highlight = false,
  href,
  linkLabel = "Lees meer",
  children,
}: {
  label: string;
  title: string;
  highlight?: boolean;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-brand border border-brand-line bg-brand-paper">
      <span
        aria-hidden
        className={`h-[3px] w-full ${highlight ? "bg-brand-accent" : "bg-brand-ink"}`}
      />
      <div className="flex grow flex-col px-6 pb-7 pt-[23px]">
        <span className="mb-3 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
          {label}
        </span>
        <h3 className="mb-2 font-display text-lg font-bold leading-snug tracking-[-0.015em] text-brand-ink">
          {title}
        </h3>
        <p className="text-[13.5px] text-brand-ink-2">{children}</p>
        {href && (
          <Link
            to={href}
            className="mt-auto inline-flex items-center gap-1.5 pt-4 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-accent-ink transition-colors duration-[180ms] hover:text-brand-accent"
          >
            {linkLabel} <span aria-hidden>→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
