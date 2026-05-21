import { useEffect, useState } from "react";

interface Act {
  id: string;
  label: string;
}

export default function ActScrollProgress({ acts }: { acts: Act[] }) {
  const [activeId, setActiveId] = useState<string>(acts[0]?.id ?? "");

  useEffect(() => {
    const handler = () => {
      let current = acts[0]?.id ?? "";
      for (const a of acts) {
        const el = document.getElementById(a.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.4) current = a.id;
      }
      setActiveId(current);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [acts]);

  return (
    <nav
      aria-label="Hoofdstukken"
      className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-3"
    >
      {acts.map((a) => {
        const active = a.id === activeId;
        return (
          <a
            key={a.id}
            href={`#${a.id}`}
            className="group flex items-center gap-3 justify-end"
          >
            <span
              className={`text-[10px] uppercase tracking-[0.25em] transition-all duration-300 ${
                active
                  ? "text-primary opacity-100"
                  : "text-muted-foreground opacity-0 group-hover:opacity-100"
              }`}
            >
              {a.label}
            </span>
            <span
              className={`h-px transition-all duration-300 ${
                active ? "w-10 bg-primary" : "w-5 bg-foreground/20 group-hover:bg-foreground/40"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}