import { ReactNode } from "react";

interface BentoItem {
  title: string;
  pitch: string;
  body: string;
  icon: ReactNode;
  href: string;
  cta: string;
  span?: "wide" | "normal";
  eyebrow?: string;
}

interface Props {
  items: BentoItem[];
}

const BentoGrid = ({ items }: Props) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[minmax(220px,auto)]">
    {items.map((it) => (
      <a
        key={it.title}
        href={it.href}
        className={`group relative card-gradient border-glow rounded-2xl p-6 md:p-7 flex flex-col transition-transform hover:-translate-y-1 ${
          it.span === "wide" ? "md:col-span-2 md:row-span-2" : ""
        }`}
      >
        {it.eyebrow && (
          <p className="text-[10px] font-display font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-3">
            {it.eyebrow}
          </p>
        )}
        <div className="flex items-center gap-3 mb-4">
          <span className="w-10 h-10 rounded-lg border border-primary/30 bg-card flex items-center justify-center">
            {it.icon}
          </span>
          <h3 className="font-display font-bold text-xl md:text-2xl">{it.title}</h3>
        </div>
        <p className="text-primary font-semibold text-sm mb-2">{it.pitch}</p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">{it.body}</p>
        <span className="mt-auto inline-flex items-center gap-2 text-primary font-medium text-sm transition-all group-hover:gap-3">
          {it.cta}
          <span aria-hidden>→</span>
        </span>
      </a>
    ))}
  </div>
);

export default BentoGrid;