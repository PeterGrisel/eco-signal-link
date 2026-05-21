"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardItem {
  id: string | number;
  title: string;
  description: string;
  icon: React.ReactNode;
  imgSrc?: string;
  eyebrow?: string;
}

interface ExpandingCardsProps extends React.HTMLAttributes<HTMLUListElement> {
  items: CardItem[];
  defaultActiveIndex?: number;
}

export const ExpandingCards = React.forwardRef<HTMLUListElement, ExpandingCardsProps>(
  ({ className, items, defaultActiveIndex = 0, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(defaultActiveIndex);
    const [isDesktop, setIsDesktop] = React.useState(false);

    React.useEffect(() => {
      const handle = () => setIsDesktop(window.innerWidth >= 768);
      handle();
      window.addEventListener("resize", handle);
      return () => window.removeEventListener("resize", handle);
    }, []);

    const gridStyle = React.useMemo(() => {
      const tracks = items
        .map((_, i) => (i === activeIndex ? "5fr" : "1fr"))
        .join(" ");
      return isDesktop
        ? { gridTemplateColumns: tracks }
        : { gridTemplateRows: tracks };
    }, [activeIndex, items.length, isDesktop]);

    return (
      <ul
        ref={ref}
        className={cn(
          "grid w-full gap-2 transition-[grid-template-columns,grid-template-rows] duration-500 ease-out",
          "grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(0,1fr))]",
          className,
        )}
        style={gridStyle}
        {...props}
      >
        {items.map((item, index) => {
          const active = activeIndex === index;
          return (
            <li
              key={item.id}
              data-active={active}
              tabIndex={0}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-foreground/10 bg-card/95 shadow-lg cursor-pointer outline-none",
                "transition-all duration-500 ease-out",
                "min-h-[120px] md:min-h-[420px]",
                "focus-visible:ring-2 focus-visible:ring-primary/60",
              )}
            >
              {/* Background: image or brand gradient */}
              {item.imgSrc ? (
                <div
                  className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${item.imgSrc})` }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-card to-card" />
              )}

              {/* Overlay */}
              <div
                className={cn(
                  "absolute inset-0 transition-opacity duration-500",
                  active
                    ? "bg-gradient-to-t from-background/95 via-background/70 to-background/20"
                    : "bg-gradient-to-t from-background/95 via-background/85 to-background/60",
                )}
              />

              {/* Eyebrow (step number) */}
              {item.eyebrow && (
                <div
                  className={cn(
                    "absolute top-4 left-4 z-10 font-display text-sm tabular-nums tracking-[0.2em] uppercase",
                    active ? "text-primary" : "text-primary/70",
                  )}
                >
                  {item.eyebrow}
                </div>
              )}

              {/* Vertical title (collapsed state, desktop) */}
              <div
                className={cn(
                  "hidden md:flex absolute inset-0 items-end justify-center pb-6 transition-opacity duration-300",
                  active ? "opacity-0" : "opacity-100",
                )}
              >
                <span
                  className="font-display text-sm md:text-base text-foreground/85 [writing-mode:vertical-rl] rotate-180 tracking-wide"
                >
                  {item.title}
                </span>
              </div>

              {/* Expanded content */}
              <div
                className={cn(
                  "absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-8 transition-all duration-500",
                  active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 md:opacity-0",
                )}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary mb-4">
                  {item.icon}
                </div>
                <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-2 leading-tight">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
                  {item.description}
                </p>
              </div>

              {/* Mobile collapsed title */}
              <div
                className={cn(
                  "md:hidden absolute inset-0 flex items-center px-5 transition-opacity duration-300",
                  active ? "opacity-0" : "opacity-100",
                )}
              >
                <span className="font-display text-base text-foreground/85 pl-16">
                  {item.title}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    );
  },
);
ExpandingCards.displayName = "ExpandingCards";