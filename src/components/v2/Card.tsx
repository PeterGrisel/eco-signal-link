import { Link } from "react-router-dom";

/** Kaart met accentbalk bovenaan. `highlight` maakt die balk accentkleurig. */
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
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-brand-line bg-brand-surface">
      <span
        aria-hidden
        className={`h-[3px] w-full ${highlight ? "bg-brand-accent" : "bg-brand-ink-3/45"}`}
      />
      <div className="flex grow flex-col px-6 pb-7 pt-6">
        <span className="mb-3 block font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-accent-ink">
          {label}
        </span>
        <h3 className="mb-2 font-display text-lg font-semibold leading-snug tracking-tight text-brand-ink">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-brand-ink-2">{children}</p>
        {href && (
          <Link
            to={href}
            className="mt-auto inline-flex items-center gap-1.5 pt-5 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-accent-ink transition-colors duration-200 hover:text-brand-accent-2"
          >
            {linkLabel} <span aria-hidden>→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
