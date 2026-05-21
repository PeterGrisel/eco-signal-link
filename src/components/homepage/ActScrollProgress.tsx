import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

interface Act {
  id: string;
  label: string;
}

export default function ActScrollProgress({ acts }: { acts: Act[] }) {
  const [activeId, setActiveId] = useState<string>(acts[0]?.id ?? "");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

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
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[60] h-0.5 bg-foreground/10">
        <motion.div
          className="h-full bg-primary origin-left"
          style={{ scaleX: progress }}
        />
      </div>

      {/* Desktop side rail */}
      <nav
        aria-label="Hoofdstukken"
        className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-4"
      >
        {/* Spring rail */}
        <div className="absolute right-1.5 top-0 bottom-0 w-px bg-foreground/10 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-primary origin-top h-full"
            style={{ scaleY: progress }}
          />
        </div>

        {acts.map((a) => {
          const active = a.id === activeId;
          return (
            <a
              key={a.id}
              href={`#${a.id}`}
              className="group relative flex items-center gap-3 justify-end pr-4"
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
                className={`relative h-2 w-2 rounded-full border transition-all duration-300 ${
                  active
                    ? "bg-primary border-primary scale-125"
                    : "bg-background border-foreground/30 group-hover:border-primary/60"
                }`}
              />
            </a>
          );
        })}
      </nav>
    </>
  );
}